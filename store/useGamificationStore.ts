import { create } from "zustand";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Coins } from "lucide-react";
import { useUserStore } from "./useUserStore";

interface GamificationState {
  isClaiming: boolean;
  claimEngagement: (postId: string) => Promise<boolean>;
  claimSignupBonus: () => Promise<boolean>;
}

export const useGamificationStore = create<GamificationState>((set) => ({
  isClaiming: false,

  claimEngagement: async (postId: string) => {
    const { user, fetchProfile } = useUserStore.getState();
    if (!user) {
      toast.error("You must be logged in.");
      return false;
    }

    set({ isClaiming: true });
    try {
      const { error } = await supabase.rpc("claim_engagement_credit", {
        post_id_input: postId,
      });

      if (error) {
        // Handle "already claimed" specifically if needed
        if (error.message.includes("already claimed")) {
          toast.info("You've already claimed credits for this post.");
          return false;
        }
        throw error;
      }

      await fetchProfile(user.id);
      return true;
    } catch (error: any) {
      console.error("Claim error:", error);
      toast.error(error.message || "Failed to claim credits.");
      return false;
    } finally {
      set({ isClaiming: false });
    }
  },

  claimSignupBonus: async () => {
    const { user, fetchProfile } = useUserStore.getState();
    if (!user) return false;

    set({ isClaiming: true });
    try {
      // Idempotency check: backend should handle it, but UI can also check transaction history if needed.
      // Relying on RPC safety.
      const { error } = await supabase.rpc("claim_signup_bonus");

      if (error) {
        console.warn("Signup bonus logic:", error);
        // If error is "already claimed", we treat as success-ish or ignore
        return false;
      }

      await fetchProfile(user.id);
      return true;
    } catch (error) {
      console.error("Bonus claim error:", error);
      return false;
    } finally {
      set({ isClaiming: false });
    }
  },
}));
