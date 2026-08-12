import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

async function getAdminData() {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { isAdmin: false, counts: null };
  }

  // Check if admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return { isAdmin: false, counts: null };
  }

  // Get counts for badges
  const [coachesResult, inquiriesResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("id", { count: "exact" })
      .eq("role", "coach")
      .eq("is_approved", false),
    supabase
      .from("inquiries")
      .select("id", { count: "exact" })
      .eq("status", "new"),
  ]);

  return {
    isAdmin: true,
    counts: {
      pendingCoaches: coachesResult.count || 0,
      newInquiries: inquiriesResult.count || 0,
    },
  };
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAdmin, counts } = await getAdminData();

  if (!isAdmin) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen bg-coerver-gray-50">
      <AdminSidebar counts={counts || undefined} />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
