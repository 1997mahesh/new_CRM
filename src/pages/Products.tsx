import React from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  Package, 
  Box, 
  Layers, 
  AlertTriangle,
  History,
  Tag,
  Barcode,
  MoreVertical,
  Minus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

const PRODUCTS = [
  { id: "PRD-001", name: "MacBook Pro M3", category: "Laptops", sku: "MAC-M3-14", stock: 15, minStock: 5, price: 1999, status: "In Stock" },
  { id: "PRD-002", name: "Dell UltraSharp 27", category: "Monitors", sku: "DELL-U27", stock: 8, minStock: 10, price: 450, status: "Low Stock" },
  { id: "PRD-003", name: "Logitech MX Master 3S", category: "Peripherals", sku: "LOGI-MX3", stock: 45, minStock: 15, price: 99, status: "In Stock" },
  { id: "PRD-004", name: "Cisco Catalyst Switch", category: "Networking", sku: "CIS-CAT-24", stock: 0, minStock: 2, price: 850, status: "Out of Stock" },
  { id: "PRD-005", name: "HP LaserJet Pro", category: "Printers", sku: "HP-LJ-P", stock: 4, minStock: 5, price: 299, status: "Low Stock" },
];

export function ProductsPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Inventory Products</h1>
          <p className="text-sm text-slate-500">Manage your product catalog, pricing, and stock levels.</p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl border-slate-200">
            <History className="h-4 w-4 mr-2" /> History
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/20">
            <Plus className="h-4 w-4 mr-2" /> New Product
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-none shadow-soft">
           <CardContent className="p-4 flex items-center gap-4">
             <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
               <Package className="h-6 w-6" />
             </div>
             <div>
               <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Total items</p>
               <h4 className="text-xl font-bold text-slate-800">1,280</h4>
             </div>
           </CardContent>
        </Card>
        <Card className="border-none shadow-soft">
           <CardContent className="p-4 flex items-center gap-4">
             <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
               <Box className="h-6 w-6" />
             </div>
             <div>
               <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">In Stock</p>
               <h4 className="text-xl font-bold text-slate-800">1,150</h4>
             </div>
           </CardContent>
        </Card>
        <Card className="border-none shadow-soft">
           <CardContent className="p-4 flex items-center gap-4">
             <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
               <AlertTriangle className="h-6 w-6" />
             </div>
             <div>
               <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Low Stock</p>
               <h4 className="text-xl font-bold text-slate-800">8</h4>
             </div>
           </CardContent>
        </Card>
        <Card className="border-none shadow-soft">
           <CardContent className="p-4 flex items-center gap-4">
             <div className="h-10 w-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
               <Minus className="h-6 w-6" />
             </div>
             <div>
               <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Out of Stock</p>
               <h4 className="text-xl font-bold text-slate-800">2</h4>
             </div>
           </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-2xl shadow-soft border border-slate-100">
        <div className="relative flex-1 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <Input placeholder="Search by product name, SKU, or category..." className="pl-10 h-10 border-none bg-slate-50 rounded-lg focus-visible:ring-2 focus-visible:ring-blue-500/20" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="rounded-lg border-slate-200">
            <Filter className="h-4 w-4 mr-2" /> Filter
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-soft border border-slate-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-slate-100">
              <TableHead className="py-4 px-6 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Product</TableHead>
              <TableHead className="py-4 px-6 font-bold text-slate-500 uppercase tracking-widest text-[10px]">SKU / Barcode</TableHead>
              <TableHead className="py-4 px-6 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Category</TableHead>
              <TableHead className="py-4 px-6 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Stock Level</TableHead>
              <TableHead className="py-4 px-6 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Price</TableHead>
              <TableHead className="py-4 px-6 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Status</TableHead>
              <TableHead className="py-4 px-6 text-right font-bold text-slate-500 uppercase tracking-widest text-[10px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {PRODUCTS.map((product) => (
              <TableRow key={product.id} className="group hover:bg-slate-50/50 transition-colors border-slate-100">
                <TableCell className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                       <Package className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">{product.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{product.id}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4 px-6">
                   <div className="flex items-center gap-2 text-slate-500">
                     <Barcode className="h-3 w-3" />
                     <span className="text-xs font-mono">{product.sku}</span>
                   </div>
                </TableCell>
                <TableCell className="py-4 px-6">
                   <Badge variant="secondary" className="bg-slate-100 text-slate-600 text-[10px] border-none">
                     {product.category}
                   </Badge>
                </TableCell>
                <TableCell className="py-4 px-6">
                   <div className="space-y-1">
                     <div className="flex justify-between items-center w-24">
                       <span className="text-xs font-bold text-slate-700">{product.stock}</span>
                       <span className="text-[10px] text-slate-400">/ {product.minStock}</span>
                     </div>
                     <div className="w-24 h-1 bg-slate-100 rounded-full overflow-hidden">
                       <div 
                         className={cn(
                           "h-full transition-all duration-500",
                           product.stock <= product.minStock ? "bg-red-500" : "bg-emerald-500"
                         )} 
                         style={{ width: `${Math.min((product.stock / (product.minStock * 2)) * 100, 100)}%` }}
                       />
                     </div>
                   </div>
                </TableCell>
                <TableCell className="py-4 px-6 font-bold text-slate-800 text-sm">
                  ${product.price.toLocaleString()}
                </TableCell>
                <TableCell className="py-4 px-6">
                   <Badge className={cn(
                     "rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase border-none",
                     product.status === "In Stock" ? "bg-emerald-50 text-emerald-600" : 
                     product.status === "Low Stock" ? "bg-amber-50 text-amber-600" : 
                     "bg-rose-50 text-rose-600"
                   )}>
                     {product.status}
                   </Badge>
                </TableCell>
                <TableCell className="py-4 px-6 text-right">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";
