import Link from "next/link";
import React from "react";
// import { ModeToggle } from "@/components/global/mode-toggle";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";
import ProfileNav from "@/components/global/profile-nav";
import { Home, Heart, Calendar, User } from "lucide-react";
import Logo from "@/components/global/logo";
import MobileNav from "./mobile-nav";
import { headers } from "next/headers";

const Header = async () => {
  const session = await auth();

  const navigationItems = [
    { href: "/", label: "Accueil", icon: Home },
    { href: "/mes-favoris", label: "Mes favoris", icon: Heart },
    { href: "/mes-candidatures", label: "Mes candidatures", icon: User },
    { href: "/mes-sejours", label: "Mes séjours", icon: Calendar },
  ];

  return (
    <header className="w-full sticky top-0 z-50 border-b bg-background">
      <div className="px-4 py-2.5 flex justify-between items-center">
        <Link href={"/"} className="flex items-center space-x-1 justify-center">
          <Logo />
          <h1 className="font-semibold text-2xl tracking-tight">
            Find<span className="text-primary">Coloc</span>
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden sm:flex sm:items-center space-x-4 text-sm">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          {/* Mobile Navigation */}
          <MobileNav session={session} />

          {/* Desktop Auth */}
          <div className="hidden sm:block">
            {session?.user ? (
              <ProfileNav />
            ) : (
              <Link href={"/sign-in"}>
                <Button>Se Connecter</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
