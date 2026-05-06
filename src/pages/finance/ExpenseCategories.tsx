import React from "react";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Cloud, 
  Megaphone, 
  Briefcase, 
  Users, 
  Globe, 
  Plane,
  MoreVertical,
  Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { id: 1, name: "Cloud Infrastructure", color: "#3b82f6", icon: Cloud, count: 12, status: "Active" },
  { id: 2, name: "Marketing", color: "#f43f5e", icon: Megaphone, count: 8, status: "Active" },
  { id: 3, name: "Office Supplies", color: "#f59e0b", icon: Briefcase, count: 24, status: "Active" },
  { id: 4, name: "Salaries & Payroll", color: "#6366f1", icon: Users, count: 4, status: "Active" },
  { id: 5, name: "Software Subscriptions", color: "#10b981", icon: Globe, count: 15, status: "Active" },
  { id: 6, name: "Travel & Lodging", color: "#8b5cf6", icon: Plane, count: 10, status: "Active" },
];

export default function ExpenseCategoriesPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Expense Categories</h1>
          <p className="text-sm text-slate-500 font-medium italic">Manage and organize your business expense types.</p>
        </div>

        <div className="flex items-center gap-3">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/20">
            <Plus className="h-4 w-4 mr-2" /> Add Category
          </Button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORIES.map((category) => (
          <Card key={category.id} className="border-none shadow-soft hover:shadow-lg transition-all duration-300 group overflow-hidden">
            <div className="h-1.5 w-full" style={{ backgroundColor: category.color }} />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-slate-50 text-slate-400 group-hover:bg-opacity-80 group-hover:scale-110 transition-all duration-300">
                   <category.icon className="h-5 w-5" style={{ color: category.color }} />
                </div>
                <div>
                   <CardTitle className="text-base font-bold text-slate-800">{category.name}</CardTitle>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{category.count} Items linked</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Badge className="bg-emerald-50 text-emerald-600 border-none rounded-full px-2 py-0 text-[10px] font-bold uppercase">
                    {category.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-2 pb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <div className="h-2 w-2 rounded-full" style={{ backgroundColor: category.color }} />
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Hex: {category.color}</span>
                </div>
                <div className="flex items-center gap-2">
                   <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:bg-blue-50 hover:text-blue-600 rounded-lg">
                      <Edit2 className="h-4 w-4" />
                   </Button>
                   <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:bg-rose-50 hover:text-rose-600 rounded-lg">
                      <Trash2 className="h-4 w-4" />
                   </Button>
                </div>
            </CardContent>
          </Card>
        ))}
        
        {/* Add New Card */}
        <button className="border-2 border-dashed border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center gap-4 text-slate-400 hover:border-blue-300 hover:text-blue-500 transition-all duration-300 group bg-transparent">
           <div className="h-12 w-12 rounded-full border-2 border-dashed border-slate-200 flex items-center justify-center group-hover:border-blue-300 group-hover:rotate-90 transition-all duration-500">
              <Plus className="h-6 w-6" />
           </div>
           <p className="font-bold text-sm">Create New Category</p>
        </button>
      </div>
    </div>
  );
}
