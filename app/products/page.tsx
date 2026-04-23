"use client";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Save,
  X,
  Trash2,
  PlusCircle,
  Plus,
  Search,
  Filter,
  Image as ImageIcon
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { snackProducts, Product, rawMaterials } from "@/lib/snack-mock-data";
import Link from "next/link";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export default function ProductsPage() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>(snackProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    category: "dalmoth",
    unit: "packets",
    price: "",
    sku: ""
  });

  const [ingredients, setIngredients] = useState<{ materialId: string, quantity: string }[]>([]);

  const addIngredient = () => {
    setIngredients([...ingredients, { materialId: "", quantity: "" }]);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const updateIngredient = (index: number, field: string, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setIngredients(newIngredients);
  };

  const filteredProducts = products.filter((item: Product) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.product_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct: Product = {
      product_id: formData.id,
      name: formData.name,
      category: formData.category as 'dalmoth' | 'chips',
      unit: formData.unit,
      selling_price: Number(formData.price),
      sku: Number(formData.sku),
      stock_quantity: 0,
      status: "In Stock",
      image: ""
    };

    setProducts([newProduct, ...products]);
    setIsAddDialogOpen(false);
    setFormData({ id: "", name: "", category: "dalmoth", unit: "packets", price: "", sku: "" });
    setIngredients([]);

    toast({
      title: "Product Added",
      description: `${newProduct.name} with its recipe has been saved.`,
    });
  };

  const handleAction = (name: string, action: string) => {
    toast({
      title: `${action} Initialized`,
      description: `Performing ${action.toLowerCase()} on ${name}.`,
    });
  };

  return (
    <div className="flex flex-1 flex-col bg-background animate-in-fade">
      <PageHeader
        title="Products Catalog"
        breadcrumbs={[{ title: "Inventory" }, { title: "Products" }]}
      />

      <main className="flex-1 space-y-6 p-4 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-6 animate-in-slide-up">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight text-slate-500">Product Catalog</h2>
            <p className="text-slate-500 font-medium tracking-tight">Manage your items, categories, and stock levels.</p>
          </div>
          <div className="flex items-center gap-4">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 text-white shadow-sm rounded-lg h-10 px-4 font-semibold">
                  <Plus className="mr-2 h-4 w-4" /> New Product
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto bg-white border-slate-200 text-slate-900 shadow-xl rounded-xl">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">Add Product</DialogTitle>
                  <DialogDescription className="text-slate-500">
                    Configure your product details and recipe requirements.
                  </DialogDescription>
                </DialogHeader>
                <form className="space-y-5 py-4" onSubmit={handleAddProduct}>
                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="id" className="text-slate-600 text-xs font-semibold uppercase tracking-wider">Product ID</Label>
                      <Input
                        id="id"
                        placeholder="PR006"
                        required
                        className="bg-slate-50 border-slate-200 text-slate-900 rounded-lg"
                        value={formData.id}
                        onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-slate-600 text-xs font-semibold uppercase tracking-wider">Product Name</Label>
                      <Input
                        id="name"
                        placeholder="Masala Chips"
                        required
                        className="bg-slate-50 border-slate-200 text-slate-900 rounded-lg"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-slate-600 text-xs font-semibold uppercase tracking-wider">Category</Label>
                      <Select
                        required
                        value={formData.category}
                        onValueChange={(val) => setFormData({ ...formData, category: val })}
                      >
                        <SelectTrigger className="w-full bg-slate-50 border-slate-200 text-slate-900 rounded-lg h-10">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-slate-200 text-slate-900 rounded-lg shadow-xl">
                          <SelectItem value="dalmoth">Dalmoth</SelectItem>
                          <SelectItem value="chips">Chips</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="unit" className="text-slate-600 text-xs font-semibold uppercase tracking-wider">Unit</Label>
                      <Input
                        id="unit"
                        placeholder="packets"
                        required
                        className="bg-slate-50 border-slate-200 text-slate-900 rounded-lg"
                        value={formData.unit}
                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="price" className="text-slate-600 text-xs font-semibold uppercase tracking-wider">Price</Label>
                      <Input
                        id="price"
                        type="number"
                        placeholder="₹ 0.00"
                        required
                        className="bg-slate-50 border-slate-200 text-slate-900 rounded-lg"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sku" className="text-slate-600 text-xs font-semibold uppercase tracking-wider">SKU (Units/Box)</Label>
                      <Input
                        id="sku"
                        type="number"
                        placeholder="12"
                        required
                        className="bg-slate-50 border-slate-200 text-slate-900 rounded-lg"
                        value={formData.sku}
                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-100 space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-bold text-slate-900">Resource Allocation (Recipe)</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-primary hover:bg-blue-50 font-semibold"
                        onClick={addIngredient}
                      >
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Material
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {ingredients.length === 0 ? (
                        <div className="text-center py-8 border border-dashed rounded-lg border-slate-200 bg-slate-50 text-slate-500 text-sm">
                          No materials allocated yet.
                        </div>
                      ) : (
                        ingredients.map((ing, idx) => (
                          <div key={idx} className="flex items-end gap-3 animate-in-slide-up">
                            <div className="flex-1 space-y-1.5">
                              <Label className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Material</Label>
                              <Select
                                value={ing.materialId}
                                onValueChange={(val) => updateIngredient(idx, "materialId", val)}
                              >
                                <SelectTrigger className="h-9 w-full bg-slate-50 border-slate-200 text-slate-900 rounded-lg">
                                  <SelectValue placeholder="Select Material" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border-slate-200 text-slate-900 rounded-lg">
                                  {rawMaterials.map(rm => (
                                    <SelectItem key={rm.material_id} value={rm.material_id}>
                                      {rm.name} ({rm.unit})
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="w-28 space-y-1.5">
                              <Label className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Qty</Label>
                              <Input
                                type="number"
                                placeholder="0.0"
                                className="h-9 bg-slate-50 border-slate-200 text-slate-900 rounded-lg"
                                value={ing.quantity}
                                onChange={(e) => updateIngredient(idx, "quantity", e.target.value)}
                              />
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 text-rose-500 hover:bg-rose-50"
                              onClick={() => removeIngredient(idx)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                  <DialogFooter className="pt-4">
                    <Button type="submit" className="bg-primary hover:bg-primary/90 w-full h-11 rounded-lg font-bold text-white shadow-sm">
                      <Save className="mr-2 h-4 w-4" /> Save Product
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="space-y-4 animate-in-slide-up [animation-delay:100ms]">
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search products..."
                className="pl-9 bg-slate-50 border-slate-200 text-slate-900 h-9 rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="bg-white border-slate-200 text-slate-600 h-9 font-semibold" onClick={() => handleAction("All Categories", "Filter")}>
                <Filter className="mr-2 h-4 w-4 text-primary" /> Filter
              </Button>
              <Button variant="outline" size="sm" className="bg-white border-slate-200 text-slate-600 h-9 font-semibold">
                Categories
              </Button>
            </div>
          </div>

          <Card className="bg-white border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <Table>
              <TableHeader className="bg-slate-50/80">
                <TableRow className="border-slate-100 hover:bg-transparent">
                  <TableHead className="pl-6 w-[80px] text-slate-500 uppercase text-[10px] font-bold tracking-wider py-4">Visual</TableHead>
                  <TableHead className="text-slate-500 uppercase text-[10px] font-bold tracking-wider py-4">ID</TableHead>
                  <TableHead className="text-slate-500 uppercase text-[10px] font-bold tracking-wider py-4">Name</TableHead>
                  <TableHead className="text-slate-500 uppercase text-[10px] font-bold tracking-wider py-4">Category</TableHead>
                  <TableHead className="text-slate-500 uppercase text-[10px] font-bold tracking-wider py-4">Unit</TableHead>
                  <TableHead className="text-slate-500 uppercase text-[10px] font-bold tracking-wider py-4">Price</TableHead>
                  <TableHead className="text-slate-500 uppercase text-[10px] font-bold tracking-wider py-4 pr-6">SKU</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product: Product) => (
                  <TableRow key={product.product_id} className="border-slate-100 hover:bg-slate-50/50 transition-colors group">
                    <TableCell className="pl-6 py-4">
                      <div className="h-10 w-10 rounded-lg border border-slate-100 bg-slate-50 overflow-hidden flex items-center justify-center">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                        ) : (
                          <ImageIcon className="h-5 w-5 text-slate-300" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-primary font-medium cursor-pointer hover:underline">{product.product_id}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-slate-900">{product.name}</span>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700 uppercase tracking-wide">
                        {product.category}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-slate-500 font-medium">{product.unit}</span>
                    </TableCell>
                    <TableCell>
                      <div className="font-bold text-slate-900">₹{product.selling_price.toLocaleString()}</div>
                    </TableCell>
                    <TableCell className="pr-6">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-700">{product.sku} <span className="text-[10px] text-slate-400 font-medium">u/box</span></span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </main>
    </div>
  );
}
