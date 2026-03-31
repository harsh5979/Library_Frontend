"use client";

import { motion } from "framer-motion";
import { Zap, BookOpen, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookCard } from "@/components/books/BookCard";

interface TrendingSectionProps {
  books: any[];
}

export function TrendingSection({ books }: TrendingSectionProps) {
  return (
    <section className="bg-primary/5 py-16 md:py-32 overflow-hidden relative border-y border-white/5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--primary),0.05)_0%,transparent_70%)]" />
      <div className="container px-section mx-auto space-y-16 relative">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full bg-primary/20 text-primary text-[9px] font-black uppercase tracking-[0.4em]">
              <Zap className="size-4 animate-bounce" />
              <span>Current Demand Level</span>
            </div>
            <h2 className="text-4xl md:text-7xl font-heading font-black uppercase tracking-tighter">Most Popular.</h2>
            <p className="text-white/40 font-heading text-[10px] uppercase tracking-[0.2em] font-black flex items-center gap-3">
              <BookOpen className="size-5 text-primary" /> 
              REAL-TIME TRENDS COMPILED FROM ALL BRANCHES
            </p>
          </motion.div>
          <Button variant="ghost" className="group font-heading font-black text-xs tracking-widest uppercase hover:text-primary h-14 rounded-2xl ring-1 ring-white/5 hover:ring-primary/20 transition-all">
            Predictive Trends <ChevronRight className="ml-3 size-5 transition-transform group-hover:translate-x-2" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {books.slice(0, 4).map((book, i) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <BookCard book={book} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
