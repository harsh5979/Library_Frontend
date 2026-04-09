import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { authService } from '../services/authService'
import { useAuth } from '@/store/useAuth'
import { branchService, type BranchResponse } from '@/features/books/services/branchService'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { ArrowRight, Mail, Lock, User as UserIcon, Phone, Briefcase, Hash, GraduationCap, Building2 } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  phone: z.string().optional(),
  role: z.enum(['STUDENT', 'FACULTY', 'LIBRARIAN']),
  department: z.string().optional(),
  enrollmentNo: z.string().optional(),
  employeeId: z.string().optional(),
  branchId: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [branches, setBranches] = useState<BranchResponse[]>([])
  const [isFetchingBranches, setIsFetchingBranches] = useState(false)
  const navigate = useNavigate()
  const { setAuth } = useAuth()

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      role: 'STUDENT',
      department: '',
      enrollmentNo: '',
      employeeId: '',
      branchId: '',
    },
  })

  const selectedRole = form.watch('role')

  // Fetch branches if role is Librarian
  useEffect(() => {
    if (selectedRole === 'LIBRARIAN') {
      const fetchBranches = async () => {
        setIsFetchingBranches(true)
        try {
          const response = await branchService.getAllBranches()
          if (response.success) {
            setBranches(response.data)
          }
        } catch (error) {
          console.error('Failed to fetch branches', error)
        } finally {
          setIsFetchingBranches(false)
        }
      }
      fetchBranches()
    }
  }, [selectedRole])

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    setIsLoading(true)
    try {
      const { confirmPassword, branchId, ...rest } = values
      const payload = { ...rest, branchId: branchId ? Number(branchId) : undefined }

      const response = await authService.register(payload as any)

      if (response.success) {
        const { accessToken, refreshToken, userId, fullName, email, role } = response.data
        setAuth(
          { id: userId, username: fullName, fullName, email, role, profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`, isActive: true, isEmailVerified: false, createdAt: new Date().toISOString(), memberSince: new Date().toISOString() },
          accessToken,
          refreshToken
        )
        toast.success(`Account created. Please verify your email, ${fullName}.`)
        navigate('/')
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-none shadow-2xl bg-background/60 backdrop-blur-xl ring-1 ring-primary/5">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-3xl font-black text-center">Register Today</CardTitle>
        <CardDescription className="text-center text-base">
          Please enter your official university details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Full Name</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input placeholder="John Doe" {...field} className="pl-10 h-11 bg-muted/30 focus:ring-primary/20 shadow-xs" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Email Address</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input placeholder="john@uni.edu" {...field} className="pl-10 h-11 bg-muted/30 focus:ring-primary/20 shadow-xs" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Phone Number</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input placeholder="+91 987..." {...field} className="pl-10 h-11 bg-muted/30 focus:ring-primary/20 shadow-xs" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Member Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11 bg-muted/30 focus:ring-primary/20 shadow-xs border-muted text-foreground">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl shadow-2xl">
                        <SelectItem value="STUDENT" className="cursor-pointer">Student</SelectItem>
                        <SelectItem value="FACULTY" className="cursor-pointer">Faculty member</SelectItem>
                        <SelectItem value="LIBRARIAN" className="cursor-pointer">Librarian</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Department</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input placeholder="Comp Science" {...field} className="pl-10 h-11 bg-muted/30 focus:ring-primary/20 shadow-xs" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {selectedRole === 'STUDENT' ? (
                 <FormField
                  control={form.control}
                  name="enrollmentNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">Enrollment ID</FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                          <Input placeholder="EN-2024-..." {...field} className="pl-10 h-11 bg-muted/30 focus:ring-primary/20 shadow-xs" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : selectedRole === 'FACULTY' ? (
                <FormField
                  control={form.control}
                  name="employeeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">Employee ID</FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                          <Input placeholder="EMP-452..." {...field} className="pl-10 h-11 bg-muted/30 focus:ring-primary/20 shadow-xs" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <FormField
                  control={form.control}
                  name="branchId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">Branch Selection</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        disabled={isFetchingBranches || branches.length === 0}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11 bg-muted/30 focus:ring-primary/20 shadow-xs border-muted text-foreground">
                            <Building2 className="mr-2 h-4 w-4 text-muted-foreground" />
                            <SelectValue placeholder={isFetchingBranches ? "Loading branches..." : "Select Branch"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xl shadow-2xl">
                          {branches.map((branch) => (
                            <SelectItem key={branch.id} value={branch.id.toString()}>
                              {branch.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Create Password</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input type="password" placeholder="••••••••" {...field} className="pl-10 h-11 bg-muted/30 focus:ring-primary/20 shadow-xs" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Confirm</FormLabel>
                    <FormControl>
                       <Input type="password" placeholder="••••••••" {...field} className="h-11 bg-muted/30 focus:ring-primary/20 shadow-xs" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full h-12 text-lg font-bold shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all bg-linear-to-r from-primary to-blue-600 border-none" disabled={isLoading}>
              {isLoading ? "Creating Profile..." : "Verify and Join"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col border-t pt-4 bg-muted/5 rounded-b-3xl">
        <div className="text-center">
          <span className="text-sm text-muted-foreground font-medium">Already registered? </span>
          <Link to="/login" className="text-sm font-black text-primary hover:underline underline-offset-4">
            Sign in to Library
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
