import { providerMap, signIn } from "@/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import GitHubIcon from "@/assets/icons/github.svg";
import GoogleIcon from "@/assets/icons/google.svg";
import { redirect } from "next/navigation";

const IconPlatforms: any = {
  GitHub: <GitHubIcon className="mr-2 h-5 w-5" />,
  Google: <GoogleIcon className="mr-2 h-5 w-5" />,
};

export const SignIn = () => {
  return (
    <div className="mt-64 flex h-full max-w-screen-2xl">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>Get started in just 2 minutes.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col space-y-2">
          {Object.values(providerMap).map((provider) => (
            <form
              key={provider.id}
              action={async () => {
                "use server";
                await signIn(provider.id, { redirectTo: "/sites" });
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
