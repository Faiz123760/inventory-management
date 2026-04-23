"use client";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
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
  Plus,
  Search,
  MoreHorizontal,
  Edit2,
  Trash2,
  Filter,
  Download,
  Package,
  Save
} from "lucide-react";
import { rawMaterials, RawMaterial } from "@/lib/snack-mock-data";
import Link from "next/link";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export default function RawMaterialsPage() {
  const { toast } = useToast();
  const [materials, setMaterials] = useState<RawMaterial[]>(rawMaterials);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    unit: "kg",
    stock: "",
    cost: ""
  });

  const filteredMaterials = materials.filter((item: RawMaterial) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.material_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    const newMaterial: RawMaterial = {
      material_id: formData.id,
      name: formData.name,
      unit: formData.unit as 'kg' | 'litre' | 'pcs',
      current_stock: Number(formData.stock),
      cost_per_unit: Number(formData.cost),
    };

    setMaterials([newMaterial, ...materials]);
    setIsAddDialogOpen(false);
    setFormData({ id: "", name: "", unit: "kg", stock: "", cost: "" });

    toast({
      title: "Material Added",
      description: `${newMaterial.name} has been added to inventory.`,
    });
  };

  const handleAction = (name: string, action: string) => {
    toast({
      title: `${action} Initialized`,
      description: `Performing ${action.toLowerCase()} on ${name}.`,
    });
  };

  return (
    <div className="flex flex-1 flex-col bg-background animate-in-fade">
      <PageHeader
        title="Raw Materials"
        breadcrumbs={[{ title: "Inventory" }, { title: "Raw Materials" }]}
      />

      <main className="flex-1 space-y-6 p-4 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-6 animate-in-slide-up">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight text-slate-500">Raw Materials</h2>
            <p className="text-slate-500 font-medium tracking-tight">Manage your ingredient inventory and procurement costs.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="hidden md:flex">
              <Download className="mr-2 h-4 w-4 text-primary" /> Export
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> New Material
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] bg-white border-slate-200 text-slate-900 shadow-xl rounded-xl">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">Add Raw Material</DialogTitle>
                  <DialogDescription className="text-slate-500">
                    Register a new ingredient or supply item.
                  </DialogDescription>
                </DialogHeader>
                <form className="space-y-4 py-4" onSubmit={handleAddMaterial}>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="material_id" className="text-slate-600 text-xs font-semibold uppercase tracking-wider pl-1">Material ID</Label>
                      <Input
                        id="material_id"
                        placeholder="RM006"
                        required
                        className="bg-slate-50 border-slate-200 text-slate-900 rounded-lg h-10"
                        value={formData.id}
                        onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-slate-600 text-xs font-semibold uppercase tracking-wider pl-1">Name</Label>
                      <Input
                        id="name"
                        placeholder="Chili Powder"
                        required
                        className="bg-slate-50 border-slate-200 text-slate-900 rounded-lg h-10"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="unit" className="text-slate-600 text-xs font-semibold uppercase tracking-wider pl-1">Unit</Label>
                      <Select
                        required
                        value={formData.unit}
                        onValueChange={(val) => setFormData({ ...formData, unit: val })}
                      >
                        <SelectTrigger className="bg-slate-50 border-slate-200 text-slate-900 rounded-lg h-10">
                          <SelectValue placeholder="Unit" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-slate-200 text-slate-900 rounded-lg">
                          <SelectItem value="kg">kg</SelectItem>
                          <SelectItem value="litre">litre</SelectItem>
                          <SelectItem value="pcs">pcs</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stock" className="text-slate-600 text-xs font-semibold uppercase tracking-wider pl-1">Current Stock</Label>
                      <Input
                        id="stock"
                        type="number"
                        placeholder="0"
                        required
                        className="bg-slate-50 border-slate-200 text-slate-900 rounded-lg h-10"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cost" className="text-slate-600 text-xs font-semibold uppercase tracking-wider pl-1">Cost Per Unit</Label>
                    <Input
                      id="cost"
                      type="number"
                      placeholder="₹ 0.00"
                      required
                      className="bg-slate-50 border-slate-200 text-slate-900 rounded-lg h-10"
                      value={formData.cost}
                      onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                    />
                  </div>
                  <DialogFooter className="pt-4">
                    <Button type="submit" className="w-full">
                      <Save className="mr-2 h-4 w-4" /> Save Material
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="space-y-4 animate-in-slide-up [animation-delay:100ms]">
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search resources..."
                className="pl-9 bg-slate-50 border-slate-200 text-slate-900 h-9 rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => handleAction("All Categories", "Filter")}>
                <Filter className="mr-2 h-4 w-4 text-primary" /> Filter
              </Button>
              <Button variant="outline" size="sm">
                Export Data
              </Button>
            </div>
          </div>

          <Card className="bg-white border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <Table>
              <TableHeader className="bg-slate-50/80">
                <TableRow className="border-slate-100 hover:bg-transparent">
                  <TableHead className="pl-6 text-slate-500 uppercase text-[10px] font-bold tracking-wider py-4">ID</TableHead>
                  <TableHead className="text-slate-500 uppercase text-[10px] font-bold tracking-wider py-4">Material Name</TableHead>
                  <TableHead className="text-slate-500 uppercase text-[10px] font-bold tracking-wider py-4">Unit</TableHead>
                  <TableHead className="text-slate-500 uppercase text-[10px] font-bold tracking-wider py-4">Stock Level</TableHead>
                  <TableHead className="text-right pr-6 text-slate-500 uppercase text-[10px] font-bold tracking-wider py-4">Cost/Unit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMaterials.map((item: RawMaterial) => (
                  <TableRow key={item.material_id} className="border-slate-100 hover:bg-slate-50/50 transition-colors group">
                    <TableCell>
                      <span className="text-primary font-medium cursor-pointer hover:underline pl-2">{item.material_id}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                          <Package className="h-4 w-4" />
                        </div>
                        <span className="font-semibold text-slate-900">{item.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-600 uppercase tracking-wide">
                        {item.unit}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900">{item.current_stock.toLocaleString()} <span className="text-xs text-slate-400 font-medium">{item.unit}</span></span>
                        <div className="mt-1.5 h-1.5 w-20 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full ${item.current_stock > 100 ? 'bg-primary' : 'bg-amber-500'} w-[70%] transition-all`} />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="font-bold text-slate-900">₹{item.cost_per_unit.toLocaleString()}</div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </main>
    </div>
  );
}
