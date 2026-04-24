"use client";

import { Bell, Search, Settings, ChevronRight, HelpCircle } from "lucide-react";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink,
  BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";

interface PageHeaderProps {
  title: string;
  breadcrumbs?: { title: string; href?: string }[];
}

export function PageHeader({ title, breadcrumbs }: PageHeaderProps) {
  return (
    <header className="flex h-13 shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white/98 backdrop-blur px-4 sticky top-0 z-50">
      {/* ── Left: Trigger + Breadcrumbs ── */}
      <div className="flex items-center gap-2 min-w-0">
        <SidebarTrigger className="-ml-1 h-8 w-8 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors flex-shrink-0" />
        <Separator orientation="vertical" className="h-4 bg-slate-200 flex-shrink-0" />

        <Breadcrumb>
          <BreadcrumbList className="flex-nowrap">
            {breadcrumbs?.map((crumb, index) =>
              [
                <BreadcrumbItem key={crumb.title} className="flex-shrink-0">
                  {index < breadcrumbs.length - 1 ? (
                    <BreadcrumbLink
                      href={crumb.href || "#"}
                      className="hidden sm:block text-[12px] font-medium text-slate-400 hover:text-slate-700 transition-colors"
                    >
                      {crumb.title}
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage className="text-[12px] font-semibold text-slate-700">
                      {crumb.title}
                    </BreadcrumbPage>
                  )}
                </BreadcrumbItem>,
                index < breadcrumbs.length - 1 && (
                  <BreadcrumbSeparator key={crumb.title + "-sep"} className="hidden sm:flex text-slate-300">
                    <ChevronRight className="h-3 w-3" />
                  </BreadcrumbSeparator>
                ),
              ]
            )}
            {!breadcrumbs && (
              <BreadcrumbItem>
                <BreadcrumbPage className="text-[12px] font-semibold text-slate-700">{title}</BreadcrumbPage>
              </BreadcrumbItem>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* ── Right: Actions ── */}
      <div className="flex items-center gap-1.5">
        {/* Global Search */}
        <div className="relative hidden lg:block">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          <Input
            type="search"
            placeholder="Search dashboard…"
            className="w-56 h-8 pl-8 bg-slate-50/50 border-slate-200/60 text-slate-800 text-[13px] rounded-md placeholder:text-slate-400 focus-visible:ring-blue-500/10 focus-visible:border-blue-400/50 transition-all"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden xl:inline-flex items-center px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[9px] font-black text-slate-400 pointer-events-none shadow-sm">
            ⌘K
          </kbd>
        </div>

        <Separator orientation="vertical" className="h-4 bg-slate-200 hidden lg:block" />

        {/* Help */}
        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors hidden sm:flex" aria-label="Help">
          <HelpCircle className="h-4 w-4" />
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative h-8 w-8 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors" aria-label="Notifications">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-blue-500 ring-2 ring-white" />
        </Button>

        {/* Settings */}
        <Link href="/settings">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors hidden sm:flex" aria-label="Settings">
            <Settings className="h-4 w-4" />
          </Button>
        </Link>

        <Separator orientation="vertical" className="h-4 bg-slate-200" />

        {/* User Avatar */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 rounded-full p-0 hover:ring-2 hover:ring-blue-500/20 transition-all" aria-label="User menu">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-blue-600 text-white font-bold text-[11px] tracking-wide">
                  AD
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-60 bg-white border-slate-200 shadow-2xl rounded-md overflow-hidden p-0" align="end" sideOffset={8}>
            <DropdownMenuLabel className="px-4 py-4 border-b border-slate-50 bg-slate-50/30">
              <div className="flex items-center gap-2.5">
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback className="bg-blue-600 text-white text-[11px] font-bold">AD</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-[13px] font-semibold text-slate-900">Admin User</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">admin@powerpixel.com</p>
                </div>
              </div>
            </DropdownMenuLabel>
            <div className="p-1.5">
              <DropdownMenuItem className="text-[13px] text-slate-700 rounded-md px-2.5 py-2 cursor-pointer hover:bg-slate-50">My Profile</DropdownMenuItem>
              <DropdownMenuItem className="text-[13px] text-slate-700 rounded-md px-2.5 py-2 cursor-pointer hover:bg-slate-50">Organization Settings</DropdownMenuItem>
              <DropdownMenuItem className="text-[13px] text-slate-700 rounded-md px-2.5 py-2 cursor-pointer hover:bg-slate-50">Keyboard Shortcuts</DropdownMenuItem>
            </div>
            <DropdownMenuSeparator className="bg-slate-50 mx-1.5" />
            <div className="p-1.5">
              <DropdownMenuItem className="text-[13px] text-red-600 rounded-md px-2.5 py-2 cursor-pointer hover:bg-red-50 font-bold">Sign out</DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
