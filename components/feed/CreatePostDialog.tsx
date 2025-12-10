"use client";

import { useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { supabase } from "@/lib/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Rocket, Loader2 } from "lucide-react";
import confetti from "canvas-confetti";

interface CreatePostDialogProps {
  children?: React.ReactNode; // To allow custom trigger
}

export function CreatePostDialog({ children }: CreatePostDialogProps) {
  const { user, profile, fetchProfile } = useUserStore();
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [progress, setProgress] = useState(0);

  const COST = 5;

  const extractTweetId = (inputUrl: string) => {
    // Regex for x.com or twitter.com status URLs
    // Supports:
    // https://x.com/username/status/1234567890
    // https://twitter.com/username/status/1234567890?s=20
    const regex = /(?:twitter\.com|x\.com)\/(?:#!\/)?(\w+)\/status(es)?\/(\d+)/;
    const match = inputUrl.match(regex);
    if (match && match[3]) {
      return match[3];
    }
    return null;
  };

  const simulateProgress = async (val: number, ms: number) => {
    setProgress(val);
    await new Promise((resolve) => setTimeout(resolve, ms));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !profile) {
      toast.error("You must be logged in to boost tweets.");
      return;
    }

    setLoading(true);
    setProgress(10);
    setStatusMessage("Checking credits...");

    // 1. Check Credits
    if (profile.credits_balance < COST) {
      toast.error(`Insufficient credits. You need ${COST} credits.`);
      setLoading(false);
      return;
    }
    await simulateProgress(30, 600);

    // 2. Validate URL and Extract ID
    setStatusMessage("Verifying Tweet URL...");
    const tweetId = extractTweetId(url);
    if (!tweetId) {
      toast.error("Invalid Twitter/X URL. Please check the link.");
      setLoading(false);
      return;
    }
    await simulateProgress(60, 800);

    try {
      // 3. Submit to RPC
      setStatusMessage("Boosting your tweet...");
      // Artificial delay to show the final step clearly
      await simulateProgress(80, 500);

      const { data, error } = await supabase.rpc("create_post_secure", {
        tweet_id_input: tweetId,
        original_url_input: url,
      });

      if (error) throw error;

      setProgress(100);
      setStatusMessage("Done!");
      await simulateProgress(100, 300);

      // 4. Success handling
      toast.success("Tweet Boosted!", {
        description: `${COST} credits deducted.`,
      });
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      setUrl("");
      setIsOpen(false);

      // Refresh profile to show new balance
      await fetchProfile(user.id);
    } catch (error: any) {
      console.error("Boost error:", error);
      toast.error(error.message || "Failed to boost tweet.");
    } finally {
      setLoading(false);
      setProgress(0);
      setStatusMessage("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button
            variant="default"
            className="gap-2 bg-linear-to-r from-blue-600 to-indigo-600 border-0 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md transition-all hover:shadow-lg"
          >
            <Rocket className="w-4 h-4" />
            Boost Tweet
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Boost a Tweet</DialogTitle>
          <DialogDescription>
            Get more engagement by boosting your tweet.
            <br />
            <span className="font-semibold text-primary">
              Cost: {COST} Credits
            </span>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="tweet-url">Tweet URL</Label>
            <Input
              id="tweet-url"
              placeholder="https://x.com/username/status/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          {loading && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{statusMessage}</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300 ease-in-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Boosting...
                </>
              ) : (
                "Boost Now"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
