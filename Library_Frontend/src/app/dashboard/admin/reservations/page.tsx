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
  CheckCircle2,
  Clock,
  XCircle,
  PackageCheck,
  Zap,
  Ticket
} from "lucide-react";
import { toast } from "sonner";

import { reservationsApi, Reservation } from "@/api/reservations";
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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function AdminReservationsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);

  const { data: pagedData, isLoading } = useQuery({
    queryKey: ["admin-reservations", page],
    queryFn: () => reservationsApi.getAll(page, 10),
  });

  const approveMutation = useMutation({
    mutationFn: (id: number) => reservationsApi.approve(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reservations"] });
      toast.success("Request Approved", { description: "Asset reservation moving to ready state." });
    }
  });

  const readyMutation = useMutation({
    mutationFn: (id: number) => reservationsApi.markReady(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reservations"] });
      toast.success("Asset Ready", { description: "User has been notified for collection." });
    }
  });

  const collectMutation = useMutation({
    mutationFn: (id: number) => reservationsApi.markCollected(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reservations"] });
      toast.success("Asset Collected", { description: "Inventory synchronization complete." });
    }
  });

  const responseData = pagedData as any;
  const reservations = (responseData?.data?.content as Reservation[]) || [];
  const totalPages = (responseData?.data?.totalPages as number) || 0;

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-12 duration-1000">
      {/* Reservation Queue Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
        <div className="space-y-2">
            <div className="flex items-center gap-4">
               <div className="h-[2px] w-12 bg-primary/40 rounded-full" />
               <h2 className="text-[10px] font-heading tracking-[0.4em] font-black text-primary uppercase">Asset Logistics Control</h2>
            </div>
            <h1 className="text-6xl font-heading font-black tracking-tighter uppercase">Request Queue.</h1>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
           {/* Add filter buttons here if needed */}
        </div>
      </div>

      {/* Main Queue Table View */}
      <div className="border-none shadow-2xl bg-card/10 backdrop-blur-2xl ring-1 ring-white/5 rounded-[2.5rem] overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-secondary/20 h-24">
              <TableRow className="border-none hover:bg-transparent">
                <TableHead className="px-10 font-heading font-black text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Client Identity</TableHead>
                <TableHead className="font-heading font-black text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Asset Identifier</TableHead>
                <TableHead className="font-heading font-black text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Status Protocol</TableHead>
                <TableHead className="font-heading font-black text-[10px] uppercase tracking-[0.3em] text-muted-foreground">In Queue Since</TableHead>
                <TableHead className="font-heading font-black text-[10px] uppercase tracking-[0.3em] text-muted-foreground text-right px-10">Protocols</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-white/5 h-32">
                    <TableCell className="px-10"><Skeleton className="h-10 w-48 rounded-xl" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-64 rounded-lg" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-32 rounded-lg" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24 rounded-lg" /></TableCell>
                    <TableCell className="text-right px-10"><Skeleton className="h-10 w-48 rounded-xl ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : reservations.length > 0 ? (
                reservations.map((res) => (
                  <TableRow key={res.id} className="border-white/5 h-32 hover:bg-white/[0.02] transition-all group overflow-hidden relative">
                    <TableCell className="px-10">
                        <div className="flex items-center gap-6">
                            <div className="size-16 rounded-2xl bg-secondary/50 flex items-center justify-center font-heading font-black text-primary transition-all group-hover:bg-primary group-hover:text-white group-hover:rotate-6">
                                {res.userName ? res.userName.charAt(0) : "U"}
                            </div>
                            <p className="font-heading font-black text-lg uppercase tracking-tighter truncate max-w-sm group-hover:text-primary transition-colors">{res.userName || "ANONYMOUS NODE"}</p>
                        </div>
                    </TableCell>
                    <TableCell>
                        <div className="space-y-1">
                            <p className="font-heading font-black text-sm uppercase tracking-tighter text-foreground/80">{res.bookTitle}</p>
                            <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">{res.bookAuthor}</p>
                        </div>
                    </TableCell>
                    <TableCell>
                        <StatusBadge status={res.status} />
                    </TableCell>
                    <TableCell className="font-sans font-bold text-[10px] tabular-nums text-muted-foreground tracking-widest uppercase">
                        {new Date(res.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right px-10">
                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
    
                            {res.status === "PENDING" && (
                                <Button 
                                  variant="secondary" 
                                  className="h-12 px-6 rounded-xl font-heading font-black uppercase text-[10px] tracking-widest bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all shadow-xl"
                                  onClick={() => approveMutation.mutate(res.id)}
                                >
                                    <CheckCircle2 className="size-4 mr-2" /> Approve
                                </Button>
                            )}

                            {res.status === "READY" && (
                                <Button 
                                  variant="secondary" 
                                  className="h-12 px-6 rounded-xl font-heading font-black uppercase text-[10px] tracking-widest bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-all shadow-xl"
                                  onClick={() => collectMutation.mutate(res.id)}
                                >
                                    <PackageCheck className="size-4 mr-2" /> Mark Collected
                                </Button>
                            )}
                            
                            <Button variant="secondary" size="icon" className="size-12 rounded-xl border border-white/5 hover:bg-white/5">
                                <Zap className="size-5" />
                            </Button>
                        </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-96 text-center">
                    <div className="space-y-6">
                        <Ticket className="size-16 mx-auto text-muted-foreground/20 animate-bounce" />
                        <h3 className="text-2xl font-heading font-black uppercase text-muted-foreground/40 tracking-widest uppercase">Request Queue Empty</h3>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Dynamic Pagination Protocol */}
        <div className="h-24 px-10 flex items-center justify-between border-t border-white/5 bg-secondary/10">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
             Synchronizing Queue Page {page + 1} of {totalPages}
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
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const configs: Record<string, any> = {
    PENDING: { color: "bg-amber-500/10 text-amber-500", icon: Clock },
    READY: { color: "bg-emerald-500/10 text-emerald-500", icon: CheckCircle2 },
    COLLECTED: { color: "bg-blue-500/10 text-blue-500", icon: Ticket },
    CANCELLED: { color: "bg-rose-500/10 text-rose-500", icon: XCircle },
    EXPIRED: { color: "bg-muted text-muted-foreground", icon: Zap }
  };

  const config = configs[status] || configs.PENDING;
  const Icon = config.icon;

  return (
    <div className={cn("px-4 py-1.5 rounded-full flex items-center gap-2 text-[9px] font-black uppercase tracking-widest border border-transparent w-fit", config.color, "border-current/10")}>
       <Icon className="size-3" />
       {status}
    </div>
  );
}
