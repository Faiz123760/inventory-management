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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Save, 
  X, 
  Info, 
  Scale, 
  Truck, 
  Warehouse, 
  ScanBarcode
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

export default function AddRawMaterialPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [qty, setQty] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [sellPrice, setSellPrice] = useState<number>(0);
  const totalCost = qty * price;
  const margin = price > 0 ? (((sellPrice - price) / price) * 100).toFixed(2) : "0";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Material Added Successfully",
      description: "Inventory records have been updated with the new material.",
    });
    setTimeout(() => {
      router.push("/raw-materials");
    }, 1000);
  };

  return (
    <div className="flex flex-1 flex-col bg-slate-50/50">
      <PageHeader
        title="Add Raw Material"
        breadcrumbs={[{ title: "Raw Materials", href: "/raw-materials" }, { title: "New Material" }]}
      />

      <main className="flex-1 p-4 md:p-8 space-y-8 max-w-5xl mx-auto w-full">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Create New Entry</h2>
            <p className="text-slate-500">Register new raw materials or ingredients into the inventory system.</p>
          </div>
        </div>

        <form className="space-y-8" onSubmit={handleSubmit}>
          {/* Basic Information */}
          <Card className="border-none shadow-sm ring-1 ring-slate-200">
            <CardHeader className="border-b bg-slate-50/50">
              <CardTitle className="text-lg flex items-center gap-2">
                <Info className="h-5 w-5 text-[#0B3C5D]" /> 
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Material Name <span className="text-rose-500">*</span></Label>
                  <Input id="name" placeholder="e.g. Corn Meal" required className="focus-visible:ring-[#0B3C5D]" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sku">Material Code / SKU <span className="text-rose-500">*</span></Label>
                  <Input id="sku" placeholder="e.g. RM-COR-001" required className="focus-visible:ring-[#0B3C5D]" />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Provide additional details about the material quality or usage..." 
                    className="min-h-[100px] focus-visible:ring-[#0B3C5D]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quantity & Units */}
          <Card className="border-none shadow-sm ring-1 ring-slate-200">
            <CardHeader className="border-b bg-slate-50/50">
              <CardTitle className="text-lg flex items-center gap-2">
                <Scale className="h-5 w-5 text-[#0B3C5D]" /> 
                Quantity & Units
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Initial Quantity <span className="text-rose-500">*</span></Label>
                  <Input 
                    id="quantity" 
                    type="number" 
                    placeholder="0" 
                    required 
                    className="focus-visible:ring-[#0B3C5D]" 
                    onChange={(e) => setQty(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit <span className="text-rose-500">*</span></Label>
                  <Select required>
                    <SelectTrigger className="focus:ring-[#0B3C5D]">
                      <SelectValue placeholder="Select Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">kg</SelectItem>
                      <SelectItem value="litre">litre</SelectItem>
                      <SelectItem value="pcs">pcs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="min-stock">Minimum Stock Level <span className="text-rose-500">*</span></Label>
                  <Input id="min-stock" type="number" placeholder="Alert threshold" required className="focus-visible:ring-[#0B3C5D]" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reorder-qty">Reorder Quantity <span className="text-rose-500">*</span></Label>
                  <Input id="reorder-qty" type="number" placeholder="Default reorder amount" required className="focus-visible:ring-[#0B3C5D]" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Purchase Details */}
          <Card className="border-none shadow-sm ring-1 ring-slate-200">
            <CardHeader className="border-b bg-slate-50/50">
              <CardTitle className="text-lg flex items-center gap-2">
                <Truck className="h-5 w-5 text-[#0B3C5D]" /> 
                Purchase Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-6 md:grid-cols-2">

                <div className="space-y-2">
                  <Label htmlFor="price">Purchase Price (per unit) <span className="text-rose-500">*</span></Label>
                  <Input 
                    id="price" 
                    type="number" 
                    placeholder="₹ 0.00" 
                    required 
                    className="focus-visible:ring-[#0B3C5D]" 
                    onChange={(e) => setPrice(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="total-cost">Total Cost</Label>
                  <Input id="total-cost" type="text" value={`₹ ${totalCost.toLocaleString()}`} readOnly className="bg-slate-50 font-semibold text-[#0B3C5D]" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="selling-price">Selling Price (per unit)</Label>
                  <Input 
                    id="selling-price" 
                    type="number" 
                    placeholder="₹ 0.00" 
                    className="focus-visible:ring-[#0B3C5D]" 
                    onChange={(e) => setSellPrice(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="margin">Profit Margin (%)</Label>
                  <Input id="margin" type="text" value={`${margin}%`} readOnly className="bg-slate-50 font-semibold text-emerald-600" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="purchase-date">Purchase Date <span className="text-rose-500">*</span></Label>
                  <Input id="purchase-date" type="date" required className="focus-visible:ring-[#0B3C5D]" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Storage & Tracking */}
          <Card className="border-none shadow-sm ring-1 ring-slate-200">
            <CardHeader className="border-b bg-slate-50/50">
              <CardTitle className="text-lg flex items-center gap-2">
                <Warehouse className="h-5 w-5 text-[#0B3C5D]" /> 
                Storage & Tracking
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input id="expiry" type="date" className="focus-visible:ring-[#0B3C5D]" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Storage Location <span className="text-rose-500">*</span></Label>
                  <Input id="location" placeholder="e.g. Aisle 4, Shelf B" required className="focus-visible:ring-[#0B3C5D]" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="batch">Batch Number</Label>
                  <Input id="batch" placeholder="e.g. B-992-X" className="focus-visible:ring-[#0B3C5D]" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Stock Status <span className="text-rose-500">*</span></Label>
                  <Select required defaultValue="in-stock">
                    <SelectTrigger className="focus:ring-[#0B3C5D]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in-stock">In Stock</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <Link href="/raw-materials">
              <Button variant="outline" type="button" className="border-slate-200">
                <X className="mr-2 h-4 w-4" /> Cancel
              </Button>
            </Link>
            <Button size="lg" className="bg-[#0B3C5D] hover:bg-[#072a42] px-8">
              <Save className="mr-2 h-4 w-4" /> Save Material
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
