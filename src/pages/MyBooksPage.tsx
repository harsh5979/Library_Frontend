import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { borrowApi } from '@/api/borrow'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar, 
  Clock, 
  RotateCcw, 
  BookOpen, 
  ArrowLeft, 
  AlertCircle,
  CheckCircle2,
  Library,
  Heart
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useToast } from '@/hooks/use-toast'
import { Skeleton } from '@/components/ui/skeleton'

export function MyBooksPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data: borrowedResponse, isLoading } = useQuery({
    queryKey: ['my-borrowed'],
    queryFn: () => borrowApi.getMyBorrowed(),
  })

  const { data: historyResponse } = useQuery({
    queryKey: ['my-history'],
    queryFn: () => borrowApi.getMyHistory(),
  })

  const returnMutation = useMutation({
    mutationFn: (id: number) => borrowApi.returnBook({ transactionId: id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-borrowed'] })
      queryClient.invalidateQueries({ queryKey: ['my-history'] })
      toast({
        title: "Book Returned",
        description: "Thank you for returning the book on time!",
      })
    }
  })

  const renewMutation = useMutation({
    mutationFn: (id: number) => borrowApi.renewBook(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-borrowed'] })
      toast({
        title: "Renewal Success",
        description: "Your borrowing period has been extended.",
      })
    }
  })

  if (isLoading) return <MyBooksSkeleton />

  const activeLoans = borrowedResponse?.data?.content || []
  const history = historyResponse?.data?.content || []

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
            {activeLoans.map((loan: any) => (
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
                      by {loan.bookAuthor}
                    </p>
                  </div>
                </div>
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-2xl bg-muted/30 border border-muted-foreground/10">
                      <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-1">Due Date</p>
                      <p className="font-black text-rose-500 flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {new Date(loan.returnDate).toLocaleDateString()}
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
                    <Button 
                      variant="outline" 
                      className="font-bold border-2 h-11 rounded-xl"
                      onClick={() => renewMutation.mutate(loan.id)}
                      disabled={renewMutation.isPending}
                    >
                      <Clock className="mr-2 h-4 w-4" /> Renew Extension
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

      {/* History Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
            <Clock className="h-6 w-6" />
          </div>
          <h2 className="text-3xl font-black tracking-tight">Reading History</h2>
        </div>

        <div className="grid gap-4">
          {history.length > 0 ? (
            history.map((record: any) => (
              <div key={record.id} className="flex items-center gap-6 p-4 bg-muted/10 border-2 border-transparent hover:border-primary/10 rounded-2xl transition-all group">
                <div className="h-16 w-12 shrink-0 overflow-hidden rounded-lg shadow-md group-hover:scale-110 transition-transform">
                  <img src={record.bookCover || `https://images.unsplash.com/photo-1543005152-84524823467f?w=100&h=150`} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-lg truncate group-hover:text-primary transition-colors">{record.bookTitle}</h4>
                  <p className="text-sm text-muted-foreground font-bold">Returned on {new Date(record.actualReturnDate).toLocaleDateString()}</p>
                </div>
                <div className="hidden sm:flex flex-col items-end shrink-0">
                  <Badge variant="outline" className="px-3 py-1 bg-background/50 border-2 font-black rounded-lg text-emerald-600 border-emerald-500/10">
                    <CheckCircle2 className="h-3 w-3 mr-1" /> COMPLETED
                  </Badge>
                  <span className="text-xs text-muted-foreground mt-1 flex items-center gap-1 font-bold">
                    <Heart className="h-3 w-3 text-rose-500 animate-pulse" /> Enjoyed reading
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-12 text-muted-foreground font-bold italic">No entries in your reading history yet.</p>
          )}
        </div>
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
