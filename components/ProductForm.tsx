"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Save, Trash2 } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

export const PRODUCT_BLANK = { id: "", name: "", category: "dalmoth", unit: "packets", price: "", sku: "", minStock: "" };

interface ProductFormProps {
  onSubmit: (e: React.FormEvent) => void;
  label: string;
  formData: typeof PRODUCT_BLANK;
  setFormData: Dispatch<SetStateAction<typeof PRODUCT_BLANK>>;
  productMaterials: Array<{ materialId: string; quantity: string }>;
  updateProductMaterialRow: (index: number, field: "materialId" | "quantity", value: string) => void;
  addProductMaterialRow: () => void;
  removeProductMaterialRow: (index: number) => void;
  materials: any[];
  isEdit?: boolean;
}

export function ProductForm({
  onSubmit,
  label,
  formData,
  setFormData,
  productMaterials,
  updateProductMaterialRow,
  addProductMaterialRow,
  removeProductMaterialRow,
  materials,
  isEdit
}: ProductFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Product Details Section */}
      <div className="grid gap-x-4 gap-y-3 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider">Product ID</Label>
          <Input
            placeholder="PR006"
            required
            disabled={isEdit}
            className="h-9 bg-slate-50/50 border-slate-200 rounded-md text-slate-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-60"
            value={formData.id}
            onChange={(e) => setFormData({ ...formData, id: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider">Product Name</Label>
          <Input
            placeholder="Masala Chips"
            required
            className="h-9 bg-slate-50/50 border-slate-200 rounded-md text-slate-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider">Category</Label>
          <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
            <SelectTrigger className="h-9 w-full bg-slate-50/50 border-slate-200 text-slate-900 rounded-md focus:ring-2 focus:ring-blue-500/20 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200 rounded-md shadow-2xl">
              <SelectItem value="dalmoth">Dalmoth</SelectItem>
              <SelectItem value="chips">Chips</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider">Unit</Label>
          <Select value={formData.unit} onValueChange={(v) => setFormData({ ...formData, unit: v })}>
            <SelectTrigger className="h-9 w-full bg-slate-50/50 border-slate-200 text-slate-900 rounded-md focus:ring-2 focus:ring-blue-500/20 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200 rounded-md shadow-2xl">
              <SelectItem value="packets">Packets</SelectItem>
              <SelectItem value="boxes">Boxes</SelectItem>
              <SelectItem value="kg">kg</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider">Selling Price (INR)</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-xs">INR</span>
            <Input
              type="number"
              step="0.01"
              placeholder="0.00"
              required
              className="h-9 bg-slate-50/50 border-slate-200 rounded-md text-slate-900 pl-8 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider">SKU / Box Size</Label>
          <Input
            type="number"
            placeholder="12"
            className="h-9 bg-slate-50/50 border-slate-200 rounded-md text-slate-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            value={formData.sku}
            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
          />
        </div>
      </div>

      {/* Raw Material Recipe Section */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-semibold text-slate-700">Raw Material Recipe</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="bg-slate-50/50 border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold gap-2 rounded-md h-10 px-4 transition-all"
            onClick={addProductMaterialRow}
          >
            <Plus className="h-4 w-4" /> Add Row
          </Button>
        </div>

        <div className="bg-white border border-slate-100 rounded-md p-4 space-y-4 shadow-sm">
          {productMaterials.map((row, index) => (
            <div key={index} className="space-y-4">
              <div className="flex gap-4 items-center">
                <div className="flex-1">
                  <Select value={row.materialId} onValueChange={(v) => updateProductMaterialRow(index, "materialId", v)}>
                    <SelectTrigger className="h-9 w-full bg-white border-slate-200 rounded-md focus:ring-2 focus:ring-blue-500/20">
                      <SelectValue placeholder="Choose raw material" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-200 rounded-md shadow-2xl">
                      {materials.map((material) => (
                        <SelectItem key={material.material_id} value={material.material_id}>
                          {material.name} ({material.unit})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-24">
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Qty"
                    value={row.quantity}
                    onChange={(e) => updateProductMaterialRow(index, "quantity", e.target.value)}
                    className="h-9 bg-white border-slate-200 rounded-md text-center text-sm focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeProductMaterialRow(index)}
                  className="h-9 w-9 text-slate-300 hover:text-rose-500 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              {index === productMaterials.length - 1 && (
                <p className="text-[12px] text-slate-400 font-medium ml-1">
                  Define ingredients and required quantity per finished product unit.
                </p>
              )}
              {index < productMaterials.length - 1 && <div className="border-b border-slate-50 mx-2" />}
            </div>
          ))}
        </div>
      </div>

      {/* Submit Action Bar */}
      <div className="pt-2">
        <Button
          type="submit"
          className="w-full h-11 bg-[#021a41] hover:bg-[#03255a] text-white font-bold rounded-md shadow-lg shadow-blue-900/10 gap-2 text-sm transition-all active:scale-[0.98]"
        >
          <Save className="h-4 w-4" /> {label}
        </Button>
      </div>
    </form>
  );
}
