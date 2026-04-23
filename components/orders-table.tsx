"use client"

import { useMemo, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Search,
  ShoppingBag
} from 'lucide-react'
import { mockOrders } from '@/lib/mock-data'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

export function OrdersTable() {
  const [searchTerm, setSearchTerm] = useState('')

  const allOrders = useMemo(() => {
    return mockOrders
  }, [])

  const filteredOrders = useMemo(() => {
    return allOrders.filter((order) => {
      const email = order.user?.email || ''
      const address = `${order.shippingAddress?.addressLine1} ${order.shippingAddress?.city}`
      const name = order.shippingAddress?.name || ''
      return [order._id, email, address, name, order.status]
        .join(' ')
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    })
  }, [allOrders, searchTerm])

  const checkoutOrders = filteredOrders.filter(o => o.status === 'checkout')
  const pendingOrders = filteredOrders.filter(o => o.status === 'pending')

  const renderTable = (items: Order[], emptyMessage: string) => (
    <div className="rounded-md border bg-card overflow-hidden">
      <ScrollArea className="w-full">
        <div className="min-w-300">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow className="hover:bg-transparent border-b">
                <TableHead className="py-3 font-semibold text-xs text-muted-foreground uppercase pl-6">Customer</TableHead>
                <TableHead className="font-semibold text-xs text-muted-foreground uppercase">Email</TableHead>
                <TableHead className="font-semibold text-xs text-muted-foreground uppercase">Phone</TableHead>
                <TableHead className="font-semibold text-xs text-muted-foreground uppercase">Address</TableHead>
                <TableHead className="font-semibold text-xs text-muted-foreground uppercase">City</TableHead>
                <TableHead className="font-semibold text-xs text-muted-foreground uppercase">State</TableHead>
                <TableHead className="font-semibold text-xs text-muted-foreground uppercase">Pincode</TableHead>
                <TableHead className="font-semibold text-xs text-muted-foreground uppercase text-center">Items</TableHead>
                <TableHead className="font-semibold text-xs text-muted-foreground uppercase">Total</TableHead>
                <TableHead className="font-semibold text-xs text-muted-foreground uppercase">Status</TableHead>
                <TableHead className="text-right pr-6 font-semibold text-xs text-muted-foreground uppercase">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="h-32 text-center text-muted-foreground text-sm italic">
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              ) : (
                items.map((order) => (
                  <TableRow key={order._id} className="hover:bg-muted/30 transition-colors border-b">
                    <TableCell className="text-sm font-medium whitespace-nowrap pl-6">
                      {order.shippingAddress?.name || '-'}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {order.user?.email || '-'}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {order.shippingAddress?.phone || '-'}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-50 truncate">
                      {order.shippingAddress?.addressLine1}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap uppercase">
                      {order.shippingAddress?.city}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap uppercase">
                      {order.shippingAddress?.state}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {order.shippingAddress?.pincode}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className="font-mono text-[10px]">
                        {order.items?.length || 0}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-bold text-sm whitespace-nowrap">
                      Rs. {order.totals?.totalAmount?.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          order.status === 'checkout' ? 'secondary' :
                          order.status === 'pending' ? 'default' :
                          order.status === 'delivered' ? 'outline' : 'destructive'
                        }
                        className="capitalize text-[10px] h-5 rounded-full px-2"
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-6 whitespace-nowrap text-xs text-muted-foreground">Read only</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-xl font-bold tracking-tight">Order Management</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 w-60 bg-muted/20"
          />
        </div>
      </div>

      <Tabs defaultValue="approval" className="w-full">
        <TabsList className="grid w-full max-w-60 grid-cols-2 bg-muted/40 p-1 rounded-lg">
          <TabsTrigger value="approval" className="rounded-md font-bold text-xs py-1.5 transition-all">
            Checkout
            {checkoutOrders.length > 0 && (
              <Badge className="ml-2 h-4 min-w-4 px-1 flex items-center justify-center bg-primary text-[9px] font-bold">
                {checkoutOrders.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="pending" className="rounded-md font-bold text-xs py-1.5 transition-all">
            Delivery
            {pendingOrders.length > 0 && (
              <Badge className="ml-2 h-4 min-w-4 px-1 flex items-center justify-center bg-blue-600 text-[9px] font-bold">
                {pendingOrders.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="approval" className="mt-6">
          {renderTable(checkoutOrders, "No checkout orders.")}
        </TabsContent>
        <TabsContent value="pending" className="mt-6">
          {renderTable(pendingOrders, "No pending deliveries.")}
        </TabsContent>
      </Tabs>
    </div>
  )
}
