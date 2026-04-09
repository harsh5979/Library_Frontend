import Link from "next/link";
import { BookMarked, Layers, User, Star, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { booksApi } from "@/api/books";

export async function BookList({ query, category }: { query: string; category: string }) {
  // Use the established API module
  // Note: Since this is likely a server component, we need to handle the async call properly
  // and ensure we don't hit the axios interceptors if they use client-side stores.
  // However, booksApi.getAll uses axios.
  
  let books = [];
  try {
    const response = query 
      ? await booksApi.search(query)
      : await booksApi.getAll({ category });
    
    const responseData = response as any;
    books = responseData?.data?.content || [];
  } catch (error) {
    console.error("Book sync failed:", error);
    books = [];
  }

  if (!books || books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-16 space-y-6 text-center bg-secondary/5 border border-dashed border-border/40 rounded-4xl">
        <div className="size-20 rounded-full bg-secondary/30 flex items-center justify-center">
            <BookMarked className="size-8 text-muted-foreground/40" />
        </div>
        <div className="space-y-1">
            <h3 className="text-2xl font-heading font-black tracking-tight uppercase">No Books Found</h3>
            <p className="text-muted-foreground/60 text-sm font-sans tracking-wide">We couldn&apos;t find any titles matching your current selection.</p>
        </div>
        <Button variant="outline" className="rounded-xl px-6 py-2 font-heading tracking-widest text-[10px] h-10 border-border/40 hover:bg-primary hover:text-white transition-all uppercase font-black">
            Reset Filters
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
      {books.map((book: Record<string, any>) => (
        <Link 
          key={book.id} 
          href={`/dashboard/books/${book.id}`}
          className="group block relative focus:outline-none"
        >
          <div className="space-y-5 bg-card/30 border border-border/40 p-5 rounded-3xl backdrop-blur-xl group-hover:bg-card/50 group-hover:-translate-y-1 group-hover:border-primary/20 transition-all duration-300 relative overflow-hidden flex flex-col h-full shadow-lg hover:shadow-primary/5">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 blur-[60px] rounded-full -m-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            <div className="aspect-3/4 rounded-2xl bg-secondary/50 overflow-hidden relative shadow-lg group-hover:shadow-primary/20 transition-all shadow-black/10">
              <img 
                src={book.coverImageUrl || `https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=3087&auto=format&fit=crop`} 
                alt={book.title} 
                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" 
              />
              <div className="absolute top-3 right-3">
                <Badge className="bg-white/10 backdrop-blur-md border border-white/20 text-white font-heading text-[9px] tracking-widest uppercase py-1 px-3 rounded-full flex items-center gap-1.5 shadow-xl">
                  <Star className="size-3 fill-yellow-400 text-yellow-500" />
                  {book.rating || "4.8"}
                </Badge>
              </div>
              <div className="absolute bottom-3 left-3 flex gap-2">
                 <Badge variant="outline" className="bg-black/40 backdrop-blur-md border-none text-white/90 font-heading text-[8px] tracking-[0.2em] font-black uppercase py-0.5 px-2 rounded-lg">
                    {book.category || "General"}
                 </Badge>
              </div>
            </div>

            <div className="space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="line-clamp-2 text-xl font-heading font-black tracking-tighter leading-none group-hover:text-primary transition-colors uppercase">
                  {book.title}
                </h3>
                <div className="flex items-center gap-2 text-muted-foreground/80">
                   <User className="size-3.5 opacity-60" />
                   <span className="text-xs font-sans tracking-wide font-medium uppercase italic">{book.author}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border/30">
                <div className="flex items-center gap-2 text-primary">
                    <Layers className="size-3.5" />
                    <span className="text-[10px] font-heading font-black uppercase tracking-widest">
                       {book.availableCopies || "0"} Available
                    </span>
                </div>
                <div className="size-8 rounded-lg bg-secondary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all group-hover:rotate-6">
                    <ArrowRight className="size-4" />
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
