"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  BarChart3, 
  Users, 
  BookOpen, 
  AlertTriangle, 
  TrendingUp, 
  Package,
  Plus,
  ArrowRight,
  DollarSign,
  Clock,
  Zap,
  ShieldCheck,
  Activity
} from "lucide-react";

import { adminService } from "@/lib/services/admin";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function AdminDashboardPage() {
  const [isAddBookOpen, setIsAddBookOpen] = useState(false);
  
  const { data: statsData, isLoading: isStatsLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => adminService.getDashboard(),
  });

  const { data: popularBooksData } = useQuery({
    queryKey: ["popular-books-analytics"],
    queryFn: () => adminService.getPopularBooks(5),
  });

  const stats = statsData?.data;

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-12 duration-1000">
      {/* Dynamic Header Protocol */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
               <div className="h-[2px] w-12 bg-primary/40 rounded-full" />
               <span className="text-xs font-heading tracking-[0.4em] font-black text-primary uppercase animate-pulse">Librarian Authority | Omega Terminal</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-heading font-black tracking-tighter uppercase leading-[0.8]">
            Archive Oversight.
          </h1>
          <p className="text-xl text-muted-foreground font-medium max-w-2xl">
            Real-time synchronization and governance of the global library asset ecosystem.
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Button 
            onClick={() => setIsAddBookOpen(true)}
            className="h-20 px-10 text-lg font-heading font-black uppercase tracking-widest bg-primary hover:bg-primary/90 border-none rounded-2xl shadow-2xl shadow-primary/20 hover:shadow-primary/40 transition-all group"
          >
            <Plus className="mr-3 size-6 group-hover:rotate-90 transition-transform duration-500" /> Index New Asset
          </Button>
          <Button variant="outline" className="h-20 px-10 text-lg font-heading tracking-widest uppercase border-2 border-border/40 bg-background/20 backdrop-blur-md rounded-2xl hover:bg-secondary transition-all">
            Export Audit Logs
          </Button>
        </div>
      </div>

      {/* Primary KPI Grid - High Contrast */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        <StatCard 
          icon={<Package className="text-blue-500" />} 
          label="Catalog Size" 
          value={stats?.totalBooks} 
          subValue={`${stats?.availableBooks} units in shelf`}
          loading={isStatsLoading}
          trend="+12 Indexed"
        />
        <StatCard 
          icon={<Users className="text-emerald-500" />} 
          label="Active Nodes" 
          value={stats?.totalMembers} 
          subValue="Registered identities"
          loading={isStatsLoading}
          trend="+5.4% Sync"
        />
        <StatCard 
          icon={<Activity className="text-amber-500" />} 
          label="Live Borrows" 
          value={stats?.activeBorrowings} 
          subValue="Assets in circulation"
          loading={isStatsLoading}
          trend="High Turnover"
        />
        <StatCard 
          icon={<ShieldCheck className="text-primary" />} 
          label="Identity Queue" 
          value={0} 
          subValue="Validation pending"
          loading={isStatsLoading}
          trend="Secure Flow"
        />
        <StatCard 
          icon={<AlertTriangle className="text-rose-500" />} 
          label="Risk Protocol" 
          value={stats?.overdueBooks} 
          subValue="Immediate intervention"
          loading={isStatsLoading}
          destructive={Number(stats?.overdueBooks) > 0}
          trend={`${stats?.overdueBooks} Delayed`}
        />
      </div>

      <div className="grid lg:grid-cols-12 gap-12 pt-8">
        <div className="lg:col-span-8 space-y-12">
           <Tabs defaultValue="transactions" className="w-full">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-6">
              <TabsList className="bg-secondary/40 p-2 rounded-[1.5rem] h-20 border-none ring-1 ring-primary/5 flex items-center">
                <TabsTrigger value="transactions" className="rounded-2xl px-10 font-heading font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white h-16 transition-all">Asset Flow</TabsTrigger>
                <TabsTrigger value="overdue" className="rounded-2xl px-10 font-heading font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-rose-500 data-[state=active]:text-white h-16 transition-all">Risk Alerts</TabsTrigger>
              </TabsList>
              <Button variant="ghost" className="font-heading font-black uppercase text-[10px] tracking-widest gap-2 text-primary hover:bg-primary/10 rounded-xl h-12">
                Deep Audit Logs <ArrowRight className="size-4" />
              </Button>
            </div>

            <TabsContent value="transactions" className="mt-0 outline-none">
              <Card className="border-none shadow-2xl bg-card/40 backdrop-blur-2xl ring-1 ring-white/5 rounded-[2.5rem] overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                    <TableHeader className="bg-secondary/20">
                        <TableRow className="border-none hover:bg-transparent">
                        <TableHead className="font-heading font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground py-8 px-8">Client Node</TableHead>
                        <TableHead className="font-heading font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground py-8">Asset Identifier</TableHead>
                        <TableHead className="font-heading font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground py-8">Timestamp</TableHead>
                        <TableHead className="font-heading font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground py-8 text-right">Protocol Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {[
                            { user: "Student Node 452", book: "Applied Quantum Protocol", date: "29 MAR 2026", status: "ACTIVE" },
                            { user: "Faculty Authority X", book: "Neural Architecture", date: "28 MAR 2026", status: "ACTIVE" },
                            { user: "Librarian Root", book: "Blockchain Governance", date: "27 MAR 2026", status: "STORED" }
                        ].map((tx, i) => (
                        <TableRow key={i} className="border-white/5 hover:bg-white/[0.02] transition-all group cursor-pointer">
                            <TableCell className="py-8 px-8">
                                <p className="font-heading font-black text-sm uppercase tracking-tighter group-hover:text-primary transition-colors">{tx.user}</p>
                            </TableCell>
                            <TableCell className="font-bold text-sm text-foreground/80">{tx.book}</TableCell>
                            <TableCell className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">{tx.date}</TableCell>
                            <TableCell className="text-right px-8">
                            <Badge className={cn(
                                "rounded-lg font-heading font-black text-[9px] px-3 py-1 tracking-widest",
                                tx.status === "ACTIVE" ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground"
                            )}>
                                {tx.status}
                            </Badge>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="overdue" className="mt-0">
               <Card className="border-none shadow-2xl bg-card/40 backdrop-blur-2xl ring-1 ring-rose-500/20 rounded-[2.5rem] overflow-hidden p-20 text-center">
                  <div className="size-24 rounded-full bg-rose-500/10 flex items-center justify-center mx-auto mb-8 animate-pulse border-2 border-rose-500/20">
                      <AlertTriangle className="size-10 text-rose-500" />
                  </div>
                  <h3 className="text-3xl font-heading font-black uppercase mb-4 tracking-tighter">Protocol Breach Detected.</h3>
                  <p className="text-muted-foreground font-medium mb-12 max-w-lg mx-auto">Asset recovery protocols must be initialized for items exceeding temporal borrow limits.</p>
                  <Button className="h-16 px-12 font-heading font-black uppercase text-xs tracking-widest bg-rose-500 hover:bg-rose-600 rounded-2xl shadow-xl shadow-rose-500/20">Initialize Enforcement Flow</Button>
               </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-4 space-y-12">
          {/* Trending Analytics Mini-Card */}
          <Card className="border-none shadow-2xl bg-card/40 backdrop-blur-2xl ring-1 ring-white/5 rounded-[2.5rem] overflow-hidden">
            <CardHeader className="p-10 pb-4">
              <CardTitle className="text-xl font-heading font-black uppercase tracking-tighter flex items-center gap-4">
                <TrendingUp className="size-6 text-emerald-500" /> Hot Circulation
              </CardTitle>
              <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mt-2">Peak temporal demand</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4 pt-4">
               {popularBooksData?.data?.slice(0, 5).map((book: any, idx: number) => (
                 <div key={idx} className="flex items-center gap-6 group cursor-pointer p-4 rounded-3xl hover:bg-primary/10 transition-all border border-transparent hover:border-primary/10">
                    <div className="size-12 rounded-2xl bg-secondary/50 flex items-center justify-center font-heading font-black text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-xl">
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-heading font-black text-sm uppercase tracking-tighter truncate group-hover:text-primary transition-colors">{book.title}</p>
                      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mt-1 opacity-60">Auth: {book.author}</p>
                    </div>
                    <div className="text-right">
                       <p className="font-heading font-black text-lg group-hover:text-primary transition-colors">{book.borrowCount}</p>
                       <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Loans</p>
                    </div>
                 </div>
               ))}
               <div className="px-4 pt-4 pb-2">
                    <Button variant="ghost" className="w-full h-16 font-heading font-black uppercase text-[9px] tracking-[0.2em] gap-3 rounded-2xl border-2 border-dashed border-border/40 hover:border-primary/40 hover:bg-primary/5 transition-all">
                        Deep Analytics Portal <BarChart3 className="size-4" />
                    </Button>
               </div>
            </CardContent>
          </Card>

          {/* Fiscal Overview Mini-Card */}
          <Card className="border-none shadow-2xl bg-card/40 backdrop-blur-2xl ring-1 ring-white/5 rounded-[2.5rem] overflow-hidden">
            <CardHeader className="p-10 pb-4">
               <CardTitle className="text-xl font-heading font-black uppercase tracking-tighter flex items-center gap-4">
                 <DollarSign className="size-6 text-emerald-500" /> Fiscal Pipeline
               </CardTitle>
               <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mt-2">Monetary health audit</CardDescription>
            </CardHeader>
            <CardContent className="p-10 space-y-10 pt-4">
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Collected Credit</span>
                  <span className="text-2xl font-heading font-black text-emerald-500 uppercase flex items-center gap-2 tracking-tighter">
                      <Zap className="size-4 fill-current" /> Rs. {stats?.totalFinesCollected || 0}
                  </span>
                </div>
                <Progress value={85} className="h-2.5 rounded-full bg-secondary" />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Pending Claims</span>
                  <span className="text-2xl font-heading font-black text-rose-500 uppercase flex items-center gap-2 tracking-tighter">
                      <Clock className="size-4 fill-current" /> Rs. {stats?.pendingFines || 0}
                  </span>
                </div>
                <Progress value={20} className="h-2.5 rounded-full bg-rose-500/10" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value?: number;
  subValue?: string;
  loading?: boolean;
  destructive?: boolean;
  trend?: string;
}

function StatCard({ 
  icon, 
  label, 
  value, 
  subValue, 
  loading, 
  destructive,
  trend
}: StatCardProps) {
  return (
    <Card 
      className={cn(
        "border-none shadow-2xl bg-card/40 backdrop-blur-2xl ring-1 ring-white/5 rounded-[2rem] overflow-hidden group hover:scale-[1.05] transition-all duration-500",
        destructive && "ring-rose-500/40"
      )}
    >
      <CardContent className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="p-5 rounded-2xl bg-background shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 ring-1 ring-border/20">
            {icon}
          </div>
          <div className={cn(
            "text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg border-2",
            destructive ? "border-rose-500/50 text-rose-500 bg-rose-500/10 shadow-lg shadow-rose-500/20" : "border-emerald-500/50 text-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/20"
          )}>
            {trend}
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] ml-1">{label}</p>
          {loading ? (
            <Skeleton className="h-12 w-24 bg-muted/40 rounded-xl" />
          ) : (
            <h3 className={cn(
              "text-5xl font-heading font-black tracking-tighter px-0 leading-none",
              destructive ? "text-rose-500" : "text-foreground"
            )}>{value?.toLocaleString() || 0}</h3>
          )}
          <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest ml-1">{subValue}</p>
        </div>
      </CardContent>
    </Card>
  );
}
