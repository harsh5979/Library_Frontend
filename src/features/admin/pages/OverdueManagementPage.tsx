import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { borrowService } from '@/features/borrowing/services/borrowService'
import { 
  AlertTriangle, 
  Mail, 
  ArrowLeft,
  DollarSign,
  History,
  CheckCircle2,
  User as UserIcon,
  Book as BookIcon,
  Timer,
  ShieldAlert
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { Link } from 'react-router-dom'

export function OverdueManagementPage() {
  const queryClient = useQueryClient()

  const { data: overdueData, isLoading } = useQuery({
    queryKey: ['overdue-management'],
    queryFn: () => borrowService.getAllOverdue(0, 100),
  })

  // Note: markAsLost not in original service, but we can add it to borrowService
  const markAsLostMutation = useMutation({
     mutationFn: (id: number) => borrowService.markAsLost(id),
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['overdue-management'] })
       toast.success("Item has been flagged as lost and replacement procedures initiated.")
     }
  })

  const overdueList = overdueData?.data?.content || []
  const totalFines = overdueList.reduce((acc, curr) => acc + (curr.fineAmount || 0), 0)

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-primary/5">
        <div className="space-y-1">
          <Link to="/admin" className="text-primary text-xs font-black uppercase tracking-widest flex items-center gap-2 mb-2 hover:gap-3 transition-all">
             <ArrowLeft className="h-3 w-3" /> Dashboard
          </Link>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-rose-600">
            Overdue Enforcement
          </h1>
          <p className="text-muted-foreground text-lg leading-tight uppercase font-black text-[10px] tracking-widest opacity-60">
            Managing overdue items and fine collection protocols.
          </p>
        </div>
        <div className="flex gap-4">
           <Card className="border-none bg-rose-500/5 ring-1 ring-rose-500/20 px-6 py-3 rounded-2xl flex items-center gap-4">
              <DollarSign className="h-6 w-6 text-rose-600" />
              <div>
                 <p className="text-[10px] font-black uppercase opacity-40">Total Pending Fines</p>
                 <p className="text-xl font-black text-rose-600">Rs. {totalFines.toLocaleString()}</p>
              </div>
           </Card>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-12">
          <Card className="border-none shadow-2xl bg-background/60 backdrop-blur-xl ring-1 ring-primary/5 rounded-3xl overflow-hidden p-0">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="border-none hover:bg-transparent">
                  <TableHead className="pl-8 py-5 font-black uppercase text-[10px] tracking-widest">Delinquent Member</TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest">Restricted Asset</TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest">Overdue Metrics</TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest">Financial Penalty</TableHead>
                  <TableHead className="pr-8 text-right font-black uppercase text-[10px] tracking-widest">System Override</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                       <TableCell className="pl-8 py-6"><Skeleton className="h-10 w-40" /></TableCell>
                       <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                       <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                       <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                       <TableCell className="pr-8"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : overdueList.map((item: any) => {
                  const daysOverdue = Math.floor((new Date().getTime() - new Date(item.dueDate || item.returnDate).getTime()) / (1000 * 3600 * 24))
                  return (
                    <TableRow key={item.id} className="border-primary/5 hover:bg-rose-500/5 transition-colors group">
                      <TableCell className="py-6 pl-8">
                        <div className="flex items-center gap-4">
                           <Avatar className="h-12 w-12 border-2 border-rose-500/20 shadow-sm group-hover:scale-110 transition-transform">
                              <AvatarFallback className="font-black text-rose-600 bg-rose-500/10">M</AvatarFallback>
                           </Avatar>
                           <div className="space-y-0.5">
                              <p className="font-black group-hover:text-rose-600 transition-colors uppercase leading-none">{item.userName || 'Member ID: ' + item.userId}</p>
                              <p className="text-[10px] font-black uppercase opacity-40">Account Linked: {item.userId}</p>
                           </div>
                        </div>
                      </TableCell>
                      <TableCell>
                         <div className="flex items-center gap-3">
                            <BookIcon className="h-4 w-4 text-muted-foreground" />
                            <div className="max-w-[180px]">
                               <p className="font-bold text-sm truncate">{item.bookTitle}</p>
                               <p className="text-[10px] font-bold text-muted-foreground uppercase">{item.bookAuthor}</p>
                            </div>
                         </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                           <p className="text-xs font-black text-rose-600 flex items-center gap-2">
                              <Timer className="h-3 w-3" /> {daysOverdue > 0 ? daysOverdue : 0} Days Delayed
                           </p>
                           <p className="text-[10px] font-bold text-muted-foreground uppercase">Expected: {new Date(item.dueDate || item.returnDate).toLocaleDateString()}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-0.5">
                           <p className="font-black text-rose-600 text-lg">Rs. {item.fine || item.fineAmount || 0}</p>
                           <p className="text-[9px] font-bold uppercase opacity-40">Variable fine rate applied</p>
                        </div>
                      </TableCell>
                      <TableCell className="pr-8 text-right">
                         <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-9 px-4 font-black text-xs gap-2 rounded-xl text-rose-600 hover:bg-rose-500/10"
                              onClick={() => {
                                if(confirm(`Confirm item loss for ${item.bookTitle}? This will trigger inventory deficit.`)) markAsLostMutation.mutate(item.id)
                              }}
                            >
                               <AlertTriangle className="h-3 w-3" /> Mark as Lost
                            </Button>
                            <Button variant="outline" size="sm" className="h-9 px-4 font-black text-xs gap-2 rounded-xl border-2">
                               <Mail className="h-3 w-3" /> Send Notice
                            </Button>
                         </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>

            {!isLoading && overdueList.length === 0 && (
               <div className="text-center py-32 space-y-4">
                  <div className="h-20 w-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
                     <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black">Zero Overdue Items</h3>
                    <p className="text-muted-foreground font-medium max-w-xs mx-auto">All physical assets are currently within their return windows.</p>
                  </div>
               </div>
            )}
          </Card>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
         <Card className="border-none shadow-2xl bg-linear-to-br from-indigo-600/5 to-primary/5 rounded-3xl p-8 ring-1 ring-primary/10">
            <h3 className="text-xl font-black mb-2 flex items-center gap-3">
               <History className="h-6 w-6 text-primary" /> Automated Enforcement
            </h3>
            <p className="text-muted-foreground font-medium mb-8">Our system automatically calculates variable fine rates based on member status and asset popularity.</p>
            <div className="space-y-4 font-black text-xs uppercase tracking-widest text-primary">
               <div className="flex items-center gap-3 p-4 bg-background/60 rounded-2xl shadow-sm">
                  <div className="h-2 w-2 rounded-full bg-primary" /> 
                  Fine increment: Rs. 10 / day
               </div>
               <div className="flex items-center gap-3 p-4 bg-background/60 rounded-2xl shadow-sm">
                  <div className="h-2 w-2 rounded-full bg-primary" /> 
                  Suspension threshold: 14 days overdue
               </div>
            </div>
         </Card>
         <Card className="border-none shadow-2xl bg-linear-to-br from-rose-600/5 to-rose-400/5 rounded-3xl p-8 ring-1 ring-rose-500/10">
            <h3 className="text-xl font-black mb-2 flex items-center gap-3 text-rose-600">
               <ShieldAlert className="h-6 w-6" /> Escalation Protocols
            </h3>
            <p className="text-muted-foreground font-medium mb-8">Escalate critical overdue cases to the University Administrative Board for formal resolution.</p>
            <Button className="w-full h-14 font-black shadow-xl shadow-rose-500/20 bg-linear-to-r from-rose-600 to-rose-400 border-none rounded-2xl gap-3">
               <UserIcon className="h-5 w-5" /> Escalate Selected Items
            </Button>
         </Card>
      </div>
    </div>
  )
}
