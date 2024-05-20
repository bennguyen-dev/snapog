import { providerMap, signIn } from "@/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const SignIn = () => {
  // return (
  //   <div className="flex flex-col gap-2">
  //     {Object.values(providerMap).map((provider) => (
  //       <form
  //         key={provider.id}
  //         action={async () => {
  //           "use server";
  //           await signIn(provider.id);
  //         }}
  //       >
  //         <button type="submit">
  //           <span>Sign in with {provider.name}</span>
  //         </button>
  //       </form>
  //     ))}
  //   </div>
  // );

  return (
    <div className="mt-64 flex h-full max-w-screen-2xl">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>Get started in just 2 minutes.</CardDescription>
        </CardHeader>
        <CardContent>
          {Object.values(providerMap).map((provider) => (
            <form
              key={provider.id}
              action={async () => {
                "use server";
                await signIn(provider.id);
              }}
            >
              <Button className="w-full" variant="outline" type="submit">
                <span>Sign in with {provider.name}</span>
              </Button>
            </form>
          ))}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Label>Already has an account? Login</Label>
        </CardFooter>
      </Card>
    </div>
  );
};
