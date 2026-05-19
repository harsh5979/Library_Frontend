import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fineService } from '../services/fineService'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { CreditCard, Ban, Search, Loader2, Coins, Receipt } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export function FineManagementPage() {
  const qc = useQueryClient()
  const [search, setSearch] = useState('')
  const [waiveDialog, setWaiveDialog] = useState<{ id: number; name: string } | null>(null)
  const [waiveReason, setWaiveReason] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['fines-all'],
    queryFn: () => fineService.getAllFines(0, 1000),
  })

  const { data: summaryData } = useQuery({
    queryKey: ['fines-summary'],
    queryFn: () => fineService.getFineSummary(),
  })

  const payMutation = useMutation({
    mutationFn: (id: number) => fineService.payFine(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['fines-all'] })
      qc.invalidateQueries({ queryKey: ['fines-summary'] })
      toast.success('Fine marked as paid.')
    },
    onError: (e: any) => toast.error(e.message),
  })

  const waiveMutation = useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) => fineService.waiveFine(id, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['fines-all'] })
      qc.invalidateQueries({ queryKey: ['fines-summary'] })
      setWaiveDialog(null)
      setWaiveReason('')
      toast.success('Fine waived successfully.')
    },
    onError: (e: any) => toast.error(e.message),
  })

  const allFines = data?.data?.content ?? []
  const filtered = allFines.filter(f => 
    !search || 
    f.user_name.toLowerCase().includes(search.toLowerCase()) || 
    f.book_title.toLowerCase().includes(search.toLowerCase())
  )

  const pending = filtered.filter(f => f.status === 'PENDING')
  const history = filtered.filter(f => f.status !== 'PENDING')

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fine Management</h1>
          <p className="text-sm text-gray-500">Collect or waive student library fines.</p>
        </div>
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <Input placeholder="Search user or book..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-white border-gray-300 rounded-xl" />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryCard label="Total Collected" value={summaryData?.data?.totalPaidAmount ?? 0} icon={<Coins className="text-emerald-500" />} color="emerald" />
        <SummaryCard label="Pending Fines" value={summaryData?.data?.totalPendingAmount ?? 0} icon={<Receipt className="text-amber-500" />} color="amber" />
        <SummaryCard label="Count Paid" value={summaryData?.data?.paidCount ?? 0} unit="" icon={<CreditCard className="text-blue-500" />} color="blue" />
        <SummaryCard label="Count Pending" value={summaryData?.data?.pendingCount ?? 0} unit="" icon={<Ban className="text-rose-500" />} color="rose" />
      </div>

      <Tabs defaultValue="pending">
        <TabsList className="bg-gray-100 p-1 rounded-xl h-auto gap-1">
          <TabsTrigger value="pending" className="px-5 py-2 rounded-lg text-sm font-bold">Pending ({pending.length})</TabsTrigger>
          <TabsTrigger value="history" className="px-5 py-2 rounded-lg text-sm font-bold">History ({history.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-4">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>User / Transaction</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Days Overdue</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => <TableRow key={i}><TableCell colSpan={4}><Skeleton className="h-10 w-full" /></TableCell></TableRow>)
                ) : pending.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-12 text-gray-400 font-medium">No pending fines found.</TableCell></TableRow>
                ) : pending.map(f => (
                  <TableRow key={f.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell>
                      <p className="font-bold text-gray-900 text-sm">{f.user_name}</p>
                      <p className="text-xs text-gray-400 truncate max-w-[200px]">{f.book_title}</p>
                    </TableCell>
                    <TableCell><p className="font-black text-rose-500 text-sm">₹{f.total_amount}</p></TableCell>
                    <TableCell><p className="text-sm font-medium text-gray-600">{f.days_overdue} days</p></TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm" className="h-8 text-xs font-bold border-emerald-500 text-emerald-600 hover:bg-emerald-50" onClick={() => payMutation.mutate(f.id)} disabled={payMutation.isPending}>
                        {payMutation.isPending && payMutation.variables === f.id ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <CreditCard className="h-3 w-3 mr-1" />}
                        Collect
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 text-xs font-bold border-gray-300 text-gray-400 hover:text-rose-500" onClick={() => setWaiveDialog({ id: f.id, name: f.user_name })}>
                        Waive
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>User</TableHead>
                  <TableHead>Book</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map(f => (
                  <TableRow key={f.id}>
                    <TableCell className="font-bold text-sm">{f.user_name}</TableCell>
                    <TableCell className="text-xs text-gray-500 truncate max-w-[150px]">{f.book_title}</TableCell>
                    <TableCell className="font-bold text-sm">₹{f.total_amount}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn('text-[10px] font-black uppercase', f.status === 'PAID' ? 'text-emerald-600 border-emerald-200 bg-emerald-50' : 'text-gray-400 border-gray-200 bg-gray-50')}>
                        {f.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-[10px] text-gray-400 font-mono">
                      {f.paid_at ? new Date(f.paid_at).toLocaleDateString() : '—'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Waive Dialog */}
      <Dialog open={!!waiveDialog} onOpenChange={() => setWaiveDialog(null)}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle>Waive Fine</DialogTitle>
            <DialogDescription>Reason for waiving fine for {waiveDialog?.name}:</DialogDescription>
          </DialogHeader>
          <Input placeholder="e.g. Medical emergency, University event..." value={waiveReason} onChange={e => setWaiveReason(e.target.value)} className="rounded-xl" />
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setWaiveDialog(null)}>Cancel</Button>
            <Button variant="destructive" className="bg-rose-500 hover:bg-rose-600 rounded-xl" disabled={waiveMutation.isPending || !waiveReason} onClick={() => waiveDialog && waiveMutation.mutate({ id: waiveDialog.id, reason: waiveReason })}>
              {waiveMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Confirm Waive'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function SummaryCard({ label, value, icon, unit = '₹', color }: { label: string; value: number; icon: React.ReactNode; unit?: string; color: string }) {
  const colors: Record<string, string> = {
    emerald: 'bg-emerald-50 border-emerald-100',
    amber: 'bg-amber-50 border-amber-100',
    blue: 'bg-blue-50 border-blue-100',
    rose: 'bg-rose-50 border-rose-100',
  }

  return (
    <div className={cn('p-4 border rounded-2xl flex items-center gap-4 transition-transform hover:scale-[1.02]', colors[color])}>
      <div className="p-3 rounded-xl bg-white/80 shadow-xs">{icon}</div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{label}</p>
        <p className="text-lg font-black text-gray-900">{unit}{value}</p>
      </div>
    </div>
  )
}
