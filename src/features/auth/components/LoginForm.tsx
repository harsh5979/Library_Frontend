import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { authService } from '../services/authService'
import { useAuth } from '@/store/useAuth'
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
import { ArrowRight, Lock, Mail, Globe, Fingerprint } from 'lucide-react'
import type { User } from '@/types/user'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { toast } = useToast()
  const { setAuth } = useAuth()

  const from = location.state?.from?.pathname || '/'

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true)
    try {
      const response = await authService.login(values)
      
      if (response.success) {
        const { accessToken, refreshToken, userId, fullName, email, role } = response.data
        
        const user: User = {
          id: userId,
          username: fullName,
          fullName,
          email,
          role,
          profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
          isActive: true,
          isEmailVerified: true,
          createdAt: new Date().toISOString(),
          memberSince: new Date().toISOString(),
        }
        
        setAuth(user, accessToken, refreshToken)
        
        toast({
          title: "Welcome back!",
          description: `Successfully signed in as ${fullName}.`,
        })
        navigate(from, { replace: true })
      }
    } catch (error: any) {
      toast({
        title: "Authentication Error",
        description: error.message || "Invalid email or password.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-none shadow-2xl bg-background/60 backdrop-blur-xl ring-1 ring-primary/5">
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
        <CardDescription>
          Enter your official university email and password.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Email Address</FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input placeholder="john@university.edu" {...field} className="pl-10 h-11 bg-muted/30 focus:ring-primary/20" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel className="font-bold">Password</FormLabel>
                    <Link to="/forgot-password" className="text-xs font-bold text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input type="password" placeholder="••••••••" {...field} className="pl-10 h-11 bg-muted/30 focus:ring-primary/20" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full h-11 text-lg font-bold shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all pt-1 bg-linear-to-r from-primary to-blue-600 border-none" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Access Collection"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </form>
        </Form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground font-bold">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" className="h-11 font-bold border-2 hover:bg-muted/50 transition-colors" type="button">
            <Globe className="mr-2 h-4 w-4" />
            Google
          </Button>
          <Button variant="outline" className="h-11 font-bold border-2 hover:bg-muted/50 transition-colors" type="button">
            <Fingerprint className="mr-2 h-4 w-4" />
            SSO
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col border-t pt-6 bg-muted/10">
        <div className="text-center">
          <span className="text-sm text-muted-foreground font-medium">Don't have an account? </span>
          <Link to="/register" className="text-sm font-bold text-primary hover:underline underline-offset-4">
            Join IOMD Library
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
