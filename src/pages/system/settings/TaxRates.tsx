import React from "react";
import { 
  Plus, 
  Percent, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  BadgeCheck,
  Search,
  FileText
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const TAX_RATES = [
  { id: 1, name: "GST 18%", rate: 18.0, description: "Goods & Services Tax (Standard)", status: "Active", isDefault: true },
  { id: 2, name: "GST 10%", rate: 10.0, description: "Reduced Rate for services", status: "Active", isDefault: false },
  { id: 3, name: "GST 5%", rate: 5.0, description: "Essential commodities", status: "Active", isDefault: false },
  { id: 4, name: "No Tax", rate: 0.0, description: "Zero-rated transactions", status: "Active", isDefault: false },
  { id: 5, name: "VAT 20%", rate: 20.0, description: "Value Added Tax (International)", status: "Active", isDefault: false },
];

export default function TaxRatesPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Tax Rates</h1>
          <p className="text-sm text-slate-500 font-medium italic">Configure tax types and percentage rates used in billing.</p>
        </div>

        <div className="flex items-center gap-3">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/20">
            <Plus className="h-4 w-4 mr-2" /> Add Tax Rate
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-soft border border-slate-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-slate-100">
              <TableHead className="py-4 px-6 text-[10px] uppercase font-bold tracking-widest text-slate-400">Name</TableHead>
              <TableHead className="py-4 px-6 text-[10px] uppercase font-bold tracking-widest text-slate-400">Rate %</TableHead>
              <TableHead className="py-4 px-6 text-[10px] uppercase font-bold tracking-widest text-slate-400">Description</TableHead>
              <TableHead className="py-4 px-6 text-[10px] uppercase font-bold tracking-widest text-slate-400">Status</TableHead>
              <TableHead className="py-4 px-6 text-right text-[10px] uppercase font-bold tracking-widest text-slate-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {TAX_RATES.map((tax) => (
              <TableRow key={tax.id} className="group hover:bg-slate-50/50 transition-colors border-slate-100">
                <TableCell className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-800">{tax.name}</span>
                    {tax.isDefault && (
                        <Badge className="bg-indigo-600 text-white border-none rounded-full px-1.5 py-0 text-[8px] font-bold uppercase">Default</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="py-4 px-6">
                  <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-none font-black text-xs px-2.5 py-1 rounded-lg">
                    {tax.rate.toFixed(1)}%
                  </Badge>
                </TableCell>
                <TableCell className="py-4 px-6 text-xs text-slate-500 font-medium">
                  {tax.description}
                </TableCell>
                <TableCell className="py-4 px-6">
                   <Badge className="bg-emerald-50 text-emerald-600 border-none rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase">
                      {tax.status}
                   </Badge>
                </TableCell>
                <TableCell className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50" title="Set Default">
                      <BadgeCheck className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600 hover:bg-slate-100">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-32 rounded-xl">
                        <DropdownMenuItem className="text-rose-600 py-2">Delete Tax</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
