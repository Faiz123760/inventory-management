"use client";

import * as React from "react";
import {
  LayoutDashboard,
  Package,
  Factory,
  ShoppingCart,
  Users,
  User,
  History,
  Settings2,
  Bell,
  ChevronsUpDown,
  
  ClipboardList,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NavMain } from "@/components/nav-main";

const data = {
  user: {
    name: "Admin User",
    email: "admin@powerpixel.com",
    avatar: "/avatars/admin.png",
  },
  navMain: [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Products", url: "/products", icon: Package },
    { title: "Raw Materials", url: "/raw-materials", icon: Factory },
    { title: "Bill of Materials", url: "/bom", icon: ClipboardList },
  ],
  sales: [
    { title: "Orders", url: "/orders", icon: ShoppingCart },
    { title: "Purchase History", url: "/purchases", icon: History },

    { title: "Customers", url: "/customers", icon: User },
    { title: "Suppliers", url: "/suppliers", icon: Users },
  ],
  system: [
    { title: "Notifications", url: "/alerts", icon: Bell },
    { title: "Settings", url: "/settings", icon: Settings2 },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();
  // const [activeWorkspace, setActiveWorkspace] = React.useState(data.workspaces[0]);

  return (
    <Sidebar
      variant="inset"
      collapsible="icon"
      className="border-r-0"
      {...props}
    >
      <SidebarHeader className="p-4 border-b border-white/5">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-white/5 data-[state=open]:text-white hover:bg-white/5 hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={data.user.avatar} alt={data.user.name} />
                      <AvatarFallback className="rounded-lg bg-primary text-white font-bold">
                        AD
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{data.user.name}</span>
                      <span className="truncate text-xs text-slate-500">{data.user.email}</span>
                    </div>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>

            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="gap-0 py-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <NavMain items={[...data.navMain, ...data.sales, ...data.system]} />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ── User Footer ── */}
      <SidebarFooter className="p-4 border-t border-white/5">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-white/5 data-[state=open]:text-white hover:bg-white/5 hover:text-white transition-colors"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={data.user.avatar} alt={data.user.name} />
                    <AvatarFallback className="rounded-lg bg-primary text-white font-bold">
                      AD
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                    <span className="truncate font-semibold text-slate-200">
                      {data.user.name}
                    </span>
                    <span className="truncate text-xs text-slate-500">
                      {data.user.email}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4 text-slate-500 group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-sidebar border-white/10 text-slate-200"
                side={state === "collapsed" ? "right" : "bottom"}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={data.user.avatar} alt={data.user.name} />
                      <AvatarFallback className="rounded-lg bg-blue-600 text-white font-bold">
                        AD
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{data.user.name}</span>
                      <span className="truncate text-xs text-slate-500">{data.user.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem className="hover:bg-white/5 cursor-pointer">Account Settings</DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-white/5 cursor-pointer">Billing</DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem className="text-red-400 hover:bg-red-500/10 cursor-pointer">
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
