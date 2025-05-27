import Link from "next/link";
import React from "react";
// import { ModeToggle } from "@/components/global/mode-toggle";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";
import ProfileNav from "@/components/global/profile-nav";
import { Plus } from "lucide-react";
import Logo from "@/components/global/logo";

const Header = async () => {
  const session = await auth();
  return (
    <header className="w-full sticky top-0 z-50 border-b bg-background">
      <div className="px-4 py-2.5 flex justify-between items-center">
        <Link
          href={"/"}
          className="flex items-center space-x-1 justify-center"
        >
          <Logo />
          <h1 className="font-semibold text-2xl tracking-tight">
            Find<span className="text-primary">Coloc</span>
          </h1>
        </Link>
        <div className="hidden sm:flex sm:items-center space-x-4 text-sm">
          <Link href={"/"}>Acceuil</Link>
          <Link href={"/mes-candidatures"}>Mes candidatures</Link>
          <Link href={"/mes-favoris"}>Mes favoris</Link>
        </div>

        <div className="flex items-center space-x-4">
          {session?.user ? (
              <ProfileNav />
          ) : (
            <Link href={"/sign-in"}>
              <Button>Se Connecter</Button>
            </Link>
          )}

          {/* <ModeToggle /> */}
        </div>
      </div>
    </header>
  );
};

export default Header;
