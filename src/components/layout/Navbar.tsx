import { useState } from 'react'
import logo from '@/assets/logo.png'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/store/useAuth'
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
  Home,
  Wallet,
  BookMarked,
  ShoppingBag,
} from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { notificationService } from '@/features/users/services/notificationService'
import { ScrollArea } from '@/components/ui/scroll-area'

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const queryClient = useQueryClient()

  const { data: notificationsData } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationService.getMy(),
    enabled: isAuthenticated,
    refetchInterval: 30000,
  })

  const { data: unreadCountData } = useQuery({
    queryKey: ['unread-count'],
    queryFn: () => notificationService.getUnreadCount(),
    enabled: isAuthenticated,
    refetchInterval: 30000,
  })

  const readMutation = useMutation({
    mutationFn: (id: number) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['unread-count'] })
    }
  })

  const readAllMutation = useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['unread-count'] })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => notificationService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    }
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const unreadCount = unreadCountData?.data || 0
  const notifications = notificationsData?.data?.content || []

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md transition-all duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-4 transition-transform hover:scale-105 active:scale-95 group">
              <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-primary/5 p-1 ring-1 ring-primary/10 group-hover:ring-primary/20 transition-all">
                <img src={logo} alt="IOMD Library" className="h-full w-full object-contain" />
              </div>
              <span className="text-xl font-black tracking-tight bg-clip-text text-transparent bg-linear-to-r from-primary to-blue-600">
                IOMD Library
              </span>
            </Link>
            {/* Nav links */}
            <div className="hidden md:flex items-center gap-1 ml-4">
              {[
                { to: '/', label: 'Home' },
                { to: '/search', label: 'Catalog' },
                ...(isAuthenticated ? [{ to: '/my-books', label: 'My Books' }] : []),
              ].map(({ to, label }) => (
                <Link key={to} to={to} className={cn(
                  'px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors',
                  pathname === to ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                )}>{label}</Link>
              ))}
            </div>
          </div>

          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-md relative group"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              type="search"
              placeholder="Search books, authors, isbn..."
              className="pl-10 h-10 bg-muted/50 border-none transition-all duration-300 focus:bg-background focus:ring-2 focus:ring-primary/20 rounded-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          <div className="flex items-center gap-2">
            {/* DESKTOP: bell + avatar/auth */}
            <div className="hidden md:flex items-center gap-2">
              {isAuthenticated && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground h-10 w-10 rounded-full hover:bg-muted">
                      <Bell className="h-5 w-5" />
                      {unreadCount > 0 && (
                        <span className="absolute top-2 right-2 h-4 w-4 rounded-full bg-primary border-2 border-background flex items-center justify-center text-[10px] font-black text-white p-0">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-80 p-0 rounded-2xl shadow-2xl border-none ring-1 ring-primary/5" align="end">
                    <div className="flex items-center justify-between p-4 border-b">
                      <h3 className="font-black text-sm uppercase tracking-widest">Notifications</h3>
                      {unreadCount > 0 && (
                        <Button variant="ghost" size="sm" onClick={() => readAllMutation.mutate()} className="h-7 text-[10px] font-bold gap-1.5 hover:bg-primary/5 hover:text-primary rounded-lg">
                          <CheckCheck className="h-3 w-3" /> Mark all read
                        </Button>
                      )}
                    </div>
                    <ScrollArea className="h-80">
                      {notifications.length > 0 ? (
                        <div className="divide-y divide-primary/5">
                          {notifications.map((notif: { id: number; type: string; isRead: boolean; title: string; message: string; createdAt: string }) => (
                            <div key={notif.id} className={cn("p-4 transition-colors hover:bg-muted/30 group relative", !notif.isRead && "bg-primary/[0.02]")}>
                              <div className="flex gap-3">
                                <NotificationIcon type={notif.type} />
                                <div className="flex-1 space-y-1">
                                  <p className={cn("text-xs leading-none font-black", !notif.isRead ? "text-foreground" : "text-muted-foreground")}>{notif.title}</p>
                                  <p className="text-xs text-muted-foreground/80 leading-relaxed line-clamp-2">{notif.message}</p>
                                  <p className="text-[10px] text-muted-foreground/60 font-medium">{new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                              </div>
                              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                {!notif.isRead && <Button size="icon" variant="ghost" className="h-6 w-6 rounded-md hover:text-emerald-500" onClick={() => readMutation.mutate(notif.id)}><CheckCheck className="h-3 w-3" /></Button>}
                                <Button size="icon" variant="ghost" className="h-6 w-6 rounded-md hover:text-rose-500" onClick={() => deleteMutation.mutate(notif.id)}><Trash2 className="h-3 w-3" /></Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full p-8 text-center text-muted-foreground">
                          <Bell className="h-8 w-8 opacity-20 mb-2" />
                          <p className="text-xs font-bold">Your inbox is clear!</p>
                        </div>
                      )}
                    </ScrollArea>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full focus-visible:ring-0">
                      <Avatar className="h-10 w-10 border-2 border-primary/10">
                        <AvatarImage src={user.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${user.fullName}`} />
                        <AvatarFallback className="bg-primary/5 text-primary font-bold">{user.fullName?.[0]}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 p-2 rounded-2xl shadow-2xl border-none ring-1 ring-primary/5" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal px-2 pb-3">
                      <p className="text-sm font-black">{user.fullName}</p>
                      <p className="text-[10px] text-muted-foreground italic">{user.email}</p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="opacity-50" />
                    {[
                      { label: 'Home', to: '/', icon: Home },
                      { label: 'My Library', to: '/my-books', icon: Library },
                      { label: 'My Profile', to: '/profile', icon: User },
                    ].map((item) => {
                      const isActive = pathname === item.to
                      return (
                        <DropdownMenuItem
                          key={item.to}
                          onClick={() => navigate(item.to)}
                          className={cn(
                            "cursor-pointer gap-3 rounded-xl py-2.5 transition-all duration-200",
                            isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground focus:bg-muted"
                          )}
                        >
                          <item.icon className={cn("h-4 w-4 transition-colors", isActive ? "text-primary" : "text-muted-foreground/70")} />
                          <span className={cn("font-bold text-xs", isActive ? "text-primary" : "text-foreground/80")}>{item.label}</span>
                        </DropdownMenuItem>
                      )
                    })}

                    {(user?.role?.toUpperCase() === 'LIBRARIAN' || user?.role?.toUpperCase() === 'SUPER_ADMIN') && (
                      <DropdownMenuItem
                        onClick={() => navigate(user.role?.toUpperCase() === 'SUPER_ADMIN' ? '/admin' : '/librarian')}
                        className={cn(
                          "cursor-pointer gap-3 rounded-xl py-2.5 transition-all duration-200 mt-1",
                          (pathname.startsWith('/admin') || pathname.startsWith('/librarian'))
                            ? "bg-primary/10 text-primary focus:bg-primary/20 shadow-xs"
                            : "bg-primary/[0.03] text-primary/80 hover:bg-primary/10 focus:bg-primary/10 border border-primary/5"
                        )}
                      >
                        {user.role?.toUpperCase() === 'SUPER_ADMIN' ? (
                          <ShieldAlert className={cn("h-4 w-4", pathname.startsWith('/admin') ? "text-primary" : "text-primary/60")} />
                        ) : (
                          <Library className={cn("h-4 w-4", pathname.startsWith('/librarian') ? "text-primary" : "text-primary/60")} />
                        )}
                        <span className={cn("text-xs transition-colors", (pathname.startsWith('/admin') || pathname.startsWith('/librarian')) ? "font-black" : "font-bold")}>
                          {user.role?.toUpperCase() === 'SUPER_ADMIN' ? 'Admin Dashboard' : 'Librarian Panel'}
                        </span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator className="opacity-50" />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer gap-3 text-rose-500 focus:bg-rose-50 focus:text-rose-600 rounded-xl py-2.5"><LogOut className="h-4 w-4" /><span className="font-black">Log out</span></DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" asChild className="font-bold"><Link to="/login">Sign in</Link></Button>
                  <Button size="sm" asChild className="font-bold rounded-xl h-9 px-4 bg-linear-to-r from-primary to-blue-600 border-none"><Link to="/register">Get Started</Link></Button>
                </div>
              )}
            </div>

            {/* MOBILE: hamburger only */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div >
      </div >

      {/* Mobile Menu */}
      < div className={
        cn(
          "md:hidden absolute top-16 left-0 w-full bg-background border-b shadow-2xl transition-all duration-300 origin-top overflow-hidden",
          isMenuOpen ? "h-fit opacity-100 visible" : "h-0 opacity-0 invisible"
        )
      } >
        <div className="container mx-auto px-4 py-6 space-y-4">
          {/* Search — only when logged in */}
          {isAuthenticated && (
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search books, authors..."
                className="pl-10 w-full h-12 bg-muted/30 border-none rounded-2xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          )}
          {/* Nav links */}
          <div className="flex flex-col gap-1">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className={cn('px-3 py-2.5 text-sm font-semibold rounded-xl transition-colors', pathname === '/' ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50')}>🏠 Home</Link>
            <Link to="/search" onClick={() => setIsMenuOpen(false)} className={cn('px-3 py-2.5 text-sm font-semibold rounded-xl transition-colors', pathname === '/search' ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50')}>📚 Catalog</Link>
            {isAuthenticated && user ? (
              <>
                <Link to="/my-books" onClick={() => setIsMenuOpen(false)} className={cn('px-3 py-2.5 text-sm font-semibold rounded-xl transition-colors', pathname === '/my-books' ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50')}>📖 My Books</Link>
                <div className="border-t my-1" />
                {/* Profile section */}
                <div className="flex items-center gap-3 px-3 py-2">
                  <Avatar className="h-8 w-8 border border-primary/10">
                    <AvatarImage src={user.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${user.fullName}`} />
                    <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">{user.fullName?.[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-bold">{user.fullName}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <Link to="/my-books" onClick={() => setIsMenuOpen(false)} className="px-3 py-2.5 text-sm font-semibold rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">📚 My Library</Link>
                <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="px-3 py-2.5 text-sm font-semibold rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">👤 My Profile</Link>
                {(user?.role?.toUpperCase() === 'LIBRARIAN' || user?.role?.toUpperCase() === 'SUPER_ADMIN') && (
                  <Link
                    to={user.role?.toUpperCase() === 'SUPER_ADMIN' ? '/admin' : '/librarian'}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "px-3 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200",
                      (pathname.startsWith('/admin') || pathname.startsWith('/librarian'))
                        ? "text-primary bg-primary/10 font-bold"
                        : "text-primary/70 bg-primary/[0.03] hover:bg-primary/10 border border-primary/5"
                    )}
                  >
                    {user.role?.toUpperCase() === 'SUPER_ADMIN' ? '🛡️ Admin Dashboard' : '📚 Librarian Panel'}
                  </Link>
                )}
                <button onClick={() => { handleLogout(); setIsMenuOpen(false) }} className="px-3 py-2.5 text-sm font-semibold rounded-xl text-rose-500 hover:bg-rose-50 transition-colors text-left">🚪 Log out</button>
              </>
            ) : (
              <div className="flex gap-2 pt-2">
                <Button asChild variant="outline" className="flex-1 font-bold rounded-xl">
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>Sign In</Link>
                </Button>
                <Button asChild className="flex-1 font-bold rounded-xl bg-linear-to-r from-primary to-blue-600 border-none">
                  <Link to="/register" onClick={() => setIsMenuOpen(false)}>Get Started</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div >
    </nav >
  )
}

function NotificationIcon({ type }: { type: string }) {
  switch (type) {
    case 'DANGER':
    case 'FINE_ALERT':
      return <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600 h-fit"><AlertCircle className="h-4 w-4" /></div>
    case 'WARNING':
    case 'DUE_DATE':
      return <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 h-fit"><TriangleAlert className="h-4 w-4" /></div>
    case 'SUCCESS':
    case 'RESERVATION_READY':
      return <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 h-fit"><CheckCheck className="h-4 w-4" /></div>
    default:
      return <div className="p-2 rounded-xl bg-primary/10 text-primary h-fit"><Info className="h-4 w-4" /></div>
  }
}
