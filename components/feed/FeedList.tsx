"use client";

import { useState } from "react";
import { TweetCard } from "@/components/feed/TweetCard";
import { EngagementTimer } from "@/components/feed/EngagementTimer";
import { Post } from "@/types";
import { supabase } from "@/lib/supabase/client";
import { useUserStore } from "@/store/useUserStore";
import { useGamificationStore } from "@/store/useGamificationStore";
import { toast } from "sonner";
import { Coins } from "lucide-react";

interface FeedListProps {
  initialPosts: Post[];
}

export function FeedList({ initialPosts }: FeedListProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const { claimEngagement } = useGamificationStore();
  const { user } = useUserStore();

  const handleClaim = async (postId: string) => {
    // Optimistic Update is tricky if the store handles logic.
    // Ideally the store updates the profile, but we want to remove the post from the list locally.
    const success = await claimEngagement(postId);
    if (success) {
      setPosts((currentPosts) => currentPosts.filter((p) => p.id !== postId));
      toast.success("Credits claimed!", {
        icon: <Coins className="text-yellow-500" />,
      });
    }
  };

  if (posts.length === 0) {
    return (
      <div className="text-center py-20">
        <h3 className="text-2xl font-semibold mb-2">All caught up!</h3>
        <p className="text-muted-foreground">
          Check back later for more tweets to boost.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-xl mx-auto">
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-card border rounded-xl overflow-hidden shadow-sm"
        >
          <div className="p-4 border-b bg-muted/30">
            <TweetCard tweetId={post.tweet_id} owner={post.profiles} />
          </div>
          <div className="p-4 bg-background">
            <div className="flex flex-col gap-2">
              <div className="text-sm text-center text-muted-foreground mb-2">
                Click below to engage with this tweet and earn credits.
              </div>
              <EngagementTimer
                tweetUrl={post.original_url}
                onComplete={() => handleClaim(post.id)}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
