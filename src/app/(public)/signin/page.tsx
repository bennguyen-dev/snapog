import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { SignIn } from "@/modules/auth";

export default async function SignInPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/sites");
  }

  return <SignIn />;
}
