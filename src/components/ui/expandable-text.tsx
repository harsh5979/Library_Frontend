"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ExpandableTextProps {
  text: string;
  limit?: number;
  className?: string;
  buttonClassName?: string;
}

export function ExpandableText({ 
  text, 
  limit = 150, 
  className,
  buttonClassName 
}: ExpandableTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (text.length <= limit) {
    return <p className={cn("text-sm text-muted-foreground leading-relaxed", className)}>{text}</p>;
  }

  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-sm text-muted-foreground leading-relaxed transition-all duration-300">
        {isExpanded ? text : `${text.slice(0, limit)}...`}
      </p>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "h-auto p-0 text-primary font-bold hover:bg-transparent hover:text-primary/80 transition-all text-xs uppercase tracking-widest gap-1 group",
          buttonClassName
        )}
      >
        {isExpanded ? (
          <>
            Show Less <ChevronUp className="size-3 transition-transform group-hover:-translate-y-0.5" />
          </>
        ) : (
          <>
            Read More <ChevronDown className="size-3 transition-transform group-hover:translate-y-0.5" />
          </>
        )}
      </Button>
    </div>
  );
}
