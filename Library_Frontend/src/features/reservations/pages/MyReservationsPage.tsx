import { useMemo, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { reservationService } from '../services/reservationService'
import type { ReservationResponse, ReservationStatus } from '../types'
import { RESERVATION_STATUS } from '../types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import {
  Calendar,
  Clock,
  Trash2,
  BookOpen,
  AlertCircle,
  Loader2,
  ChevronRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

export function MyReservationsPage() {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<'all' | ReservationStatus>('all')
  const { data: reservationsData, isLoading } = useQuery({
    queryKey: ['my-reservations'],
    queryFn: () => reservationService.getMy(0, 50),
  })

  const reservations = reservationsData?.data?.content || []
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const cancelMutation = useMutation({
    mutationFn: (id: number) => reservationService.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-reservations'] })
      toast.success('Your reservation has been removed.')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'An unexpected error occurred.')
    },
  })

  const filteredReservations = useMemo(() => {
    if (activeTab === 'all') return reservations
    return reservations.filter((reservation) => reservation.status === activeTab)
  }, [activeTab, reservations])

  const selectedReservation =
    filteredReservations.find((reservation) => reservation.id === selectedId) || filteredReservations[0] || null

  const summary = {
    total: reservations.length,
    ready: reservations.filter((reservation) => reservation.status === RESERVATION_STATUS.READY).length,
    pending: reservations.filter((reservation) => reservation.status === RESERVATION_STATUS.PENDING).length,
  }

  if (isLoading) return <ReservationsSkeleton />

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <header className="rounded-[2rem] border border-primary/10 bg-linear-to-br from-primary/5 via-background to-blue-500/5 p-8 md:p-10 shadow-2xl shadow-primary/5">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <Badge variant="secondary" className="px-3 py-1 rounded-full font-black tracking-widest bg-primary/10 text-primary">
              MEMBER REPOSITORY
            </Badge>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter">My Reservations</h1>
            <p className="text-muted-foreground font-medium text-lg max-w-2xl">
              Track your queue, pickup-ready books, and reservation activity in one place.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 md:w-[360px]">
            <SummaryCard label="Total" value={summary.total} />
            <SummaryCard label="Ready" value={summary.ready} accent="text-emerald-600" />
            <SummaryCard label="Queued" value={summary.pending} accent="text-amber-600" />
          </div>
        </div>
      </header>

      {reservations.length === 0 ? (
        <Card className="border-2 border-dashed bg-muted/5 rounded-[2.5rem] p-20 text-center">
          <div className="bg-background w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl ring-1 ring-primary/5">
            <BookOpen className="h-10 w-10 text-muted-foreground/30" />
          </div>
          <h3 className="text-2xl font-black mb-2">No active reservations</h3>
          <p className="text-muted-foreground max-w-sm mx-auto mb-8 font-medium">
            Items you reserve will appear here. Start browsing our catalog to find your next read.
          </p>
          <Button asChild className="h-12 px-8 font-black rounded-xl">
            <Link to="/search">Explore Library</Link>
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'all' | ReservationStatus)} className="space-y-6">
            <TabsList className="h-auto flex-wrap gap-2 rounded-2xl bg-muted/30 p-2">
              <TabsTrigger value="all" className="rounded-xl px-5 py-2.5 font-bold">All ({reservations.length})</TabsTrigger>
              <TabsTrigger value={RESERVATION_STATUS.PENDING} className="rounded-xl px-5 py-2.5 font-bold">Pending</TabsTrigger>
              <TabsTrigger value={RESERVATION_STATUS.APPROVED} className="rounded-xl px-5 py-2.5 font-bold">Approved</TabsTrigger>
              <TabsTrigger value={RESERVATION_STATUS.READY} className="rounded-xl px-5 py-2.5 font-bold">Ready</TabsTrigger>
              <TabsTrigger value={RESERVATION_STATUS.COLLECTED} className="rounded-xl px-5 py-2.5 font-bold">Collected</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid gap-6 lg:grid-cols-[1.25fr_0.9fr]">
            <div className="grid gap-4">
              {filteredReservations.map((reservation) => (
                <ReservationCard
                  key={reservation.id}
                  reservation={reservation}
                  selected={selectedReservation?.id === reservation.id}
                  onSelect={() => setSelectedId(reservation.id)}
                  onCancel={() => cancelMutation.mutate(reservation.id)}
                  isCancelling={cancelMutation.isPending && cancelMutation.variables === reservation.id}
                />
              ))}
            </div>

            <ReservationDetails reservation={selectedReservation} />
          </div>
        </div>
      )}
    </div>
  )
}

function SummaryCard({ label, value, accent }: { label: string; value: number; accent?: string }) {
  return (
    <div className="rounded-2xl border border-primary/10 bg-background/80 p-4 text-center shadow-sm">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
      <p className={cn('mt-1 text-3xl font-black tracking-tight', accent)}>{value}</p>
    </div>
  )
}

function ReservationCard({
  reservation,
  selected,
  onSelect,
  onCancel,
  isCancelling,
}: {
  reservation: ReservationResponse
  selected: boolean
  onSelect: () => void
  onCancel: () => void
  isCancelling: boolean
}) {
  const config = getStatusConfig(reservation.status)

  return (
    <Card
      onClick={onSelect}
      className={cn(
        'group cursor-pointer border-none rounded-3xl overflow-hidden transition-all duration-300',
        'bg-background/60 backdrop-blur-xl shadow-xl ring-1',
        selected ? 'ring-primary/30 shadow-primary/10 scale-[1.01]' : 'ring-primary/5 hover:ring-primary/20'
      )}
    >
      <CardContent className="p-6 md:p-7">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-4 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className={cn('rounded-lg font-black text-[10px] uppercase tracking-tighter border', config.color)}>
                {config.icon && <span className="mr-1">{config.icon}</span>}
                {config.label}
              </Badge>
              {selected && (
                <Badge variant="outline" className="rounded-lg border-primary/20 bg-primary/5 text-primary text-[10px] uppercase font-black tracking-widest">
                  Selected
                </Badge>
              )}
              {reservation.expiryDate && (
                <Badge variant="outline" className="rounded-lg font-bold text-[10px] uppercase border-rose-500/20 text-rose-600 bg-rose-500/5">
                  <AlertCircle className="mr-1 h-3 w-3" />
                  Expires {new Date(reservation.expiryDate).toLocaleDateString()}
                </Badge>
              )}
            </div>

            <div>
              <h3 className="text-2xl font-black tracking-tight transition-colors group-hover:text-primary">
                {reservation.bookName}
              </h3>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-sm font-medium text-muted-foreground">
                <p className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 opacity-50" />
                  Requested {new Date(reservation.reservedAt).toLocaleDateString()}
                </p>
                <p className="uppercase text-[10px] tracking-widest font-black opacity-50">
                  ID: RES-{reservation.id}
                </p>
              </div>
            </div>
          </div>

          {reservation.status === RESERVATION_STATUS.PENDING && (
            <Button
              variant="ghost"
              size="icon"
              className="h-11 w-11 shrink-0 rounded-2xl text-rose-500 hover:bg-rose-500/10"
              onClick={(event) => {
                event.stopPropagation()
                onCancel()
              }}
              disabled={isCancelling}
            >
              {isCancelling ? <Loader2 className="h-5 w-5 animate-spin" /> : <Trash2 className="h-5 w-5" />}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function ReservationDetails({ reservation }: { reservation: ReservationResponse | null }) {
  if (!reservation) {
    return (
      <Card className="border-none rounded-3xl bg-background/60 backdrop-blur-xl shadow-xl ring-1 ring-primary/5">
        <CardContent className="p-8 text-center text-muted-foreground">
          Select a reservation to view its details.
        </CardContent>
      </Card>
    )
  }

  const config = getStatusConfig(reservation.status)

  return (
    <Card className="border-none rounded-3xl bg-background/70 backdrop-blur-xl shadow-2xl ring-1 ring-primary/10 h-fit sticky top-24">
      <CardContent className="p-8 space-y-6">
        <div className="space-y-3">
          <Badge className={cn('rounded-lg font-black text-[10px] uppercase tracking-widest border', config.color)}>
            {config.label}
          </Badge>
          <h2 className="text-3xl font-black tracking-tight">{reservation.bookName}</h2>
          <p className="text-sm text-muted-foreground font-medium">
            Click on any reservation card to switch this panel. The selected reservation updates here immediately.
          </p>
        </div>

        <div className="grid gap-3">
          <DetailRow label="Reservation ID" value={`RES-${reservation.id}`} />
          <DetailRow label="Book ID" value={String(reservation.bookId)} />
          <DetailRow label="Reserved On" value={new Date(reservation.reservedAt).toLocaleString()} />
          <DetailRow label="Status" value={config.label} />
          <DetailRow label="Expiry" value={reservation.expiryDate ? new Date(reservation.expiryDate).toLocaleString() : 'Not assigned yet'} />
        </div>

        <div className="rounded-2xl border border-primary/10 bg-primary/5 p-4">
          <p className="flex items-center gap-2 text-sm font-black text-primary">
            <Sparkles className="h-4 w-4" />
            Reservation Guidance
          </p>
          <p className="mt-2 text-sm text-muted-foreground font-medium leading-relaxed">
            Pending reservations are waiting in queue. Approved means staff is processing your request. Ready means you can collect the book before the expiry date.
          </p>
        </div>

        <Button asChild className="w-full h-12 rounded-xl font-black">
          <Link to={`/books/${reservation.bookId}`}>
            Open Book Page <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-primary/5 bg-muted/20 px-4 py-3">
      <span className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
      <span className="text-sm font-bold text-right">{value}</span>
    </div>
  )
}

function getStatusConfig(status: ReservationStatus) {
  switch (status) {
    case RESERVATION_STATUS.READY:
      return {
        color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
        label: 'Ready for Pickup',
        icon: <CheckCircle2 className="h-3 w-3" />,
      }
    case RESERVATION_STATUS.PENDING:
      return {
        color: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
        label: 'In Queue',
        icon: <Clock className="h-3 w-3" />,
      }
    case RESERVATION_STATUS.APPROVED:
      return {
        color: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
        label: 'Processing',
        icon: <Loader2 className="h-3 w-3 animate-spin" />,
      }
    case RESERVATION_STATUS.COLLECTED:
      return {
        color: 'bg-primary/10 text-primary border-primary/20',
        label: 'Collected',
        icon: <BookOpen className="h-3 w-3" />,
      }
    case RESERVATION_STATUS.CANCELLED:
      return {
        color: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
        label: 'Cancelled',
        icon: <Trash2 className="h-3 w-3" />,
      }
    default:
      return {
        color: 'bg-muted text-muted-foreground border-transparent',
        label: status,
        icon: null,
      }
  }
}

function ReservationsSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-8">
      <Skeleton className="h-48 w-full rounded-[2rem]" />
      <Skeleton className="h-14 w-full rounded-2xl" />
      <div className="grid gap-6 lg:grid-cols-[1.25fr_0.9fr]">
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40 w-full rounded-3xl" />
          ))}
        </div>
        <Skeleton className="h-[420px] w-full rounded-3xl" />
      </div>
    </div>
  )
}
