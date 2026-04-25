"use client";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import {
  Plus, Search, Mail, Phone, Building2, ExternalLink, Save, Trash2, Users,
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useState, useMemo } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAppStore } from "@/lib/store";

interface Supplier {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
}

export default function SuppliersPage() {
  const { toast } = useToast();
  const { state, addSupplier, deleteSupplier } = useAppStore();
  const supplierList = state.suppliers;
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: "", contact: "", email: "", phone: "" });

  const filtered = useMemo(() => {
    return supplierList.filter((s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [supplierList, searchTerm]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newSupplier: Supplier = {
      id: `SUP${String(Date.now()).slice(-6)}`,
      name: form.name,
      contact: form.contact,
      email: form.email,
      phone: form.phone,
    };
    addSupplier(newSupplier);
    setIsDialogOpen(false);
    setForm({ name: "", contact: "", email: "", phone: "" });
    toast({ title: "✅ Supplier Added", description: `${newSupplier.name} has been registered.` });
  };

  const handleDelete = (id: string, name: string) => {
    deleteSupplier(id);
    toast({ title: "🗑️ Supplier Removed", description: `${name} has been deleted.` });
  };

  return (
    <div className="flex flex-1 flex-col bg-background animate-in-fade">
      <PageHeader title="Suppliers" breadcrumbs={[{ title: "Relationships" }, { title: "Suppliers" }]} />

      <main className="flex-1 p-3 space-y-3">
        <div className="page-section-header animate-in-slide-up">
          <div>
            <h1 className="page-title">Supplier Directory</h1>
            <p className="page-subtitle">Manage raw material providers and logistics partners.</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-white shadow-sm rounded-md h-10 px-5 font-semibold gap-2">
                <Plus className="h-4 w-4" /> ADD SUPPLIER
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-white border-none rounded-md shadow-2xl p-0 overflow-hidden">
              <DialogHeader className="px-5 pt-5 pb-3 border-b border-slate-50 bg-slate-50/30">
                <DialogTitle className="text-lg font-black tracking-tight text-slate-900">Add New Supplier</DialogTitle>
                <DialogDescription className="text-slate-500 font-medium text-[12px]">Register a new vendor for raw material procurement.</DialogDescription>
              </DialogHeader>
              <div className="no-scrollbar max-h-[70vh] overflow-y-auto px-5 py-3">
                <form onSubmit={handleAdd} className="space-y-4">
                  <div className="grid gap-x-4 gap-y-3 md:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider">Company Name</Label>
                      <Input
                        placeholder="e.g. Agro Foods Ltd"
                        required
                        className="h-9 bg-slate-50/50 border-slate-200 rounded-md text-slate-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider">Contact Person</Label>
                      <Input
                        placeholder="e.g. Rajesh Kumar"
                        required
                        className="h-9 bg-slate-50/50 border-slate-200 rounded-md text-slate-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        value={form.contact}
                        onChange={(e) => setForm({ ...form, contact: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider">Email Address</Label>
                      <Input
                        type="email"
                        placeholder="vendor@example.com"
                        required
                        className="h-9 bg-slate-50/50 border-slate-200 rounded-md text-slate-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider">Phone Number</Label>
                      <Input
                        placeholder="+91 98765 12345"
                        required
                        className="h-9 bg-slate-50/50 border-slate-200 rounded-md text-slate-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button type="submit" className="w-full h-11 bg-[#021a41] hover:bg-[#03255a] text-white font-bold rounded-md shadow-lg shadow-blue-900/10 gap-2 text-sm transition-all active:scale-[0.98]">
                      <Save className="h-4 w-4" /> Save Supplier
                    </Button>
                  </div>
                </form>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid gap-3 md:grid-cols-2 animate-in-slide-up [animation-delay:50ms]">
          <div className="bg-white border border-slate-200 rounded-md p-4 flex items-center gap-4 shadow-sm">
            <div className="h-10 w-10 rounded-md bg-blue-50 flex items-center justify-center"><Building2 className="h-5 w-5 text-primary" /></div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Vendors</p>
              <p className="text-2xl font-bold text-slate-900">{supplierList.length}</p>
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-md p-4 flex items-center gap-4 shadow-sm">
            <div className="h-10 w-10 rounded-md bg-emerald-50 flex items-center justify-center"><Users className="h-5 w-5 text-emerald-500" /></div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Partnerships</p>
              <p className="text-2xl font-bold text-slate-900">{supplierList.length}</p>
            </div>
          </div>
        </div>

        {/* Search + Table */}
        <Card className="bg-white border-slate-200 shadow-sm overflow-hidden rounded-md animate-in-slide-up [animation-delay:150ms]">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input placeholder="Search suppliers…" className="h-8 pl-8 bg-white border-slate-200 text-slate-900 text-[13px] rounded-md" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>

          <Table>
            <TableHeader className="bg-slate-50/80">
              <TableRow className="border-slate-100 hover:bg-transparent">
                <TableHead className="pl-6 w-62 text-slate-500 uppercase text-[10px] font-bold tracking-wider py-4">Vendor Name</TableHead>
                <TableHead className="text-slate-500 uppercase text-[10px] font-bold tracking-wider py-4">Contact Person</TableHead>
                <TableHead className="text-slate-500 uppercase text-[10px] font-bold tracking-wider py-4">Contact Details</TableHead>
                <TableHead className="text-right pr-6 text-slate-500 uppercase text-[10px] font-bold tracking-wider py-4">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12 text-slate-400">
                    <Building2 className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    <p className="font-semibold">No suppliers found</p>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((supplier) => (
                  <TableRow key={supplier.id} className="border-slate-100 hover:bg-slate-50/50 transition-colors group">
                    <TableCell className="pl-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                          {supplier.name.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-900">{supplier.name}</span>
                          <span className="text-[11px] text-primary font-medium">{supplier.id}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-semibold text-slate-700">{supplier.contact}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500"><Mail className="h-3.5 w-3.5 text-slate-400" /> {supplier.email}</div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500"><Phone className="h-3.5 w-3.5 text-slate-400" /> {supplier.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-primary hover:bg-blue-50">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-rose-500 hover:bg-rose-50" onClick={() => handleDelete(supplier.id, supplier.name)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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
