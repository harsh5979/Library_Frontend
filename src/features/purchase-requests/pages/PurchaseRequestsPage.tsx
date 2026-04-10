import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { purchaseRequestService } from '../services/purchaseRequestService'
import { useAuth } from '@/store/useAuth'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { BookPlus, CheckCircle2, XCircle, Clock, Search, ShoppingBag, Plus, Info } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export function PurchaseRequestsPage() {
  const { user } = useAuth()
  const qc = useQueryClient()
  const [isRequestOpen, setIsRequestOpen] = useState(false)
  const [formData, setFormData] = useState({ title: '', author: '', isbn: '', reason: '' })

  const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'LIBRARIAN'

  const { data: requestsData, isLoading } = useQuery({
    queryKey: ['purchase-requests'],
    queryFn: () => isAdmin ? purchaseRequestService.getAll() : purchaseRequestService.getMyRequests(),
  })

  const createMutation = useMutation({
    mutationFn: (data: typeof formData) => purchaseRequestService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['purchase-requests'] })
      setIsRequestOpen(false)
      setFormData({ title: '', author: '', isbn: '', reason: '' })
      toast.success('Purchase request submitted!')
    },
    onError: (e: any) => toast.error(e.message),
  })

  const approveMutation = useMutation({
    mutationFn: (id: number) => purchaseRequestService.approve(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['purchase-requests'] }); toast.success('Approved!') },
  })

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) => purchaseRequestService.reject(id, reason),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['purchase-requests'] }); toast.success('Rejected.') },
  })

  const requests = requestsData?.data ?? []

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Book Procurement</h1>
          <p className="text-gray-500 font-medium">Recommend new titles for the library collection.</p>
        </div>
        
        {!isAdmin && (
          <Button onClick={() => setIsRequestOpen(true)} className="h-11 px-6 rounded-2xl font-black bg-primary hover:bg-primary/90 gap-2 shadow-lg shadow-primary/20">
            <Plus className="h-5 w-5" /> New Request
          </Button>
        )}
      </div>

      <div className="grid gap-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)
        ) : requests.length === 0 ? (
          <div className="py-20 text-center bg-gray-50 border-2 border-dashed rounded-3xl">
            <ShoppingBag className="h-12 w-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 font-bold">No purchase requests found.</p>
          </div>
        ) : (
          requests.map(req => (
            <div key={req.id} className="bg-white border border-gray-100 p-6 rounded-3xl hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex gap-5">
                <div className="h-14 w-14 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                  <BookPlus className="h-7 w-7 text-gray-400" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-black text-gray-900 leading-none">{req.title}</h3>
                    <Badge variant="outline" className={cn(
                      'text-[9px] font-black uppercase px-2',
                      req.status === 'PENDING' ? 'text-amber-500 border-amber-100 bg-amber-50/50' : 
                      req.status === 'APPROVED' ? 'text-emerald-500 border-emerald-100 bg-emerald-50/50' : 
                      'text-rose-500 border-rose-100 bg-rose-50/50'
                    )}>
                      {req.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 font-bold">by {req.author} {req.isbn && `· ISBN: ${req.isbn}`}</p>
                  <p className="text-xs text-gray-400 italic mt-2">"{req.reason}"</p>
                  <div className="flex items-center gap-4 text-[10px] text-gray-400 font-bold mt-2">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {new Date(req.createdAt).toLocaleDateString()}</span>
                    <span>Requested by: {req.requesterName}</span>
                  </div>
                </div>
              </div>

              {isAdmin && req.status === 'PENDING' && (
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={() => approveMutation.mutate(req.id)} className="h-9 px-4 rounded-xl font-bold border-emerald-200 text-emerald-600 hover:bg-emerald-50">
                    <CheckCircle2 className="h-4 w-4 mr-2" /> Approve
                  </Button>
                  <Button variant="outline" onClick={() => rejectMutation.mutate({ id: req.id, reason: 'Out of budget/duplicate' })} className="h-9 px-4 rounded-xl font-bold border-rose-100 text-rose-500 hover:bg-rose-50">
                    <XCircle className="h-4 w-4 mr-2" /> Reject
                  </Button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <Dialog open={isRequestOpen} onOpenChange={setIsRequestOpen}>
        <DialogContent className="max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle>Suggest a New Book</DialogTitle>
            <DialogDescription>Let us know what's missing from our library.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Book Title *</label>
                <Input placeholder="Full title of the book" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Author *</label>
                <Input placeholder="Main author" value={formData.author} onChange={e => setFormData({ ...formData, author: e.target.value })} className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">ISBN (Optional)</label>
                <Input placeholder="10 or 13 digit" value={formData.isbn} onChange={e => setFormData({ ...formData, isbn: e.target.value })} className="rounded-xl" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Reason for Request *</label>
              <Textarea placeholder="How will this book help students/faculty?" value={formData.reason} onChange={e => setFormData({ ...formData, reason: e.target.value })} className="rounded-xl resize-none" rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsRequestOpen(false)} className="rounded-xl font-bold">Cancel</Button>
            <Button 
              disabled={!formData.title || !formData.author || !formData.reason || createMutation.isPending} 
              onClick={() => createMutation.mutate(formData)} 
              className="rounded-xl font-black h-11 px-8"
            >
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
