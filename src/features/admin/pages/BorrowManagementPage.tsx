import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { borrowService, type TransactionResponse } from '@/features/borrowing/services/borrowService'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { RotateCcw, Search, Loader2, BookOpen, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export function BorrowManagementPage() {
  const qc = useQueryClient()
  const [search, setSearch] = useState('')
  const [returningIds, setReturningIds] = useState<Set<number>>(new Set())

  const { data, isLoading } = useQuery({
    queryKey: ['admin-borrows'],
    queryFn: () => borrowService.getAllTransactions(0, 500),
    // refetch every 30s so status stays fresh
    refetchInterval: 30_000,
  })

  const returnMutation = useMutation({
    mutationFn: (id: number) => {
      setReturningIds(prev => new Set(prev).add(id))
      return borrowService.returnBook(id)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-borrows'] })
      qc.invalidateQueries({ queryKey: ['my-borrowed'] })
      qc.invalidateQueries({ queryKey: ['my-borrowings-active'] })
      qc.invalidateQueries({ queryKey: ['my-history'] })
      toast.success('Book returned successfully.')
    },
    onError: (e: Error, id) => {
      setReturningIds(prev => { const s = new Set(prev); s.delete(id); return s })
      toast.error(e.message)
    },
  })

  const acceptReturnMutation = useMutation({
    mutationFn: (id: number) => borrowService.acceptReturn(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-borrows'] })
      qc.invalidateQueries({ queryKey: ['my-borrowed'] })
      qc.invalidateQueries({ queryKey: ['my-history'] })
      toast.success('Return accepted. Inventory updated.')
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const all: TransactionResponse[] = data?.data?.content ?? []
  const filtered = all.filter(t =>
    !search ||
    t.bookTitle.toLowerCase().includes(search.toLowerCase()) ||
    t.userName.toLowerCase().includes(search.toLowerCase())
  )

  const active  = filtered.filter(t => t.status === 'BORROWED' || t.status === 'RETURN_REQUESTED')
  const history = filtered.filter(t => t.status !== 'BORROWED' && t.status !== 'RETURN_REQUESTED')

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Borrow Management</h1>
          <p className="text-sm text-gray-500">{active.length} active · {history.length} returned</p>
        </div>
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <Input placeholder="Search book or user..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-white border-gray-300" />
        </div>
      </div>

      <Tabs defaultValue="active">
        <TabsList className="bg-gray-100 rounded-xl p-1 h-auto gap-1">
          <TabsTrigger value="active"  className="rounded-lg px-4 py-1.5 text-sm font-semibold">Active ({active.length})</TabsTrigger>
          <TabsTrigger value="history" className="rounded-lg px-4 py-1.5 text-sm font-semibold">Returned ({history.length})</TabsTrigger>
        </TabsList>

        {/* ACTIVE LOANS */}
        <TabsContent value="active" className="mt-4">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-8">#</TableHead>
                  <TableHead>Book</TableHead>
                  <TableHead className="hidden sm:table-cell">User</TableHead>
                  <TableHead className="hidden md:table-cell">Issued</TableHead>
                  <TableHead>Due</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading
                  ? Array.from({ length: 4 }).map((_, i) => (
                    <TableRow key={i}>{Array.from({ length: 6 }).map((_, j) => <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>)}</TableRow>
                  ))
                  : active.length === 0
                  ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12 text-gray-400">
                        <BookOpen className="size-7 mx-auto mb-2 opacity-30" />No active loans
                      </TableCell>
                    </TableRow>
                  )
                  : active.map((t, i) => {
                    const overdue = new Date(t.dueDate) < new Date()
                    const isReturning = returningIds.has(t.id)
                    return (
                      <TableRow key={t.id} className={cn('hover:bg-gray-50', t.status === 'RETURN_REQUESTED' && 'bg-amber-50/50')}>
                        <TableCell className="text-gray-400 text-xs">{i + 1}</TableCell>
                        <TableCell>
                          <p className="font-medium text-gray-900 text-sm line-clamp-1">{t.bookTitle}</p>
                          <p className="text-xs text-gray-400 sm:hidden">{t.userName}</p>
                          {t.status === 'RETURN_REQUESTED' && (
                            <Badge className="mt-0.5 text-[9px] bg-amber-100 text-amber-700 border-amber-200 px-1">Return Requested</Badge>
                          )}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-sm text-gray-600">{t.userName}</TableCell>
                        <TableCell className="hidden md:table-cell text-xs text-gray-400">{new Date(t.issueDate).toLocaleDateString()}</TableCell>
                        <TableCell className={cn('text-xs font-medium', overdue ? 'text-red-600' : 'text-gray-500')}>
                          {new Date(t.dueDate).toLocaleDateString()}
                          {overdue && <Badge className="ml-1 text-[9px] bg-red-100 text-red-600 border-red-200 px-1">Overdue</Badge>}
                        </TableCell>
                        <TableCell className="text-right">
                          {t.status === 'RETURN_REQUESTED' ? (
                            <Button
                              size="sm" variant="outline"
                              className="h-7 gap-1 text-xs font-bold border-emerald-400 text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                              onClick={() => acceptReturnMutation.mutate(t.id)}
                              disabled={acceptReturnMutation.isPending && acceptReturnMutation.variables === t.id}
                            >
                              {acceptReturnMutation.isPending && acceptReturnMutation.variables === t.id
                                ? <Loader2 className="size-3 animate-spin" />
                                : <CheckCircle2 className="size-3" />
                              }
                              <span className="hidden sm:inline">Accept Return</span>
                            </Button>
                          ) : (
                            <Button
                              size="sm" variant="outline"
                              className="h-7 gap-1 text-xs font-bold border-gray-300 text-gray-600 hover:bg-gray-50"
                              onClick={() => returnMutation.mutate(t.id)}
                              disabled={isReturning}
                            >
                              {isReturning ? <Loader2 className="size-3 animate-spin" /> : <RotateCcw className="size-3" />}
                              <span className="hidden sm:inline">{isReturning ? 'Returning...' : 'Return'}</span>
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })
                }
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* HISTORY */}
        <TabsContent value="history" className="mt-4">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Book</TableHead>
                  <TableHead className="hidden sm:table-cell">User</TableHead>
                  <TableHead className="hidden md:table-cell">Issued</TableHead>
                  <TableHead>Returned</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading
                  ? Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>{Array.from({ length: 5 }).map((_, j) => <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>)}</TableRow>
                  ))
                  : history.length === 0
                  ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-10 text-gray-400">No return history yet</TableCell>
                    </TableRow>
                  )
                  : history.map(t => (
                    <TableRow key={t.id} className="hover:bg-gray-50">
                      <TableCell>
                        <p className="font-medium text-gray-900 text-sm line-clamp-1">{t.bookTitle}</p>
                        <p className="text-xs text-gray-400 sm:hidden">{t.userName}</p>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-sm text-gray-600">{t.userName}</TableCell>
                      <TableCell className="hidden md:table-cell text-xs text-gray-400">{new Date(t.issueDate).toLocaleDateString()}</TableCell>
                      <TableCell className="text-xs text-emerald-600 font-medium">{t.returnDate ? new Date(t.returnDate).toLocaleDateString() : '—'}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn('text-[10px] font-bold',
                          t.status === 'RETURNED' ? 'text-emerald-600 border-emerald-200 bg-emerald-50' : 'text-red-600 border-red-200 bg-red-50'
                        )}>
                          <CheckCircle2 className="size-2.5 mr-1 inline" />{t.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
