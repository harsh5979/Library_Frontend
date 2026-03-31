import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { bookService } from '../services/bookService'
import { BookCard } from '../components/BookCard'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Search, BookOpen, AlertCircle, TrendingUp, Sparkles, SlidersHorizontal, ArrowUpDown } from 'lucide-react'
import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [inputValue, setInputValue] = useState(query)
  const [sortBy, setSortBy] = useState('relevance')

  const { data: searchResults, isLoading, error } = useQuery({
    queryKey: ['search', query, sortBy],
    queryFn: () => {
      if (!query.trim()) {
        return bookService.getAll({
          sortBy: sortBy === 'title' ? 'title' : 'createdAt',
          sortDir: sortBy === 'title' ? 'asc' : 'desc',
        })
      }

      return bookService.search(query)
    },
    enabled: true,
  })

  const { data: recommendations } = useQuery({
    queryKey: ['recommendations'],
    queryFn: () => bookService.getPopular(),
    enabled: !!error || (!isLoading && searchResults?.data?.content?.length === 0),
  })

  const books = searchResults?.data?.content || []
  const totalResults = searchResults?.data?.totalElements || 0

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedQuery = inputValue.trim()
    setSearchParams(trimmedQuery ? { q: trimmedQuery } : {})
  }

  return (
    <div className="space-y-12 pb-24 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] opacity-10 -translate-y-1/2 translate-x-1/3" />
      <div className="absolute top-1/2 left-0 -z-10 w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-[120px] opacity-10 -translate-x-1/2" />

      {/* Header & Search Bar Section */}
      <section className="relative pt-12 space-y-8 container mx-auto px-4">
        <div className="space-y-4 text-center max-w-2xl mx-auto animate-in fade-in slide-in-from-top-4 duration-700">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider ring-1 ring-primary/20">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Deep Discovery Engines</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">Explore the Collection</h1>
            <p className="text-muted-foreground/80 font-medium">
              Searching across 12,000+ physics journals, fiction classics, and historical archives.
            </p>
        </div>

        <div className="max-w-3xl mx-auto relative group animate-in fade-in zoom-in-95 duration-700 delay-100">
          <form onSubmit={handleSearch} className="flex gap-3 p-1.5 rounded-2xl bg-background shadow-2xl shadow-primary/5 ring-1 ring-primary/10 transition-all focus-within:ring-primary/30 focus-within:shadow-primary/10">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search titles, authors, ISBNs, or keywords..."
                className="h-14 pl-12 border-none bg-transparent text-lg font-medium focus-visible:ring-0 placeholder:text-muted-foreground/50"
              />
            </div>
            <Button type="submit" className="h-14 px-8 text-lg font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
              Search
            </Button>
          </form>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-4 animate-in fade-in duration-1000">
          <Badge variant="outline" className="px-4 py-1.5 rounded-full border bg-muted/30 cursor-pointer hover:bg-primary/5 hover:border-primary/20 transition-all font-bold">Physics</Badge>
          <Badge variant="outline" className="px-4 py-1.5 rounded-full border bg-muted/30 cursor-pointer hover:bg-primary/5 hover:border-primary/20 transition-all font-bold">Literature</Badge>
          <Badge variant="outline" className="px-4 py-1.5 rounded-full border bg-muted/30 cursor-pointer hover:bg-primary/5 hover:border-primary/20 transition-all font-bold">Scientific Journals</Badge>
          <Badge variant="outline" className="px-4 py-1.5 rounded-full border bg-muted/30 cursor-pointer hover:bg-primary/5 hover:border-primary/20 transition-all font-bold">History</Badge>
        </div>
      </section>

      {/* Results Section */}
      <section className="container mx-auto px-4 space-y-8 min-h-[50vh]">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b pb-6 border-border/50">
          <div className="flex items-center gap-3">
             <div className="p-2 rounded-xl bg-primary/10 shadow-sm text-primary">
               <BookOpen className="h-6 w-6" />
             </div>
             <div>
               <h2 className="text-2xl font-black tracking-tight leading-none">
                 {isLoading ? "Searching Collection..." : query ? `Results for "${query}"` : "Global Collection"}
               </h2>
               <p className="text-sm text-muted-foreground font-medium mt-1">
                 {!isLoading && totalResults} resources found matching your criteria.
               </p>
             </div>
          </div>

          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-11 px-4 gap-2 font-bold border-2 hover:bg-muted/50 transition-colors">
                  <ArrowUpDown className="h-4 w-4" />
                  Sort: <span className="text-primary">{sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl">
                <DropdownMenuLabel>Sort Preference</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSortBy('relevance')} className="cursor-pointer font-bold">Relevance</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('newest')} className="cursor-pointer font-bold">Newest First</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('rating')} className="cursor-pointer font-bold">High Rating</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('title')} className="cursor-pointer font-bold">Title (A-Z)</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" className="h-11 px-4 gap-2 font-bold border-2 hover:bg-muted/50 transition-colors">
              <SlidersHorizontal className="h-4 w-4" />
              Advanced Filters
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {Array.from({ length: 10 }).map((_, i) => <SearchSkeleton key={i} />)}
          </div>
        )}

        {/* Error/Empty State */}
        {!isLoading && (books.length === 0 || error) && (
          <div className="flex flex-col items-center justify-center py-24 space-y-6 text-center animate-in fade-in zoom-in-95 duration-500">
            <div className="p-6 rounded-full bg-muted/30">
              <AlertCircle className="h-16 w-16 text-muted-foreground opacity-30" />
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-black">No matches found</h3>
              <p className="text-muted-foreground max-w-md mx-auto font-medium">
                We couldn't find any resources matching your search. Try different keywords or browse our recommendations below.
              </p>
            </div>
            <Button 
              onClick={() => { setInputValue(''); setSearchParams({}); }} 
              variant="outline" 
              className="h-12 px-6 font-black border-2 group"
            >
              Clear Search Query
            </Button>
          </div>
        )}

        {/* Results Grid */}
        {!isLoading && books.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8 animate-in fade-in duration-1000">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}

        {/* Recommendations Section (only shown if empty or error) */}
        {!isLoading && (books.length === 0 || error) && recommendations?.data && (
           <div className="pt-24 space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <h2 className="text-3xl font-black tracking-tight">You might also like</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                {recommendations.data.slice(0, 5).map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
           </div>
        )}
      </section>
    </div>
  )
}

function SearchSkeleton() {
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
