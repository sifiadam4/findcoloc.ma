import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import ProfileNav from "@/components/global/profile-nav";

const HeaderSideBar = () => {
  return (
    <header className="w-full sticky top-0 z-50 border-b bg-background p-3">
      <div className="flex items-center justify-between">
        <SidebarTrigger className="h-9 w-9" />

        <ProfileNav />
      </div>
    </header>
  );
};

export default HeaderSideBar;
