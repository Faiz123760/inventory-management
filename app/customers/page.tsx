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
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  Filter,
  UserPlus,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  MoreVertical,
  TrendingUp,
  ShoppingBag,
  CreditCard
} from "lucide-react";
import { customers, Customer } from "@/lib/snack-mock-data";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CustomersPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCustomers = customers.filter((customer: Customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAction = (name: string, action: string) => {
    toast({
      title: `${action} Initialized`,
      description: `Action ${action} triggered for ${name}.`,
    });
  };

  return (
    <div className="flex flex-1 flex-col bg-background animate-in-fade">
      <PageHeader
        title="Customers"
        breadcrumbs={[{ title: "Orders" }, { title: "Customers" }]}
      />

      <main className="flex-1 space-y-6 p-4 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 animate-in-slide-up">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-500">Customer Directory</h2>
            <p className="text-slate-500 font-medium">Manage your B2B customers, distributors, and retail partners.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button className="bg-primary hover:bg-primary/90 text-white shadow-sm rounded-lg h-10 px-4 font-semibold">
              <UserPlus className="mr-2 h-4 w-4" /> New Customer
            </Button>
          </div>
        </div>

        {/* Customer Stats Overview */}
        <div className="grid gap-6 md:grid-cols-3 animate-in-slide-up [animation-delay:100ms]">
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold text-slate-500 flex items-center justify-between uppercase tracking-wider">
                Active Customers
                <UserPlus className="h-4 w-4 text-primary" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {customers.filter(c => c.status === 'Active').length}
              </div>
              <p className="text-xs text-emerald-600 font-semibold mt-1">+2 new this week</p>
            </CardContent>
          </Card>
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold text-slate-500 flex items-center justify-between uppercase tracking-wider">
                Total Orders
                <ShoppingBag className="h-4 w-4 text-orange-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {customers.reduce((acc, curr) => acc + curr.total_orders, 0)}
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1">Across all partners</p>
            </CardContent>
          </Card>
          <Card className="bg-primary border-primary text-white ">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold opacity-80 flex items-center justify-between uppercase tracking-wider">
                Lifetime Revenue
                <TrendingUp className="h-4 w-4" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹ {customers.reduce((acc, curr) => acc + curr.total_spent, 0).toLocaleString()}
              </div>
              <p className="text-xs opacity-70 font-medium mt-1">Verified order value</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4 animate-in-slide-up [animation-delay:200ms]">
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search customers..."
                className="pl-8 bg-slate-50 border-slate-200 text-slate-900 h-9 rounded-lg focus-visible:ring-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="bg-white border-slate-200 text-slate-700 h-9 font-semibold">
                <Filter className="mr-2 h-4 w-4 text-primary" /> Filter
              </Button>
            </div>
          </div>

          <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50/80">
                <TableRow className="border-slate-100 hover:bg-transparent">
                  <TableHead className="pl-6 text-slate-500 uppercase text-[10px] font-bold tracking-wider py-4">Customer / Company</TableHead>
                  <TableHead className="text-slate-500 uppercase text-[10px] font-bold tracking-wider py-4">Contact Details</TableHead>
                  <TableHead className="text-slate-500 uppercase text-[10px] font-bold tracking-wider py-4">Location</TableHead>
                  <TableHead className="text-slate-500 uppercase text-[10px] font-bold tracking-wider py-4">Orders</TableHead>
                  <TableHead className="text-slate-500 uppercase text-[10px] font-bold tracking-wider py-4">Revenue</TableHead>
                  <TableHead className="text-slate-500 uppercase text-[10px] font-bold tracking-wider pr-6 py-4">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer: Customer) => (
                  <TableRow key={customer.id} className="group border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <TableCell className="pl-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900">{customer.name}</span>
                        <span className="text-[11px] text-slate-500 font-bold uppercase tracking-tight">{customer.company}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1 text-xs text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5 text-slate-400" /> {customer.email}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5 text-slate-400" /> {customer.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" /> {customer.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-primary">{customer.total_orders} Orders</span>
                        <span className="text-[10px] text-slate-400 font-medium">LAST: {customer.last_order}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-bold text-slate-900">₹{customer.total_spent.toLocaleString()}</div>
                    </TableCell>
                    <TableCell className="pr-6">
                      <Badge
                        variant="outline"
                        className={
                          customer.status === "Active" ? "bg-emerald-50 text-emerald-700 border-emerald-100 font-bold text-[10px]" : "bg-slate-100 text-slate-600 border-slate-200 font-bold text-[10px]"
                        }
                      >
                        {customer.status}
                      </Badge>
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
