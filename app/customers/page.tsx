"use client";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Search, UserPlus, Mail, Phone, MapPin, TrendingUp, ShoppingBag, Save, Users, Trash2,
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Customer } from "@/lib/snack-mock-data";
import { useState, useMemo } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { useAppStore } from "@/lib/store";

export default function CustomersPage() {
  const { toast } = useToast();
  const { state, addCustomer, updateCustomer, deleteCustomer } = useAppStore();
  const customerList = state.customers;
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: "", company: "", email: "", phone: "", location: "" });

  const filteredCustomers = useMemo(() => {
    return customerList.filter((c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [customerList, searchTerm]);

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    const newCustomer: Customer = {
      id: `CL${String(customerList.length + 1).padStart(3, "0")}`,
      name: form.name,
      company: form.company,
      email: form.email,
      phone: form.phone,
      location: form.location,
      total_orders: 0,
      total_spent: 0,
      status: "Active",
      last_order: "-",
    };
    addCustomer(newCustomer);
    setIsDialogOpen(false);
    setForm({ name: "", company: "", email: "", phone: "", location: "" });
    toast({ title: "✅ Customer Added", description: `${newCustomer.name} from ${newCustomer.company} has been registered.` });
  };

  const toggleStatus = (customer: Customer) => {
    const nextStatus = customer.status === "Active" ? "Inactive" : "Active";
    updateCustomer({ ...customer, status: nextStatus });
    toast({ title: "Customer updated", description: `${customer.name} is now ${nextStatus}.` });
  };

  const totalRevenue = customerList.reduce((acc, c) => acc + c.total_spent, 0);
  const totalOrders = customerList.reduce((acc, c) => acc + c.total_orders, 0);

  return (
    <div className="flex flex-1 flex-col bg-background animate-in-fade">
      <PageHeader title="Customers" breadcrumbs={[{ title: "Relationships" }, { title: "Customers" }]} />

      <main className="flex-1 p-3 space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-4 animate-in-slide-up">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Customer Directory</h2>
            <p className="text-slate-500 text-sm">Manage B2B customers, distributors, and retail partners.</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-white shadow-sm rounded-md h-10 px-5 font-semibold gap-2">
                <UserPlus className="h-4 w-4" /> Add Customer
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-white border-none rounded-md shadow-2xl p-0 overflow-hidden">
              <DialogHeader className="px-5 pt-5 pb-3 border-b border-slate-50 bg-slate-50/30">
                <DialogTitle className="text-lg font-black tracking-tight text-slate-900">Add New Customer</DialogTitle>
                <DialogDescription className="text-slate-500 font-medium text-[12px]">Register a new B2B partner or retail customer.</DialogDescription>
              </DialogHeader>
              <div className="no-scrollbar max-h-[70vh] overflow-y-auto px-5 py-3">
                <form onSubmit={handleAddCustomer} className="space-y-4">
                  <div className="grid gap-x-4 gap-y-3 md:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider">Full Name</Label>
                      <Input
                        placeholder="e.g. Amit Patel"
                        required
                        className="h-9 bg-slate-50/50 border-slate-200 rounded-md text-slate-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider">Company</Label>
                      <Input
                        placeholder="e.g. Patel Stores"
                        required
                        className="h-9 bg-slate-50/50 border-slate-200 rounded-md text-slate-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        value={form.company}
                        onChange={(e) => setForm({ ...form, company: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider">Email Address</Label>
                      <Input
                        type="email"
                        placeholder="amit@stores.com"
                        required
                        className="h-9 bg-slate-50/50 border-slate-200 rounded-md text-slate-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider">Phone Number</Label>
                      <Input
                        placeholder="+91 98765 44556"
                        required
                        className="h-9 bg-slate-50/50 border-slate-200 rounded-md text-slate-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <Label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider">Location / Address</Label>
                      <Input
                        placeholder="e.g. Pune, MH"
                        required
                        className="h-9 bg-slate-50/50 border-slate-200 rounded-md text-slate-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        value={form.location}
                        onChange={(e) => setForm({ ...form, location: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button type="submit" className="w-full h-11 bg-[#021a41] hover:bg-[#03255a] text-white font-bold rounded-md shadow-lg shadow-blue-900/10 gap-2 text-sm transition-all active:scale-[0.98]">
                      <Save className="h-4 w-4" /> Save Customer
                    </Button>
                  </div>
                </form>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid gap-3 md:grid-cols-3 animate-in-slide-up [animation-delay:50ms]">
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4 shadow-sm">
            <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center"><Users className="h-5 w-5 text-primary" /></div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Customers</p>
              <p className="text-2xl font-bold text-slate-900">{customerList.filter((c) => c.status === "Active").length}</p>
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4 shadow-sm">
            <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center"><ShoppingBag className="h-5 w-5 text-orange-500" /></div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Orders</p>
              <p className="text-2xl font-bold text-slate-900">{totalOrders}</p>
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4 shadow-sm">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center"><TrendingUp className="h-5 w-5 text-emerald-500" /></div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Lifetime Revenue</p>
              <p className="text-2xl font-bold text-slate-900">INR {totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="flex flex-wrap items-center gap-3 animate-in-slide-up [animation-delay:100ms]">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input placeholder="Search customers…" className="h-8 pl-8 bg-white border-slate-200 text-slate-900 text-[13px] rounded-md" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </div>

        {/* Table */}
        <Card className="bg-white border-slate-200 shadow-sm overflow-hidden rounded-md animate-in-slide-up [animation-delay:150ms]">
          <Table>
            <TableHeader className="bg-slate-50/80">
              <TableRow className="border-slate-100 hover:bg-transparent">
                <TableHead className="pl-6 text-slate-500 uppercase text-[10px] font-bold tracking-wider py-4">Customer / Company</TableHead>
                <TableHead className="text-slate-500 uppercase text-[10px] font-bold tracking-wider py-4">Contact</TableHead>
                <TableHead className="text-slate-500 uppercase text-[10px] font-bold tracking-wider py-4">Location</TableHead>
                <TableHead className="text-slate-500 uppercase text-[10px] font-bold tracking-wider py-4">Orders</TableHead>
                <TableHead className="text-slate-500 uppercase text-[10px] font-bold tracking-wider py-4">Revenue</TableHead>
                <TableHead className="text-slate-500 uppercase text-[10px] font-bold tracking-wider pr-6 py-4">Status</TableHead>
                <TableHead className="text-slate-500 uppercase text-[10px] font-bold tracking-wider pr-6 py-4 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id} className="group border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <TableCell className="pl-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                        {customer.name.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900">{customer.name}</span>
                        <span className="text-[11px] text-slate-500 font-medium">{customer.company}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-slate-400" /> {customer.email}</div>
                      <div className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-slate-400" /> {customer.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" /> {customer.location}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-primary">{customer.total_orders}</span>
                      <span className="text-[10px] text-slate-400 font-medium">Last: {customer.last_order}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-bold text-slate-900">INR {customer.total_spent.toLocaleString()}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={customer.status === "Active" ? "bg-emerald-50 text-emerald-700 border-emerald-100 font-bold text-[10px]" : "bg-slate-100 text-slate-600 border-slate-200 font-bold text-[10px]"}>
                      {customer.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-6 text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => toggleStatus(customer)}>
                        {customer.status === "Active" ? "Deactivate" : "Activate"}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteCustomer(customer.id)}>
                        <Trash2 className="h-4 w-4 text-rose-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </main>
    </div>
  );
}
