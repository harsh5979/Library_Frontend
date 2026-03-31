"use client";

import { useQuery } from "@tanstack/react-query";
import { 
  Users, 
  BookOpen, 
  Clock, 
  Library, 
  TicketCheck, 
  History,
  TrendingUp,
  ArrowUpRight,
  TrendingDown
} from "lucide-react";

import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { data: statsResponse } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => api.get("/admin/stats"),
    enabled: user?.role === "LIBRARIAN" || user?.role === "SUPER_ADMIN",
  });

  const stats = statsResponse?.data;

  return (
    <div className="space-y-10 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl md:text-5xl font-heading font-black tracking-tighter uppercase">
            Dashboard <span className="text-primary italic">Overview</span>.
          </h1>
          <p className="text-muted-foreground/60 font-medium tracking-wide text-sm">
            Welcome back, <span className="text-foreground font-bold">{user?.fullName || "Member"}</span>. Here is what&apos;s happening today.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 rounded-xl bg-secondary/30 border border-border/40 backdrop-blur-xl flex items-center gap-3">
            <div className="size-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">
              {new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid - Role Dependent */}
      {["LIBRARIAN", "SUPER_ADMIN"].includes(user?.role || "") ? (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Members" 
            value={stats?.totalUsers || "1,294"} 
            icon={Users} 
            trend="+12%"
          />
          <StatCard 
            title="Active Borrows" 
            value={stats?.activeBorrows || "342"} 
            icon={BookOpen} 
            trend="+5%"
          />
          <StatCard 
            title="Pending Requests" 
            value={stats?.pendingReservations || "89"} 
            icon={Clock} 
            trend="+18%"
          />
          <StatCard 
            title="Total Collection" 
            value={stats?.totalBooks || "12,492"} 
            icon={Library} 
            color="bg-primary"
          />
        </section>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <StatCard 
            title="Active Borrows" 
            value="3" 
            icon={BookOpen} 
            color="bg-primary"
          />
          <StatCard 
            title="Pending Reservations" 
            value="1" 
            icon={TicketCheck} 
            trend="Ready"
            color="bg-amber-500"
          />
          <StatCard 
            title="Waitlist Position" 
            value="2" 
            icon={History} 
            color="bg-emerald-500"
          />
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-border/40 bg-card/30 backdrop-blur-xl rounded-4xl overflow-hidden">
          <CardHeader className="p-8 pb-0">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <CardTitle className="text-xl font-heading font-black tracking-tight uppercase">Recent Activity</CardTitle>
                <CardDescription className="text-xs">Archive movements and member interactions</CardDescription>
              </div>
              <Button variant="outline" className="rounded-xl gap-2 font-heading tracking-widest text-[9px] uppercase font-black px-4 h-10 border-border/40 hover:bg-primary hover:text-white transition-all">
                View All <ArrowUpRight className="size-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-8 pt-10">
            <div className="h-[300px] w-full bg-secondary/10 rounded-2xl border border-dashed border-border/20 flex flex-col items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--primary),0.03)_0%,transparent_70%)] group-hover:bg-[radial-gradient(circle_at_center,rgba(var(--primary),0.06)_0%,transparent_70%)] transition-colors duration-500" />
                <TrendingUp className="size-12 text-primary/10 mb-4 group-hover:scale-110 transition-transform duration-500" />
                <p className="font-heading font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground/30">Analytics Engine Ready</p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-border/40 bg-card/30 backdrop-blur-xl rounded-4xl overflow-hidden group">
            <CardHeader className="p-6 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">Sync Health</CardTitle>
              <div className="size-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <TrendingUp className="size-5" />
              </div>
            </CardHeader>
            <CardContent className="p-6 pt-0">
               <p className="text-4xl font-heading font-black tracking-tighter">99.9%</p>
               <div className="mt-6 space-y-3">
                  <div className="flex justify-between text-[9px] font-black uppercase tracking-widest opacity-40">
                    <span>Performance</span>
                    <span>Stable</span>
                  </div>
                  <div className="h-1.5 w-full bg-secondary/50 rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[98%] rounded-full shadow-[0_0_8px_rgba(var(--primary),0.4)]" />
                  </div>
               </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-card/30 backdrop-blur-xl rounded-4xl overflow-hidden group">
            <CardHeader className="p-6 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">Response Time</CardTitle>
              <div className="size-10 rounded-xl bg-amber-500/5 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                <Clock className="size-5" />
              </div>
            </CardHeader>
            <CardContent className="p-6 pt-0">
               <p className="text-4xl font-heading font-black tracking-tighter">18ms</p>
               <div className="mt-6 space-y-3">
                  <div className="flex justify-between text-[9px] font-black uppercase tracking-widest opacity-40">
                    <span>Latency</span>
                    <span>Minimal</span>
                  </div>
                  <div className="h-1.5 w-full bg-secondary/50 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 w-[85%] rounded-full shadow-[0_0_8px_rgba(245,158,11,0.4)]" />
                  </div>
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ title, value, icon: Icon, trend, color }: any) => (
  <Card className="relative overflow-hidden group border-border/40 bg-card/40 backdrop-blur-xl hover:bg-card/60 transition-all hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1">
    <div className={cn("absolute top-0 right-0 w-32 h-32 blur-3xl rounded-full -m-10 opacity-10 transition-opacity group-hover:opacity-20", color)} />
    <CardHeader className="flex flex-row items-center justify-between pb-4">
      <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground group-hover:text-primary transition-colors">
        {title}
      </CardTitle>
      <div className={cn("p-3 rounded-2xl bg-secondary/50 text-foreground transition-all group-hover:scale-110 group-hover:bg-primary group-hover:text-white shadow-lg", color && "group-hover:bg-transparent")}>
        <Icon className="size-5" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="flex items-end justify-between">
        <div className="space-y-1">
          <p className="text-4xl font-heading font-black tracking-tighter">
            {value}
          </p>
          {trend && (
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">
              {trend} <span className="text-muted-foreground/40 font-medium lowercase">vs last cycle</span>
            </p>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
);
