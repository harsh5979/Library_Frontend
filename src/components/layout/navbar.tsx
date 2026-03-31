"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Search, 
  Library, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Bell, 
  CheckCheck, 
  Trash2,
  AlertCircle,
  Info,
  TriangleAlert,
  ShieldAlert,
  Clock,
  LayoutDashboard
} from "lucide-react";

import { useAuthStore } from "@/store/auth";
import { notificationService, type NotificationResponse } from "@/lib/services/notificationService";
import { authService } from "@/lib/services/authService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, logout, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  // Fetch Notifications
  const { data: notificationsData } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => notificationService.getMy(),
    enabled: isAuthenticated,
    refetchInterval: 30000, 
  });

  const { data: unreadCountData } = useQuery({
    queryKey: ["unread-count"],
    queryFn: () => notificationService.getUnreadCount(),
    enabled: isAuthenticated,
    refetchInterval: 30000,
  });

  // Notifications Mutations
  const readMutation = useMutation({
    mutationFn: (id: number) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread-count"] });
    }
  });

  const readAllMutation = useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread-count"] });
      toast.success("Archive Status Updated", { description: "All notifications processed." });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => notificationService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.info("Notification purged from index.");
    }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/dashboard/books?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = async () => {
    try {
        await authService.logout();
    } catch { /* ignore */ }
    logout();
    router.push("/login");
  };

  const unreadCount = unreadCountData?.data || 0;
  const notifications = notificationsData?.data?.content || [];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/60 backdrop-blur-xl transition-all duration-300">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between gap-8">
        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <Link href="/" className="flex items-center gap-3 transition-transform hover:scale-105 group active:scale-95">
            <div className="bg-primary rounded-xl p-2 text-primary-foreground shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all">
              <Library className="size-6" />
            </div>
            <span className="text-2xl font-heading font-black tracking-tighter uppercase whitespace-nowrap">
              Omnishelf.
            </span>
          </Link>
        </div>

        {/* Global Search - BOLD Minimalist */}
        <form 
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 max-w-2xl relative group"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground group-focus-within:text-primary transition-all duration-300" />
          <Input
            type="search"
            placeholder="Search by title, author, or ISBN..."
            className="pl-12 h-12 bg-secondary/40 border-none transition-all duration-300 focus:bg-secondary/60 focus:ring-0 rounded-xl font-sans tracking-wide font-medium placeholder:text-muted-foreground/50 text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 px-2 py-1 rounded bg-secondary text-[8px] font-black uppercase text-muted-foreground/40 opacity-0 group-focus-within:opacity-100 transition-opacity">Search</div>
        </form>

        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative group hover:bg-secondary h-12 w-12 rounded-2xl" aria-label="Notifications">
                  <Bell className="size-6 text-muted-foreground group-hover:text-primary transition-colors" />
                  {unreadCount > 0 && (
                    <span className="absolute top-2.5 right-2.5 h-5 w-5 rounded-lg bg-primary border-2 border-background flex items-center justify-center text-[9px] font-black text-white shadow-xl">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-96 p-0 rounded-[2rem] shadow-2xl border-border/40 bg-background/80 backdrop-blur-2xl overflow-hidden mt-4" align="end">
                <div className="flex items-center justify-between p-5 border-b border-border/20 bg-secondary/10">
                  <h3 className="font-heading font-black text-[10px] uppercase tracking-[0.2em] text-primary">Notifications</h3>
                  {unreadCount > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => readAllMutation.mutate()}
                      className="h-7 text-[9px] font-black gap-2 uppercase tracking-widest hover:bg-primary hover:text-white rounded-lg px-3"
                    >
                      <CheckCheck className="size-3" /> Mark Read
                    </Button>
                  )}
                </div>
                <ScrollArea className="h-[450px]">
                  {notifications.length > 0 ? (
                    <div className="divide-y divide-border/10 p-2">
                      {notifications.map((notif: NotificationResponse) => (
                        <div 
                          key={notif.id} 
                          className={cn(
                            "p-5 transition-all hover:bg-secondary/40 group relative rounded-2xl m-1 border border-transparent hover:border-border/40",
                            !notif.isRead && "bg-primary/[0.03]"
                          )}
                        >
                          <div className="flex gap-4">
                            <NotificationIcon type={notif.type} />
                            <div className="flex-1 space-y-1">
                              <p className={cn("text-xs leading-none font-black uppercase tracking-wider", !notif.isRead ? "text-foreground" : "text-muted-foreground")}>
                                {notif.title}
                              </p>
                              <p className="text-sm text-muted-foreground/80 leading-relaxed font-sans font-medium line-clamp-2">
                                {notif.message}
                              </p>
                              <p className="text-[10px] text-muted-foreground/40 font-black uppercase pt-1 tracking-widest flex items-center gap-2">
                                <Clock className="size-3" /> {new Date(notif.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </p>
                            </div>
                          </div>
                          <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                             {!notif.isRead && (
                                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-xl hover:bg-emerald-500/10 hover:text-emerald-500" onClick={() => readMutation.mutate(notif.id)}>
                                  <CheckCheck className="size-4" />
                                </Button>
                             )}
                             <Button size="icon" variant="ghost" className="h-8 w-8 rounded-xl hover:bg-rose-500/10 hover:text-rose-500" onClick={() => deleteMutation.mutate(notif.id)}>
                               <Trash2 className="size-4" />
                             </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-16 text-center opacity-20">
                      <Bell className="size-12 mb-4 stroke-1" />
                      <p className="text-[10px] font-black uppercase tracking-[0.2em]">All caught up</p>
                    </div>
                  )}
                </ScrollArea>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative p-0 hover:bg-transparent group h-14 flex items-center gap-3" aria-label="User Menu">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-black tracking-tight leading-none group-hover:text-primary transition-colors uppercase">{user.fullName}</p>
                        <p className="text-[10px] text-muted-foreground/60 uppercase tracking-widest mt-1 font-bold">{user.role}</p>
                    </div>
                    <Avatar className="size-12 rounded-2xl border-2 border-primary/20 transition-all group-hover:border-primary group-hover:scale-105 p-[2px]">
                      <AvatarImage src={user.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${user.fullName}`} className="rounded-[10px]" />
                      <AvatarFallback className="bg-primary/10 text-primary font-black uppercase text-xl rounded-[10px]">
                        {user.fullName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-72 p-2 rounded-[2rem] shadow-2xl border-border/40 bg-background/80 backdrop-blur-2xl mt-4" align="end" forceMount>
                <DropdownMenuLabel className="font-heading px-6 py-6 pb-4">
                  <div className="flex flex-col space-y-2">
                    <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center mb-2">
                        <User className="size-6 text-primary" />
                    </div>
                    <p className="text-lg font-black leading-none uppercase tracking-tight">{user.fullName}</p>
                    <p className="text-[10px] font-bold text-muted-foreground leading-none italic">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="opacity-40" />
                <div className="p-2 space-y-1">
                    {[
                        { label: "Profile Settings", href: "/dashboard/profile", icon: User },
                        { label: "My Borrowings", href: "/dashboard/my-books", icon: Library },
                        { label: "Reservations", href: "/dashboard/reservations", icon: Clock },
                        { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard }
                    ].map((item) => (
                        <DropdownMenuItem key={item.href} onClick={() => router.push(item.href)} className="cursor-pointer gap-4 rounded-xl py-3 px-4 font-heading text-[10px] uppercase font-black tracking-widest hover:bg-primary hover:text-white transition-all">
                            <item.icon className="size-4" /> {item.label}
                        </DropdownMenuItem>
                    ))}
                    
                    {(user.role === "LIBRARIAN" || user.role === "SUPER_ADMIN") && (
                        <DropdownMenuItem onClick={() => router.push("/dashboard/admin")} className="cursor-pointer gap-4 rounded-2xl py-4 px-4 font-heading text-xs uppercase font-black tracking-widest bg-emerald-500/10 text-emerald-600 focus:bg-emerald-500 focus:text-white">
                            <ShieldAlert className="size-4" /> Protocol Admin
                        </DropdownMenuItem>
                    )}
                </div>
                <DropdownMenuSeparator className="opacity-40" />
                <div className="p-2">
                    <DropdownMenuItem 
                        onClick={handleLogout}
                        className="cursor-pointer gap-4 text-rose-500 focus:bg-rose-500 focus:text-white rounded-xl py-3 px-4 font-heading text-[10px] uppercase font-black tracking-widest transition-all"
                    >
                        <LogOut className="size-4" /> Sign Out
                    </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost" className="hidden sm:inline-flex font-heading font-black uppercase tracking-widest text-xs h-12 px-8 rounded-full hover:bg-secondary">Login</Button>
              </Link>
              <Link href="/register">
                <Button className="font-heading font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all rounded-full h-12 px-8 bg-primary hover:bg-primary/90 border-none">Create Account</Button>
              </Link>
            </div>
          )}

          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden size-12 rounded-2xl bg-secondary/50" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Dynamic Header */}
      <div className={cn(
        "md:hidden fixed top-20 left-0 w-full bg-background border-b border-border/40 shadow-2xl transition-all duration-500 origin-top overflow-hidden backdrop-blur-3xl",
        isMenuOpen ? "h-fit opacity-100 p-8 pt-4 pb-12" : "h-0 opacity-0 invisible"
      )}>
        <div className="space-y-8">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Archive Command..."
              className="pl-12 w-full h-16 bg-secondary border-none rounded-[1.5rem] font-sans font-bold"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          
          <div className="grid grid-cols-2 gap-4">
               {[
                    { label: "Profile", href: "/profile", icon: User },
                    { label: "Catalogue", href: "/dashboard/books", icon: Library },
                    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard }
               ].map((nav, i) => (
                   <Button key={i} variant="secondary" className="h-16 rounded-xl flex flex-col gap-2 font-black uppercase text-[8px] tracking-widest" onClick={() => { setIsMenuOpen(false); router.push(nav.href); }}>
                      <nav.icon className="size-4 text-primary" />
                      {nav.label}
                   </Button>
               ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

function NotificationIcon({ type }: { type: string }) {
  switch (type) {
    case "DANGER":
    case "FINE_ALERT":
      return <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-600 h-fit border border-rose-500/20"><AlertCircle className="size-5" /></div>;
    case "WARNING":
    case "DUE_DATE":
      return <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600 h-fit border border-amber-500/20"><TriangleAlert className="size-5" /></div>;
    case "SUCCESS":
    case "RESERVATION_READY":
      return <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 h-fit border border-emerald-500/20"><CheckCheck className="size-5" /></div>;
    default:
      return <div className="p-3 rounded-2xl bg-primary/10 text-primary h-fit border border-primary/20"><Info className="size-5" /></div>;
  }
}
