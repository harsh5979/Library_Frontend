import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
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
import { notificationApi } from '@/api/notification'
import { ScrollArea } from '@/components/ui/scroll-area'

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { user, logout, isAuthenticated } = useAuthStore()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: notificationsData } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationApi.getMy(),
    enabled: isAuthenticated,
    refetchInterval: 30000, // Refresh every 30 seconds
  })

  const { data: unreadCountData } = useQuery({
    queryKey: ['unread-count'],
    queryFn: () => notificationApi.getUnreadCount(),
    enabled: isAuthenticated,
    refetchInterval: 30000,
  })

  const readMutation = useMutation({
    mutationFn: (id: number) => notificationApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['unread-count'] })
    }
  })

  const readAllMutation = useMutation({
    mutationFn: () => notificationApi.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['unread-count'] })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => notificationApi.delete(id),
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
            <Link to="/" className="flex items-center gap-2 transition-transform hover:scale-105 active:scale-95">
              <div className="bg-primary rounded-lg p-1.5 text-primary-foreground">
                <Library className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-primary to-blue-600">
                BiblioSphere
              </span>
            </Link>
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

          <div className="flex items-center gap-2 sm:gap-4">
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
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => readAllMutation.mutate()}
                        className="h-7 text-[10px] font-bold gap-1.5 hover:bg-primary/5 hover:text-primary rounded-lg"
                      >
                        <CheckCheck className="h-3 w-3" /> Mark all as read
                      </Button>
                    )}
                  </div>
                  <ScrollArea className="h-80">
                    {notifications.length > 0 ? (
                      <div className="divide-y divide-primary/5">
                        {notifications.map((notif) => (
                          <div 
                            key={notif.id} 
                            className={cn(
                              "p-4 transition-colors hover:bg-muted/30 group relative",
                              !notif.isRead && "bg-primary/[0.02]"
                            )}
                          >
                            <div className="flex gap-3">
                              <NotificationIcon type={notif.type} />
                              <div className="flex-1 space-y-1">
                                <p className={cn("text-xs leading-none font-black", !notif.isRead ? "text-foreground" : "text-muted-foreground")}>
                                  {notif.title}
                                </p>
                                <p className="text-xs text-muted-foreground/80 leading-relaxed line-clamp-2">
                                  {notif.message}
                                </p>
                                <p className="text-[10px] text-muted-foreground/60 font-medium">
                                  {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                            </div>
                            <div className="absolute top-2 right-2 flex gap-1 transition-opacity opacity-0 group-hover:opacity-100">
                               {!notif.isRead && (
                                  <Button 
                                    size="icon" 
                                    variant="ghost" 
                                    className="h-6 w-6 rounded-md hover:text-emerald-500"
                                    onClick={() => readMutation.mutate(notif.id)}
                                  >
                                    <CheckCheck className="h-3 w-3" />
                                  </Button>
                               )}
                               <Button 
                                  size="icon" 
                                  variant="ghost" 
                                  className="h-6 w-6 rounded-md hover:text-rose-500"
                                  onClick={() => deleteMutation.mutate(notif.id)}
                               >
                                 <Trash2 className="h-3 w-3" />
                               </Button>
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
                  <DropdownMenuSeparator className="m-0" />
                  <DropdownMenuItem className="p-3 text-center justify-center font-bold text-xs text-primary hover:bg-primary/5 cursor-pointer rounded-b-2xl">
                    View all notifications
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full transition-transform hover:scale-105 focus-visible:ring-0">
                    <Avatar className="h-10 w-10 border-2 border-primary/10 transition-colors hover:border-primary/20 shadow-xs">
                      <AvatarImage src={user.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${user.fullName}`} />
                      <AvatarFallback className="bg-primary/5 text-primary font-bold">
                        {user.fullName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 p-2 rounded-2xl shadow-2xl border-none ring-1 ring-primary/5" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal font-sans px-2 pb-3">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-black leading-none">{user.fullName}</p>
                      <p className="text-[10px] font-bold leading-none text-muted-foreground italic">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="opacity-50" />
                  <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer gap-3 rounded-xl py-2.5">
                    <User className="h-4 w-4 text-primary" />
                    <span className="font-bold">My Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/my-books')} className="cursor-pointer gap-3 rounded-xl py-2.5">
                    <Library className="h-4 w-4 text-primary" />
                    <span className="font-bold">My Library</span>
                  </DropdownMenuItem>
                  {(user.role === 'LIBRARIAN' || user.role === 'SUPER_ADMIN') && (
                    <DropdownMenuItem onClick={() => navigate('/admin')} className="cursor-pointer gap-3 rounded-xl py-2.5 bg-primary/5 text-primary focus:bg-primary/10">
                      <ShieldAlert className="h-4 w-4" />
                      <span className="font-black">Admin Dashboard</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="opacity-50" />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="cursor-pointer gap-3 text-rose-500 focus:bg-rose-50 focus:text-rose-600 rounded-xl py-2.5"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="font-black">Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex font-bold">
                  <Link to="/login">Sign in</Link>
                </Button>
                <Button size="sm" asChild className="shadow-lg shadow-primary/20 hover:shadow-xl transition-all duration-300 font-black rounded-xl h-9 px-5 bg-linear-to-r from-primary to-blue-600 border-none">
                  <Link to="/register">Get Started</Link>
                </Button>
              </div>
            )}

            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        "md:hidden absolute top-16 left-0 w-full bg-background border-b shadow-2xl transition-all duration-300 origin-top overflow-hidden",
        isMenuOpen ? "h-fit opacity-100 visible" : "h-0 opacity-0 invisible"
      )}>
        <div className="container mx-auto px-4 py-8 space-y-6">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-10 w-full h-12 bg-muted/30 border-none rounded-2xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          <div className="grid grid-cols-2 gap-4">
            <Button variant="secondary" asChild className="w-full justify-start gap-3 h-12 rounded-2xl font-black">
              <Link to="/categories">
                <Menu className="h-4 w-4 text-primary" /> Categories
              </Link>
            </Button>
            <Button variant="secondary" asChild className="w-full justify-start gap-3 h-12 rounded-2xl font-black">
              <Link to="/popular">
                <Bell className="h-4 w-4 text-primary" /> Popular
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
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
