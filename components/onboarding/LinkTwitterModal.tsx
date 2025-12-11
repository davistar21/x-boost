"use client";

import { useState, useEffect } from "react";
import { useUserStore } from "@/store/useUserStore";
import { supabase } from "@/lib/supabase/client";
import { useGamificationStore } from "@/store/useGamificationStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { Twitter } from "lucide-react";

export function LinkTwitterModal() {
  const { user, profile, setProfile } = useUserStore();
  const [isOpen, setIsOpen] = useState(false);
  const [handle, setHandle] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Open only if user is logged in, profile loaded, and no twitter handle
    if (user && profile && !profile.twitter_handle) {
      setIsOpen(true);
    }
  }, [user, profile]);

  useEffect(() => {
    const handleOpenEvent = () => setIsOpen(true);
    window.addEventListener("open-link-modal", handleOpenEvent);
    return () => window.removeEventListener("open-link-modal", handleOpenEvent);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    const trimmedHandle = handle.trim();
    if (!trimmedHandle.startsWith("@")) {
      toast.error("Handle must start with @");
      setLoading(false);
      return;
    }
    if (trimmedHandle.includes(" ")) {
      toast.error("Handle cannot contain spaces");
      setLoading(false);
      return;
    }

    try {
      // 1. Update Profile
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ twitter_handle: trimmedHandle })
        .eq("id", user?.id);

      if (updateError) throw updateError;

      // 2. Claim Bonus (Centralized Store Logic)
      const { claimSignupBonus } = useGamificationStore.getState();
      const bonusSuccess = await claimSignupBonus();

      if (bonusSuccess) {
        toast.success("Bonus claimed! +10 Credits");
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }

      // Update local store manually to reflect change immediately without refetch
      if (profile) {
        setProfile({
          ...profile,
          twitter_handle: trimmedHandle,
          // optimistically update credits if we assume bonus worked,
          // but fetching fresh profile is safer.
        });
        // Refetch to get updated credits and handle
        useUserStore.getState().fetchProfile(user!.id);
      }

      toast.success("X Account linked successfully!");
      setIsOpen(false);
    } catch (error: any) {
      console.error("Link error:", error);
      toast.error(error.message || "Failed to link account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        // STRICT MODE: If user is logged in but has no twitter handle,
        // DO NOT allow closing the modal.
        if (user && profile && !profile.twitter_handle) {
          setIsOpen(true);
        } else {
          setIsOpen(open);
        }
      }}
    >
      <DialogContent
        className="sm:max-w-[425px]"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        {/* Prevent closing by clicking outside or escape key for "Force-open" behavior */}
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Twitter className="h-5 w-5 text-blue-400" />
            Link your X Account
          </DialogTitle>
          <DialogDescription>
            To start earning and boosting, we need your X (Twitter) handle for
            verification.
            <br />
            <span className="text-green-600 font-medium">
              Link now for +10 Free Credits!
            </span>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="handle">X Handle</Label>
            <Input
              id="handle"
              placeholder="@username"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          <DialogFooter>
            {/* No cancel button since it's forced */}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Linking..." : "Link Account & Claim Bonus"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
