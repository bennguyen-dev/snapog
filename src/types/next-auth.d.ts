import { DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user?: DefaultUser & { id: string; apiKey: string | null };
  }

  interface User extends DefaultUser {
    apiKey: string | null;
  }
}
