"use client";

import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Package,
  ShoppingCart,
  TrendingUp,
  Save,
  Box,
  Bell,
  BarChart3,
  Image as ImageIcon
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  snackMetrics,
  stockTrendsData,

  snackProducts,
  weeklyActivity
} from "@/lib/snack-mock-data";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { Input } from "@/components/ui/input";

const COLORS = ["#0B3C5D", "#1D5D9B", "#4A8BDF", "#93c5fd"];

export default function DashboardPage() {
  const { toast } = useToast();
  const [products, setProducts] = useState(snackProducts);
  const [searchTerm, setSearchTerm] = useState("");

  // Dialog States
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isMaterialDialogOpen, setIsMaterialDialogOpen] = useState(false);

  // Form States
  const [productForm, setProductForm] = useState({
    id: "", name: "", category: "dalmoth", unit: "packets", price: "", sku: ""
  });
  const [materialForm, setMaterialForm] = useState({
    id: "", name: "", unit: "kg", stock: "", cost: ""
  });

  const filteredHistory = products.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.product_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct = {
      product_id: productForm.id,
      name: productForm.name,
      category: productForm.category as 'dalmoth' | 'chips',
      unit: productForm.unit,
      selling_price: Number(productForm.price),
      sku: Number(productForm.sku),
      stock_quantity: 0,
      status: "In Stock",
      image: ""
    };
    setProducts([newProduct, ...products]);
    setIsProductDialogOpen(false);
    setProductForm({ id: "", name: "", category: "dalmoth", unit: "packets", price: "", sku: "" });
    toast({ title: "Product Added", description: `${newProduct.name} saved successfully.` });
  };

  const handleAddMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    setIsMaterialDialogOpen(false);
    setMaterialForm({ id: "", name: "", unit: "kg", stock: "", cost: "" });
    toast({ title: "Material Added", description: `${materialForm.name} saved to inventory.` });
  };

  return (
    <div className="flex flex-1 flex-col bg-background animate-in-fade">
      <PageHeader
        title="Dashboard Overview"
        breadcrumbs={[{ title: "Home" }, { title: "Dashboard" }]}
      />

      <main className="flex-1 space-y-6 p-4 md:p-8 ">
        <div className="flex flex-wrap items-center justify-between gap-6 animate-in-slide-up">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              <span className="text-primary">Inventory Hub</span>
            </h2>
            <p className="text-slate-500 font-medium">Manage your items, orders, and supply chain in real-time.</p>
          </div>
          <div className="flex items-center gap-3">
            <Dialog open={isMaterialDialogOpen} onOpenChange={setIsMaterialDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4 text-primary" /> New Material
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-white border-slate-200 text-slate-900 shadow-xl rounded-xl">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">Add Raw Material</DialogTitle>
                  <DialogDescription className="text-slate-500">Register new ingredients into your inventory.</DialogDescription>
                </DialogHeader>
                <form className="space-y-4 py-4" onSubmit={handleAddMaterial}>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-600 text-xs font-semibold uppercase tracking-wider">Material ID</Label>
                      <Input placeholder="RM006" required className="bg-slate-50 border-slate-200 text-slate-900 rounded-lg" value={materialForm.id} onChange={(e) => setMaterialForm({ ...materialForm, id: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-600 text-xs font-semibold uppercase tracking-wider">Name</Label>
                      <Input placeholder="Basmati Rice" required className="bg-slate-50 border-slate-200 text-slate-900 rounded-lg" value={materialForm.name} onChange={(e) => setMaterialForm({ ...materialForm, name: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-600 text-xs font-semibold uppercase tracking-wider">Unit</Label>
                      <Input placeholder="kg" required className="bg-slate-50 border-slate-200 text-slate-900 rounded-lg" value={materialForm.unit} onChange={(e) => setMaterialForm({ ...materialForm, unit: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-600 text-xs font-semibold uppercase tracking-wider">Stock</Label>
                      <Input type="number" placeholder="0" required className="bg-slate-50 border-slate-200 text-slate-900 rounded-lg" value={materialForm.stock} onChange={(e) => setMaterialForm({ ...materialForm, stock: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-600 text-xs font-semibold uppercase tracking-wider">Cost/Unit</Label>
                    <Input type="number" placeholder="₹ 0" required className="bg-slate-50 border-slate-200 text-slate-900 rounded-lg" value={materialForm.cost} onChange={(e) => setMaterialForm({ ...materialForm, cost: e.target.value })} />
                  </div>
                  <DialogFooter className="pt-4">
                    <Button type="submit" className="w-full">
                      <Save className="mr-2 h-4 w-4" /> Save Material
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> New Product
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-white border-slate-200 text-slate-900 shadow-xl rounded-xl">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">Add Finished Product</DialogTitle>
                  <DialogDescription className="text-slate-500">Register new items into your catalog.</DialogDescription>
                </DialogHeader>
                <form className="space-y-4 py-4" onSubmit={handleAddProduct}>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-600 text-xs font-semibold uppercase tracking-wider">Product ID</Label>
                      <Input placeholder="PR006" required className="bg-slate-50 border-slate-200 text-slate-900 rounded-lg" value={productForm.id} onChange={(e) => setProductForm({ ...productForm, id: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-600 text-xs font-semibold uppercase tracking-wider">Name</Label>
                      <Input placeholder="Aloo Bhujia" required className="bg-slate-50 border-slate-200 text-slate-900 rounded-lg" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-600 text-xs font-semibold uppercase tracking-wider">Category</Label>
                    <Select value={productForm.category} onValueChange={(v) => setProductForm({ ...productForm, category: v })}>
                      <SelectTrigger className="bg-slate-50 border-slate-200 text-slate-900 rounded-lg h-10"><SelectValue /></SelectTrigger>
                      <SelectContent className="bg-white border-slate-200 text-slate-900 rounded-lg shadow-xl w-full">
                        <SelectItem value="dalmoth">Dalmoth</SelectItem>
                        <SelectItem value="chips">Chips</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-600 text-xs font-semibold uppercase tracking-wider">Unit</Label>
                      <Input placeholder="packets" required className="bg-slate-50 border-slate-200 text-slate-900 rounded-lg" value={productForm.unit} onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-600 text-xs font-semibold uppercase tracking-wider">Price</Label>
                      <Input type="number" placeholder="₹ 0" required className="bg-slate-50 border-slate-200 text-slate-900 rounded-lg" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-600 text-xs font-semibold uppercase tracking-wider">SKU (Units/Box)</Label>
                    <Input type="number" placeholder="12" required className="bg-slate-50 border-slate-200 text-slate-900 rounded-lg" value={productForm.sku} onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })} />
                  </div>
                  <DialogFooter className="pt-4">
                    <Button type="submit" className="w-full">
                      <Save className="mr-2 h-4 w-4" /> Save Product
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <Link href="/purchases">
              <Button variant="outline">
                <ShoppingCart className="mr-2 h-4 w-4 text-primary" /> Purchase
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5 animate-in-slide-up [animation-delay:100ms]">
          {snackMetrics.map((metric, i) => (
            <Card key={i} className="bg-white border-slate-200 group hover:border-primary/30 transition-all duration-300 rounded-xl overflow-hidden shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{metric.label}</CardTitle>
                <div className="bg-slate-50 p-2 rounded-lg text-slate-400 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  {metric.icon === "box" && <Box className="h-5 w-5" />}
                  {metric.icon === "package" && <Package className="h-5 w-5" />}
                  {metric.icon === "alert" && <Bell className="h-5 w-5 text-amber-500 group-hover:text-white" />}
                  {metric.icon === "clock" && <Bell className="h-5 w-5 text-blue-500 group-hover:text-white" />}
                  {metric.icon === "trending-up" && <TrendingUp className="h-5 w-5 text-emerald-600 group-hover:text-white" />}
                </div>
              </CardHeader>
              <CardContent className="pt-1">
                <div className="text-2xl font-bold tracking-tight text-slate-900">{metric.value}</div>
                <div className="flex items-center mt-1">
                  <span className={`text-[10px] font-bold ${metric.change.includes('+') ? 'text-emerald-600' : 'text-amber-600'
                    }`}>
                    {metric.change} from last month
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2 animate-in-slide-up [animation-delay:200ms]">
          <Card className="bg-white border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
              <div className="space-y-1">
                <CardTitle className="text-lg font-bold text-slate-900">Inventory Status</CardTitle>
                <CardDescription className="text-slate-500 font-medium text-xs">Analysis of current stock levels across departments</CardDescription>
              </div>
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-xs">
                <TrendingUp className="h-4 w-4" /> Healthy
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stockTrendsData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1a9df9" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#1a9df9" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 500 }}
                      dy={15}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 500 }}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                      itemStyle={{ color: "#1a9df9", fontWeight: 600 }}
                      labelStyle={{ color: "#64748b", marginBottom: "4px" }}
                    />
                    <Area type="monotone" dataKey="finished" stroke="#1a9df9" strokeWidth={3} fillOpacity={1} fill="url(#colorStock)" animationDuration={1500} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
              <div className="space-y-1">
                <CardTitle className="text-lg font-bold text-slate-900">Weekly Activity</CardTitle>
                <CardDescription className="text-slate-500 font-medium text-xs">Distribution of operations across the week</CardDescription>
              </div>
              <Button variant="ghost" size="icon">
                <BarChart3 className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyActivity} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="day"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 500 }}
                      dy={15}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 500 }}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                      cursor={{ fill: "rgba(26, 157, 249, 0.05)" }}
                      itemStyle={{ color: "#1a9df9", fontWeight: 600 }}
                    />
                    <Bar dataKey="value" fill="#1a9df9" radius={[4, 4, 0, 0]} barSize={40} animationDuration={1500} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white border-slate-200 rounded-xl overflow-hidden shadow-sm animate-in-slide-up [animation-delay:300ms]">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-xl font-bold text-slate-900">Recent Transactions</CardTitle>
                <CardDescription className="text-slate-500 font-medium">Latest inventory movements and additions</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/80">
                <TableRow className="border-slate-100 hover:bg-transparent">
                  <TableHead className="w-[80px] text-slate-500 uppercase text-[10px] font-bold tracking-wider pl-6 py-4">Visual</TableHead>
                  <TableHead className="text-slate-500 uppercase text-[10px] font-bold tracking-wider py-4">ID</TableHead>
                  <TableHead className="text-slate-500 uppercase text-[10px] font-bold tracking-wider py-4">Item Name</TableHead>
                  <TableHead className="text-slate-500 uppercase text-[10px] font-bold tracking-wider py-4">Category</TableHead>
                  <TableHead className="text-slate-500 uppercase text-[10px] font-bold tracking-wider py-4 text-center">Unit</TableHead>
                  <TableHead className="text-right text-slate-500 uppercase text-[10px] font-bold tracking-wider pr-6 py-4">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.slice(0, 5).map((product) => (
                  <TableRow key={product.product_id} className="border-slate-100 hover:bg-slate-50/50 transition-colors group">
                    <TableCell className="pl-6 py-4">
                      <div className="h-10 w-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden">
                        {product.image ? (
                          <img src={product.image} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <ImageIcon className="h-5 w-5 text-slate-300" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-primary cursor-pointer hover:underline">{product.product_id}</TableCell>
                    <TableCell className="font-semibold text-slate-900">{product.name}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700 uppercase tracking-wide">
                        {product.category}
                      </span>
                    </TableCell>
                    <TableCell className="text-slate-500 font-medium text-center">{product.unit}</TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="font-bold text-slate-900">₹{product.selling_price.toLocaleString()}</div>
                    </TableCell>
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
