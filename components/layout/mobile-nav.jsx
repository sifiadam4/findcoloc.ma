"use client";

import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Menu,
  Home,
  Heart,
  Calendar,
  LayoutDashboard,
  User,
  LogOut,
} from "lucide-react";
import Logo from "@/components/global/logo";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { signOut } from "next-auth/react";

const MobileNav = ({ session }) => {
  const pathname = usePathname();

  const navigationItems = [
    { href: "/", label: "Accueil", icon: Home },
    { href: "/mes-favoris", label: "Mes favoris", icon: Heart },
    { href: "/mes-candidatures", label: "Mes candidatures", icon: User },
    { href: "/mes-sejours", label: "Mes séjours", icon: Calendar },
  ];

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  const getSignInUrl = () => {
    const callbackUrl = encodeURIComponent(pathname);
    return `/sign-in?callbackUrl=${callbackUrl}`;
  };

  return (
    <div className="sm:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="h-9 w-9">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Ouvrir le menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px] sm:w-[400px]">
          <SheetHeader>
            <SheetTitle className="flex items-center space-x-2">
              <Logo />
              <span>
                Find<span className="text-primary">Coloc</span>
              </span>
            </SheetTitle>
          </SheetHeader>

          <div className="mt-6 space-y-4">
            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <Icon className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <Separator />

            {session?.user ? (
              <div className="space-y-2">
                <Link
                  href="/creer-offre"
                  className="flex items-center space-x-3 p-3 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
                >
                  <Plus className="h-5 w-5 text-primary" />
                  <span className="font-medium text-primary">
                    Créer une offre
                  </span>
                </Link>

                <Link
                  href="/dashboard"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <LayoutDashboard className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Dashboard</span>
                </Link>

                <Link
                  href="/profile"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <User className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Mon profil</span>
                </Link>

                <Separator />

                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors w-full text-left"
                >
                  <LogOut className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Se déconnecter</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link href={getSignInUrl()} className="block">
                  <Button className="w-full">Se connecter</Button>
                </Link>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNav;
