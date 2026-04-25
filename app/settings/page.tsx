"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  User, Shield, Bell, Mail, Lock, Save, Check, Building2,
  Smartphone, Globe, Trash2, KeyRound, ArrowRight,
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
  const [activeTab, setActiveTab] = useState("profile");

  const handleSave = () => {
    setSaved(true);
    toast({ title: "Settings saved", description: "Your changes have been applied." });
    setTimeout(() => setSaved(false), 3000);
  };

  const navItems = [
    { id: "profile", label: "Profile", icon: User },
    { id: "org", label: "Organization", icon: Building2 },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "danger", label: "Danger Zone", icon: Trash2, variant: "danger" },
  ];

  return (
    <div className="flex flex-1 flex-col bg-background animate-in-fade">
      <PageHeader title="Settings" breadcrumbs={[{ title: "Administration" }, { title: "Settings" }]} />

      <main className="flex-1 p-4 space-y-4 max-w-[1200px] mx-auto w-full">
        {/* ── Page Header ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
          <div>
            <h1 className="text-[22px] font-black text-slate-900 tracking-tight">System Settings</h1>
            <p className="text-[12px] text-slate-400 font-bold uppercase tracking-widest mt-1">Manage your workspace and personal preferences</p>
          </div>
          <Button
            onClick={handleSave}
            className={`h-10 px-6 gap-2 font-bold uppercase tracking-widest text-[11px] transition-all rounded ${
              saved ? "bg-emerald-600 hover:bg-emerald-600 shadow-none" : "bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
            }`}
          >
            {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            {saved ? "All Changes Saved" : "Save Settings"}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6 items-start">
          {/* ── Side Navigation ── */}
          <aside className="space-y-1 sticky top-20">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded text-[13px] font-black uppercase tracking-wider transition-all ${
                  activeTab === item.id
                    ? (item.variant === "danger" ? "bg-rose-50 text-rose-600 border border-rose-100" : "bg-white text-primary border border-slate-200 shadow-sm")
                    : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}
          </aside>

          {/* ── Content Area ── */}
          <div className="space-y-6">
            {activeTab === "profile" && (
              <div className="animate-in-slide-up">
                <SectionCard icon={User} iconColor="bg-blue-50 text-primary" title="Profile Information" description="Update your personal account details.">
                  <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="flex flex-col items-center gap-4">
                      <div className="h-24 w-24 rounded-2xl bg-primary flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-primary/30 border-4 border-white">
                        AD
                      </div>
                      <Button variant="outline" size="sm" className="h-8 text-[11px] font-black uppercase border-slate-200 tracking-wider">Change Photo</Button>
                    </div>
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
                      <div className="space-y-1.5"><label className="field-label">Full Name</label><Input defaultValue="Admin User" className="h-10 bg-slate-50 border-slate-200 rounded text-sm" /></div>
                      <div className="space-y-1.5"><label className="field-label">Email Address</label><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" /><Input defaultValue="admin@inventorypro.com" className="h-10 bg-slate-50 border-slate-200 rounded pl-10" /></div></div>
                      <div className="space-y-1.5"><label className="field-label">Phone Number</label><div className="relative"><Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" /><Input defaultValue="+91 98765 00000" className="h-10 bg-slate-50 border-slate-200 rounded pl-10" /></div></div>
                      <div className="space-y-1.5"><label className="field-label">Current Role</label><Input disabled value="Organization Administrator" className="h-10 bg-slate-100 border-slate-200 rounded text-slate-400 opacity-70" /></div>
                    </div>
                  </div>
                </SectionCard>
              </div>
            )}

            {activeTab === "org" && (
              <div className="animate-in-slide-up">
                <SectionCard icon={Building2} iconColor="bg-violet-50 text-violet-600" title="Organization Details" description="Configure your business identity for branding.">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5"><label className="field-label">Company Name</label><Input defaultValue="Zylkar Apparels" className="h-10 bg-slate-50 border-slate-200 rounded" /></div>
                    <div className="space-y-1.5"><label className="field-label">GST / Tax ID</label><Input defaultValue="29ABCDE1234F1Z5" className="h-10 bg-slate-50 border-slate-200 rounded uppercase" /></div>
                    <div className="space-y-1.5"><label className="field-label">Official Website</label><div className="relative"><Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" /><Input defaultValue="https://zylkar.in" className="h-10 bg-slate-50 border-slate-200 rounded pl-10" /></div></div>
                    <div className="space-y-1.5"><label className="field-label">City / Region</label><Input defaultValue="Mumbai, Maharashtra" className="h-10 bg-slate-50 border-slate-200 rounded" /></div>
                    <div className="sm:col-span-2 space-y-1.5"><label className="field-label">Registered Address</label><Input defaultValue="42, Business Park, Phase II, Mumbai - 400001" className="h-10 bg-slate-50 border-slate-200 rounded" /></div>
                  </div>
                </SectionCard>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="animate-in-slide-up">
                <SectionCard icon={Bell} iconColor="bg-amber-50 text-amber-500" title="Notification Preferences" description="Manage how you receive alerts and reports.">
                  <div className="divide-y divide-slate-50">
                    <ToggleRow label="Inventory Health Reports" desc="Daily stock status summary at 8 AM via email." defaultChecked />
                    <ToggleRow label="Critical Stock Alerts" desc="Instant mobile and email notification for low stock." defaultChecked />
                    <ToggleRow label="Order Processing Updates" desc="Notify when order status changes to In Progress or Delivered." defaultChecked />
                    <ToggleRow label="Weekly Procurement Summary" desc="Summary of all purchases and vendor performance." />
                    <ToggleRow label="Marketing & Newsletter" desc="Get the latest feature updates and tips." />
                  </div>
                </SectionCard>
              </div>
            )}

            {activeTab === "security" && (
              <div className="animate-in-slide-up space-y-4">
                <SectionCard icon={Shield} iconColor="bg-emerald-50 text-emerald-600" title="Account Security" description="Enhanced protection for your workspace.">
                  <div className="divide-y divide-slate-50 mb-6">
                    <ToggleRow label="Two-Factor Authentication" desc="Require a security code on sign-in." />
                    <ToggleRow label="Security Login Alerts" desc="Email notification for every new sign-in." defaultChecked />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Button variant="outline" className="h-12 justify-between px-4 text-[13px] font-black uppercase tracking-wider border-slate-200 text-slate-700 hover:bg-slate-50 rounded group">
                      <div className="flex items-center gap-3"><Lock className="h-4 w-4 text-primary" /> Change Password</div>
                      <ArrowRight className="h-3.5 w-3.5 text-slate-300 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <Button variant="outline" className="h-12 justify-between px-4 text-[13px] font-black uppercase tracking-wider border-slate-200 text-slate-700 hover:bg-slate-50 rounded group">
                      <div className="flex items-center gap-3"><KeyRound className="h-4 w-4 text-violet-500" /> Active Sessions</div>
                      <ArrowRight className="h-3.5 w-3.5 text-slate-300 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </SectionCard>
              </div>
            )}

            {activeTab === "danger" && (
              <div className="animate-in-slide-up">
                <div className="surface border-rose-200 bg-rose-50/20">
                  <div className="surface-header border-rose-100 flex items-center justify-between">
                    <div>
                      <p className="text-[14px] font-black text-rose-700 uppercase tracking-wider">Critical Zone</p>
                      <p className="text-[12px] text-rose-400 font-bold uppercase tracking-widest mt-0.5">Destructive Actions</p>
                    </div>
                  </div>
                  <div className="surface-body space-y-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-md bg-white border border-rose-100">
                      <div>
                        <p className="text-[13px] font-black text-slate-900 uppercase tracking-wider">Delete Organization</p>
                        <p className="text-[12px] text-slate-400 font-medium mt-1">Permanently remove all data, products, and historical records.</p>
                      </div>
                      <Button variant="outline" className="h-10 px-4 border-rose-200 text-rose-600 hover:bg-rose-50 font-black uppercase tracking-widest text-[10px] rounded">Delete Workspace</Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
