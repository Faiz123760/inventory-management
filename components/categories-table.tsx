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
import { Search, Tags } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function CategoriesTable() {
  const { state, updateProduct } = useAppStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categoryStats = useMemo(() => {
    const groups = state.products.reduce<Record<string, number>>((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(groups).map(([name, count]) => ({
      id: name,
      name,
      count,
    }));
  }, [state.products]);

  const filteredCategories = useMemo(
    () =>
      categoryStats.filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [categoryStats, searchTerm]
  );

  const selectedProducts = useMemo(
    () => state.products.filter((p) => p.category === selectedCategory),
    [state.products, selectedCategory]
  );

  const handleMoveAll = (from: string, to: "dalmoth" | "chips") => {
    state.products
      .filter((p) => p.category === from)
      .forEach((p) => updateProduct({ ...p, category: to }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 rounded-2xl border bg-muted/20 p-3">
        <Tags className="h-4 w-4 text-muted-foreground" />
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
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
              <TableHead>Products</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8">
                  {searchTerm ? "No categories found matching your search." : "No categories available."}
                </TableCell>
              </TableRow>
            ) : (
              filteredCategories.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium capitalize">{c.name}</TableCell>
                  <TableCell>{c.count}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => setSelectedCategory(c.name)}>
                      View Products
                    </Button>
                    {c.name !== "chips" ? (
                      <Button size="sm" onClick={() => handleMoveAll(c.name, "chips")}>Move All to Chips</Button>
                    ) : (
                      <Button size="sm" onClick={() => handleMoveAll(c.name, "dalmoth")}>Move All to Dalmoth</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedCategory} onOpenChange={(open) => !open && setSelectedCategory(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="capitalize">Products in {selectedCategory}</DialogTitle>
          </DialogHeader>
          <div className="max-h-88 overflow-y-auto space-y-2">
            {selectedProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No products found in this category.</p>
            ) : (
              selectedProducts.map((p) => (
                <div key={p.product_id} className="rounded-lg border p-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.product_id}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">Stock: {p.stock_quantity}</span>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
