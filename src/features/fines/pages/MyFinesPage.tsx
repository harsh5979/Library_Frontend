import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fineService } from '../services/fineService'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { CreditCard, Wallet, Receipt, Clock, Info } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export function MyFinesPage() {
  const qc = useQueryClient()

  const { data: finesData, isLoading } = useQuery({
    queryKey: ['my-fines'],
    queryFn: () => fineService.getMyFines(),
  })

  const { data: totalData } = useQuery({
    queryKey: ['my-fine-total'],
    queryFn: () => fineService.getMyTotal(),
  })

  const payMutation = useMutation({
    mutationFn: (id: number) => fineService.payFine(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-fines'] })
      qc.invalidateQueries({ queryKey: ['my-fine-total'] })
      toast.success('Payment successful!')
    },
    onError: (e: any) => toast.error(e.message),
  })

  const fines = finesData?.data?.content ?? []
  const total = totalData?.data ?? 0

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Financial Summary</h1>
          <p className="text-gray-500 font-medium">Manage your library dues and payment history.</p>
        </div>

        <div className="bg-white border-2 border-primary/20 p-5 rounded-2xl shadow-xl shadow-primary/5 flex items-center gap-6 min-w-[240px]">
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Wallet className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-primary/60 tracking-widest">Total Dues</p>
            <p className="text-3xl font-black text-primary">₹{total}</p>
          </div>
        </div>
      </div>

      {total > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-4">
          <Info className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-bold text-amber-900">Overdue Fines Detected</p>
            <p className="text-xs text-amber-700 leading-relaxed">
              Fines are calculated at ₹2/day for each overdue book. Please clear your dues to avoid account restrictions.
              Contact the librarian if you believe there is a mistake.
            </p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="bg-white border border-gray-100 rounded-3xl shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <h2 className="text-sm font-black uppercase tracking-widest text-gray-400">Transaction History</h2>
          <Badge variant="secondary" className="font-bold">{fines.length} records</Badge>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-transparent border-b border-gray-100">
              <TableHead className="px-6 h-12 text-[11px] font-black uppercase text-gray-400">Book Details</TableHead>
              <TableHead className="h-12 text-[11px] font-black uppercase text-gray-400">Amount</TableHead>
              <TableHead className="h-12 text-[11px] font-black uppercase text-gray-400">Status</TableHead>
              <TableHead className="px-6 text-right h-12 text-[11px] font-black uppercase text-gray-400">Action/Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i} className="border-b border-gray-50">
                  <TableCell className="px-6 py-4"><Skeleton className="h-10 w-full rounded-lg" /></TableCell>
                  <TableCell py-4><Skeleton className="h-5 w-12 rounded-lg" /></TableCell>
                  <TableCell py-4><Skeleton className="h-5 w-20 rounded-lg" /></TableCell>
                  <TableCell className="px-6 py-4"><Skeleton className="h-5 w-24 ml-auto rounded-lg" /></TableCell>
                </TableRow>
              ))
            ) : fines.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-24 text-center">
                  <Receipt className="h-12 w-12 text-gray-200 mx-auto mb-4" />
                  <p className="text-lg font-bold text-gray-900">Clean Slate!</p>
                  <p className="text-sm text-gray-400 font-medium max-w-[200px] mx-auto">You have no pending fines or past transactions on record.</p>
                </TableCell>
              </TableRow>
            ) : (
              fines.map((fine) => (
                <TableRow key={fine.id} className="group hover:bg-gray-50/80 transition-colors border-b border-gray-50 last:border-0 font-medium">
                  <TableCell className="px-6 py-4">
                    <div className="space-y-0.5">
                      <p className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors">{fine.bookTitle}</p>
                      <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold">
                        <Clock className="h-3 w-3" />
                        <span>{fine.daysOverdue} days overdue</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm font-black text-gray-900">₹{fine.amount}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn(
                      'text-[9px] font-black uppercase tracking-tighter px-2',
                      fine.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200',
                      fine.status === 'WAIVED' && 'bg-gray-50 text-gray-400 border-gray-200'
                    )}>
                      {fine.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    {fine.status === 'PENDING' ? (
                      <Button
                        size="sm"
                        onClick={() => payMutation.mutate(fine.id)}
                        disabled={payMutation.isPending}
                        className="h-9 px-4 rounded-xl font-bold bg-primary hover:bg-primary/90 text-xs gap-2"
                      >
                        <CreditCard className="h-3.5 w-3.5" /> Pay Now
                      </Button>
                    ) : (
                      <div className="space-y-0.5">
                        <p className="text-[10px] text-gray-400 font-bold">Settled On</p>
                        <p className="text-xs text-gray-600 font-black">{fine.paidAt ? new Date(fine.paidAt).toLocaleDateString() : 'WAIVED'}</p>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
