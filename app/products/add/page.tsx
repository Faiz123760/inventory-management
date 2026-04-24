"use client";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Save, 
  X, 
  Package, 
  IndianRupee, 
  Boxes, 
  Factory, 
  Calendar, 
  Image as ImageIcon,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { rawMaterials } from "@/lib/snack-mock-data";
import { PlusCircle, Trash2 } from "lucide-react";

export default function AddProductPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [costPrice, setCostPrice] = useState<number>(0);
  const [sellPrice, setSellPrice] = useState<number>(0);
  
  const margin = costPrice > 0 ? (((sellPrice - costPrice) / costPrice) * 100).toFixed(2) : "0";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Product Catalog Updated",
      description: "New snack product has been successfully added to the catalog.",
    });
    setTimeout(() => {
      router.push("/products");
    }, 1000);
  };

  return (
    <div className="flex flex-1 flex-col bg-slate-50/50">
      <PageHeader
        title="Add Finished Product"
        breadcrumbs={[{ title: "Products", href: "/products" }, { title: "New Product" }]}
      />

      <main className="flex-1 p-4 md:p-8 space-y-8 max-w-5xl mx-auto w-full">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Create New Product</h2>
            <p className="text-slate-500">Add a new snack product variant to your customer catalog.</p>
          </div>
        </div>

        <form className="space-y-8 pb-12" onSubmit={handleSubmit}>
          {/* Basic Information */}
          <Card className="border-none shadow-sm ring-1 ring-slate-200">
            <CardHeader className="border-b bg-slate-50/50">
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="h-5 w-5 text-[#0B3C5D]" /> 
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="prod-name">Product Name <span className="text-rose-500">*</span></Label>
                  <Input id="prod-name" placeholder="e.g. Kurkure Masala Munch" required className="focus-visible:ring-[#0B3C5D]" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prod-sku">Product Code / SKU <span className="text-rose-500">*</span></Label>
                  <Input id="prod-sku" placeholder="e.g. SNK-MAS-KUR-01" required className="focus-visible:ring-[#0B3C5D]" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prod-category">Category <span className="text-rose-500">*</span></Label>
                  <Select required>
                    <SelectTrigger className="focus:ring-[#0B3C5D]">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="chips">Chips</SelectItem>
                      <SelectItem value="dalmoth">Dalmoth</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand Name</Label>
                  <Input id="brand" placeholder="e.g. SnackFlow Premium" className="focus-visible:ring-[#0B3C5D]" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="prod-desc">Description</Label>
                  <Textarea 
                    id="prod-desc" 
                    placeholder="Describe the product flavor, ingredients, and key selling points..." 
                    className="min-h-[100px] focus-visible:ring-[#0B3C5D]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Orders */}
          <Card className="border-none shadow-sm ring-1 ring-slate-200">
            <CardHeader className="border-b bg-slate-50/50">
              <CardTitle className="text-lg flex items-center gap-2">
                <IndianRupee className="h-5 w-5 text-[#0B3C5D]" /> 
                Pricing & Orders
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="cost-price">Cost Price <span className="text-rose-500">*</span></Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 font-medium">₹</span>
                    <Input 
                      id="cost-price" 
                      type="number" 
                      placeholder="0.00" 
                      required 
                      className="pl-7 focus-visible:ring-[#0B3C5D]" 
                      onChange={(e) => setCostPrice(Number(e.target.value))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="selling-price">Selling Price <span className="text-rose-500">*</span></Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 font-medium">₹</span>
                    <Input 
                      id="selling-price" 
                      type="number" 
                      placeholder="0.00" 
                      required 
                      className="pl-7 focus-visible:ring-[#0B3C5D]" 
                      onChange={(e) => setSellPrice(Number(e.target.value))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="margin">Profit Margin</Label>
                   <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 font-medium">%</span>
                    <Input id="margin" type="text" value={margin} readOnly className="pl-8 bg-slate-50 font-bold text-emerald-600" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Inventory */}
            <Card className="border-none shadow-sm ring-1 ring-slate-200">
              <CardHeader className="border-b bg-slate-50/50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Boxes className="h-5 w-5 text-[#0B3C5D]" /> 
                  Inventory
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="stock-qty">Stock Quantity <span className="text-rose-500">*</span></Label>
                      <Input id="stock-qty" type="number" placeholder="0" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="prod-unit">Unit <span className="text-rose-500">*</span></Label>
                      <Select required>
                        <SelectTrigger>
                          <SelectValue placeholder="Unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="packets">Packets</SelectItem>
                          <SelectItem value="boxes">Boxes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU (Units per Box) <span className="text-rose-500">*</span></Label>
                    <Input id="sku" type="number" placeholder="e.g. 12" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="min-prod-stock">Minimum Stock Level <span className="text-rose-500">*</span></Label>
                    <Input id="min-prod-stock" type="number" placeholder="Alert threshold" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="prod-reorder">Reorder Level <span className="text-rose-500">*</span></Label>
                    <Input id="prod-reorder" type="number" placeholder="Automatic reorder point" required />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Production Details */}
            <Card className="border-none shadow-sm ring-1 ring-slate-200">
              <CardHeader className="border-b bg-slate-50/50 flex flex-row items-center justify-between py-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Factory className="h-5 w-5 text-[#0B3C5D]" /> 
                  Production Recipe
                </CardTitle>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={addIngredient}
                  className="h-8 text-[#0B3C5D] border-[#0B3C5D]/20 hover:bg-slate-100"
                >
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Item
                </Button>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {ingredients.length === 0 ? (
                    <div className="text-center py-10 border-2 border-dashed rounded-xl bg-slate-50 text-slate-400">
                      <p className="text-sm">No raw materials added to this recipe.</p>
                      <Button variant="link" size="sm" onClick={addIngredient} className="text-[#0B3C5D] mt-2">
                        Click here to add the first ingredient
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {ingredients.map((ing, idx) => (
                        <div key={idx} className="flex items-end gap-3 p-3 rounded-lg border bg-slate-50/50">
                          <div className="flex-1 space-y-2">
                            <Label className="text-xs text-slate-500 font-bold uppercase">Material</Label>
                            <Select 
                              value={ing.materialId} 
                              onValueChange={(val) => updateIngredient(idx, "materialId", val)}
                            >
                              <SelectTrigger className="bg-white">
                                <SelectValue placeholder="Choose Material" />
                              </SelectTrigger>
                              <SelectContent>
                                {rawMaterials.map(rm => (
                                  <SelectItem key={rm.material_id} value={rm.material_id}>
                                    {rm.name} ({rm.unit})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="w-28 space-y-2">
                            <Label className="text-xs text-slate-500 font-bold uppercase">Qty</Label>
                            <Input 
                              type="number" 
                              placeholder="0.00" 
                              className="bg-white"
                              value={ing.quantity}
                              onChange={(e) => updateIngredient(idx, "quantity", e.target.value)}
                            />
                          </div>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon" 
                            className="text-rose-500 hover:bg-rose-50 mb-0.5"
                            onClick={() => removeIngredient(idx)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="grid gap-4 mt-6 pt-6 border-t">
                    <div className="space-y-2">
                      <Label htmlFor="prod-date">Estimated Production Date <span className="text-rose-500">*</span></Label>
                      <Input id="prod-date" type="date" required className="focus-visible:ring-[#0B3C5D]" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="prod-batch">Batch Number / Reference</Label>
                      <Input id="prod-batch" placeholder="e.g. BATCH-2024-001" className="focus-visible:ring-[#0B3C5D]" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Expiry & Packaging */}
            <Card className="border-none shadow-sm ring-1 ring-slate-200">
              <CardHeader className="border-b bg-slate-50/50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-[#0B3C5D]" /> 
                  Expiry & Packaging
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="prod-expiry">Expiry Date <span className="text-rose-500">*</span></Label>
                    <Input id="prod-expiry" type="date" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight / Size <span className="text-rose-500">*</span></Label>
                    <Input id="weight" placeholder="e.g. 50g or Large" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pack-type">Packaging Type <span className="text-rose-500">*</span></Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="packet">Packet</SelectItem>
                        <SelectItem value="box">Box</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Media & Status */}
            <Card className="border-none shadow-sm ring-1 ring-slate-200">
              <CardHeader className="border-b bg-slate-50/50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-[#0B3C5D]" /> 
                  Media & Status
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label>Product Image</Label>
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-slate-400 hover:border-[#0B3C5D] hover:text-[#0B3C5D] transition-all cursor-pointer bg-slate-50">
                      <ImageIcon className="h-10 w-10 mb-2" />
                      <span className="text-xs font-medium">Click to upload image</span>
                      <span className="text-[10px] opacity-60">PNG, JPG up to 5MB</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="availability">Availability Status <span className="text-rose-500">*</span></Label>
                    <div className="flex items-center space-x-2 bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                      <CheckCircle2 className="h-4 w-4 text-[#0B3C5D]" />
                      <Select required defaultValue="active">
                        <SelectTrigger className="border-none bg-transparent shadow-none focus:ring-0">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t">
            <Link href="/products">
              <Button variant="outline" type="button" className="border-slate-200 h-11 px-6">
                <X className="mr-2 h-4 w-4" /> Cancel
              </Button>
            </Link>
            <Button size="lg" className="bg-[#0B3C5D] hover:bg-[#072a42] h-11 px-10 shadow-lg shadow-blue-900/10">
              <Save className="mr-2 h-4 w-4" /> Save Product
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
