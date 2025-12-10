"use client";

import { useState, useEffect } from "react";
import { useUserStore } from "@/store/useUserStore";
import { supabase } from "@/lib/supabase";
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
    } else {
      setIsOpen(false);
    }
  }, [user, profile]);

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

      // 2. Claim Bonus (RPC)
      // Assuming rpc 'claim_signup_bonus' exists as per instructions.
      // If it fails (e.g. already claimed or doesn't exist), we log it but don't block the UI update if possible,
      // OR we treat it as part of the flow. Let's try to call it.
      const { error: rpcError } = await supabase.rpc("claim_signup_bonus");

      if (rpcError) {
        console.warn("Bonus claim failed:", rpcError);
        // We continue anyway, or maybe show a partial success message?
        // Prompt says "When they link... call RPC... show confetti".
        // Use discretion. If update succeeded, user has linked account.
      } else {
        toast.success("Bonus claimed! +10 Credits");
        // Fire confetti
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
        // Prevent closing if it's mandatory (force-open)
        // If profile loaded and no handle, keep it open unless we want to allow skipping?
        // Prompt says "Force-open". So we can return early or keep it true.
        // However, standard onOpenChange might be triggered by clicking outside.
        // We'll force it to stay true if condition is met.
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
