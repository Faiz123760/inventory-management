"use client";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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
  TrendingUp,
  Search,
  Calendar,
  Filter,
  Download,
  IndianRupee,
  FileText
} from "lucide-react";
import { ordersHistory } from "@/lib/snack-mock-data";

export default function OrdersPage() {
  return (
    <div className="flex flex-1 flex-col bg-background animate-in-fade">
      <PageHeader
        title="Orders Records"
        breadcrumbs={[{ title: "Finance" }, { title: "Orders" }]}
      />

      <main className="flex-1 space-y-6 p-4 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 animate-in-slide-up">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-500">Order Analytics</h2>
            <p className="text-slate-500 font-medium">Review your daily orders, revenue distribution, and payment methods.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4 text-primary" /> Export Report
            </Button>
            <Button>
              <TrendingUp className="mr-2 h-4 w-4" /> Order Forecast
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4 animate-in-slide-up [animation-delay:100ms]">
          <Card className="bg-white border-slate-200 shadow-sm hover:border-primary/30 transition-all group">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Daily Revenue</p>
                <div className="flex items-center gap-1 mt-1">
                  <IndianRupee className="h-4 w-4 text-emerald-500" />
                  <span className="text-2xl font-bold text-slate-900">84,200</span>
                </div>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white border-slate-200 shadow-sm overflow-hidden animate-in-slide-up [animation-delay:200ms]">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 bg-slate-50/50 p-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search orders..."
                className="pl-8 bg-white border-slate-200 text-slate-900 h-9 rounded-lg focus-visible:ring-primary"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Calendar className="mr-2 h-4 w-4 text-primary" /> Date Range
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4 text-primary" /> Payment
              </Button>
            </div>
          </div>

          <Table>
            <TableHeader className="bg-slate-50/80">
              <TableRow className="border-slate-100 hover:bg-transparent">
                <TableHead className="pl-6 w-[120px] text-slate-500 uppercase text-[10px] font-bold tracking-wider py-4">Reference</TableHead>
                <TableHead className="text-slate-500 uppercase text-[10px] font-bold tracking-wider py-4">Date</TableHead>
                <TableHead className="text-slate-500 uppercase text-[10px] font-bold tracking-wider py-4">Product Sold</TableHead>
                <TableHead className="text-slate-500 uppercase text-[10px] font-bold tracking-wider py-4">Qty</TableHead>
                <TableHead className="text-slate-500 uppercase text-[10px] font-bold tracking-wider py-4">Revenue</TableHead>
                <TableHead className="text-slate-500 uppercase text-[10px] font-bold tracking-wider py-4">Payment</TableHead>
                <TableHead className="text-slate-500 uppercase text-[10px] font-bold tracking-wider py-4">Status</TableHead>
                <TableHead className="text-right pr-6 text-slate-500 uppercase text-[10px] font-bold tracking-wider py-4">Invoice</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ordersHistory.map((sale) => (
                <TableRow key={sale.id} className="border-slate-100 hover:bg-slate-50/50 transition-colors group">
                  <TableCell className="pl-6 py-4">
                    <span className="text-[11px] font-medium text-primary hover:underline cursor-pointer">{sale.id}</span>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-slate-500 text-xs font-medium">{sale.date}</TableCell>
                  <TableCell className="font-semibold text-slate-900">{sale.product}</TableCell>
                  <TableCell className="text-slate-600 font-medium">{sale.quantity}</TableCell>
                  <TableCell className="font-bold text-slate-900">{sale.revenue}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 text-[10px] font-bold">
                      {sale.payment}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide">{sale.status}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <Button variant="ghost" size="icon">
                      <FileText className="h-4 w-4" />
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
