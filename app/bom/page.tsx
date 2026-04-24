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
  Plus, Search, Layers, FileText, Archive, CheckCircle2, Trash2, Save, Eye,
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/StatusBadge";
import { useState, useMemo } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAppStore } from "@/lib/store";
import { BOM, BOMItem } from "@/lib/snack-mock-data";

export default function BOMPage() {
  const { toast } = useToast();
  const { state, addBom, updateBom, deleteBom } = useAppStore();

  const boms = state.boms;
  const products = state.products;
  const materials = state.materials;

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [viewBom, setViewBom] = useState<BOM | null>(null);

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

  return (
    <div className="flex flex-1 flex-col bg-background animate-in-fade">
      <PageHeader
        title="Bill of Materials"
        breadcrumbs={[{ title: "Production" }, { title: "BOM" }]}
      />

      <main className="flex-1 space-y-6 p-4 md:p-8">
        {/* Title + Action */}
        <div className="page-section-header animate-in-slide-up">
          <div>
            <h1 className="page-title">Bill of Materials</h1>
            <p className="page-subtitle">Define raw material recipes for each finished product.</p>
          </div>
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
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-3 animate-in-slide-up [animation-delay:50ms]">
          <div className="stat-card">
            <div className="stat-icon bg-blue-50"><Layers className="h-5 w-5 text-primary" /></div>
            <div><p className="stat-label">Total BOMs</p><p className="stat-value">{boms.length}</p></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon bg-emerald-50"><CheckCircle2 className="h-5 w-5 text-emerald-500" /></div>
            <div><p className="stat-label">Active</p><p className="stat-value">{activeCount}</p></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon bg-amber-50"><FileText className="h-5 w-5 text-amber-500" /></div>
            <div><p className="stat-label">Avg. Unit Cost</p><p className="stat-value text-xl">₹{totalCostAvg.toFixed(2)}</p></div>
          </div>
        </div>

        {/* Table */}
        <Card className="bg-white border-slate-200 shadow-sm overflow-hidden rounded-xl animate-in-slide-up [animation-delay:100ms]">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 bg-slate-50/50 p-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by BOM ID or product..."
                className="pl-8 bg-white border-slate-200 text-slate-900 h-9 rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              {["all", "active", "draft", "archived"].map((s) => (
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
      </main>
    </div>
  );
}
