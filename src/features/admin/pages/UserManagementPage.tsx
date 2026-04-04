import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userService } from '@/features/users/services/userService'
import type { User } from '@/features/auth/types'
import { 
  Users, 
  Search, 
  MoreVertical, 
  ShieldAlert, 
  Ban, 
  CheckCircle2, 
  Mail, 
  Key, 
  Phone, 
  Building2
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export function UserManagementPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<string | undefined>()
  const queryClient = useQueryClient()

  const { data: usersData, isLoading } = useQuery({
    queryKey: ['users-list', searchTerm, roleFilter],
    queryFn: () => searchTerm 
      ? userService.searchUsers(searchTerm) 
      : userService.getAllUsers(0, 50, roleFilter),
  })

  const blockMutation = useMutation({
    mutationFn: (id: number) => userService.blockUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users-list'] })
      toast.success("This user has been suspended from the library system.")
    }
  })

  const unblockMutation = useMutation({
    mutationFn: (id: number) => userService.unblockUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users-list'] })
      toast.success("Full privileges have been reactivated for this user.")
    }
  })

  const users = usersData?.data?.content || []

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
            Member Directory
          </h1>
          <p className="text-muted-foreground font-medium text-lg italic">Comprehensive identity management for all library affiliates.</p>
        </div>
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Find by name, email or ID..." 
            className="pl-10 h-12 rounded-2xl border-2 bg-background focus:bg-background transition-all shadow-lg shadow-primary/5"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <FilterTile active={!roleFilter} label="All Members" onClick={() => setRoleFilter(undefined)} />
        <FilterTile active={roleFilter === 'STUDENT'} label="Students Only" onClick={() => setRoleFilter('STUDENT')} />
        <FilterTile active={roleFilter === 'FACULTY'} label="Academic Faculty" onClick={() => setRoleFilter('FACULTY')} />
        <FilterTile active={roleFilter === 'LIBRARIAN'} label="Staff / Admin" onClick={() => setRoleFilter('LIBRARIAN')} />
      </div>

      <Card className="border-none shadow-2xl bg-background/60 backdrop-blur-xl ring-1 ring-primary/5 rounded-3xl overflow-hidden p-0">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="border-primary/5 hover:bg-transparent">
              <TableHead className="py-5 font-black uppercase text-[10px] tracking-widest pl-8">Member Identity</TableHead>
              <TableHead className="font-black uppercase text-[10px] tracking-widest">Affiliation & Branch</TableHead>
              <TableHead className="font-black uppercase text-[10px] tracking-widest">Contact Intel</TableHead>
              <TableHead className="font-black uppercase text-[10px] tracking-widest text-center">Library Status</TableHead>
              <TableHead className="pr-8"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="pl-8 py-6"><Skeleton className="h-10 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16 mx-auto" /></TableCell>
                  <TableCell className="pr-8"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : users.map((user: User) => (
              <TableRow key={user.id} className="border-primary/5 hover:bg-primary/2 transition-colors group">
                <TableCell className="py-6 pl-8">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 border-2 border-primary/10 shadow-sm group-hover:scale-110 transition-transform">
                      <AvatarImage src={user.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${user.fullName}`} />
                      <AvatarFallback className="font-black text-primary bg-primary/5">{user.fullName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-0.5">
                       <p className="font-black group-hover:text-primary transition-colors">{user.fullName}</p>
                       <p className="text-[10px] font-black p-0 uppercase opacity-40">{user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <Badge variant="secondary" className="rounded-lg font-black text-[10px] uppercase px-2 py-0.5">
                      {user.role}
                    </Badge>
                    <p className="text-xs font-bold text-muted-foreground flex items-center gap-1.5 capitalize">
                      <Building2 className="h-3 w-3" /> {user.department || 'General Library'}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="font-medium text-xs space-y-1">
                  <p className="flex items-center gap-2 group-hover:text-primary transition-colors"><Mail className="h-3 w-3 opacity-40" /> {user.email}</p>
                  {user.phone && <p className="flex items-center gap-2"><Phone className="h-3 w-3 opacity-40" /> {user.phone}</p>}
                </TableCell>
                <TableCell className="text-center">
                  <Badge className={cn(
                    "rounded-xl font-black text-[9px] uppercase px-3 py-1 border-none",
                    user.isActive ? "bg-emerald-500/10 text-emerald-600 shadow-emerald-500/10" : "bg-rose-500/10 text-rose-600 shadow-rose-500/10"
                  )}>
                    {user.isActive ? 'Active Member' : 'Suspended'}
                  </Badge>
                </TableCell>
                <TableCell className="pr-8 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-muted opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl shadow-2xl border-none ring-1 ring-primary/5">
                      <DropdownMenuLabel className="font-black text-[10px] uppercase opacity-40 px-3 pb-3">Security Actions</DropdownMenuLabel>
                      <DropdownMenuItem className="py-2.5 rounded-xl font-bold cursor-pointer gap-3">
                         <Key className="h-4 w-4 text-primary" /> Reset Credentials
                      </DropdownMenuItem>
                      <DropdownMenuItem className="py-2.5 rounded-xl font-bold cursor-pointer gap-3">
                         <ShieldAlert className="h-4 w-4 text-amber-500" /> Administrative Audit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="opacity-50" />
                      {user.isActive ? (
                        <DropdownMenuItem 
                          className="py-2.5 rounded-xl font-black cursor-pointer gap-3 text-rose-600 focus:bg-rose-50 focus:text-rose-600"
                          onClick={() => {
                            if(confirm(`Restrict access for ${user.fullName}?`)) blockMutation.mutate(user.id)
                          }}
                        >
                           <Ban className="h-4 w-4" /> Deactivate Account
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem 
                          className="py-2.5 rounded-xl font-black cursor-pointer gap-3 text-emerald-600 focus:bg-emerald-50 focus:text-emerald-600"
                          onClick={() => unblockMutation.mutate(user.id)}
                        >
                           <CheckCircle2 className="h-4 w-4" /> Reactivate Access
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      
      {!isLoading && users.length === 0 && (
         <div className="text-center py-20">
           <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground/20" />
           <p className="font-black text-xl">No affiliates found</p>
           <p className="text-muted-foreground font-medium">Clear filters or try a broader search term.</p>
         </div>
      )}
    </div>
  )
}

function FilterTile({ active, label, onClick }: { active: boolean, label: string, onClick: () => void }) {
  return (
    <Button 
      variant={active ? 'default' : 'outline'} 
      className={cn(
        "h-16 rounded-2xl font-black shadow-lg transition-all border-2",
        active ? "bg-linear-to-r from-primary to-blue-600 border-none scale-105" : "hover:bg-primary/5 hover:border-primary/20 bg-background/40 backdrop-blur-md border-primary/5"
      )}
      onClick={onClick}
    >
      {label}
    </Button>
  )
}
