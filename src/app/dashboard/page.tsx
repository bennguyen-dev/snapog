import Dashboard from "@/modules/dashboard/Dashboard";
import { getMetadata } from "@/utils/metadata";

export async function generateMetadata() {
  return getMetadata({
    title: "SnapOG Dashboard",
    description: "View your account statistics and information",
    path: "/dashboard",
  });
}

export default function DashboardPage() {
  return <Dashboard />;
}
