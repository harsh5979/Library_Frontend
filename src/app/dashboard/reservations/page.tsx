"use client";

import { useQuery } from "@tanstack/react-query";
import { Clock, Ticket, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
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

export default function ReservationsPage() {
  const { data: reservationsResponse, isLoading } = useQuery({
    queryKey: ["my-reservations"],
    queryFn: () => api.get("/reservations/my"),
  });

  const reservations = reservationsResponse?.data?.content || [];

  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em]">
          <Ticket className="size-4" />
          <span>Reservation Queue</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-heading font-black tracking-tighter uppercase leading-none">
          My <span className="text-primary italic">Reservations</span>.
        </h1>
        <p className="text-muted-foreground/60 max-w-2xl font-sans text-sm md:text-base leading-relaxed">
          Manage your upcoming book collections and track your position in the reservation queue.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="border-border/40 bg-card/40 backdrop-blur-xl rounded-3xl p-8">
              <div className="flex gap-8 items-center">
                <Skeleton className="size-24 rounded-2xl bg-secondary/50" />
                <div className="space-y-4 flex-1">
                  <Skeleton className="h-6 w-1/3 bg-secondary/50 rounded-full" />
                  <Skeleton className="h-4 w-1/4 bg-secondary/50 rounded-full" />
                </div>
              </div>
            </Card>
          ))
        ) : reservations.length > 0 ? (
          reservations.map((res: any) => (
            <Card key={res.id} className="group border-border/40 bg-card/30 backdrop-blur-xl hover:bg-card/50 transition-all rounded-3xl overflow-hidden p-6 md:p-8 hover:shadow-xl hover:shadow-primary/5">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="relative size-32 rounded-3xl overflow-hidden ring-1 ring-border/40 group-hover:ring-primary/20 transition-all">
                  <img src={res.coverImageUrl || `https://images.unsplash.com/photo-1543005152-84524823467f?w=400&h=600&fit=crop`} alt="" className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700" />
                </div>
                
                <div className="flex-1 space-y-3 text-center md:text-left">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                    <h3 className="text-2xl font-heading font-black uppercase tracking-tight">{res.bookName}</h3>
                    <StatusBadge status={res.status} />
                  </div>
                  <p className="text-muted-foreground/60 font-medium italic">Pickup Location: <span className="font-bold">{res.branchName || "Main Branch"}</span></p>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 flex items-center justify-center md:justify-start gap-2">
                    <Clock className="size-3" /> Requested at: {new Date(res.reservedAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex flex-col gap-3 shrink-0 w-full md:w-auto">
                    {res.status === "READY" && (
                        <Button className="h-14 px-8 rounded-2xl font-heading font-black uppercase text-xs tracking-widest bg-emerald-500 hover:bg-emerald-600 shadow-xl shadow-emerald-500/10 hover:shadow-emerald-500/20">
                            Collect Asset
                        </Button>
                    )}
                    <Button variant="outline" className="h-14 px-8 rounded-2xl font-heading font-black uppercase text-xs tracking-widest border-border/40 hover:bg-secondary transition-all">
                        View Log
                    </Button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-32 space-y-6 bg-secondary/5 rounded-4xl border border-dashed border-border/40">
            <div className="size-20 rounded-full bg-secondary/20 flex items-center justify-center border border-border/40">
                <Ticket className="size-8 text-muted-foreground/40" />
            </div>
            <p className="font-heading font-black text-[10px] uppercase tracking-[0.3em] text-muted-foreground/40">No Active Reservations</p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const configs: Record<string, any> = {
    PENDING: { color: "bg-amber-500/10 text-amber-500", icon: Clock },
    READY: { color: "bg-emerald-500/10 text-emerald-500", icon: CheckCircle2 },
    COLLECTED: { color: "bg-blue-500/10 text-blue-500", icon: Ticket },
    CANCELLED: { color: "bg-rose-500/10 text-rose-500", icon: XCircle },
    EXPIRED: { color: "bg-muted text-muted-foreground", icon: AlertCircle }
  };

  const config = configs[status] || configs.PENDING;
  const Icon = config.icon;

  return (
    <div className={cn("px-4 py-1.5 rounded-full flex items-center gap-2 text-[9px] font-black uppercase tracking-widest border border-transparent", config.color, "border-current/10")}>
       <Icon className="size-3" />
       {status}
    </div>
  );
}
