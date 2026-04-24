"use client";

import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus, Package, ShoppingCart, TrendingUp, Save, Factory, Bell,
  BarChart3, ArrowRight, AlertTriangle, Zap, Trash2,
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
  PieChart, Pie, Cell,
} from "recharts";
import { stockTrendsData, weeklyActivity, Product, RawMaterial } from "@/lib/snack-mock-data";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { useAppStore } from "@/lib/store";

export default function DashboardPage() {
  const { toast } = useToast();
  const { state, addProduct, addMaterial, totalRevenue, lowStockCount, pendingOrdersCount } = useAppStore();

  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isMaterialDialogOpen, setIsMaterialDialogOpen] = useState(false);
  const [productForm, setProductForm] = useState({ id: "", name: "", category: "dalmoth", unit: "packets", price: "", sku: "" });
  const [materialForm, setMaterialForm] = useState({ id: "", name: "", unit: "kg", stock: "", cost: "" });
  const [productMaterials, setProductMaterials] = useState<Array<{ materialId: string; quantity: string }>>([
    { materialId: "", quantity: "" },
  ]);

  const addProductMaterialRow = () => {
    setProductMaterials((prev) => [...prev, { materialId: "", quantity: "" }]);
  };

  const removeProductMaterialRow = (index: number) => {
    setProductMaterials((prev) => {
      if (prev.length === 1) return [{ materialId: "", quantity: "" }];
      return prev.filter((_, i) => i !== index);
    });
  };

  const updateProductMaterialRow = (index: number, field: "materialId" | "quantity", value: string) => {
    setProductMaterials((prev) => prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.id || !productForm.name || !productForm.price) return;
    const p: Product = {
      product_id: productForm.id,
      name: productForm.name,
      category: productForm.category as "dalmoth" | "chips",
      unit: productForm.unit,
      selling_price: Number(productForm.price),
      sku: Number(productForm.sku),
      stock_quantity: 0,
      status: "In Stock",
      image: "",
      recipe: productMaterials
        .filter((rm) => rm.materialId && Number(rm.quantity) > 0)
        .map((rm) => ({ material_id: rm.materialId, quantity: Number(rm.quantity) })),
    };
    addProduct(p);
    setIsProductDialogOpen(false);
    setProductForm({ id: "", name: "", category: "dalmoth", unit: "packets", price: "", sku: "" });
    setProductMaterials([{ materialId: "", quantity: "" }]);
    toast({ title: "Product added", description: `${p.name} has been registered.` });
  };

  const handleAddMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!materialForm.id || !materialForm.name) return;
    const m: RawMaterial = {
      material_id: materialForm.id, name: materialForm.name,
      unit: materialForm.unit as "kg" | "litre" | "pcs",
      current_stock: Number(materialForm.stock), cost_per_unit: Number(materialForm.cost),
    };
    addMaterial(m);
    setIsMaterialDialogOpen(false);
    setMaterialForm({ id: "", name: "", unit: "kg", stock: "", cost: "" });
    toast({ title: "Material added", description: `${m.name} has been saved.` });
  };

  const recentOrders = state.orders.slice(0, 5);
  const totalStock = state.products.reduce((s, p) => s + p.stock_quantity, 0);

  const stats = [
    {
      label: "Products in Catalog",
      value: String(state.products.length),
      change: `${totalStock.toLocaleString()} units on hand`,
      up: true,
      icon: Package,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      label: "Raw Materials",
      value: String(state.materials.length),
      change: `${state.materials.reduce((s, m) => s + m.current_stock, 0).toLocaleString()} units available`,
      up: true,
      icon: Factory,
      iconBg: "bg-violet-50",
      iconColor: "text-violet-600",
    },
    {
      label: "Revenue (All Time)",
      value: `₹${totalRevenue.toLocaleString()}`,
      change: `Across ${state.orders.length} orders`,
      up: true,
      icon: TrendingUp,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      label: "Orders in Progress",
      value: String(pendingOrdersCount),
      change: pendingOrdersCount > 0 ? "Awaiting action" : "Everything's clear",
      up: pendingOrdersCount === 0,
      icon: ShoppingCart,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      label: "Low Stock Items",
      value: String(lowStockCount),
      change: lowStockCount > 0 ? `${lowStockCount} items need restock` : "All items healthy",
      up: lowStockCount === 0,
      icon: AlertTriangle,
      iconBg: lowStockCount > 0 ? "bg-red-50" : "bg-emerald-50",
      iconColor: lowStockCount > 0 ? "text-red-500" : "text-emerald-600",
    },
  ];

  return (
    <div className="flex flex-1 flex-col bg-background animate-in-fade">
      <PageHeader title="Dashboard" breadcrumbs={[{ title: "Home" }, { title: "Dashboard" }]} />

      <main className="flex-1 p-4 md:p-6 space-y-6">
        {/* ── Header Row ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8 animate-in-slide-up">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Operations Overview</h1>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">Real-time supply chain and production analytics for your organization.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            {/* New Material */}
            <Dialog open={isMaterialDialogOpen} onOpenChange={setIsMaterialDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="h-10 px-4 gap-2 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-bold text-[13px] rounded-md transition-all shadow-sm">
                  <Plus className="h-4 w-4 text-violet-500" /> Add Material
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-white border-none rounded-md shadow-2xl p-0 overflow-hidden">
                <DialogHeader className="px-5 pt-5 pb-3 border-b border-slate-50 bg-slate-50/30">
                  <DialogTitle className="text-lg font-black tracking-tight text-slate-900">Add Raw Material</DialogTitle>
                  <DialogDescription className="text-slate-500 font-medium text-[12px]">Register a new ingredient or supply item.</DialogDescription>
                </DialogHeader>
                <div className="no-scrollbar max-h-[70vh] overflow-y-auto px-5 py-3">
                  <form onSubmit={handleAddMaterial} className="space-y-4">
                    <div className="grid gap-x-4 gap-y-3 md:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider">Material ID</Label>
                        <Input
                          placeholder="RM006"
                          required
                          className="h-9 bg-slate-50/50 border-slate-200 rounded-md text-slate-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                          value={materialForm.id}
                          onChange={(e) => setMaterialForm({ ...materialForm, id: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider">Name</Label>
                        <Input
                          placeholder="Chili Powder"
                          required
                          className="h-9 bg-slate-50/50 border-slate-200 rounded-md text-slate-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                          value={materialForm.name}
                          onChange={(e) => setMaterialForm({ ...materialForm, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider">Unit</Label>
                        <Select value={materialForm.unit} onValueChange={(v) => setMaterialForm({ ...materialForm, unit: v })}>
                          <SelectTrigger className="h-9 w-full bg-slate-50/50 border-slate-200 text-slate-900 rounded-md focus:ring-2 focus:ring-blue-500/20 text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white border-slate-200 rounded-md shadow-2xl">
                            <SelectItem value="kg">kg</SelectItem>
                            <SelectItem value="litre">litre</SelectItem>
                            <SelectItem value="pcs">pcs</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider">Stock</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          required
                          className="h-9 bg-slate-50/50 border-slate-200 rounded-md text-slate-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                          value={materialForm.stock}
                          onChange={(e) => setMaterialForm({ ...materialForm, stock: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1.5 md:col-span-2">
                        <Label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider">Cost / Unit (₹)</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-xs">₹</span>
                          <Input
                            type="number"
                            placeholder="0.00"
                            required
                            className="h-9 bg-slate-50/50 border-slate-200 rounded-md text-slate-900 pl-8 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            value={materialForm.cost}
                            onChange={(e) => setMaterialForm({ ...materialForm, cost: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="pt-2">
                      <Button
                        type="submit"
                        className="w-full h-11 bg-[#021a41] hover:bg-[#03255a] text-white font-bold rounded-md shadow-lg shadow-blue-900/10 gap-2 text-sm transition-all active:scale-[0.98]"
                      >
                        <Save className="h-4 w-4" /> Save Material
                      </Button>
                    </div>
                  </form>
                </div>
              </DialogContent>
            </Dialog>

            {/* New Product */}
            <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
              <DialogTrigger asChild>
                <Button className="h-10 px-5 gap-2 bg-primary hover:bg-primary/90 text-white font-bold text-[13px] rounded-md shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 active:translate-y-0">
                  <Plus className="h-4 w-4" /> Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-white border-none rounded-md shadow-2xl p-0 overflow-hidden">
                <DialogHeader className="px-5 pt-5 pb-3 border-b border-slate-50 bg-slate-50/30">
                  <DialogTitle className="text-lg font-black tracking-tight text-slate-900">Add Product</DialogTitle>
                  <DialogDescription className="text-slate-500 font-medium text-[12px]">Configure product details and recipe requirements.</DialogDescription>
                </DialogHeader>
                <div className="no-scrollbar max-h-[75vh] overflow-y-auto px-5 py-3">
                  <form onSubmit={handleAddProduct} className="space-y-4">
                    <div className="grid gap-x-4 gap-y-3 md:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider">Product ID</Label>
                        <Input
                          placeholder="PR006"
                          required
                          className="h-9 bg-slate-50/50 border-slate-200 rounded-md text-slate-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                          value={productForm.id}
                          onChange={(e) => setProductForm({ ...productForm, id: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider">Product Name</Label>
                        <Input
                          placeholder="Masala Chips"
                          required
                          className="h-9 bg-slate-50/50 border-slate-200 rounded-md text-slate-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                          value={productForm.name}
                          onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider">Category</Label>
                        <Select value={productForm.category} onValueChange={(v) => setProductForm({ ...productForm, category: v })}>
                          <SelectTrigger className="h-9 w-full bg-slate-50/50 border-slate-200 text-slate-900 rounded-md focus:ring-2 focus:ring-blue-500/20 text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white border-slate-200 rounded-md shadow-2xl">
                            <SelectItem value="dalmoth">Dalmoth</SelectItem>
                            <SelectItem value="chips">Chips</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider">Unit</Label>
                        <Select value={productForm.unit} onValueChange={(v) => setProductForm({ ...productForm, unit: v })}>
                          <SelectTrigger className="h-9 w-full bg-slate-50/50 border-slate-200 text-slate-900 rounded-md focus:ring-2 focus:ring-blue-500/20 text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white border-slate-200 rounded-md shadow-2xl">
                            <SelectItem value="packets">Packets</SelectItem>
                            <SelectItem value="boxes">Boxes</SelectItem>
                            <SelectItem value="kg">kg</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider">Price (₹)</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-xs">₹</span>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            required
                            className="h-9 bg-slate-50/50 border-slate-200 rounded-md text-slate-900 pl-8 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            value={productForm.price}
                            onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider">SKU / Box Size</Label>
                        <Input
                          type="number"
                          placeholder="12"
                          className="h-9 bg-slate-50/50 border-slate-200 rounded-md text-slate-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                          value={productForm.sku}
                          onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-4 pt-4">
                      <div className="flex items-center justify-between px-1">
                        <h3 className="text-sm font-semibold text-slate-700">Raw Material Recipe</h3>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="bg-slate-50/50 border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold gap-2 rounded-md h-10 px-4 transition-all"
                          onClick={addProductMaterialRow}
                        >
                          <Plus className="h-4 w-4" /> Add Row
                        </Button>
                      </div>
                      <div className="bg-white border border-slate-100 rounded-md p-4 space-y-4 shadow-sm">
                        {productMaterials.map((row, index) => (
                          <div key={index} className="space-y-4">
                            <div className="flex gap-4 items-center">
                              <div className="flex-1">
                                <Select value={row.materialId} onValueChange={(v) => updateProductMaterialRow(index, "materialId", v)}>
                                  <SelectTrigger className="h-9 w-full bg-white border-slate-200 rounded-md focus:ring-2 focus:ring-blue-500/20 text-sm">
                                    <SelectValue placeholder="Choose raw material" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-white border-slate-200 rounded-md shadow-2xl">
                                    {state.materials.map((material) => (
                                      <SelectItem key={material.material_id} value={material.material_id}>
                                        {material.name} ({material.unit})
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="w-24">
                                <Input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  placeholder="Qty"
                                  value={row.quantity}
                                  onChange={(e) => updateProductMaterialRow(index, "quantity", e.target.value)}
                                  className="h-9 bg-white border-slate-200 rounded-md text-center text-sm focus:ring-2 focus:ring-blue-500/20"
                                />
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeProductMaterialRow(index)}
                                className="h-9 w-9 text-slate-300 hover:text-rose-500 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            {index < productMaterials.length - 1 && <div className="border-b border-slate-50 mx-2" />}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button
                        type="submit"
                        className="w-full h-11 bg-[#021a41] hover:bg-[#03255a] text-white font-bold rounded-md shadow-lg shadow-blue-900/10 gap-2 text-sm transition-all active:scale-[0.98]"
                      >
                        <Save className="h-4 w-4" /> Save Product
                      </Button>
                    </div>
                  </form>
                </div>
              </DialogContent>
            </Dialog>


          </div>
        </div>

        {/* ── KPI Cards (live from store) ── */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 animate-in-slide-up [animation-delay:50ms]">
          {stats.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className="group relative bg-white border border-slate-200/60 rounded-md p-6 h-56 flex flex-col overflow-hidden hover:shadow-2xl hover:border-blue-200/50 transition-all duration-500 hover:-translate-y-1.5"
                style={{ animationDelay: `${(idx + 1) * 50}ms` }}
              >
                {/* Decorative background gradient */}
                <div className={`absolute -right-8 -bottom-8 w-32 h-32 rounded-full opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700 blur-3xl ${card.iconBg}`} />

                {/* Header: Label + Icon */}
                <div className="flex items-start justify-end w-full relative z-10">
                  <div className={`h-8 w-8 rounded-md ${card.iconBg} flex items-center justify-center shadow-sm ring-1 ring-white group-hover:scale-110 transition-transform duration-500`}>
                    <Icon className={`h-4 w-4 ${card.iconColor}`} />
                  </div>
                </div>

                {/* Center Content: Value + Change */}
                <div className="flex-1 flex flex-col items-center justify-center relative z-10">
                  <p className="text-6xl font-black text-slate-900 tracking-tighter drop-shadow-sm select-none">
                    {card.value}
                  </p>
                  <p className="text-[10px] mt-4 font-black uppercase tracking-[0.25em] text-slate-400 select-none group-hover:text-slate-500 transition-colors">
                    {card.label}
                  </p>
                  <div className={`mt-4 px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 shadow-sm ${card.up
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                    : "bg-rose-50 text-rose-600 border border-rose-100"
                    }`}>
                    <span className="relative flex h-2 w-2">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${card.up ? "bg-emerald-400" : "bg-rose-400"}`}></span>
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${card.up ? "bg-emerald-500" : "bg-rose-500"}`}></span>
                    </span>
                    {card.change}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Charts ── */}
        <div className="grid gap-4 lg:grid-cols-5 animate-in-slide-up [animation-delay:100ms]">
          <Card className="surface lg:col-span-3">
            <CardHeader className="px-6 py-5 border-b border-slate-50 flex-row items-center justify-between space-y-0">
              <div className="space-y-1">
                <CardTitle className="text-base font-bold text-slate-900 leading-none">Stock Trends</CardTitle>
                <CardDescription className="text-[12px] text-slate-500 font-medium">Finished product levels this week</CardDescription>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100/50 shadow-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-700">Healthy</span>
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6 pt-4">
              <div className="h-55">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stockTrendsData} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}>
                    <defs><linearGradient id="gStock" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3b82f6" stopOpacity={0.14} /><stop offset="100%" stopColor="#3b82f6" stopOpacity={0} /></linearGradient></defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} dy={8} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
                    <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", boxShadow: "0 8px 20px -4px rgba(0,0,0,0.08)", fontSize: 12 }} itemStyle={{ color: "#3b82f6" }} labelStyle={{ color: "#64748b", marginBottom: 4 }} />
                    <Area type="monotone" dataKey="finished" stroke="#3b82f6" strokeWidth={2.5} fill="url(#gStock)" dot={false} activeDot={{ r: 4, fill: "#3b82f6", strokeWidth: 0 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="surface lg:col-span-2">
            <CardHeader className="px-6 py-5 border-b border-slate-50 flex-row items-center justify-between space-y-0">
              <div className="space-y-1">
                <CardTitle className="text-base font-bold text-slate-900 leading-none">Weekly Activity</CardTitle>
                <CardDescription className="text-[12px] text-slate-500 font-medium">Operations volume by day</CardDescription>
              </div>
              <div className="h-8 w-8 rounded-md bg-slate-50 flex items-center justify-center text-slate-400">
                <BarChart3 className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6 pt-4">
              <div className="h-55">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyActivity} margin={{ top: 4, right: 0, left: -24, bottom: 0 }} barSize={20}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} dy={8} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
                    <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", boxShadow: "0 8px 20px -4px rgba(0,0,0,0.08)", fontSize: 12 }} cursor={{ fill: "rgba(59,130,246,0.06)" }} itemStyle={{ color: "#3b82f6" }} />
                    <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Bottom Row ── */}
        <div className="grid gap-4 lg:grid-cols-3 animate-in-slide-up [animation-delay:150ms]">
          {/* Recent Orders */}
          <Card className="surface lg:col-span-2">
            <CardHeader className="px-6 py-5 border-b border-slate-50 flex-row items-center justify-between space-y-0">
              <div className="space-y-1">
                <CardTitle className="text-base font-bold text-slate-900 leading-none">Recent Orders</CardTitle>
                <CardDescription className="text-[12px] text-slate-500 font-medium">Latest customer orders</CardDescription>
              </div>
              <Link href="/orders">
                <Button variant="outline" size="sm" className="h-8 text-[11px] font-bold uppercase tracking-wider border-slate-200 text-slate-500 hover:text-primary hover:border-primary/30 rounded-md gap-1.5 transition-all">
                  View all <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardHeader>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-100 hover:bg-transparent">
                    <TableHead className="th pl-6">Order</TableHead>
                    <TableHead className="th">Customer</TableHead>
                    <TableHead className="th">Amount</TableHead>
                    <TableHead className="th pr-6">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.length === 0 ? (
                    <TableRow><TableCell colSpan={4} className="text-center py-8 text-slate-400 text-sm">No orders yet.</TableCell></TableRow>
                  ) : recentOrders.map((order) => (
                    <TableRow key={order.id} className="tr-hover last:border-0">
                      <TableCell className="pl-6 td"><Link href={`/orders/${order.id}`}><span className="text-[13px] font-semibold text-primary hover:underline cursor-pointer">{order.orderNumber}</span></Link></TableCell>
                      <TableCell className="td"><span className="text-[13px] font-medium text-slate-800">{order.customerName}</span></TableCell>
                      <TableCell className="td"><span className="text-[13px] font-bold text-slate-900">₹{order.totalAmount.toLocaleString()}</span></TableCell>
                      <TableCell className="pr-6 td">
                        <span className={`badge ${order.paymentStatus === "Paid" ? "badge-success" : order.paymentStatus === "Pending" ? "badge-warning" : "badge-error"}`}>{order.paymentStatus}</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>

          {/* Sidebar panel */}
          <div className="flex flex-col gap-4">
            <Card className="bg-[#021a41] border-[#021a41] text-white rounded-md shadow-2xl relative overflow-hidden group">
              {/* Animated background element */}
              <div className="absolute -top-12 -left-12 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-colors duration-1000" />

              <CardContent className="p-6 relative z-10">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between w-full">
                    <div className="text-left">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-2">Revenue Performance</p>
                      <p className="text-4xl font-black text-white tracking-tighter">₹{totalRevenue.toLocaleString()}</p>

                      <div className="mt-6 space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]" />
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Total Sales</span>
                            <span className="text-[13px] font-black text-white/90">{state.orders.length} Orders</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-2 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.6)]" />
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Growth Rate</span>
                            <span className="text-[13px] font-black text-white/90">+12.5% Month</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="relative h-32 w-32 shrink-0 flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Direct', value: 65 },
                              { name: 'Online', value: 35 },
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={30}
                            outerRadius={50}
                            paddingAngle={10}
                            dataKey="value"
                            stroke="none"
                            cornerRadius={4}
                          >
                            <Cell fill="#3b82f6" className="drop-shadow-lg" />
                            <Cell fill="#6366f1" className="drop-shadow-lg" />
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-[14px] font-black text-white">65%</span>
                        <span className="text-[8px] font-bold text-white/40 uppercase tracking-tighter">Direct</span>
                      </div>
                    </div>
                  </div>

                  <Button className="mt-8 h-10 w-full bg-white/10 hover:bg-white/20 text-white border border-white/10 text-[11px] font-black uppercase tracking-widest transition-all">
                    Generate Financial Insights
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-slate-200/60 rounded-md shadow-sm overflow-hidden">
              <CardHeader className="px-5 py-4 border-b border-slate-50 bg-slate-50/30">
                <CardTitle className="text-[13px] font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Zap className="h-3.5 w-3.5 text-amber-500" /> Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-1.5">
                <div className="grid grid-cols-1 gap-1">
                  {[
                    { label: "Product Catalog", href: "/products", icon: Package, color: "text-blue-600", bg: "bg-blue-50/50" },
                    { label: "Raw Materials", href: "/raw-materials", icon: Factory, color: "text-violet-600", bg: "bg-violet-50/50" },
                    { label: "Purchase History", href: "/purchases", icon: ShoppingCart, color: "text-amber-600", bg: "bg-amber-50/50" },
                    { label: "Inventory Alerts", href: "/alerts", icon: Bell, color: "text-rose-500", bg: "bg-rose-50/50" },
                  ].map((action) => {
                    const Icon = action.icon;
                    return (
                      <Link key={action.href} href={action.href as any} className="group">
                        <div className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-slate-50 transition-all duration-200">
                          <div className={`h-8 w-8 rounded-md ${action.bg} flex items-center justify-center shrink-0 border border-transparent group-hover:border-slate-200 transition-all`}>
                            <Icon className={`h-4 w-4 ${action.color}`} />
                          </div>
                          <span className="text-[13px] font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">{action.label}</span>
                          <ArrowRight className="h-3.5 w-3.5 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-slate-300" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
