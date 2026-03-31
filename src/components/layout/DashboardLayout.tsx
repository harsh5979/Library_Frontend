"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  BookMarked, 
  History, 
  LogOut, 
  Library,
  Ticket,
  ChevronLeft,
  ChevronRight,
  Menu,
  Users,
  BarChart3
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth";
import { Navbar } from "./navbar";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const sidebarLinks = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard, roles: ["STUDENT", "FACULTY", "LIBRARIAN", "SUPER_ADMIN"] },
  { name: "Browse Books", href: "/dashboard/books", icon: Library, roles: ["STUDENT", "FACULTY", "LIBRARIAN", "SUPER_ADMIN"] },
  { name: "Reservations", href: "/dashboard/reservations", icon: Ticket, roles: ["STUDENT", "FACULTY"] },
  { name: "Borrow History", href: "/dashboard/borrow-history", icon: History, roles: ["STUDENT", "FACULTY"] },
  { name: "Manage Books", href: "/dashboard/admin/books", icon: BookMarked, roles: ["LIBRARIAN", "SUPER_ADMIN"] },
  { name: "User Management", href: "/dashboard/admin/users", icon: Users, roles: ["LIBRARIAN", "SUPER_ADMIN"] },
  { name: "Analytics", href: "/dashboard/admin/analytics", icon: BarChart3, roles: ["LIBRARIAN", "SUPER_ADMIN"] },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const { isAuthenticated, _hasHydrated } = useAuthStore();
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  // Handle hydration
  useEffect(() => {
    const frameId = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    if (mounted && _hasHydrated && !isAuthenticated) {
      router.push("/login");
    }
  }, [mounted, _hasHydrated, isAuthenticated, router]);

  if (!mounted || !_hasHydrated || !isAuthenticated) return null;

  const filteredLinks = sidebarLinks.filter(link => 
    !link.roles || (user && link.roles.includes(user.role))
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background selection:bg-primary/30">
      {/* Mobile Sidebar (Sheet) */}
      <div className="lg:hidden absolute top-6 left-6 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="size-12 rounded-2xl bg-card/40 backdrop-blur-xl border-border/40 shadow-2xl transition-all hover:scale-105 active:scale-95 group">
              <Menu className="size-6 text-primary group-hover:rotate-180 transition-transform duration-500" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0 bg-transparent border-none overflow-hidden">
             <div className="h-full bg-card/60 backdrop-blur-3xl border-r border-white/10 flex flex-col pt-12">
                <div className="px-8 mb-12 flex items-center gap-4 group">
                    <div className="size-12 bg-primary flex items-center justify-center rounded-2xl shadow-xl shadow-primary/30 group-hover:rotate-12 transition-transform">
                        <BookMarked className="text-white size-7" />
                    </div>
                    <div>
                        <h2 className="font-heading text-2xl font-black tracking-tighter uppercase text-white">Omnishelf.</h2>
                        <p className="text-[8px] font-black uppercase tracking-[0.3em] text-primary">Library Management</p>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-3">
                  {filteredLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "flex items-center gap-4 px-6 py-5 rounded-2xl transition-all group relative overflow-hidden",
                        pathname === link.href 
                          ? "bg-primary text-white shadow-xl shadow-primary/20" 
                          : "text-white/40 hover:bg-white/5 hover:text-white"
                      )}
                    >
                       <link.icon className="size-5" />
                       <span className="font-heading text-xs uppercase font-black tracking-widest">{link.name}</span>
                    </Link>
                  ))}
                </nav>

                <div className="p-8 border-t border-white/5">
                    <Button 
                      variant="ghost" 
                      className="w-full h-16 rounded-2xl gap-4 font-heading text-xs uppercase font-black tracking-widest text-destructive hover:bg-destructive/10 transition-all border border-destructive/20"
                      onClick={logout}
                    >
                      <LogOut className="size-5" />
                      System Logout
                    </Button>
                </div>
             </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside 
        className={cn(
          "relative h-screen border-r border-border/40 bg-card/40 backdrop-blur-2xl transition-all duration-700 hidden lg:flex flex-col z-40",
          isCollapsed ? "w-24" : "w-80"
        )}
      >
        <div className="p-8 flex items-center justify-between overflow-hidden h-24">
           {!isCollapsed && (
             <Link href="/dashboard" className="flex items-center gap-4 group animate-in fade-in slide-in-from-left duration-700">
                <div className="size-11 bg-primary flex items-center justify-center rounded-2xl shadow-2xl shadow-primary/30 group-hover:scale-105 transition-transform">
                    <BookMarked className="text-white size-6" />
                </div>
                <div>
                    <span className="block font-heading text-xl font-black tracking-tighter uppercase text-foreground leading-none">Omnishelf.</span>
                    <span className="text-[7px] font-black uppercase tracking-[0.3em] text-primary/60">Management Console</span>
                </div>
             </Link>
           )}
           <Button 
             variant="ghost" 
             size="icon" 
             onClick={() => setIsCollapsed(!isCollapsed)}
             className={cn(
                "size-10 rounded-xl hover:bg-primary/10 transition-all duration-500",
                isCollapsed ? "mx-auto" : "ml-auto"
             )}
           >
             {isCollapsed ? <ChevronRight className="size-5 text-primary" /> : <ChevronLeft className="size-5 text-primary" />}
           </Button>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 mt-8 py-4 overflow-y-auto custom-scrollbar">
          {filteredLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-4 px-6 py-5 rounded-2xl transition-all group relative overflow-hidden",
                pathname === link.href 
                  ? "bg-primary text-white shadow-2xl shadow-primary/30" 
                  : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
              )}
            >
              {pathname === link.href && (
                  <div className="absolute inset-0 bg-linear-to-tr from-white/10 to-transparent pointer-events-none" />
              )}
              <link.icon className={cn(
                "size-5 transition-all duration-500 group-hover:scale-110",
                pathname === link.href ? "text-white scale-110" : "group-hover:text-primary"
              )} />
              {!isCollapsed && (
                <span className="font-heading text-[10px] uppercase font-bold tracking-[0.15em] whitespace-nowrap animate-in fade-in slide-in-from-left-4 duration-700">
                  {link.name}
                </span>
              )}
              {isCollapsed && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-primary text-white px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest translate-x-14 z-50 pointer-events-none shadow-2xl">
                        <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 border-y-4 border-y-transparent border-r-4 border-r-primary" />
                      {link.name}
                  </div>
              )}
            </Link>
          ))}
        </nav>

        <div className="p-6 mt-auto border-t border-border/10">
           <Button 
             variant="ghost" 
             className={cn(
                "w-full rounded-2xl gap-4 py-8 font-heading text-[10px] uppercase font-black tracking-widest transition-all group overflow-hidden relative",
                isCollapsed ? "px-0 justify-center" : "px-6 justify-start text-destructive hover:bg-destructive/10"
             )}
             onClick={logout}
           >
             <LogOut className={cn("size-5", !isCollapsed && "group-hover:-translate-x-1 transition-transform")} />
             {!isCollapsed && (
                <div className="flex flex-col items-start translate-x-0 group-hover:translate-x-1 transition-transform">
                    <span className="text-destructive font-black">Sign Out</span>
                    <span className="text-[6px] text-destructive/40 tracking-[0.2em]">Secure Exit</span>
                </div>
             )}
           </Button>
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-background overflow-hidden relative">
        <Navbar />
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 lg:p-14 space-y-12 scrollbar-thin scrollbar-thumb-primary/10 scrollbar-track-transparent hover:scrollbar-thumb-primary/20 transition-all custom-scrollbar animate-in fade-in duration-1000 slide-in-from-bottom-4">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
          
          {/* Background decorations */}
          <div className="absolute top-[20%] right-[-10%] size-[600px] bg-primary/5 rounded-full blur-[180px] pointer-events-none -z-10 animate-pulse duration-[10s]" />
          <div className="absolute bottom-[-10%] left-[-10%] size-[600px] bg-blue-500/5 rounded-full blur-[180px] pointer-events-none -z-10 animate-pulse duration-[15s]" />
        </div>
      </main>
    </div>
  );
}
