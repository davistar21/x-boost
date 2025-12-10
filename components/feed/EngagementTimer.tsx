"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, Timer, CheckCircle } from "lucide-react";

interface EngagementTimerProps {
  url: string;
  onComplete: () => void;
}

type TimerState = "idle" | "counting" | "ready";

export function EngagementTimer({ url, onComplete }: EngagementTimerProps) {
  const [status, setStatus] = useState<TimerState>("idle");
  const [timeLeft, setTimeLeft] = useState(10);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (status === "counting" && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (status === "counting" && timeLeft === 0) {
      setStatus("ready");
    }

    return () => clearInterval(timer);
  }, [status, timeLeft]);

  const handleOpenTweet = () => {
    window.open(url, "_blank");
    setStatus("counting");
  };

  const handleClaim = () => {
    onComplete();
  };

  if (status === "idle") {
    return (
      <Button
        onClick={handleOpenTweet}
        variant="outline"
        className="w-full gap-2 border-primary/20 hover:bg-primary/5"
      >
        <ExternalLink className="w-4 h-4" />
        Open Tweet to Engage
      </Button>
    );
  }

  if (status === "counting") {
    return (
      <Button disabled className="w-full gap-2 opacity-90 cursor-wait">
        <Timer className="w-4 h-4 animate-pulse" />
        Verifying... ({timeLeft}s)
      </Button>
    );
  }

  if (status === "ready") {
    return (
      <Button
        onClick={handleClaim}
        variant="default" // Primary color for action
        className="w-full gap-2 bg-green-600 hover:bg-green-700 text-white"
      >
        <CheckCircle className="w-4 h-4" />
        Claim Credit
      </Button>
    );
  }

  return null;
}
