import { Dashboard } from "@/modules/dashboard";
import { auth } from "@/auth";

export default async function DashboardPage() {
  const session = await auth();

  return <Dashboard session={session} />;
}
