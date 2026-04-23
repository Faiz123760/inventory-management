"use client";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  User,
  Shield,
  Settings2,
  Bell,
  Globe,
  Save,
  Lock,
  Mail
} from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex flex-1 flex-col bg-background animate-in-fade">
      <PageHeader
        title="Settings"
        breadcrumbs={[{ title: "Administration" }, { title: "Settings" }]}
      />

      <main className="flex-1 space-y-6 p-4 md:p-8 max-w-5xl">
        <div className="animate-in-slide-up">
          <h2 className="text-3xl font-bold tracking-tight text-slate-500">System Settings</h2>
          <p className="text-slate-500 font-medium tracking-tight">Manage your profile, notifications, and security preferences.</p>
        </div>

        <div className="grid gap-6">
          {/* Profile Section */}
          <Card className="bg-white border-slate-200 rounded-xl shadow-sm overflow-hidden animate-in-slide-up [animation-delay:100ms]">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-6">
              <CardTitle className="text-xl font-bold flex items-center gap-3 text-slate-900">
                <User className="h-6 w-6 text-primary" />
                Profile Information
              </CardTitle>
              <CardDescription className="text-slate-500">Update your account details and contact information.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-10">
                <div className="flex flex-col items-center gap-4">
                  <div className="h-28 w-28 rounded-2xl bg-primary text-white flex items-center justify-center text-3xl font-bold shadow-md relative group overflow-hidden">
                    AD
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                      <Settings2 className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Change Photo</Button>
                </div>
                <div className="flex-1 grid gap-5 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-slate-600 text-xs font-semibold uppercase tracking-wider">Full Name</Label>
                    <Input id="name" defaultValue="Admin User" className="bg-slate-50 border-slate-200 text-slate-900 rounded-lg h-10" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-slate-600 text-xs font-semibold uppercase tracking-wider">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <Input id="email" defaultValue="admin@inventorypro.com" className="pl-9 bg-slate-50 border-slate-200 text-slate-900 rounded-lg h-10" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="role" className="text-slate-600 text-xs font-semibold uppercase tracking-wider">User Role</Label>
                    <Input id="role" value="Organization Administrator" disabled className="bg-slate-100 border-slate-200 text-slate-500 rounded-lg h-10" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-slate-600 text-xs font-semibold uppercase tracking-wider">Phone Number</Label>
                    <Input id="phone" defaultValue="+91 98765 00000" className="bg-slate-50 border-slate-200 text-slate-900 rounded-lg h-10" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Settings */}
          <div className="grid gap-6 md:grid-cols-2 animate-in-slide-up [animation-delay:200ms]">
            <Card className="bg-white border-slate-200 rounded-xl shadow-sm">
              <CardHeader className="p-6 pb-2">
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-900">
                  <Bell className="h-5 w-5 text-blue-500" />
                  Notifications
                </CardTitle>
                <CardDescription className="text-slate-500 text-sm">Control how you receive system alerts.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-slate-900 font-semibold">Inventory Reports</Label>
                    <p className="text-xs text-slate-500">Receive daily stock status summaries.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-slate-900 font-semibold">Low Stock Alerts</Label>
                    <p className="text-xs text-slate-500">Instant ping for critical stock levels.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200 rounded-xl shadow-sm">
              <CardHeader className="p-6 pb-2">
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-900">
                  <Shield className="h-5 w-5 text-emerald-500" />
                  Security
                </CardTitle>
                <CardDescription className="text-slate-500 text-sm">Protect your account and organization.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-slate-900 font-semibold">Two-Factor Authentication</Label>
                    <p className="text-xs text-slate-500">Add an extra layer of protection.</p>
                  </div>
                  <Switch />
                </div>
                <Button variant="outline" className="w-full justify-start">
                  <Lock className="mr-3 h-4 w-4 text-primary" /> Reset Password
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-8 animate-in-slide-up [animation-delay:300ms]">
            <Button variant="outline">Cancel</Button>
            <Button>
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
