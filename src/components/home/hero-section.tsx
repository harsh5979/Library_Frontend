"use client";

import { motion } from "framer-motion";
import { Sparkles, ChevronRight, Search, Users, BookOpen, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative pt-20 lg:pt-32 min-h-[70vh] flex items-center overflow-hidden">
      <div className="container px-section mx-auto grid lg:grid-cols-2 gap-lg items-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/5 backdrop-blur-3xl text-primary text-[10px] font-black uppercase tracking-[0.3em] ring-1 ring-white/10 hover:bg-white/10 transition-all cursor-default">
            <Sparkles className="size-4 animate-spin-slow" />
            <span>Indexing 1,000,000+ Asset Nodes</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-black tracking-tighter leading-[0.9] uppercase">
            Your Gateway to <br />
            <span className="text-primary italic">Absolute</span> Wisdom.
          </h1>
          
          <p className="text-lg md:text-xl text-white/40 max-w-xl leading-relaxed font-medium">
            Synchronize, retrieve, and govern your intellectual journey with the next-generation library proxy. Scalable, intuitive, and state-of-the-art.
          </p>
          
          <div className="flex flex-wrap gap-4 pt-4">
            <Button size="lg" asChild className="h-16 px-10 text-lg font-heading font-black uppercase tracking-widest bg-primary hover:bg-primary/90 shadow-2xl shadow-primary/20 hover:shadow-primary/40 rounded-2xl transition-all duration-500 group">
              <Link href="/dashboard" className="gap-3 flex items-center">
                Access Portal <ChevronRight className="size-5 group-hover:translate-x-2 transition-transform" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="h-16 px-10 text-lg font-heading font-black uppercase tracking-widest bg-white/5 backdrop-blur-xl border-2 border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300 group">
              <Search className="size-5 mr-3 text-white/40 group-hover:text-primary transition-colors" />
              Deep Scan
            </Button>
          </div>
          
          <div className="flex items-center gap-10 pt-10 border-t border-white/5">
            {[
              { label: "Members", value: "50K+", icon: Users },
              { label: "Resources", value: "120K+", icon: BookOpen },
              { label: "Nodes", value: "24/7", icon: Zap }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col">
                <span className="text-3xl font-heading font-black tracking-tighter text-white">{stat.value}</span>
                <span className="text-[9px] text-white/40 uppercase tracking-[0.4em] font-black mt-1">{stat.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="hidden lg:grid grid-cols-2 gap-6 relative"
        >
          <div className="space-y-6 pt-12">
            <div className="relative group overflow-hidden rounded-[2.5rem] shadow-2xl ring-1 ring-white/10">
              <Image 
                src="https://images.unsplash.com/photo-1544648151-5153e74b374d?auto=format&fit=crop&q=80&w=400&h=600" 
                width={400}
                height={600}
                className="w-full h-auto object-cover group-hover:scale-110 grayscale hover:grayscale-0 transition-all duration-1000" 
                alt="Asset A1"
                priority={true}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="relative group overflow-hidden rounded-[2.5rem] shadow-2xl ring-1 ring-white/10">
              <Image 
                src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=400&h=300" 
                width={400}
                height={300}
                className="w-full h-auto object-cover group-hover:scale-110 grayscale hover:grayscale-0 transition-all duration-1000" 
                alt="Core Grid"
                priority={true}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
          <div className="space-y-6">
            <div className="relative group overflow-hidden rounded-[2.5rem] shadow-2xl ring-1 ring-white/10">
              <Image 
                src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=400&h=300" 
                width={400}
                height={300}
                className="w-full h-auto object-cover group-hover:scale-110 grayscale hover:grayscale-0 transition-all duration-1000" 
                alt="Registry"
                priority={true}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="relative group overflow-hidden rounded-[2.5rem] shadow-2xl ring-1 ring-white/10">
              <Image 
                src="https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=400&h=550" 
                width={400}
                height={550}
                className="w-full h-auto object-cover group-hover:scale-110 grayscale hover:grayscale-0 transition-all duration-1000" 
                alt="Classics Unit"
                priority={true}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Background Blobs */}
      <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-primary/20 rounded-full blur-[120px] opacity-20 -translate-y-1/2 translate-x-1/3 animate-pulse" />
      <div className="absolute top-1/2 left-0 -z-10 w-80 h-80 bg-blue-600/10 rounded-full blur-[150px] opacity-10 -translate-x-1/2" />
    </section>
  );
}
