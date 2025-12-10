import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Users, Trophy } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Note: Navbar is already in MainLayout, but MainLayout is in layout.tsx.
           So we don't need to include it here if we want it on the landing page.
           However, usually landing pages might have a different nav or transparent one.
           For now, the app shell has the Navbar. We will focus on the content. */}

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden items-center justify-center flex flex-col text-center px-4">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/20 rounded-full blur-[100px] -z-10 opacity-50"></div>

        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80 mb-6">
          version 1.0.0
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight lg:text-7xl mb-6">
          Supercharge your <br />
          <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500">
            Social Presence
          </span>
        </h1>

        <p className="max-w-[600px] text-muted-foreground text-lg md:text-xl mb-8 mx-auto">
          The gamified engagement platform for Unilag students. Earn credits by
          engaging, spend them to boost your tweets.
        </p>

        <div className="flex gap-4 justify-center">
          <Link href="/feed">
            <Button
              size="lg"
              className="rounded-full gap-2 px-8 h-12 text-base"
            >
              Start Earning
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/profile">
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-8 h-12 text-base"
            >
              View Leaderboard
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 bg-background rounded-2xl shadow-sm border">
              <div className="p-3 bg-blue-100 rounded-full text-blue-600 mb-4">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Engage to Earn</h3>
              <p className="text-muted-foreground">
                Like and reply to fellow students' tweets to earn credits
                instantly. Verified by our secure timer system.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-background rounded-2xl shadow-sm border">
              <div className="p-3 bg-purple-100 rounded-full text-purple-600 mb-4">
                <RocketIcon />
              </div>
              <h3 className="text-xl font-bold mb-2">Boost Your Reach</h3>
              <p className="text-muted-foreground">
                Spend your hard-earned credits to push your tweets to the top of
                the feed and get specific engagement.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-background rounded-2xl shadow-sm border">
              <div className="p-3 bg-yellow-100 rounded-full text-yellow-600 mb-4">
                <Trophy className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Climb the Ranks</h3>
              <p className="text-muted-foreground">
                Compete with other students on the leaderboard. Show off your
                influence and community contribution.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function RocketIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-8 h-8"
    >
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );
}
