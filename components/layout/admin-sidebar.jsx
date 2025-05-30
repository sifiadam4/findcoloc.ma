"use client";
import {
  Calendar,
  FileText,
  Home,
  Inbox,
  LogOutIcon,
  Plus,
  Search,
  Settings,
  Users,
} from "lucide-react";

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
    url: "/admin",
    icon: Home,
  },
  {
    title: "Annonces",
    url: "/annonces",
    icon: FileText,
  },
  {
    title: "Utilisateurs",
    url: "/users",
    icon: Users,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const isActive = (href) => {
    return pathname.startsWith(href);
  };
  return (
    <Sidebar>
      <SidebarHeader className="mb-4 flex items-center justify-between">
        <Link
          href={"/"}
          className="flex items-center space-x-1 p-2 justify-center"
        >
          <Logo />
          <h1 className="font-semibold text-2xl tracking-tight">
            Find<span className="text-primary">Coloc</span>
          </h1>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Administation</SidebarGroupLabel>
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

            <SidebarMenuButton
              size="lg"
              variant="destructive"
              className="mb-2"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <LogOutIcon />
              <span className="">Déconnexion</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
