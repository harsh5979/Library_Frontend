import Link from "next/link";
import { ChevronLeft, Library } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary/30 relative overflow-hidden flex flex-col">
      {/* Auth Navbar */}
      <nav className="h-20 flex items-center justify-between px-6 lg:px-12 relative z-50">
        <Link href="/" className="flex items-center gap-3 transition-transform hover:scale-105 group">
          <div className="bg-primary rounded-xl p-2 text-primary-foreground shadow-lg shadow-primary/20">
            <Library className="size-6" />
          </div>
          <span className="text-2xl font-heading font-black tracking-tighter uppercase text-white">Omnishelf.</span>
        </Link>
        <Link href="/">
          <Button variant="ghost" className="rounded-full gap-2 font-heading text-[10px] uppercase font-black tracking-widest hover:bg-white/5 border border-white/10">
            <ChevronLeft className="size-4" /> Exit to Nexus
          </Button>
        </Link>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-6 py-12">
        {children}
      </main>

      {/* Decorative background for auth */}
      <div className="absolute top-[-10%] left-[-10%] size-[500px] bg-primary/10 rounded-full blur-[150px] pointer-events-none opacity-50" />
      <div className="absolute bottom-[-10%] right-[-10%] size-[500px] bg-blue-500/10 rounded-full blur-[150px] pointer-events-none opacity-50" />
    </div>
  );
}
