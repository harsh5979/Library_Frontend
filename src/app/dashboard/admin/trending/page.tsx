"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GripVertical, Star, StarOff, Search, Zap, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { booksApi } from "@/api/books";
import { Book } from "@/types/book";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function TrendingManagePage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  // Featured books (currently shown in Trending Now)
  const { data: featuredData, isLoading: featuredLoading } = useQuery({
    queryKey: ["featured-books"],
    queryFn: () => booksApi.getFeatured(),
    staleTime: 30_000,
  });

  // All books for picking
  const { data: allData, isLoading: allLoading } = useQuery({
    queryKey: ["admin-books-pick", search],
    queryFn: () =>
      search
        ? booksApi.search(search, 0, 20)
        : booksApi.getAll({ page: 0, size: 20 }),
    staleTime: 30_000,
  });

  const featureMutation = useMutation({
    mutationFn: ({ id, featured, order }: { id: number; featured: boolean; order: number }) =>
      booksApi.setFeatured(id, featured, order),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["featured-books"] });
      queryClient.invalidateQueries({ queryKey: ["admin-books-pick"] });
    },
    onError: () => toast.error("Failed to update featured status"),
  });

  const featured: Book[] = (featuredData as any)?.data || [];
  const allBooks: Book[] = (allData as any)?.data?.content || (allData as any)?.data || [];
  const featuredIds = new Set(featured.map((b) => b.id));

  // Add book to featured
  function addFeatured(book: Book) {
    if (featured.length >= 10) {
      toast.error("Max 10 featured books allowed");
      return;
    }
    featureMutation.mutate({ id: book.id, featured: true, order: featured.length });
    toast.success(`"${book.title}" added to Trending Now`);
  }

  // Remove book from featured
  function removeFeatured(book: Book) {
    featureMutation.mutate({ id: book.id, featured: false, order: 0 });
    toast.success(`"${book.title}" removed from Trending Now`);
  }

  // Drag reorder
  function onDragStart(index: number) {
    setDragIndex(index);
  }

  function onDrop(dropIndex: number) {
    if (dragIndex === null || dragIndex === dropIndex) return;
    const reordered = [...featured];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(dropIndex, 0, moved);
    // Save new order for all affected books
    reordered.forEach((book, i) => {
      featureMutation.mutate({ id: book.id, featured: true, order: i });
    });
    setDragIndex(null);
    queryClient.setQueryData(["featured-books"], (old: any) => ({
      ...old,
      data: reordered,
    }));
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-4">
          <div className="h-[2px] w-12 bg-primary/40 rounded-full" />
          <span className="text-[10px] font-heading tracking-[0.4em] font-black text-primary uppercase">
            Homepage Control
          </span>
        </div>
        <h1 className="text-5xl font-heading font-black tracking-tighter uppercase flex items-center gap-4">
          <Zap className="size-10 text-primary" /> Trending Now.
        </h1>
        <p className="text-muted-foreground text-sm font-medium">
          Select up to 10 books and drag to reorder. These appear in the{" "}
          <span className="text-primary font-bold">Trending Now</span> section on the homepage.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* LEFT: Current Featured (drag to reorder) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-black uppercase tracking-widest text-sm flex items-center gap-2">
              <Star className="size-4 text-amber-500 fill-amber-500" />
              Trending Now ({featured.length}/10)
            </h2>
            <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest">
              Drag to reorder
            </Badge>
          </div>

          <div className="space-y-3 min-h-[200px]">
            {featuredLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-2xl" />
                ))
              : featured.length === 0
              ? (
                <div className="h-48 rounded-2xl border-2 border-dashed border-border/30 flex items-center justify-center text-muted-foreground/40 text-sm font-bold uppercase tracking-widest">
                  No books selected — pick from the right
                </div>
              )
              : featured.map((book, index) => (
                  <div
                    key={book.id}
                    draggable
                    onDragStart={() => onDragStart(index)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => onDrop(index)}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-2xl bg-card/50 ring-1 ring-border/20 cursor-grab active:cursor-grabbing hover:ring-primary/30 transition-all group",
                      dragIndex === index && "opacity-40 scale-95"
                    )}
                  >
                    <GripVertical className="size-5 text-muted-foreground/30 group-hover:text-primary/50 shrink-0" />
                    <div className="size-12 rounded-xl overflow-hidden bg-secondary shrink-0">
                      {book.coverImageUrl ? (
                        <img src={book.coverImageUrl} className="size-full object-cover" alt="" />
                      ) : (
                        <div className="size-full flex items-center justify-center">
                          <BookOpen className="size-5 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate">{book.title}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest truncate">
                        {book.author}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[10px] font-black text-muted-foreground/40 uppercase">
                        #{index + 1}
                      </span>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-8 rounded-xl hover:bg-rose-500/10 hover:text-rose-500"
                        onClick={() => removeFeatured(book)}
                        disabled={featureMutation.isPending}
                      >
                        <StarOff className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))}
          </div>
        </div>

        {/* RIGHT: All books to pick from */}
        <div className="space-y-4">
          <h2 className="font-heading font-black uppercase tracking-widest text-sm">
            All Books — Click to Add
          </h2>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/40" />
            <Input
              placeholder="Search books..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-12 rounded-xl bg-secondary/20 border-border/20 text-sm"
            />
          </div>

          <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
            {allLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-xl" />
                ))
              : allBooks.map((book) => {
                  const isAdded = featuredIds.has(book.id);
                  return (
                    <div
                      key={book.id}
                      className={cn(
                        "flex items-center gap-4 p-3 rounded-xl ring-1 transition-all",
                        isAdded
                          ? "ring-primary/30 bg-primary/5"
                          : "ring-border/10 bg-card/30 hover:ring-primary/20 hover:bg-card/60 cursor-pointer"
                      )}
                      onClick={() => !isAdded && addFeatured(book)}
                    >
                      <div className="size-10 rounded-lg overflow-hidden bg-secondary shrink-0">
                        {book.coverImageUrl ? (
                          <img src={book.coverImageUrl} className="size-full object-cover" alt="" />
                        ) : (
                          <div className="size-full flex items-center justify-center">
                            <BookOpen className="size-4 text-muted-foreground/30" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm truncate">{book.title}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest truncate">
                          {book.author}
                        </p>
                      </div>
                      {isAdded ? (
                        <Badge className="bg-primary/10 text-primary border-none text-[9px] font-black uppercase tracking-widest shrink-0">
                          Added
                        </Badge>
                      ) : (
                        <Star className="size-4 text-muted-foreground/20 shrink-0" />
                      )}
                    </div>
                  );
                })}
          </div>
        </div>
      </div>
    </div>
  );
}
