import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fineService } from '@/features/fines/services/fineService'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Search, 
  Wallet, 
  Ban, 
  CheckCircle, 
  AlertCircle,
  MoreVertical
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'

export function FineManagementPage() {
  const qc = useQueryClient()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'PAID' | 'WAIVED'>('ALL')

  const { data, isLoading } = useQuery({
    queryKey: ['admin-fines', filter],
    queryFn: () => {
        if (filter === 'PENDING') return fineService.getPendingFines()
        return fineService.getAllFines()
    }
  })

  const { data: summaryData } = useQuery({
    queryKey: ['fines-summary'],
    queryFn: () => fineService.getFineSummary()
  })

  const payMutation = useMutation({
    mutationFn: (id: number) => fineService.payFine(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-fines'] })
      qc.invalidateQueries({ queryKey: ['fines-summary'] })
      toast.success('Fine marked as PAID')
    },
    onError: (e: any) => toast.error(e.message)
  })

  const waiveMutation = useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) => fineService.waiveFine(id, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-fines'] })
      qc.invalidateQueries({ queryKey: ['fines-summary'] })
      toast.success('Fine WAIVED successfully')
    },
    onError: (e: any) => toast.error(e.message)
  })

  const fines = data?.data?.content ?? []
  const filtered = fines.filter(f => 
    !search || 
    f.book_title.toLowerCase().includes(search.toLowerCase()) || 
    f.user_name.toLowerCase().includes(search.toLowerCase())
  )

  const summary = summaryData?.data ?? {}

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Fine Management</h1>
          <p className="text-sm text-muted-foreground font-medium">Monitor and process student overdue penalties.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input 
                    placeholder="Search user or book..." 
                    className="pl-9 w-full sm:w-[250px]"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <div className="flex bg-muted/50 p-1 rounded-lg border">
                {(['ALL', 'PENDING', 'PAID'] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={cn(
                            "px-3 py-1 text-xs font-bold rounded-md transition-all",
                            filter === f ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        {f}
                    </button>
                ))}
            </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-none shadow-lg bg-linear-to-br from-primary to-primary/80 text-white">
            <CardContent className="p-6">
                <div className="text-xs font-bold uppercase tracking-widest opacity-80">Total Outstanding</div>
                <div className="text-3xl font-black mt-1 tracking-tighter">₹{summary.pending_amount?.toFixed(2) || '0.00'}</div>
            </CardContent>
        </Card>
        <Card className="border-none shadow-lg bg-linear-to-br from-emerald-600 to-emerald-500 text-white">
            <CardContent className="p-6">
                <div className="text-xs font-bold uppercase tracking-widest opacity-80">Total Collected</div>
                <div className="text-3xl font-black mt-1 tracking-tighter">₹{summary.collected_amount?.toFixed(2) || '0.00'}</div>
            </CardContent>
        </Card>
        <Card className="border shadow-lg bg-card text-card-foreground">
            <CardContent className="p-6">
                <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">System Total</div>
                <div className="text-3xl font-black mt-1 tracking-tighter">₹{summary.total_amount?.toFixed(2) || '0.00'}</div>
            </CardContent>
        </Card>
      </div>

      <div className="rounded-xl border bg-card/50 backdrop-blur-sm overflow-hidden shadow-sm">
        <Table>
            <TableHeader className="bg-muted/30">
                <TableRow>
                    <TableHead className="font-bold">Student</TableHead>
                    <TableHead className="font-bold">Book Details</TableHead>
                    <TableHead className="text-center font-bold">Days</TableHead>
                    <TableHead className="text-center font-bold">Fine</TableHead>
                    <TableHead className="text-center font-bold">Status</TableHead>
                    <TableHead className="text-right font-bold w-[100px]">Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell><div className="h-4 w-32 bg-muted animate-pulse rounded" /></TableCell>
                            <TableCell><div className="h-4 w-40 bg-muted animate-pulse rounded" /></TableCell>
                            <TableCell><div className="h-4 w-8 bg-muted animate-pulse rounded mx-auto" /></TableCell>
                            <TableCell><div className="h-4 w-12 bg-muted animate-pulse rounded mx-auto" /></TableCell>
                            <TableCell><div className="h-6 w-20 bg-muted animate-pulse rounded-full mx-auto" /></TableCell>
                            <TableCell><div className="h-8 w-8 bg-muted animate-pulse rounded ml-auto" /></TableCell>
                        </TableRow>
                    ))
                ) : filtered.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={6} className="h-48 text-center text-muted-foreground">
                            <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-20" />
                            No fine records found for the current filter.
                        </TableCell>
                    </TableRow>
                ) : (
                    filtered.map((fine) => (
                        <TableRow key={fine.id} className="hover:bg-muted/10">
                            <TableCell>
                                <div className="font-bold text-sm">{fine.user_name}</div>
                                <div className="text-[10px] text-muted-foreground font-mono">ID: {fine.user_id}</div>
                            </TableCell>
                            <TableCell>
                                <div className="font-medium text-sm line-clamp-1">{fine.book_title}</div>
                                <div className="text-[10px] text-muted-foreground">Trans: #{fine.transaction_id}</div>
                            </TableCell>
                            <TableCell className="text-center font-mono text-sm">{fine.days_overdue}</TableCell>
                            <TableCell className="text-center">
                                <div className="font-black text-sm">₹{fine.total_amount.toFixed(2)}</div>
                                <div className="text-[10px] text-emerald-600 font-bold">Paid: ₹{fine.paid_amount.toFixed(2)}</div>
                            </TableCell>
                            <TableCell className="text-center">
                                <Badge 
                                    variant="outline"
                                    className={cn(
                                        "rounded-full px-2 text-[9px] font-black uppercase tracking-tighter",
                                        fine.status === 'PAID' && "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
                                        fine.status === 'PENDING' && "bg-rose-500/10 text-rose-600 border-rose-500/20",
                                        fine.status === 'WAIVED' && "bg-blue-500/10 text-blue-600 border-blue-500/20",
                                        fine.status === 'PARTIAL' && "bg-amber-500/10 text-amber-600 border-amber-500/20"
                                    )}
                                >
                                    {fine.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                {fine.status === 'PENDING' || fine.status === 'PARTIAL' ? (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-40 font-bold uppercase text-[10px] tracking-widest">
                                            <DropdownMenuItem 
                                                className="text-emerald-600 cursor-pointer"
                                                onClick={() => payMutation.mutate(fine.id)}
                                                disabled={payMutation.isPending}
                                            >
                                                <Wallet className="mr-2 h-3.5 w-3.5" /> Mark Paid
                                            </DropdownMenuItem>
                                            <DropdownMenuItem 
                                                className="text-blue-600 cursor-pointer"
                                                onClick={() => waiveMutation.mutate({ id: fine.id, reason: 'Librarian override' })}
                                                disabled={waiveMutation.isPending}
                                            >
                                                <Ban className="mr-2 h-3.5 w-3.5" /> Waive Fine
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                ) : (
                                    <div className="flex justify-end pr-2">
                                        <CheckCircle className="h-4 w-4 text-emerald-500 opacity-50" />
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
