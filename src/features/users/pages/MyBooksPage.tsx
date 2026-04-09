import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { borrowService, type TransactionResponse } from '@/features/borrowing/services/borrowService'
import { reservationService } from '@/features/reservations/services/reservationService'
import { RESERVATION_STATUS } from '@/features/reservations/types'
import type { ReservationResponse } from '@/features/reservations/types'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar, Clock, RotateCcw, BookOpen, Loader2, Trash2, CheckCircle2, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { LazyImage } from '@/components/ui/lazy-image'

const FALLBACK = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop'

export function MyBooksPage() {
  const qc = useQueryClient()
  const [returningIds, setReturningIds] = useState<Set<number>>(new Set())
  const [activeTab, setActiveTab] = useState('borrowed')

  const { data: borrowedRes, isLoading: l1 } = useQuery({
    queryKey: ['my-borrowed'],
    queryFn: () => borrowService.getMyBorrowings(0, 50),
    staleTime: 0,
    refetchOnMount: true,
  })
  const { data: historyRes, isLoading: l2 } = useQuery({
    queryKey: ['my-history'],
    queryFn: () => borrowService.getMyHistory(0, 50),
    staleTime: 0,
    refetchOnMount: true,
  })
  const { data: reservationsRes, isLoading: l3 } = useQuery({
    queryKey: ['my-reservations'],
    queryFn: () => reservationService.getMy(0, 50),
    staleTime: 0,
    refetchOnMount: true,
  })

  const returnMutation = useMutation({
    mutationFn: (id: number) => {
      setReturningIds(prev => new Set(prev).add(id))
      return borrowService.returnBook(id)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-borrowed'] })
      qc.invalidateQueries({ queryKey: ['my-history'] })
      qc.invalidateQueries({ queryKey: ['my-borrowings-active'] })
      qc.invalidateQueries({ queryKey: ['admin-borrows'] })
      toast.success('Book returned successfully!')
      // keep id in returningIds so button stays disabled until refetch removes the card
    },
    onError: (e: Error, id) => {
      setReturningIds(prev => { const s = new Set(prev); s.delete(id); return s })
      toast.error(e.message)
    },
  })

  const cancelMutation = useMutation({
    mutationFn: (id: number) => reservationService.cancel(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-reservations'] })
      toast.success('Reservation cancelled.')
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const loans: TransactionResponse[] = borrowedRes?.data?.content ?? []
  const history: TransactionResponse[] = historyRes?.data?.content ?? []
  const reservations: ReservationResponse[] = reservationsRes?.data?.content ?? []

  const activeRes = reservations.filter(r =>
    ([RESERVATION_STATUS.PENDING, RESERVATION_STATUS.APPROVED, RESERVATION_STATUS.READY] as string[]).includes(r.status)
  )
  const pastRes = reservations.filter(r =>
    ([RESERVATION_STATUS.COLLECTED, RESERVATION_STATUS.CANCELLED, RESERVATION_STATUS.EXPIRED] as string[]).includes(r.status)
  )

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Ready pickup alert */}
      {reservations.filter(r => r.status === RESERVATION_STATUS.READY).length > 0 && (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 px-4 py-3 flex items-center gap-3">
          <span className="text-2xl">📦</span>
          <div>
            <p className="font-bold text-emerald-800 text-sm">Book ready for pickup!</p>
            <p className="text-xs text-emerald-600">Visit the library counter to collect your reserved book.</p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Active Loans', value: loans.length, color: 'text-primary', tab: 'borrowed' },
          { label: 'Reservations', value: activeRes.length, color: 'text-amber-600', tab: 'reservations' },
          { label: 'Ready Pickup', value: reservations.filter(r => r.status === RESERVATION_STATUS.READY).length, color: 'text-emerald-600', tab: 'reservations' },
          { label: 'Returned', value: history.length, color: 'text-muted-foreground', tab: 'history' },
        ].map(s => (
          <div 
            key={s.label} 
            onClick={() => setActiveTab(s.tab)}
            className="rounded-2xl border bg-background/60 p-4 text-center shadow-sm cursor-pointer hover:bg-muted/50 transition-colors group"
          >
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">{s.label}</p>
            <p className={cn('text-3xl font-black mt-1', s.color)}>{s.value}</p>
          </div>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start bg-muted/30 rounded-2xl p-1.5 h-auto gap-1 flex-wrap">
          <TabsTrigger value="borrowed" className="rounded-xl px-5 py-2 font-bold">
            Borrowed {loans.length > 0 && <span className="ml-1 bg-primary text-white text-[10px] rounded-full px-1.5">{loans.length}</span>}
          </TabsTrigger>
          <TabsTrigger value="reservations" className="rounded-xl px-5 py-2 font-bold">
            Reservations {activeRes.length > 0 && <span className="ml-1 bg-amber-500 text-white text-[10px] rounded-full px-1.5">{activeRes.length}</span>}
          </TabsTrigger>
          <TabsTrigger value="history" className="rounded-xl px-5 py-2 font-bold">Returned ({history.length})</TabsTrigger>
        </TabsList>

        {/* BORROWED */}
        <TabsContent value="borrowed" className="mt-6">
          {l1 ? <GridSkeleton /> : loans.length === 0
            ? <Empty msg="No active loans" sub="Browse the catalog to borrow a book." />
            : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {loans.map(loan => {
                  const overdue = new Date(loan.dueDate) < new Date()
                  return (
                    <Card key={loan.id} className="border-none shadow-lg ring-1 ring-primary/5 rounded-2xl overflow-hidden">
                      <div className="relative h-44">
                        <LazyImage src={loan.coverImageUrl || FALLBACK} alt={loan.bookTitle} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
                        <div className="absolute bottom-3 left-3 right-3">
                          <p className="text-white font-black line-clamp-2 text-sm leading-tight">{loan.bookTitle}</p>
                          <p className="text-white/70 text-xs">{loan.bookAuthor}</p>
                        </div>
                        {overdue && <Badge className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-black">OVERDUE</Badge>}
                      </div>
                      <CardContent className="p-4 space-y-3">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-muted/30 rounded-xl p-2">
                            <p className="text-muted-foreground font-black uppercase tracking-wider text-[9px]">Issued</p>
                            <p className="font-bold flex items-center gap-1 mt-0.5"><Calendar className="h-3 w-3" />{new Date(loan.issueDate).toLocaleDateString()}</p>
                          </div>
                          <div className={cn('rounded-xl p-2', overdue ? 'bg-red-50' : 'bg-muted/30')}>
                            <p className="text-muted-foreground font-black uppercase tracking-wider text-[9px]">Due</p>
                            <p className={cn('font-bold flex items-center gap-1 mt-0.5', overdue && 'text-red-600')}><Clock className="h-3 w-3" />{new Date(loan.dueDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <Button size="sm" className="w-full h-9 font-bold rounded-xl"
                          onClick={() => returnMutation.mutate(loan.id)}
                          disabled={returningIds.has(loan.id) || loan.status === 'RETURN_REQUESTED'}
                          variant={loan.status === 'RETURN_REQUESTED' ? 'outline' : 'default'}
                        >
                          {returningIds.has(loan.id)
                            ? <><Loader2 className="h-4 w-4 animate-spin mr-1.5" />Requesting...</>
                            : loan.status === 'RETURN_REQUESTED'
                            ? <><Clock className="h-3.5 w-3.5 mr-1.5 text-amber-500" />Return Pending Admin</>
                            : <><RotateCcw className="h-3.5 w-3.5 mr-1.5" />Return Book</>}
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
        </TabsContent>

        {/* RESERVATIONS */}
        <TabsContent value="reservations" className="mt-6 space-y-3">
          {l3 ? <ListSkeleton /> : activeRes.length === 0
            ? <Empty msg="No active reservations" sub="Reserve a book from its detail page." />
            : activeRes.map(r => (
              <ReservationRow key={r.id} r={r}
                onCancel={() => cancelMutation.mutate(r.id)}
                cancelling={cancelMutation.isPending && cancelMutation.variables === r.id}
              />
            ))
          }
          {pastRes.length > 0 && (
            <div className="pt-4 space-y-2">
              <p className="text-xs font-black uppercase tracking-widest text-muted-foreground px-1">Past Reservations</p>
              {pastRes.map(r => <ReservationRow key={r.id} r={r} />)}
            </div>
          )}
        </TabsContent>

        {/* HISTORY */}
        <TabsContent value="history" className="mt-6 space-y-3">
          {l2 ? <ListSkeleton /> : history.length === 0
            ? <Empty msg="No borrowing history yet" />
            : history.map(loan => (
              <div key={loan.id} className="group relative flex items-center gap-5 p-5 rounded-3xl border bg-background/50 hover:bg-background/80 transition-all duration-300 shadow-sm hover:shadow-md border-border/40 overflow-hidden">
                <div className="relative h-24 w-16 shrink-0 rounded-xl overflow-hidden shadow-md group-hover:shadow-lg transition-all duration-300">
                  <LazyImage src={loan.coverImageUrl || FALLBACK} alt={loan.bookTitle} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <h3 className="font-bold text-sm sm:text-base text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-2 mb-1">
                    {loan.bookTitle}
                  </h3>
                  <p className="text-xs font-semibold text-muted-foreground/90 mb-3">{loan.bookAuthor}</p>
                  
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground uppercase tracking-wider bg-muted/40 px-2.5 py-1 rounded-full border border-border/50">
                      <Calendar className="h-3 w-3" />
                      {loan.returnDate ? 'Returned' : 'Due'}: {new Date(loan.returnDate || loan.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3 shrink-0">
                  <Badge variant="outline" className={cn('text-[10px] font-black px-3 py-1 rounded-full border-2 uppercase tracking-widest shadow-sm', 
                    loan.status === 'RETURNED' ? 'bg-emerald-50/80 text-emerald-700 border-emerald-100' : 'bg-rose-50/80 text-rose-700 border-rose-100')}>
                    {loan.status === 'RETURNED' ? <><CheckCircle2 className="h-3.5 w-3.5 mr-1.5 inline" />Returned</> : loan.status}
                  </Badge>
                  <Button variant="ghost" size="sm" asChild className="h-9 text-xs font-black rounded-xl px-4 hover:bg-primary/10 hover:text-primary transition-all active:scale-95 border border-transparent hover:border-primary/20">
                    <Link to={`/books/${loan.bookId}`}>View Details</Link>
                  </Button>
                </div>
              </div>
            ))
          }
        </TabsContent>
      </Tabs>
    </div>
  )
}

const STATUS_STYLE: Record<string, string> = {
  PENDING:   'bg-amber-500/10 text-amber-600 border-amber-500/20',
  APPROVED:  'bg-blue-500/10 text-blue-600 border-blue-500/20',
  READY:     'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  COLLECTED: 'bg-primary/10 text-primary border-primary/20',
  CANCELLED: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
  EXPIRED:   'bg-muted text-muted-foreground border-transparent',
}
const STATUS_LABEL: Record<string, string> = {
  PENDING: 'In Queue', APPROVED: 'Processing', READY: 'Ready for Pickup',
  COLLECTED: 'Collected', CANCELLED: 'Cancelled', EXPIRED: 'Expired',
}

function ReservationRow({ r, onCancel, cancelling }: { r: ReservationResponse; onCancel?: () => void; cancelling?: boolean }) {
  return (
    <div className="group flex items-center justify-between gap-5 p-5 rounded-3xl border bg-background/50 hover:bg-background/80 transition-all duration-300 shadow-sm hover:shadow-md border-border/40 overflow-hidden">
      <div className="flex-1 flex items-center gap-4 min-w-0">
        <div className="h-20 w-14 rounded-2xl bg-primary/5 flex items-center justify-center shrink-0 border-2 border-dashed border-primary/10 shadow-inner group-hover:bg-primary/10 group-hover:border-primary/20 transition-all duration-300">
          <BookOpen className="h-8 w-8 text-primary/30 group-hover:text-primary/50 group-hover:scale-110 transition-all duration-500" />
        </div>
        <div className="min-w-0 flex flex-col justify-center">
          <h3 className="font-bold text-sm sm:text-base text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-2 mb-1.5">
            {r.bookName}
          </h3>
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge variant="outline" className={cn('text-[10px] font-black border-2 rounded-full px-3 py-0.5 uppercase tracking-widest shadow-xs', STATUS_STYLE[r.status])}>
              {STATUS_LABEL[r.status] || r.status}
            </Badge>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground/70 bg-muted/40 px-2 py-0.5 rounded-full border border-border/30">
              <Calendar className="h-3 w-3" />
              {new Date(r.reservedAt).toLocaleDateString()}
            </div>
            {r.expiryDate && (
              <span className="text-[10px] font-black text-rose-500 bg-rose-50/80 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 border border-rose-100 shadow-xs animate-pulse-subtle">
                <AlertCircle className="h-3 w-3" />Expires: {new Date(r.expiryDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Button variant="ghost" size="sm" asChild className="h-10 text-xs font-black rounded-xl px-5 hover:bg-primary/10 hover:text-primary transition-all active:scale-95 border border-transparent hover:border-primary/20">
          <Link to={`/books/${r.bookId}`}>View Details</Link>
        </Button>
        {r.status === RESERVATION_STATUS.PENDING && onCancel && (
          <Button variant="ghost" size="icon" className="h-10 w-10 text-rose-500 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all active:scale-90" onClick={onCancel} disabled={cancelling}>
            {cancelling ? <Loader2 className="h-5 w-5 animate-spin" /> : <Trash2 className="h-5 w-5" />}
          </Button>
        )}
      </div>
    </div>
  )
}

function Empty({ msg, sub }: { msg: string; sub?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed rounded-2xl">
      <BookOpen className="h-10 w-10 text-muted-foreground/20 mb-3" />
      <p className="font-bold text-muted-foreground">{msg}</p>
      {sub && <p className="text-sm text-muted-foreground/60 mt-1">{sub}</p>}
      <Button asChild variant="outline" className="mt-4 font-bold rounded-xl" size="sm">
        <Link to="/search">Browse Catalog</Link>
      </Button>
    </div>
  )
}

function GridSkeleton() {
  return <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">{[1,2,3].map(i => <Skeleton key={i} className="h-64 rounded-2xl" />)}</div>
}
function ListSkeleton() {
  return <div className="space-y-4">{[1,2,3].map(i => <Skeleton key={i} className="h-28 rounded-3xl" />)}</div>
}
