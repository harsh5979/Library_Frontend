"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookCard } from "@/components/books/BookCard";

interface BookShelfProps {
  title: string;
  subtitle: string;
  books: any[];
  icon: React.ReactNode;
}

export function BookShelf({ title, subtitle, books, icon }: BookShelfProps) {
  return (
    <section className="container px-section mx-auto space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/5 pb-8 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-6">
            <div className="size-14 rounded-2xl bg-white/5 backdrop-blur-3xl flex items-center justify-center ring-1 ring-white/10 shadow-2xl transition-transform hover:scale-110">
              {icon}
            </div>
            <h2 className="text-3xl md:text-5xl font-heading font-black uppercase tracking-tighter text-white">{title}</h2>
          </div>
          <p className="text-white/40 font-heading text-[10px] uppercase tracking-[0.2em] font-black md:pl-20">{subtitle}</p>
        </div>
        <Button variant="ghost" className="group text-primary hover:bg-primary/10 h-12 px-6 rounded-xl font-heading font-black uppercase text-[10px] tracking-widest transition-all duration-500 ring-1 ring-primary/5">
          Sync All Assets <ChevronRight className="ml-2 size-4 transition-transform group-hover:translate-x-2" />
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {books.map((book, i) => (
          <motion.div
            key={book.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <BookCard book={book} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
