import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Plus, BookPlus, Loader2 } from 'lucide-react'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { bookService } from '../services/bookService'
import type { BookRequest } from '../types'
import { toast } from 'sonner'

const bookSchema = z.object({
  title: z.string().min(2, "Title is required").max(200),
  author: z.string().min(2, "Author is required").max(150),
  isbn: z.string().min(10, "Valid ISBN is required").max(20),
  publisher: z.string().max(150).optional(),
  edition: z.string().max(20).optional(),
  year: z.any().optional(), // Use any to bypass coercion issues in inference
  category: z.string().min(1, "Category is required"),
  subject: z.string().max(100).optional(),
  description: z.string().optional(),
  coverImageUrl: z.string().optional(),
  language: z.string().max(30).optional(),
  totalPages: z.any().optional(),
})

type BookFormValues = z.infer<typeof bookSchema>

interface AddBookModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

const CATEGORIES = [
  "Computer Science",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Literature",
  "History",
  "Geography",
  "Economics",
  "Business",
  "Engineering",
  "Medicine",
  "Art",
  "General"
]

export function AddBookModal({ open, onOpenChange, onSuccess }: AddBookModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<BookFormValues>({
    resolver: zodResolver(bookSchema) as any,
    defaultValues: {
      title: '',
      author: '',
      isbn: '',
      publisher: '',
      edition: '',
      year: new Date().getFullYear(),
      category: '',
      subject: '',
      description: '',
      coverImageUrl: '',
      language: 'English',
      totalPages: 100
    }
  })

  const onSubmit = async (values: BookFormValues) => {
    try {
      setIsSubmitting(true)
      
      // Ensure numeric types for the backend
      const payload = {
        ...values,
        year: values.year ? Number(values.year) : undefined,
        totalPages: values.totalPages ? Number(values.totalPages) : undefined,
      } as BookRequest

      const response = await bookService.createBook(payload)
      if (response.success) {
        toast.success(`${values.title} has been added to the catalog.`)
        form.reset()
        onOpenChange(false)
        onSuccess?.()
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? (error as any).response?.data?.message || error.message 
        : "Something went wrong. Please try again."
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border-none shadow-2xl p-0">
        <div className="bg-linear-to-br from-primary/5 via-background to-blue-500/5 p-8">
          <DialogHeader className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                <BookPlus className="h-6 w-6" />
              </div>
              <DialogTitle className="text-3xl font-black tracking-tighter">Register New Title</DialogTitle>
            </div>
            <DialogDescription className="font-medium text-muted-foreground">
              Add a new resource to the global repository. Ensure ISBN accuracy for automated metadata tracking.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">Book Title *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Clean Code" className="h-12 rounded-xl font-bold bg-background/50" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="author"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">Author *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Robert C. Martin" className="h-12 rounded-xl font-bold bg-background/50" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isbn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">ISBN-10/13 *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 978-0132350884" className="h-12 rounded-xl font-bold bg-background/50" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">Category *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 rounded-xl font-bold bg-background/50">
                            <SelectValue placeholder="Select classification" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xl font-bold">
                          {CATEGORIES.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="publisher"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">Publisher</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Prentice Hall" className="h-12 rounded-xl font-bold bg-background/50" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">Pub. Year</FormLabel>
                      <FormControl>
                        <Input type="number" className="h-12 rounded-xl font-bold bg-background/50" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Comprehensive summary of the resource..." 
                        className="min-h-[100px] rounded-2xl font-bold bg-background/50 resize-none" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">Language</FormLabel>
                      <FormControl>
                        <Input className="h-12 rounded-xl font-bold bg-background/50" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="totalPages"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">Total Pages</FormLabel>
                      <FormControl>
                        <Input type="number" className="h-12 rounded-xl font-bold bg-background/50" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="coverImageUrl"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">Cover Image URL</FormLabel>
                      <div className="flex gap-3 items-start">
                        <FormControl>
                          <Input placeholder="https://..." className="h-12 rounded-xl font-bold bg-background/50" {...field} />
                        </FormControl>
                        {field.value && (
                          <img
                            src={field.value}
                            alt="preview"
                            className="h-12 w-9 rounded object-cover shrink-0 border"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                          />
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter className="pt-8">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full md:w-auto h-14 px-12 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 bg-linear-to-r from-primary to-blue-600 border-none transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Synchronizing...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-5 w-5" />
                      Finalize Entry
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
