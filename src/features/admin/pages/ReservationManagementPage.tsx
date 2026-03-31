import { useEffect, useMemo, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { reservationService } from '@/features/reservations/services/reservationService'
import type { ReservationResponse, ReservationStatus } from '@/features/reservations/types'
import { RESERVATION_STATUS } from '@/features/reservations/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import {
  CheckCircle2,
  Clock,
  Package,
  User,
  Book,
  Search,
  Loader2,
  CheckCheck,
  Calendar,
  Filter,
  ChevronRight,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type WorkflowTab = 'pending' | 'approved' | 'ready' | 'history'
type ReservationAction = 'approve' | 'ready' | 'collected'

export function ReservationManagementPage() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState<WorkflowTab>('pending')
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const { data: reservationsData, isLoading } = useQuery({
    queryKey: ['admin-reservations'],
    queryFn: () => reservationService.getAll(0, 100),
  })

  const reservations = reservationsData?.data?.content || []

  const updateMutation = useMutation({
    mutationFn: ({ id, action }: { id: number; action: ReservationAction }) => {
      switch (action) {
        case 'approve':
          return reservationService.approve(id)
        case 'ready':
          return reservationService.markReady(id)
        case 'collected':
          return reservationService.markCollected(id)
        default:
          throw new Error('Invalid action')
      }
    },
    onSuccess: (_, { action }) => {
      queryClient.invalidateQueries({ queryKey: ['admin-reservations'] })
      toast({
        title: 'Success',
        description: `Reservation ${action}d successfully.`,
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Update failed',
        description: error.message || 'Something went wrong.',
        variant: 'destructive',
      })
    },
  })

  const filteredReservations = useMemo(() => {
    return reservations.filter((reservation) =>
      reservation.bookName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.userName.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [reservations, searchTerm])

  const groupedReservations = {
    pending: filteredReservations.filter((reservation) => reservation.status === RESERVATION_STATUS.PENDING),
    approved: filteredReservations.filter((reservation) => reservation.status === RESERVATION_STATUS.APPROVED),
    ready: filteredReservations.filter((reservation) => reservation.status === RESERVATION_STATUS.READY),
    history: filteredReservations.filter(
      (reservation) =>
        reservation.status === RESERVATION_STATUS.COLLECTED ||
        reservation.status === RESERVATION_STATUS.CANCELLED ||
        reservation.status === RESERVATION_STATUS.EXPIRED
    ),
  }

  const visibleReservations = groupedReservations[activeTab]

  useEffect(() => {
    if (!visibleReservations.some((reservation) => reservation.id === selectedId)) {
      setSelectedId(visibleReservations[0]?.id ?? null)
    }
  }, [activeTab, selectedId, visibleReservations])

  const selectedReservation =
    visibleReservations.find((reservation) => reservation.id === selectedId) || visibleReservations[0] || null

  if (isLoading) return <LoadingSkeleton />

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
      <header className="flex flex-col gap-5 bg-background/60 backdrop-blur-xl p-8 rounded-[2.5rem] border shadow-2xl shadow-primary/5">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="space-y-1">
            <Badge variant="outline" className="px-3 py-1 rounded-full font-black tracking-widest text-primary border-primary/20 bg-primary/5">
              STAFF TERMINAL
            </Badge>
            <h1 className="text-4xl font-black tracking-tighter">Reservation Queue</h1>
            <p className="text-muted-foreground font-medium">Click a reservation to inspect it, then move it to the next status.</p>
          </div>

          <div className="grid grid-cols-3 gap-3 md:w-[360px]">
            <QueueMetric label="Pending" value={groupedReservations.pending.length} accent="text-amber-600" />
            <QueueMetric label="Ready" value={groupedReservations.ready.length} accent="text-emerald-600" />
            <QueueMetric label="History" value={groupedReservations.history.length} />
          </div>
        </div>

        <div className="relative group w-full md:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search book or user..."
            className="pl-10 h-12 bg-muted/30 border-none rounded-2xl focus:bg-background transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as WorkflowTab)} className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <TabsList className="bg-muted/30 p-1.5 rounded-2xl h-auto gap-1 flex-wrap">
            <TabsTrigger value="pending" className="rounded-xl px-6 py-2.5 font-bold data-[state=active]:bg-background data-[state=active]:shadow-lg">
              Pending ({groupedReservations.pending.length})
            </TabsTrigger>
            <TabsTrigger value="approved" className="rounded-xl px-6 py-2.5 font-bold data-[state=active]:bg-background data-[state=active]:shadow-lg">
              Processing ({groupedReservations.approved.length})
            </TabsTrigger>
            <TabsTrigger value="ready" className="rounded-xl px-6 py-2.5 font-bold data-[state=active]:bg-background data-[state=active]:shadow-lg">
              Ready ({groupedReservations.ready.length})
            </TabsTrigger>
            <TabsTrigger value="history" className="rounded-xl px-6 py-2.5 font-bold data-[state=active]:bg-background data-[state=active]:shadow-lg">
              History ({groupedReservations.history.length})
            </TabsTrigger>
          </TabsList>

          <Button variant="outline" size="icon" className="h-11 w-11 rounded-2xl border-2 shrink-0">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <TabsContent value={activeTab} className="mt-0">
          {visibleReservations.length === 0 ? (
            <EmptyState label={`No ${activeTab} reservations`} />
          ) : (
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.85fr]">
              <div className="grid gap-4">
                {visibleReservations.map((reservation) => (
                  <ReservationRow
                    key={reservation.id}
                    reservation={reservation}
                    selected={selectedReservation?.id === reservation.id}
                    onSelect={() => setSelectedId(reservation.id)}
                  />
                ))}
              </div>

              <ReservationInspector
                reservation={selectedReservation}
                isPending={updateMutation.isPending}
                onAction={(action) => {
                  if (!selectedReservation) return
                  updateMutation.mutate({ id: selectedReservation.id, action })
                }}
              />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function QueueMetric({ label, value, accent }: { label: string; value: number; accent?: string }) {
  return (
    <div className="rounded-2xl border border-primary/10 bg-background/80 p-4 text-center shadow-sm">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
      <p className={cn('mt-1 text-3xl font-black tracking-tight', accent)}>{value}</p>
    </div>
  )
}

function ReservationRow({
  reservation,
  selected,
  onSelect,
}: {
  reservation: ReservationResponse
  selected: boolean
  onSelect: () => void
}) {
  const statusTone = getStatusTone(reservation.status)

  return (
    <Card
      onClick={onSelect}
      className={cn(
        'group cursor-pointer border-none rounded-3xl overflow-hidden transition-all duration-300',
        'bg-background/60 backdrop-blur-xl shadow-lg ring-1',
        selected ? 'ring-primary/30 shadow-primary/10 scale-[1.01]' : 'ring-primary/5 hover:ring-primary/20'
      )}
    >
      <CardContent className="p-6 flex items-center justify-between gap-6">
        <div className="flex items-center gap-6 min-w-0">
          <div className="h-16 w-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary/50 group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
            <Book className="h-6 w-6" />
          </div>
          <div className="space-y-2 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className={cn('rounded-lg border font-black text-[10px] uppercase tracking-widest', statusTone.badge)}>
                {statusTone.label}
              </Badge>
              {selected && (
                <Badge variant="outline" className="rounded-lg border-primary/20 bg-primary/5 text-primary text-[10px] uppercase font-black tracking-widest">
                  Selected
                </Badge>
              )}
            </div>
            <h3 className="text-xl font-black tracking-tight truncate">{reservation.bookName}</h3>
            <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-muted-foreground/70 uppercase tracking-tighter">
              <span className="flex items-center gap-1"><User className="h-3 w-3" /> {reservation.userName}</span>
              <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(reservation.reservedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <ChevronRight className={cn('h-5 w-5 shrink-0 transition-transform', selected ? 'text-primary translate-x-1' : 'text-muted-foreground')} />
      </CardContent>
    </Card>
  )
}

function ReservationInspector({
  reservation,
  isPending,
  onAction,
}: {
  reservation: ReservationResponse | null
  isPending: boolean
  onAction: (action: ReservationAction) => void
}) {
  if (!reservation) {
    return (
      <Card className="border-none rounded-3xl bg-background/60 backdrop-blur-xl shadow-xl ring-1 ring-primary/5">
        <CardContent className="p-8 text-center text-muted-foreground">
          Select a reservation to inspect and update it.
        </CardContent>
      </Card>
    )
  }

  const nextAction = getNextAction(reservation.status)
  const statusTone = getStatusTone(reservation.status)

  return (
    <Card className="border-none rounded-3xl bg-background/70 backdrop-blur-xl shadow-2xl ring-1 ring-primary/10 h-fit sticky top-24">
      <CardContent className="p-8 space-y-6">
        <div className="space-y-3">
          <Badge className={cn('rounded-lg border font-black text-[10px] uppercase tracking-widest', statusTone.badge)}>
            {statusTone.label}
          </Badge>
          <h2 className="text-3xl font-black tracking-tight">{reservation.bookName}</h2>
          <p className="text-sm text-muted-foreground font-medium">
            Clicking a different reservation changes this panel immediately so staff can process each request one by one.
          </p>
        </div>

        <div className="grid gap-3">
          <InspectorRow label="Reservation ID" value={`RES-${reservation.id}`} />
          <InspectorRow label="User" value={reservation.userName} />
          <InspectorRow label="Book ID" value={String(reservation.bookId)} />
          <InspectorRow label="Reserved On" value={new Date(reservation.reservedAt).toLocaleString()} />
          <InspectorRow label="Expiry" value={reservation.expiryDate ? new Date(reservation.expiryDate).toLocaleString() : 'Not assigned'} />
        </div>

        {nextAction ? (
          <Button
            onClick={() => onAction(nextAction.action)}
            disabled={isPending}
            className="w-full h-12 rounded-xl font-black gap-2 shadow-xl shadow-primary/10"
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : nextAction.icon}
            {nextAction.label}
          </Button>
        ) : (
          <div className="rounded-2xl border border-primary/10 bg-muted/20 p-4 text-sm font-medium text-muted-foreground">
            This reservation is already in history, so no further workflow action is available.
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function InspectorRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-primary/5 bg-muted/20 px-4 py-3">
      <span className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
      <span className="text-sm font-bold text-right">{value}</span>
    </div>
  )
}

function getStatusTone(status: ReservationStatus) {
  switch (status) {
    case RESERVATION_STATUS.PENDING:
      return {
        label: 'Pending',
        badge: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
      }
    case RESERVATION_STATUS.APPROVED:
      return {
        label: 'Processing',
        badge: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      }
    case RESERVATION_STATUS.READY:
      return {
        label: 'Ready for Pickup',
        badge: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
      }
    case RESERVATION_STATUS.COLLECTED:
      return {
        label: 'Collected',
        badge: 'bg-primary/10 text-primary border-primary/20',
      }
    case RESERVATION_STATUS.CANCELLED:
      return {
        label: 'Cancelled',
        badge: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
      }
    default:
      return {
        label: 'Expired',
        badge: 'bg-muted text-muted-foreground border-transparent',
      }
  }
}

function getNextAction(status: ReservationStatus): { action: ReservationAction; label: string; icon: React.ReactNode } | null {
  switch (status) {
    case RESERVATION_STATUS.PENDING:
      return {
        action: 'approve',
        label: 'Approve Hold',
        icon: <CheckCircle2 className="h-4 w-4" />,
      }
    case RESERVATION_STATUS.APPROVED:
      return {
        action: 'ready',
        label: 'Mark Ready',
        icon: <Package className="h-4 w-4" />,
      }
    case RESERVATION_STATUS.READY:
      return {
        action: 'collected',
        label: 'Confirm Collection',
        icon: <CheckCheck className="h-4 w-4" />,
      }
    default:
      return null
  }
}

function LoadingSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-40 w-full rounded-[2.5rem]" />
      <Skeleton className="h-12 w-[500px] rounded-2xl" />
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.85fr]">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 w-full rounded-3xl" />
          ))}
        </div>
        <Skeleton className="h-[420px] w-full rounded-3xl" />
      </div>
    </div>
  )
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground bg-muted/5 rounded-[2.5rem] border-2 border-dashed">
      <Clock className="h-10 w-10 opacity-20 mb-4" />
      <p className="font-bold tracking-tight">{label}</p>
    </div>
  )
}
