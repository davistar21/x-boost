import { createClient } from "@/lib/supabase/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Trophy, Medal, Crown, Flame } from "lucide-react";
import { redirect } from "next/navigation";

// Force dynamic rendering
export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  // Fetch Top 20 Users
  const { data: topUsers, error } = await supabase
    .from("profiles")
    .select("id, username, full_name, avatar_url, total_credits_earned")
    .order("total_credits_earned", { ascending: false })
    .limit(20);

  if (error) {
    console.error("Leaderboard error:", error);
    return (
      <div className="p-10 text-center text-red-500">
        Failed to load leaderboard.
      </div>
    );
  }

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return (
          <Crown className="w-6 h-6 text-yellow-500 fill-yellow-500 animate-bounce" />
        );
      case 1:
        return <Medal className="w-6 h-6 text-gray-400 fill-gray-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-amber-600 fill-amber-600" />;
      default:
        return (
          <span className="font-bold text-muted-foreground w-6 text-center">
            {index + 1}
          </span>
        );
    }
  };

  return (
    <div className="container py-8 max-w-3xl">
      {/* Raid Mode Banner */}
      <div className="mb-8 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 p-6 text-white shadow-lg overflow-hidden relative">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/20 rounded-full blur-2xl"></div>
        <div className="flex items-center gap-4 relative z-10">
          <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
            <Flame className="w-8 h-8 text-yellow-300" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Raid Mode Active!</h2>
            <p className="text-orange-100">
              Next Raid: 9:00 PM. Double Credits for specific tweets.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center justify-center gap-2">
          <Trophy className="w-8 h-8 text-primary" />
          Leaderboard
        </h1>
        <p className="text-muted-foreground">
          Top earners of the week. Compete for glory.
        </p>
      </div>

      <Card className="border-0 shadow-xl overflow-hidden">
        <CardHeader className="bg-muted/50 border-b pb-4">
          <div className="flex justify-between items-center text-sm font-medium text-muted-foreground px-2">
            <span>Rank</span>
            <span className="flex-1 ml-16">User</span>
            <span>Score</span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {topUsers.map((profile, index) => {
            const isCurrentUser = profile.id === user.id;
            return (
              <div
                key={profile.id}
                className={`flex items-center p-4 border-b last:border-0 transition-colors ${
                  isCurrentUser
                    ? "bg-primary/5 hover:bg-primary/10 border-l-4 border-l-primary"
                    : "hover:bg-muted/30"
                }`}
              >
                <div className="w-12 flex justify-center items-center mr-4">
                  {getRankIcon(index)}
                </div>

                <div className="flex-1 flex items-center gap-3">
                  <Avatar
                    className={`w-10 h-10 border-2 ${
                      index < 3 ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <AvatarImage src={profile.avatar_url || ""} />
                    <AvatarFallback>
                      {profile.full_name?.[0] || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span
                      className={`font-semibold ${
                        isCurrentUser ? "text-primary" : ""
                      }`}
                    >
                      {profile.full_name} {isCurrentUser && "(You)"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      @{profile.username || "user"}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <Badge
                    variant="outline"
                    className="font-mono text-base px-3 py-1 bg-background"
                  >
                    {profile.total_credits_earned}
                  </Badge>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
