import { AdminSidebar } from "@/components/layout/admin-sidebar";
import HeaderSideBar from "@/components/layout/sidebar-header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import React from "react";

const AdminLayout = async ({ children }) => {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  // Check if user is admin
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { isAdmin: true },
  });

  if (!user?.isAdmin) {
    redirect("/forbidden");
  }

  return (
    <div>
      <SidebarProvider>
        <AdminSidebar />
        <main className="flex flex-1 flex-col">
          {/* <HeaderSideBar /> */}
          <div className="px-3 md:px-6 py-8">{children}</div>
        </main>
      </SidebarProvider>
    </div>
  );
};

export default AdminLayout;
