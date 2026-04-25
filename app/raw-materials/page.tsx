"use client";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Plus, Search, Edit2, Trash2, Download, Package, Save, Warehouse, IndianRupee, AlertTriangle,
} from "lucide-react";
import { RawMaterial } from "@/lib/snack-mock-data";
import { Label } from "@/components/ui/label";
import { useState, useMemo } from "react";
import type { Dispatch, SetStateAction } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAppStore } from "@/lib/store";

type MaterialFormData = {
  id: string;
  name: string;
  unit: string;
  stock: string;
  cost: string;
};

function FormFields({
  formData,
  setFormData,
  onSubmit,
  label,
  disableId,
}: {
  formData: MaterialFormData;
  setFormData: Dispatch<SetStateAction<MaterialFormData>>;
  onSubmit: (e: React.FormEvent) => void;
  label: string;
  disableId?: boolean;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-x-4 gap-y-3 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider">Material ID</Label>
          <Input
            placeholder="RM006"
            required
            disabled={disableId}
            className="h-9 bg-slate-50/50 border-slate-200 rounded-md text-slate-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-60"
            value={formData.id}
            onChange={(e) => setFormData({ ...formData, id: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider">Name</Label>
          <Input
            placeholder="Chili Powder"
            required
            className="h-9 bg-slate-50/50 border-slate-200 rounded-md text-slate-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider">Unit</Label>
          <Select value={formData.unit} onValueChange={(v) => setFormData({ ...formData, unit: v })}>
            <SelectTrigger className="h-9 w-full bg-slate-50/50 border-slate-200 text-slate-900 rounded-md focus:ring-2 focus:ring-blue-500/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200 rounded-md shadow-2xl">
              <SelectItem value="kg">Kilogram (kg)</SelectItem>
              <SelectItem value="litre">Litre</SelectItem>
              <SelectItem value="pcs">Pieces</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider">Current Stock</Label>
          <Input
            type="number"
            min="0"
            placeholder="0"
            required
            className="h-9 bg-slate-50/50 border-slate-200 rounded-md text-slate-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
          />
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <Label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider">Cost / Unit (INR)</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-xs">INR</span>
            <Input
              type="number"
              min="0"
              placeholder="0.00"
              required
              className="h-9 bg-slate-50/50 border-slate-200 rounded-md text-slate-900 pl-8 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              value={formData.cost}
              onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          className="w-full h-11 bg-[#021a41] hover:bg-[#03255a] text-white font-bold rounded-md shadow-lg shadow-blue-900/10 gap-2 text-sm transition-all active:scale-[0.98]"
        >
          <Save className="h-4 w-4" /> {label}
        </Button>
      </div>
    </form>
  );
}

export default function RawMaterialsPage() {
  const { toast } = useToast();
  const { state, addMaterial, updateMaterial, deleteMaterial } = useAppStore();
  const materials = state.materials;

  const [searchTerm, setSearchTerm] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<RawMaterial | null>(null);
  const [formData, setFormData] = useState({ id: "", name: "", unit: "kg", stock: "", cost: "" });

  const filtered = useMemo(
    () => materials.filter((m) => m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.material_id.toLowerCase().includes(searchTerm.toLowerCase())),
    [materials, searchTerm]
  );

  const resetForm = () => setFormData({ id: "", name: "", unit: "kg", stock: "", cost: "" });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const m: RawMaterial = {
      material_id: formData.id, name: formData.name,
      unit: formData.unit as "kg" | "litre" | "pcs",
      current_stock: Number(formData.stock), cost_per_unit: Number(formData.cost),
    };
    addMaterial(m);
    setIsAddOpen(false);
    resetForm();
    toast({ title: "Material added", description: `${m.name} registered.` });
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget) return;
    updateMaterial({
      ...editTarget,
      name: formData.name,
      unit: formData.unit as "kg" | "litre" | "pcs",
      current_stock: Number(formData.stock),
      cost_per_unit: Number(formData.cost),
    });
    setEditTarget(null);
    resetForm();
    toast({ title: "Material updated", description: `${formData.name} has been updated.` });
  };

  const openEdit = (m: RawMaterial) => {
    setEditTarget(m);
    setFormData({ id: m.material_id, name: m.name, unit: m.unit, stock: String(m.current_stock), cost: String(m.cost_per_unit) });
  };

  const handleDelete = (id: string, name: string) => {
    deleteMaterial(id);
    toast({ title: "Material removed", description: `${name} deleted from inventory.` });
  };

  const totalValue   = materials.reduce((s, m) => s + m.current_stock * m.cost_per_unit, 0);
  const lowCount     = materials.filter((m) => m.current_stock < 50).length;

  return (
    <div className="flex flex-1 flex-col bg-background animate-in-fade">
      <PageHeader title="Raw Materials" breadcrumbs={[{ title: "Inventory" }, { title: "Raw Materials" }]} />

      <main className="flex-1 p-3 space-y-3">
        {/* Header */}
        <div className="page-section-header animate-in-slide-up">
          <div><h1 className="page-title">Raw Materials</h1><p className="page-subtitle">Manage ingredient inventory, costs, and stock levels.</p></div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-9 gap-1.5 border-slate-200 text-slate-600 hover:bg-slate-50 rounded-md hidden md:flex">
              <Download className="h-3.5 w-3.5 text-primary" /> Export
            </Button>
            <Dialog open={isAddOpen} onOpenChange={(o) => { setIsAddOpen(o); if (!o) resetForm(); }}>
              <DialogTrigger asChild>
                <Button size="sm" className="h-9 gap-1.5 bg-primary hover:bg-primary/90 text-white font-medium rounded-md shadow-sm shadow-primary/20">
                  <Plus className="h-3.5 w-3.5" /> Add Material
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-white border-none rounded-md shadow-2xl p-0 overflow-hidden">
                <DialogHeader className="px-5 pt-5 pb-3 border-b border-slate-50 bg-slate-50/30">
                  <DialogTitle className="text-lg font-black tracking-tight text-slate-900">Add Raw Material</DialogTitle>
                  <DialogDescription className="text-slate-500 font-medium text-[12px]">Register a new ingredient or supply item.</DialogDescription>
                </DialogHeader>
                <div className="no-scrollbar max-h-[70vh] overflow-y-auto px-5 py-3">
                  <FormFields formData={formData} setFormData={setFormData} onSubmit={handleAdd} label="Save Material" />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 animate-in-slide-up [animation-delay:50ms]">
          <div className="stat-card"><div className="stat-icon bg-blue-50"><Warehouse className="h-5 w-5 text-primary" /></div><div><p className="stat-label">Total Items</p><p className="stat-value">{materials.length}</p></div></div>
          <div className="stat-card"><div className="stat-icon bg-emerald-50"><IndianRupee className="h-5 w-5 text-emerald-600" /></div><div><p className="stat-label">Stock Value</p><p className="stat-value text-xl">INR {totalValue.toLocaleString()}</p></div></div>
          <div className="stat-card"><div className="stat-icon bg-amber-50"><AlertTriangle className="h-5 w-5 text-amber-500" /></div><div><p className="stat-label">Low Stock</p><p className={`stat-value ${lowCount > 0 ? "text-amber-600" : ""}`}>{lowCount}</p></div></div>
        </div>

        {/* Search */}
        <div className="relative max-w-sm animate-in-slide-up [animation-delay:80ms]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          <Input placeholder="Search materials…" className="h-9 pl-8 bg-white border-slate-200 text-slate-900 text-sm rounded-md" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>

        {/* Table */}
        <Card className="bg-white border-slate-200 shadow-sm overflow-hidden rounded-md animate-in-slide-up [animation-delay:100ms]">
          <Table>
            <TableHeader className="bg-slate-50/80">
              <TableRow className="border-slate-100 hover:bg-transparent">
                <TableHead className="th pl-6">ID</TableHead>
                <TableHead className="th">Material Name</TableHead>
                <TableHead className="th">Unit</TableHead>
                <TableHead className="th">Stock Level</TableHead>
                <TableHead className="th">Cost/Unit</TableHead>
                <TableHead className="th">Total Value</TableHead>
                <TableHead className="th text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center py-12 text-slate-400"><Package className="h-8 w-8 mx-auto mb-2 opacity-30" /><p className="font-semibold">No materials found</p></TableCell></TableRow>
              ) : filtered.map((item) => (
                <TableRow key={item.material_id} className="tr-hover group">
                  <TableCell className="pl-6 td"><span className="text-primary font-semibold">{item.material_id}</span></TableCell>
                  <TableCell className="td">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center"><Package className="h-4 w-4 text-slate-400" /></div>
                      <span className="font-semibold text-slate-900">{item.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="td"><span className="badge badge-neutral uppercase">{item.unit}</span></TableCell>
                  <TableCell className="td">
                    <div className="flex flex-col gap-1.5">
                      <span className={`text-[13px] font-semibold ${item.current_stock < 50 ? "text-amber-600" : "text-slate-900"}`}>{item.current_stock.toLocaleString()} <span className="text-xs text-slate-400 font-normal">{item.unit}</span></span>
                      <div className="h-1.5 w-20 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full rounded-full ${item.current_stock > 100 ? "bg-primary" : item.current_stock > 30 ? "bg-amber-400" : "bg-rose-500"}`} style={{ width: `${Math.min(100, (item.current_stock / 1200) * 100)}%` }} /></div>
                    </div>
                  </TableCell>
                  <TableCell className="td font-semibold text-slate-900">INR {item.cost_per_unit.toLocaleString()}</TableCell>
                  <TableCell className="td font-bold text-slate-900">INR {(item.current_stock * item.cost_per_unit).toLocaleString()}</TableCell>
                  <TableCell className="text-right pr-6 td">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-primary hover:bg-blue-50 rounded-lg" onClick={() => openEdit(item)}><Edit2 className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg" onClick={() => handleDelete(item.material_id, item.name)}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={!!editTarget} onOpenChange={(o) => { if (!o) setEditTarget(null); }}>
          <DialogContent className="max-w-2xl bg-white border-none rounded-md shadow-2xl p-0 overflow-hidden">
            <DialogHeader className="px-8 pt-8 pb-6 border-b border-slate-50 bg-slate-50/30">
              <DialogTitle className="text-2xl font-black tracking-tight text-slate-900">Edit Material</DialogTitle>
              <DialogDescription className="text-slate-500 font-medium text-[13px]">Update stock levels and unit pricing.</DialogDescription>
            </DialogHeader>
            <div className="-mx-1 no-scrollbar max-h-[75vh] overflow-y-auto px-8 py-6">
              <FormFields formData={formData} setFormData={setFormData} onSubmit={handleEdit} label="Update Material" disableId />
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
