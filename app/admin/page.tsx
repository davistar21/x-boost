import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AdminPostList } from "@/components/admin/AdminPostList";
import { ShieldAlert } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  // Security Check: Get Profile Role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    redirect("/feed");
  }

  // Fetch All Posts with User details
  const { data: posts, error } = await supabase
    .from("posts")
    .select(
      `
      *,
      profiles:user_id (
        id,
        username,
        full_name,
        twitter_handle,
        avatar_url
      )
    `
    )
    .order("created_at", { ascending: false })
    .limit(50); // Limit for performance

  if (error) {
    console.error("Admin fetch error:", error);
    return <div>Error loading admin data</div>;
  }

  return (
    <div className="container py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-red-100 text-red-600 rounded-full">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage content and users.</p>
        </div>
      </div>

      <AdminPostList initialPosts={posts || []} />
    </div>
  );
}
