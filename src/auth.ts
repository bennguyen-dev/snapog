import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { Provider } from "@auth/core/providers";
import Google from "@auth/core/providers/google";

const providers: Provider[] = [GitHub, Google];

export const providerMap = providers.map((provider) => {
  if (typeof provider === "function") {
    const providerData = provider();
    return { id: providerData.id, name: providerData.name };
  } else {
    return { id: provider.id, name: provider.name };
  }
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  pages: {
    signIn: "/signin",
  },
});
