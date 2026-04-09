import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { readingListService } from '../services/readingListService'
import { useAuth } from '@/store/useAuth'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { BookOpen, Plus, Trash2, LayoutGrid, BookMarked, User as UserIcon, MoreHorizontal } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export function ReadingListsPage() {
  const { user } = useAuth()
  const qc = useQueryClient()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newListTitle, setNewListTitle] = useState('')
  const [newListDesc, setNewListDesc] = useState('')

  const isFaculty = user?.role === 'FACULTY' || user?.role === 'SUPER_ADMIN'

  const { data: publicListsData, isLoading: isPublicLoading } = useQuery({
    queryKey: ['reading-lists-public'],
    queryFn: () => readingListService.getAllPublic(),
  })

  const { data: myListsData, isLoading: isMyLoading } = useQuery({
    queryKey: ['reading-lists-my'],
    queryFn: () => readingListService.getMyLists(),
    enabled: isFaculty,
  })

  const createMutation = useMutation({
    mutationFn: (data: { title: string; description: string }) => readingListService.create({ ...data, isPublic: true }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reading-lists-my'] })
      qc.invalidateQueries({ queryKey: ['reading-lists-public'] })
      setIsCreateOpen(false)
      setNewListTitle('')
      setNewListDesc('')
      toast.success('Reading list created!')
    },
    onError: (e: any) => toast.error(e.message),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => readingListService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reading-lists-my'] })
      qc.invalidateQueries({ queryKey: ['reading-lists-public'] })
      toast.success('Reading list deleted.')
    },
  })

  const publicLists = publicListsData?.data ?? []
  const myLists     = myListsData?.data ?? []

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Academic Reading Lists</h1>
          <p className="text-gray-500 font-medium mt-1">Curated collections from faculty members.</p>
        </div>
        
        {isFaculty && (
          <Button onClick={() => setIsCreateOpen(true)} className="h-11 px-6 rounded-2xl font-black bg-primary hover:bg-primary/90 gap-2 shadow-lg shadow-primary/20">
            <Plus className="h-5 w-5" /> New Collection
          </Button>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <SectionHeader icon={<BookMarked className="text-primary" />} title="Browse Public Lists" count={publicLists.length} />
          
          <div className="grid sm:grid-cols-2 gap-4">
            {isPublicLoading ? (
              Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-40 w-full rounded-2xl" />)
            ) : publicLists.length === 0 ? (
              <div className="col-span-full py-12 text-center bg-gray-50 border-2 border-dashed rounded-3xl">
                <p className="text-gray-400 font-bold">No public lists available yet.</p>
              </div>
            ) : (
              publicLists.map(list => (
                <ListCard key={list.id} list={list} />
              ))
            )}
          </div>
        </div>

        {isFaculty && (
          <div className="space-y-6">
            <SectionHeader icon={<LayoutGrid className="text-emerald-500" />} title="My Collections" count={myLists.length} />
            
            <div className="space-y-3">
              {isMyLoading ? (
                Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-2xl" />)
              ) : myLists.length === 0 ? (
                <div className="p-6 text-center bg-emerald-50/50 border border-emerald-100 rounded-3xl">
                  <p className="text-emerald-700 text-xs font-bold">You haven't created any lists.</p>
                </div>
              ) : (
                myLists.map(list => (
                  <div key={list.id} className="group bg-white border border-gray-100 p-4 rounded-2xl flex items-center justify-between hover:border-emerald-200 hover:shadow-sm transition-all">
                    <div className="min-w-0">
                      <p className="font-bold text-gray-900 truncate">{list.title}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{list.books?.length || 0} books</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(list.id)} className="text-gray-300 hover:text-rose-500 hover:bg-rose-50 h-8 w-8 rounded-lg group-hover:opacity-100 opacity-0 transition-opacity">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle>Create New Collection</DialogTitle>
            <DialogDescription>Add a title and description for your curriculum list.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-400 ml-1">List Title</label>
              <Input placeholder="e.g. Computer Science - Semester 1" value={newListTitle} onChange={e => setNewListTitle(e.target.value)} className="rounded-xl h-12" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-400 ml-1">Description</label>
              <Input placeholder="Essential reading for discrete mathematics..." value={newListDesc} onChange={e => setNewListDesc(e.target.value)} className="rounded-xl h-12" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsCreateOpen(false)} className="rounded-xl font-bold">Cancel</Button>
            <Button disabled={!newListTitle || createMutation.isPending} onClick={() => createMutation.mutate({ title: newListTitle, description: newListDesc })} className="rounded-xl font-black h-11 px-8">
              Create List
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function SectionHeader({ icon, title, count }: { icon: React.ReactNode; title: string, count: number }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-white border border-gray-100 shadow-xs flex items-center justify-center">{icon}</div>
        <h2 className="text-lg font-black text-gray-900 tracking-tight">{title}</h2>
      </div>
      <Badge variant="secondary" className="font-black bg-gray-100 text-gray-400">{count}</Badge>
    </div>
  )
}

function ListCard({ list }: { list: any }) {
  return (
    <div className="group bg-white border border-gray-100 p-6 rounded-3xl hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all relative overflow-hidden">
      <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
        <BookOpen className="h-20 w-20" />
      </div>
      
      <div className="space-y-4 relative z-10">
        <div className="space-y-1">
          <h3 className="font-black text-gray-900 leading-none group-hover:text-primary transition-colors">{list.title}</h3>
          <p className="text-xs text-gray-400 font-medium line-clamp-2">{list.description}</p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
              <UserIcon className="h-3 w-3 text-primary" />
            </div>
            <span className="text-[10px] font-bold text-gray-500">{list.creatorName || 'Faculty'}</span>
          </div>
          <span className="text-[10px] font-black uppercase text-primary tracking-widest bg-primary/10 px-2 py-1 rounded-lg">
            {list.books?.length || 0} Books
          </span>
        </div>
      </div>
    </div>
  )
}
