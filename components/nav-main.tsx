"use client";

import { type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    badge?: string | number;
  }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup className="px-0 py-0">
      <SidebarMenu className="gap-0.5">
        {items.map((item) => {
          const isActive =
            pathname === item.url || pathname.startsWith(item.url + "/");
          const Icon = item.icon;

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={isActive}
                tooltip={item.title}
                className={`
                  relative flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium
                  transition-all duration-150 cursor-pointer h-auto
                  ${isActive
                    ? "bg-blue-500/10 text-blue-400 border-l-2 border-blue-500 pl-[10px]"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                  }
                  group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2
                `}
              >
                <Link
                  href={item.url as any}
                  className="flex w-full items-center gap-3 group-data-[collapsible=icon]:justify-center"
                >
                  {Icon && (
                    <Icon
                      className={`h-4 w-4 shrink-0 transition-colors ${
                        isActive ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300"
                      }`}
                    />
                  )}
                  <span className="truncate group-data-[collapsible=icon]:hidden">
                    {item.title}
                  </span>
                  {item.badge !== undefined && (
                    <span
                      className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 group-data-[collapsible=icon]:hidden ${
                        isActive
                          ? "bg-blue-500/20 text-blue-300"
                          : "bg-white/8 text-slate-500"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
