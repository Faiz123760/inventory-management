"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  User, Shield, Bell, Mail, Lock, Save, Check, Building2,
  Smartphone, Globe, Trash2, KeyRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

function SectionCard({ icon: Icon, iconColor, title, description, children }: {
  icon: LucideIcon; iconColor: string; title: string; description: string; children: React.ReactNode;
}) {
  return (
    <div className="surface">
      <div className="surface-header flex items-start gap-4">
        <div className={`h-9 w-9 rounded-md flex items-center justify-center flex-shrink-0 ${iconColor}`}>
          <Icon className="h-4.5 w-4.5" />
        </div>
        <div>
          <p className="text-[14px] font-semibold text-slate-900">{title}</p>
          <p className="text-[12px] text-slate-400 mt-0.5">{description}</p>
        </div>
      </div>
      <div className="surface-body">{children}</div>
    </div>
  );
}

function ToggleRow({ label, desc, defaultChecked = false }: { label: string; desc: string; defaultChecked?: boolean }) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
      <div>
        <p className="text-[13px] font-semibold text-slate-800">{label}</p>
        <p className="text-[11px] text-slate-400 mt-0.5">{desc}</p>
      </div>
      <Switch checked={checked} onCheckedChange={setChecked} className="flex-shrink-0" />
    </div>
  );
}

export default function SettingsPage() {
  const { toast } = useToast();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    toast({ title: "Settings saved", description: "Your changes have been applied." });
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex flex-1 flex-col bg-background animate-in-fade">
      <PageHeader title="Settings" breadcrumbs={[{ title: "Administration" }, { title: "Settings" }]} />

      <main className="flex-1 p-3 space-y-3 max-w-4xl">
        {/* ── Page Header ── */}
        <div className="page-section-header animate-in-slide-up">
          <div>
            <h1 className="page-title">System Settings</h1>
            <p className="page-subtitle">Manage your profile, notifications, and security preferences.</p>
          </div>
          <Button
            size="sm"
            onClick={handleSave}
            className={`h-9 gap-2 font-medium rounded-md transition-all ${
              saved ? "bg-emerald-600 hover:bg-emerald-600 shadow-none" : "bg-primary hover:bg-primary/90 shadow-sm shadow-primary/20"
            }`}
          >
            {saved ? <Check className="h-3.5 w-3.5" /> : <Save className="h-3.5 w-3.5" />}
            {saved ? "Saved!" : "Save Changes"}
          </Button>
        </div>

        {/* ── Profile Card ── */}
        <SectionCard icon={User} iconColor="bg-blue-50 text-primary" title="Profile Information" description="Update your account details and display name.">
          <div className="flex flex-col sm:flex-row gap-8">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-3 flex-shrink-0">
              <div className="relative group">
                <div className="h-20 w-20 rounded-md bg-primary flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-primary/20">
                  AD
                </div>
                <div className="absolute inset-0 rounded-md bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                  <span className="text-white text-[10px] font-bold">Change</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="h-7 text-[11px] border-slate-200 text-slate-500 hover:text-slate-700 rounded-md">
                Upload Photo
              </Button>
            </div>

            {/* Fields */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="field-label">Full Name</label>
                <Input defaultValue="Admin User" className="h-9 bg-slate-50 border-slate-200 rounded-md text-sm text-slate-900" />
              </div>
              <div>
                <label className="field-label">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <Input defaultValue="admin@inventorypro.com" className="h-9 bg-slate-50 border-slate-200 rounded-md text-sm text-slate-900 pl-8" />
                </div>
              </div>
              <div>
                <label className="field-label">Phone Number</label>
                <div className="relative">
                  <Smartphone className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <Input defaultValue="+91 98765 00000" className="h-9 bg-slate-50 border-slate-200 rounded-md text-sm text-slate-900 pl-8" />
                </div>
              </div>
              <div>
                <label className="field-label">Role</label>
                <Input disabled value="Organization Administrator" className="h-9 bg-slate-100 border-slate-200 rounded-md text-sm text-slate-400 cursor-not-allowed" />
              </div>
            </div>
          </div>
        </SectionCard>

        {/* ── Organization Card ── */}
        <SectionCard icon={Building2} iconColor="bg-violet-50 text-violet-600" title="Organization" description="Business identity used on invoices and reports.">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="field-label">Company Name</label>
              <Input defaultValue="Zylkar Apparels" className="h-9 bg-slate-50 border-slate-200 rounded-md text-sm text-slate-900" />
            </div>
            <div>
              <label className="field-label">GST Number</label>
              <Input defaultValue="29ABCDE1234F1Z5" className="h-9 bg-slate-50 border-slate-200 rounded-md text-sm text-slate-900" />
            </div>
            <div>
              <label className="field-label">Website</label>
              <div className="relative">
                <Globe className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <Input defaultValue="https://zylkar.in" className="h-9 bg-slate-50 border-slate-200 rounded-md text-sm text-slate-900 pl-8" />
              </div>
            </div>
            <div>
              <label className="field-label">City</label>
              <Input defaultValue="Mumbai, Maharashtra" className="h-9 bg-slate-50 border-slate-200 rounded-md text-sm text-slate-900" />
            </div>
          </div>
        </SectionCard>

        {/* ── 2-Col: Notifications + Security ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 animate-in-slide-up [animation-delay:100ms]">
          {/* Notifications */}
          <SectionCard icon={Bell} iconColor="bg-blue-50 text-blue-500" title="Notifications" description="Control when and how alerts are delivered.">
            <div className="divide-y divide-slate-100">
              <ToggleRow label="Inventory Reports" desc="Daily stock status summary at 8 AM." defaultChecked />
              <ToggleRow label="Low Stock Alerts" desc="Instant notification for critical stock." defaultChecked />
              <ToggleRow label="Order Updates" desc="Notify when order status changes." defaultChecked />
              <ToggleRow label="Purchase Reminders" desc="Weekly procurement summary." />
            </div>
          </SectionCard>

          {/* Security */}
          <SectionCard icon={Shield} iconColor="bg-emerald-50 text-emerald-600" title="Security" description="Protect your account and data.">
            <div className="divide-y divide-slate-100">
              <ToggleRow label="Two-Factor Authentication" desc="Add an extra layer of protection." />
              <ToggleRow label="Login Alerts" desc="Email me on new device sign-in." defaultChecked />
            </div>
            <div className="mt-4 space-y-2">
              <Button variant="outline" className="w-full justify-start h-9 text-[13px] border-slate-200 text-slate-600 hover:bg-slate-50 rounded-md gap-2">
                <Lock className="h-3.5 w-3.5 text-primary" /> Change Password
              </Button>
              <Button variant="outline" className="w-full justify-start h-9 text-[13px] border-slate-200 text-slate-600 hover:bg-slate-50 rounded-md gap-2">
                <KeyRound className="h-3.5 w-3.5 text-violet-500" /> View Active Sessions
              </Button>
            </div>
          </SectionCard>
        </div>

        {/* ── Danger Zone ── */}
        <div className="surface border-rose-200/60">
          <div className="surface-header border-rose-100/60">
            <p className="text-[14px] font-semibold text-rose-700">Danger Zone</p>
            <p className="text-[12px] text-rose-400 mt-0.5">These actions are destructive and cannot be undone.</p>
          </div>
          <div className="surface-body flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-[13px] font-semibold text-slate-900">Delete Organization Account</p>
              <p className="text-[12px] text-slate-400 mt-0.5">This will permanently delete all data, products, and records.</p>
            </div>
            <Button variant="outline" size="sm" className="h-9 border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 rounded-md gap-2 flex-shrink-0">
              <Trash2 className="h-3.5 w-3.5" /> Delete Account
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
