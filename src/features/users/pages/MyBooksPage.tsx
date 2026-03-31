import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { borrowService } from '@/features/borrowing/services/borrowService'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar, 
  Clock, 
  RotateCcw, 
  BookOpen, 
  ArrowLeft, 
  Library
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useToast } from '@/hooks/use-toast'
import { Skeleton } from '@/components/ui/skeleton'

export function MyBooksPage() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data: borrowedResponse, isLoading } = useQuery({
    queryKey: ['my-borrowed'],
    queryFn: () => borrowService.getMyBorrowings(),
  })

  const returnMutation = useMutation({
    mutationFn: (id: number) => borrowService.returnBook(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-borrowed'] })
      queryClient.invalidateQueries({ queryKey: ['my-history'] })
      toast({
        title: "Book Returned",
        description: "Thank you for returning the book on time!",
      })
    }
  })

  if (isLoading) return <MyBooksSkeleton />

  const activeLoans = borrowedResponse?.data?.content || []

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-24 px-4 py-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight flex items-center gap-3">
            <Library className="h-10 w-10 text-primary" />
            My Collection
          </h1>
          <p className="text-muted-foreground font-medium text-lg mt-2 italic font-serif">
            Managing your borrowed treasures and literary history
          </p>
        </div>
        <Button size="lg" asChild className="font-bold shadow-xl shadow-primary/20 bg-linear-to-r from-primary to-blue-600 rounded-xl">
          <Link to="/" className="gap-2">
            <ArrowLeft className="h-5 w-5" /> Back to Library
          </Link>
        </Button>
      </div>

      {/* Active Loans Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
            <BookOpen className="h-6 w-6" />
          </div>
          <h2 className="text-3xl font-black tracking-tight">Currently Reading</h2>
          <Badge className="ml-2 px-3 py-1 font-bold rounded-lg text-sm">{activeLoans.length}</Badge>
        </div>

        {activeLoans.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeLoans.map((loan: { id: number; bookTitle: string; bookAuthor?: string; bookCover?: string; dueDate: string; issueDate: string }) => (
              <Card key={loan.id} className="group border-none shadow-2xl bg-background/60 backdrop-blur-xl ring-1 ring-primary/5 hover:ring-primary/20 transition-all rounded-3xl overflow-hidden animate-in zoom-in-95 duration-500">
                <div className="relative aspect-video">
                  <img 
                    src={loan.bookCover || `https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=400&fit=crop`} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    alt={loan.bookTitle} 
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-black text-white line-clamp-1">{loan.bookTitle}</h3>
                    <p className="text-white/70 text-sm font-bold flex items-center gap-1">
                      by {loan.bookAuthor || 'Unknown Author'}
                    </p>
                  </div>
                </div>
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-2xl bg-muted/30 border border-muted-foreground/10">
                      <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-1">Due Date</p>
                      <p className="font-black text-rose-500 flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {new Date(loan.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="p-3 rounded-2xl bg-muted/30 border border-muted-foreground/10">
                      <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-1">Issue Date</p>
                      <p className="font-black flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(loan.issueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 pt-2">
                    <Button 
                      className="font-bold h-11 rounded-xl shadow-lg shadow-emerald-500/10" 
                      onClick={() => returnMutation.mutate(loan.id)}
                      disabled={returnMutation.isPending}
                    >
                      <RotateCcw className="mr-2 h-4 w-4" /> Return Book
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-2 border-dashed bg-muted/10 rounded-3xl p-16 text-center">
            <BookOpen className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-2xl font-black opacity-40">Your bookshelf is empty</h3>
            <p className="text-muted-foreground font-medium mt-2">Go discover your next favorite story in our catalog!</p>
            <Button asChild className="mt-8 font-bold px-8 h-12" variant="outline">
              <Link to="/">Browse Catalog</Link>
            </Button>
          </Card>
        )}
      </section>
    </div>
  )
}

function MyBooksSkeleton() {
  return (
    <div className="max-w-7xl mx-auto space-y-12 p-8 animate-pulse">
      <div className="flex justify-between items-center">
        <Skeleton className="h-12 w-64 rounded-xl" />
        <Skeleton className="h-12 w-32 rounded-xl" />
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((n) => (
          <Skeleton key={n} className="h-[400px] w-full rounded-3xl" />
        ))}
      </div>
    </div>
  )
}
