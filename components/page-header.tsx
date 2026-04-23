import { Bell, Search, User } from 'lucide-react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface PageHeaderProps {
  title: string
  breadcrumbs?: { title: string; href?: string }[]
}

export function PageHeader({ title, breadcrumbs }: PageHeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 sticky top-0 z-50 rounded-md">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1 text-slate-500 hover:text-primary" />
        <Separator
          orientation="vertical"
          className="mr-2 h-4 bg-slate-200"
        />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs?.map((breadcrumb, index) =>
              [
                <BreadcrumbItem key={breadcrumb.title} className={index === 0 ? "hidden md:block text-slate-500 font-medium" : "font-semibold text-slate-900"}>
                  {breadcrumb.href ? (
                    <BreadcrumbLink href={breadcrumb.href} className="hover:text-primary transition-colors">
                      {breadcrumb.title}
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage className="text-slate-900 font-semibold">{breadcrumb.title}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>,
                index < breadcrumbs.length - 1 && (
                  <BreadcrumbSeparator key={breadcrumb.title + "-sep"} className="hidden md:block text-slate-300" />
                )
              ]
            )}
            {!breadcrumbs && (
              <BreadcrumbItem>
                <BreadcrumbPage className="font-semibold text-slate-900">{title}</BreadcrumbPage>
              </BreadcrumbItem>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex flex-1 items-center justify-end gap-4 md:gap-6">
        <div className="relative hidden w-full max-w-[350px] md:block">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            type="search"
            placeholder="Search items, orders..."
            className="w-full bg-slate-50 border-slate-200 text-slate-900 pl-9 focus-visible:ring-primary h-9"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative text-slate-500 hover:text-slate-900 hover:bg-slate-100 h-9 w-9">
            <Bell className="h-5 w-5" />
            <span className="absolute right-2.5 top-2.5 flex h-2 w-2 rounded-full bg-primary" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full hover:bg-slate-100 p-0">
                <Avatar className="h-8 w-8 border border-slate-200">
                  <AvatarImage src="/avatar.png" alt="Admin" />
                  <AvatarFallback className="bg-primary text-white font-bold text-xs">AD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-white border-slate-200 text-slate-900 shadow-lg" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold leading-none">Admin Profile</p>
                  <p className="text-xs leading-none text-slate-500">admin@inventorypro.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">My Profile</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">Organization Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 cursor-pointer font-semibold">Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
