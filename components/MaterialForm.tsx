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
import { Save } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

export type MaterialFormData = {
  id: string;
  name: string;
  unit: string;
  stock: string;
  cost: string;
};

interface MaterialFormProps {
  formData: MaterialFormData;
  setFormData: Dispatch<SetStateAction<MaterialFormData>>;
  onSubmit: (e: React.FormEvent) => void;
  label: string;
  disableId?: boolean;
}

export function MaterialForm({
  formData,
  setFormData,
  onSubmit,
  label,
  disableId,
}: MaterialFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-x-4 gap-y-3 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider">Material ID</Label>
          <Input
            placeholder="RM006"
            required
            disabled={disableId}
            className="h-9 bg-slate-50/50 border-slate-200 rounded-md text-slate-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-60"
            value={formData.id}
            onChange={(e) => setFormData({ ...formData, id: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider">Name</Label>
          <Input
            placeholder="Chili Powder"
            required
            className="h-9 bg-slate-50/50 border-slate-200 rounded-md text-slate-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider">Unit</Label>
          <Select value={formData.unit} onValueChange={(v) => setFormData({ ...formData, unit: v })}>
            <SelectTrigger className="h-9 w-full bg-slate-50/50 border-slate-200 text-slate-900 rounded-md focus:ring-2 focus:ring-blue-500/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200 rounded-md shadow-2xl">
              <SelectItem value="kg">Kilogram (kg)</SelectItem>
              <SelectItem value="litre">Litre</SelectItem>
              <SelectItem value="pcs">Pieces</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider">Current Stock</Label>
          <Input
            type="number"
            min="0"
            placeholder="0"
            required
            className="h-9 bg-slate-50/50 border-slate-200 rounded-md text-slate-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
          />
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <Label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider">Cost / Unit (INR)</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-xs">INR</span>
            <Input
              type="number"
              min="0"
              placeholder="0.00"
              required
              className="h-9 bg-slate-50/50 border-slate-200 rounded-md text-slate-900 pl-8 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              value={formData.cost}
              onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
            />
          </div>
        </div>
      </div>

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
