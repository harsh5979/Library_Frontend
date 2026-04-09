import { useState } from 'react'
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/store/useAuth'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, BookOpen, Users, AlertTriangle, CalendarClock,
  Library, LogOut, ChevronLeft, ChevronRight, Menu, X, Bell,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const navItems = [
  { label: 'Dashboard',     href: '/admin',              icon: LayoutDashboard },
  { label: 'Manage Books',  href: '/admin/books',        icon: BookOpen },
  { label: 'Users',         href: '/admin/users',        icon: Users },
  { label: 'Reservations',  href: '/admin/reservations', icon: CalendarClock },
  { label: 'Borrows',       href: '/admin/borrows',      icon: BookOpen },
  { label: 'Overdue',       href: '/admin/overdue',      icon: AlertTriangle },
  { label: 'Notifications', href: '/admin/notifications', icon: Bell },
]

export function AdminLayout() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/login') }

  const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={cn('flex items-center h-16 border-b border-gray-200 px-4 shrink-0', !collapsed || mobile ? 'gap-3' : 'justify-center')}>
        <div className="size-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
          <Library className="size-4 text-white" />
        </div>
        {(!collapsed || mobile) && (
          <span className="font-bold text-gray-900 text-lg">
            {user?.role === 'SUPER_ADMIN' ? 'Admin Panel' : 'Library Panel'}
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              to={href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                active ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                collapsed && !mobile && 'justify-center px-0'
              )}
            >
              <Icon className={cn('size-4 shrink-0', active ? 'text-white' : 'text-gray-400')} />
              {(!collapsed || mobile) && <span>{label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* User + logout */}
      <div className="p-3 border-t border-gray-200 space-y-2">
        {(!collapsed || mobile) && (
          <div className="flex items-center gap-2 px-2 py-1">
            <Avatar className="size-7 shrink-0">
              <AvatarImage src={user?.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.fullName}`} />
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">{user?.fullName?.[0]}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-xs font-bold text-gray-900 truncate">{user?.fullName}</p>
              <p className="text-[10px] text-gray-400 truncate">{user?.role}</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className={cn('w-full text-red-500 hover:bg-red-50 hover:text-red-600 text-xs gap-2', collapsed && !mobile ? 'justify-center px-0' : 'justify-start')}
        >
          <LogOut className="size-4 shrink-0" />
          {(!collapsed || mobile) && 'Sign out'}
        </Button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className={cn('hidden lg:flex flex-col h-screen bg-white border-r border-gray-200 transition-all duration-300 shrink-0', collapsed ? 'w-16' : 'w-60')}>
        <SidebarContent />
        <button
          onClick={() => setCollapsed(c => !c)}
          className="absolute top-[4.5rem] -right-3 z-10 hidden lg:flex size-6 items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm text-gray-400 hover:text-gray-700"
        >
          {collapsed ? <ChevronRight className="size-3" /> : <ChevronLeft className="size-3" />}
        </button>
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="relative z-50 flex flex-col w-64 h-full bg-white border-r border-gray-200">
            <SidebarContent mobile />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 shrink-0">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="lg:hidden size-9 text-gray-500" onClick={() => setMobileOpen(o => !o)}>
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>
            <span className="text-sm font-semibold text-gray-700">
              {navItems.find(n => n.href === pathname)?.label ?? 
                (user?.role === 'SUPER_ADMIN' ? 'Admin Dashboard' : 'Library Dashboard')}
            </span>
          </div>
          <Link to="/" className="text-xs text-primary font-semibold hover:underline">← Back to Site</Link>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
