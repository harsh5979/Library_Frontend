"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { 
  ArrowRight, 
  Mail, 
  Lock, 
  User as UserIcon, 
  Phone, 
  Briefcase, 
  GraduationCap, 
  Library,
  ShieldCheck,
  Loader2,
  ChevronLeft
} from "lucide-react";

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
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
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
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { isAuthenticated, _hasHydrated } = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && _hasHydrated && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [mounted, _hasHydrated, isAuthenticated, router]);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      role: "STUDENT",
      department: "",
      enrollmentNo: "",
      employeeId: "",
    },
  });

  const selectedRole = form.watch("role");

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    setIsLoading(true);
    try {
      const { confirmPassword: _confirmPassword, ...rest } = values;
      const payload = {
        ...rest,
        employeeId: rest.employeeId?.trim() || undefined,
        enrollmentNo: rest.enrollmentNo?.trim() || undefined,
        department: rest.department?.trim() || undefined,
        phone: rest.phone?.trim() || undefined,
      };
      
      const response = await authService.register(payload as any);
      
      if (response.success) {
        toast.success("Account Created", {
          description: "Your registration is successful. You can now sign in.",
        });
        router.push("/login");
      } else {
        toast.error(response.message || "Registration failed.");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || "Failed to create account.");
    } finally {
      setIsLoading(false);
    }
  }

  if (!mounted || !_hasHydrated || isAuthenticated) return null;

  return (
    <div className="relative min-h-screen flex items-center justify-center p-section overflow-hidden bg-black selection:bg-primary/30">
      {/* Background with subtle gradient */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,rgba(var(--primary),0.1),transparent_50%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.05),transparent_50%)]" />

      <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl w-full z-10">
        <div className="hidden lg:flex flex-col space-y-10 animate-in fade-in slide-in-from-left duration-1000">
          <div className="space-y-6">
            <Link href="/" className="inline-flex items-center gap-3 text-primary hover:scale-105 transition-transform">
              <div className="bg-primary/10 rounded-2xl p-4 ring-1 ring-primary/20">
                <Library className="size-10" />
              </div>
              <span className="text-4xl font-heading font-black tracking-tighter uppercase text-white">Omnishelf.</span>
            </Link>
            <h2 className="text-6xl md:text-7xl font-heading font-black tracking-tighter uppercase leading-[0.9] text-white">
              Join the <br /> <span className="text-primary italic">Absolute</span> Network.
            </h2>
            <p className="text-xl text-white/40 font-medium leading-relaxed max-w-md">
              Synchronize your academic journey with our next-generation resource platform.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4 p-6 rounded-3xl bg-white/5 backdrop-blur-3xl border border-white/5 hover:border-white/10 transition-all group">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/20 group-hover:scale-110 transition-transform">
                <ShieldCheck className="size-6" />
              </div>
              <div>
                <h4 className="text-lg font-heading font-black uppercase text-white tracking-widest">Unified Access</h4>
                <p className="text-sm text-white/40 font-medium">One account for all library branches and digital archives.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full animate-in fade-in slide-in-from-right duration-1000">
          <Card className="border-none bg-white/5 backdrop-blur-3xl shadow-2xl ring-1 ring-white/10 rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 md:p-12 space-y-10">
              <div className="space-y-2">
                <Link href="/login" className="inline-flex items-center gap-2 text-white/40 hover:text-primary transition-colors font-heading text-[10px] uppercase font-black tracking-widest group mb-4">
                  <ChevronLeft className="size-4 group-hover:-translate-x-1 transition-transform" /> Back to Login
                </Link>
                <h1 className="text-3xl md:text-4xl font-heading font-black tracking-tighter text-white uppercase leading-none">
                  Create Account.
                </h1>
                <p className="text-white/40 font-heading text-[10px] uppercase tracking-[0.2em] font-black">
                  Fill in your details to get started.
                </p>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-white/60 font-heading text-[10px] uppercase tracking-[0.2em] font-black ml-1">Full Name</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-white/20" />
                              <Input placeholder="John Doe" {...field} className="h-14 pl-12 bg-white/5 border-white/5 rounded-xl border-2 font-bold focus-visible:ring-0 focus-visible:border-primary/40 text-white placeholder:text-white/10" />
                            </div>
                          </FormControl>
                          <FormMessage className="text-rose-500 text-[9px] font-black uppercase tracking-widest" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-white/60 font-heading text-[10px] uppercase tracking-[0.2em] font-black ml-1">Email</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-white/20" />
                              <Input placeholder="name@university.edu" {...field} className="h-14 pl-12 bg-white/5 border-white/5 rounded-xl border-2 font-bold focus-visible:ring-0 focus-visible:border-primary/40 text-white placeholder:text-white/10" />
                            </div>
                          </FormControl>
                          <FormMessage className="text-rose-500 text-[9px] font-black uppercase tracking-widest" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-white/60 font-heading text-[10px] uppercase tracking-[0.2em] font-black ml-1">Phone</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-white/20" />
                              <Input placeholder="+1 234 567 890" {...field} className="h-14 pl-12 bg-white/5 border-white/5 rounded-xl border-2 font-bold focus-visible:ring-0 focus-visible:border-primary/40 text-white placeholder:text-white/10" />
                            </div>
                          </FormControl>
                          <FormMessage className="text-rose-500 text-[9px] font-black uppercase tracking-widest" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-white/60 font-heading text-[10px] uppercase tracking-[0.2em] font-black ml-1">Account Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-14 bg-white/5 border-white/5 rounded-xl border-2 font-bold text-white transition-all focus:border-primary/40 focus:ring-0">
                                <SelectValue placeholder="Select Role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-neutral-900 border-white/10 rounded-xl">
                              <SelectItem value="STUDENT" className="font-heading uppercase text-[9px] font-black py-4">Student</SelectItem>
                              <SelectItem value="FACULTY" className="font-heading uppercase text-[9px] font-black py-4">Faculty</SelectItem>
                              <SelectItem value="LIBRARIAN" className="font-heading uppercase text-[9px] font-black py-4">Librarian</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-white/60 font-heading text-[10px] uppercase tracking-[0.2em] font-black ml-1">Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-white/20" />
                              <Input type="password" placeholder="••••••••" {...field} className="h-14 pl-12 bg-white/5 border-white/5 rounded-xl border-2 font-bold focus-visible:ring-0 focus-visible:border-primary/40 text-white" />
                            </div>
                          </FormControl>
                          <FormMessage className="text-rose-500 text-[9px] font-black uppercase tracking-widest" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-white/60 font-heading text-[10px] uppercase tracking-[0.2em] font-black ml-1">Confirm Key</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} className="h-14 bg-white/5 border-white/5 rounded-xl border-2 font-bold focus-visible:ring-0 focus-visible:border-primary/40 text-white" />
                          </FormControl>
                          <FormMessage className="text-rose-500 text-[9px] font-black uppercase tracking-widest" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" className="w-full h-16 text-lg font-heading font-black tracking-widest uppercase bg-primary hover:bg-primary/90 text-white border-none shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 rounded-xl group flex items-center justify-center gap-3 active:scale-95" disabled={isLoading}>
                    {isLoading ? (
                      <Loader2 className="size-6 animate-spin" />
                    ) : (
                      <>
                        Initialize Account <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </form>
              </Form>

              <div className="text-center pt-6 border-t border-white/5">
                <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">
                  Already registered?{" "}
                  <Link href="/login" className="text-primary hover:text-primary/80 transition-colors ml-1">Access Terminal</Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
