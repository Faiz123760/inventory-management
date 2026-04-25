"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search, FileText, Download, Printer, MoreVertical,
  ExternalLink, CheckCircle2, Clock, AlertCircle, Filter
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { useState } from "react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export default function InvoicesPage() {
  const { state } = useAppStore();
  const [search, setSearch] = useState("");

  const filteredInvoices = state.orders.filter(order =>
    order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
    order.customerName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-1 flex-col bg-background animate-in-fade">
      <PageHeader title="Invoices" breadcrumbs={[{ title: "Home" }, { title: "Invoices" }]} />

      <main className="flex-1 p-3 space-y-3">
        <div className="page-section-header animate-in-slide-up">
          <div>
            <h1 className="page-title">Billing & Invoices</h1>
            <p className="page-subtitle">Manage and track all customer billing records and payment statuses.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2 h-10 font-bold border-slate-200">
              <Download className="h-4 w-4" /> EXPORT ALL
            </Button>
            <Button className="gap-2 h-10 font-bold shadow-lg shadow-primary/20">
              <FileText className="h-4 w-4" /> NEW INVOICE
            </Button>
          </div>
        </div>

        {/* KPI Row for Invoices */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <Card className="surface p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Invoiced</p>
              <p className="text-2xl font-black text-slate-900">INR {state.orders.reduce((s, o) => s + o.totalAmount, 0).toLocaleString()}</p>
            </div>
          </Card>
          <Card className="surface p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Paid Amount</p>
              <p className="text-2xl font-black text-slate-900">
                INR {state.orders.filter(o => o.paymentStatus === 'Paid').reduce((s, o) => s + o.totalAmount, 0).toLocaleString()}
              </p>
            </div>
          </Card>
          <Card className="surface p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Outstanding</p>
              <p className="text-2xl font-black text-slate-900">
                INR {state.orders.filter(o => o.paymentStatus !== 'Paid').reduce((s, o) => s + o.totalAmount, 0).toLocaleString()}
              </p>
            </div>
          </Card>
        </div>

        <Card className="surface overflow-hidden border-none shadow-xl shadow-slate-200/50">
          <CardHeader className="px-6 py-5 border-b border-slate-50 space-y-4 bg-slate-50/30">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <CardTitle className="text-base font-bold text-slate-900">Recent Invoices</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search invoice or customer..."
                    className="pl-9 w-full md:w-64 h-10 bg-white border-slate-200 rounded-md focus:ring-2 focus:ring-blue-500/20 transition-all"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon" className="h-10 w-10 border-slate-200 bg-white hover:bg-slate-50 transition-colors">
                  <Filter className="h-4 w-4 text-slate-500" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-100 hover:bg-transparent">
                  <TableHead className="th pl-6 py-4">Invoice ID</TableHead>
                  <TableHead className="th">Customer</TableHead>
                  <TableHead className="th">Date</TableHead>
                  <TableHead className="th">Amount</TableHead>
                  <TableHead className="th">Status</TableHead>
                  <TableHead className="th pr-6 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-20">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                          <FileText className="h-6 w-6" />
                        </div>
                        <p className="text-slate-400 font-medium">No invoices found matching your search.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id} className="tr-hover group">
                      <TableCell className="pl-6 td py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{invoice.orderNumber}</span>
                          <span className="text-[11px] text-slate-400 font-medium tracking-tight">INV-{invoice.id.padStart(4, '0')}</span>
                        </div>
                      </TableCell>
                      <TableCell className="td py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-700">{invoice.customerName}</span>
                          <span className="text-[11px] text-slate-400 font-medium">{invoice.customerPhone}</span>
                        </div>
                      </TableCell>
                      <TableCell className="td py-4 text-slate-500 font-medium">
                        {invoice.orderDate}
                      </TableCell>
                      <TableCell className="td py-4">
                        <span className="font-black text-slate-900">INR {invoice.totalAmount.toLocaleString()}</span>
                      </TableCell>
                      <TableCell className="td py-4">
                        {invoice.paymentStatus === 'Paid' ? (
                          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 w-fit text-[11px] font-black uppercase tracking-wider shadow-sm">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Paid
                          </div>
                        ) : invoice.paymentStatus === 'Pending' ? (
                          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-100 w-fit text-[11px] font-black uppercase tracking-wider shadow-sm">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                            Pending
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-600 border border-rose-100 w-fit text-[11px] font-black uppercase tracking-wider shadow-sm">
                            <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                            Unpaid
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="pr-6 td py-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-2 group-hover:translate-x-0">
                          <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all">
                            <Printer className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all">
                            <Download className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:bg-slate-100 rounded-md transition-all">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 p-1.5 border-slate-100 shadow-2xl rounded-lg">
                              <DropdownMenuItem className="gap-2.5 py-2 cursor-pointer focus:bg-blue-50 focus:text-blue-600 rounded-md">
                                <ExternalLink className="h-4 w-4 opacity-70" />
                                <span className="font-semibold text-xs">View Details</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2.5 py-2 cursor-pointer focus:bg-blue-50 focus:text-blue-600 rounded-md">
                                <FileText className="h-4 w-4 opacity-70" />
                                <span className="font-semibold text-xs">Send Email</span>
                              </DropdownMenuItem>
                              <div className="h-px bg-slate-50 my-1" />
                              <DropdownMenuItem className="gap-2.5 py-2 cursor-pointer text-rose-500 focus:bg-rose-50 focus:text-rose-600 rounded-md">
                                <AlertCircle className="h-4 w-4 opacity-70" />
                                <span className="font-semibold text-xs">Cancel Invoice</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="px-6 py-4 border-t border-slate-50 bg-slate-50/30 flex items-center justify-between">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Showing {filteredInvoices.length} Invoices</p>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" className="h-8 text-[11px] font-bold px-3 border-slate-200 bg-white">Previous</Button>
              <Button variant="outline" size="sm" className="h-8 text-[11px] font-bold px-3 border-slate-200 bg-white">Next</Button>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
