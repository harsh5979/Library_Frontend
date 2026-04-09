import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { adminService } from '../services/adminService'
import { AddBookModal } from '@/features/books/components/AddBookModal'
import { borrowService, type TransactionResponse } from '@/features/borrowing/services/borrowService'
import { type PopularBook } from '../types'
import { cn } from '@/lib/utils'
import { Users, BookOpen, AlertTriangle, TrendingUp, Package, Plus, ArrowRight, Clock, BarChart3 } from 'lucide-react'
// import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'

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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Real-time overview of your library.</p>
        </div>
        <Button
          onClick={() => setIsAddBookOpen(true)}
          className="h-10 px-5 font-bold rounded-xl bg-primary hover:bg-primary/90 w-fit"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Book
        </Button>
      </div>

      <AddBookModal
        open={isAddBookOpen}
        onOpenChange={setIsAddBookOpen}
        onSuccess={() => refetchStats()}
      />

      {/* KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <StatCard icon={<Package className="text-blue-500" />} label="Total Books" value={stats?.totalBooks} subValue={`${stats?.availableBooks} available`} loading={isStatsLoading} onClick={() => navigate('/admin/books')} />
        <StatCard icon={<Users className="text-emerald-500" />} label="Members" value={stats?.totalMembers} subValue="Registered" loading={isStatsLoading} onClick={() => navigate('/admin/users')} />
        <StatCard icon={<BookOpen className="text-amber-500" />} label="Active Loans" value={stats?.activeBorrowings} subValue="Currently out" loading={isStatsLoading} onClick={() => navigate('/admin/borrows')} />
        <StatCard icon={<Clock className="text-primary" />} label="Reservations" value={0} subValue="In queue" loading={isStatsLoading} onClick={() => navigate('/admin/reservations')} />
        <StatCard icon={<AlertTriangle className="text-rose-500" />} label="Overdue" value={stats?.overdueBooks} subValue="Need attention" loading={isStatsLoading} destructive={Number(stats?.overdueBooks) > 0} onClick={() => navigate('/admin/overdue')} />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Analytics', path: '/admin/analytics', icon: <BarChart3 className="h-4 w-4" /> },
          { label: 'Manage Books', path: '/admin/books', icon: <BookOpen className="h-4 w-4" /> },
          { label: 'Reservations', path: '/admin/reservations', icon: <Clock className="h-4 w-4" /> },
          { label: 'Borrows', path: '/admin/borrows', icon: <Package className="h-4 w-4" /> },
        ].map(a => (
          <Button key={a.path} variant="outline" className="h-12 gap-2 font-semibold rounded-xl border-gray-200 hover:border-primary/40 hover:bg-primary/5 justify-start px-4" onClick={() => navigate(a.path)}>
            {a.icon}{a.label}
          </Button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b bg-gray-50 flex items-center justify-between">
              <h2 className="font-semibold text-gray-700 text-sm">Recent Transactions</h2>
              <Button variant="ghost" size="sm" className="text-xs text-primary font-bold h-7" onClick={() => navigate('/admin/borrows')}>View all <ArrowRight className="h-3 w-3 ml-1" /></Button>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="text-xs">Borrower</TableHead>
                    <TableHead className="text-xs">Book</TableHead>
                    <TableHead className="text-xs hidden sm:table-cell">Date</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isStatsLoading
                    ? Array.from({ length: 4 }).map((_, i) => <TableRow key={i}>{Array.from({ length: 4 }).map((_, j) => <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>)}</TableRow>)
                    : recentTransactionsData?.data?.content?.map((tx: TransactionResponse) => (
                      <TableRow key={tx.id} className="hover:bg-gray-50">
                        <TableCell className="text-sm font-medium text-gray-900">{tx.userName}</TableCell>
                        <TableCell className="text-sm text-gray-600 max-w-[140px] truncate">{tx.bookTitle}</TableCell>
                        <TableCell className="text-xs text-gray-400 hidden sm:table-cell">{new Date(tx.issueDate).toLocaleDateString()}</TableCell>
                        <TableCell><Badge variant="secondary" className="text-[10px] font-bold">{tx.status}</Badge></TableCell>
                      </TableRow>
                    ))
                  }
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {/* Popular Books */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b bg-gray-50">
            <h2 className="font-semibold text-gray-700 text-sm flex items-center gap-2"><TrendingUp className="h-4 w-4 text-emerald-500" /> Popular Books</h2>
          </div>
          <div className="p-3 space-y-2">
            {popularBooksData?.data?.map((book: PopularBook, idx: number) => (
              <div key={idx} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                <span className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-black text-primary shrink-0">{idx + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{book.title}</p>
                  <p className="text-xs text-gray-400 truncate">{book.author}</p>
                </div>
                <span className="text-xs font-bold text-gray-500 shrink-0">{book.borrowCount} loans</span>
              </div>
            ))}
          </div>
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
  onClick?: () => void
}

function StatCard({ icon, label, value, subValue, loading, destructive, onClick }: StatCardProps) {
  return (
    <div onClick={onClick} className={cn('bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-primary/40 hover:shadow-sm transition-all', destructive && 'border-red-200 bg-red-50/30')}>
      <div className="flex items-center justify-between mb-3">
        <div className="p-2 rounded-lg bg-gray-50">{icon}</div>
      </div>
      {loading ? <Skeleton className="h-7 w-16 mb-1" /> : <p className={cn('text-2xl font-bold', destructive ? 'text-red-600' : 'text-gray-900')}>{value?.toLocaleString() ?? '—'}</p>}
      <p className="text-xs font-semibold text-gray-500 mt-0.5">{label}</p>
      {subValue && <p className="text-[10px] text-gray-400 mt-0.5">{subValue}</p>}
    </div>
  )
}
