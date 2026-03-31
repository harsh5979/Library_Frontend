import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/store/useAuth'
import { bookService } from '../services/bookService'
import { reservationService } from '@/features/reservations/services/reservationService'
import { borrowService } from '@/features/borrowing/services/borrowService'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Star, 
  Calendar, 
  MapPin, 
  Hash, 
  Building, 
  ArrowLeft, 
  Share2, 
  Bookmark,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  User as UserIcon,
  Send,
  Warehouse,
  Loader2
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Skeleton } from '@/components/ui/skeleton'
import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import type { ReviewResponse } from '../types'

export function BookDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const { isAuthenticated, user } = useAuth()
  const [reviewText, setReviewText] = useState('')
  const [rating, setRating] = useState(5)

  const { data: bookResponse, isLoading, error } = useQuery({
    queryKey: ['book', id],
    queryFn: () => bookService.getById(Number(id)),
    enabled: !!id,
  })

  const { data: availabilityResponse } = useQuery({
    queryKey: ['book-availability', id],
    queryFn: () => bookService.getAvailability(Number(id)),
    enabled: !!id && isAuthenticated,
  })

  const { data: reviewsResponse, isLoading: isReviewsLoading } = useQuery({
    queryKey: ['book-reviews', id],
    queryFn: () => bookService.getReviews(Number(id)),
    enabled: !!id,
  })

  const borrowMutation = useMutation({
    mutationFn: () => {
      if (!isAuthenticated) throw new Error('Login required')
      if (!user?.id) throw new Error('User profile unavailable')

      return borrowService.issueBook({
        bookId: Number(id),
        userId: user.id,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['book', id] })
      queryClient.invalidateQueries({ queryKey: ['book-availability', id] })
      toast({
        title: "Success!",
        description: "The book has been reserved for you.",
      })
    },
    onError: (error: Error) => {
      if (error.message === 'Login required') {
        toast({
          title: "Login Required",
          description: "Please sign in to borrow books.",
          variant: "destructive",
        })
        navigate('/login')
        return
      }
      toast({
        title: "Borrow failed",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      })
    }
  })

  const reviewMutation = useMutation({
    mutationFn: (data: { rating: number, reviewText: string }) => {
       return bookService.submitReview(Number(id), data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['book-reviews', id] })
      setReviewText('')
      toast({
        title: "Thank you!",
        description: "Your review has been submitted successfully.",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Review failed",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      })
    }
  })

  const reserveMutation = useMutation({
    mutationFn: () => {
      if (!isAuthenticated) throw new Error('Login required')
      if (!user?.id) throw new Error('User profile unavailable')

      return reservationService.create({
        bookId: Number(id),
        userId: user.id,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['book', id] })
      queryClient.invalidateQueries({ queryKey: ['book-availability', id] })
      toast({
        title: "Reservation Successful",
        description: "You have been added to the queue for this book.",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Reservation Failed",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      })
    }
  })

  if (isLoading) return <BookDetailSkeleton />
  if (error || !bookResponse?.success) return <ErrorMessage />

  const book = bookResponse.data
  const reviews = reviewsResponse?.data || []
  const availability = availabilityResponse?.data

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)} 
        className="group text-muted-foreground hover:text-foreground font-bold"
      >
        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back to Catalog
      </Button>

      <div className="grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4 space-y-6">
          <div className="relative aspect-3/4 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-primary/10">
            <img 
              src={book.coverImage || `https://images.unsplash.com/photo-1543005152-84524823467f?w=600&h=800&fit=crop`} 
              className="w-full h-full object-cover"
              alt={book.title}
            />
            {book.availableCopies > 0 ? (
              <div className="absolute top-4 left-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" />
                AVAILABLE NOW
              </div>
            ) : (
              <div className="absolute top-4 left-4 bg-rose-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5" />
                OUT OF STOCK
              </div>
            )}
          </div>
          
          <div className="flex gap-3">
            {book.availableCopies > 0 ? (
              <Button 
                className="flex-1 h-14 text-lg font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all bg-linear-to-r from-primary to-blue-600 border-none rounded-xl"
                onClick={() => borrowMutation.mutate()}
                disabled={borrowMutation.isPending}
              >
                {borrowMutation.isPending ? <Loader2 className="animate-spin" /> : "Borrow This Book"}
              </Button>
            ) : (
              <Button 
                className="flex-1 h-14 text-lg font-bold shadow-xl shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all bg-linear-to-r from-amber-500 to-orange-600 border-none rounded-xl"
                onClick={() => reserveMutation.mutate()}
                disabled={reserveMutation.isPending}
              >
                {reserveMutation.isPending ? <Loader2 className="animate-spin" /> : "Reserve This Book"}
              </Button>
            )}
            <Button variant="outline" size="icon" className="h-14 w-14 rounded-xl border-2 hover:bg-muted/50 transition-colors">
              <Bookmark className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" className="h-14 w-14 rounded-xl border-2 hover:bg-muted/50 transition-colors">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
          
          <Card className="bg-muted/30 border-none shadow-none rounded-2xl overflow-hidden ring-1 ring-primary/5">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Stock status</p>
                <p className="text-2xl font-black">{book.availableCopies} <span className="text-foreground/40 font-bold text-sm">/ {book.totalCopies}</span></p>
              </div>
              <div className="h-12 w-12 rounded-full border-4 border-primary/20 border-t-primary flex items-center justify-center font-black text-xs">
                {book.totalCopies > 0 ? Math.round((book.availableCopies / book.totalCopies) * 100) : 0}%
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-8 space-y-8">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="px-3 py-1 rounded-lg font-bold">
                {book.category}
              </Badge>
              <Badge variant="outline" className="px-3 py-1 rounded-lg border-2 font-bold">
                {book.subject}
              </Badge>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
              {book.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-lg">
              <p className="font-medium">
                by <span className="text-primary font-bold hover:underline cursor-pointer">{book.author}</span>
              </p>
              <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
              <div className="flex items-center gap-1.5 text-amber-500 font-bold">
                <Star className="h-5 w-5 fill-current" />
                {(book.averageRating || 0).toFixed(1)}
                <span className="text-muted-foreground font-medium text-sm">({reviews.length} reviews)</span>
              </div>
            </div>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full justify-start bg-transparent border-b rounded-none p-0 h-12 gap-8">
              <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 text-lg font-bold shadow-none">Overview</TabsTrigger>
              <TabsTrigger value="availability" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 text-lg font-bold shadow-none text-emerald-600">Inventory</TabsTrigger>
              <TabsTrigger value="reviews" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 text-lg font-bold shadow-none">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="pt-6 space-y-6 animate-in fade-in duration-500">
              <p className="text-xl text-muted-foreground leading-relaxed italic font-serif opacity-80">
                "{book.description || "The definitive guide to understanding its subject matter deeply. This masterpiece offers insightful perspectives and meticulously researched content presented in an accessible yet profound manner."}"
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4 pt-4">
                <InfoCard icon={<Building className="h-5 w-5" />} label="Publisher" value={book.publisher} />
                <InfoCard icon={<Calendar className="h-5 w-5" />} label="Published" value={book.publicationYear} />
                <InfoCard icon={<Hash className="h-5 w-5" />} label="ISBN" value={book.isbn} />
                <InfoCard icon={<MapPin className="h-5 w-5" />} label="Shelf" value={book.location} />
              </div>
            </TabsContent>

            <TabsContent value="availability" className="pt-6 space-y-6 animate-in fade-in duration-500">
                <h3 className="text-2xl font-black flex items-center gap-2">
                  <Warehouse className="h-6 w-6 text-emerald-500" /> Branch Availability
                </h3>
                {availability ? (
                  <div className="space-y-4">
                     <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
                        <div className="text-center p-2">
                          <p className="text-xs font-black text-muted-foreground uppercase opacity-60">Global Stock</p>
                          <p className="text-3xl font-black">{availability.totalCopiesAllBranches}</p>
                        </div>
                        <div className="text-center p-2 border-l">
                          <p className="text-xs font-black text-muted-foreground uppercase opacity-60">Ready to Borrow</p>
                          <p className="text-3xl font-black text-emerald-600">{availability.availableCopiesAllBranches}</p>
                        </div>
                     </div>
                     <div className="divide-y space-y-4">
                        {availability.branches.map((branch: { branchId: number; branchName: string; location: string; totalCopies: number; availableCopies: number; shelfLocation: string; isAvailable: boolean }) => (
                          <div key={branch.branchId} className="flex items-center justify-between p-4 bg-muted/20 rounded-2xl border border-transparent hover:border-primary/10 transition-all group">
                             <div className="space-y-1">
                                <p className="font-black text-lg group-hover:text-primary transition-colors">{branch.branchName}</p>
                                <p className="text-xs text-muted-foreground font-bold flex items-center gap-1">
                                  <MapPin className="h-3 w-3" /> {branch.location}
                                </p>
                             </div>
                             <div className="text-right">
                                <Badge variant={branch.isAvailable ? "secondary" : "destructive"} className="font-black rounded-lg">
                                  {branch.isAvailable ? `${branch.availableCopies} IN STOCK` : "ALL OUT"}
                                </Badge>
                                <p className="text-[10px] font-bold text-muted-foreground mt-1 uppercase tracking-tighter">Loc: {branch.shelfLocation}</p>
                             </div>
                          </div>
                        ))}
                     </div>
                  </div>
                ) : (
                  <div className="p-8 text-center rounded-3xl bg-muted/10 border-2 border-dashed">
                      <AlertCircle className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="font-bold text-muted-foreground">Sign in to view real-time branch availability.</p>
                  </div>
                )}
            </TabsContent>

            <TabsContent value="reviews" className="pt-6 space-y-8 animate-in fade-in duration-500">
              {isAuthenticated ? (
                <div className="space-y-4 p-6 rounded-3xl bg-primary/5 border border-primary/10 transition-all hover:bg-primary/10">
                  <h4 className="text-lg font-black flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Share your experience
                  </h4>
                  <div className="flex gap-2 pb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={`h-7 w-7 cursor-pointer transition-all hover:scale-110 ${star <= rating ? 'fill-amber-500 text-amber-500 shadow-amber-500/50' : 'text-muted-foreground/30'}`}
                        onClick={() => setRating(star)}
                      />
                    ))}
                  </div>
                  <Textarea 
                    placeholder="Tell us what you loved (or didn't) about this title..." 
                    className="min-h-[120px] rounded-2xl bg-background shadow-xs focus:ring-primary/20 border-muted font-medium"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                  />
                  <Button 
                    className="font-black gap-2 px-8 h-12 shadow-xl shadow-primary/20" 
                    onClick={() => reviewMutation.mutate({ rating, reviewText })}
                    disabled={!reviewText.trim() || reviewMutation.isPending}
                  >
                    {reviewMutation.isPending ? "Posting..." : <><Send className="h-4 w-4" /> Publish Review</>}
                  </Button>
                </div>
              ) : (
                <div className="p-8 rounded-3xl bg-muted/20 text-center space-y-4 border-2 border-dashed">
                  <p className="font-bold text-muted-foreground">Share your journey with other readers.</p>
                  <Button asChild variant="outline" className="font-black border-2 h-11 px-8 rounded-xl shadow-xs">
                    <Link to="/login">Sign in to Review</Link>
                  </Button>
                </div>
              )}

              <div className="space-y-6 pt-4">
                {isReviewsLoading ? (
                  Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)
                ) : reviews.length > 0 ? (
                  reviews.map((review: ReviewResponse) => (
                    <div key={review.id} className="p-6 rounded-3xl bg-muted/10 border hover:bg-muted/20 transition-all duration-300">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-black">
                             {<UserIcon className="h-6 w-6" />}
                          </div>
                          <div>
                            <p className="font-black text-lg">{review.userName || 'Library Member'}</p>
                            <div className="flex gap-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-3 w-3 ${i < review.rating ? 'fill-amber-500 text-amber-500' : 'text-muted-foreground/30'}`} 
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-black text-muted-foreground uppercase opacity-60 bg-muted/40 px-2 py-1 rounded-md">{new Date(review.reviewDate).toLocaleDateString()}</span>
                      </div>
                      <p className="text-muted-foreground leading-relaxed font-bold italic opacity-90">
                        "{review.reviewText}"
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-20 text-muted-foreground bg-muted/5 rounded-3xl border-2 border-dotted">
                    <MessageSquare className="h-12 w-12 mx-auto opacity-20 mb-3" />
                    <p className="font-black opacity-40">No reviews yet. Be the first to start the conversation!</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number | undefined }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/20 border group hover:bg-background transition-colors">
      <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div>
        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{label}</p>
        <p className="font-black truncate max-w-[150px]">{value}</p>
      </div>
    </div>
  )
}

function BookDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 p-8">
      <Skeleton className="h-10 w-32" />
      <div className="grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4 space-y-6">
          <Skeleton className="aspect-3/4 w-full rounded-3xl" />
          <div className="flex gap-3">
             <Skeleton className="h-14 flex-1 rounded-xl" />
             <Skeleton className="h-14 w-14 rounded-xl" />
          </div>
        </div>
        <div className="lg:col-span-8 space-y-8">
          <div className="space-y-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-16 w-3/4" />
            <Skeleton className="h-8 w-1/2" />
          </div>
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  )
}

function ErrorMessage() {
  return (
    <div className="flex flex-col items-center justify-center py-24 space-y-4">
      <AlertCircle className="h-16 w-16 text-destructive opacity-50" />
      <h2 className="text-2xl font-bold">Book not found</h2>
      <p className="text-muted-foreground">The resource you're looking for might have been moved or deleted.</p>
      <Button asChild variant="outline" className="font-bold border-2 rounded-xl h-12 px-8">
        <Link to="/">Return Home</Link>
      </Button>
    </div>
  )
}
