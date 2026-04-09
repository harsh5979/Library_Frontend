"use client";

import { useQuery } from "@tanstack/react-query";
import { History, BookOpen, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/api";
import { cn } from "@/lib/utils";

export default function BorrowHistoryPage() {
  const { data: historyResponse, isLoading } = useQuery({
    queryKey: ["borrow-history"],
    queryFn: () => api.get("/borrows/my-history"),
  });

  const borrows = historyResponse?.data || [];

  return (
    <div className="space-y-12 pb-24">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em]">
          <History className="size-4" />
          <span>Activity Log</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-heading font-black tracking-tighter uppercase leading-none">
          Borrow <span className="text-primary italic">History</span>.
        </h1>
        <p className="text-muted-foreground/60 max-w-2xl font-sans text-sm md:text-base leading-relaxed">
          Keep track of your borrowed books, due dates, and return status across all library branches.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="border-border/40 bg-card/40 backdrop-blur-xl rounded-[2rem] p-8">
              <div className="flex gap-8 items-center">
                <Skeleton className="size-24 rounded-2xl bg-secondary/50" />
                <div className="space-y-4 flex-1">
                  <Skeleton className="h-6 w-1/3 bg-secondary/50 rounded-full" />
                  <Skeleton className="h-4 w-1/4 bg-secondary/50 rounded-full" />
                </div>
              </div>
            </Card>
          ))
        ) : borrows.length > 0 ? (
          borrows.map((borrow: any) => (
            <Card key={borrow.id} className="group border-border/40 bg-card/30 backdrop-blur-xl hover:bg-card/50 transition-all rounded-3xl overflow-hidden p-6 md:p-8 hover:shadow-xl hover:shadow-primary/5 cursor-default relative">
              <div className="absolute top-0 right-0 p-8 h-full flex flex-col justify-center items-end opacity-10 group-hover:opacity-20 transition-all">
                   <div className="size-24 rounded-full bg-primary/20 blur-2xl" />
              </div>
              
              <div className="flex flex-col md:flex-row gap-10 items-center relative z-10">
                <div className="relative size-36 shrink-0 rounded-3xl overflow-hidden ring-1 ring-border/40 group-hover:ring-primary/20 transition-all shadow-2xl">
                  <img src={borrow.bookCover || "https://images.unsplash.com/photo-1543005152-84524823467f?w=400&h=600&fit=crop"} alt="" className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                
                <div className="flex-1 space-y-6 text-center md:text-left">
                  <div className="space-y-1">
                    <h3 className="text-3xl font-heading font-black uppercase tracking-tighter group-hover:text-primary transition-colors">{borrow.bookTitle}</h3>
                    <p className="text-muted-foreground/60 font-black text-xs uppercase tracking-widest italic">{borrow.bookAuthor}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4 pt-4 border-t border-border/10">
                    <TimelineItem icon={Clock} label="Synchronized" date={borrow.borrowDate} />
                    {borrow.returnDate && <TimelineItem icon={CheckCircle2} label="De-Allocated" date={borrow.returnDate} isSuccess />}
                    {!borrow.returnDate && <TimelineItem icon={AlertCircle} label="Estimated Cycle" date={borrow.dueDate} isDanger />}
                  </div>
                </div>

                <div className="flex flex-col gap-3 shrink-0 w-full md:w-auto">
                    <Button variant="outline" className="h-16 px-10 rounded-2xl font-heading font-black uppercase text-xs tracking-[0.2em] border-border/40 hover:bg-secondary transition-all duration-500 shadow-xl shadow-black/5 hover:translate-x-2">
                        Inspect Asset <Clock className="size-4 ml-3 opacity-40" />
                    </Button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-32 space-y-6 bg-secondary/5 rounded-4xl border border-dashed border-border/40 mt-10">
            <div className="size-20 rounded-full bg-secondary/20 flex items-center justify-center border border-border/40">
                <History className="size-8 text-muted-foreground/40" />
            </div>
            <p className="font-heading font-black text-[10px] uppercase tracking-[0.3em] text-muted-foreground/40">No Borrowing History Found</p>
          </div>
        )}
      </div>
    </div>
  );
}

function TimelineItem({ icon: Icon, label, date, isSuccess, isDanger }: any) {
    return (
        <div className="flex items-center gap-4 group/item">
            <div className={cn(
                "size-10 rounded-xl flex items-center justify-center border border-border/40 transition-transform group-hover/item:scale-110 shadow-lg",
                isSuccess && "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
                isDanger && "bg-rose-500/10 text-rose-500 border-rose-500/20",
                !isSuccess && !isDanger && "bg-secondary text-muted-foreground"
            )}>
                <Icon className="size-4" />
            </div>
            <div className="text-left">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-30">{label}</p>
                <p className={cn("text-xs font-black uppercase tracking-widest mt-1", isSuccess && "text-emerald-500", isDanger && "text-rose-500")}>
                    {new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
            </div>
        </div>
    )
}
