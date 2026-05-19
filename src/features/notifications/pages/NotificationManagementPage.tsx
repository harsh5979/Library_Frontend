import { useState } from 'react'
import { useAuth } from '@/store/useAuth'
import { useMutation } from '@tanstack/react-query'
import { notificationService } from '@/features/notifications/services/notificationService'
import { userService } from '@/features/users/services/userService'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Bell, 
  Send, 
  Users, 
  User, 
  Loader2, 
  Search, 
  CheckCircle2, 
  AlertCircle,
  Info,
  TriangleAlert,
  ShieldCheck
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import type { User as UserType } from '@/types/user'

type NotificationType = 'GENERAL' | 'DUE_REMINDER' | 'FINE_ALERT' | 'BOOK_READY' | 'ACCOUNT_BLOCKED'

export function NotificationManagementPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'broadcast' | 'targeted'>('targeted')
  
  // Form State
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [type, setType] = useState<NotificationType>('GENERAL')
  const [sendEmail, setSendEmail] = useState(false)
  
  // Targeted Specific
  const [targetUser, setTargetUser] = useState<UserType | null>(null)
  const [userSearchTerm, setUserSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<UserType[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const isSuperAdmin = user?.role === 'SUPER_ADMIN'

  // Mutations
  const broadcastMutation = useMutation({
    mutationFn: () => notificationService.broadcast({ title, message, type, sendEmail }),
    onSuccess: (res) => {
      toast.success(res.message || 'Broadcast sent successfully!')
      resetForm()
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to send broadcast')
    }
  })

  const targetedMutation = useMutation({
    mutationFn: () => notificationService.sendToUser({ 
      userId: targetUser?.id, 
      title, 
      message, 
      type, 
      sendEmail 
    }),
    onSuccess: (res) => {
      toast.success(res.message || `Notification sent to ${targetUser?.fullName}`)
      resetForm()
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to send notification')
    }
  })

  const resetForm = () => {
    setTitle('')
    setMessage('')
    setType('GENERAL')
    setSendEmail(false)
    setTargetUser(null)
    setUserSearchTerm('')
    setSearchResults([])
  }

  const handleSearchUsers = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value
    setUserSearchTerm(term)
    
    if (term.length < 2) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      const res = await userService.searchUsers(term)
      setSearchResults(res.data.content)
    } catch (error) {
      console.error('Search failed', error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title || !message) {
      toast.error('Title and Message are required')
      return
    }

    if (activeTab === 'targeted' && !targetUser) {
      toast.error('Please select a target user')
      return
    }

    if (activeTab === 'broadcast') {
      if (!isSuperAdmin) {
        toast.error('Only Super Admins can broadcast messages')
        return
      }
      broadcastMutation.mutate()
    } else {
      targetedMutation.mutate()
    }
  }

  const isLoading = broadcastMutation.isPending || targetedMutation.isPending

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black tracking-tight text-gray-900">Notification Center</h1>
        <p className="text-gray-500 font-medium">Communicate directly with library members via in-app alerts and email.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Form */}
        <Card className="lg:col-span-7 border-none shadow-2xl shadow-gray-200/50 rounded-3xl overflow-hidden ring-1 ring-gray-100">
          <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-8">
            <div className="flex bg-white p-1 rounded-2xl border border-gray-200 w-fit mb-4">
              <button 
                onClick={() => setActiveTab('targeted')}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all",
                  activeTab === 'targeted' ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-gray-500 hover:text-gray-900"
                )}
              >
                <User className="size-3.5" /> Specific User
              </button>
              <button 
                onClick={() => setActiveTab('broadcast')}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all",
                  activeTab === 'broadcast' ? "bg-rose-500 text-white shadow-lg shadow-rose-500/20" : "text-gray-500 hover:text-gray-900",
                  !isSuperAdmin && "opacity-50 cursor-not-allowed"
                )}
                disabled={!isSuperAdmin}
              >
                <Users className="size-3.5" /> Broadcast All
              </button>
            </div>
            <CardTitle className="text-xl font-black">
              {activeTab === 'broadcast' ? 'Broadcast Message' : 'Send Targeted Notification'}
            </CardTitle>
            <CardDescription className="text-sm">
              {activeTab === 'broadcast' 
                ? 'This message will be sent to every active user in the system.' 
                : 'Search for a library member to send a private alert.'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {activeTab === 'targeted' && (
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400">Recipient</label>
                  <div className="relative group">
                    <Search className="absolute left-3 top-3.5 size-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <Input 
                      placeholder="Search member by name or email..." 
                      className="pl-10 h-12 bg-gray-50 border-none rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all"
                      value={userSearchTerm}
                      onChange={handleSearchUsers}
                      disabled={!!targetUser}
                    />
                    {isSearching && <Loader2 className="absolute right-3 top-3.5 size-4 animate-spin text-primary" />}
                    
                    {/* Search Results Dropdown */}
                    {!targetUser && searchResults.length > 0 && (
                      <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2">
                        {searchResults.map(u => (
                          <button
                            key={u.id}
                            type="button"
                            onClick={() => { setTargetUser(u); setSearchResults([]); setUserSearchTerm(u.fullName) }}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-primary/5 transition-colors text-left group"
                          >
                            <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                              {u.fullName?.[0]}
                            </div>
                            <div>
                              <p className="text-sm font-black text-gray-900 group-hover:text-primary transition-colors">{u.fullName}</p>
                              <p className="text-[10px] text-gray-500">{u.email}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {targetUser && (
                      <div className="flex items-center justify-between p-3 bg-primary/5 border border-primary/10 rounded-xl mt-2 animate-in zoom-in-95">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="size-4 text-emerald-500" />
                          <span className="text-sm font-bold text-primary">{targetUser.fullName} selected</span>
                        </div>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => { setTargetUser(null); setUserSearchTerm('') }}
                          className="h-7 text-[10px] font-black hover:bg-primary/10"
                        >
                          Change
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400">Subject</label>
                  <Input 
                    placeholder="Brief title for the alert" 
                    className="h-12 bg-gray-50 border-none rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400">Category</label>
                  <Select value={type} onValueChange={(val: NotificationType) => setType(val)}>
                    <SelectTrigger className="h-12 bg-gray-50 border-none rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-primary/10">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-none shadow-2xl ring-1 ring-gray-100">
                      <SelectItem value="GENERAL" className="rounded-xl">General Announcement</SelectItem>
                      <SelectItem value="DUE_REMINDER" className="rounded-xl">Due Date Reminder</SelectItem>
                      <SelectItem value="FINE_ALERT" className="rounded-xl">Fine Alert</SelectItem>
                      <SelectItem value="BOOK_READY" className="rounded-xl">Book Ready for Pickup</SelectItem>
                      <SelectItem value="ACCOUNT_BLOCKED" className="rounded-xl">Security/Account Issue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Message Content</label>
                <Textarea 
                  placeholder="Write your detailed message here..." 
                  className="min-h-[150px] bg-gray-50 border-none rounded-2xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all resize-none p-4"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-3 p-4 bg-blue-50/30 rounded-2xl border border-blue-50 transition-all hover:bg-blue-50/50">
                <Checkbox 
                  id="email-notif" 
                  checked={sendEmail} 
                  onCheckedChange={(val) => setSendEmail(!!val)}
                  className="rounded-md border-blue-200 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
                <div className="grid gap-1.5 leading-none">
                  <label htmlFor="email-notif" className="text-xs font-black text-blue-900 cursor-pointer">
                    Also Send Email Notification
                  </label>
                  <p className="text-[10px] text-blue-700 font-medium italic">
                    The recipient will receive an automated email copy of this message.
                  </p>
                </div>
              </div>

              <Button 
                type="submit" 
                className={cn(
                  "w-full h-14 rounded-2xl text-lg font-black shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] border-none",
                  activeTab === 'broadcast' ? "bg-rose-500 shadow-rose-500/20" : "bg-primary shadow-primary/20"
                )}
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="size-5 animate-spin mr-2" /> : <Send className="size-5 mr-2" />}
                {activeTab === 'broadcast' ? 'Broadcast to All Members' : 'Send Notification'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Right: Preview Card */}
        <div className="lg:col-span-5 space-y-8">
          <Card className="border-none shadow-xl shadow-gray-200/40 rounded-3xl bg-linear-to-br from-gray-900 to-gray-800 text-white overflow-hidden ring-1 ring-white/10 h-fit sticky top-24">
            <CardHeader className="pb-4">
              <div className="size-10 bg-white/10 rounded-xl flex items-center justify-center mb-2">
                <Bell className="size-5 text-primary-foreground" />
              </div>
              <CardTitle className="text-lg font-black">Member View Preview</CardTitle>
              <CardDescription className="text-gray-400 text-xs">How it will appear in the member's notification bell.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-4">
                <div className="flex gap-3">
                  <div className="p-3 rounded-xl bg-primary/20 text-primary h-fit">
                    <NotificationIconPreview type={type} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-black">{title || 'Your Notification Title'}</p>
                    <p className="text-xs text-gray-300 leading-relaxed italic line-clamp-3">
                      {message || 'Your detailed message content will flow here...'}
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Just now</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white font-bold">{type.replace('_', ' ')}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-white/5 text-[10px] text-gray-500 font-medium leading-relaxed italic">
                * Real-time delivery via WebSockets/Polling is active. Members will see a badge update on their profile without refreshing.
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg shadow-gray-100 rounded-3xl p-6 bg-emerald-500/5 ring-1 ring-emerald-500/10">
            <div className="flex gap-4">
              <div className="size-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0">
                <ShieldCheck className="size-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-black text-gray-900 text-sm">Automated Alerts</h4>
                <p className="text-[11px] text-gray-600 leading-relaxed font-medium">
                  System events (like reservation pick-up ready or overdue books) are already sent automatically. Use this tool only for manual overrides or unique communications.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

function NotificationIconPreview({ type }: { type: string }) {
  switch (type) {
    case 'FINE_ALERT':
    case 'ACCOUNT_BLOCKED':
      return <AlertCircle className="h-4 w-4" />
    case 'DUE_REMINDER':
      return <TriangleAlert className="h-4 w-4" />
    case 'BOOK_READY':
      return <CheckCircle2 className="h-4 w-4" />
    default:
      return <Info className="h-4 w-4" />
  }
}
