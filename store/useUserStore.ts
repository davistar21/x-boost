import { create } from "zustand";
import { User } from "@supabase/supabase-js";
import { Profile } from "@/types";
import { supabase } from "@/lib/supabase";

interface UserState {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  fetchProfile: (userId: string) => Promise<void>;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  profile: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  fetchProfile: async (userId) => {
    try {
      set({ isLoading: true });
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }

      set({ profile: data as Profile });
    } catch (error) {
      console.error("Unexpected error fetching profile:", error);
    } finally {
      set({ isLoading: false });
    }
  },
  clearUser: () => set({ user: null, profile: null, isLoading: false }),
}));
