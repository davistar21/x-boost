import { createClient } from "@/lib/supabase/server";
import { ProfileTabs } from "@/components/profile/ProfileTabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { redirect } from "next/navigation";

// Force dynamic rendering
export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  // Fetch Profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Fetch User's Posts
  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Fetch Credit Ledger
  const { data: ledger } = await supabase
    .from("credit_ledger")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="container py-8 max-w-4xl">
      {/* Top Section: User Info */}
      <div className="flex flex-col md:flex-row items-center gap-6 mb-10 bg-card p-6 rounded-xl border shadow-sm">
        <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
          <AvatarImage
            src={profile?.avatar_url || user.user_metadata.avatar_url}
          />
          <AvatarFallback className="text-2xl">
            {profile?.full_name?.[0] || "U"}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 text-center md:text-left space-y-2">
          <h1 className="text-2xl font-bold">{profile?.full_name || "User"}</h1>
          <p className="text-muted-foreground">
            {profile?.username || user.email}
          </p>
          {profile?.twitter_handle && (
            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {profile.twitter_handle} verified
            </div>
          )}
        </div>

        <div className="flex flex-col items-center bg-primary/5 p-4 rounded-lg min-w-[150px]">
          <span className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">
            Total Earned
          </span>
          <span className="text-3xl font-bold text-primary">
            {profile?.total_credits_earned || 0}
          </span>
          <span className="text-xs text-muted-foreground mt-1">
            Lifetime Credits
          </span>
        </div>
      </div>

      {/* Tabs Section */}
      <ProfileTabs initialPosts={posts || []} creditLedger={ledger || []} />
    </div>
  );
}
