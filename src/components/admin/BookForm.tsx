"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, BookOpen, Layers, Image as ImageIcon, AlignLeft, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Book } from "@/types/book";

const bookSchema = z.object({
  title: z.string().min(2, "Title is mandatory for the protocol"),
  author: z.string().min(2, "Author identifier required"),
  isbn: z.string().min(10, "ISBN must be at least 10 characters"),
  publisher: z.string().optional(),
  edition: z.string().optional(),
  year: z.coerce.number().min(1000).max(new Date().getFullYear() + 1).optional(),
  category: z.string().min(1, "Asset classification required"),
  subject: z.string().optional(),
  description: z.string().optional(),
  coverImageUrl: z.string().url("Invalid protocol URL").or(z.literal("")).optional(),
  language: z.string().default("English"),
  totalPages: z.coerce.number().min(1).optional(),
  totalCopies: z.coerce.number().min(1, "Minimum 1 unit required in inventory"),
});

interface BookFormProps {
  initialData?: Partial<Book>;
  onSubmit: (data: z.infer<typeof bookSchema>) => Promise<void>;
  isLoading?: boolean;
}

export function BookForm({ initialData, onSubmit, isLoading }: BookFormProps) {
  const form = useForm<z.infer<typeof bookSchema>>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: initialData?.title || "",
      author: initialData?.author || "",
      isbn: initialData?.isbn || "",
      publisher: initialData?.publisher || "",
      edition: initialData?.edition || "",
      year: initialData?.year || new Date().getFullYear(),
      category: initialData?.category || "",
      subject: initialData?.subject || "",
      description: initialData?.description || "",
      coverImageUrl: initialData?.coverImageUrl || "",
      language: initialData?.language || "English",
      totalPages: initialData?.totalPages || 0,
      totalCopies: initialData?.totalCopies || 1,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Main Identifier Section */}
          <div className="space-y-6 sm:space-y-8 p-6 sm:p-10 rounded-3xl sm:rounded-[2rem] bg-secondary/20 border border-white/5 shadow-2xl">
             <div className="flex items-center gap-4 mb-2">
                <BookOpen className="text-primary size-5" />
                <h3 className="font-heading font-black uppercase text-xs tracking-[0.3em]">Core Identification</h3>
             </div>
             
             <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                <FormItem className="space-y-3">
                    <FormLabel className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Asset Title</FormLabel>
                    <FormControl>
                    <Input placeholder="DESIGN PATTERNS" {...field} className="h-14 bg-background border-2 font-bold rounded-xl focus-visible:ring-0 focus-visible:border-primary/40" />
                    </FormControl>
                    <FormMessage className="text-[9px] font-black uppercase tracking-widest pl-1" />
                </FormItem>
                )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <FormField
                    control={form.control}
                    name="author"
                    render={({ field }) => (
                    <FormItem className="space-y-3">
                        <FormLabel className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Primary Author</FormLabel>
                        <FormControl>
                        <Input placeholder="GAMMA ET AL" {...field} className="h-14 bg-background border-2 font-bold rounded-xl focus-visible:ring-0 focus-visible:border-primary/40" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="isbn"
                    render={({ field }) => (
                    <FormItem className="space-y-3">
                        <FormLabel className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">ISBN Protocol</FormLabel>
                        <FormControl>
                        <Input placeholder="978-0..." {...field} className="h-14 bg-background border-2 font-bold rounded-xl focus-visible:ring-0 focus-visible:border-primary/40" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                    <FormItem className="space-y-3">
                        <FormLabel className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Asset Class</FormLabel>
                        <FormControl>
                        <Input placeholder="COMPUTER SCIENCE" {...field} className="h-14 bg-background border-2 font-bold rounded-xl focus-visible:ring-0 focus-visible:border-primary/40" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                    <FormItem className="space-y-3">
                        <FormLabel className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Academic Subject</FormLabel>
                        <FormControl>
                        <Input placeholder="SOFTWARE ENG" {...field} className="h-14 bg-background border-2 font-bold rounded-xl focus-visible:ring-0 focus-visible:border-primary/40" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>
          </div>

          {/* Cataloging & Specifications */}
          <div className="space-y-6 sm:space-y-8 p-6 sm:p-10 rounded-3xl sm:rounded-[2rem] bg-secondary/20 border border-white/5 shadow-2xl">
            <div className="flex items-center gap-4 mb-2">
                <Layers className="text-primary size-5" />
                <h3 className="font-heading font-black uppercase text-xs tracking-[0.3em]">Technical Specification</h3>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <FormField
                    control={form.control}
                    name="publisher"
                    render={({ field }) => (
                    <FormItem className="space-y-3">
                        <FormLabel className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Publisher</FormLabel>
                        <FormControl>
                        <Input placeholder="PEARSON NODES" {...field} className="h-14 bg-background border-2 font-bold rounded-xl focus-visible:ring-0 focus-visible:border-primary/40" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="edition"
                    render={({ field }) => (
                    <FormItem className="space-y-3">
                        <FormLabel className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Asset Edition</FormLabel>
                        <FormControl>
                        <Input placeholder="1ST EDITION" {...field} className="h-14 bg-background border-2 font-bold rounded-xl focus-visible:ring-0 focus-visible:border-primary/40" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                    <FormItem className="space-y-3">
                        <FormLabel className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Release Year</FormLabel>
                        <FormControl>
                        <Input type="number" {...field} className="h-14 bg-background border-2 font-bold rounded-xl focus-visible:ring-0 focus-visible:border-primary/40" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="language"
                    render={({ field }) => (
                    <FormItem className="space-y-3">
                        <FormLabel className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Primary Lang</FormLabel>
                        <FormControl>
                        <Input placeholder="ENGLISH" {...field} className="h-14 bg-background border-2 font-bold rounded-xl focus-visible:ring-0 focus-visible:border-primary/40" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <FormField
                    control={form.control}
                    name="totalPages"
                    render={({ field }) => (
                    <FormItem className="space-y-3">
                        <FormLabel className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Total Blocks</FormLabel>
                        <FormControl>
                        <Input type="number" placeholder="000" {...field} className="h-14 bg-background border-2 font-bold rounded-xl focus-visible:ring-0 focus-visible:border-primary/40" />
                        </FormControl>
                        <FormDescription className="text-[7px] uppercase tracking-widest ml-1">Total Page Count</FormDescription>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="totalCopies"
                    render={({ field }) => (
                    <FormItem className="space-y-3">
                        <FormLabel className="text-primary font-black uppercase text-[10px] tracking-widest ml-1">System Units</FormLabel>
                        <FormControl>
                        <Input type="number" {...field} className="h-14 bg-background border-2 border-primary/20 font-black text-primary rounded-xl focus-visible:ring-0 focus-visible:border-primary" />
                        </FormControl>
                        <FormDescription className="text-[7px] uppercase tracking-widest ml-1">Physical Units in Stock</FormDescription>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>
          </div>
        </div>

        {/* Metadata & Visual Section */}
        <div className="space-y-6 sm:space-y-8 p-6 sm:p-10 rounded-3xl sm:rounded-[2rem] bg-card border border-white/5 shadow-2xl">
          <div className="flex items-center gap-4 mb-2">
              <Info className="text-primary size-5" />
              <h3 className="font-heading font-black uppercase text-xs tracking-[0.3em]">Meta Contextual Data</h3>
          </div>

          <FormField
            control={form.control}
            name="coverImageUrl"
            render={({ field }) => (
            <FormItem className="space-y-3">
                <FormLabel className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Cover Protocol URL</FormLabel>
                <FormControl>
                <div className="relative group/field">
                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/30 group-focus-within/field:text-primary transition-colors" />
                    <Input placeholder="HTTPS://ASSETS.OMNISHELF.PROTOCOL/IMAGE.JPG" {...field} className="h-16 pl-12 bg-background border-2 font-bold rounded-xl focus-visible:ring-0 focus-visible:border-primary/40" />
                </div>
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
            <FormItem className="space-y-3">
                <FormLabel className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Asset Abstract</FormLabel>
                <FormControl>
                <div className="relative group/field">
                    <AlignLeft className="absolute left-4 top-6 size-4 text-muted-foreground/30 group-focus-within/field:text-primary transition-colors" />
                    <Textarea placeholder="PROVIDE SYNOPSIS FOR THE ARCHIVE PROTOCOL..." {...field} className="min-h-[200px] pl-12 pt-6 bg-background border-2 font-medium rounded-2xl focus-visible:ring-0 focus-visible:border-primary/40 resize-none leading-relaxed" />
                </div>
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
          />
        </div>

        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full h-16 sm:h-24 text-lg sm:text-2xl font-heading font-black tracking-[0.2em] sm:tracking-[0.4em] uppercase bg-primary hover:bg-primary/90 text-white rounded-2xl shadow-2xl shadow-primary/20 hover:shadow-primary/40 transition-all group flex items-center justify-center gap-6 active:scale-[0.98]"
        >
          {isLoading ? (
            <Loader2 className="size-8 animate-spin" />
          ) : (
            <>
              {initialData ? "Synchronize Update" : "Finalize Indexing"}
              <div className="h-[2px] w-12 bg-white/40 group-hover:w-20 transition-all rounded-full" />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
