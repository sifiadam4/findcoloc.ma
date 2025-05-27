"use client";
import { Calendar, Home, Inbox, LogOutIcon, Plus, Search, Settings } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "../global/logo";
import { Button } from "../ui/button";
import { signOut } from "next-auth/react";
import { Separator } from "../ui/separator";

const items = [
  {
    title: "Tableau de bord",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Mes offres",
    url: "/mes-offres",
    icon: Inbox,
  },
  {
    title: "Gestion des demandes",
    url: "/mes-demandes",
    icon: Calendar,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const isActive = (href) => {
    return pathname.startsWith(href);
  };
  return (
    <Sidebar >
      <SidebarHeader className="mb-4">
        <Link href={"/"} className="flex items-center space-x-1 p-2 justify-center">
          <Logo/>
          <h1 className="font-semibold text-2xl tracking-tight">Find<span className="text-primary">Coloc</span></h1>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <Link href={"/creer-offre"}>
            <Button className="gap-2 w-full mb-3 bg-gradient-to-br from-orange-500 to-orange-700">
              <Plus className="w-4 h-4" />
              <span>Créer une offre</span>
            </Button>
          </Link>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    size="lg"
                    className={`
                      ${
                        isActive(item.url)
                          ? "border-l-4 border-primary bg-primary/10 text-primary font-semibold hover:text-primary hover:bg-primary/10"
                          : ""
                      }`}
                  >
                    <Link href={item.url}>
                      <item.icon strokeWidth={isActive(item.url) ? 2.75 : 2} />
                      <span className="">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent> 
      <SidebarFooter>
              
            <SidebarMenu>
              <SidebarMenuItem>
      <Separator className="my-2 bg-gray-600/50" />
               
                <SidebarMenuButton size="lg" variant="destructive" className="mb-2" onClick={() => signOut({ callbackUrl: "/" })}>
                    <LogOutIcon />
                    <span className="">Déconnexion</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
