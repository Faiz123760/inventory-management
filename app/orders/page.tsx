"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Plus,
  Search,
  Download,
  IndianRupee,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Factory,
} from "lucide-react";
import { Order } from "@/lib/snack-mock-data";
import { OrdersTable } from "@/components/OrdersTable";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { OrderForm, type OrderFormValues } from "@/components/OrderForm";
import { useToast } from "@/components/ui/use-toast";
import { useAppStore } from "@/lib/store";

export default function OrdersPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { state, addOrder, updateOrderStatus, deleteOrder } = useAppStore();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const orders = state.orders;

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || order.orderStatus.toLowerCase() === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const paidOrders = orders.filter((o) => o.paymentStatus === "Paid").length;
  const pendingOrders = orders.filter((o) => o.orderStatus === "Pending").length;

  const handleCreateOrder = (data: OrderFormValues) => {
    const newOrder: Order = {
      id: String(Date.now()),
      orderNumber: `ORD${String(orders.length + 100 + 1)}`,
      orderDate: data.orderDate,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      items: data.items,
      subtotal: data.subtotal,
      tax: data.tax,
      discount: 0,
      totalAmount: data.totalAmount,
      paymentStatus: "Pending",
      paymentMethod: data.paymentMethod || "Cash",
      orderStatus: "Pending",
      deliveryStatus: "Pending",
      createdAt: data.orderDate,
    };
    addOrder(newOrder);
    setIsDialogOpen(false);
    toast({ title: "Order created", description: `${newOrder.orderNumber} for ${newOrder.customerName} has been placed.` });
  };

  const handleExport = () => {
    const headers = ["Order #", "Date", "Customer", "Amount", "Order Status", "Payment Status"];
    const rows = orders.map((o) => [o.orderNumber, o.orderDate, o.customerName, String(o.totalAmount), o.orderStatus, o.paymentStatus]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({ title: "Export complete", description: "Orders CSV downloaded." });
  };

  const handleDeleteOrder = (id: string) => {
    const target = orders.find((o) => o.id === id);
    deleteOrder(id);
    toast({ title: "Order deleted", description: target ? `${target.orderNumber} removed.` : "Order removed." });
  };

  return (
    <div className="flex flex-1 flex-col bg-background animate-in-fade">
      <PageHeader
        title="Orders Records"
        breadcrumbs={[{ title: "Finance" }, { title: "Orders" }]}
      />

      <main className="flex-1 space-y-6 p-4 md:p-8">
        <div className="page-section-header animate-in-slide-up">
          <div>
            <h1 className="page-title">Order Management</h1>
            <p className="page-subtitle">Track orders, revenue, and delivery status.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="bg-white border-slate-200 text-slate-600 h-10 font-semibold rounded-lg hover:bg-slate-50"
              onClick={() => router.push("/production")}
            >
              <Factory className="mr-2 h-4 w-4 text-primary" /> Production
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="bg-white border-slate-200 text-slate-600 h-10 font-semibold rounded-lg hover:bg-slate-50"
              onClick={handleExport}
            >
              <Download className="mr-2 h-4 w-4 text-primary" /> Export
            </Button>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 text-white shadow-sm rounded-md h-10 px-5 font-semibold gap-2">
                  <Plus className="h-4 w-4" /> New Order
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-5xl bg-white border-none rounded-md shadow-2xl p-0 overflow-hidden">
                <DialogHeader className="px-5 pt-5 pb-3 border-b border-slate-50 bg-slate-50/30">
                  <div className="flex flex-col gap-0.5">
                    <DialogTitle className="text-lg font-black tracking-tight text-slate-900">Create New Order</DialogTitle>
                    <DialogDescription className="text-slate-500 font-medium text-[12px]">
                      Complete the details below to generate a new sales record.
                    </DialogDescription>
                  </div>
                </DialogHeader>
                
                <div className="no-scrollbar max-h-[70vh] overflow-y-auto px-5 py-3">
                  <OrderForm onSubmit={handleCreateOrder} />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in-slide-up [animation-delay:50ms]">
          <div className="stat-card"><div className="stat-icon bg-blue-50"><ShoppingBag className="h-5 w-5 text-primary" /></div><div><p className="stat-label">Total Orders</p><p className="stat-value">{orders.length}</p></div></div>
          <div className="stat-card"><div className="stat-icon bg-emerald-50"><IndianRupee className="h-5 w-5 text-emerald-600" /></div><div><p className="stat-label">Revenue</p><p className="stat-value text-xl">₹{totalRevenue.toLocaleString()}</p></div></div>
          <div className="stat-card"><div className="stat-icon bg-green-50"><CheckCircle2 className="h-5 w-5 text-green-600" /></div><div><p className="stat-label">Paid</p><p className="stat-value">{paidOrders}</p></div></div>
          <div className="stat-card"><div className="stat-icon bg-amber-50"><Clock className="h-5 w-5 text-amber-500" /></div><div><p className="stat-label">Pending</p><p className="stat-value">{pendingOrders}</p></div></div>
        </div>

        <Card className="bg-white border-slate-200 shadow-sm overflow-hidden rounded-md animate-in-slide-up [animation-delay:100ms]">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 bg-slate-50/50 p-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by order # or customer..."
                className="pl-8 bg-white border-slate-200 text-slate-900 h-9 rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              {["all", "pending", "confirmed", "shipped", "delivered", "cancelled"].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all capitalize ${statusFilter === s
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                    }`}
                >
                  {s === "all" ? "All" : s}
                </button>
              ))}
            </div>
          </div>

          <OrdersTable
            orders={filteredOrders}
            onStatusChange={(id, status) => {
              const current = orders.find((o) => o.id === id);
              updateOrderStatus(id, status, current?.paymentStatus);
            }}
            onPaymentChange={(id, paymentStatus) => {
              const current = orders.find((o) => o.id === id);
              updateOrderStatus(id, current?.orderStatus ?? "Pending", paymentStatus);
            }}
            onDelete={handleDeleteOrder}
          />
        </Card>
      </main>
    </div>
  );
}
