import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { bookService } from '@/features/books/services/bookService'
import { AddBookModal } from '@/features/books/components/AddBookModal'
import type { BookResponse, BookRequest } from '@/features/books/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Plus, Search, Pencil, Trash2, Loader2, BookOpen } from 'lucide-react'
import { toast } from 'sonner'

const CATEGORIES = [
  'Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology',
  'Literature', 'History', 'Geography', 'Economics', 'Business',
  'Engineering', 'Medicine', 'Art', 'General',
]

const bookSchema = z.object({
  title: z.string().min(2),
  author: z.string().min(2),
  isbn: z.string().min(10),
  publisher: z.string().optional(),
  edition: z.string().optional(),
  year: z.any().optional(),
  category: z.string().min(1),
  subject: z.string().optional(),
  description: z.string().optional(),
  coverImageUrl: z.string().optional(),
  language: z.string().optional(),
  totalPages: z.any().optional(),
  totalCopies: z.any().optional(),
})

type BookFormValues = z.infer<typeof bookSchema>

export function AdminBooksPage() {
  const [search, setSearch] = useState('')
  const [addOpen, setAddOpen] = useState(false)
  const [editBook, setEditBook] = useState<BookResponse | null>(null)
  const [deleteBook, setDeleteBook] = useState<BookResponse | null>(null)
  const [page, setPage] = useState(0)
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-books', search, page],
    queryFn: () => bookService.getAll({ title: search || undefined, page, size: 15 }),
  })

  const books = data?.data?.content || []
  const totalPages = data?.data?.totalPages || 1
  const total = data?.data?.totalElements || 0

  const deleteMutation = useMutation({
    mutationFn: (id: number) => bookService.deleteBook(id),
    onSuccess: () => {
      toast.success('Book deleted')
      qc.invalidateQueries({ queryKey: ['admin-books'] })
      setDeleteBook(null)
    },
    onError: (e: any) => toast.error(e.message),
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Books Catalog</h1>
          <p className="text-sm text-gray-500 mt-0.5">{total} books in the library</p>
        </div>
        <Button onClick={() => setAddOpen(true)} className="gap-2 bg-primary hover:bg-primary/90 w-fit">
          <Plus className="size-4" /> Add Book
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
        <Input
          placeholder="Search by title..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0) }}
          className="pl-9 bg-white border-gray-300"
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-12">#</TableHead>
              <TableHead>Title / Author</TableHead>
              <TableHead className="hidden md:table-cell">Category</TableHead>
              <TableHead className="hidden lg:table-cell">ISBN</TableHead>
              <TableHead className="text-center">Copies</TableHead>
              <TableHead className="text-center">Available</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                    ))}
                  </TableRow>
                ))
              : books.length === 0
              ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-16 text-gray-400">
                    <BookOpen className="size-8 mx-auto mb-2 opacity-30" />
                    No books found
                  </TableCell>
                </TableRow>
              )
              : books.map((book, i) => (
                <TableRow key={book.id} className="hover:bg-gray-50">
                  <TableCell className="text-gray-400 text-sm">{page * 15 + i + 1}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900 line-clamp-1">{book.title}</p>
                      <p className="text-xs text-gray-500">{book.author}</p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="secondary" className="text-xs">{book.category}</Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-xs text-gray-500 font-mono">{book.isbn}</TableCell>
                  <TableCell className="text-center text-sm">{book.totalCopies}</TableCell>
                  <TableCell className="text-center">
                    <span className={`text-sm font-medium ${book.availableCopies > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                      {book.availableCopies}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost" size="icon"
                        className="size-8 text-gray-400 hover:text-primary hover:bg-primary/5"
                        onClick={() => setEditBook(book)}
                      >
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost" size="icon"
                        className="size-8 text-gray-400 hover:text-red-500 hover:bg-red-50"
                        onClick={() => setDeleteBook(book)}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">Page {page + 1} of {totalPages}</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Previous</Button>
            <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>Next</Button>
          </div>
        </div>
      )}

      {/* Add Modal */}
      <AddBookModal open={addOpen} onOpenChange={setAddOpen} onSuccess={() => qc.invalidateQueries({ queryKey: ['admin-books'] })} />

      {/* Edit Modal */}
      {editBook && (
        <EditBookModal
          book={editBook}
          onClose={() => setEditBook(null)}
          onSuccess={() => { qc.invalidateQueries({ queryKey: ['admin-books'] }); setEditBook(null) }}
        />
      )}

      {/* Delete Confirm */}
      <Dialog open={!!deleteBook} onOpenChange={() => setDeleteBook(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Book</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            Are you sure you want to delete <span className="font-semibold">"{deleteBook?.title}"</span>? This cannot be undone.
          </p>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteBook(null)}>Cancel</Button>
            <Button
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => deleteBook && deleteMutation.mutate(deleteBook.id)}
            >
              {deleteMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function EditBookModal({ book, onClose, onSuccess }: { book: BookResponse; onClose: () => void; onSuccess: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<BookFormValues>({
    resolver: zodResolver(bookSchema) as any,
    defaultValues: {
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      publisher: book.publisher || '',
      edition: book.edition || '',
      category: book.category,
      subject: book.subject || '',
      description: book.description || '',
      coverImageUrl: book.coverImageUrl || '',
      year: book.year ?? '',
      language: book.language || 'English',
      totalPages: book.totalPages ?? '',
      totalCopies: book.totalCopies ?? '',
    },
  })

  const onSubmit = async (values: BookFormValues) => {
    setIsSubmitting(true)
    try {
      const payload = { ...values, year: values.year ? Number(values.year) : undefined, totalPages: values.totalPages ? Number(values.totalPages) : undefined } as BookRequest
      const res = await bookService.updateBook(book.id, payload)
      if (res.success) {
        // Auto-update inventory if totalCopies changed
        const newCopies = values.totalCopies ? Number(values.totalCopies) : undefined
        if (newCopies && newCopies !== book.totalCopies) {
          try {
            // Get inventory for this book and update first record
            const invRes = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:9090/api'}/books/${book.id}/availability`, {
              headers: { Authorization: `Bearer ${localStorage.getItem('library-auth') ? JSON.parse(localStorage.getItem('library-auth')!).state?.token : ''}` }
            })
            const invData = await invRes.json()
            if (invData.data?.branches?.[0]) {
              const branch = invData.data.branches[0]
              const diff = newCopies - book.totalCopies
              await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:9090/api'}/inventory/${branch.branchId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('library-auth') ? JSON.parse(localStorage.getItem('library-auth')!).state?.token : ''}` },
                body: JSON.stringify({ totalCopies: newCopies, availableCopies: Math.max(0, branch.availableCopies + diff) })
              })
            }
          } catch (_) { /* inventory update failed silently */ }
        }
        toast.success('Book updated')
        onSuccess()
      }
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Book</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="author" render={({ field }) => (
                <FormItem><FormLabel>Author</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="isbn" render={({ field }) => (
                <FormItem><FormLabel>ISBN</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="category" render={({ field }) => (
                <FormItem><FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="publisher" render={({ field }) => (
                <FormItem><FormLabel>Publisher</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="year" render={({ field }) => (
                <FormItem><FormLabel>Year</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="totalCopies" render={({ field }) => (
                <FormItem><FormLabel>Total Copies</FormLabel><FormControl><Input type="number" min={1} {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea className="resize-none" rows={3} {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="coverImageUrl" render={({ field }) => (
              <FormItem><FormLabel>Cover Image URL</FormLabel>
                <div className="flex gap-3 items-start">
                  <FormControl><Input placeholder="https://..." {...field} /></FormControl>
                  {field.value && (
                    <img
                      src={field.value}
                      alt="preview"
                      className="h-10 w-8 rounded object-cover shrink-0 border"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                    />
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )} />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90">
                {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : 'Save changes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
