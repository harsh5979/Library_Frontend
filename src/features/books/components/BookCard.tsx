import type { BookResponse } from '../types'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { LazyImage } from '@/components/ui/lazy-image'
import { cn } from '@/lib/utils'

interface BookCardProps {
  book: BookResponse
  className?: string
}

export function BookCard({ book, className }: BookCardProps) {
  return (
    <Link to={`/books/${book.id}`} className="block group h-full">
      <Card className={cn(
        "relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 border-none bg-card/50 backdrop-blur-sm shadow-lg ring-1 ring-primary/5 hover:ring-primary/20 h-full flex flex-col",
        className
      )}>
        <div className="absolute inset-0 bg-linear-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="relative aspect-3/4 overflow-hidden">
          <LazyImage
            src={book.coverImageUrl || `https://images.unsplash.com/photo-1543005152-84524823467f?w=400&h=600&fit=crop`}
            alt={book.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute top-2 right-2 flex flex-col gap-2">
            <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm shadow-sm ring-1 ring-black/5">
              {book.category}
            </Badge>
            {book.availableCopies === 0 && (
              <Badge variant="destructive" className="animate-pulse shadow-sm">
                Borrowed
              </Badge>
            )}
          </div>
        </div>

        <CardContent className="p-4 space-y-2 relative flex-1">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-bold text-lg leading-tight line-clamp-1 group-hover:text-primary transition-colors">
              {book.title}
            </h3>
            <div className="flex items-center gap-1 text-amber-500 shrink-0 font-medium text-sm">
              <Star className="h-4 w-4 fill-current" />
              <span>{(book.averageRating || 0).toFixed(1)}</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-1 italic font-medium">
            by <span className="text-foreground/80 not-italic font-semibold">{book.author}</span>
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            <Badge variant="outline" className="text-[10px] uppercase tracking-wider py-0 px-1.5 opacity-70">
              {book.subject}
            </Badge>
            <Badge variant="outline" className="text-[10px] uppercase tracking-wider py-0 px-1.5 opacity-70">
              {book.publisher}
            </Badge>
          </div>
        </CardContent>

        <CardFooter className="px-4 pb-4 pt-0 text-xs text-muted-foreground flex justify-between items-center relative">
          <div className="flex items-center gap-1 bg-muted/50 py-1 px-2 rounded-full ring-1 ring-border">
            <span className={cn(
              "h-1.5 w-1.5 rounded-full ring-1 ring-current",
              book.availableCopies > 0 ? "bg-emerald-500 text-emerald-500/50" : "bg-rose-500 text-rose-500/50"
            )} />
            <span>{book.availableCopies} available</span>
          </div>
          <span className="font-mono text-[10px] opacity-50">{book.isbn}</span>
        </CardFooter>
      </Card>
    </Link>
  )
}
