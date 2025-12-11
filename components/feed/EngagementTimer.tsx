"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface EngagementTimerProps {
  onComplete: () => void;
  tweetUrl: string;
}

export function EngagementTimer({
  onComplete,
  tweetUrl,
}: EngagementTimerProps) {
  const [hasClicked, setHasClicked] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [statusText, setStatusText] = useState("Engage");
  const tabSwitchDetected = useRef(false);

  useEffect(() => {
    // track visibility change to guess if they actually went to twitter
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        tabSwitchDetected.current = true;
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const handleClick = () => {
    // 1. Open Twitter
    window.open(tweetUrl, "_blank");
    setHasClicked(true);
    setIsVerifying(true);
    setStatusText("Waiting for you to engage...");
    tabSwitchDetected.current = false; // Reset checking

    // 2. Start Random Timer (5s - 8s) - Reduced from 10-15s for better UX
    const randomDelay = Math.floor(Math.random() * (8000 - 5000 + 1) + 5000);

    setTimeout(() => {
      // 3. Verification Check
      if (tabSwitchDetected.current) {
        onComplete();
      } else {
        // Did not switch tabs?
        setIsVerifying(false); // Reset UI to allow retry
        // Simple alert as per previous logic
        toast.info(
          "We couldn't verify your engagement. Please switch tabs to the tweet and back!"
        );
      }
    }, randomDelay);
  };

  if (isVerifying) {
    return (
      <Button
        disabled
        variant="secondary"
        className="w-full gap-2 transition-all duration-500"
      >
        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
        <span className="animate-pulse">{statusText}</span>
      </Button>
    );
  }

  return (
    <Button
      onClick={handleClick}
      className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold"
    >
      Engage & Earn
    </Button>
  );
}
