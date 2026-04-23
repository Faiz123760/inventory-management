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
  Plus,
  Search,
  Mail,
  Phone,
  MoreHorizontal,
  Building2,
  ExternalLink,
  MapPin
} from "lucide-react";
import { suppliers } from "@/lib/snack-mock-data";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export default function SuppliersPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSuppliers = suppliers.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.contact.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAction = (name: string, action: string) => {
    toast({
      title: "Supplier Action",
      description: `${action} initiated for ${name}.`,
    });
  };

  return (
    <div className="flex flex-1 flex-col bg-background animate-in-fade">
      <PageHeader
        title="Suppliers"
        breadcrumbs={[{ title: "Relationships" }, { title: "Suppliers" }]}
      />

      <main className="flex-1 space-y-6 p-4 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 animate-in-slide-up">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-500">Supplier Directory</h2>
            <p className="text-slate-500 font-medium">Manage your raw material providers and logistics partners.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={() => handleAction("Global", "Add Supplier")}>
              <Plus className="mr-2 h-4 w-4" /> Add Supplier
            </Button>
          </div>
        </div>

        <Card className="bg-white border-slate-200 shadow-sm overflow-hidden animate-in-slide-up [animation-delay:100ms]">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search suppliers..."
                className="pl-8 bg-white border-slate-200 text-slate-900 h-9 rounded-lg focus-visible:ring-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <Table>
            <TableHeader className="bg-slate-50/80">
              <TableRow className="border-slate-100 hover:bg-transparent">
                <TableHead className="pl-6 w-[250px] text-slate-500 uppercase text-[10px] font-bold tracking-wider">Vendor Name</TableHead>
                <TableHead className="text-slate-500 uppercase text-[10px] font-bold tracking-wider">Contact Person</TableHead>
                <TableHead className="text-slate-500 uppercase text-[10px] font-bold tracking-wider">Contact Details</TableHead>
                <TableHead className="text-right pr-6 text-slate-500 uppercase text-[10px] font-bold tracking-wider">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSuppliers.map((supplier) => (
                <TableRow key={supplier.id} className="border-slate-100 hover:bg-slate-50/50 transition-colors group">
                  <TableCell className="pl-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900">{supplier.name}</span>
                      <span className="text-[11px] text-primary font-medium tracking-tight hover:underline cursor-pointer">{supplier.id}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-primary text-[10px] font-bold">
                        {supplier.contact.charAt(0)}
                      </div>
                      <span className="text-sm font-semibold text-slate-700">{supplier.contact}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Mail className="h-3.5 w-3.5 text-slate-400" /> {supplier.email}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Phone className="h-3.5 w-3.5 text-slate-400" /> {supplier.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleAction(supplier.name, "View Office Location")}>
                        <Building2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleAction(supplier.name, "Open External Portal")}>
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </main>
    </div>
  );
}
