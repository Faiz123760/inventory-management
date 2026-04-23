"use client";

import { BadgeCheck, Building2 } from "lucide-react";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavUser() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" className="cursor-default hover:bg-sidebar-accent/60">
          <div className="h-9 w-9 rounded-full bg-sidebar-primary text-sidebar-primary-foreground flex items-center justify-center">
            <Building2 className="h-4 w-4" />
          </div>
          <span className="flex-1 text-left text-sm font-medium">
            Demo Operator
            <span className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <BadgeCheck className="h-3.5 w-3.5 text-emerald-500" />
              Static inventory mode
            </span>
          </span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
