import { useState } from 'react'
import { reportService } from '@/features/reports/services/reportService'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Download, 
  PieChart, 
  TrendingUp, 
  Clock, 
  Coins, 
  Box,
  ChevronRight,
  Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export function AdminReportsPage() {
  const [downloading, setDownloading] = useState<string | null>(null)

  const handleDownload = async (type: string, fn: () => Promise<any>, filename: string) => {
    setDownloading(type)
    try {
      const data = await fn()
      const blob = new Blob([data], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      toast.success(`${type} generated successfully`)
    } catch (error) {
      toast.error(`Failed to generate ${type}`)
    } finally {
      setDownloading(null)
    }
  }

  const reportTypes = [
    {
      id: 'inventory',
      title: 'Inventory Report',
      description: 'Complete audit of books, branches, and availability status.',
      icon: <Box className="h-6 w-6" />,
      color: 'blue',
      fn: reportService.getInventoryReport
    },
    {
      id: 'borrowing',
      title: 'Borrowing Activity',
      description: 'Historical data of all book issues, returns, and renewals.',
      icon: <TrendingUp className="h-6 w-6" />,
      color: 'emerald',
      fn: reportService.getBorrowingReport
    },
    {
      id: 'fines',
      title: 'Financial Summary',
      description: 'Analysis of collected fines, pending payments, and waivers.',
      icon: <Coins className="h-6 w-6" />,
      color: 'amber',
      fn: reportService.getFineReport
    },
    {
      id: 'overdue',
      title: 'Overdue Books',
      description: 'List of currently overdue items with borrower details.',
      icon: <Clock className="h-6 w-6" />,
      color: 'rose',
      fn: reportService.getOverdueReport
    },
    {
       id: 'semester',
       title: 'Semester Analysis',
       description: 'Long-term trend monitoring and academic year metrics.',
       icon: <PieChart className="h-6 w-6" />,
       color: 'indigo',
       fn: reportService.getSemesterReport
    }
  ]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-4xl font-black tracking-tight">System Intelligence</h1>
        <p className="text-muted-foreground font-medium mt-1">Generate comprehensive reports and data exports for library administration.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reportTypes.map((report) => (
          <Card key={report.id} className="group relative overflow-hidden rounded-3xl border-none shadow-xl ring-1 ring-primary/5 transition-all hover:shadow-2xl hover:shadow-primary/10">
            <div className={cn(
                "absolute top-0 right-0 h-32 w-32 -mr-8 -mt-8 rounded-full opacity-10 transition-transform group-hover:scale-150 duration-700",
                report.color === 'blue' && "bg-blue-500",
                report.color === 'emerald' && "bg-emerald-500",
                report.color === 'amber' && "bg-amber-500",
                report.color === 'rose' && "bg-rose-500",
                report.color === 'indigo' && "bg-indigo-500"
            )} />
            
            <CardHeader className="pb-4">
              <div className={cn(
                  "h-12 w-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:-rotate-6 duration-300",
                  report.color === 'blue' && "bg-blue-500/10 text-blue-600",
                  report.color === 'emerald' && "bg-emerald-500/10 text-emerald-600",
                  report.color === 'amber' && "bg-amber-500/10 text-amber-600",
                  report.color === 'rose' && "bg-rose-500/10 text-rose-600",
                  report.color === 'indigo' && "bg-indigo-500/10 text-indigo-600"
              )}>
                {report.icon}
              </div>
              <CardTitle className="text-xl font-black mt-4">{report.title}</CardTitle>
              <CardDescription className="font-medium">{report.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full h-12 rounded-2xl font-black gap-2 mt-2 bg-muted/50 text-foreground hover:bg-primary hover:text-white border-none transition-all shadow-none"
                onClick={() => handleDownload(report.title, report.fn, report.id)}
                disabled={downloading === report.title}
              >
                {downloading === report.title ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                Export as CSV
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="rounded-3xl border-none shadow-xl bg-linear-to-br from-primary/5 to-blue-500/5 ring-1 ring-primary/10">
        <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center text-primary shadow-inner">
               <TrendingUp className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-2xl font-black">Live Analytics Available</h3>
              <p className="font-medium text-muted-foreground">Detailed visual dashboard for real-time monitoring of campus-wide circulation.</p>
            </div>
          </div>
          <Button className="h-14 px-8 rounded-2xl font-black bg-primary text-white shadow-xl shadow-primary/20 gap-2 shrink-0">
            Enter BI Terminal <ChevronRight className="h-5 w-5" />
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
