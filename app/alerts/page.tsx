"use client";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  Clock,
  ArrowRight,
  ShieldAlert,
  Info,
  CheckCircle2,
  Bell,
  ShoppingCart
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { useMemo, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface NotificationItem {
  materialId: string;
  name: string;
  current: string;
  min: string;
  status: string;
  type: string;
  desc?: string;
}

export default function AlertsPage() {
  const { state, updateMaterial } = useAppStore();
  const { toast } = useToast();
  const [acknowledged, setAcknowledged] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("all");

  const lowStockItems = useMemo((): NotificationItem[] => state.materials
    .filter((m) => m.current_stock < 50)
    .map((m) => ({
      materialId: m.material_id,
      name: m.name,
      current: `${m.current_stock} ${m.unit}`,
      min: `50 ${m.unit}`,
      status: m.current_stock < 20 ? "Critical" : "Low",
      type: "stock"
    })), [state.materials]);

  const notifications: NotificationItem[] = [
    ...lowStockItems,
    { materialId: "SYS-001", name: "System Maintenance", current: "Planned", min: "Tomorrow", status: "Info", type: "system", desc: "Database optimization scheduled for 2 AM." },
    { materialId: "ORD-999", name: "Bulk Order Pending", current: "500 units", min: "Urgent", status: "Warning", type: "order", desc: "Order #ORD-2024-001 requires manual approval." }
  ];

  const visibleItems = notifications.filter((item) => !acknowledged.includes(item.materialId) && (activeTab === "all" || item.type === activeTab));

  const handleRestock = (materialId: string) => {
    const material = state.materials.find((m) => m.material_id === materialId);
    if (!material) return;
    updateMaterial({ ...material, current_stock: material.current_stock + 100 });
    toast({ title: "Restock queued", description: `${material.name} +100 ${material.unit} added to stock.` });
  };

  const tabs = [
    { id: "all", label: "All Alerts", icon: Bell },
    { id: "stock", label: "Low Stock", icon: AlertTriangle },
    { id: "order", label: "Orders", icon: ShoppingCart },
    { id: "system", label: "System", icon: Info },
  ];

  return (
    <div className="flex flex-1 flex-col bg-background animate-in-fade">
      <PageHeader title="Notifications" breadcrumbs={[{ title: "Monitoring" }, { title: "Notifications" }]} />

      <main className="flex-1 p-3 space-y-3 max-w-[1800px] mx-auto w-full">
        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-1">
          <div>
            <h1 className="text-[18px] font-black text-slate-900 tracking-tight">Notifications Center</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Real-time alerts for stock, orders, and system health</p>
          </div>
          <Button 
            variant="outline" 
            className="h-10 px-6 font-bold uppercase tracking-widest text-[11px] border-slate-200 text-slate-600 hover:bg-slate-50 transition-all rounded"
            onClick={() => setAcknowledged(notifications.map(n => n.materialId))}
          >
            <CheckCircle2 className="mr-2 h-4 w-4 text-primary" /> Mark All as Read
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_280px] gap-6 items-start">
          {/* ── Left Sidebar (Tabs) ── */}
          <aside className="space-y-1 sticky top-20">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded text-[12px] font-black uppercase tracking-wider transition-all ${
                  activeTab === tab.id
                    ? "bg-white text-primary border border-slate-200 shadow-sm"
                    : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                }`}
              >
                <div className="flex items-center gap-3">
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </div>
                {notifications.filter(n => n.type === tab.id).length > 0 && (
                  <span className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px]">
                    {notifications.filter(n => n.type === tab.id).length}
                  </span>
                )}
              </button>
            ))}
          </aside>

          {/* ── Central Feed ── */}
          <div className="space-y-3">
            {visibleItems.length > 0 ? (
              visibleItems.map((item) => (
                <Card key={item.materialId} className="bg-white border-slate-200 shadow-sm overflow-hidden hover:border-primary/20 transition-all group rounded">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={`h-10 w-10 rounded flex items-center justify-center shrink-0 ${
                        item.status === "Critical" ? "bg-rose-50 text-rose-600" : 
                        item.status === "Warning" ? "bg-amber-50 text-amber-600" : 
                        "bg-blue-50 text-blue-600"
                      }`}>
                        {item.type === "stock" ? <AlertTriangle className="h-5 w-5" /> : 
                         item.type === "order" ? <ShoppingCart className="h-5 w-5" /> : 
                         <Info className="h-5 w-5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="text-[14px] font-black text-slate-900 tracking-tight leading-none uppercase">
                              {item.name} {item.type === 'stock' ? 'is Low' : ''}
                            </h4>
                            <p className="text-[12px] text-slate-500 font-medium mt-1.5 leading-relaxed">
                              {item.type === 'stock' 
                                ? `Current stock: ${item.current}. Minimum threshold: ${item.min}.`
                                : item.desc}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-2 shrink-0">
                            <Badge className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                              item.status === "Critical" ? "bg-rose-100 text-rose-700" :
                              item.status === "Warning" ? "bg-amber-100 text-amber-700" :
                              "bg-blue-100 text-blue-700"
                            }`}>
                              {item.status}
                            </Badge>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">2h ago</span>
                          </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between pt-4 border-t border-slate-50">
                          <button 
                            onClick={() => setAcknowledged(prev => [...prev, item.materialId])}
                            className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors"
                          >
                            Dismiss
                          </button>
                          {item.type === "stock" && (
                            <Button size="sm" className="bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-[10px] h-8 px-4 rounded" onClick={() => handleRestock(item.materialId)}>
                              Initiate Restock
                            </Button>
                          )}
                          {item.type === "order" && (
                            <Button variant="outline" size="sm" className="border-slate-200 text-slate-600 hover:bg-slate-50 font-black uppercase tracking-widest text-[10px] h-8 px-4 rounded">
                              View Order
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-white border border-dashed border-slate-200 rounded-lg">
                <CheckCircle2 className="h-10 w-10 text-slate-200 mb-3" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[11px]">All clear! No active notifications.</p>
              </div>
            )}
          </div>

          {/* ── Right Sidebar (Insights) ── */}
          <aside className="space-y-4 sticky top-20">
            <Card className="bg-[#021a41] border-none shadow-xl shadow-blue-900/20 text-white overflow-hidden rounded">
              <CardHeader className="pb-3 pt-4 px-4">
                <CardTitle className="text-[11px] font-black uppercase tracking-[2px] opacity-60">System Health</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">Inventory Status</span>
                  <span className="text-xs font-black text-emerald-400 uppercase">Optimal</span>
                </div>
                <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 w-[92%]" />
                </div>
                <p className="text-[10px] text-slate-400 leading-normal">92% of your stock items are above the minimum threshold levels.</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200 shadow-sm rounded">
              <CardHeader className="pb-3 pt-4 px-4 border-b border-slate-50">
                <CardTitle className="text-[11px] font-black uppercase tracking-[2px] text-slate-500">Upcoming Expirations</CardTitle>
              </CardHeader>
              <CardContent className="px-4 py-4 space-y-4">
                {[1, 2].map((_, i) => (
                  <div key={i} className="flex items-center justify-between gap-3 group">
                    <div className="min-w-0">
                      <p className="text-[11px] font-black text-slate-900 uppercase truncate">Batch #KP-22{i + 4}</p>
                      <p className="text-[10px] text-rose-500 font-bold mt-0.5 uppercase tracking-tighter">Expires in 3 days</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded bg-slate-50 text-slate-400 group-hover:text-primary transition-colors">
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  );
}
