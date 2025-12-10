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

export function Navbar() {
  const { signInWithGoogle } = useAuth();
  const { user, profile, clearUser } = useUserStore();

  const handleLogout = async () => {
    // We would typically call supabase.auth.signOut() here
    // but importing supabase client directly in components can be tricky if not careful
    // For now, let's just use the store clearUser and we can add the actual signOut logic
    // or import supabase here. Ideally useAuth should expose signOut.
    const { createClient } = await import("@supabase/supabase-js"); // Dynamic import to avoid issues or just import standard client
    // Actually we have valid client at @/lib/supabase
    const { supabase } = await import("@/lib/supabase");
    await supabase.auth.signOut();
    clearUser();
    window.location.reload(); // Force refresh to clear any state/cache
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
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  {!profile?.twitter_handle ? (
                    <DropdownMenuItem>
                      <LinkIcon className="mr-2 h-4 w-4" />
                      <span>Link X Account</span>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem>
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
