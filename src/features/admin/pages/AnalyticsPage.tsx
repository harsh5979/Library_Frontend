import { useQuery } from '@tanstack/react-query'
import { adminService } from '../services/adminService'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, AreaChart, Area 
} from 'recharts'
import { TrendingUp, Users, IndianRupee, PieChart as PieIcon } from 'lucide-react'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

export function AnalyticsPage() {
  // Advanced Analytics restricted to SUPER_ADMIN on backend
  const { data: trendsData, isLoading: l1 } = useQuery({
    queryKey: ['analytics-trends'],
    queryFn: () => adminService.getBorrowingTrends(),
  })

  const { data: categoriesData, isLoading: l2 } = useQuery({
    queryKey: ['analytics-categories'],
    queryFn: () => adminService.getPopularCategories(),
  })

  const { data: finesData, isLoading: l3 } = useQuery({
    queryKey: ['analytics-fines'],
    queryFn: () => adminService.getFineCollectionAnalytics(),
  })

  const { data: activeUsersData, isLoading: l4 } = useQuery({
    queryKey: ['analytics-users'],
    queryFn: () => adminService.getActiveUsersAnalytics(),
  })

  const trendsDataRaw = trendsData?.data
  const trendsFormatted = trendsDataRaw?.months?.map((m: string, i: number) => ({
    date: m,
    count: trendsDataRaw.borrowingCounts[i] || 0
  })) ?? []

  const categories = categoriesData?.data ?? []

  const finesDataRaw = finesData?.data
  const finesFormatted = finesDataRaw?.months?.map((m: string, i: number) => ({
    date: m,
    amount: finesDataRaw.amounts[i] || 0
  })) ?? []

  const users = activeUsersData?.data?.map((u: any) => ({
    userName: u.fullName,
    borrowCount: u.totalBorrowings
  })) ?? []

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">System Analytics</h1>
        <p className="text-gray-500 font-medium">Deep insights into library traffic and collection health.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Borrowing Trends */}
        <Card className="rounded-3xl border-none shadow-xl shadow-gray-200/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
            <CardTitle className="text-base font-black flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" /> Borrowing Trends
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] min-h-[300px] pl-2">
            {l1 ? <Skeleton className="h-full w-full rounded-2xl" /> : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendsFormatted}>
                  <defs>
                    <linearGradient id="colorTrends" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                  <Area type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorTrends)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card className="rounded-3xl border-none shadow-xl shadow-gray-200/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
            <CardTitle className="text-base font-black flex items-center gap-2">
              <PieIcon className="h-5 w-5 text-emerald-500" /> Popular Categories
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] min-h-[300px]">
            {l2 ? <Skeleton className="h-full w-full rounded-2xl" /> : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categories}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="count"
                    nameKey="category"
                  >
                    {categories.map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Fine Collections */}
        <Card className="rounded-3xl border-none shadow-xl shadow-gray-200/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
            <CardTitle className="text-base font-black flex items-center gap-2">
              <IndianRupee className="h-5 w-5 text-amber-500" /> Revenue Flow
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] min-h-[300px]">
            {l3 ? <Skeleton className="h-full w-full rounded-2xl" /> : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={finesFormatted}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none' }} />
                  <Bar dataKey="amount" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* User Activity */}
        <Card className="rounded-3xl border-none shadow-xl shadow-gray-200/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
            <CardTitle className="text-base font-black flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-500" /> Top Active Users
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] min-h-[300px]">
            {l4 ? <Skeleton className="h-full w-full rounded-2xl" /> : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={users} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="userName" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} width={100} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                  <Bar dataKey="borrowCount" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={12} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
