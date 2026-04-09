import Link from "next/link";
import { Zap, BookOpen, ChevronRight } from "lucide-react";
import { BookResponse } from "@/lib/services/bookService";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TrendingSectionProps {
  books: BookResponse[];
}

export function TrendingSection({ books }: TrendingSectionProps) {
  if (!books.length) return null;

  return (
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
              Curated picks across all campus branches
            </p>
          </div>
          <Button variant="ghost" asChild className="group font-bold text-lg hover:text-primary">
            <Link href="/books">
              View All <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {books.slice(0, 5).map((book) => (
            <Link key={book.id} href={`/dashboard/books/${book.id}`} className="group block">
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-lg ring-1 ring-primary/10 group-hover:ring-primary/30 transition-all">
                {book.coverImageUrl ? (
                  <img
                    src={book.coverImageUrl}
                    alt={book.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="h-full w-full bg-secondary flex items-center justify-center">
                    <BookOpen className="size-12 text-muted-foreground/20" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm text-[10px] font-bold">
                    {book.category}
                  </Badge>
                </div>
              </div>
              <div className="mt-3 space-y-1 px-1">
                <p className="font-bold text-sm leading-tight line-clamp-1 group-hover:text-primary transition-colors">
                  {book.title}
                </p>
                <p className="text-xs text-muted-foreground truncate">{book.author}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
