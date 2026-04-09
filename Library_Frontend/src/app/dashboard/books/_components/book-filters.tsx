"use client";

import { useTransition, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X, LayoutGrid } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function BookFilters({ initialQuery, initialCategory }: { initialQuery: string, initialCategory: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const [query, setQuery] = useState(initialQuery);
    const [category, setCategory] = useState(initialCategory);

    const categories = ["Technology", "Fiction", "History", "Science", "Biography", "Business"];

    // Sync state with props when they change (handled by Next.js navigation)
    if (initialQuery !== query && !isPending && query === "") setQuery(initialQuery);
    if (initialCategory !== category && !isPending && category === "") setCategory(initialCategory);

    const handleSearch = (q: string) => {
        const params = new URLSearchParams(searchParams);
        if (q) {
            params.set("q", q);
        } else {
            params.delete("q");
        }
        startTransition(() => {
            router.push(`/dashboard/books?${params.toString()}`);
        });
    };

    const handleCategory = (c: string) => {
        const params = new URLSearchParams(searchParams);
        if (c) {
            params.set("category", c);
        } else {
            params.delete("category");
        }
        startTransition(() => {
            router.push(`/dashboard/books?${params.toString()}`);
        });
    };

    return (
        <div className="flex flex-col gap-6 group">
            <div className="flex items-center gap-4">
                <div className="relative flex-1 group/search">
                    <Search className={cn(
                        "absolute left-4 top-1/2 -translate-y-1/2 size-5 transition-colors",
                        isPending ? "text-primary animate-pulse" : "text-muted-foreground group-focus-within/search:text-primary"
                    )} />
                    <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch(query)}
                        placeholder="Search by title, author..."
                        className="bg-card/30 border-border/40 hover:border-primary/30 focus-visible:ring-primary/10 h-12 pl-12 pr-10 rounded-xl font-sans tracking-wide transition-all shadow-lg hover:shadow-primary/5"
                    />
                    {query && (
                        <button 
                          onClick={() => { setQuery(""); handleSearch(""); }}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            <X className="size-4" />
                        </button>
                    )}
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="secondary" className="h-12 w-12 rounded-xl bg-card/30 border border-border/40 hover:bg-secondary hover:text-foreground transition-all">
                            <SlidersHorizontal className="size-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 mt-2 rounded-2xl border-border/40 bg-background/80 backdrop-blur-2xl p-2">
                        <DropdownMenuLabel className="font-heading px-4 py-3 uppercase tracking-widest text-xs">Filter Categories</DropdownMenuLabel>
                        <DropdownMenuSeparator className="opacity-40" />
                        <DropdownMenuItem 
                            onClick={() => handleCategory("")}
                            className={cn("px-4 py-3 cursor-pointer rounded-lg m-1 gap-3", !category && "bg-primary/10 text-primary font-bold")}
                        >
                            <LayoutGrid className="size-4" /> All Books
                        </DropdownMenuItem>
                        {categories.map((c) => (
                            <DropdownMenuItem 
                                key={c}
                                onClick={() => handleCategory(c)}
                                className={cn("px-4 py-3 cursor-pointer rounded-lg m-1 gap-3 font-medium", category === c && "bg-primary/10 text-primary font-bold")}
                            >
                                {c}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            
            <div className="flex flex-wrap gap-2">
                {category && (
                    <Badge className="bg-primary/10 text-primary border-primary/20 px-3 py-1.5 rounded-full flex items-center gap-2 font-heading text-[10px] tracking-widest uppercase">
                        {category}
                        <X 
                          className="size-3 cursor-pointer hover:text-foreground transition-colors" 
                          onClick={() => handleCategory("")} 
                        />
                    </Badge>
                )}
            </div>
        </div>
    );
}
