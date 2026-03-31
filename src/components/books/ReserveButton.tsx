"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookMarked, MapPin, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9090/api";

export function ReserveButton({ book, availability }: { book: any; availability: any }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const hasBranches = availability?.branches?.length > 0;
  // allow reserving only if branch has availableCopies > 0
  const availableBranches = hasBranches 
    ? availability.branches.filter((b: any) => b.availableCopies > 0)
    : [];

  const handleReserve = async () => {
    if (!selectedBranch) {
      setError("Please select a library branch.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to reserve a book.");
        setIsLoading(false);
        return;
      }

      const res = await fetch(`${API_BASE_URL}/reservations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookId: book.id,
          branchId: Number(selectedBranch),
          notes: notes,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          setOpen(false);
          router.push("/dashboard/reservations");
        }, 2000);
      } else {
        setError(data.message || "Failed to make reservation.");
      }
    } catch (err: any) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className="w-full h-16 rounded-2xl text-lg font-heading font-black tracking-[0.2em] uppercase shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all gap-4"
          aria-label={`Reserve ${book.title}`}
        >
          Reserve Now <BookMarked className="size-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-[2rem] bg-card border-border/40 p-6 sm:p-8 outline-none">
        {success ? (
           <div className="flex flex-col items-center justify-center p-8 space-y-4 text-center">
             <div className="size-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4 text-emerald-500">
               <CheckCircle2 className="size-8" />
             </div>
             <DialogTitle className="font-heading font-black tracking-widest uppercase text-xl text-emerald-500 text-center">
                Success!
             </DialogTitle>
             <p className="text-sm font-sans text-muted-foreground">
                Your reservation has been confirmed. You will be redirected shortly.
             </p>
           </div>
        ) : (
          <>
            <DialogHeader className="text-left space-y-3 relative pb-4 border-b border-border/40">
              <DialogTitle className="font-heading font-black tracking-widest uppercase text-lg sm:text-xl pr-6 leading-tight">
                Reserve Book
              </DialogTitle>
              <DialogDescription className="font-sans text-sm text-muted-foreground pr-4">
                Choose a library branch to pick up <span className="text-foreground font-semibold">"{book.title}"</span>.
              </DialogDescription>
            </DialogHeader>
    
            <div className="space-y-6 pt-4">
              {availableBranches.length > 0 ? (
                 <div className="space-y-4">
                    <Label className="text-xs font-black tracking-widest uppercase text-muted-foreground opacity-70">
                       Select Pickup Location
                    </Label>
                    <RadioGroup value={selectedBranch} onValueChange={setSelectedBranch} className="gap-3">
                      {availableBranches.map((branch: any) => (
                         <div 
                           key={branch.branchId} 
                           className={`flex items-start space-x-3 bg-secondary/30 border ${selectedBranch === branch.branchId.toString() ? 'border-primary' : 'border-border/40'} p-4 rounded-xl cursor-pointer hover:bg-secondary/50 transition-colors`}
                           onClick={() => setSelectedBranch(branch.branchId.toString())}
                         >
                            <RadioGroupItem value={branch.branchId.toString()} id={`branch-${branch.branchId}`} className="mt-1" />
                            <div className="flex-1 space-y-1">
                               <Label htmlFor={`branch-${branch.branchId}`} className="font-heading font-black tracking-widest uppercase text-sm cursor-pointer block">{branch.branchName}</Label>
                               <p className="text-[10px] text-muted-foreground font-sans">{branch.availableCopies} available at this location</p>
                            </div>
                         </div>
                      ))}
                    </RadioGroup>
                 </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center space-y-3 bg-destructive/5 rounded-xl border border-destructive/20 text-destructive">
                   <MapPin className="size-8 opacity-80" />
                   <div className="space-y-1">
                      <p className="font-heading font-black tracking-widest text-[11px] uppercase opacity-90">No Availability</p>
                      <p className="text-xs font-sans opacity-75">There are no copies available for reservation across any branches currently.</p>
                   </div>
                </div>
              )}

              {availableBranches.length > 0 && (
                 <div className="space-y-3">
                    <Label htmlFor="notes" className="text-xs font-black tracking-widest uppercase text-muted-foreground opacity-70">
                       Additional Notes (Optional)
                    </Label>
                    <Textarea 
                       id="notes"
                       placeholder="E.g., I'll pick it up on Wednesday morning."
                       value={notes}
                       onChange={(e) => setNotes(e.target.value)}
                       className="resize-none h-20 bg-secondary/30 border-border/40 focus-visible:ring-primary rounded-xl text-sm"
                    />
                 </div>
              )}
    
              {error && (
                <p className="text-xs text-destructive font-medium bg-destructive/10 p-3 rounded-lg border border-destructive/20">{error}</p>
              )}
    
              <div className="pt-2">
                 <Button 
                    className="w-full h-14 rounded-xl text-sm font-heading font-black tracking-[0.2em] uppercase" 
                    onClick={handleReserve}
                    disabled={isLoading || availableBranches.length === 0}
                 >
                    {isLoading ? <Loader2 className="size-4 animate-spin" /> : "Confirm Reservation"}
                 </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
