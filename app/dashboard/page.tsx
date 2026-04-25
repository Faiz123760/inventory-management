"use client";

import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus, Package, ShoppingCart, TrendingUp, Save, Factory, Bell,
  BarChart3, ArrowRight, AlertTriangle, Zap, Trash2, RefreshCcw,
  Users, Layers, Receipt, Calendar, Filter, Search
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
  PieChart, Pie, Cell, Line, LineChart
} from "recharts";
import { MaterialForm, type MaterialFormData } from "@/components/MaterialForm";
import { ProductForm, PRODUCT_BLANK } from "@/components/ProductForm";
import {
  dailyPurchasesData,
  dailyOrdersData,
  topSkusData,
  Product,
  RawMaterial
} from "@/lib/snack-mock-data";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { useAppStore } from "@/lib/store";

export default function DashboardPage() {
  const { toast } = useToast();
  const { state, addProduct, addMaterial, totalRevenue, lowStockCount, pendingOrdersCount } = useAppStore();

  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isMaterialDialogOpen, setIsMaterialDialogOpen] = useState(false);
  const [productForm, setProductForm] = useState(PRODUCT_BLANK);
  const [materialForm, setMaterialForm] = useState<MaterialFormData>({ id: "", name: "", unit: "kg", stock: "", cost: "" });
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
    setProductForm(PRODUCT_BLANK);
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

  const stats = [
    {
      label: "Total Revenue",
      value: `INR ${totalRevenue.toLocaleString()}`,
      change: "Avg INR 211.50",
      icon: TrendingUp,
      color: "text-emerald-500",
      bg: "bg-emerald-50/50",
    },
    {
      label: "Total Orders",
      value: String(state.orders.length),
      change: `${pendingOrdersCount} pending`,
      icon: ShoppingCart,
      color: "text-blue-500",
      bg: "bg-blue-50/50",
    },
    {
      label: "Customers",
      value: String(state.customers.length),
      change: "8 new this period",
      icon: Users,
      color: "text-violet-500",
      bg: "bg-violet-50/50",
    },
    {
      label: "Active Products",
      value: String(state.products.length),
      change: "Across 2 cat",
      icon: Package,
      color: "text-cyan-500",
      bg: "bg-cyan-50/50",
    },
    {
      label: "Low Stock",
      value: String(lowStockCount),
      change: lowStockCount > 0 ? "Needs attention" : "Healthy",
      icon: AlertTriangle,
      color: lowStockCount > 0 ? "text-rose-500" : "text-emerald-500",
      bg: lowStockCount > 0 ? "bg-rose-50/50" : "bg-emerald-50/50",
    },
  ];

  return (
    <div className="flex flex-1 flex-col bg-[#f8fafc] animate-in-fade pb-4">
      {/* ── Top Header ── */}
      <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-slate-400" />
          <span className="text-[13px] font-bold text-slate-700">Dashboard</span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="h-8 text-[10px] font-black uppercase tracking-wider text-slate-500 gap-1.5">
            <RefreshCcw className="h-3 w-3" /> Refresh
          </Button>
          <div className="h-3.5 w-px bg-slate-200" />
          <div className="h-7 w-7 rounded-full bg-slate-100 border border-slate-200" />
        </div>
      </div>

      <main className="flex-1 p-3 space-y-3 max-w-[1800px] mx-auto w-full">
        {/* ── Page Title Row ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-1 px-1">
          <div className="space-y-0">
            <h1 className="text-[18px] font-black text-slate-900 tracking-tight">Overview</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Last 30 days · Live analytics</p>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={isMaterialDialogOpen} onOpenChange={setIsMaterialDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="h-8 px-3 gap-1.5 border-slate-200 text-slate-600 font-black text-[10px] uppercase tracking-wider rounded bg-white shadow-sm">
                  <Plus className="h-3 w-3 text-violet-500" /> Add Material
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-xl bg-white border-none rounded-md shadow-2xl p-0">
                <DialogHeader className="px-5 pt-5 pb-3 border-b border-slate-50 bg-slate-50/30">
                  <DialogTitle className="text-lg font-black tracking-tight text-slate-900 uppercase tracking-wider">Add Raw Material</DialogTitle>
                  <DialogDescription className="text-slate-500 font-medium text-[12px]">Register a new material to the inventory.</DialogDescription>
                </DialogHeader>
                <div className="no-scrollbar max-h-[85vh] overflow-y-auto px-5 py-5">
                  <MaterialForm
                    formData={materialForm}
                    setFormData={setMaterialForm}
                    onSubmit={handleAddMaterial}
                    label="Save Material"
                  />
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
              <DialogTrigger asChild>
                <Button className="h-8 px-3 gap-1.5 bg-primary hover:bg-primary/90 text-white font-black text-[10px] uppercase tracking-wider rounded shadow-sm">
                  <Plus className="h-3 w-3" /> Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-white border-none rounded-md shadow-2xl p-0">
                <DialogHeader className="px-5 pt-5 pb-3 border-b border-slate-50 bg-slate-50/30">
                  <DialogTitle className="text-lg font-black tracking-tight text-slate-900 uppercase tracking-wider">Add New Product</DialogTitle>
                  <DialogDescription className="text-slate-500 font-medium text-[12px]">Configure product details and resource requirements.</DialogDescription>
                </DialogHeader>
                <div className="no-scrollbar max-h-[85vh] overflow-y-auto px-5 py-5">
                  <ProductForm
                    onSubmit={handleAddProduct}
                    label="Register Product"
                    formData={productForm}
                    setFormData={setProductForm}
                    productMaterials={productMaterials}
                    updateProductMaterialRow={updateProductMaterialRow}
                    addProductMaterialRow={addProductMaterialRow}
                    removeProductMaterialRow={removeProductMaterialRow}
                    materials={state.materials}
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* ── KPI Grid ── */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {stats.map((item) => (
            <Card key={item.label} className="bg-white border-slate-200 shadow-sm p-3.5 flex flex-col justify-between h-[100px] hover:-translate-y-0.5 transition-all duration-300 rounded">
              <div className="flex items-start justify-between w-full">
                <p className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-400">{item.label}</p>
                <div className={`h-6 w-6 rounded ${item.bg} flex items-center justify-center`}>
                  <item.icon className={`h-3 w-3 ${item.color}`} />
                </div>
              </div>
              <div className="space-y-0">
                <p className="text-[18px] font-black text-slate-900 tracking-tight leading-none">{item.value}</p>
                <p className="text-[10px] text-slate-400 font-bold tracking-tight mt-1 truncate">
                  {item.change}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* ── Main Charts Row ── */}
        <div className="grid gap-3 lg:grid-cols-3">
          {/* Daily Orders Chart */}
          <Card className="bg-white border-slate-200 shadow-sm lg:col-span-2 rounded overflow-hidden">
            <CardHeader className="px-4 py-3 border-b border-slate-50 flex flex-row items-center justify-between">
              <div className="space-y-0">
                <CardTitle className="text-[13px] font-black text-slate-900 uppercase tracking-tight">Order Received Amount</CardTitle>
                <CardDescription className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Daily Revenue trends</CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Revenue</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailyOrdersData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.08} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94a3b8", fontSize: 9, fontWeight: 700 }}
                      dy={5}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94a3b8", fontSize: 9, fontWeight: 700 }}
                    />
                    <Tooltip
                      contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "10px" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="amount"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      fill="url(#colorOrders)"
                      activeDot={{ r: 4, strokeWidth: 0, fill: "#3b82f6" }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Order Distribution Count Chart */}
          <Card className="bg-white border-slate-200 shadow-sm lg:col-span-1 rounded">
            <CardHeader className="px-4 py-3 border-b border-slate-50">
              <div className="space-y-0">
                <CardTitle className="text-[13px] font-black text-slate-900 uppercase tracking-tight">Order Distribution</CardTitle>
                <CardDescription className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Volume by status</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-4 flex flex-col h-[280px]">
              <div className="flex-1 flex flex-col justify-center space-y-4">
                {[
                  { label: "Pending", value: 12, color: "bg-amber-400", total: 15 },
                  { label: "Delivered", value: 2, color: "bg-emerald-400", total: 15 },
                  { label: "Shipped", value: 1, color: "bg-blue-400", total: 15 },
                ].map((item) => (
                  <div key={item.label} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-600 uppercase tracking-tight">{item.label}</span>
                      <span className="text-[10px] font-black text-slate-900">{item.value} / {item.total}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full`}
                        style={{ width: `${(item.value / item.total) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-3 mt-auto border-t border-slate-50 grid grid-cols-2 gap-2">
                <div>
                  <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Net Value</p>
                  <p className="text-[12px] font-black text-slate-900">INR 2,423.05</p>
                </div>
                <div className="text-right">
                  <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Returns</p>
                  <p className="text-[12px] font-black text-slate-900">0</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Second Row ── */}
        <div className="grid gap-3 lg:grid-cols-3">
          {/* Daily Purchases Chart */}
          <Card className="bg-white border-slate-200 shadow-sm lg:col-span-2 rounded">
            <CardHeader className="px-4 py-3 border-b border-slate-50">
              <div className="space-y-0">
                <CardTitle className="text-[13px] font-black text-slate-900 uppercase tracking-tight">Daily Purchases</CardTitle>
                <CardDescription className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Procurement spending</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="h-[180px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyPurchasesData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94a3b8", fontSize: 8, fontWeight: 700 }}
                      dy={5}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94a3b8", fontSize: 8, fontWeight: 700 }}
                    />
                    <Tooltip
                      cursor={{ fill: "rgba(0,0,0,0.02)" }}
                      contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "9px" }}
                    />
                    <Bar dataKey="amount" fill="#cbd5e1" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Most Selling SKUs */}
          <Card className="bg-white border-slate-200 shadow-sm lg:col-span-1 rounded">
            <CardHeader className="px-4 py-3 border-b border-slate-50">
              <div className="space-y-0">
                <CardTitle className="text-[13px] font-black text-slate-900 uppercase tracking-tight">Top SKUs</CardTitle>
                <CardDescription className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Inventory turnover</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3.5 h-[220px] overflow-hidden">
              {topSkusData.slice(0, 5).map((sku) => (
                <div key={sku.name} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-600 truncate max-w-[140px] uppercase tracking-tight">{sku.name}</span>
                    <span className="text-[10px] font-black text-slate-900">{sku.value}</span>
                  </div>
                  <div className="h-1 w-full bg-slate-50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-slate-300 rounded-full"
                      style={{ width: `${(sku.value / 450) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* ── Recent Orders Table ── */}
        <Card className="bg-white border-slate-200 shadow-sm rounded overflow-hidden">
          <CardHeader className="px-4 py-3 border-b border-slate-50 flex flex-row items-center justify-between">
            <div className="space-y-0">
              <CardTitle className="text-[13px] font-black text-slate-900 uppercase tracking-tight">Latest Orders</CardTitle>
              <CardDescription className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Recent transaction activity</CardDescription>
            </div>
            <Link href="/orders">
              <Button variant="ghost" size="sm" className="h-7 px-2 text-[9px] font-black text-blue-500 hover:text-blue-600 hover:bg-blue-50 uppercase tracking-wider">View All Transactions</Button>
            </Link>
          </CardHeader>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-50 hover:bg-transparent">
                  <TableHead className="text-[9px] font-black uppercase text-slate-400 tracking-wider pl-4 py-2">Order ID</TableHead>
                  <TableHead className="text-[9px] font-black uppercase text-slate-400 tracking-wider py-2">Customer</TableHead>
                  <TableHead className="text-[9px] font-black uppercase text-slate-400 tracking-wider py-2">Date</TableHead>
                  <TableHead className="text-[9px] font-black uppercase text-slate-400 tracking-wider py-2 text-right pr-4">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {state.orders.slice(0, 5).map((order) => (
                  <TableRow key={order.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <TableCell className="pl-4 py-2.5 text-[11px] font-black text-slate-900">{order.orderNumber}</TableCell>
                    <TableCell className="py-2.5 text-[11px] font-bold text-slate-600">{order.customerName}</TableCell>
                    <TableCell className="py-2.5 text-[10px] font-medium text-slate-400">{order.orderDate}</TableCell>
                    <TableCell className="py-2.5 text-[11px] font-black text-slate-900 text-right pr-4">INR {order.totalAmount.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </main>
    </div>
  );
}
