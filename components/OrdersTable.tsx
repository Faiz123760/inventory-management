"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileText, Eye, Trash2 } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { Order } from "@/lib/snack-mock-data";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OrdersTableProps {
  orders: Order[];
  onStatusChange: (id: string, status: Order["orderStatus"]) => void;
  onPaymentChange: (id: string, status: Order["paymentStatus"]) => void;
  onDelete: (id: string) => void;
}

export function OrdersTable({ orders, onStatusChange, onPaymentChange, onDelete }: OrdersTableProps) {
  const router = useRouter();

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50/80">
          <TableRow className="border-slate-100 hover:bg-transparent">
            <TableHead className="pl-6 w-30 text-slate-500 uppercase text-[10px] font-bold tracking-wider py-4">Order #</TableHead>
            <TableHead className="text-slate-500 uppercase text-[10px] font-bold tracking-wider py-4">Date</TableHead>
            <TableHead className="text-slate-500 uppercase text-[10px] font-bold tracking-wider py-4">Customer</TableHead>
            <TableHead className="text-slate-500 uppercase text-[10px] font-bold tracking-wider py-4">Amount</TableHead>
            <TableHead className="text-slate-500 uppercase text-[10px] font-bold tracking-wider py-4">Status</TableHead>
            <TableHead className="text-slate-500 uppercase text-[10px] font-bold tracking-wider py-4 text-center">Payment</TableHead>
            <TableHead className="text-right pr-6 text-slate-500 uppercase text-[10px] font-bold tracking-wider py-4">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-10 text-slate-400 text-sm">
                No orders found for the current filters.
              </TableCell>
            </TableRow>
          ) : null}
          {orders.map((order) => (
            <TableRow 
              key={order.id} 
              className="border-slate-100 hover:bg-slate-50/50 transition-colors group cursor-pointer"
              onClick={() => router.push(`/orders/${order.id}`)}
            >
              <TableCell className="pl-6 py-4">
                <span className="text-[11px] font-medium text-primary hover:underline">{order.orderNumber}</span>
              </TableCell>
              <TableCell className="whitespace-nowrap text-slate-500 text-xs font-medium">{order.orderDate}</TableCell>
              <TableCell className="font-semibold text-slate-900">{order.customerName}</TableCell>
              <TableCell className="font-bold text-slate-900">₹{order.totalAmount}</TableCell>
              <TableCell>
                <div className="space-y-1">
                  <Select
                    value={order.orderStatus}
                    onValueChange={(value) => onStatusChange(order.id, value as Order["orderStatus"])}
                  >
                    <SelectTrigger className="h-7 text-[11px] w-30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Confirmed">Confirmed</SelectItem>
                      <SelectItem value="Shipped">Shipped</SelectItem>
                      <SelectItem value="Delivered">Delivered</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div className="space-y-1 inline-flex flex-col items-center">
                  <Select
                    value={order.paymentStatus}
                    onValueChange={(value) => onPaymentChange(order.id, value as Order["paymentStatus"])}
                  >
                    <SelectTrigger className="h-7 text-[11px] w-28">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Paid">Paid</SelectItem>
                      <SelectItem value="Partial">Partial</SelectItem>
                      <SelectItem value="Unpaid">Unpaid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TableCell>
              <TableCell className="text-right pr-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => router.push(`/orders/${order.id}`)}>
                    <Eye className="h-4 w-4 text-slate-500" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <FileText className="h-4 w-4 text-slate-500" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(order.id)}>
                    <Trash2 className="h-4 w-4 text-rose-500" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
