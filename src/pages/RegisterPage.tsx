import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { authApi } from '@/api/auth'
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
import { useToast } from '@/hooks/use-toast'
import { Library, ArrowRight, CheckCircle2, ShieldCheck, Mail, Lock, User as UserIcon, Phone, Briefcase, Hash, GraduationCap } from 'lucide-react'
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
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

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
    },
  })

  const selectedRole = form.watch('role')

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    setIsLoading(true)
    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...registerData } = values
      const response = await authApi.register({
        ...registerData,
        branchId: 1 // Default branch
      })
      
      if (response.success) {
        toast({
          title: "Registration Successful!",
          description: "Please check your email to verify your account.",
        })
        navigate('/login')
      } else {
        toast({
          title: "Registration Failed",
          description: response.message || "An error occurred during registration.",
          variant: "destructive",
        })
      }
    } catch (error: any) {
       // Log validation errors for debugging
       console.error("Registration Error Details:", error.response?.data);
       
      toast({
        title: "Registration Error",
        description: error.response?.data?.message || error.response?.data?.errors?.fullName || "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 bg-[radial-gradient(circle_at_30%_30%,_rgba(59,130,246,0.05),_transparent_50%)]" />
      <div className="absolute bottom-0 right-0 w-full h-full -z-10 bg-[radial-gradient(circle_at_70%_70%,_rgba(59,130,246,0.05),_transparent_50%)]" />

      <div className="grid lg:grid-cols-2 gap-12 items-start max-w-6xl w-full">
        {/* Left Side: Info */}
        <div className="hidden lg:flex flex-col space-y-8 animate-in fade-in slide-in-from-left duration-700 sticky top-24">
          <div className="space-y-4">
            <Link to="/" className="inline-flex items-center gap-2 group">
              <div className="bg-primary rounded-xl p-2 text-primary-foreground shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                <Library className="h-8 w-8" />
              </div>
              <span className="text-3xl font-black tracking-tight bg-clip-text text-transparent bg-linear-to-r from-primary to-blue-600">
                BiblioSphere
              </span>
            </Link>
            <h2 className="text-4xl font-black tracking-tight leading-tight">
              A comprehensive library ecosystem for everyone.
            </h2>
            <p className="text-xl text-muted-foreground/80 font-medium">
              Join thousands of students and faculty members in the most advanced digital library network.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-card border-2 border-primary/5 hover:border-primary/10 transition-colors shadow-sm ring-1 ring-black/5">
              <div className="mt-1 p-2 rounded-lg bg-emerald-500/10 text-emerald-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold">Role-based Access</h4>
                <p className="text-sm text-muted-foreground">Specialized features for Students, Faculty, and Staff.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-card border-2 border-primary/5 hover:border-primary/10 transition-colors shadow-sm ring-1 ring-black/5">
              <div className="mt-1 p-2 rounded-lg bg-blue-500/10 text-blue-600">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold">Secure Verification</h4>
                <p className="text-sm text-muted-foreground">All accounts go through rigorous ID verification.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <Card className="border-none shadow-2xl bg-background/60 backdrop-blur-xl ring-1 ring-primary/5 animate-in fade-in zoom-in-95 duration-700">
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
                            <SelectItem value="STUDENT" className="cursor-pointer focus:bg-primary/10 focus:text-primary">Student</SelectItem>
                            <SelectItem value="FACULTY" className="cursor-pointer focus:bg-primary/10 focus:text-primary">Faculty member</SelectItem>
                            <SelectItem value="LIBRARIAN" className="cursor-pointer focus:bg-primary/10 focus:text-primary">Librarian</SelectItem>
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
                  ) : (
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
      </div>
    </div>
  )
}
