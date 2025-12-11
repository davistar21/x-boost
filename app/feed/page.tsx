import { createClient } from "@/lib/supabase/server";
import { FeedList } from "@/components/feed/FeedList";
import { Post } from "@/types";

// Force dynamic rendering because dependent on data that changes
export const dynamic = "force-dynamic";

export default async function FeedPage() {
  // Server-side fetch
  const supabase = await createClient();
  // Filter own posts if logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();
  let query = supabase
    .from("posts")
    .select(
      "*, profiles:user_id (username, full_name, avatar_url, is_verified, total_credits_earned)"
    )
    .eq("status", "active")
    .order("created_at", { ascending: false });
  if (user) {
    query = query.neq("user_id", user.id);
  }

  const { data: posts, error } = await query;

  if (error) {
    console.error("Error fetching posts:", error);
    return (
      <div className="container py-10 text-center text-red-500">
        Failed to load feed. Please try again later.
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Earn Credits</h1>
        <p className="text-muted-foreground">
          Engage with tweets from the community to earn credits for your own
          boosts.
        </p>
      </div>

      <FeedList initialPosts={(posts as Post[]) || []} />
    </div>
  );
}
