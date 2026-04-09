"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Loader2, 
  ShieldCheck,
  Library
} from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";

export default function VerifyEmailPage() {
  const { token } = useParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response: any = await api.get(`/auth/verify-email/${token}`);
        if (response.success) {
          setStatus("success");
          setMessage(response.message || "Archive data verified and synchronized.");
          toast.success("Identity Verified!", {
            description: "Member node is now active in the library protocol.",
          });
        } else {
          setStatus("error");
          setMessage(response.message || "Protocol reject. Invalid or expired token.");
        }
      } catch (error: any) {
        setStatus("error");
        setMessage(error.message || "System synchronization failed.");
      }
    };

    if (token) verifyToken();
  }, [token]);

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden bg-black selection:bg-primary/30">
      {/* Background with Grid and Glow */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/bg.png" 
          alt="Core Archives" 
          fill 
          className="object-cover opacity-20 blur-[2px]" 
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/90 to-blue-900/40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--primary-color)_0%,transparent_70%)] opacity-10 animate-pulse" />
      </div>

      <div className="w-full max-w-xl z-10 space-y-8 animate-in fade-in slide-in-from-bottom-12 duration-1000">
        <div className="text-center space-y-6">
           <Link href="/" className="inline-flex items-center gap-4 group">
            <div className="bg-primary/20 backdrop-blur-xl rounded-2xl p-4 text-primary shadow-2xl group-hover:scale-110 transition-transform duration-500 border border-primary/40">
              <Library className="size-10" />
            </div>
          </Link>
          <div className="space-y-2">
            <h1 className="text-4xl font-heading font-black tracking-tighter text-white uppercase drop-shadow-2xl">
                Identity Verification.
            </h1>
            <p className="text-white/40 font-heading text-[10px] uppercase tracking-[0.4em] font-black">
                Validating Node Access Link
            </p>
          </div>
        </div>

        <div className="relative group p-10 lg:p-14 bg-white/5 backdrop-blur-3xl shadow-2xl ring-1 ring-white/10 rounded-[3rem] border-none overflow-hidden text-center">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-40 group-hover:opacity-100 transition-opacity" />
          
          <div className="space-y-10 py-4">
            {status === "loading" && (
                <div className="flex flex-col items-center gap-6 py-8">
                    <Loader2 className="size-20 text-primary animate-spin" />
                    <p className="text-lg font-black tracking-widest text-primary/60 uppercase animate-pulse">Synchronizing Data...</p>
                </div>
            )}

            {status === "success" && (
                <div className="space-y-8 py-4">
                    <div className="flex justify-center">
                        <div className="size-32 bg-primary/20 rounded-full flex items-center justify-center border-4 border-primary/40 animate-in zoom-in duration-500">
                            <CheckCircle2 className="size-16 text-primary" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Protocol Accepted</h2>
                        <p className="text-white/40 text-sm font-medium leading-relaxed max-w-xs mx-auto italic">{message}</p>
                    </div>
                    <Link href="/login" className="block w-full">
                        <Button className="w-full h-16 text-xs font-heading font-black tracking-widest uppercase bg-primary hover:bg-primary/90 text-white rounded-2xl group border-none shadow-2xl shadow-primary/20 hover:shadow-primary/40 transition-all">
                             Enter Identity Portal <ArrowRight className="ml-4 size-4 group-hover:translate-x-2 transition-transform" />
                        </Button>
                    </Link>
                </div>
            )}

            {status === "error" && (
                <div className="space-y-8 py-4">
                    <div className="flex justify-center">
                        <div className="size-32 bg-rose-500/10 rounded-full flex items-center justify-center border-4 border-rose-500/20 animate-in zoom-in duration-500">
                            <XCircle className="size-16 text-rose-500" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Protocol Error</h2>
                        <p className="text-rose-500/60 text-sm font-black uppercase tracking-widest">{message}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4">
                        <Link href="/register">
                            <Button variant="outline" className="w-full h-14 rounded-xl border-white/5 bg-transparent font-heading font-black text-[10px] uppercase tracking-widest text-white hover:bg-white/5 border-2">Re-registration</Button>
                        </Link>
                        <Link href="/support">
                            <Button variant="outline" className="w-full h-14 rounded-xl border-white/5 bg-transparent font-heading font-black text-[10px] uppercase tracking-widest text-white hover:bg-white/5 border-2">Contact Support</Button>
                        </Link>
                    </div>
                </div>
            )}
          </div>
        </div>

        <div className="text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 flex items-center justify-center gap-3">
                <ShieldCheck className="size-4 text-primary" /> Multi-Layer Identity Validation Active
            </p>
        </div>
      </div>
    </div>
  );
}
