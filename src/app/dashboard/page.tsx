import { redirect } from "next/navigation";
import { DashboardHome } from "@/components/layout/dashboard-home";
import { getDashboardData } from "@/lib/supabase/dashboard";

export default async function DashboardPage() {
  const dashboardData = await getDashboardData();

  if (!dashboardData.isAuthenticated) {
    redirect("/login");
  }

  return <DashboardHome data={dashboardData} />;
}
