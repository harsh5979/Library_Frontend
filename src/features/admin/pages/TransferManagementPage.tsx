import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { transferService } from '@/features/transfers/services/transferService'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  Search, 
  ArrowRightLeft, 
  Truck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Package,
  MoreVertical,
  Navigation,
  AlertCircle
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'

export function TransferManagementPage() {
  const qc = useQueryClient()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'DISPATCHED' | 'RECEIVED'>('ALL')

  const { data, isLoading } = useQuery({
    queryKey: ['admin-transfers'],
    queryFn: () => transferService.getAll()
  })

  const approveMutation = useMutation({
    mutationFn: (id: number) => transferService.approve(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-transfers'] })
      toast.success('Transfer request approved')
    },
    onError: (e: any) => toast.error(e.message)
  })

  const dispatchMutation = useMutation({
    mutationFn: (id: number) => transferService.dispatch(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-transfers'] })
      toast.success('Book dispatched for transfer')
    },
    onError: (e: any) => toast.error(e.message)
  })

  const receiveMutation = useMutation({
    mutationFn: (id: number) => transferService.receive(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-transfers'] })
      toast.success('Book received at target branch. Inventory updated.')
    },
    onError: (e: any) => toast.error(e.message)
  })

  const transfers = data?.data?.content ?? []
  const filtered = transfers.filter(t => 
    (statusFilter === 'ALL' || t.status === statusFilter) &&
    (!search || t.book_name.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Inter-Branch Transfers</h1>
          <p className="text-sm text-muted-foreground font-medium">Manage book relocations across campus libraries.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input 
                    placeholder="Search book title..." 
                    className="pl-9 w-full sm:w-[250px] rounded-xl"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <div className="flex bg-muted/50 p-1 rounded-xl border">
                {(['ALL', 'PENDING', 'DISPATCHED', 'RECEIVED'] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => setStatusFilter(f)}
                        className={cn(
                            "px-3 py-1.5 text-[10px] font-black uppercase tracking-tighter rounded-lg transition-all",
                            statusFilter === f ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        {f}
                    </button>
                ))}
            </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <TransferStat title="Total Requests" value={transfers.length} icon={<ArrowRightLeft className="h-4 w-4" />} color="primary" />
        <TransferStat title="Pending Approval" value={transfers.filter(t => t.status === 'PENDING').length} icon={<Clock className="h-4 w-4" />} color="amber" />
        <TransferStat title="In Transit" value={transfers.filter(t => t.status === 'DISPATCHED').length} icon={<Truck className="h-4 w-4" />} color="blue" />
        <TransferStat title="Completed" value={transfers.filter(t => t.status === 'RECEIVED').length} icon={<CheckCircle2 className="h-4 w-4" />} color="emerald" />
      </div>

      <div className="rounded-2xl border bg-card/50 backdrop-blur-sm overflow-hidden shadow-sm">
        <Table>
            <TableHeader className="bg-muted/30">
                <TableRow>
                    <TableHead className="font-bold">Book & Route</TableHead>
                    <TableHead className="text-center font-bold">Logistics</TableHead>
                    <TableHead className="text-center font-bold">Status</TableHead>
                    <TableHead className="text-center font-bold">Request Date</TableHead>
                    <TableHead className="text-right font-bold w-[80px]">Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell><Skeleton className="h-10 w-[250px]" /></TableCell>
                            <TableCell><Skeleton className="h-10 w-[200px] mx-auto" /></TableCell>
                            <TableCell><Skeleton className="h-6 w-24 mx-auto" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-20 mx-auto" /></TableCell>
                            <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                        </TableRow>
                    ))
                ) : filtered.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={5} className="h-64 text-center text-muted-foreground">
                            <Navigation className="h-12 w-12 mx-auto mb-4 opacity-10 animate-pulse" />
                            <p className="font-bold">No active transfer routes found.</p>
                            <p className="text-xs">Adjust your search or filter to see more.</p>
                        </TableCell>
                    </TableRow>
                ) : (
                    filtered.map((transfer) => (
                        <TableRow key={transfer.id} className="hover:bg-muted/10 group transition-colors">
                            <TableCell>
                                <div className="font-bold text-sm tracking-tight group-hover:text-primary transition-colors">{transfer.book_name}</div>
                                <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="outline" className="text-[9px] h-4 px-1 font-bold">{transfer.from_branch_name.split(' ')[0]}</Badge>
                                    <ArrowRightLeft className="h-3 w-3 text-muted-foreground" />
                                    <Badge variant="outline" className="text-[9px] h-4 px-1 font-bold bg-primary/5 text-primary border-primary/20">{transfer.to_branch_name.split(' ')[0]}</Badge>
                                </div>
                            </TableCell>
                            <TableCell className="text-center">
                                <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-1">Source Internal Route</div>
                                <div className="flex items-center justify-center gap-1.5 grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all">
                                    <Package className="h-3.5 w-3.5 text-amber-600" />
                                    <div className="h-px w-8 bg-border" />
                                    <Navigation className="h-3.5 w-3.5 text-blue-600" />
                                    <div className="h-px w-8 bg-border" />
                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                                </div>
                            </TableCell>
                            <TableCell className="text-center">
                                <Badge 
                                    className={cn(
                                        "rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-widest",
                                        transfer.status === 'PENDING' && "bg-amber-100 text-amber-700 border-amber-200",
                                        transfer.status === 'APPROVED' && "bg-blue-100 text-blue-700 border-blue-200",
                                        transfer.status === 'DISPATCHED' && "bg-indigo-100 text-indigo-700 border-indigo-200 animate-pulse",
                                        transfer.status === 'RECEIVED' && "bg-emerald-100 text-emerald-700 border-emerald-200",
                                        transfer.status === 'REJECTED' && "bg-rose-100 text-rose-700 border-rose-200"
                                    )}
                                >
                                    {transfer.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-center text-xs text-muted-foreground font-mono">
                                {new Date(transfer.request_date).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-muted">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48 font-bold text-[10px] uppercase tracking-widest p-2 space-y-1">
                                        {transfer.status === 'PENDING' && (
                                            <DropdownMenuItem 
                                                className="text-emerald-600 cursor-pointer focus:bg-emerald-50 focus:text-emerald-700"
                                                onClick={() => approveMutation.mutate(transfer.id)}
                                            >
                                                <CheckCircle2 className="mr-2 h-4 w-4" /> Approve & Stage
                                            </DropdownMenuItem>
                                        )}
                                        {transfer.status === 'APPROVED' && (
                                            <DropdownMenuItem 
                                                className="text-blue-600 cursor-pointer focus:bg-blue-50 focus:text-blue-700"
                                                onClick={() => dispatchMutation.mutate(transfer.id)}
                                            >
                                                <Truck className="mr-2 h-4 w-4" /> Dispatch Book
                                            </DropdownMenuItem>
                                        )}
                                        {transfer.status === 'DISPATCHED' && (
                                            <DropdownMenuItem 
                                                className="text-emerald-600 cursor-pointer focus:bg-emerald-50 focus:text-emerald-700"
                                                onClick={() => receiveMutation.mutate(transfer.id)}
                                            >
                                                <Package className="mr-2 h-4 w-4" /> Log Reception
                                            </DropdownMenuItem>
                                        )}
                                        {transfer.status === 'PENDING' && (
                                            <DropdownMenuItem className="text-rose-600 cursor-pointer focus:bg-rose-50 focus:text-rose-700">
                                                <XCircle className="mr-2 h-4 w-4" /> Reject Request
                                            </DropdownMenuItem>
                                        )}
                                        <div className="h-px bg-border my-1" />
                                        <DropdownMenuItem className="opacity-50 cursor-not-allowed">
                                            <AlertCircle className="mr-2 h-4 w-4" /> Print Waybill
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
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

function TransferStat({ title, value, icon, color }: { title: string, value: number, icon: React.ReactNode, color: string }) {
    const colors: Record<string, string> = {
        primary: "bg-primary/10 text-primary border-primary/20",
        amber: "bg-amber-500/10 text-amber-600 border-amber-500/20",
        blue: "bg-blue-500/10 text-blue-600 border-blue-500/20",
        emerald: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
    }

    return (
        <Card className={cn("shadow-md border-none", colors[color])}>
            <CardContent className="p-4 flex items-center justify-between">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-wider opacity-70">{title}</p>
                    <p className="text-2xl font-black mt-0.5">{value}</p>
                </div>
                <div className="p-2 bg-white/50 rounded-lg shadow-sm">
                    {icon}
                </div>
            </CardContent>
        </Card>
    )
}
