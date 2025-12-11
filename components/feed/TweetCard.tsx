"use client";

import { Tweet } from "react-tweet";
import { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle } from "lucide-react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Tweet component crashed:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

import { Profile } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface TweetCardProps {
  tweetId: string;
  owner?: Profile;
}

export function TweetCard({ tweetId, owner }: TweetCardProps) {
  return (
    <div className="w-full flex flex-col gap-2">
      {owner && (
        <div className="flex items-center gap-2 px-1">
          <div className="flex items-center gap-2 flex-1">
            <Avatar className="w-6 h-6">
              <AvatarImage
                src={owner.avatar_url ?? ""}
                alt={owner.full_name ?? "User"}
              />
              <AvatarFallback>{owner.full_name?.[0] || "U"}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-semibold">{owner.full_name}</span>
            {owner.is_verified && (
              <span className="text-blue-500 text-[10px]">Verified</span>
            )}
          </div>
          <div className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs font-bold shadow-sm">
            <span>🏆</span>
            <span>{owner.total_credits_earned || 0}</span>
          </div>
        </div>
      )}
      <div className="flex justify-center w-full min-h-[150px]">
        <ErrorBoundary
          fallback={
            <div className="flex items-center justify-center p-6 border border-dashed rounded-lg border-muted-foreground/25 bg-muted/20 text-muted-foreground gap-2 w-full max-w-[500px]">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm font-medium">
                Tweet not found or deleted
              </span>
            </div>
          }
        >
          {/* We use the light/dark theme compatible Tweet component if possible, 
            but react-tweet usually handles this via its own css or explicit theme prop.
            We'll assume default behavior for now. */}
          <div className="w-full max-w-[500px] light:hidden">
            <Tweet id={tweetId} />
          </div>
        </ErrorBoundary>
      </div>
    </div>
  );
}
