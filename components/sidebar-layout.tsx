"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const updateOpenState = () => {
      const width = window.innerWidth;
      // Expand by default on large screens
      setOpen(width >= 1280);
    };

    updateOpenState();
    window.addEventListener("resize", updateOpenState);

    return () => window.removeEventListener("resize", updateOpenState);
  }, []);

  // Don't show sidebar on auth pages
  const isAuthPage = pathname === "/login" || pathname === "/signup" || pathname === "/logout";
  
  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <AppSidebar />
      <SidebarInset className="flex flex-col flex-1 overflow-hidden">
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
