import { FileText, Download, PieChart, Users, BookOpen, AlertCircle, FileBarChart } from 'lucide-react'
import { Button } from '@/components/ui/button'

const REPORTS = [
  { id: 'inventory', title: 'Inventory Report', desc: 'Complete list of books and stock per branch.', icon: <BookOpen className="text-blue-500" /> },
  { id: 'borrowing', title: 'Borrowing Report', desc: 'Analysis of active and historical transactions.', icon: <PieChart className="text-emerald-500" /> },
  { id: 'fines', title: 'Fine Collection Report', desc: 'Summary of paid, pending, and waived fines.', icon: <FileBarChart className="text-amber-500" /> },
  { id: 'semester', title: 'Semester Summary', desc: 'Usage statistics for the current academic term.', icon: <Users className="text-purple-500" /> },
  { id: 'overdue', title: 'Overdue Master List', desc: 'List of all users currently holding overdue items.', icon: <AlertCircle className="text-rose-500" /> },
]

export function ReportsPage() {
  const getReportUrl = (id: string) => {
    const base = import.meta.env.VITE_API_BASE_URL || 'https://api.library.iomd.site/api'
    return `${base}/reports/${id}`
  }

  const handleDownload = (id: string) => {
    window.open(getReportUrl(id), '_blank')
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">System Reports</h1>
        <p className="text-gray-500 font-medium">Generate and download official library documentation.</p>
      </div>

      <div className="grid gap-4">
        {REPORTS.map((report) => (
          <div key={report.id} className="bg-white border border-gray-100 p-6 rounded-3xl hover:shadow-lg transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="h-14 w-14 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                {report.icon}
              </div>
              <div className="space-y-0.5">
                <h3 className="font-black text-gray-900">{report.title}</h3>
                <p className="text-xs text-gray-400 font-medium">{report.desc}</p>
              </div>
            </div>

            <Button 
              onClick={() => handleDownload(report.id)}
              className="h-10 px-6 rounded-xl font-bold bg-primary hover:bg-primary/90 text-xs gap-2 shrink-0"
            >
              <Download className="h-4 w-4" /> Download HTML
            </Button>
          </div>
        ))}
      </div>

      <div className="p-6 bg-blue-50 border border-blue-100 rounded-3xl flex gap-4">
        <div className="h-10 w-10 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0">
          <FileText className="h-5 w-5 text-blue-500" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-bold text-blue-900">Custom Reports</p>
          <p className="text-xs text-blue-700 leading-relaxed">
            Need a report that isn't listed here? Use the Filter & Export buttons on the Manage Books or User Management pages 
            to generate custom CSV datasets for further analysis in Excel or BI tools.
          </p>
        </div>
      </div>
    </div>
  )
}
