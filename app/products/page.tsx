"use client";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Save, Trash2, Plus, Search, Package, IndianRupee, Layers, Edit2, AlertTriangle,
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Product } from "@/lib/snack-mock-data";
import { Label } from "@/components/ui/label";
import { useState, useMemo } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAppStore } from "@/lib/store";

function StockBadge({ qty }: { qty: number }) {
  if (qty === 0) return <span className="badge badge-error">Out of Stock</span>;
  if (qty <= 20) return <span className="badge badge-warning">Low Stock</span>;
  return <span className="badge badge-success">In Stock</span>;
}

function CategoryPill({ cat }: { cat: string }) {
  return <span className={`badge ${cat === "chips" ? "badge-purple" : "badge-info"}`}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</span>;
}

import { ProductForm, PRODUCT_BLANK as BLANK } from "@/components/ProductForm";

export default function ProductsPage() {
  const { toast } = useToast();
  const { state, addProduct, updateProduct, deleteProduct } = useAppStore();
  const products = state.products;

  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [viewRecipe, setViewRecipe] = useState<Product | null>(null);
  const [editTarget, setEditTarget] = useState<Product | null>(null);
  const [formData, setFormData] = useState(BLANK);
  const [productMaterials, setProductMaterials] = useState<Array<{ materialId: string; quantity: string }>>([
    { materialId: "", quantity: "" },
  ]);

  const addProductMaterialRow = () => {
    setProductMaterials((prev) => [...prev, { materialId: "", quantity: "" }]);
  };

  const removeProductMaterialRow = (index: number) => {
    setProductMaterials((prev) => {
      if (prev.length === 1) return [{ materialId: "", quantity: "" }];
      return prev.filter((_, i) => i !== index);
    });
  };

  const updateProductMaterialRow = (index: number, field: "materialId" | "quantity", value: string) => {
    setProductMaterials((prev) => prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
  };

  const filtered = useMemo(() => products.filter((p) => {
    const s = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.product_id.toLowerCase().includes(searchTerm.toLowerCase());
    const c = activeCategory === "all" || p.category === activeCategory;
    return s && c;
  }), [products, searchTerm, activeCategory]);

  const resetForm = () => {
    setFormData(BLANK);
    setProductMaterials([{ materialId: "", quantity: "" }]);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const p: Product = {
      product_id: formData.id,
      name: formData.name,
      category: formData.category as "dalmoth" | "chips",
      unit: formData.unit,
      selling_price: Number(formData.price),
      sku: Number(formData.sku),
      stock_quantity: 0,
      status: "In Stock",
      image: "",
      recipe: productMaterials
        .filter((rm) => rm.materialId && Number(rm.quantity) > 0)
        .map((rm) => ({ material_id: rm.materialId, quantity: Number(rm.quantity) })),
    };
    addProduct(p);
    setIsAddOpen(false);
    resetForm();
    toast({ title: "Product added", description: `${p.name} has been registered.` });
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget) return;
    updateProduct({
      ...editTarget,
      name: formData.name,
      category: formData.category as "dalmoth" | "chips",
      unit: formData.unit,
      selling_price: Number(formData.price),
      sku: Number(formData.sku),
      recipe: productMaterials
        .filter((rm) => rm.materialId && Number(rm.quantity) > 0)
        .map((rm) => ({ material_id: rm.materialId, quantity: Number(rm.quantity) })),
    });
    setEditTarget(null);
    resetForm();
    toast({ title: "Product updated", description: `${formData.name} has been saved.` });
  };

  const openEdit = (p: Product) => {
    setEditTarget(p);
    setFormData({ id: p.product_id, name: p.name, category: p.category, unit: p.unit, price: String(p.selling_price), sku: String(p.sku), minStock: "" });
    if (p.recipe && p.recipe.length > 0) {
      setProductMaterials(p.recipe.map((rm) => ({ materialId: rm.material_id, quantity: String(rm.quantity) })));
    } else {
      setProductMaterials([{ materialId: "", quantity: "" }]);
    }
  };

  const handleDelete = (id: string, name: string) => {
    deleteProduct(id);
    toast({ title: "Product removed", description: `${name} deleted.` });
  };

  const totalValue = products.reduce((s, p) => s + p.selling_price * p.stock_quantity, 0);
  const lowStockCount = products.filter((p) => p.stock_quantity <= 20).length;


  return (
    <div className="flex flex-1 flex-col bg-background animate-in-fade">
      <PageHeader title="Products" breadcrumbs={[{ title: "Inventory" }, { title: "Products" }]} />

      <main className="flex-1 p-3 space-y-3">
        {/* Header */}
        <div className="page-section-header animate-in-slide-up">
          <div><h1 className="page-title">Product Catalog</h1><p className="page-subtitle">Manage finished goods, prices, and stock levels.</p></div>
          <Dialog open={isAddOpen} onOpenChange={(o) => { setIsAddOpen(o); if (!o) resetForm(); }}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-9 gap-1.5 bg-primary hover:bg-primary/90 text-white font-medium rounded-md shadow-sm shadow-primary/20">
                <Plus className="h-3.5 w-3.5" /> ADD PRODUCT
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-white border-none rounded-md shadow-2xl p-0 overflow-hidden">
              <DialogHeader className="px-5 pt-5 pb-3 border-b border-slate-50 bg-slate-50/30">
                <DialogTitle className="text-lg font-black tracking-tight text-slate-900">Add Product</DialogTitle>
                <DialogDescription className="text-slate-500 font-medium text-[12px]">Configure product details and resource requirements.</DialogDescription>
              </DialogHeader>
              <div className="no-scrollbar max-h-[75vh] overflow-y-auto px-5 py-3">
                <ProductForm
                  onSubmit={handleAdd}
                  label="Save Product"
                  formData={formData}
                  setFormData={setFormData}
                  productMaterials={productMaterials}
                  updateProductMaterialRow={updateProductMaterialRow}
                  addProductMaterialRow={addProductMaterialRow}
                  removeProductMaterialRow={removeProductMaterialRow}
                  materials={state.materials}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 animate-in-slide-up [animation-delay:50ms]">
          <div className="stat-card"><div className="stat-icon bg-blue-50"><Package className="h-5 w-5 text-primary" /></div><div><p className="stat-label">Total Products</p><p className="stat-value">{products.length}</p></div></div>
          <div className="stat-card"><div className="stat-icon bg-emerald-50"><IndianRupee className="h-5 w-5 text-emerald-600" /></div><div><p className="stat-label">Catalog Value</p><p className="stat-value text-xl">INR {totalValue.toLocaleString()}</p></div></div>
          <div className="stat-card"><div className="stat-icon bg-violet-50"><Layers className="h-5 w-5 text-violet-600" /></div><div><p className="stat-label">In Stock</p><p className="stat-value">{products.filter((p) => p.stock_quantity > 20).length}</p></div></div>
          <div className="stat-card"><div className="stat-icon bg-rose-50"><AlertTriangle className="h-5 w-5 text-rose-500" /></div><div><p className="stat-label">Low / Out</p><p className={`stat-value ${lowStockCount > 0 ? "text-rose-600" : ""}`}>{lowStockCount}</p></div></div>
        </div>

        {/* Filter Bar */}
        <div className="surface animate-in-slide-up [animation-delay:80ms]">
          <div className="surface-header py-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {["all", "dalmoth", "chips"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-semibold border transition-all ${activeCategory === cat ? "bg-primary text-white border-primary shadow-sm shadow-primary/20" : "bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700"}`}
                >
                  {cat === "all" ? "All Products" : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              <Input
                placeholder="Search products…"
                className="h-8 pl-8 bg-white border-slate-200 text-slate-900 text-[13px] rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="surface-body flex flex-col items-center justify-center py-16 text-center">
              <div className="h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4"><Package className="h-7 w-7 text-slate-300" /></div>
              <p className="text-[15px] font-semibold text-slate-600">No products found</p>
              <p className="text-[13px] text-slate-400 mt-1">Try changing the filters or search term.</p>
            </div>
          ) : (
            <div className="surface-body overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-100 hover:bg-transparent">
                    <TableHead className="th pl-6">ID</TableHead>
                    <TableHead className="th">Product Name</TableHead>
                    <TableHead className="th text-center">Category</TableHead>
                    <TableHead className="th text-center">Unit</TableHead>
                    <TableHead className="th">Recipe</TableHead>
                    <TableHead className="th text-right">Price</TableHead>
                    <TableHead className="th text-center">Stock</TableHead>
                    <TableHead className="th text-center">SKU</TableHead>
                    <TableHead className="th pr-6 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((product) => (
                    <TableRow key={product.product_id} className="tr-hover last:border-0 border-slate-50">
                      <TableCell className="pl-6 td font-medium text-primary">{product.product_id}</TableCell>
                      <TableCell className="td font-semibold text-slate-900">{product.name}</TableCell>
                      <TableCell className="td text-center"><CategoryPill cat={product.category} /></TableCell>
                      <TableCell className="td text-center text-slate-500 text-[13px]">{product.unit}</TableCell>
                      <TableCell className="td">
                        {product.recipe && product.recipe.length > 0 ? (
                          <button
                            onClick={() => setViewRecipe(product)}
                            className="flex items-center gap-1.5 text-[12px] font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full w-fit hover:bg-primary/10 hover:text-primary transition-all group"
                          >
                            <Layers className="h-3 w-3 text-slate-400 group-hover:text-primary transition-colors" /> {product.recipe.length} Material{product.recipe.length !== 1 ? "s" : ""}
                          </button>
                        ) : (
                          <span className="text-[12px] text-slate-400 italic">No recipe</span>
                        )}
                      </TableCell>
                      <TableCell className="td text-right font-bold text-slate-900">INR {product.selling_price.toLocaleString()}</TableCell>
                      <TableCell className="td text-center"><StockBadge qty={product.stock_quantity} /></TableCell>
                      <TableCell className="td text-center text-slate-500 text-[13px]">{product.sku || "—"}</TableCell>
                      <TableCell className="pr-6 td text-right">
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => openEdit(product)}
                            className="h-8 px-2.5 rounded-md bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-primary transition-colors text-[12px] font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product.product_id, product.name)}
                            className="h-8 px-2.5 rounded-md bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition-colors text-[12px] font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* Edit Dialog */}
        <Dialog open={!!editTarget} onOpenChange={(o) => { if (!o) { setEditTarget(null); resetForm(); } }}>
          <DialogContent className="max-w-3xl bg-white border-none rounded-md shadow-2xl p-0 overflow-hidden">
            <DialogHeader className="px-8 pt-8 pb-6 border-b border-slate-50 bg-slate-50/30">
              <DialogTitle className="text-2xl font-black tracking-tight text-slate-900">Edit Product</DialogTitle>
              <DialogDescription className="text-slate-500 font-medium text-[13px]">Update product information and pricing.</DialogDescription>
            </DialogHeader>
            <div className="-mx-1 no-scrollbar max-h-[75vh] overflow-y-auto px-8 py-6">
              <ProductForm
                onSubmit={handleEdit}
                label="Update Product"
                formData={formData}
                setFormData={setFormData}
                productMaterials={productMaterials}
                updateProductMaterialRow={updateProductMaterialRow}
                addProductMaterialRow={addProductMaterialRow}
                removeProductMaterialRow={removeProductMaterialRow}
                materials={state.materials}
                isEdit={true}
              />
            </div>
          </DialogContent>
        </Dialog>

        {/* View Recipe Dialog */}
        <Dialog open={!!viewRecipe} onOpenChange={(o) => { if (!o) setViewRecipe(null); }}>
          <DialogContent className="max-w-md bg-white border-none rounded-xl shadow-2xl p-0 overflow-hidden">
            <DialogHeader className="px-6 pt-6 pb-4 border-b border-slate-50 bg-slate-50/30">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Layers className="h-5 w-5" />
                </div>
                <div>
                  <DialogTitle className="text-lg font-black tracking-tight text-slate-900">{viewRecipe?.name}</DialogTitle>
                  <DialogDescription className="text-slate-500 font-medium text-[12px]">Recipe Breakdown</DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <div className="p-6">
              <div className="border border-slate-100 rounded-lg overflow-hidden">
                <Table>
                  <TableHeader className="bg-slate-50/50">
                    <TableRow className="border-slate-100 hover:bg-transparent">
                      <TableHead className="text-[10px] font-bold uppercase tracking-wider py-2">Material</TableHead>
                      <TableHead className="text-[10px] font-bold uppercase tracking-wider py-2 text-right">Quantity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {viewRecipe?.recipe?.map((item, idx) => {
                      const mat = state.materials.find(m => m.material_id === item.material_id);
                      return (
                        <TableRow key={idx} className="border-slate-50">
                          <TableCell className="py-2.5 text-sm font-medium text-slate-700">{mat?.name || item.material_id}</TableCell>
                          <TableCell className="py-2.5 text-sm font-bold text-slate-900 text-right">{item.quantity} {mat?.unit}</TableCell>
                        </TableRow>
                      );
                    })}
                    {(!viewRecipe?.recipe || viewRecipe.recipe.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={2} className="py-8 text-center text-slate-400 italic text-sm">No materials defined</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
            <DialogFooter className="p-4 bg-slate-50/50 border-t border-slate-100">
              <Button onClick={() => setViewRecipe(null)} className="w-full bg-[#021a41] hover:bg-[#03255a] text-white font-bold">Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
