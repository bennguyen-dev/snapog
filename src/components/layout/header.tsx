import Link from "next/link";
import { redirect } from "next/navigation";

import HamburgerIcon from "@/assets/icons/hamburger.svg";
import { auth, signOut } from "@/auth";
import { Navbar } from "@/components/layout/navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const Hamburger = () => {
  return (
    <button
      className="mr-2 inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md px-0 py-2 text-base font-medium transition-colors hover:bg-transparent hover:text-accent-foreground focus-visible:bg-transparent focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50 md:hidden"
      type="button"
      aria-haspopup="dialog"
      aria-expanded="false"
      aria-controls="radix-:R16u6la:"
      data-state="closed"
    >
      <HamburgerIcon className="h-6 w-6" />
      <span className="sr-only">Toggle Menu</span>
    </button>
  );
};

export const Header = async () => {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 w-full bg-transparent backdrop-blur">
      <div className="container mx-auto flex h-14 items-center justify-between">
        <div className="hidden md:flex">
          <Link className="flex items-center space-x-2" href="/">
            <span className="hidden text-xl font-bold sm:inline-block">
              Smart OG
            </span>
          </Link>
        </div>

        <Hamburger />

        <Navbar session={session} />
        {session?.user ? (
          <div className="flex items-center gap-4">
            <div className="flex cursor-pointer flex-col items-end">
              <p className="text-base">{session.user.name}</p>
              <form
                action={async () => {
                  "use server";
                  await signOut();
                  redirect("/");
                }}
              >
                <button
                  type="submit"
                  className="text-sm font-semibold underline"
                >
                  Logout
                </button>
              </form>
            </div>
            <Avatar>
              <AvatarImage
                src={session.user.image as string}
                alt="User Image"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        ) : (
          <div className="flex items-center justify-between space-x-2 md:justify-end">
            <form
              action={async () => {
                "use server";
                redirect("/signin");
              }}
            >
              <Button type="submit" className="rounded-full">
                Sign in
              </Button>
            </form>
          </div>
        )}
      </div>
    </header>
  );
};
