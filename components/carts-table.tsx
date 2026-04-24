"use client";

import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, ShoppingCart, Trash2, CheckCircle2 } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";

export function CartsTable() {
  const { state, updateOrderStatus, deleteOrder } = useAppStore();
  const [searchTerm, setSearchTerm] = useState("");

  const carts = useMemo(
    () =>
      state.orders
        .filter((order) => order.orderStatus === "Pending" || order.orderStatus === "Confirmed")
        .map((order) => ({
          id: order.id,
          orderNumber: order.orderNumber,
          customer: order.customerName,
          productSummary: order.items.map((item) => item.productName).join(", "),
          quantity: order.items.reduce((sum, item) => sum + item.quantity, 0),
          createdAt: order.createdAt,
        })),
    [state.orders]
  );

  const filteredCarts = useMemo(
    () =>
      carts.filter((cart) =>
        [cart.orderNumber, cart.customer, cart.productSummary]
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      ),
    [carts, searchTerm]
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 rounded-2xl border bg-muted/20 p-3">
        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search carts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Added At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCarts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  {searchTerm ? "No carts found matching your search." : "No carts available."}
                </TableCell>
              </TableRow>
            ) : (
              filteredCarts.map((cart) => (
                <TableRow key={cart.id}>
                  <TableCell className="font-medium">{cart.orderNumber}</TableCell>
                  <TableCell>{cart.customer}</TableCell>
                  <TableCell className="max-w-70 truncate">{cart.productSummary}</TableCell>
                  <TableCell>{cart.quantity}</TableCell>
                  <TableCell>{new Date(cart.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateOrderStatus(cart.id, "Confirmed")}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-1" /> Checkout
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteOrder(cart.id)}>
                      <Trash2 className="h-4 w-4 text-rose-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
