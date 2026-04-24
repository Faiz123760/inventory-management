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
import { Search, Warehouse, Save } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";

export function InventoryTable() {
  const { state, updateProduct } = useAppStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [draftQty, setDraftQty] = useState<Record<string, string>>({});

  const filteredInventory = useMemo(
    () =>
      state.products.filter((item) =>
        [item.name, item.product_id]
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      ),
    [state.products, searchTerm]
  );

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
              <TableHead>Category</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Current Stock</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInventory.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  {searchTerm ? "No inventory found matching your search." : "No inventory available."}
                </TableCell>
              </TableRow>
            ) : (
              filteredInventory.map((item) => (
                <TableRow key={item.product_id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="capitalize">{item.category}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 max-w-45">
                      <Input
                        type="number"
                        value={draftQty[item.product_id] ?? String(item.stock_quantity)}
                        onChange={(e) =>
                          setDraftQty((prev) => ({
                            ...prev,
                            [item.product_id]: e.target.value,
                          }))
                        }
                        className="h-8"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      onClick={() => {
                        const value = Number(draftQty[item.product_id] ?? item.stock_quantity);
                        updateProduct({
                          ...item,
                          stock_quantity: Number.isNaN(value) ? item.stock_quantity : value,
                          status: value <= 0 ? "Out of Stock" : value <= 20 ? "Low Stock" : "In Stock",
                        });
                      }}
                    >
                      <Save className="h-4 w-4 mr-1" /> Save
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
