"use client";

import { PageHeader } from "@/components/page-header";
import { OrderForm, type OrderFormValues } from "@/components/OrderForm";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/components/ui/use-toast";
import { Order } from "@/lib/snack-mock-data";

export default function CreateOrderPage() {
  const router = useRouter();
  const { addOrder, state } = useAppStore();
  const { toast } = useToast();

  const handleCreateOrder = (data: OrderFormValues) => {
    const newOrder: Order = {
      id: String(Date.now()),
      orderNumber: `ORD${String(state.orders.length + 100 + 1)}`,
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
    toast({ title: "Order created", description: `${newOrder.orderNumber} has been added.` });
    router.push("/orders");
  };

  return (
    <div className="flex flex-1 flex-col bg-background animate-in-fade">
      <PageHeader
        title="Create New Order"
        breadcrumbs={[
          { title: "Finance" },
          { title: "Orders", href: "/orders" },
          { title: "Create" },
        ]}
      />

      <main className="flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full">
        <Card className="bg-white border-slate-200 shadow-sm animate-in-slide-up">
          <CardContent className="p-6">
            <OrderForm onSubmit={handleCreateOrder} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
