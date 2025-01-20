import Image from "next/image";

import GitHubIcon from "@/assets/icons/github.svg";
import GoogleIcon from "@/assets/icons/google.svg";
import { providerMap, signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const IconPlatforms: any = {
  GitHub: <GitHubIcon className="mr-2 h-5 w-5" />,
  Google: <GoogleIcon className="mr-2 h-5 w-5" />,
};

export const SignIn = () => {
  return (
    <div className="mt-36 flex h-full max-w-screen-2xl flex-col items-center sm:mt-48">
      <Image src="/logo.svg" alt="Logo" width={64} height={64} priority />
      <Card className="max-w-96">
        <CardHeader>
          <CardTitle>
            Join{" "}
            <strong className="text-primary">
              Snap<span className="text-secondary">OG</span>
            </strong>
          </CardTitle>
          <CardDescription>
            Join these communities and start generating OG images with 700+
            other users
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col space-y-2">
          {Object.values(providerMap).map((provider) => (
            <form
              key={provider.id}
              action={async () => {
                "use server";
                await signIn(provider.id, { redirectTo: "/dashboard/sites" });
              }}
            >
              <Button className="w-full" variant="outline" type="submit">
                {IconPlatforms?.[provider?.name] || null}
                <span>Sign in with {provider.name}</span>
              </Button>
            </form>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
