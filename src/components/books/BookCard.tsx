import Link from "next/link";
import Image from "next/image";
import { Star, Bookmark, ExternalLink } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Book {
  id: number;
  title: string;
  author: string;
  coverImageUrl?: string;
  category: string;
  subject: string;
  publisher: string;
  availableCopies: number;
  averageRating?: number;
  isbn: string;
}

interface BookCardProps {
  book: Book;
  className?: string;
}

export function BookCard({ book, className }: BookCardProps) {
  return (
    <Card className={cn(
      "group relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 border-none bg-card/50 backdrop-blur-sm shadow-lg ring-1 ring-primary/5 hover:ring-primary/20 rounded-3xl",
      className
    )}>
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image
          src={book.coverImageUrl || `https://images.unsplash.com/photo-1543005152-84524823467f?w=400&h=600&fit=crop`}
          alt={`${book.title} cover image`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm shadow-sm ring-1 ring-black/5 font-heading tracking-widest text-[9px] uppercase py-1 px-3 rounded-full">
            {book.category}
          </Badge>
          {book.availableCopies === 0 && (
            <Badge variant="destructive" className="animate-pulse shadow-sm font-heading tracking-widest text-[9px] uppercase py-1 px-3 rounded-full">
              Borrowed
            </Badge>
          )}
        </div>
        
        <div className="absolute inset-x-0 bottom-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex justify-end gap-3 items-center">
          <Button size="icon" variant="secondary" className="size-10 rounded-full shadow-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300 group/btn" aria-label="Bookmark this book">
            <Bookmark className="size-5 group-hover/btn:fill-current" />
          </Button>
          <Button size="icon" asChild className="size-10 rounded-full shadow-lg bg-primary hover:scale-110 transition-transform duration-300 border-none" aria-label={`View details for ${book.title}`}>
            <Link href={`/dashboard/books/${book.id}`}>
              <ExternalLink className="size-5" />
            </Link>
          </Button>
        </div>
      </div>

      <CardContent className="p-6 space-y-3 relative">
        <div className="flex justify-between items-start gap-4">
          <h3 className="font-heading font-black text-xl leading-tight line-clamp-1 group-hover:text-primary transition-colors tracking-tighter uppercase">
            {book.title}
          </h3>
          <div className="flex items-center gap-1.5 text-amber-500 shrink-0 font-black text-sm">
            <Star className="size-4 fill-current" />
            <span>{(book.averageRating || 0).toFixed(1)}</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-1 italic font-medium">
          by <span className="text-foreground/80 not-italic font-black text-xs uppercase tracking-widest leading-none">{book.author}</span>
        </p>
        <div className="flex flex-wrap gap-2 pt-2">
          <Badge variant="outline" className="text-[9px] font-heading font-black uppercase tracking-widest py-0.5 px-2.5 opacity-60 rounded-lg">
            {book.subject}
          </Badge>
        </div>
      </CardContent>

      <CardFooter className="px-6 pb-6 pt-0 text-xs text-muted-foreground flex justify-between items-center relative">
        <div className="flex items-center gap-2 bg-muted/50 py-1.5 px-3 rounded-full ring-1 ring-border/40">
          <span className={cn(
            "h-2 w-2 rounded-full",
            book.availableCopies > 0 ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]"
          )} />
          <span className="font-heading font-black tracking-widest text-[9px] uppercase">{book.availableCopies} available</span>
        </div>
        <span className="font-mono text-[9px] opacity-40 uppercase tracking-tighter">{book.isbn}</span>
      </CardFooter>
    </Card>
  );
}
