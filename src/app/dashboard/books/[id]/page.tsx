import Image from "next/image";
import Link from "next/link";
import { 
  ArrowLeft,
  MapPin, 
  Star, 
  Clock, 
  BookMarked,
  Info,
  Calendar,
  User,
  Hash,
  Share2
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExpandableText } from "@/components/ui/expandable-text";
import { ReserveButton } from "@/components/books/ReserveButton";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

async function getBook(id: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/books/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Fetch Error:", error);
    return null;
  }
}

async function getAvailability(id: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/books/${id}/availability`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
  } catch {
    return null;
  }
}

export default async function BookDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const book = await getBook(id);
  const availability = await getAvailability(id);

  if (!book) return <div className="p-20 text-center font-heading tracking-widest uppercase">Book not found.</div>;

  return (
    <div className="space-y-12 pb-20 max-w-7xl mx-auto">
      {/* Back Button */}
      <nav className="flex items-center gap-4 px-4 sm:px-0">
        <Link href="/dashboard/books">
          <Button variant="ghost" className="rounded-full gap-3 px-4 sm:px-6 py-4 sm:py-6 font-heading tracking-widest text-[10px] sm:text-xs h-9 sm:h-10 border-border/40 bg-card/20 hover:bg-secondary transition-all">
            <ArrowLeft className="size-4" /> Back to Archive
          </Button>
        </Link>
      </nav>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-16">
        {/* Left Column: Cover & Actions */}
        <section className="xl:col-span-4 space-y-12">
          <div className="aspect-[2/3] md:aspect-[3/4.5] rounded-[3rem] overflow-hidden relative shadow-2xl shadow-primary/10 border-4 border-card bg-secondary/50 group">
             <Image 
                src={book.coverImageUrl || `https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=3087&auto=format&fit=crop`} 
                alt={book.title} 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-700" 
                priority
             />
             <div className="absolute top-6 left-6">
                <Badge className="bg-primary text-white font-heading font-black tracking-widest text-[10px] px-4 py-1.5 uppercase rounded-xl">
                   {book.category}
                </Badge>
             </div>
          </div>

          <div className="space-y-4">
             <ReserveButton book={book} availability={availability} />
             <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-14 rounded-2xl gap-3 border-border/40 font-heading tracking-widest text-xs uppercase hover:bg-secondary">
                   <Share2 className="size-4" /> Share
                </Button>
                <Button variant="outline" className="h-14 rounded-2xl gap-3 border-border/40 font-heading tracking-widest text-xs uppercase hover:bg-secondary">
                   <Info className="size-4" /> Report
                </Button>
             </div>
          </div>
        </section>

        {/* Right Column: Details & Info */}
        <main className="xl:col-span-8 space-y-16">
          <div className="space-y-8">
            <div className="space-y-6">
               <div className="flex items-center gap-3">
                  <Star className="size-6 fill-amber-400 text-amber-500" />
                  <span className="text-sm font-heading font-black tracking-widest uppercase text-amber-600">
                    Highest Circulated | {book.averageRating || "4.8"} Rating
                  </span>
               </div>
               <h1 className="text-4xl sm:text-6xl md:text-8xl font-heading font-black tracking-tighter leading-[0.9] uppercase sm:whitespace-pre-line px-4 sm:px-0">
                  {book.title}
               </h1>
               <div className="flex flex-wrap items-center gap-8 py-6 border-y border-border/40">
                  <div className="flex items-center gap-3">
                     <User className="size-5 text-primary" />
                     <div className="space-y-0.5">
                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Author</p>
                        <p className="font-heading font-black tracking-widest uppercase text-sm">{book.author}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-3">
                     <Hash className="size-5 text-primary" />
                     <div className="space-y-0.5">
                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">ISBN Code</p>
                        <p className="font-heading font-black tracking-widest uppercase text-sm">{book.isbn}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-3">
                     <Calendar className="size-5 text-primary" />
                     <div className="space-y-0.5">
                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Publication</p>
                        <p className="font-heading font-black tracking-widest uppercase text-sm">{book.year}</p>
                     </div>
                  </div>
               </div>
            </div>

             <div className="prose prose-invert max-w-none px-4 sm:px-0">
               <ExpandableText 
                  text={book.description || "No description available."}
                  limit={300}
                  className="text-lg sm:text-xl font-sans text-muted-foreground leading-relaxed selection:bg-primary/20"
               />
             </div>
          </div>

          <Tabs defaultValue="availability" className="space-y-8">
            <TabsList className="bg-secondary/50 p-2 rounded-2xl h-16 min-h-[64px] border border-border/40 gap-2">
              <TabsTrigger value="availability" className="px-8 font-heading tracking-widest uppercase text-xs h-12 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-xl transition-all">
                Availability
              </TabsTrigger>
              <TabsTrigger value="specifications" className="px-8 font-heading tracking-widest uppercase text-xs h-12 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-xl transition-all">
                 Details
              </TabsTrigger>
              <TabsTrigger value="reviews" className="px-8 font-heading tracking-widest uppercase text-xs h-12 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-xl transition-all">
                 User Reviews
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="availability" className="space-y-8 p-1">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {availability?.branches?.length > 0 ? availability.branches.map((branch: any, i: number) => (
                    <Card key={i} className="border-border/40 bg-card/40 backdrop-blur-xl hover:bg-card/60 transition-all rounded-[2rem] overflow-hidden group">
                       <CardContent className="p-8">
                           <div className="flex items-center justify-between mb-6">
                              <div className="flex items-center gap-4">
                                 <MapPin className="size-6 text-primary" />
                                 <div className="space-y-1">
                                     <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground opacity-60">Library Branch</p>
                                     <h4 className="font-heading font-black tracking-widest uppercase text-md line-clamp-1">{branch.branchName}</h4>
                                 </div>
                              </div>
                              <Badge className={cn(
                                "px-3 md:px-4 py-1.5 rounded-xl font-heading font-black tracking-widest text-[8px] md:text-[9px] uppercase whitespace-nowrap ml-2",
                                branch.availableCopies > 0 ? "bg-emerald-500 text-white" : "bg-destructive text-white"
                              )}>
                                {branch.availableCopies > 0 ? "In Stock" : "Out of Stock"}
                              </Badge>
                           </div>
                          <div className="flex items-center justify-between pt-6 border-t border-border/20">
                             <p className="text-2xl font-heading font-black tracking-tighter uppercase">{branch.availableCopies} <span className="text-xs opacity-60 font-black">Copies</span></p>
                             <div className="flex items-center gap-2 text-muted-foreground font-sans font-medium text-sm">
                                <Clock className="size-4" />
                                Shelf: {branch.shelfLocation || "GENERAL"}
                             </div>
                          </div>
                       </CardContent>
                    </Card>
                  )) : (
                    <div className="col-span-full p-12 text-center bg-card/20 rounded-[2rem] border border-dashed border-border/40">
                      <p className="font-heading tracking-widest uppercase text-xs text-muted-foreground">No stock information available for this title.</p>
                    </div>
                  )}
               </div>
            </TabsContent>

            <TabsContent value="specifications" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-card/20 border border-border/40 p-10 rounded-[3rem]">
                   {[
                    { label: "Edition", value: book.edition || "Standard" },
                    { label: "Year", value: book.year },
                    { label: "Pages", value: book.totalPages },
                    { label: "Language", value: book.language || "English" },
                    { label: "Publisher", value: book.publisher },
                    { label: "Subject", value: book.subject }
                   ].map((spec, i) => (
                    <div key={i} className="space-y-1.5">
                       <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">{spec.label}</p>
                       <p className="font-heading font-black tracking-widest uppercase text-lg">{spec.value || "Not Specified"}</p>
                    </div>
                   ))}
                </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
