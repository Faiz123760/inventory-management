"use client";

import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  ArrowLeft, 
  Printer, 
  Download, 
  Phone, 
  User, 
  Calendar,
  CreditCard,
  Truck,
  Package
} from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { useAppStore } from "@/lib/store";

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { state } = useAppStore();

  const order = state.orders.find((o) => o.id === id);

  if (!order) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8">
        <h2 className="text-2xl font-bold text-slate-900">Order not found</h2>
        <Button variant="link" onClick={() => router.push("/orders")}>
          Back to Orders
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col bg-background animate-in-fade">
      <PageHeader
        title={`Order ${order.orderNumber}`}
        breadcrumbs={[
          { title: "Finance" },
          { title: "Orders", href: "/orders" },
          { title: order.orderNumber },
        ]}
      />

      <main className="flex-1 space-y-6 p-4 md:p-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-wrap items-center justify-between gap-4 animate-in-slide-up">
          <Button variant="ghost" size="sm" onClick={() => router.push("/orders")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
          </Button>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              <Printer className="mr-2 h-4 w-4 text-primary" /> Print Invoice
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              <Download className="mr-2 h-4 w-4 text-primary" /> Download PDF
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3 animate-in-slide-up [animation-delay:100ms]">
          <Card className="bg-white border-slate-200 shadow-sm col-span-2">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" /> Order Items
                </CardTitle>
                <StatusBadge status={order.orderStatus} />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow>
                    <TableHead className="pl-6">Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead className="text-right pr-6">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item, index) => (
                    <TableRow key={index} className="border-slate-100">
                      <TableCell className="pl-6 font-medium text-slate-900">{item.productName}</TableCell>
                      <TableCell className="text-slate-600">{item.quantity}</TableCell>
                      <TableCell className="text-slate-600">₹{item.unitPrice}</TableCell>
                      <TableCell className="text-right pr-6 font-bold text-slate-900">₹{item.totalPrice}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="p-6 border-t border-slate-100 bg-slate-50/30 flex flex-col items-end space-y-2">
                <div className="flex justify-between w-full max-w-62 text-sm">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-medium">₹{order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between w-full max-w-62 text-sm">
                  <span className="text-slate-500">Tax (GST 18%)</span>
                  <span className="font-medium">₹{order.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between w-full max-w-62 text-sm text-rose-500">
                  <span>Discount</span>
                  <span>-₹{order.discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between w-full max-w-62 text-lg font-bold border-t pt-2 mt-2">
                  <span>Grand Total</span>
                  <span className="text-primary">₹{order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" /> Customer Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {order.customerName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{order.customerName}</p>
                    <div className="flex items-center gap-1 text-slate-500 text-xs mt-0.5">
                      <Phone className="h-3 w-3" /> {order.customerPhone}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" /> Order Info
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Order Date</p>
                    <p className="text-sm font-medium text-slate-900">{order.orderDate}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Payment Method</p>
                    <div className="flex items-center gap-1.5">
                      <CreditCard className="h-3 w-3 text-slate-400" />
                      <p className="text-sm font-medium text-slate-900">{order.paymentMethod}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Payment Status</p>
                    <StatusBadge status={order.paymentStatus} className="mt-1" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Delivery Status</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Truck className="h-3 w-3 text-emerald-500" />
                      <span className="text-[10px] font-bold text-emerald-700 uppercase">{order.deliveryStatus}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
