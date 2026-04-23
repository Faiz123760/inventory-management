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
import { Search, Warehouse } from 'lucide-react'
import { mockInventory } from '@/lib/mock-data'

export function InventoryTable() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredInventory = useMemo(
    () =>
      mockInventory.filter((item) =>
        [item.sweet?.name, item.sweet?.slug]
          .join(' ')
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      ),
    [searchTerm]
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 rounded-2xl border bg-muted/20 p-3">
        <Warehouse className="h-4 w-4 text-muted-foreground" />
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search inventory..."
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
              <TableHead>Product</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Low Stock Threshold</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInventory.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8">
                  {searchTerm ? 'No inventory found matching your search.' : 'No inventory available.'}
                </TableCell>
              </TableRow>
            ) : (
              filteredInventory.map((item) => (
                <TableRow key={item._id}>
                  <TableCell className="font-medium">{item.sweet?.name || 'Unknown'}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.lowStockThreshold}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
