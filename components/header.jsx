import Link from "next/link";
import React from "react";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="w-full sticky top-0 z-10 border-b">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <Link href={"/"} className="text-3xl">
          🏡
        </Link>
        <div className="flex items-center space-x-4">
          <Link href={"/sign-in"}>
            <Button>Sign In</Button>
          </Link>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
