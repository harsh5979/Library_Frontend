import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userService } from '@/features/users/services/userService'
import type { User } from '@/types/user'
import { useAuth } from '@/store/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  Building, 
  ShieldCheck, 
  Clock, 
  Edit3, 
  Camera, 
  ArrowLeft,
  CheckCircle2,
  Lock,
  Save,
  LogOut,
  Library,
  AlertCircle
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Skeleton } from '@/components/ui/skeleton'
import { Link, useNavigate } from 'react-router-dom'

export function ProfilePage() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { logout } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<Partial<User>>({})

  const { data: profileResponse, isLoading, isError } = useQuery({
    queryKey: ['profile'],
    queryFn: () => userService.getProfile(),
  })

  const updateProfileMutation = useMutation({
    mutationFn: (data: Partial<User>) => userService.updateProfile(data),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['profile'] })
        setIsEditing(false)
        toast({
          title: "Profile Updated",
          description: "Your information has been saved successfully.",
        })
      }
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast({
        title: "Update Failed",
        description: error.response?.data?.message || "An error occurred while updating.",
        variant: "destructive",
      })
    }
  })

  if (isLoading) return <ProfileSkeleton />
  if (isError || !profileResponse?.success) return <ProfileError />

  const user = profileResponse?.data
  if (!user) return <ProfileError />

  const handleEditInit = () => {
    setFormData({
      fullName: user.fullName,
      phone: user.phone || '',
      department: user.department || '',
    })
    setIsEditing(true)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex items-center justify-between">
        <Button variant="ghost" asChild className="group text-muted-foreground hover:text-foreground font-bold">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Home
          </Link>
        </Button>
        <Badge variant={user.isActive ? "secondary" : "destructive"} className="px-4 py-1.5 rounded-full font-black animate-pulse">
          {user.isActive ? (
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" /> ACTIVE ACCOUNT
            </span>
          ) : "INACTIVE"}
        </Badge>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Sidebar / Photo Card */}
        <Card className="lg:col-span-1 border-none shadow-2xl bg-background/60 backdrop-blur-xl ring-1 ring-primary/5 rounded-3xl overflow-hidden h-fit">
          <div className="h-32 bg-linear-to-br from-primary via-primary/80 to-blue-600 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute top-4 right-4 text-white/20">
              <Library className="h-24 w-24 -rotate-12" />
            </div>
          </div>
          <CardContent className="pt-0 relative text-center">
            <div className="-mt-16 mb-6">
              <div className="relative inline-block group">
                <Avatar className="h-32 w-32 border-4 border-background shadow-2xl transition-transform hover:scale-105 duration-500">
                  <AvatarImage src={user.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${user.fullName}`} />
                  <AvatarFallback className="bg-primary/5 text-primary text-4xl font-black">{user.fullName?.[0]}</AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button size="icon" className="absolute bottom-0 right-0 h-10 w-10 rounded-full shadow-xl shadow-primary/20 ring-4 ring-background animate-in zoom-in-50">
                    <Camera className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            
            <h2 className="text-2xl font-black tracking-tight mb-1">{user.fullName}</h2>
            <p className="text-muted-foreground font-bold text-sm uppercase tracking-widest">{user.role}</p>
            
            <div className="mt-8 pt-8 border-t space-y-4">
              <div className="flex items-center gap-3 text-sm font-medium p-3 rounded-2xl bg-muted/20 hover:bg-muted/40 transition-colors">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Joined:</span>
                <span className="font-bold ml-auto">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'January 2024'}</span>
              </div>
              <Button variant="ghost" onClick={handleLogout} className="w-full text-rose-500 hover:text-rose-600 hover:bg-rose-50 font-black gap-2">
                <LogOut className="h-4 w-4" /> Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Form Content */}
        <Card className="lg:col-span-2 border-none shadow-2xl bg-background/60 backdrop-blur-xl ring-1 ring-primary/5 rounded-3xl overflow-hidden">
          <CardHeader className="pb-8">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <CardTitle className="text-3xl font-black tracking-tight">Personal Details</CardTitle>
                <CardDescription className="text-muted-foreground font-medium">Manage your identity and contact info.</CardDescription>
              </div>
              {!isEditing && (
                <Button onClick={handleEditInit} className="h-11 px-6 font-bold gap-2 shadow-xl shadow-primary/20 bg-linear-to-r from-primary to-blue-600 border-none rounded-xl">
                  <Edit3 className="h-4 w-4" /> Edit Profile
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6">
              <ProfileField 
                icon={<UserIcon />} 
                label="Full Name" 
                value={user.fullName} 
                isEditing={isEditing}
                onChange={(v) => setFormData(prev => ({...prev, fullName: v}))}
                inputValue={formData.fullName}
              />
              <ProfileField 
                icon={<Mail />} 
                label="Email Address" 
                value={user.email} 
                subValue={user.isActive ? "Verified Identity" : "Unverified"}
                verified={user.isActive}
              />
              <ProfileField 
                icon={<Phone />} 
                label="Mobile Number" 
                value={user.phone || "Not provided"} 
                isEditing={isEditing}
                onChange={(v) => setFormData(prev => ({...prev, phone: v}))}
                inputValue={formData.phone}
              />
              <ProfileField 
                icon={<Building />} 
                label="Department" 
                value={user.department || "General Administration"} 
                isEditing={isEditing}
                onChange={(v) => setFormData(prev => ({...prev, department: v}))}
                inputValue={formData.department}
              />
              {user.role === 'STUDENT' && (
                <ProfileField 
                  icon={<ShieldCheck />} 
                  label="Enrollment ID" 
                  value={user.id?.toString() || "LIBR-ST-001"} 
                />
              )}
            </div>
          </CardContent>
          {isEditing && (
            <CardFooter className="bg-muted/5 border-t pt-8 gap-4">
              <Button 
                variant="outline" 
                className="flex-1 font-bold h-12 rounded-xl border-2" 
                onClick={() => setIsEditing(false)}
                disabled={updateProfileMutation.isPending}
              >
                Cancel Changes
              </Button>
              <Button 
                className="flex-1 font-bold h-12 rounded-xl shadow-xl shadow-emerald-500/10 bg-emerald-600 hover:bg-emerald-700 border-none gap-2"
                onClick={() => updateProfileMutation.mutate(formData)}
                disabled={updateProfileMutation.isPending}
              >
                {updateProfileMutation.isPending ? "Saving..." : <><Save className="h-4 w-4" /> Save Information</>}
              </Button>
            </CardFooter>
          )}
          {!isEditing && (
            <CardFooter className="bg-muted/5 border-t py-6 flex flex-col items-start gap-4">
               <div className="flex items-center gap-3 w-full p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10">
                  <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600">
                    <Lock className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold">Security Settings</p>
                    <p className="text-xs text-muted-foreground font-medium">Update your password or enable MFA.</p>
                  </div>
                  <Button variant="outline" size="sm" className="font-bold border-2 rounded-lg">Update</Button>
               </div>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  )
}

function ProfileError() {
  return (
    <Card className="max-w-md mx-auto mt-20 p-8 text-center border-none shadow-2xl bg-background/60 backdrop-blur-xl ring-1 ring-destructive/10">
      <CardHeader>
        <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive mb-4">
          <AlertCircle className="h-6 w-6" />
        </div>
        <CardTitle className="text-xl font-black">Profile Unavailable</CardTitle>
        <CardDescription className="font-bold">
          We encountered an error while fetching your information. Please check your connection or try signing in again.
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex gap-4">
        <Button variant="outline" className="flex-1 font-bold border-2" onClick={() => window.location.reload()}>
          Retry
        </Button>
        <Button asChild className="flex-1 font-bold bg-linear-to-r from-primary to-blue-600 border-none shadow-lg">
          <Link to="/">Go Home</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

function ProfileField({ 
  icon, 
  label, 
  value, 
  isEditing = false, 
  onChange, 
  inputValue,
  subValue,
  verified
}: { 
  icon: React.ReactNode, 
  label: string, 
  value: string, 
  isEditing?: boolean,
  onChange?: (val: string) => void,
  inputValue?: string,
  subValue?: string,
  verified?: boolean
}) {
  return (
    <div className="flex items-start gap-5 p-4 rounded-2xl bg-muted/20 hover:bg-muted/30 transition-all border border-transparent hover:border-primary/5 group">
      <div className="p-3.5 rounded-2xl bg-background shadow-xs text-primary group-hover:scale-110 transition-transform duration-500">
        {icon}
      </div>
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2">
          <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest leading-none">{label}</p>
          {verified && <CheckCircle2 className="h-3 w-3 text-emerald-500" />}
        </div>
        {isEditing && onChange ? (
          <Input 
            value={inputValue} 
            onChange={(e) => onChange(e.target.value)}
            className="h-11 bg-background/50 border-primary/10 mt-2 font-bold focus:ring-primary/20"
          />
        ) : (
          <div className="flex items-end justify-between">
            <p className="text-lg font-black tracking-tight truncate">{value}</p>
            {subValue && (
               <span className="text-[10px] font-black italic text-muted-foreground/60">{subValue}</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function ProfileSkeleton() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-8 animate-pulse">
      <Skeleton className="h-10 w-32" />
      <div className="grid lg:grid-cols-3 gap-8">
        <Skeleton className="h-[400px] w-full rounded-3xl" />
        <Skeleton className="h-[600px] lg:col-span-2 w-full rounded-3xl" />
      </div>
    </div>
  )
}
