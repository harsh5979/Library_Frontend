"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Users, 
  Search, 
  ShieldAlert, 
  UserMinus, 
  ShieldCheck, 
  ShieldX,
  ChevronLeft, 
  ChevronRight,
  Fingerprint,
  Mail,
  Building2,
  Phone,
  ArrowUpCircle,
  MoreVertical,
  Activity
} from "lucide-react";
import { toast } from "sonner";

import { adminService } from "@/lib/services/admin";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string | undefined>(undefined);

  const { data: pagedData, isLoading } = useQuery({
    queryKey: ["admin-users", page, searchTerm, filterRole],
    queryFn: () => searchTerm 
      ? adminService.searchUsers(searchTerm, page, 10)
      : adminService.getAllUsers({ page, size: 10, role: filterRole }),
  });

  const blockMutation = useMutation({
    mutationFn: (id: number) => adminService.blockUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.warning("Identity Quarantined", { description: "User access has been restricted." });
    }
  });

  const unblockMutation = useMutation({
    mutationFn: (id: number) => adminService.unblockUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("Identity Restored", { description: "User access has been reactivated." });
    }
  });

  const roleMutation = useMutation({
    mutationFn: ({ id, role }: { id: number, role: string }) => adminService.changeUserRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("Privilege Escalated", { description: "Node authority has been updated." });
    }
  });

  const responseData = pagedData as any;
  const users = responseData?.data?.content || [];
  const totalPages = responseData?.data?.totalPages || 0;

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-12 duration-1000">
      {/* Identity Governance Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
        <div className="space-y-2">
            <div className="flex items-center gap-4">
               <div className="h-[2px] w-12 bg-primary/40 rounded-full" />
               <h2 className="text-[10px] font-heading tracking-[0.4em] font-black text-primary uppercase">Identity Registry Control</h2>
            </div>
            <h1 className="text-6xl font-heading font-black tracking-tighter uppercase">Node Governance.</h1>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative group w-full lg:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="SEARCH IDENTITIES..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-16 pl-14 bg-secondary/20 border-2 border-border/10 rounded-2xl focus-visible:ring-0 focus-visible:border-primary/40 font-heading font-black uppercase text-xs tracking-widest"
            />
          </div>
        </div>
      </div>

      {/* Identity Table View */}
      <div className="border-none shadow-2xl bg-card/10 backdrop-blur-2xl ring-1 ring-white/5 rounded-[2.5rem] overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-secondary/20 h-24">
              <TableRow className="border-none hover:bg-transparent">
                <TableHead className="px-10 font-heading font-black text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Identity Node</TableHead>
                <TableHead className="font-heading font-black text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Privilege Level</TableHead>
                <TableHead className="font-heading font-black text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Affiliation</TableHead>
                <TableHead className="font-heading font-black text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Health Status</TableHead>
                <TableHead className="font-heading font-black text-[10px] uppercase tracking-[0.3em] text-muted-foreground text-right px-10">Protocols</TableHead>
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
              ) : users.length > 0 ? (
                users.map((user: any) => (
                  <TableRow key={user.id} className="border-white/5 h-32 hover:bg-white/[0.02] transition-all group overflow-hidden relative">
                    <TableCell className="px-10">
                        <div className="flex items-center gap-6">
                            <div className={cn(
                                "size-16 rounded-2xl flex items-center justify-center font-heading font-black text-xl shadow-2xl transition-transform duration-500 group-hover:rotate-12",
                                user.isActive ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                            )}>
                                {user.fullName.charAt(0)}
                            </div>
                            <div className="space-y-1">
                                <p className="font-heading font-black text-lg uppercase tracking-tighter group-hover:text-primary transition-colors">{user.fullName}</p>
                                <div className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                                    <Mail className="size-3" /> {user.email}
                                </div>
                            </div>
                        </div>
                    </TableCell>
                    <TableCell>
                        <Badge className={cn(
                            "border-none font-black text-[9px] uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg",
                            user.role === "SUPER_ADMIN" ? "bg-rose-500/10 text-rose-500" : 
                            user.role === "LIBRARIAN" ? "bg-amber-500/10 text-amber-500" :
                            "bg-primary/10 text-primary"
                        )}>
                            {user.role}
                        </Badge>
                    </TableCell>
                    <TableCell>
                        <div className="space-y-1">
                            <p className="font-heading font-black text-sm uppercase tracking-tighter text-foreground/80">{user.department || "NONE"}</p>
                            <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">{user.phone || "NO CONTACT"}</p>
                        </div>
                    </TableCell>
                    <TableCell>
                         <Badge className={cn(
                             "rounded-full p-2 border-2",
                             user.isActive ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-500" : "border-rose-500/50 bg-rose-500/10 text-rose-500"
                         )}>
                            {user.isActive ? <ShieldCheck className="size-4" /> : <ShieldAlert className="size-4" />}
                         </Badge>
                    </TableCell>
                    <TableCell className="text-right px-10">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="size-12 rounded-xl hover:bg-white/5 opacity-0 group-hover:opacity-100 transition-all">
                                    <MoreVertical className="size-5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 bg-black/95 backdrop-blur-2xl border-white/10 rounded-2xl p-2">
                                <DropdownMenuLabel className="font-heading font-black text-[10px] uppercase tracking-widest p-4 text-muted-foreground/40">Node Control Protocol</DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-white/5" />
                                
                                <DropdownMenuItem className="p-4 rounded-xl font-heading font-black text-[10px] uppercase tracking-widest gap-3 focus:bg-primary focus:text-white cursor-pointer" onClick={() => roleMutation.mutate({ id: user.id, role: user.role === "STUDENT" ? "LIBRARIAN" : "STUDENT" })}>
                                    <ArrowUpCircle className="size-4" /> 
                                    {user.role === "STUDENT" ? "Elevate to Librarian" : "Revoke to Student"}
                                </DropdownMenuItem>

                                {user.isActive ? (
                                    <DropdownMenuItem className="p-4 rounded-xl font-heading font-black text-[10px] uppercase tracking-widest gap-3 focus:bg-rose-500 focus:text-white text-rose-500 cursor-pointer" onClick={() => blockMutation.mutate(user.id)}>
                                        <ShieldX className="size-4" /> Quarantine Node
                                    </DropdownMenuItem>
                                ) : (
                                    <DropdownMenuItem className="p-4 rounded-xl font-heading font-black text-[10px] uppercase tracking-widest gap-3 focus:bg-emerald-500 focus:text-white text-emerald-500 cursor-pointer" onClick={() => unblockMutation.mutate(user.id)}>
                                        <ShieldCheck className="size-4" /> Restore Access
                                    </DropdownMenuItem>
                                )}
                                
                                <DropdownMenuSeparator className="bg-white/5" />
                                <DropdownMenuItem className="p-4 rounded-xl font-heading font-black text-[10px] uppercase tracking-widest gap-3 focus:bg-rose-600 focus:text-white text-rose-600 cursor-pointer opacity-50">
                                    <UserMinus className="size-4" /> Purge Identity
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-96 text-center">
                    <Fingerprint className="size-16 mx-auto text-muted-foreground/20 mb-6 animate-pulse" />
                    <h3 className="text-2xl font-heading font-black uppercase text-muted-foreground/40 tracking-widest">No Node Identities Detected</h3>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Global Pagination Protocol */}
        <div className="h-24 px-10 flex items-center justify-between border-t border-white/5 bg-secondary/10">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
             Synchronizing Node Registry: Page {page + 1} of {totalPages}
          </div>
          <div className="flex gap-4">
            <Button 
              size="icon" 
              variant="outline" 
              disabled={page === 0}
              onClick={() => setPage(p => p - 1)}
              className="size-12 rounded-xl border-2 border-border/20"
            >
                <ChevronLeft className="size-5" />
            </Button>
            <Button 
              size="icon" 
              variant="outline" 
              disabled={page >= totalPages - 1}
              onClick={() => setPage(p => p + 1)}
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
