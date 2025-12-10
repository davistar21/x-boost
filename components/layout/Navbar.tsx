"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useUserStore } from "@/store/useUserStore";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Trophy, Link as LinkIcon, Menu } from "lucide-react";
import { CreatePostDialog } from "@/components/feed/CreatePostDialog";
import { useRouter } from "next/navigation";

export function Navbar() {
  const { signInWithGoogle } = useAuth();
  const { user, profile, clearUser } = useUserStore();
  const router = useRouter();
  const handleLogout = async () => {
    // We would typically call supabase.auth.signOut() here
    // but importing supabase client directly in components can be tricky if not careful
    // For now, let's just use the store clearUser and we can add the actual signOut logic
    // or import supabase here. Ideally useAuth should expose signOut.
    const { createClient } = await import("@supabase/supabase-js"); // Dynamic import to avoid issues or just import standard client
    // Actually we have valid client at @/lib/supabase
    const { supabase } = await import("@/lib/supabase/client");
    await supabase.auth.signOut();
    clearUser();
    router.push("/"); // Force refresh to clear any state/cache
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <span className="text-primary">Unilag</span> X Boost
        </Link>

        {/* Navigation - Hidden on mobile for simplicity in this step, or simple links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link
            href="/feed"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Feed
          </Link>
          <Link
            href="/earn"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Earn
          </Link>
          <Link
            href="/boost"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Boost
          </Link>
        </nav>

        {/* User Actions */}
        <div className="flex items-center gap-4">
          {!user ? (
            <Button onClick={signInWithGoogle} variant="default" size="sm">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign in with Google
            </Button>
          ) : (
            <>
              <CreatePostDialog />

              {profile && (
                <Badge
                  variant="secondary"
                  className={
                    profile.credits_balance < 5
                      ? "bg-red-100 text-red-800 hover:bg-red-100"
                      : "bg-green-100 text-green-800 hover:bg-green-100"
                  }
                >
                  {profile.credits_balance} Credits
                </Badge>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={
                          profile?.avatar_url || user.user_metadata.avatar_url
                        }
                        alt={profile?.username || "User"}
                      />
                      <AvatarFallback>
                        {profile?.full_name?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {profile?.full_name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  {!profile?.twitter_handle ? (
                    <DropdownMenuItem
                      onClick={() =>
                        window.dispatchEvent(new CustomEvent("open-link-modal"))
                      }
                    >
                      <LinkIcon className="mr-2 h-4 w-4" />
                      <span>Link X Account</span>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      onClick={() => router.push("/leaderboard")}
                    >
                      <Trophy className="mr-2 h-4 w-4" />
                      <span>Leaderboard</span>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
