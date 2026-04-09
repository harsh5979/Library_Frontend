"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2, Mail, Lock, User as UserIcon, Phone, Library, Eye, EyeOff } from "lucide-react";

import { authService } from "@/lib/services/authService";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "@/store/auth";

const registerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  phone: z.string().optional(),
  role: z.enum(["STUDENT", "FACULTY", "LIBRARIAN"]),
  department: z.string().optional(),
  enrollmentNo: z.string().optional(),
  employeeId: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { isAuthenticated, _hasHydrated } = useAuthStore();

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (mounted && _hasHydrated && isAuthenticated) router.push("/dashboard");
  }, [mounted, _hasHydrated, isAuthenticated, router]);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "", email: "", password: "", confirmPassword: "",
      phone: "", role: "STUDENT", department: "", enrollmentNo: "", employeeId: "",
    },
  });

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    setIsLoading(true);
    try {
      const { confirmPassword: _, ...rest } = values;
      const payload = {
        ...rest,
        employeeId: rest.employeeId?.trim() || undefined,
        enrollmentNo: rest.enrollmentNo?.trim() || undefined,
        department: rest.department?.trim() || undefined,
        phone: rest.phone?.trim() || undefined,
      };
      const response = await authService.register(payload as any);
      if (response.success) {
        toast.success("Account created! Please check your email to verify.");
        router.push("/login");
      } else {
        toast.error(response.message || "Registration failed.");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create account.");
    } finally {
      setIsLoading(false);
    }
  }

  if (!mounted || !_hasHydrated || isAuthenticated) return null;

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-5/12 bg-primary flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="size-9 bg-white/20 rounded-xl flex items-center justify-center">
            <Library className="size-5 text-white" />
          </div>
          <span className="text-white font-heading font-bold text-xl">Omnishelf</span>
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-heading font-bold text-white leading-tight">
            Join the library<br />network today.
          </h1>
          <p className="text-white/70 text-sm leading-relaxed max-w-sm">
            Create your account to access books, manage reservations, and track your reading history.
          </p>
        </div>
        <p className="text-white/40 text-xs">© {new Date().getFullYear()} Omnishelf. All rights reserved.</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 overflow-y-auto">
        <div className="w-full max-w-lg space-y-7 py-8">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 lg:hidden">
            <div className="size-9 bg-primary rounded-xl flex items-center justify-center">
              <Library className="size-5 text-white" />
            </div>
            <span className="font-heading font-bold text-xl text-foreground">Omnishelf</span>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-heading font-bold text-foreground">Create your account</h2>
            <p className="text-muted-foreground text-sm">Fill in the details below to get started</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Full Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                          <Input placeholder="John Doe" {...field} className="pl-10 h-11 bg-white border-border" />
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
                      <FormLabel className="text-sm font-medium">Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                          <Input placeholder="you@university.edu" {...field} className="pl-10 h-11 bg-white border-border" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Phone (optional)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                          <Input placeholder="+1 234 567 890" {...field} className="pl-10 h-11 bg-white border-border" />
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
                      <FormLabel className="text-sm font-medium">Account Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-11 bg-white border-border">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="STUDENT">Student</SelectItem>
                          <SelectItem value="FACULTY">Faculty</SelectItem>
                          <SelectItem value="LIBRARIAN">Librarian</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            {...field}
                            className="pl-10 pr-10 h-11 bg-white border-border"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                          </button>
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
                      <FormLabel className="text-sm font-medium">Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} className="h-11 bg-white border-border" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-medium"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="size-4 animate-spin" /> : "Create account"}
              </Button>
            </form>
          </Form>

          <div className="flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">or</span>
            <Separator className="flex-1" />
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
