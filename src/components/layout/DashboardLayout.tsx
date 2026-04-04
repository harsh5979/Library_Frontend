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
  BarChart3,
  Bell,
  ChevronDown,
  Zap,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuthStore } from "@/store/auth";
import Link from "next/link";

const sidebarLinks = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard, roles: ["STUDENT", "FACULTY", "LIBRARIAN", "SUPER_ADMIN"] },
  { name: "Browse Books", href: "/dashboard/books", icon: Library, roles: ["STUDENT", "FACULTY", "LIBRARIAN", "SUPER_ADMIN"] },
  { name: "Reservations", href: "/dashboard/reservations", icon: Ticket, roles: ["STUDENT", "FACULTY"] },
  { name: "Borrow History", href: "/dashboard/borrow-history", icon: History, roles: ["STUDENT", "FACULTY"] },
  { name: "Manage Books", href: "/dashboard/admin/books", icon: BookMarked, roles: ["LIBRARIAN", "SUPER_ADMIN"] },
  { name: "Trending Now", href: "/dashboard/admin/trending", icon: Zap, roles: ["LIBRARIAN", "SUPER_ADMIN"] },
  { name: "User Management", href: "/dashboard/admin/users", icon: Users, roles: ["LIBRARIAN", "SUPER_ADMIN"] },
  { name: "Analytics", href: "/dashboard/admin/analytics", icon: BarChart3, roles: ["LIBRARIAN", "SUPER_ADMIN"] },
];

function SidebarNav({ links, pathname, collapsed = false }: { links: typeof sidebarLinks; pathname: string; collapsed?: boolean }) {
  return (
    <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
      {links.map((link) => {
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              active
                ? "bg-primary text-white"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            )}
          >
            <link.icon className={cn("size-4 shrink-0", active ? "text-white" : "text-gray-400")} />
            {!collapsed && <span>{link.name}</span>}
          </Link>
        );
      })}
    </nav>
  );
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const { isAuthenticated, _hasHydrated } = useAuthStore();
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (mounted && _hasHydrated && !isAuthenticated) router.push("/login");
  }, [mounted, _hasHydrated, isAuthenticated, router]);

  if (!mounted || !_hasHydrated || !isAuthenticated) return null;

  const filteredLinks = sidebarLinks.filter(
    (link) => !link.roles || (user && link.roles.includes(user.role))
  );

  const initials = user?.fullName
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) ?? "U";

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col h-screen bg-white border-r border-gray-200 transition-all duration-300 shrink-0",
          isCollapsed ? "w-16" : "w-60"
        )}
      >
        {/* Logo */}
        <div className={cn("flex items-center h-16 border-b border-gray-200 px-4", isCollapsed ? "justify-center" : "gap-3")}>
          <div className="size-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
            <Library className="size-4 text-white" />
          </div>
          {!isCollapsed && (
            <span className="font-heading font-bold text-gray-900 text-lg">Omnishelf</span>
          )}
        </div>

        <SidebarNav links={filteredLinks} pathname={pathname} collapsed={isCollapsed} />

        {/* Collapse toggle */}
        <div className="p-3 border-t border-gray-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn("w-full text-gray-500 hover:text-gray-900 hover:bg-gray-100", isCollapsed ? "justify-center px-0" : "justify-start gap-2")}
          >
            {isCollapsed ? <ChevronRight className="size-4" /> : <><ChevronLeft className="size-4" /><span className="text-xs">Collapse</span></>}
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top navbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 shrink-0">
          {/* Mobile menu */}
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden size-9 text-gray-500">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0 bg-white">
                <div className="flex items-center gap-3 h-16 px-4 border-b border-gray-200">
                  <div className="size-8 bg-primary rounded-lg flex items-center justify-center">
                    <Library className="size-4 text-white" />
                  </div>
                  <span className="font-heading font-bold text-gray-900 text-lg">Omnishelf</span>
                </div>
                <div className="flex flex-col h-[calc(100%-4rem)]">
                  <div className="flex-1 py-4">
                    <SidebarNav links={filteredLinks} pathname={pathname} />
                  </div>
                  <div className="p-3 border-t border-gray-200">
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2 text-red-500 hover:bg-red-50 hover:text-red-600 text-sm"
                      onClick={logout}
                    >
                      <LogOut className="size-4" />
                      Sign out
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Page title from pathname */}
            <span className="text-sm font-medium text-gray-500 hidden sm:block">
              {filteredLinks.find((l) => l.href === pathname)?.name ?? "Dashboard"}
            </span>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="size-9 text-gray-500 hover:text-gray-900">
              <Bell className="size-4" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 h-9 px-2 hover:bg-gray-100">
                  <Avatar className="size-7">
                    <AvatarFallback className="bg-primary text-white text-xs font-bold">{initials}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-gray-700 hidden sm:block max-w-[120px] truncate">
                    {user?.fullName}
                  </span>
                  <ChevronDown className="size-3 text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium text-gray-900 truncate">{user?.fullName}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-500 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                  onClick={logout}
                >
                  <LogOut className="size-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
