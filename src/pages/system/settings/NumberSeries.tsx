import React from "react";
import { 
  Hash, 
  Search, 
  MoreVertical, 
  RefreshCcw, 
  Edit2, 
  Trash2, 
  Layers, 
  Settings,
  Columns,
  PlayCircle
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
import { cn } from "@/lib/utils";

const NUMBER_SERIES = [
  { module: "Expense", prefix: "EXP-", suffix: "", padding: 4, next: 1, preview: "EXP-0001" },
  { module: "Invoice", prefix: "INV-", suffix: "", padding: 4, next: 13, preview: "INV-0013" },
  { module: "Purchase Order", prefix: "PO-", suffix: "", padding: 3, next: 3, preview: "PO-003" },
  { module: "Quotation", prefix: "QT-", suffix: "", padding: 4, next: 1, preview: "QT-0001" },
  { module: "Sales Order", prefix: "SO-", suffix: "", padding: 4, next: 1, preview: "SO-0001" },
  { module: "Ticket", prefix: "TK-", suffix: "", padding: 5, next: 101, preview: "TK-00101" },
  { module: "Vendor Bill", prefix: "BILL-", suffix: "", padding: 3, next: 1, preview: "BILL-001" },
];

export default function NumberSeriesPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Number Series</h1>
          <p className="text-sm text-slate-500 font-medium italic">Configure automated sequencing patterns for various system documents.</p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl border-slate-200">
            <Columns className="h-4 w-4 mr-2" /> Columns
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-soft border border-slate-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-slate-100">
              <TableHead className="py-4 px-6 text-[10px] uppercase font-bold tracking-widest text-slate-400">Module</TableHead>
              <TableHead className="py-4 px-6 text-[10px] uppercase font-bold tracking-widest text-slate-400">Prefix</TableHead>
              <TableHead className="py-4 px-6 text-[10px] uppercase font-bold tracking-widest text-slate-400">Suffix</TableHead>
              <TableHead className="py-4 px-6 text-[10px] uppercase font-bold tracking-widest text-slate-400">Padding</TableHead>
              <TableHead className="py-4 px-6 text-[10px] uppercase font-bold tracking-widest text-slate-400">Next</TableHead>
              <TableHead className="py-4 px-6 text-[10px] uppercase font-bold tracking-widest text-slate-400">Preview</TableHead>
              <TableHead className="py-4 px-6 text-right text-[10px] uppercase font-bold tracking-widest text-slate-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {NUMBER_SERIES.map((item) => (
              <TableRow key={item.module} className="group hover:bg-slate-50/50 transition-colors border-slate-100">
                <TableCell className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center">
                       <Layers className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-bold text-slate-800">{item.module}</span>
                  </div>
                </TableCell>
                <TableCell className="py-4 px-6">
                   <Badge variant="outline" className="bg-slate-50 text-slate-400 border-none font-mono text-[10px] font-bold uppercase">{item.prefix || "-"}</Badge>
                </TableCell>
                <TableCell className="py-4 px-6 text-xs text-slate-400 italic">
                  {item.suffix || "None"}
                </TableCell>
                <TableCell className="py-4 px-6 text-sm font-medium text-slate-600">
                  {item.padding}
                </TableCell>
                <TableCell className="py-4 px-6 font-bold text-sm text-slate-800">
                  {item.next}
                </TableCell>
                <TableCell className="py-4 px-6">
                  <Badge className="bg-blue-600 text-white border-none rounded-lg font-mono text-[11px] px-2 py-0.5 shadow-sm">
                    {item.preview}
                  </Badge>
                </TableCell>
                <TableCell className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50" title="Manual Reset">
                      <RefreshCcw className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600 hover:bg-slate-100">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
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
