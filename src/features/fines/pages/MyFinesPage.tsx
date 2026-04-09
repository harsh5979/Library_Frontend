import { useQuery } from '@tanstack/react-query'
import { fineService } from '../services/fineService'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { CreditCard, History, AlertCircle, CheckCircle2, Clock } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export function MyFinesPage() {
  const { data: totalOwedData, isLoading: isTotalLoading } = useQuery({
    queryKey: ['my-fines-total'],
    queryFn: () => fineService.getMyTotal()
  })

  const { data: finesData, isLoading: isFinesLoading } = useQuery({
    queryKey: ['my-fines-history'],
    queryFn: () => fineService.getMyFines()
  })

  const totalOwed = totalOwedData?.data ?? 0
  const fines = finesData?.data?.content ?? []

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black tracking-tight">Financial Overview</h1>
        <p className="text-muted-foreground font-medium">Manage your overdue fines and payment history.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-primary/5 border-primary/20 shadow-xl shadow-primary/5 overflow-hidden relative group">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-primary">Total Owed</CardTitle>
            <CreditCard className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {isTotalLoading ? (
              <Skeleton className="h-9 w-24" />
            ) : (
              <div className="text-3xl font-black tracking-tighter">₹{totalOwed.toFixed(2)}</div>
            )}
            <p className="text-[10px] text-muted-foreground mt-1 font-bold">Clear your dues to continue borrowing</p>
          </CardContent>
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform">
            <CreditCard className="h-24 w-24" />
          </div>
        </Card>

        <Card className="bg-emerald-500/5 border-emerald-500/20 shadow-xl shadow-emerald-500/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-emerald-600">Total Paid</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
             <div className="text-3xl font-black tracking-tighter">
                ₹{fines.reduce((acc, f) => acc + f.paid_amount, 0).toFixed(2)}
             </div>
             <p className="text-[10px] text-muted-foreground mt-1 font-bold">Thank you for your timely payments</p>
          </CardContent>
        </Card>

        <Card className="bg-amber-500/5 border-amber-500/20 shadow-xl shadow-amber-500/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-amber-600">Overdue Days</CardTitle>
            <Clock className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
             <div className="text-3xl font-black tracking-tighter">
                {fines.filter(f => f.status === 'PENDING').reduce((acc, f) => acc + f.days_overdue, 0)}
             </div>
             <p className="text-[10px] text-muted-foreground mt-1 font-bold">Cumulative delay across all records</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold tracking-tight">Fine History</h2>
        </div>

        <div className="rounded-2xl border bg-card/50 backdrop-blur-sm overflow-hidden shadow-lg">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="font-bold">Book Title</TableHead>
                <TableHead className="font-bold text-center">Days Overdue</TableHead>
                <TableHead className="font-bold text-center">Total Fine</TableHead>
                <TableHead className="font-bold text-center">Paid</TableHead>
                <TableHead className="font-bold text-center">Status</TableHead>
                <TableHead className="font-bold text-right">Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isFinesLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-12 mx-auto" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16 mx-auto" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16 mx-auto" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 mx-auto rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : fines.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground font-medium">
                    <AlertCircle className="h-6 w-6 mx-auto mb-2 opacity-20" />
                    No fine records found.
                  </TableCell>
                </TableRow>
              ) : (
                fines.map((fine) => (
                  <TableRow key={fine.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-semibold">{fine.book_title}</TableCell>
                    <TableCell className="text-center font-mono">{fine.days_overdue}</TableCell>
                    <TableCell className="text-center font-bold">₹{fine.total_amount.toFixed(2)}</TableCell>
                    <TableCell className="text-center font-medium text-emerald-600">₹{fine.paid_amount.toFixed(2)}</TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-widest",
                          fine.status === 'PAID' && "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
                          fine.status === 'PENDING' && "bg-rose-500/10 text-rose-600 border-rose-500/20 animate-pulse",
                          fine.status === 'WAIVED' && "bg-blue-500/10 text-blue-600 border-blue-500/20",
                          fine.status === 'PARTIAL' && "bg-amber-500/10 text-amber-600 border-amber-500/20"
                        )}
                      >
                        {fine.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground font-medium">
                      {new Date(fine.created_at).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
