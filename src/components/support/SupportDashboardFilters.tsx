import React from "react";
import { 
  Calendar, 
  Activity, 
  ShieldAlert, 
  Building2, 
  RotateCcw,
  RefreshCcw 
} from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SupportDashboardFiltersProps {
  filters: {
    dateRange: string;
    status: string;
    priority: string;
    department: string;
  };
  setFilters: (filters: any) => void;
  onRefresh: () => void;
  loading?: boolean;
}

export function SupportDashboardFilters({ 
  filters, 
  setFilters, 
  onRefresh, 
  loading 
}: SupportDashboardFiltersProps) {
  const [categories, setCategories] = React.useState<any[]>([]);

  React.useEffect(() => {
    const saved = localStorage.getItem("support_categories");
    let activeCategories: any[] = [];

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          activeCategories = parsed.filter((c: any) => c.active);
        }
      } catch (e) {
        console.error("Failed to parse categories", e);
      }
    }

    // Fallback if empty
    if (activeCategories.length === 0) {
      activeCategories = [
        { id: "cat_1", name: "Technical Support", active: true },
        { id: "cat_2", name: "Billing & Finance", active: true },
      ];
    }
    
    setCategories(activeCategories);
  }, []);

  return (
    <Card className="support-dashboard-filterbar flex flex-row items-center justify-center gap-7 flex-nowrap w-full border-slate-100 dark:border-white/5 bg-white dark:bg-[#1f1a1d] p-3 shadow-soft rounded-2xl overflow-x-auto no-scrollbar font-jakarta italic pb-1 xl:pb-3">
          {/* Date Filter */}
          <Select 
            value={filters.dateRange} 
            onValueChange={(val) => setFilters({...filters, dateRange: val})}
          >
            <SelectTrigger className="dashboard-filter-trigger h-[42px] w-[140px] shrink-0 rounded-xl border-slate-200 bg-white dark:bg-white/5 dark:border-white/10 italic text-sm font-medium tracking-normal gap-2 px-4 shadow-sm hover:border-blue-400 transition-colors">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              <SelectValue placeholder="Date" />
            </SelectTrigger>
            <SelectContent className="rounded-xl italic">
              <SelectItem value="" className="font-bold underline decoration-blue-500/20 italic">Date</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
              <SelectItem value="this_month">This Month</SelectItem>
              <SelectItem value="this_year">This Year</SelectItem>
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select 
            value={filters.status} 
            onValueChange={(val) => setFilters({...filters, status: val})}
          >
            <SelectTrigger className="dashboard-filter-trigger h-[42px] w-[140px] shrink-0 rounded-xl border-slate-200 bg-white dark:bg-white/5 dark:border-white/10 italic text-sm font-medium tracking-normal gap-2 px-4 shadow-sm hover:border-blue-400 transition-colors">
              <Activity className="h-3.5 w-3.5 text-slate-400" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl italic">
              <SelectItem value="" className="font-bold underline decoration-blue-500/20 italic">Status</SelectItem>
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Solved">Resolved</SelectItem>
              <SelectItem value="Closed">Closed</SelectItem>
            </SelectContent>
          </Select>

          {/* Priority Filter */}
          <Select 
            value={filters.priority} 
            onValueChange={(val) => setFilters({...filters, priority: val})}
          >
            <SelectTrigger className="dashboard-filter-trigger h-[42px] w-[140px] shrink-0 rounded-xl border-slate-200 bg-white dark:bg-white/5 dark:border-white/10 italic text-sm font-medium tracking-normal gap-2 px-4 shadow-sm hover:border-blue-400 transition-colors">
              <ShieldAlert className="h-3.5 w-3.5 text-slate-400" />
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent className="rounded-xl italic">
              <SelectItem value="" className="font-bold underline decoration-blue-500/20 italic">Priority</SelectItem>
              <SelectItem value="Critical" className="text-red-600 font-bold">Critical</SelectItem>
              <SelectItem value="High" className="text-orange-500 font-bold High">High</SelectItem>
              <SelectItem value="Medium" className="text-blue-500 font-bold">Medium</SelectItem>
              <SelectItem value="Low" className="text-slate-500 font-bold">Low</SelectItem>
            </SelectContent>
          </Select>

          {/* Department Filter */}
          <Select 
            value={filters.department} 
            onValueChange={(val) => setFilters({...filters, department: val})}
          >
            <SelectTrigger className="dashboard-filter-trigger h-[42px] w-[160px] shrink-0 rounded-xl border-slate-200 bg-white dark:bg-white/5 dark:border-white/10 italic text-sm font-medium tracking-normal gap-2 px-4 shadow-sm hover:border-blue-400 transition-colors">
              <Building2 className="h-3.5 w-3.5 text-slate-400" />
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent className="rounded-xl italic">
              <SelectItem value="" className="font-bold underline decoration-blue-500/20 italic">Department</SelectItem>
              {categories.map(c => (
                <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Reset Button */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setFilters({
              dateRange: "",
              status: "",
              priority: "",
              department: ""
            })} 
            className="dashboard-reset-btn h-[42px] shrink-0 rounded-xl text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-600/10 border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 transition-all text-sm font-medium tracking-normal gap-2 flex items-center px-5 shadow-sm active:scale-95"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline italic">Reset</span>
          </Button>

          {/* Refresh Button */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRefresh} 
            className="dashboard-refresh-btn h-[42px] shrink-0 rounded-xl text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-600/10 border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 transition-all text-sm font-medium tracking-normal gap-2 flex items-center px-6 shadow-sm active:scale-95"
          >
            <RefreshCcw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
            <span className="hidden sm:inline italic">Refresh</span>
          </Button>
    </Card>
  );
}
