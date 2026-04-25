"use client";

import { useSearchParams } from "next/navigation";
import { useState, useMemo, useEffect, useCallback, Suspense } from "react";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import {
  Plus, Search, Layers, FileText, Archive, CheckCircle2, Trash2, Save, Eye, Factory, ClipboardList, AlertCircle, PlayCircle,
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/StatusBadge";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/components/ui/use-toast";
import { BOM, BOMItem, Order, ProductionRun } from "@/lib/snack-mock-data";
import { Badge } from "@/components/ui/badge";

function BOMPageContent() {
  const { toast } = useToast();
  const { state, addBom, updateBom, deleteBom, addProductionRun, updateProductionRun, deleteProductionRun, updateOrderStatus, updateMaterial } = useAppStore();

  const boms = state.boms;
  const products = state.products;
  const materials = state.materials;
  const orders = state.orders;
  const productionRuns = state.productionRuns;

  const [activeTab, setActiveTab] = useState<"boms" | "runs">("runs");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [viewBom, setViewBom] = useState<BOM | null>(null);
  
  const searchParams = useSearchParams();
  const initialOrderId = searchParams.get("orderId");

  // ── Production Creation State ──
  const [isProductionDialogOpen, setIsProductionDialogOpen] = useState(false);
  const [orderSearchId, setOrderSearchId] = useState("");
  const [foundOrder, setFoundOrder] = useState<Order | null>(null);
  const [viewRun, setViewRun] = useState<ProductionRun | null>(null);

  // ── Create Form State ──
  const [selectedProduct, setSelectedProduct] = useState("");
  const [bomStatus, setBomStatus] = useState<BOM["status"]>("Draft");
  const [bomItems, setBomItems] = useState<Array<{ materialId: string; quantity: string }>>([
    { materialId: "", quantity: "" },
  ]);

  const filtered = useMemo(() => {
    return boms.filter((b) => {
      const matchesSearch =
        b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.product_name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || b.status.toLowerCase() === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [boms, searchTerm, statusFilter]);

  const activeCount = boms.filter((b) => b.status === "Active").length;
  const draftCount = boms.filter((b) => b.status === "Draft").length;
  const totalCostAvg = boms.length > 0 ? (boms.reduce((s, b) => s + b.total_cost, 0) / boms.length) : 0;

  const addBomItem = () => setBomItems([...bomItems, { materialId: "", quantity: "" }]);
  const removeBomItem = (idx: number) => {
    const next = bomItems.filter((_, i) => i !== idx);
    setBomItems(next.length > 0 ? next : [{ materialId: "", quantity: "" }]);
  };
  const updateBomItem = (idx: number, field: "materialId" | "quantity", value: string) => {
    const next = [...bomItems];
    next[idx] = { ...next[idx], [field]: value };
    setBomItems(next);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const product = products.find((p) => p.product_id === selectedProduct);
    if (!product) return;

    const items: BOMItem[] = bomItems
      .filter((i) => i.materialId && Number(i.quantity) > 0)
      .map((i) => {
        const mat = materials.find((m) => m.material_id === i.materialId);
        const qty = Number(i.quantity);
        return {
          material_id: i.materialId,
          name: mat?.name || "",
          quantity: qty,
          unit: mat?.unit || "",
          cost: qty * (mat?.cost_per_unit || 0),
        };
      });

    if (items.length === 0) return;

    const newBom: BOM = {
      id: `BOM-${String(Date.now()).slice(-4)}`,
      product_id: product.product_id,
      product_name: product.name,
      items,
      total_cost: items.reduce((s, i) => s + i.cost, 0),
      status: bomStatus,
      last_updated: new Date().toISOString().split("T")[0],
    };

    addBom(newBom);
    setIsCreateOpen(false);
    setSelectedProduct("");
    setBomStatus("Draft");
    setBomItems([{ materialId: "", quantity: "" }]);
    toast({ title: "BOM Created", description: `${newBom.id} for ${newBom.product_name} saved.` });
  };

  const handleStatusChange = (bomId: string, newStatus: BOM["status"]) => {
    const bom = boms.find((b) => b.id === bomId);
    if (bom) updateBom({ ...bom, status: newStatus, last_updated: new Date().toISOString().split("T")[0] });
  };

  const handleDelete = (bomId: string) => {
    deleteBom(bomId);
    toast({ title: "BOM Deleted", description: `${bomId} has been removed.` });
  };

  const handleOrderSearch = useCallback(() => {
    const order = orders.find(o => o.orderNumber.toLowerCase() === orderSearchId.toLowerCase() || o.id === orderSearchId);
    if (order) {
      setFoundOrder(order);
    } else {
      setFoundOrder(null);
      toast({ title: "Order Not Found", description: "Could not find an order with that ID or Number.", variant: "destructive" });
    }
  }, [orders, orderSearchId, toast]);

  useEffect(() => {
    if (initialOrderId) {
      setOrderSearchId(initialOrderId);
      const order = orders.find(o => o.orderNumber.toLowerCase() === initialOrderId.toLowerCase() || o.id === initialOrderId);
      if (order) {
        setFoundOrder(order);
        setIsProductionDialogOpen(true);
      }
    }
  }, [initialOrderId, orders]);

  const checkFeasibility = (order: Order) => {
    const requirements: { [materialId: string]: { materialId: string, name: string, required: number, available: number, unit: string } } = {};

    order.items.forEach(item => {
      const bom = boms.find(b => b.product_id === item.productId || b.product_name === item.productName);
      
      if (bom) {
        bom.items.forEach(bomItem => {
          if (!requirements[bomItem.material_id]) {
            const mat = materials.find(m => m.material_id === bomItem.material_id);
            requirements[bomItem.material_id] = {
              materialId: bomItem.material_id,
              name: bomItem.name,
              required: 0,
              available: mat?.current_stock || 0,
              unit: bomItem.unit
            };
          }
          requirements[bomItem.material_id].required += bomItem.quantity * item.quantity;
        });
      } else {
        // Fallback to Product.recipe if no BOM is found
        const product = products.find(p => p.product_id === item.productId || p.name === item.productName);
        if (product && product.recipe) {
          product.recipe.forEach(recipeItem => {
            if (!requirements[recipeItem.material_id]) {
              const mat = materials.find(m => m.material_id === recipeItem.material_id);
              requirements[recipeItem.material_id] = {
                materialId: recipeItem.material_id,
                name: mat?.name || recipeItem.material_id,
                required: 0,
                available: mat?.current_stock || 0,
                unit: mat?.unit || ""
              };
            }
            requirements[recipeItem.material_id].required += recipeItem.quantity * item.quantity;
          });
        }
      }
    });

    const items = Object.values(requirements);
    const isPossible = items.every(i => i.available >= i.required);
    return { items, isPossible };
  };

  const handleCreateProduction = () => {
    if (!foundOrder) return;
    const { items, isPossible } = checkFeasibility(foundOrder);

    if (!isPossible) {
      toast({ title: "Insufficient Materials", description: "Cannot start production due to low raw material stock.", variant: "destructive" });
      return;
    }

    // Create production runs for each item in the order
    foundOrder.items.forEach(item => {
      // Find the specific materials for THIS item's product
      // We can simplify by just using the product's recipe or BOM
      const bom = boms.find(b => b.product_id === item.productId || b.product_name === item.productName);
      let materialsUsed: any[] = [];
      
      if (bom) {
        materialsUsed = bom.items.map(bi => ({
          materialId: bi.material_id,
          name: bi.name,
          quantity: bi.quantity * item.quantity,
          unit: bi.unit
        }));
      } else {
        const product = products.find(p => p.product_id === item.productId || p.name === item.productName);
        if (product && product.recipe) {
          materialsUsed = product.recipe.map(ri => {
            const mat = materials.find(m => m.material_id === ri.material_id);
            return {
              materialId: ri.material_id,
              name: mat?.name || ri.material_id,
              quantity: ri.quantity * item.quantity,
              unit: mat?.unit || ""
            };
          });
        }
      }

      const newRun: ProductionRun = {
        id: `PRD-${String(Date.now()).slice(-4)}-${item.productId.slice(-2)}`,
        orderId: foundOrder.id,
        orderNumber: foundOrder.orderNumber,
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        status: "Pending",
        startDate: new Date().toISOString().split("T")[0],
        materialsUsed
      };
      addProductionRun(newRun);
    });

    // Update order status to Processing
    updateOrderStatus(foundOrder.id, "Processing");

    // Deduct raw materials from stock
    items.forEach(req => {
      const mat = materials.find(m => m.material_id === req.materialId);
      if (mat) {
        updateMaterial({
          ...mat,
          current_stock: Math.max(0, mat.current_stock - req.required)
        });
      }
    });

    toast({ title: "Production Started", description: `Production runs created for Order ${foundOrder.orderNumber}` });
    setIsProductionDialogOpen(false);
    setFoundOrder(null);
    setOrderSearchId("");
  };

  const filteredRuns = useMemo(() => {
    return productionRuns.filter((r) => {
      const matchesSearch =
        r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || r.status.toLowerCase() === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [productionRuns, searchTerm, statusFilter]);

  return (
    <div className="flex flex-1 flex-col bg-background animate-in-fade">
      <PageHeader
        title="Production Management"
        breadcrumbs={[{ title: "Operations" }, { title: "Production" }]}
      />

      <main className="flex-1 space-y-6 p-4 md:p-8">
        {/* Title + Action */}
        <div className="page-section-header animate-in-slide-up">
          <div>
            <h1 className="page-title">Production Management</h1>
            <p className="page-subtitle">Production and its Bill of Materials (BOM)</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab("runs")}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === "runs" ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              >
                <Factory className="h-3.5 w-3.5" /> Production Runs
              </button>
              <button
                onClick={() => setActiveTab("boms")}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === "boms" ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              >
                <Layers className="h-3.5 w-3.5" /> Bill of Materials
              </button>
            </div>

            {activeTab === "runs" ? (
              <Dialog open={isProductionDialogOpen} onOpenChange={setIsProductionDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90 text-white shadow-sm rounded-md h-10 px-5 font-semibold gap-2">
                    <PlayCircle className="h-4 w-4" /> Start Production
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl bg-white border-none rounded-xl shadow-2xl p-0 overflow-hidden">
                  <DialogHeader className="px-6 pt-6 pb-4 border-b border-slate-50 bg-slate-50/30">
                    <DialogTitle className="text-xl font-black tracking-tight text-slate-900">Create Production from Order</DialogTitle>
                    <DialogDescription className="text-slate-500 font-medium text-[12px]">
                      Search an order to check material availability and start production.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="p-6 space-y-6">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          placeholder="Enter Order ID or Number (e.g., ORD123)..."
                          value={orderSearchId}
                          onChange={(e) => setOrderSearchId(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleOrderSearch()}
                          className="pl-9 h-11 bg-slate-50 border-slate-200 rounded-lg focus:ring-primary/20"
                        />
                      </div>
                      <Button onClick={handleOrderSearch} variant="secondary" className="h-11 px-6 font-bold">Search</Button>
                    </div>

                    {foundOrder && (
                      <div className="space-y-6 animate-in-fade">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order #</p>
                            <p className="text-sm font-black text-slate-900">{foundOrder.orderNumber}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Customer</p>
                            <p className="text-sm font-semibold text-slate-700">{foundOrder.customerName}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</p>
                            <p className="text-sm font-semibold text-slate-700">{foundOrder.orderDate}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Items</p>
                            <p className="text-sm font-semibold text-slate-700">{foundOrder.items.length}</p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                            <Archive className="h-4 w-4 text-primary" /> Material Feasibility Check
                          </h4>
                          <div className="border border-slate-100 rounded-xl overflow-hidden">
                            <Table>
                              <TableHeader className="bg-slate-50/50">
                                <TableRow>
                                  <TableHead className="text-[10px] font-bold uppercase py-3">Material</TableHead>
                                  <TableHead className="text-[10px] font-bold uppercase py-3">Required</TableHead>
                                  <TableHead className="text-[10px] font-bold uppercase py-3">Available</TableHead>
                                  <TableHead className="text-[10px] font-bold uppercase py-3">Projected</TableHead>
                                  <TableHead className="text-[10px] font-bold uppercase py-3">Status</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {checkFeasibility(foundOrder).items.map((req, idx) => (
                                  <TableRow key={idx}>
                                    <TableCell className="text-sm font-medium">{req.name}</TableCell>
                                    <TableCell className="text-sm font-bold text-slate-900">{req.required} {req.unit}</TableCell>
                                    <TableCell className="text-sm font-medium text-slate-600">{req.available} {req.unit}</TableCell>
                                    <TableCell className={`text-sm font-bold ${req.available - req.required < 0 ? "text-rose-500" : "text-blue-600"}`}>
                                      {Math.max(0, req.available - req.required).toFixed(1)} {req.unit}
                                    </TableCell>
                                    <TableCell>
                                      {req.available >= req.required ? (
                                        <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 shadow-none">Available</Badge>
                                      ) : (
                                        <Badge variant="destructive" className="shadow-none">Shortage: {(req.required - req.available).toFixed(1)}</Badge>
                                      )}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                          <div className="flex items-center gap-3">
                            {checkFeasibility(foundOrder).isPossible ? (
                              <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                <CheckCircle2 className="h-6 w-6" />
                              </div>
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                                <AlertCircle className="h-6 w-6" />
                              </div>
                            )}
                            <div>
                              <p className="text-sm font-bold text-slate-900">
                                {checkFeasibility(foundOrder).isPossible ? "Production Ready" : "Production Blocked"}
                              </p>
                              <p className="text-xs text-slate-500 font-medium">
                                {checkFeasibility(foundOrder).isPossible ? "All materials are in stock for this order." : "Please restock required materials before starting."}
                              </p>
                            </div>
                          </div>
                          <Button
                            disabled={!checkFeasibility(foundOrder).isPossible}
                            onClick={handleCreateProduction}
                            className="bg-primary hover:bg-primary/90 text-white font-bold px-8"
                          >
                            Create Production Run
                          </Button>
                        </div>
                      </div>
                    )}

                    {!foundOrder && !orderSearchId && (
                      <div className="py-12 text-center text-slate-400">
                        <Search className="h-10 w-10 mx-auto mb-3 opacity-20" />
                        <p className="font-semibold">Enter an order ID to begin feasibility check</p>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            ) : (
              <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90 text-white shadow-sm rounded-md h-10 px-5 font-semibold gap-2">
                    <Plus className="h-4 w-4" /> New BOM
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl bg-white border-none rounded-md shadow-2xl p-0 overflow-hidden">
                  <DialogHeader className="px-5 pt-5 pb-3 border-b border-slate-50 bg-slate-50/30">
                    <DialogTitle className="text-lg font-black tracking-tight text-slate-900">Create Bill of Materials</DialogTitle>
                    <DialogDescription className="text-slate-500 font-medium text-[12px]">
                      Define the raw material recipe for a finished product.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="no-scrollbar max-h-[70vh] overflow-y-auto px-5 py-3">
                    <form onSubmit={handleCreate} className="space-y-4">
                      {/* Product & Status */}
                      <div className="grid gap-x-4 gap-y-3 md:grid-cols-2">
                        <div className="space-y-1.5">
                          <Label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider">Finished Product</Label>
                          <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                            <SelectTrigger className="h-9 bg-slate-50/50 border-slate-200 rounded-md text-sm w-full">
                              <SelectValue placeholder="Select product..." />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-slate-200 rounded-md shadow-2xl">
                              {products.map((p) => (
                                <SelectItem key={p.product_id} value={p.product_id}>{p.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider">Status</Label>
                          <Select value={bomStatus} onValueChange={(v) => setBomStatus(v as BOM["status"])}>
                            <SelectTrigger className="h-9 bg-slate-50/50 border-slate-200 rounded-xl text-sm w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-slate-200 rounded-xl shadow-2xl">
                              <SelectItem value="Draft">Draft</SelectItem>
                              <SelectItem value="Active">Active</SelectItem>
                              <SelectItem value="Archived">Archived</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Materials Recipe */}
                      <div className="space-y-4 pt-4">
                        <div className="flex items-center justify-between px-1">
                          <h3 className="text-sm font-semibold text-slate-700">Raw Material Recipe</h3>
                          <Button type="button" variant="outline" size="sm"
                            className="bg-slate-50/50 border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold gap-2 rounded-md h-10 px-4"
                            onClick={addBomItem}
                          >
                            <Plus className="h-4 w-4" /> Add Row
                          </Button>
                        </div>

                        <div className="bg-white border border-slate-100 rounded-md p-4 space-y-4 shadow-sm">
                          {bomItems.map((item, index) => (
                            <div key={index} className="space-y-4">
                              <div className="flex gap-4 items-center">
                                <div className="flex-1">
                                  <Select value={item.materialId} onValueChange={(v) => updateBomItem(index, "materialId", v)}>
                                    <SelectTrigger className="h-9 w-full bg-white border-slate-200 rounded-md focus:ring-2 focus:ring-blue-500/20 text-sm">
                                      <SelectValue placeholder="Choose raw material" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white border-slate-200 rounded-md shadow-2xl">
                                      {materials.map((m) => (
                                        <SelectItem key={m.material_id} value={m.material_id}>
                                          {m.name} ({m.unit})
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="w-24">
                                  <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="Qty"
                                    value={item.quantity}
                                    onChange={(e) => updateBomItem(index, "quantity", e.target.value)}
                                    className="h-9 bg-white border-slate-200 rounded-md text-center text-sm"
                                  />
                                </div>
                                <Button type="button" variant="ghost" size="icon"
                                  onClick={() => removeBomItem(index)}
                                  className="h-9 w-9 text-slate-300 hover:text-rose-500 transition-colors"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              {index === bomItems.length - 1 && (
                                <p className="text-[12px] text-slate-400 font-medium ml-1">
                                  Define ingredients and required quantity per finished product unit.
                                </p>
                              )}
                              {index < bomItems.length - 1 && <div className="border-b border-slate-50 mx-2" />}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Estimated Cost + Submit */}
                      <div className="pt-2 space-y-4">
                        <div className="flex justify-between items-end px-4">
                          <div className="space-y-0.5">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Estimated Unit Cost</p>
                            <p className="text-3xl font-black text-slate-900 tracking-tighter">
                              ₹{bomItems.reduce((sum, bi) => {
                                const mat = materials.find((m) => m.material_id === bi.materialId);
                                return sum + (Number(bi.quantity) || 0) * (mat?.cost_per_unit || 0);
                              }, 0).toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <Button type="submit" className="w-full h-11 bg-[#021a41] hover:bg-[#03255a] text-white font-bold rounded-md shadow-lg shadow-blue-900/10 gap-2 text-sm transition-all active:scale-[0.98]">
                          <Save className="h-4 w-4" /> Save BOM
                        </Button>
                      </div>
                    </form>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-3 animate-in-slide-up [animation-delay:50ms]">
          <div className="stat-card">
            <div className="stat-icon bg-blue-50">
              {activeTab === "runs" ? <Factory className="h-5 w-5 text-primary" /> : <Layers className="h-5 w-5 text-primary" />}
            </div>
            <div>
              <p className="stat-label">{activeTab === "runs" ? "Active Runs" : "Total BOMs"}</p>
              <p className="stat-value">{activeTab === "runs" ? productionRuns.filter(r => r.status === "In Progress").length : boms.length}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon bg-emerald-50"><CheckCircle2 className="h-5 w-5 text-emerald-500" /></div>
            <div>
              <p className="stat-label">{activeTab === "runs" ? "Completed" : "Active BOMs"}</p>
              <p className="stat-value">{activeTab === "runs" ? productionRuns.filter(r => r.status === "Completed").length : activeCount}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon bg-amber-50">
              {activeTab === "runs" ? <ClipboardList className="h-5 w-5 text-amber-500" /> : <FileText className="h-5 w-5 text-amber-500" />}
            </div>
            <div>
              <p className="stat-label">{activeTab === "runs" ? "Pending Runs" : "Avg. Cost"}</p>
              <p className="stat-value text-xl">
                {activeTab === "runs" ? productionRuns.filter(r => r.status === "Pending").length : `₹${totalCostAvg.toFixed(2)}`}
              </p>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <Card className="bg-white border-slate-200 shadow-sm overflow-hidden rounded-xl animate-in-slide-up [animation-delay:100ms]">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 bg-slate-50/50 p-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder={activeTab === "runs" ? "Search runs, products or orders..." : "Search by BOM ID or product..."}
                className="pl-8 bg-white border-slate-200 text-slate-900 h-9 rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              {(activeTab === "runs" 
                ? ["all", "pending", "in progress", "completed"] 
                : ["all", "active", "draft", "archived"]
              ).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all capitalize ${statusFilter === s
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                    }`}
                >
                  {s === "all" ? "All" : s}
                </button>
              ))}
            </div>
          </div>

          {activeTab === "runs" ? (
            <Table>
              <TableHeader className="bg-slate-50/80">
                <TableRow className="border-slate-100 hover:bg-transparent">
                  <TableHead className="pl-6 w-32 text-slate-500 uppercase text-[10px] font-bold tracking-wider py-4">Run ID</TableHead>
                  <TableHead className="text-slate-500 uppercase text-[10px] font-bold tracking-wider py-4">Product</TableHead>
                  <TableHead className="text-slate-500 uppercase text-[10px] font-bold tracking-wider py-4">Order #</TableHead>
                  <TableHead className="text-slate-500 uppercase text-[10px] font-bold tracking-wider py-4">Qty</TableHead>
                  <TableHead className="text-slate-500 uppercase text-[10px] font-bold tracking-wider py-4">Start Date</TableHead>
                  <TableHead className="text-slate-500 uppercase text-[10px] font-bold tracking-wider py-4">Status</TableHead>
                  <TableHead className="text-right pr-6 text-slate-500 uppercase text-[10px] font-bold tracking-wider py-4">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRuns.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-slate-400">
                      <Factory className="h-8 w-8 mx-auto mb-2 opacity-30" />
                      <p className="font-semibold">No production runs found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRuns.map((run) => (
                    <TableRow key={run.id} className="border-slate-100 hover:bg-slate-50/50 transition-colors group">
                      <TableCell className="pl-6 py-4 font-semibold text-primary">{run.id}</TableCell>
                      <TableCell className="font-semibold text-slate-900">{run.productName}</TableCell>
                      <TableCell className="text-slate-600 text-sm font-medium">
                        {run.orderNumber || "Manual"}
                      </TableCell>
                      <TableCell className="font-bold text-slate-900">{run.quantity}</TableCell>
                      <TableCell className="text-slate-500 text-xs font-medium">{run.startDate}</TableCell>
                      <TableCell>
                        <Select value={run.status} onValueChange={(v) => updateProductionRun({ ...run, status: v as ProductionRun["status"] })}>
                          <SelectTrigger className="h-8 w-32 text-[11px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => setViewRun(run)}>
                            <Eye className="h-4 w-4 text-slate-500" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => deleteProductionRun(run.id)}>
                            <Trash2 className="h-4 w-4 text-rose-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          ) : (
            <Table>
              <TableHeader className="bg-slate-50/80">
                <TableRow className="border-slate-100 hover:bg-transparent">
                  <TableHead className="pl-6 w-32 text-slate-500 uppercase text-[10px] font-bold tracking-wider py-4">BOM ID</TableHead>
                  <TableHead className="text-slate-500 uppercase text-[10px] font-bold tracking-wider py-4">Product</TableHead>
                  <TableHead className="text-slate-500 uppercase text-[10px] font-bold tracking-wider py-4">Materials</TableHead>
                  <TableHead className="text-slate-500 uppercase text-[10px] font-bold tracking-wider py-4">Unit Cost</TableHead>
                  <TableHead className="text-slate-500 uppercase text-[10px] font-bold tracking-wider py-4">Updated</TableHead>
                  <TableHead className="text-slate-500 uppercase text-[10px] font-bold tracking-wider py-4">Status</TableHead>
                  <TableHead className="text-right pr-6 text-slate-500 uppercase text-[10px] font-bold tracking-wider py-4">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-slate-400">
                      <Layers className="h-8 w-8 mx-auto mb-2 opacity-30" />
                      <p className="font-semibold">No BOMs found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((bom) => (
                    <TableRow key={bom.id} className="border-slate-100 hover:bg-slate-50/50 transition-colors group">
                      <TableCell className="pl-6 py-4 font-semibold text-primary">{bom.id}</TableCell>
                      <TableCell className="font-semibold text-slate-900">{bom.product_name}</TableCell>
                      <TableCell className="text-slate-600 text-sm font-medium">
                        {bom.items.length} item{bom.items.length !== 1 ? "s" : ""}
                      </TableCell>
                      <TableCell className="font-bold text-slate-900">₹{bom.total_cost.toFixed(2)}</TableCell>
                      <TableCell className="text-slate-500 text-xs font-medium">{bom.last_updated}</TableCell>
                      <TableCell>
                        <Select value={bom.status} onValueChange={(v) => handleStatusChange(bom.id, v as BOM["status"])}>
                          <SelectTrigger className="h-8 w-28 text-[11px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Draft">Draft</SelectItem>
                            <SelectItem value="Archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => setViewBom(bom)}>
                            <Eye className="h-4 w-4 text-slate-500" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(bom.id)}>
                            <Trash2 className="h-4 w-4 text-rose-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </Card>

        {/* ── Detail View Dialog ── */}
        <Dialog open={!!viewBom} onOpenChange={() => setViewBom(null)}>
          <DialogContent className="max-w-2xl bg-white border-none rounded-3xl shadow-2xl p-0 overflow-hidden">
            <DialogHeader className="px-8 pt-8 pb-6 border-b border-slate-50 bg-slate-50/30">
              <DialogTitle className="text-2xl font-black tracking-tight text-slate-900">
                {viewBom?.id} — {viewBom?.product_name}
              </DialogTitle>
              <DialogDescription className="text-slate-500 font-medium text-[13px]">
                Bill of Materials breakdown for this product.
              </DialogDescription>
            </DialogHeader>
            {viewBom && (
              <div className="px-8 py-6 space-y-6">
                <div className="flex gap-6">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</p>
                    <StatusBadge status={viewBom.status} className="mt-1" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last Updated</p>
                    <p className="text-sm font-semibold text-slate-700 mt-1">{viewBom.last_updated}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Cost/Unit</p>
                    <p className="text-sm font-black text-slate-900 mt-1">₹{viewBom.total_cost.toFixed(2)}</p>
                  </div>
                </div>

                <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
                  <Table>
                    <TableHeader className="bg-slate-50/80">
                      <TableRow className="border-slate-100">
                        <TableHead className="pl-4 text-slate-500 uppercase text-[10px] font-bold tracking-wider py-3">Material</TableHead>
                        <TableHead className="text-slate-500 uppercase text-[10px] font-bold tracking-wider py-3">Quantity</TableHead>
                        <TableHead className="text-slate-500 uppercase text-[10px] font-bold tracking-wider py-3">Unit</TableHead>
                        <TableHead className="text-right pr-4 text-slate-500 uppercase text-[10px] font-bold tracking-wider py-3">Cost</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {viewBom.items.map((item, idx) => (
                        <TableRow key={idx} className="border-slate-50">
                          <TableCell className="pl-4 font-medium text-slate-900">{item.name}</TableCell>
                          <TableCell className="text-slate-600">{item.quantity}</TableCell>
                          <TableCell className="text-slate-500 capitalize">{item.unit}</TableCell>
                          <TableCell className="text-right pr-4 font-bold text-slate-900">₹{item.cost.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex justify-between items-center pt-2 px-2">
                  <span className="text-sm font-semibold text-slate-500">Grand Total</span>
                  <span className="text-2xl font-black text-primary">₹{viewBom.total_cost.toFixed(2)}</span>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* ── Production Run Detail View ── */}
        <Dialog open={!!viewRun} onOpenChange={() => setViewRun(null)}>
          <DialogContent className="max-w-2xl bg-white border-none rounded-3xl shadow-2xl p-0 overflow-hidden">
            <DialogHeader className="px-8 pt-8 pb-6 border-b border-slate-50 bg-slate-50/30">
              <DialogTitle className="text-2xl font-black tracking-tight text-slate-900">
                {viewRun?.id} — {viewRun?.productName}
              </DialogTitle>
              <DialogDescription className="text-slate-500 font-medium text-[13px]">
                Production run details and material consumption.
              </DialogDescription>
            </DialogHeader>
            {viewRun && (
              <div className="px-8 py-6 space-y-6">
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</p>
                    <StatusBadge status={viewRun.status} className="mt-1" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Start Date</p>
                    <p className="text-sm font-semibold text-slate-700 mt-1">{viewRun.startDate}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order #</p>
                    <p className="text-sm font-black text-slate-900 mt-1">{viewRun.orderNumber || "Manual Production"}</p>
                  </div>
                </div>

                <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
                  <Table>
                    <TableHeader className="bg-slate-50/80">
                      <TableRow className="border-slate-100">
                        <TableHead className="pl-4 text-slate-500 uppercase text-[10px] font-bold tracking-wider py-3">Material</TableHead>
                        <TableHead className="text-slate-500 uppercase text-[10px] font-bold tracking-wider py-3">Required Qty</TableHead>
                        <TableHead className="text-right pr-4 text-slate-500 uppercase text-[10px] font-bold tracking-wider py-3">Unit</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {viewRun.materialsUsed.map((item, idx) => (
                        <TableRow key={idx} className="border-slate-50">
                          <TableCell className="pl-4 font-medium text-slate-900">{item.name}</TableCell>
                          <TableCell className="font-bold text-slate-900">{item.quantity.toFixed(2)}</TableCell>
                          <TableCell className="text-right pr-4 text-slate-500 capitalize">{item.unit}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}

export default function BOMPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BOMPageContent />
    </Suspense>
  );
}
