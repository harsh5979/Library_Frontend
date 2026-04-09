"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  BookOpen, 
  Archive, 
  Database, 
} from "lucide-react";
import { toast } from "sonner";

import { booksApi } from "@/api/books";
import { Book } from "@/types/book";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BookForm } from "@/components/admin/BookForm";
import { cn } from "@/lib/utils";

export default function AdminBooksPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const { data: pagedData, isLoading } = useQuery({
    queryKey: ["admin-books", page, searchTerm],
    queryFn: () => searchTerm 
      ? booksApi.search(searchTerm, page, 10)
      : booksApi.getAll({ page, size: 10 }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => booksApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-books"] });
      toast.success("Asset Purged", {
        description: "Library record has been securely decoupled."
      });
    },
    onError: (error: any) => {
      toast.error("Process Reject", {
        description: error.message || "Failed to purge asset."
      });
    }
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => booksApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-books"] });
      setIsAddOpen(false);
      toast.success("Asset Indexed", {
        description: "New resource available in the global network."
      });
    },
    onError: (error: any) => {
      toast.error("Process Reject", {
        description: error.message || "Indexing protocol failed."
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: any }) => booksApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-books"] });
      setEditingBook(null);
      toast.success("Asset Sync'd", {
        description: "Central archive updated successfully."
      });
    },
    onError: (error: any) => {
      toast.error("Process Reject", {
        description: error.message || "Update protocol failed."
      });
    }
  });

  const responseData = pagedData as any;
  const books = responseData?.data?.content || [];
  const totalPages = responseData?.data?.totalPages || 0;

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-12 duration-1000">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
        <div className="space-y-2">
            <div className="flex items-center gap-4">
               <div className="h-[2px] w-12 bg-primary/40 rounded-full" />
               <h2 className="text-[10px] font-heading tracking-[0.4em] font-black text-primary uppercase">Omnishelf. Catalogue Control</h2>
            </div>
            <h1 className="text-6xl font-heading font-black tracking-tighter uppercase">Asset Archive.</h1>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative group w-full lg:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="QUERY RESOURCE PROTOCOL..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-16 pl-14 bg-secondary/20 border-2 border-border/10 rounded-2xl focus-visible:ring-0 focus-visible:border-primary/40 font-heading font-black uppercase text-xs tracking-widest placeholder:text-muted-foreground/20"
            />
          </div>

          <Sheet open={isAddOpen} onOpenChange={setIsAddOpen}>
            <SheetTrigger asChild>
                <Button className="h-16 px-10 text-xs font-heading font-black uppercase tracking-[0.2em] bg-primary hover:bg-primary/90 rounded-2xl shadow-2xl shadow-primary/20 hover:shadow-primary/40 transition-all group active:scale-95">
                    <Plus className="mr-3 size-5 group-hover:rotate-90 transition-transform duration-500" /> 
                    Index New Asset
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-3xl overflow-y-auto bg-background/95 backdrop-blur-2xl border-l-border/10 p-6 sm:p-8">
                <SheetHeader className="mb-8 md:mb-12">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-2 sm:p-3 bg-primary rounded-xl text-primary-foreground shadow-2xl shadow-primary/40">
                            <Plus className="size-5 sm:size-6" />
                        </div>
                        <span className="text-[9px] sm:text-[10px] font-heading tracking-[0.2em] sm:tracking-[0.4em] font-black text-muted-foreground uppercase">Inventory Ingestion Protocol v8.2</span>
                    </div>
                    <SheetTitle className="text-3xl sm:text-5xl font-heading font-black uppercase tracking-tighter leading-none">New Global Asset.</SheetTitle>
                </SheetHeader>
                <BookForm 
                  onSubmit={async (data) => createMutation.mutate(data)} 
                  isLoading={createMutation.isPending} 
                />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="border-none shadow-2xl bg-card/10 backdrop-blur-2xl ring-1 ring-white/5 rounded-[2.5rem] overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-secondary/20 h-24">
              <TableRow className="border-none hover:bg-transparent">
                <TableHead className="px-10 font-heading font-black text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Asset Identity</TableHead>
                <TableHead className="font-heading font-black text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Classification</TableHead>
                <TableHead className="font-heading font-black text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Protocol ID</TableHead>
                <TableHead className="font-heading font-black text-[10px] uppercase tracking-[0.3em] text-muted-foreground">In Stock</TableHead>
                <TableHead className="font-heading font-black text-[10px] uppercase tracking-[0.3em] text-muted-foreground text-right px-10">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-white/5 h-32">
                    <TableCell className="px-10"><Skeleton className="h-10 w-64 rounded-xl" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-32 rounded-lg" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-40 rounded-lg" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-12 rounded-lg" /></TableCell>
                    <TableCell className="text-right px-10"><Skeleton className="h-10 w-32 rounded-xl ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : books.length > 0 ? (
                books.map((book: Book) => (
                  <TableRow key={book.id} className="border-white/5 h-32 hover:bg-white/[0.02] transition-all group overflow-hidden relative">
                    <TableCell className="px-10">
                        <div className="flex items-center gap-6">
                            <div className="size-16 relative rounded-xl overflow-hidden shadow-2xl group-hover:scale-110 transition-transform duration-500 bg-secondary flex items-center justify-center">
                                {book.coverImageUrl ? (
                                    <img src={book.coverImageUrl} className="object-cover size-full" alt="" />
                                ) : (
                                    <BookOpen className="size-6 text-primary opacity-40" />
                                )}
                            </div>
                            <div className="space-y-1">
                                <p className="font-heading font-black text-lg uppercase tracking-tighter truncate max-w-sm group-hover:text-primary transition-colors">{book.title}</p>
                                <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">{book.author}</p>
                            </div>
                        </div>
                    </TableCell>
                    <TableCell>
                        <Badge className="bg-primary/10 text-primary border-none font-black text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-lg">{book.category}</Badge>
                    </TableCell>
                    <TableCell className="font-sans font-bold text-xs tabular-nums text-muted-foreground tracking-widest">{book.isbn}</TableCell>
                    <TableCell>
                         <div className="flex items-center gap-3">
                            <span className={cn(
                                "text-lg font-heading font-black",
                                book.availableCopies > 0 ? "text-emerald-500" : "text-rose-500"
                            )}>{book.availableCopies}</span>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase">/ {book.totalCopies}</span>
                         </div>
                    </TableCell>
                    <TableCell className="text-right px-10">
                        <div className="flex justify-end gap-3 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
                            <Button 
                              variant="secondary" 
                              size="icon" 
                              className="size-12 rounded-xl hover:bg-primary hover:text-white transition-all shadow-xl"
                              onClick={() => setEditingBook(book)}
                            >
                                <Edit className="size-5" />
                            </Button>
                            
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="secondary" size="icon" className="size-12 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-xl">
                                        <Trash2 className="size-5" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-black/90 backdrop-blur-2xl border-white/10 p-12 text-center max-w-md rounded-[2.5rem]">
                                    <div className="size-20 bg-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                                        <Archive className="size-10 text-rose-500" />
                                    </div>
                                    <DialogHeader className="space-y-4">
                                        <DialogTitle className="text-4xl font-heading font-black uppercase text-white tracking-tighter text-center">Confirm Purge.</DialogTitle>
                                        <p className="text-white/40 font-medium leading-relaxed">Initialization of final asset decoupling. All historic metadata will be archived irreversibly.</p>
                                    </DialogHeader>
                                    <div className="flex gap-4 mt-12">
                                        <Button variant="outline" className="flex-1 h-14 rounded-xl border-white/5 bg-white/5 font-black uppercase tracking-widest text-xs">Abort Operation</Button>
                                        <Button 
                                          className="flex-1 h-14 rounded-xl bg-rose-500 hover:bg-rose-600 font-black uppercase tracking-widest text-xs shadow-xl shadow-rose-500/20"
                                          onClick={() => deleteMutation.mutate(book.id)}
                                        >Execute Decouple</Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-96 text-center">
                    <div className="space-y-6">
                        <Database className="size-16 mx-auto text-muted-foreground/20 animate-bounce" />
                        <div className="space-y-2">
                             <h3 className="text-2xl font-heading font-black uppercase text-muted-foreground/40 tracking-widest">Protocol Null Reference</h3>
                             <p className="text-xs text-muted-foreground/20 font-black uppercase">No physical assets detected within query scope.</p>
                        </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="h-24 px-10 flex items-center justify-between border-t border-white/5 bg-secondary/10">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
             Synchronizing Page {page + 1} of {totalPages}
          </div>
          <div className="flex gap-4">
            <Button 
              size="icon" 
              variant="outline" 
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
              className="size-12 rounded-xl border-2 border-border/20"
            >
                <ChevronLeft className="size-5" />
            </Button>
            <Button 
              size="icon" 
              variant="outline" 
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
              className="size-12 rounded-xl border-2 border-border/20 text-primary border-primary/20"
            >
                <ChevronRight className="size-5" />
            </Button>
          </div>
        </div>
      </div>

      <Sheet open={!!editingBook} onOpenChange={(open) => !open && setEditingBook(null)}>
        <SheetContent side="right" className="w-full sm:max-w-3xl overflow-y-auto bg-background/95 backdrop-blur-2xl border-l-border/10 p-6 sm:p-8">
            <SheetHeader className="mb-8 md:mb-12">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-2 sm:p-3 bg-primary rounded-xl text-primary-foreground shadow-2xl shadow-primary/40">
                        <Edit className="size-5 sm:size-6" />
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-heading tracking-[0.2em] sm:tracking-[0.4em] font-black text-muted-foreground uppercase">Asset Synchronization v4.1</span>
                </div>
                <SheetTitle className="text-3xl sm:text-5xl font-heading font-black uppercase tracking-tighter leading-none">Sync Resource.</SheetTitle>
                <p className="text-muted-foreground text-[10px] sm:text-xs font-black uppercase tracking-widest pt-1 sm:pt-2 opacity-40">Protocol Reference: {editingBook?.isbn}</p>
            </SheetHeader>
            <BookForm 
              initialData={editingBook || undefined} 
              onSubmit={async (data) => updateMutation.mutate({ id: editingBook!.id, data })} 
              isLoading={updateMutation.isPending} 
            />
        </SheetContent>
      </Sheet>
    </div>
  );
}
