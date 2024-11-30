import { Provider } from "@auth/core/providers";
import Google from "@auth/core/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

import { prisma } from "@/lib/db";

const providers: Provider[] = [
  GitHub({ allowDangerousEmailAccountLinking: true }),
  Google({ allowDangerousEmailAccountLinking: true }),
];

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    jwt({ token, trigger, session }) {
      if (trigger === "update") token.name = session?.user?.name;
      return token;
    },
    session({ session, user }) {
      session.user.apiKey = user.apiKey; //  Add apiKey value to user object so it is passed along with session
      return session;
    },
  },
});

export const providerMap = providers.map((provider) => {
  if (typeof provider === "function") {
    const providerData = provider();
    return { id: providerData.id, name: providerData.name };
  } else {
    return { id: provider.id, name: provider.name };
  }
});
