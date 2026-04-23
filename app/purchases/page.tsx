"use client";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Plus,
  Search,
  ShoppingCart,
  ExternalLink,
  ChevronRight,
  Clock,
  CheckCircle2,
  Truck
} from "lucide-react";

const purchaseHistory = [
  { id: "PO-4421", date: "2026-04-22", supplier: "Global Grains Ltd", total: "₹ 45,000", status: "Delivered", method: "Net Banking" },
  { id: "PO-4420", date: "2026-04-21", supplier: "Pure Oil Co", total: "₹ 18,200", status: "In Transit", method: "Credit Card" },
  { id: "PO-4419", date: "2026-04-20", supplier: "Spice Masters", total: "₹ 12,500", status: "Processing", method: "Cash" },
  { id: "PO-4418", date: "2026-04-18", supplier: "Agro Foods", total: "₹ 32,000", status: "Delivered", method: "Net Banking" },
];

export default function PurchasesPage() {
  return (
    <div className="flex flex-1 flex-col bg-background animate-in-fade">
      <PageHeader
        title="Purchase Orders"
        breadcrumbs={[{ title: "Finance" }, { title: "Purchases" }]}
      />

      <main className="flex-1 space-y-6 p-4 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 animate-in-slide-up">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-500">Purchasing & Procurement</h2>
            <p className="text-slate-500 font-medium">Track your acquisitions and pending supply orders.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> New Order
            </Button>
          </div>
        </div>

        <Card className="bg-white border-slate-200 shadow-sm overflow-hidden animate-in-slide-up [animation-delay:100ms]">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 bg-slate-50/50 p-4">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-blue-50 text-primary border-blue-100 px-3 py-1 font-bold text-[11px] cursor-pointer">All Orders</Badge>
              <Badge variant="outline" className="px-3 py-1 bg-white border-slate-200 text-slate-500 font-bold text-[11px] cursor-pointer hover:bg-slate-50">Pending</Badge>
              <Badge variant="outline" className="px-3 py-1 bg-white border-slate-200 text-slate-500 font-bold text-[11px] cursor-pointer hover:bg-slate-50">Completed</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Table>
            <TableHeader className="bg-slate-50/80">
              <TableRow className="border-slate-100 hover:bg-transparent">
                <TableHead className="pl-6 w-[150px] text-slate-500 uppercase text-[10px] font-bold tracking-wider py-4">Order ID</TableHead>
                <TableHead className="text-slate-500 uppercase text-[10px] font-bold tracking-wider py-4">Date</TableHead>
                <TableHead className="text-slate-500 uppercase text-[10px] font-bold tracking-wider py-4">Supplier</TableHead>
                <TableHead className="text-slate-500 uppercase text-[10px] font-bold tracking-wider py-4">Amount</TableHead>
                <TableHead className="text-slate-500 uppercase text-[10px] font-bold tracking-wider py-4">Method</TableHead>
                <TableHead className="text-slate-500 uppercase text-[10px] font-bold tracking-wider py-4">Status</TableHead>
                <TableHead className="text-right pr-6 text-slate-500 uppercase text-[10px] font-bold tracking-wider py-4">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchaseHistory.map((order) => (
                <TableRow key={order.id} className="border-slate-100 hover:bg-slate-50/50 transition-colors group">
                  <TableCell className="pl-6 py-4">
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="h-3.5 w-3.5 text-slate-400" />
                      <span className="font-semibold text-primary hover:underline cursor-pointer">{order.id}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-500 text-xs font-medium">{order.date}</TableCell>
                  <TableCell className="font-semibold text-slate-900">{order.supplier}</TableCell>
                  <TableCell className="font-bold text-slate-900">{order.total}</TableCell>
                  <TableCell className="text-[11px] text-slate-500 font-medium">{order.method}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {order.status === "Delivered" ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      ) : order.status === "In Transit" ? (
                        <Truck className="h-4 w-4 text-primary" />
                      ) : (
                        <Clock className="h-4 w-4 text-amber-500" />
                      )}
                      <span className={`text-[11px] font-bold uppercase tracking-wide ${order.status === 'Delivered' ? 'text-emerald-600' : order.status === 'In Transit' ? 'text-primary' : 'text-amber-600'}`}>{order.status}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <Button variant="ghost" size="icon">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
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
