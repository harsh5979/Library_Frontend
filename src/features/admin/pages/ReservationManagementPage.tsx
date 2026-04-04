import { useMemo, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { reservationService } from '@/features/reservations/services/reservationService'
import type { ReservationResponse } from '@/features/reservations/types'
// import { RESERVATION_STATUS } from '@/features/reservations/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from 'sonner'
import { Search, CheckCircle2, Package, CheckCheck, Loader2, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

type ReservationAction = 'approve' | 'ready' | 'collected'

const STATUS_BADGE: Record<string, string> = {
  PENDING:   'bg-amber-100 text-amber-700 border-amber-200',
  APPROVED:  'bg-blue-100 text-blue-700 border-blue-200',
  READY:     'bg-emerald-100 text-emerald-700 border-emerald-200',
  COLLECTED: 'bg-gray-100 text-gray-500 border-gray-200',
  CANCELLED: 'bg-red-100 text-red-600 border-red-200',
  EXPIRED:   'bg-gray-100 text-gray-400 border-gray-200',
}

const NEXT: Record<string, { action: ReservationAction; label: string; icon: React.ReactNode; cls: string } | null> = {
  PENDING:  { action: 'approve',   label: 'Approve',    icon: <CheckCircle2 className="size-3" />, cls: 'border-blue-300 text-blue-700 hover:bg-blue-50' },
  APPROVED: { action: 'ready',     label: 'Mark Ready', icon: <Package className="size-3" />,      cls: 'border-emerald-300 text-emerald-700 hover:bg-emerald-50' },
  READY:    { action: 'collected', label: 'Issue Book', icon: <CheckCheck className="size-3" />,   cls: 'border-primary/40 text-primary hover:bg-primary/5' },
}

export function ReservationManagementPage() {
  const qc = useQueryClient()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

  const { data, isLoading } = useQuery({
    queryKey: ['admin-reservations'],
    queryFn: () => reservationService.getAll(0, 500),
    refetchInterval: 30_000,
  })

  const mutation = useMutation({
    mutationFn: ({ id, action }: { id: number; action: ReservationAction }) => {
      if (action === 'approve') return reservationService.approve(id)
      if (action === 'ready')   return reservationService.markReady(id)
      return reservationService.markCollected(id)
    },
    onSuccess: (_, { action }) => {
      qc.invalidateQueries({ queryKey: ['admin-reservations'] })
      if (action === 'collected') {
        qc.invalidateQueries({ queryKey: ['admin-borrows'] })
        qc.invalidateQueries({ queryKey: ['my-borrowed'] })
        qc.invalidateQueries({ queryKey: ['my-borrowings-active'] })
      }
      toast.success(action === 'collected' ? 'Book issued to user.' : `Reservation ${action}d.`)
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const all: ReservationResponse[] = useMemo(() => data?.data?.content ?? [], [data])

  const counts = useMemo(() => ({
    PENDING:  all.filter(r => r.status === 'PENDING').length,
    APPROVED: all.filter(r => r.status === 'APPROVED').length,
    READY:    all.filter(r => r.status === 'READY').length,
  }), [all])

  const filtered = useMemo(() => all
    .filter(r => {
      const matchSearch = !search ||
        r.bookName.toLowerCase().includes(search.toLowerCase()) ||
        r.userName.toLowerCase().includes(search.toLowerCase())
      const matchStatus = statusFilter === 'ALL' || r.status === statusFilter
      return matchSearch && matchStatus
    })
    .sort((a, b) => new Date(b.reservedAt).getTime() - new Date(a.reservedAt).getTime())
  , [all, search, statusFilter])

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reservation Queue</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {counts.PENDING} pending · {counts.APPROVED} processing · {counts.READY} ready for pickup
        </p>
      </div>

      {/* Quick filter pills */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: `All (${all.length})`,           value: 'ALL' },
          { label: `Pending (${counts.PENDING})`,   value: 'PENDING' },
          { label: `Processing (${counts.APPROVED})`, value: 'APPROVED' },
          { label: `Ready (${counts.READY})`,       value: 'READY' },
          { label: 'History',                        value: 'HISTORY' },
        ].map(f => (
          <button
            key={f.value}
            onClick={() => setStatusFilter(f.value === 'HISTORY' ? 'COLLECTED' : f.value)}
            className={cn(
              'px-3 py-1 rounded-full text-xs font-semibold border transition-colors',
              statusFilter === (f.value === 'HISTORY' ? 'COLLECTED' : f.value)
                ? 'bg-primary text-white border-primary'
                : 'bg-white text-gray-600 border-gray-200 hover:border-primary/40'
            )}
          >
            {f.label}
          </button>
        ))}
        <div className="relative ml-auto w-full sm:w-56">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-gray-400" />
          <Input
            placeholder="Search book or user..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-8 h-8 text-xs bg-white border-gray-300"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-8">#</TableHead>
              <TableHead>Book</TableHead>
              <TableHead className="hidden sm:table-cell">User</TableHead>
              <TableHead className="hidden md:table-cell">Reserved</TableHead>
              <TableHead className="hidden md:table-cell">Expiry</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 7 }).map((_, j) => <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>)}
                </TableRow>
              ))
              : filtered.length === 0
              ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-gray-400">
                    <BookOpen className="size-7 mx-auto mb-2 opacity-30" />
                    No reservations found
                  </TableCell>
                </TableRow>
              )
              : filtered.map((r, i) => {
                const next = NEXT[r.status]
                const isActing = mutation.isPending && (mutation.variables as any)?.id === r.id
                return (
                  <TableRow key={r.id} className={cn('hover:bg-gray-50', r.status === 'READY' && 'bg-emerald-50/40')}>
                    <TableCell className="text-gray-400 text-xs">{i + 1}</TableCell>
                    <TableCell>
                      <p className="font-medium text-gray-900 text-sm line-clamp-1">{r.bookName}</p>
                      <p className="text-xs text-gray-400 sm:hidden">{r.userName}</p>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm text-gray-600">{r.userName}</TableCell>
                    <TableCell className="hidden md:table-cell text-xs text-gray-400">{new Date(r.reservedAt).toLocaleDateString()}</TableCell>
                    <TableCell className="hidden md:table-cell text-xs text-gray-400">{r.expiryDate ? new Date(r.expiryDate).toLocaleDateString() : '—'}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn('text-[10px] font-bold px-1.5 py-0', STATUS_BADGE[r.status])}>
                        {r.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {next ? (
                        <Button
                          size="sm" variant="outline"
                          className={cn('h-7 gap-1 text-xs font-bold', next.cls)}
                          onClick={() => mutation.mutate({ id: r.id, action: next.action })}
                          disabled={isActing}
                        >
                          {isActing ? <Loader2 className="size-3 animate-spin" /> : next.icon}
                          <span className="hidden sm:inline">{next.label}</span>
                        </Button>
                      ) : (
                        <span className="text-xs text-gray-300">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })
            }
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
