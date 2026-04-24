"use client";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import {
  Plus, Search, ShoppingCart, CheckCircle2, Truck, Save, Package, Trash2,
  IndianRupee, Clock,
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useState, useMemo } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAppStore } from "@/lib/store";

export default function PurchasesPage() {
  const { toast } = useToast();
  const { state, addPurchase, updatePurchaseStatus, deletePurchase } = useAppStore();

  const purchases = state.purchases;
  const suppliers = state.suppliers;
  const materials = state.materials;

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState({ supplier: "", material: "", quantity: "", cost: "" });

  const filtered = useMemo(() => {
    return purchases.filter((p) => {
      const matchesSearch =
        p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.materialName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || p.status.toLowerCase().replace(" ", "-") === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [purchases, searchTerm, statusFilter]);

  const handleAddPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    const supplier = suppliers.find((s) => s.id === form.supplier);
    const material = materials.find((m) => m.material_id === form.material);
    const quantity = Number(form.quantity);
    const unitCost = Number(form.cost);

    if (!supplier || !material || !quantity || !unitCost) return;

    const purchase = {
      id: `PO${String(Date.now()).slice(-6)}`,
      date: new Date().toISOString().split("T")[0],
      supplierId: supplier.id,
      supplierName: supplier.name,
      materialId: material.material_id,
      materialName: material.name,
      quantity,
      unit: material.unit,
      unitCost,
      totalCost: quantity * unitCost,
      status: "Processing" as const,
    };

    addPurchase(purchase);
    setIsDialogOpen(false);
    setForm({ supplier: "", material: "", quantity: "", cost: "" });
    toast({ title: "Purchase order created", description: `${purchase.id} placed with ${purchase.supplierName}.` });
  };

  const deliveredCount = purchases.filter((p) => p.status === "Delivered").length;
  const inTransitCount = purchases.filter((p) => p.status === "In Transit").length;
  const processingCount = purchases.filter((p) => p.status === "Processing").length;
  const totalSpend = purchases.reduce((s, p) => s + p.totalCost, 0);

  const estimatedTotal = Number(form.quantity) * Number(form.cost);

  return (
    <div className="flex flex-1 flex-col bg-background animate-in-fade">
      <PageHeader
        title="Purchase Orders"
        breadcrumbs={[{ title: "Finance" }, { title: "Purchases" }]}
      />

      <main className="flex-1 space-y-6 p-4 md:p-8">
        <div className="page-section-header animate-in-slide-up">
          <div>
            <h1 className="page-title">Purchasing & Procurement</h1>
            <p className="page-subtitle">Track acquisitions, pending shipments, and raw material costs.</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-white shadow-sm rounded-md h-10 px-5 font-semibold gap-2">
                <Plus className="h-4 w-4" /> New Purchase
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-white border-none rounded-md shadow-2xl p-0 overflow-hidden">
              <DialogHeader className="px-5 pt-5 pb-3 border-b border-slate-50 bg-slate-50/30">
                <DialogTitle className="text-lg font-black tracking-tight text-slate-900">Create Purchase Order</DialogTitle>
                <DialogDescription className="text-slate-500 font-medium text-[12px]">
                  Place a new order with a supplier for raw materials.
                </DialogDescription>
              </DialogHeader>
              <div className="no-scrollbar max-h-[70vh] overflow-y-auto px-5 py-3">
                <form className="space-y-4" onSubmit={handleAddPurchase}>
                  {/* Supplier & Material */}
                  <div className="grid gap-x-4 gap-y-3 md:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider">Supplier</Label>
                      <Select value={form.supplier} onValueChange={(v) => setForm({ ...form, supplier: v })}>
                        <SelectTrigger className="h-9 w-full bg-slate-50/50 border-slate-200 text-slate-900 rounded-md text-sm">
                          <SelectValue placeholder="Select supplier..." />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-slate-200 rounded-md shadow-2xl">
                          {suppliers.map((s) => (
                            <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider">Raw Material</Label>
                      <Select value={form.material} onValueChange={(v) => setForm({ ...form, material: v })}>
                        <SelectTrigger className="h-9 w-full bg-slate-50/50 border-slate-200 text-slate-900 rounded-md text-sm">
                          <SelectValue placeholder="Select material..." />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-slate-200 rounded-md shadow-2xl">
                          {materials.map((r) => (
                            <SelectItem key={r.material_id} value={r.material_id}>
                              {r.name} ({r.unit})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Quantity & Cost */}
                  <div className="grid gap-x-4 gap-y-3 md:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider">Quantity</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        required
                        className="h-9 bg-slate-50/50 border-slate-200 rounded-md text-slate-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        value={form.quantity}
                        onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider">Cost / Unit (₹)</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-xs">₹</span>
                        <Input
                          type="number"
                          placeholder="0.00"
                          required
                          className="h-9 bg-slate-50/50 border-slate-200 rounded-md text-slate-900 pl-8 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                          value={form.cost}
                          onChange={(e) => setForm({ ...form, cost: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Summary & Submit */}
                  <div className="pt-2 space-y-4">
                    <div className="flex justify-between items-end px-4">
                      <div className="space-y-0.5">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Estimated Total</p>
                        <p className="text-3xl font-black text-slate-900 tracking-tighter">
                          ₹{(estimatedTotal > 0 ? estimatedTotal : 0).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right space-y-0.5 opacity-60">
                        <p className="text-[11px] font-medium text-slate-500">
                          {form.quantity && form.cost ? `${form.quantity} × ₹${form.cost}` : "—"}
                        </p>
                      </div>
                    </div>
                    <Button type="submit" className="w-full h-11 bg-[#021a41] hover:bg-[#03255a] text-white font-bold rounded-md shadow-lg shadow-blue-900/10 gap-2 text-sm transition-all active:scale-[0.98]">
                      <Save className="h-4 w-4" /> Place Purchase Order
                    </Button>
                  </div>
                </form>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-4 animate-in-slide-up [animation-delay:50ms]">
          <div className="stat-card">
            <div className="stat-icon bg-blue-50"><ShoppingCart className="h-5 w-5 text-primary" /></div>
            <div><p className="stat-label">Total POs</p><p className="stat-value">{purchases.length}</p></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon bg-emerald-50"><CheckCircle2 className="h-5 w-5 text-emerald-500" /></div>
            <div><p className="stat-label">Delivered</p><p className="stat-value">{deliveredCount}</p></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon bg-amber-50"><Truck className="h-5 w-5 text-amber-500" /></div>
            <div><p className="stat-label">In Transit</p><p className="stat-value">{inTransitCount}</p></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon bg-violet-50"><IndianRupee className="h-5 w-5 text-violet-500" /></div>
            <div><p className="stat-label">Total Spend</p><p className="stat-value text-xl">₹{totalSpend.toLocaleString()}</p></div>
          </div>
        </div>

        {/* Table */}
        <Card className="bg-white border-slate-200 shadow-sm overflow-hidden rounded-xl animate-in-slide-up [animation-delay:100ms]">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 bg-slate-50/50 p-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search purchases..."
                className="pl-8 bg-white border-slate-200 text-slate-900 h-9 rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              {["all", "processing", "in-transit", "delivered", "cancelled"].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all capitalize ${statusFilter === s
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {s === "all" ? "All" : s === "in-transit" ? "In Transit" : s}
                </button>
              ))}
            </div>
          </div>

          <Table>
            <TableHeader className="bg-slate-50/80">
              <TableRow className="border-slate-100 hover:bg-transparent">
                <TableHead className="pl-6 w-32 text-slate-500 uppercase text-[10px] font-bold tracking-wider py-4">Order ID</TableHead>
                <TableHead className="text-slate-500 uppercase text-[10px] font-bold tracking-wider py-4">Date</TableHead>
                <TableHead className="text-slate-500 uppercase text-[10px] font-bold tracking-wider py-4">Supplier</TableHead>
                <TableHead className="text-slate-500 uppercase text-[10px] font-bold tracking-wider py-4">Material</TableHead>
                <TableHead className="text-slate-500 uppercase text-[10px] font-bold tracking-wider py-4">Qty</TableHead>
                <TableHead className="text-slate-500 uppercase text-[10px] font-bold tracking-wider py-4">Amount</TableHead>
                <TableHead className="text-slate-500 uppercase text-[10px] font-bold tracking-wider py-4">Status</TableHead>
                <TableHead className="text-right pr-6 text-slate-500 uppercase text-[10px] font-bold tracking-wider py-4">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-slate-400">
                    <Package className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    <p className="font-semibold">No purchase orders found</p>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((order) => (
                  <TableRow key={order.id} className="border-slate-100 hover:bg-slate-50/50 transition-colors group">
                    <TableCell className="pl-6 py-4 font-semibold text-primary">{order.id}</TableCell>
                    <TableCell className="text-slate-500 text-xs font-medium">{order.date}</TableCell>
                    <TableCell className="font-semibold text-slate-900">{order.supplierName}</TableCell>
                    <TableCell className="text-slate-600 text-sm font-medium">{order.materialName}</TableCell>
                    <TableCell className="text-slate-600 text-sm font-medium">{order.quantity} {order.unit}</TableCell>
                    <TableCell className="font-bold text-slate-900">₹{order.totalCost.toLocaleString()}</TableCell>
                    <TableCell>
                      <Select value={order.status} onValueChange={(v) => updatePurchaseStatus(order.id, v as typeof order.status)}>
                        <SelectTrigger className="h-8 w-32 text-[11px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Processing">Processing</SelectItem>
                          <SelectItem value="In Transit">In Transit</SelectItem>
                          <SelectItem value="Delivered">Delivered</SelectItem>
                          <SelectItem value="Cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Button variant="ghost" size="icon" onClick={() => deletePurchase(order.id)}>
                        <Trash2 className="h-4 w-4 text-rose-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </main>
    </div>
  );
}
