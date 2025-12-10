import { supabase } from "@/lib/supabase";
import { FeedList } from "@/components/feed/FeedList";
import { Post } from "@/types";

// Force dynamic rendering because dependent on data that changes
export const dynamic = "force-dynamic";

export default async function FeedPage() {
  // Server-side fetch
  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false });

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
