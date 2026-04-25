"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Save } from "lucide-react";
import { Order, OrderItem } from "@/lib/snack-mock-data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppStore } from "@/lib/store";

interface OrderFormProps {
  onSubmit: (data: OrderFormValues) => void;
  initialData?: Partial<OrderFormValues>;
}

export interface OrderFormValues {
  customerName: string;
  customerPhone: string;
  paymentMethod: Order["paymentMethod"];
  items: OrderItem[];
  subtotal: number;
  tax: number;
  totalAmount: number;
  orderDate: string;
}

export function OrderForm({ onSubmit, initialData }: OrderFormProps) {
  const { state } = useAppStore();
  const products = state.products;

  const [customerName, setCustomerName] = useState(initialData?.customerName || "");
  const [customerPhone, setCustomerPhone] = useState(initialData?.customerPhone || "");
  const [paymentMethod, setPaymentMethod] = useState<Order["paymentMethod"]>("Cash");
  const [items, setItems] = useState<OrderItem[]>(
    initialData?.items || [
      { productId: "", productName: "", quantity: 1, unitPrice: 0, totalPrice: 0 },
    ]
  );

  const addItem = () => {
    setItems([
      ...items,
      { productId: "", productName: "", quantity: 1, unitPrice: 0, totalPrice: 0 },
    ]);
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems.length > 0 ? newItems : [{ productId: "", productName: "", quantity: 1, unitPrice: 0, totalPrice: 0 }]);
  };

  const updateItem = (index: number, field: keyof OrderItem, value: string | number) => {
    const newItems = [...items];
    const item = { ...newItems[index] };

    if (field === "productId") {
      const product = products.find((p) => p.product_id === value);
      if (product) {
        item.productId = product.product_id;
        item.productName = product.name;
        item.unitPrice = product.selling_price;
        item.totalPrice = item.quantity * product.selling_price;
      }
    } else if (field === "quantity") {
      const qty = parseInt(String(value), 10) || 0;
      item.quantity = qty;
      item.totalPrice = qty * item.unitPrice;
    }

    newItems[index] = item;
    setItems(newItems);
  };

  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const tax = subtotal * 0.18;
  const totalAmount = subtotal + tax;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validItems = items.filter((i) => i.productId && i.quantity > 0);
    if (validItems.length === 0) return;

    onSubmit({
      customerName,
      customerPhone,
      paymentMethod,
      items: validItems,
      subtotal,
      tax,
      totalAmount,
      orderDate: new Date().toISOString().split("T")[0],
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Customer Info Section - Matching the top grids in the image */}
      <div className="grid gap-x-4 gap-y-3 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider">Customer Name</Label>
          <Input
            placeholder="Enter full name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
            className="h-9 bg-slate-50/50 border-slate-200 rounded-md text-slate-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider">Phone Number</Label>
          <Input
            placeholder="+91 00000 00000"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            required
            className="h-9 bg-slate-50/50 border-slate-200 rounded-md text-slate-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <Label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider">Payment Method</Label>
          <Select value={paymentMethod} onValueChange={(val) => setPaymentMethod(val as Order["paymentMethod"])}>
            <SelectTrigger className="h-9 w-full bg-slate-50/50 border-slate-200 text-slate-900 rounded-md focus:ring-2 focus:ring-blue-500/20 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200 rounded-md shadow-2xl">
              <SelectItem value="Cash">Cash Payment</SelectItem>
              <SelectItem value="UPI">UPI / Digital Payment</SelectItem>
              <SelectItem value="Card">Credit/Debit Card</SelectItem>
              <SelectItem value="Bank Transfer">Direct Bank Transfer</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Order Items Section - Matching the 'Raw Material Recipe' style */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-semibold text-slate-700">Order Items</h3>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            className="bg-slate-50/50 border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold gap-2 rounded-md h-10 px-4 transition-all" 
            onClick={addItem}
          >
            <Plus className="h-4 w-4" /> Add Row
          </Button>
        </div>

        <div className="bg-white border border-slate-100 rounded-md p-4 space-y-4 shadow-sm">
          {items.map((item, index) => (
            <div key={index} className="space-y-4">
              <div className="flex gap-4 items-center">
                <div className="flex-1">
                  <Select
                    value={item.productId}
                    onValueChange={(val) => updateItem(index, "productId", val)}
                  >
                    <SelectTrigger className="h-9 w-full bg-white border-slate-200 text-slate-900 rounded-md focus:ring-2 focus:ring-blue-500/20 text-sm">
                      <SelectValue placeholder="Choose product from inventory" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-200 rounded-md shadow-2xl">
                      {products.map((product) => (
                        <SelectItem key={product.product_id} value={product.product_id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-24">
                  <Input
                    type="number"
                    min="1"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, "quantity", e.target.value)}
                    className="h-9 bg-white border-slate-200 text-slate-900 rounded-md text-center text-sm focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(index)}
                  className="h-9 w-9 text-slate-300 hover:text-rose-500 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              {index === items.length - 1 && (
                <p className="text-[12px] text-slate-400 font-medium ml-1">
                  Define products and required quantity per order unit.
                </p>
              )}
              {index < items.length - 1 && <div className="border-b border-slate-50 mx-2" />}
            </div>
          ))}
        </div>
      </div>

      {/* Summary and Submit - Matching the 'Save Product' bar */}
      <div className="pt-2 space-y-4">
        <div className="flex justify-between items-end px-4">
          <div className="space-y-0.5">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Payable</p>
            <p className="text-3xl font-black text-slate-900 tracking-tighter">INR {totalAmount.toLocaleString()}</p>
          </div>
          <div className="text-right space-y-0.5 opacity-60">
            <p className="text-[11px] font-medium text-slate-500">Includes GST (18%): INR {tax.toLocaleString()}</p>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-11 bg-[#021a41] hover:bg-[#03255a] text-white font-bold rounded-md shadow-lg shadow-blue-900/10 gap-2 text-sm transition-all active:scale-[0.98]"
        >
          <Save className="h-4 w-4" /> Save Order
        </Button>
      </div>
    </form>
  );
}
