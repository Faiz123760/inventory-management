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
  CheckCircle2
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { useMemo, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export default function AlertsPage() {
  const { state, updateMaterial } = useAppStore();
  const { toast } = useToast();
  const [acknowledged, setAcknowledged] = useState<string[]>([]);

  const lowStockItems = useMemo(() => state.materials
    .filter((m) => m.current_stock < 50)
    .map((m) => ({
      materialId: m.material_id,
      name: m.name,
      current: `${m.current_stock} ${m.unit}`,
      min: `50 ${m.unit}`,
      status: m.current_stock < 20 ? "Critical" : "Low",
    })), [state.materials]);

  const visibleItems = lowStockItems.filter((item) => !acknowledged.includes(item.materialId));

  const handleRestock = (materialId: string) => {
    const material = state.materials.find((m) => m.material_id === materialId);
    if (!material) return;
    updateMaterial({ ...material, current_stock: material.current_stock + 100 });
    toast({ title: "Restock queued", description: `${material.name} +100 ${material.unit} added to stock.` });
  };

  return (
    <div className="flex flex-1 flex-col bg-background animate-in-fade">
      <PageHeader
        title="Alerts"
        breadcrumbs={[{ title: "Monitoring" }, { title: "Alerts" }]}
      />

      <main className="flex-1 p-3 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-4 animate-in-slide-up">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Notifications Center</h2>
            <p className="text-slate-500 text-sm">Stay informed about low stock, expiring batches, and system events.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="bg-white border-slate-200 text-slate-500 h-10 px-4 font-semibold hover:bg-slate-50" onClick={() => setAcknowledged(lowStockItems.map((i) => i.materialId))}>
              <CheckCircle2 className="mr-2 h-4 w-4 text-primary" /> Mark All Read
            </Button>
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-3 animate-in-slide-up [animation-delay:100ms]">
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-bold text-slate-500 flex items-center gap-2 mb-4">
              <AlertTriangle className="h-4 w-4 text-primary" />
              Active Stock Alerts
            </h3>
            {visibleItems.map((item) => (
              <Card key={item.materialId} className="bg-white border-slate-200 shadow-sm overflow-hidden group hover:border-primary/30 transition-all">
                <div className="flex">
                  <div  />
                  <CardContent className="flex-1 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex gap-4">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${item.status === 'Critical' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>
                          <AlertTriangle className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">{item.name} is dangerously low</h4>
                          <p className="text-sm text-slate-500 mt-1 font-medium">Current level: <span className="font-bold text-slate-900">{item.current}</span>. Minimum required: {item.min}.</p>
                          <div className="flex items-center gap-2 mt-3">
                            <Badge variant="outline" className={`text-[10px] uppercase font-bold tracking-wider ${item.status === 'Critical' ? 'border-rose-100 text-rose-700 bg-rose-50' : 'border-amber-100 text-amber-700 bg-amber-50'}`}>{item.status}</Badge>
                            <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1"><Clock className="h-3 w-3" /> 2 hours ago</span>
                          </div>
                        </div>
                      </div>
                      <Button size="sm" className="bg-primary hover:bg-primary/90 text-white font-bold h-9 px-4 rounded-lg" onClick={() => handleRestock(item.materialId)}>
                        Restock
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
            {visibleItems.length === 0 ? (
              <Card className="bg-white border-slate-200 shadow-sm">
                <CardContent className="p-8 text-center text-slate-500">No active alerts right now.</CardContent>
              </Card>
            ) : null}
          </div>

          <div className="space-y-6">
            <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
              <CardHeader className="border-b border-slate-50 bg-slate-50/30">
                <CardTitle className="text-base flex items-center gap-2 font-bold text-slate-900">
                  <Clock className="h-4 w-4 text-primary" />
                  Upcoming Expirations
                </CardTitle>
                <CardDescription className="text-slate-500 font-medium">Batches reaching shelf-life limit</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                {[1, 2].map((_, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                    <div>
                      <p className="text-sm font-bold text-primary hover:underline cursor-pointer">Batch #KP-22{i + 4}</p>
                      <p className="text-xs text-rose-600 font-bold mt-1 uppercase tracking-wider flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" /> Expires in 3 days
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-primary hover:bg-blue-50">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            
          </div>
        </div>
      </main>
    </div>
  );
}
