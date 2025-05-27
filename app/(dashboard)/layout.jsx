import { AppSidebar } from "@/components/layout/app-sidebar";
import HeaderSideBar from "@/components/layout/sidebar-header";
import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";

const DashboardLayout = ({ children }) => {
  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <main className="flex flex-1 flex-col">
          <HeaderSideBar />
          <div className="px-3 md:px-6 py-8">{children}</div>
        </main>
      </SidebarProvider>
    </div>
  );
};

export default DashboardLayout;
