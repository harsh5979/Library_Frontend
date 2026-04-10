import { useSearchParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { bookService } from '../services/bookService'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, BookOpen, Star, ChevronRight, Filter } from 'lucide-react'
import { LazyImage } from '@/components/ui/lazy-image'
import { useState, useMemo } from 'react'
import type { BookResponse } from '../types'
import { cn } from '@/lib/utils'

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [inputValue, setInputValue] = useState(query)
  const [category, setCategory] = useState('All')
  const [sortBy, setSortBy] = useState('relevance')

  // Fetch all books once to derive available categories
  const { data: allData } = useQuery({
    queryKey: ['all-books-categories'],
    queryFn: () => bookService.getAll({ size: 200 }),
    staleTime: 1000 * 60 * 5,
  })

  const availableCategories = useMemo(() => {
    const cats = new Set<string>()
    allData?.data?.content?.forEach((b: BookResponse) => { if (b.category) cats.add(b.category) })
    return ['All', ...Array.from(cats).sort()]
  }, [allData])

  const { data, isLoading } = useQuery({
    queryKey: ['search', query, sortBy, category],
    queryFn: () =>
      bookService.getAll({
        title: query || undefined,
        category: category !== 'All' ? category : undefined,
        sortBy: sortBy === 'title' ? 'title' : 'createdAt',
        sortDir: sortBy === 'title' ? 'asc' : 'desc',
        size: 20,
      }),
  })

  const books: BookResponse[] = data?.data?.content || []
  const total = data?.data?.totalElements || 0

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchParams(inputValue.trim() ? { q: inputValue.trim() } : {})
  }

  return (
    <div className="min-h-screen">
      {/* Search header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search by title, author, ISBN..."
                className="pl-10 h-10 bg-white border-gray-300"
              />
            </div>
            <Button type="submit" className="h-10 px-6 bg-primary hover:bg-primary/90">
              Search
            </Button>
          </form>
        </div>
      </div>

      <div className="px-4 py-6 flex flex-col md:flex-row gap-6 max-w-6xl mx-auto w-full">
        {/* Sidebar filters */}
        <aside className="hidden md:block w-52 shrink-0">
          <div className="sticky top-[73px] space-y-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Filter className="size-4" /> Category
            </h3>
            <div className="space-y-1">
              {availableCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={cn(
                    'w-full text-left text-sm px-3 py-1.5 rounded-md transition-colors',
                    category === cat
                      ? 'bg-primary text-white font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1 space-y-4">
          {/* Results header — count + sort always in one row */}
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm text-gray-500 truncate">
              {isLoading ? 'Searching...' : (
                <><span className="font-semibold text-gray-900">{total.toLocaleString()}</span> results
                {category !== 'All' && <> · <span className="font-semibold text-gray-900">{category}</span></>}</>
              )}
            </p>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-8 w-32 text-xs bg-white border-gray-300 shrink-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="title">Title A–Z</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Mobile category pills — horizontal scroll, no visible scrollbar */}
          <div className="flex gap-2 overflow-x-auto pb-1 md:hidden scrollbar-none" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {availableCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={cn(
                  'shrink-0 text-xs px-3 py-1.5 rounded-full border transition-colors whitespace-nowrap',
                  category === cat
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-primary/40'
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Book list */}
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => <BookRowSkeleton key={i} />)}
            </div>
          ) : books.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <BookOpen className="size-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700">No books found</h3>
              <p className="text-sm text-gray-400 mt-1">Try different keywords or clear the filters</p>
              <Button variant="outline" className="mt-4" onClick={() => { setInputValue(''); setCategory('All'); setSearchParams({}); }}>
                Clear search
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {books.map((book) => <BookRow key={book.id} book={book} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function BookRow({ book }: { book: BookResponse }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 flex gap-3 sm:gap-4 hover:shadow-sm transition-shadow">
      {/* Cover */}
      <div className="w-14 sm:w-16 h-20 sm:h-24 rounded shrink-0 overflow-hidden">
        <LazyImage
          src={book.coverImageUrl || `https://images.unsplash.com/photo-1543005152-84524823467f?w=80&h=120&fit=crop`}
          alt={book.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link to={`/books/${book.id}`} className="font-semibold text-gray-900 hover:text-primary transition-colors line-clamp-2 sm:line-clamp-1 text-sm sm:text-base">
              {book.title}
            </Link>
            <p className="text-xs sm:text-sm text-gray-500">by <span className="text-gray-700 font-medium">{book.author}</span></p>
          </div>
          <Badge
            variant="outline"
            className={cn(
              'shrink-0 text-xs whitespace-nowrap',
              book.availableCopies > 0
                ? 'border-emerald-200 text-emerald-700 bg-emerald-50'
                : 'border-red-200 text-red-600 bg-red-50'
            )}
          >
            {book.availableCopies > 0 ? `${book.availableCopies} avail.` : 'Unavailable'}
          </Badge>
        </div>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Star className="size-3 fill-amber-400 text-amber-400" />
            <span className="font-medium text-gray-700">{(book.averageRating || 0).toFixed(1)}</span>
          </div>
          <Badge variant="secondary" className="text-xs py-0 h-5">{book.category}</Badge>
          {book.year && <span>{book.year}</span>}
          {book.publisher && <span className="truncate max-w-[100px] hidden sm:inline">{book.publisher}</span>}
        </div>

        {book.description && (
          <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 leading-relaxed hidden sm:block">{book.description}</p>
        )}

        <div className="flex items-center gap-2 pt-1">
          <Button size="sm" className="h-7 text-xs bg-primary hover:bg-primary/90" asChild>
            <Link to={`/books/${book.id}`}>View details <ChevronRight className="size-3 ml-1" /></Link>
          </Button>
          <span className="text-xs text-gray-400 font-mono hidden sm:inline">ISBN: {book.isbn}</span>
        </div>
      </div>
    </div>
  )
}

function BookRowSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 flex gap-4">
      <Skeleton className="w-16 h-24 rounded shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  )
}
