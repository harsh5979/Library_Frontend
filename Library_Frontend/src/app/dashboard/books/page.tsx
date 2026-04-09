import { Suspense } from "react";
import { BookList } from "./_components/book-list";
import { BookFilters } from "./_components/book-filters";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = {
  title: "Book Catalogue | Omnishelf Library",
  description: "Browse and search our extensive collection of books across various categories and authors in the Omnishelf archive.",
};

export default async function BooksPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const query = typeof searchParams.q === 'string' ? searchParams.q : "";
  const category = typeof searchParams.category === 'string' ? searchParams.category : "";

  return (
    <div className="space-y-12 pb-12">
      {/* Header Section */}
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 lg:gap-12">
        <div className="space-y-4 md:space-y-6">
          <div className="flex items-center gap-2 md:gap-3">
             <div className="size-2 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
             <span className="text-[10px] md:text-xs font-heading tracking-[0.2em] uppercase font-black text-primary/80">
               Archive Access | Online
             </span>
          </div>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-heading font-black tracking-tighter uppercase leading-none">
            Browse <span className="text-primary italic">Catalogue</span>.
          </h1>
          <p className="text-base md:text-lg lg:text-xl font-sans text-muted-foreground leading-relaxed max-w-2xl">
            Discover thousands of titles. Filter by subject, category, or author and find your next great read in the digital stack.
          </p>
        </div>
        
        <div className="w-full lg:w-[450px]">
            <BookFilters initialQuery={query} initialCategory={category} />
        </div>
      </section>

      {/* Main List Section */}
      <section className="grid grid-cols-1 gap-8">
        <Suspense fallback={<BookListSkeleton />}>
          <BookList query={query} category={category} />
        </Suspense>
      </section>
    </div>
  );
}

function BookListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="space-y-6 bg-card/20 border border-border/40 p-6 rounded-3xl animate-pulse">
          <div className="aspect-3/4 rounded-2xl bg-muted" />
          <div className="space-y-3">
            <Skeleton className="h-6 w-3/4 bg-muted" />
            <Skeleton className="h-4 w-1/2 bg-muted" />
          </div>
          <div className="flex justify-between items-center pt-2">
            <Skeleton className="h-8 w-1/3 bg-muted rounded-full" />
            <Skeleton className="h-8 w-1/4 bg-muted rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
