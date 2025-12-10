"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Post, CreditLedger } from "@/types";
import { format } from "date-fns";
import { Trash2, ExternalLink } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ProfileTabsProps {
  initialPosts: Post[];
  creditLedger: CreditLedger[];
}

export function ProfileTabs({ initialPosts, creditLedger }: ProfileTabsProps) {
  const router = useRouter();

  const handleArchive = async (postId: string) => {
    try {
      const { error } = await supabase
        .from("posts")
        .update({ status: "archived" })
        .eq("id", postId);

      if (error) throw error;

      toast.success("Post archived.");
      router.refresh();
    } catch (error: any) {
      toast.error("Failed to archive post.");
    }
  };

  return (
    <Tabs defaultValue="active-posts" className="w-full">
      <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
        <TabsTrigger value="active-posts">My Active Posts</TabsTrigger>
        <TabsTrigger value="credits">Credit History</TabsTrigger>
      </TabsList>

      {/* Active Posts Tab */}
      <TabsContent value="active-posts" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Your Active & Archived Posts</CardTitle>
            <CardDescription>Manage your boosted tweets here.</CardDescription>
          </CardHeader>
          <CardContent>
            {initialPosts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No posts found. Start boosting!
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tweet ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Engagements</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {initialPosts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="font-mono text-xs truncate max-w-[100px]">
                        <a
                          href={post.original_url}
                          target="_blank"
                          className="hover:underline flex items-center gap-1"
                        >
                          {post.tweet_id} <ExternalLink className="w-3 h-3" />
                        </a>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            post.status === "active" ? "default" : "secondary"
                          }
                        >
                          {post.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {post.current_engagements} /{" "}
                        {post.target_engagements || "∞"}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {format(new Date(post.created_at), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="text-right">
                        {post.status === "active" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleArchive(post.id)}
                            title="Archive Post"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* Credit History Tab */}
      <TabsContent value="credits" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Credit History</CardTitle>
            <CardDescription>View your earnings and spendings.</CardDescription>
          </CardHeader>
          <CardContent>
            {creditLedger.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No transactions yet.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {creditLedger.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell>
                        <span className="font-medium capitalize">
                          {tx.transaction_type}
                        </span>
                        {tx.description && (
                          <span className="text-muted-foreground text-sm block">
                            {tx.description}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {format(new Date(tx.created_at), "MMM d, HH:mm")}
                      </TableCell>
                      <TableCell
                        className={`text-right font-bold ${
                          tx.amount > 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {tx.amount > 0 ? "+" : ""}
                        {tx.amount}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
