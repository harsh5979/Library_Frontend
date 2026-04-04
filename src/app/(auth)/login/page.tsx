"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2, Mail, Lock, Library, Eye, EyeOff } from "lucide-react";

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
import { useAuthStore } from "@/store/auth";
import api from "@/lib/api";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const { isAuthenticated, _hasHydrated } = useAuthStore();

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (mounted && _hasHydrated && isAuthenticated) router.push("/dashboard");
  }, [mounted, _hasHydrated, isAuthenticated, router]);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true);
    try {
      const response: any = await api.post("/auth/login", values);
      if (response.success) {
        const { accessToken, userId, fullName, email, role } = response.data;
        setAuth({ id: userId, fullName, email, role, isActive: true } as any, accessToken);
        toast.success(`Welcome back, ${fullName}`);
        router.push("/dashboard");
      } else {
        toast.error(response.message || "Invalid credentials.");
      }
    } catch (error: any) {
      toast.error(error.message || "Login failed.");
    } finally {
      setIsLoading(false);
    }
  }

  if (!mounted || !_hasHydrated || isAuthenticated) return null;

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="size-9 bg-white/20 rounded-xl flex items-center justify-center">
            <Library className="size-5 text-white" />
          </div>
          <span className="text-white font-heading font-bold text-xl">Omnishelf</span>
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-heading font-bold text-white leading-tight">
            Manage your library<br />with confidence.
          </h1>
          <p className="text-white/70 text-sm leading-relaxed max-w-sm">
            A modern library management system for students, faculty, and administrators.
          </p>
        </div>
        <p className="text-white/40 text-xs">© {new Date().getFullYear()} Omnishelf. All rights reserved.</p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 lg:hidden">
            <div className="size-9 bg-primary rounded-xl flex items-center justify-center">
              <Library className="size-5 text-white" />
            </div>
            <span className="font-heading font-bold text-xl text-foreground">Omnishelf</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-heading font-bold text-foreground">Sign in to your account</h2>
            <p className="text-muted-foreground text-sm">Enter your credentials to continue</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-foreground">Email address</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                          placeholder="you@university.edu"
                          {...field}
                          className="pl-10 h-11 bg-white border-border focus-visible:ring-primary/30"
                        />
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
                      <FormLabel className="text-sm font-medium text-foreground">Password</FormLabel>
                      <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          {...field}
                          className="pl-10 pr-10 h-11 bg-white border-border focus-visible:ring-primary/30"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-medium"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="size-4 animate-spin" /> : "Sign in"}
              </Button>
            </form>
          </Form>

          <div className="flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">or</span>
            <Separator className="flex-1" />
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-primary font-medium hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
