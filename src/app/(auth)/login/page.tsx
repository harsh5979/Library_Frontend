"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { 
  Loader2, 
  Mail, 
  Lock, 
  ArrowRight, 
  Library,
  ChevronLeft
} from "lucide-react";

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
import { useAuthStore } from "@/store/auth";
import api from "@/lib/api";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const { isAuthenticated, _hasHydrated } = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && _hasHydrated && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [mounted, _hasHydrated, isAuthenticated, router]);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true);
    try {
      const response: any = await api.post("/auth/login", values);
      
      if (response.success) {
        const { accessToken, userId, fullName, email, role } = response.data;
        
        const user = {
          id: userId,
          fullName,
          email,
          role,
          isActive: true,
          profileImage: `https://api.dicebear.com/7.x/initials/svg?seed=${email}`,
        };
        
        setAuth(user as any, accessToken);
        toast.success(`Welcome back, ${fullName}`);
        router.push("/dashboard");
      } else {
        toast.error(response.message || "Invalid credentials.");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || "Login failed.");
    } finally {
      setIsLoading(false);
    }
  }

  if (!mounted || !_hasHydrated || isAuthenticated) return null;

  return (
    <div className="relative min-h-screen flex items-center justify-center p-section overflow-hidden bg-black selection:bg-primary/30">
      {/* Background with subtle gradient */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,rgba(var(--primary),0.15),transparent_50%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.1),transparent_50%)]" />

      <div className="w-full max-w-[480px] z-10 space-y-10">
        <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-primary transition-colors font-heading text-[10px] uppercase font-black tracking-widest group">
          <ChevronLeft className="size-4 group-hover:-translate-x-1 transition-transform" /> Back to Home
        </Link>

        <div className="space-y-4">
          <div className="bg-primary/10 rounded-2xl w-fit p-4 text-primary ring-1 ring-primary/20">
            <Library className="size-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-heading font-black tracking-tighter text-white uppercase">
              Welcome Back.
            </h1>
            <p className="text-white/40 font-heading text-[10px] uppercase tracking-[0.2em] font-black">
              Sign in to manage your library assets.
            </p>
          </div>
        </div>

        <Card className="border-none bg-white/3 backdrop-blur-3xl shadow-2xl ring-1 ring-white/10 rounded-[2.5rem] overflow-hidden">
          <CardContent className="p-8 md:p-12 space-y-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-white/60 font-heading text-[10px] uppercase tracking-[0.2em] font-black ml-1">Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-5 top-1/2 -translate-y-1/2 size-5 text-white/20" />
                          <Input
                            placeholder="name@university.edu"
                            {...field}
                            className="bg-white/5 border-white/5 text-white placeholder:text-white/10 pl-14 h-14 rounded-xl border-2 focus-visible:ring-0 focus-visible:border-primary/40 transition-all font-sans font-bold"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-rose-500 text-[9px] font-black uppercase tracking-widest" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-white/60 font-heading text-[10px] uppercase tracking-[0.2em] font-black ml-1">Password</FormLabel>
                        <Link href="/forgot-password" hidden className="text-[9px] uppercase tracking-widest font-black text-primary/60 hover:text-primary transition-colors">
                            Forgot?
                        </Link>
                      </div>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-5 top-1/2 -translate-y-1/2 size-5 text-white/20" />
                          <Input
                            type="password"
                            placeholder="••••••••"
                            {...field}
                            className="bg-white/[0.03] border-white/5 text-white placeholder:text-white/10 pl-14 h-14 rounded-xl border-2 focus-visible:ring-0 focus-visible:border-primary/40 transition-all font-sans font-bold"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-rose-500 text-[9px] font-black uppercase tracking-widest" />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full h-16 text-lg font-heading font-black tracking-widest uppercase bg-primary hover:bg-primary/90 text-white border-none shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 rounded-xl group"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="size-6 animate-spin" />
                  ) : (
                    <span className="flex items-center gap-2">
                      Sign In <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </Button>
              </form>
            </Form>

            <div className="text-center pt-6 border-t border-white/5">
                <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">
                    Don&apos;t have an account? <br className="sm:hidden" />
                    <Link href="/register" className="text-primary hover:text-primary/80 transition-colors ml-1">Create Account</Link>
                </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
