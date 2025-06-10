import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
// import { ModeToggle } from "./mode-toggle";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProfileNav from "@/components/global/profile-nav";

const HeaderSideBar = () => {
  return (
    <header className="w-full sticky top-0 z-50 border-b bg-background p-3">
      <div className="flex items-center justify-between">
        <SidebarTrigger className="h-9 w-9"/>
        <div className="flex items-center gap-4">
          {/* <Link href={"/creer-offre"}>
            <Button className="gap-2 ">
              <Plus className="w-4 h-4" />
              <span>Créer une offre</span>
            </Button>
          </Link> */}
          <ProfileNav />
          {/* <ModeToggle /> */}
        </div>
      </div>
    </header>
  );
};

export default HeaderSideBar;
