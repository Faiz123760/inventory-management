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
import { Search, Package2 } from 'lucide-react'
import { mockSweets } from '@/lib/mock-data'

export function ProductsTable() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredProducts = useMemo(
    () =>
      mockSweets.filter((product) =>
        [
          product.name,
          product.slug,
          product.currency,
          String(product.price),
          String(product.weight),
        ]
          .join(' ')
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      ),
    [searchTerm]
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 rounded-2xl border bg-muted/20 p-3">
        <Package2 className="h-4 w-4 text-muted-foreground" />
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search sweets..."
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
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Weight</TableHead>
              <TableHead>Categories</TableHead>
              <TableHead>Images</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  {searchTerm ? 'No sweets found matching your search.' : 'No sweets available.'}
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product._id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.slug}</TableCell>
                  <TableCell>{product.price} {product.currency}</TableCell>
                  <TableCell>{product.weight}g</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {product.categories.length} categories
                    </Badge>
                  </TableCell>
                  <TableCell>{product.images.length > 0 ? `${product.images.length} images` : 'None'}</TableCell>
                  <TableCell>{new Date(product.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">Read only</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-muted-foreground">
        Showing {filteredProducts.length} of {mockSweets.length} sweets
      </div>
    </div>
  )
}
