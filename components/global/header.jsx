import Link from "next/link";
import React from "react";
import { ModeToggle } from "@/components/global/mode-toggle";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";
import SignoutButton from "@/components/auth/signout-button";

const Header = async () => {
  const session = await auth();
  return (
    <header className="w-full sticky top-0 z-10 border-b">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <Link href={"/"} className="text-3xl">
          🏡
        </Link>
        <div className="flex items-center space-x-4">
          {session?.user ? (
            <SignoutButton />
          ) : (
            <Link href={"/sign-in"}>
              <Button>Sign In</Button>
            </Link>
          )}

          <ModeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
