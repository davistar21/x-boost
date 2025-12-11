import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { useUserStore } from "@/store/useUserStore";

export const useAuth = () => {
  const router = useRouter();
  const { setUser, fetchProfile, profile, isLoading } = useUserStore();

  useEffect(() => {
    // Check active session immediately
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      } else {
        // If no session, clear loading state so UI knows we are done checking
        useUserStore.getState().clearUser();
      }
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      const user = session?.user ?? null;
      setUser(user);

      if (user) {
        await fetchProfile(user.id);
      } else {
        // Handle sign out or no session
        // clearUser handles setting user to null and isLoading to false
        // But we should use the store function to be consistent if exposed
        // Or just setUser(null) as above.
        // Let's rely on the store's default behavior or clearUser if needed.
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
      // router.push("/onboarding");
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

  const signOut = async () => {
    await supabase.auth.signOut();
    useUserStore.getState().clearUser();
    router.push("/");
  };

  return {
    signInWithGoogle,
    signOut,
  };
};
