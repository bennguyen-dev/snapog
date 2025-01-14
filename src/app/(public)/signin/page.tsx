import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { SignIn } from "@/modules/auth";
import { generateSchema, getMetadata } from "@/utils/metadata";

export async function generateMetadata() {
  return getMetadata({
    title: "Sign In - SnapOG",
    description: "Sign in to your account to access all features of SnapOG.",
    path: "/signin",
  });
}

export default async function SignInPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard/sites");
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateSchema({
              type: "WebPage",
              title: "Sign In - SnapOG",
              description:
                "Sign in to your account to access all features of SnapOG.",
              path: "/signin",
              dateModified: new Date().toISOString(),
            }),
          ),
        }}
      />
      <SignIn />
    </>
  );
}
