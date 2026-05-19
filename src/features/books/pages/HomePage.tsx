import { bookService } from '../services/bookService'
import type { BookResponse } from '../types'
import { BookCard } from '../components/BookCard'
import { Button } from '@/components/ui/button'
import { ChevronRight, Sparkles, TrendingUp, Zap, Clock, BookOpen, Search } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Skeleton } from '@/components/ui/skeleton'

export function HomePage() {
  const { data: popularBooks, isLoading: isPopularLoading } = useQuery({
    queryKey: ['popular-books'],
    queryFn: () => bookService.getPopular(),
  })

  const { data: trendingBooks, isLoading: isTrendingLoading } = useQuery({
    queryKey: ['trending-books'],
    queryFn: () => bookService.getTrending(),
  })

  const { data: newArrivals, isLoading: isNewArrivalsLoading } = useQuery({
    queryKey: ['new-arrivals'],
    queryFn: () => bookService.getNewArrivals(),
  })

  return (
    <div className="flex flex-col gap-12 pb-24 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/3" />
      <div className="absolute top-1/2 left-0 -z-10 w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-[120px] opacity-10 -translate-x-1/2" />

      {/* Hero Section */}
      <section className="relative pt-16 lg:pt-24 min-h-[500px] flex items-center">
        <div className="container px-4 sm:px-6 lg:px-8 mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-in fade-in slide-in-from-left duration-1000">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider ring-1 ring-primary/20 hover:bg-primary/20 transition-colors">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Explore over 100,000+ titles</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1] bg-clip-text text-transparent bg-linear-to-br from-foreground via-foreground/90 to-primary/80">
              Your Gateway to <br />
              <span className="text-primary italic font-serif">Infinite</span> Knowledge
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground/80 max-w-xl leading-relaxed font-medium">
              Discover, borrow, and manage your literary journey with the next-generation digital library experience. Seamlessly intuitive, beautifully designed.
            </p>
            
            <div className="flex flex-row flex-wrap gap-4 pt-4">
              <Button size="lg" asChild className="flex-1 sm:flex-none h-14 px-8 text-lg font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-all duration-300">
                <Link to="/search" className="gap-2">
                  Browse Catalog <ChevronRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="flex-1 sm:flex-none h-14 px-8 text-lg font-bold backdrop-blur-sm border-2 hover:bg-muted/50 transition-all duration-300 group">
                <Link to="/search">
                  <Search className="h-5 w-5 mr-2 text-muted-foreground group-hover:text-primary transition-colors" />
                  Advanced Search
                </Link>
              </Button>
            </div>
            
            <div className="flex items-center gap-8 pt-8">
              <div className="flex flex-col">
                <span className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-primary to-blue-600">50K+</span>
                <span className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Students</span>
              </div>
              <div className="w-px h-10 bg-border/50" />
              <div className="flex flex-col">
                <span className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-primary to-blue-600">120K+</span>
                <span className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Resources</span>
              </div>
              <div className="w-px h-10 bg-border/50" />
              <div className="flex flex-col">
                <span className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-primary to-blue-600">20+</span>
                <span className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Branches</span>
              </div>
            </div>
          </div>
          
          <div className="hidden lg:grid grid-cols-2 gap-6 animate-in fade-in zoom-in duration-1000">
            <div className="space-y-6 translate-y-12">
              <img 
                src="https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=400&h=600" 
                className="w-full h-[400px] object-cover rounded-3xl shadow-2xl ring-1 ring-primary/10 hover:scale-105 transition-transform duration-500" 
                alt="Book collection" 
              />
              <img 
                src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=400&h=300" 
                className="w-full h-[200px] object-cover rounded-3xl shadow-2xl ring-1 ring-primary/10 hover:scale-105 transition-transform duration-500" 
                alt="Library" 
              />
            </div>
            <div className="space-y-6">
              <img 
                src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=400&h=300" 
                className="w-full h-[250px] object-cover rounded-3xl shadow-2xl ring-1 ring-primary/10 hover:scale-105 transition-transform duration-500" 
                alt="Reading room" 
              />
              <img 
                src="https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=400&h=550" 
                className="w-full h-[450px] object-cover rounded-3xl shadow-2xl ring-1 ring-primary/10 hover:scale-105 transition-transform duration-500" 
                alt="Classic literature" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Popular Section */}
      <BookShelf 
        title="Most Borrowed" 
        subtitle="The titles everyone is talking about" 
        books={popularBooks?.data || []} 
        isLoading={isPopularLoading}
        icon={<TrendingUp className="h-6 w-6 text-primary" />}
      />

      {/* Trending Section */}
      <section className="bg-primary/5 py-24 -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden relative">
        <div className="container px-4 sm:px-6 lg:px-8 mx-auto space-y-12 relative">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
                <Zap className="h-3.5 w-3.5" />
                <span>Hot this semester</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight">Trending Now</h2>
              <p className="text-muted-foreground font-medium flex items-center gap-2">
                <BookOpen className="h-4 w-4" /> 
                Based on current activity across all campus branches
              </p>
            </div>
            <Button variant="ghost" className="group font-bold text-lg hover:text-primary">
              View Analytics <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {isTrendingLoading 
              ? Array.from({ length: 4 }).map((_, i) => <BookSkeleton key={i} />)
              : (trendingBooks?.data || []).slice(0, 4).map((book: any) => <BookCard key={book.id} book={book} />)
            }
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <BookShelf 
        title="New Arrivals" 
        subtitle="Freshly added to our collection this month" 
        books={newArrivals?.data || []} 
        isLoading={isNewArrivalsLoading}
        icon={<Clock className="h-6 w-6 text-primary" />}
      />
    </div>
  )
}

function BookShelf({ title, subtitle, books, isLoading, icon }: { title: string, subtitle: string, books: BookResponse[], isLoading: boolean, icon: React.ReactNode }) {
  return (
    <section className="container px-4 sm:px-6 lg:px-8 mx-auto space-y-10">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 shadow-sm shrink-0">
              {icon}
            </div>
            <h2 className="text-3xl font-black tracking-tight">{title}</h2>
          </div>
          <p className="text-muted-foreground font-medium pl-12">{subtitle}</p>
        </div>
        <Button variant="ghost" asChild className="group text-primary hover:bg-primary/5 font-bold transition-all duration-300">
          <Link to="/search">
            See all <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        {isLoading 
          ? Array.from({ length: 4 }).map((_, i) => <BookSkeleton key={i} />)
          : books.slice(0, 4).map((book) => <BookCard key={book.id} book={book} />)
        }
      </div>
    </section>
  )
}

function BookSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="aspect-3/4 w-full rounded-2xl" />
      <div className="space-y-2">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  )
}
