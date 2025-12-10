import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { useUserStore } from "@/store/useUserStore";

export const useAuth = () => {
  const router = useRouter();
  const { setUser, fetchProfile, profile, isLoading } = useUserStore();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      const user = session?.user ?? null;
      setUser(user);

      if (user) {
        await fetchProfile(user.id);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, fetchProfile]);

  useEffect(() => {
    // Check for onboarding
    if (!isLoading && profile && !profile.twitter_handle) {
      // Redirect to onboarding if twitter_handle is missing
      // We'll define the route later, but for now assuming /onboarding
      router.push("/onboarding");
    }
  }, [profile, isLoading, router]);

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/feed`,
      },
    });
  };

  return {
    signInWithGoogle,
  };
};
