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
import { Input } from '@/components/ui/input'
import { Search, ShoppingCart } from 'lucide-react'
import { mockCarts } from '@/lib/mock-data'

export function CartsTable() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredCarts = useMemo(
    () =>
      mockCarts.filter((cart) =>
        [cart.user, typeof cart.sweet === 'string' ? cart.sweet : cart.sweet?.name]
          .join(' ')
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      ),
    [searchTerm]
  )

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
              <TableHead>User ID</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Added At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCarts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  {searchTerm ? 'No carts found matching your search.' : 'No carts available.'}
                </TableCell>
              </TableRow>
            ) : (
              filteredCarts.map((cart) => (
                <TableRow key={cart._id}>
                  <TableCell className="font-medium text-xs font-mono">{cart.user}</TableCell>
                  <TableCell>
                    {typeof cart.sweet === 'string' ? cart.sweet : cart.sweet?.name || 'Unknown'}
                  </TableCell>
                  <TableCell>{cart.quantity}</TableCell>
                  <TableCell>{new Date(cart.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
