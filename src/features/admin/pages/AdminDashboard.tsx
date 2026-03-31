import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { adminService } from '../services/adminService'
import { AddBookModal } from '@/features/books/components/AddBookModal'
import { borrowService, type TransactionResponse } from '@/features/borrowing/services/borrowService'
import { type PopularBook } from '../types'
import { cn } from '@/lib/utils'
import { 
  BarChart3, 
  Users, 
  BookOpen, 
  AlertTriangle, 
  TrendingUp, 
  Package,
  Plus,
  ArrowRight,
  DollarSign,
  Clock
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function AdminDashboard() {
  const navigate = useNavigate()
  const [isAddBookOpen, setIsAddBookOpen] = useState(false)
  
  const { data: statsData, isLoading: isStatsLoading, refetch: refetchStats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => adminService.getDashboard(),
  })

  const { data: popularBooksData } = useQuery({
    queryKey: ['popular-books-analytics'],
    queryFn: () => adminService.getPopularBooks(5),
  })

  const { data: recentTransactionsData } = useQuery({
    queryKey: ['recent-transactions'],
    queryFn: () => borrowService.getAllTransactions(0, 5),
  })

  const stats = statsData?.data

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <Badge variant="secondary" className="px-3 py-1 rounded-full font-black tracking-widest bg-primary/10 text-primary">
            ADMINISTRATIVE PANEL
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter">
            Library Intelligence
          </h1>
          <p className="text-muted-foreground font-medium text-lg">Real-time oversight of your library network ecosystem.</p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={() => setIsAddBookOpen(true)}
            className="h-12 px-6 font-black rounded-xl shadow-xl shadow-primary/20 bg-linear-to-r from-primary to-blue-600 border-none hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Plus className="mr-2 h-4 w-4" /> Add New Book
          </Button>
          <Button variant="outline" className="h-12 px-6 font-black rounded-xl border-2 hover:bg-muted/50 transition-colors">
            Generate Report
          </Button>
        </div>
      </div>

      <AddBookModal 
        open={isAddBookOpen} 
        onOpenChange={setIsAddBookOpen} 
        onSuccess={() => refetchStats()} 
      />

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <StatCard 
          icon={<Package className="text-blue-500" />} 
          label="Catalog Size" 
          value={stats?.totalBooks} 
          subValue={`${stats?.availableBooks} units available`}
          loading={isStatsLoading}
          trend="+12 this month"
          onClick={() => navigate('/admin/books')}
        />
        <StatCard 
          icon={<Users className="text-emerald-500" />} 
          label="Active Community" 
          value={stats?.totalMembers} 
          subValue="Registered individuals"
          loading={isStatsLoading}
          trend="+5.4% YoY"
          onClick={() => navigate('/admin/users')}
        />
        <StatCard 
          icon={<BookOpen className="text-amber-500" />} 
          label="Live Loans" 
          value={stats?.activeBorrowings} 
          subValue="Physical items out"
          loading={isStatsLoading}
          trend="82% Turnover"
          onClick={() => navigate('/admin/overdue')}
        />
        <StatCard 
          icon={<Clock className="text-primary" />} 
          label="Hold Queue" 
          value={0} 
          subValue="Student reservations"
          loading={isStatsLoading}
          trend="Live Queue"
          onClick={() => navigate('/admin/reservations')}
        />
        <StatCard 
          icon={<AlertTriangle className="text-rose-500" />} 
          label="Overdue Risk" 
          value={stats?.overdueBooks} 
          subValue="Immediate attention"
          loading={isStatsLoading}
          destructive={Number(stats?.overdueBooks) > 0}
          trend={`${stats?.overdueBooks} items delayed`}
          onClick={() => navigate('/admin/overdue')}
        />
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
           <Tabs defaultValue="transactions" className="w-full">
            <div className="flex items-center justify-between mb-4">
              <TabsList className="bg-muted/30 p-1.5 rounded-2xl h-14 border-none ring-1 ring-primary/5">
                <TabsTrigger value="transactions" className="rounded-xl px-8 font-black data-[state=active]:bg-background data-[state=active]:shadow-lg h-11">Transactions</TabsTrigger>
                <TabsTrigger value="overdue" className="rounded-xl px-8 font-black data-[state=active]:bg-background data-[state=active]:shadow-lg h-11">Overdue Action</TabsTrigger>
                <TabsTrigger value="inventory" className="rounded-xl px-8 font-black data-[state=active]:bg-background data-[state=active]:shadow-lg h-11">Inventory</TabsTrigger>
              </TabsList>
              <Button variant="ghost" size="sm" className="font-bold gap-1 text-primary hover:bg-primary/5">
                View Full Logs <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            <TabsContent value="transactions" className="mt-0">
              <Card className="border-none shadow-2xl bg-background/60 backdrop-blur-xl ring-1 ring-primary/5 rounded-3xl overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/20">
                    <TableRow className="border-none hover:bg-transparent">
                      <TableHead className="font-black text-[10px] uppercase tracking-widest text-muted-foreground py-4">Borrower</TableHead>
                      <TableHead className="font-black text-[10px] uppercase tracking-widest text-muted-foreground py-4">Book Title</TableHead>
                      <TableHead className="font-black text-[10px] uppercase tracking-widest text-muted-foreground py-4">Issued On</TableHead>
                      <TableHead className="font-black text-[10px] uppercase tracking-widest text-muted-foreground py-4">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentTransactionsData?.data?.content.map((tx: TransactionResponse) => (
                      <TableRow key={tx.id} className="border-primary/5 hover:bg-primary/2 transition-colors group">
                        <TableCell className="font-bold py-4">
                          <p className="font-black group-hover:text-primary transition-colors">{tx.userName || 'Member ID: ' + tx.userId}</p>
                          <p className="text-[10px] text-muted-foreground uppercase">{tx.id}</p>
                        </TableCell>
                        <TableCell className="font-bold max-w-[200px] truncate">{tx.bookTitle}</TableCell>
                        <TableCell className="font-medium text-muted-foreground">{new Date(tx.issueDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="rounded-lg font-black text-[10px] px-2 py-0.5">
                            {tx.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>

            <TabsContent value="overdue" className="mt-0">
               <Card className="border-none shadow-2xl bg-background/60 backdrop-blur-xl ring-1 ring-primary/5 rounded-3xl overflow-hidden p-6 text-center py-20">
                  <AlertTriangle className="h-12 w-12 text-rose-500 mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-black mb-1">Overdue Tracking</h3>
                  <p className="text-muted-foreground font-medium mb-6">Review items that have exceeded their return grace period.</p>
                  <Button onClick={() => navigate('/admin/overdue')} variant="outline" className="font-black border-2 rounded-xl">Initialize Enforcement Flow</Button>
               </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <Card className="border-none shadow-2xl bg-background/60 backdrop-blur-xl ring-1 ring-primary/5 rounded-3xl overflow-hidden h-fit">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-black flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-500" /> Hot Circulation
              </CardTitle>
              <CardDescription className="text-xs font-bold uppercase tracking-widest">Most borrowed titles this quarter</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               {popularBooksData?.data?.map((book: PopularBook, idx: number) => (
                 <div key={idx} className="flex items-center gap-4 group cursor-pointer p-2 rounded-2xl hover:bg-muted/40 transition-all">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center font-black text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-xs">
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-sm truncate group-hover:text-primary transition-colors">{book.title}</p>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">{book.author}</p>
                    </div>
                    <div className="text-right">
                       <p className="font-black text-xs">{book.borrowCount}</p>
                       <p className="text-[9px] font-bold text-muted-foreground uppercase">Loans</p>
                    </div>
                 </div>
               ))}
               <Button variant="ghost" className="w-full font-black text-xs gap-2 py-6 rounded-2xl border-2 border-dashed border-muted-foreground/20 hover:border-primary/20 hover:bg-primary/5">
                 Expand Full Analytics <BarChart3 className="h-4 w-4" />
               </Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-2xl bg-background/60 backdrop-blur-xl ring-1 ring-primary/5 rounded-3xl overflow-hidden h-fit">
            <CardHeader className="pb-4">
               <CardTitle className="text-lg font-black flex items-center gap-2">
                 <DollarSign className="h-5 w-5 text-emerald-500" /> Revenue Flow
               </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                  <span>Collected Fines</span>
                  <span className="text-emerald-600">Rs. {stats?.totalFinesCollected}</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                  <span>Pending Dues</span>
                  <span className="text-rose-500">Rs. {stats?.pendingFines}</span>
                </div>
                <Progress value={25} className="h-2 bg-rose-500/10 fill-rose-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value?: number
  subValue?: string
  loading?: boolean
  destructive?: boolean
  trend?: string
  onClick?: () => void
}

function StatCard({ 
  icon, 
  label, 
  value, 
  subValue, 
  loading, 
  destructive,
  trend,
  onClick
}: StatCardProps) {
  return (
    <Card 
      onClick={onClick}
      className={cn(
        "border-none shadow-2xl bg-background/60 backdrop-blur-xl ring-1 ring-primary/5 rounded-3xl overflow-hidden group hover:scale-[1.02] transition-all duration-500",
        onClick && "cursor-pointer hover:ring-primary/20",
        destructive && "ring-rose-500/20"
      )}
    >
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="p-3.5 rounded-2xl bg-background shadow-xs group-hover:scale-110 transition-transform duration-500">
            {icon}
          </div>
          <div className={cn(
            "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md",
            destructive ? "bg-rose-500/10 text-rose-600" : "bg-emerald-500/10 text-emerald-600"
          )}>
            {trend}
          </div>
        </div>
        <div>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{label}</p>
          {loading ? (
            <Skeleton className="h-9 w-20" />
          ) : (
            <h3 className={cn(
              "text-3xl font-black tracking-tighter",
              destructive ? "text-rose-600" : "text-foreground"
            )}>{value?.toLocaleString()}</h3>
          )}
          <p className="text-xs font-bold text-muted-foreground/60 mt-1">{subValue}</p>
        </div>
      </CardContent>
    </Card>
  )
}
