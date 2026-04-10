"use client";

import { useQuery } from "@tanstack/react-query";
import { Users, BookOpen, Clock, Library, Ticket, History, TrendingUp, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === "LIBRARIAN" || user?.role === "SUPER_ADMIN";

  const { data: statsResponse, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => api.get("/admin/stats"),
    enabled: isAdmin,
  });

  const stats = statsResponse?.data;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900">
            Good {getGreeting()}, {user?.fullName?.split(" ")[0] ?? "there"} 👋
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>
        <Badge variant="outline" className="w-fit flex items-center gap-1.5 text-emerald-600 border-emerald-200 bg-emerald-50">
          <span className="size-1.5 rounded-full bg-emerald-500 inline-block" />
          System Online
        </Badge>
      </div>

      {/* Stats */}
      {isAdmin ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="border-gray-200">
                <CardContent className="p-6 space-y-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))
          ) : (
            <>
              <StatCard title="Total Members" value={stats?.totalUsers ?? "—"} icon={Users} trend="+12%" color="blue" />
              <StatCard title="Active Borrows" value={stats?.activeBorrows ?? "—"} icon={BookOpen} trend="+5%" color="violet" />
              <StatCard title="Pending Requests" value={stats?.pendingReservations ?? "—"} icon={Clock} trend="+18%" color="amber" />
              <StatCard title="Total Collection" value={stats?.totalBooks ?? "—"} icon={Library} color="emerald" />
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard title="Active Borrows" value="3" icon={BookOpen} color="blue" />
          <StatCard title="Pending Reservations" value="1" icon={Ticket} color="amber" />
          <StatCard title="Borrow History" value="12" icon={History} color="violet" />
        </div>
      )}

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="text-base font-semibold text-gray-900">Recent Activity</CardTitle>
              <CardDescription className="text-xs mt-0.5">Latest transactions and member interactions</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8">
              View all <ArrowUpRight className="size-3" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50">
              <TrendingUp className="size-8 text-gray-300 mb-2" />
              <p className="text-sm text-gray-400 font-medium">No recent activity</p>
              <p className="text-xs text-gray-300 mt-1">Activity will appear here</p>
            </div>
          </CardContent>
        </Card>

        {/* Quick stats */}
        <div className="space-y-4">
          <Card className="border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-gray-700">System Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                  <span>Uptime</span>
                  <span className="font-medium text-gray-900">99.9%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: "99.9%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                  <span>Response Time</span>
                  <span className="font-medium text-gray-900">18ms</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: "85%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                  <span>Storage Used</span>
                  <span className="font-medium text-gray-900">62%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: "62%" }} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-gray-700">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-2 h-9 text-sm" asChild>
                <a href="/dashboard/books"><Library className="size-4 text-primary" />Browse Books</a>
              </Button>
              {!isAdmin && (
                <Button variant="outline" className="w-full justify-start gap-2 h-9 text-sm" asChild>
                  <a href="/dashboard/reservations"><Ticket className="size-4 text-primary" />My Reservations</a>
                </Button>
              )}
              {isAdmin && (
                <Button variant="outline" className="w-full justify-start gap-2 h-9 text-sm" asChild>
                  <a href="/dashboard/admin/users"><Users className="size-4 text-primary" />Manage Users</a>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}

function StatCard({ title, value, icon: Icon, trend, color }: {
  title: string; value: string | number; icon: any; trend?: string; color: "blue" | "violet" | "amber" | "emerald";
}) {
  const colorMap = {
    blue: { bg: "bg-blue-50", text: "text-blue-600", icon: "text-blue-500" },
    violet: { bg: "bg-violet-50", text: "text-violet-600", icon: "text-violet-500" },
    amber: { bg: "bg-amber-50", text: "text-amber-600", icon: "text-amber-500" },
    emerald: { bg: "bg-emerald-50", text: "text-emerald-600", icon: "text-emerald-500" },
  };
  const c = colorMap[color];

  return (
    <Card className="border-gray-200 hover:shadow-sm transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {trend && (
              <p className={cn("text-xs font-medium", c.text)}>{trend} vs last month</p>
            )}
          </div>
          <div className={cn("size-10 rounded-lg flex items-center justify-center", c.bg)}>
            <Icon className={cn("size-5", c.icon)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
