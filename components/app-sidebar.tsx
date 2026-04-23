"use client";

import * as React from "react";
import { Command, Factory, LayoutDashboard, ShoppingCart, Users, UserCheck, Package, Tags, Box, Settings, BarChart3, Bell, LogOut as LogOutIcon } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Raw Materials",
    url: "/raw-materials",
    icon: Factory,
  },
  {
    title: "Products",
    url: "/products",
    icon: Package,
  },

  {
    title: "Suppliers",
    url: "/suppliers",
    icon: Users,
  },
  {
    title: "Customers",
    url: "/customers",
    icon: UserCheck,
  },
  {
    title: "Purchases",
    url: "/purchases",
    icon: ShoppingCart,
  },
  {
    title: "Orders",
    url: "/orders",
    icon: Tags,
  },
  {
    title: "Reports",
    url: "/reports",
    icon: BarChart3,
  },
  {
    title: "Alerts",
    url: "/alerts",
    icon: Bell,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
  {
    title: "Logout",
    url: "/logout",
    icon: LogOutIcon,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" className="border-r border-sidebar-border bg-sidebar" {...props}>
      <SidebarHeader className="p-4 bg-sidebar">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:bg-transparent p-0">
              <a href="/dashboard" className="flex items-center gap-3">
                <div className="bg-[#1a9df9] text-white flex aspect-square size-10 items-center justify-center rounded-lg shadow-sm">
                  <Box className="size-6" />
                </div>
                <div className="flex flex-col text-left leading-none">
                  <span className="text-lg font-bold tracking-tight text-white">
                    Inventory<span className="text-[#1a9df9]">Pro</span>
                  </span>
                  <span className="text-[10px] text-sidebar-foreground font-medium uppercase tracking-wider mt-0.5">Zylkar Apparels</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="px-2 bg-sidebar">
        <NavMain items={navigationItems} />
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-sidebar-border bg-sidebar">
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
