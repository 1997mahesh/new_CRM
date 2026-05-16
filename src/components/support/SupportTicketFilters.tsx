import React from "react";
import { 
  Search as SearchIcon, 
  Columns as ColumnsIcon, 
  Calendar, 
  RefreshCcw 
} from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuCheckboxItem, 
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SupportTicketFiltersProps {
  search: string;
  status: string;
  priority: string;
  category: string;
  assignedUserId: string;
  dateRange: string;
  users: any[];
  COLUMN_CONFIG: any[];
  visibleColumns: string[];
  toggleColumn: (colId: string) => void;
  updateFilter: (key: string, value: string) => void;
  onRefresh: () => void;
  loading?: boolean;
}

export function SupportTicketFilters({
  search,
  status,
  priority,
  category,
  assignedUserId,
  dateRange,
  users,
  COLUMN_CONFIG,
  visibleColumns,
  toggleColumn,
  updateFilter,
  onRefresh,
  loading
}: SupportTicketFiltersProps) {
  const isVisible = (id: string) => visibleColumns.includes(id);
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

    // Fallback to minimal seed if empty
    if (activeCategories.length === 0) {
      activeCategories = [
        { id: "cat_1", name: "Technical Support", active: true },
        { id: "cat_2", name: "Billing & Finance", active: true },
      ];
    }
    
    setCategories(activeCategories);
  }, []);

  return (
    <Card className="support-ticket-filterbar border-slate-100 dark:border-white/5 bg-white dark:bg-[#1f1a1d] p-3 shadow-soft rounded-2xl overflow-hidden font-jakarta italic">
      <div className="flex items-center justify-between gap-3 w-full px-1">
        <div className="flex-1 min-w-0 flex items-center gap-2.5 overflow-x-auto no-scrollbar flex-nowrap pb-1 xl:pb-0">
          {/* Search */}
          <div className="w-[320px] shrink-0 relative group">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <Input 
              placeholder="Search Tickets..." 
              value={search}
              onChange={(e) => updateFilter("search", e.target.value)}
              className="ticket-filter-input pl-11 h-[42px] border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 rounded-xl font-bold italic text-xs shadow-sm hover:border-blue-400 transition-colors w-full" 
            />
          </div>

          {/* Columns */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ticket-filter-btn h-[42px] min-w-[120px] shrink-0 rounded-xl border-slate-200 bg-white dark:bg-white/5 dark:border-white/10 italic text-sm font-medium tracking-normal gap-2 px-4 shadow-sm hover:border-blue-400 transition-colors">
                <ColumnsIcon className="h-3.5 w-3.5 text-blue-600" />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 rounded-xl italic p-2 dark:bg-[#1f1a1d] dark:border-white/10">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 p-2 italic">Visible Columns</DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="bg-slate-50 dark:bg-white/5" />
              {COLUMN_CONFIG.map(col => (
                <DropdownMenuCheckboxItem
                  key={col.id}
                  checked={isVisible(col.id)}
                  onCheckedChange={() => toggleColumn(col.id)}
                  className="text-xs font-bold italic rounded-lg focus:bg-slate-50 dark:focus:bg-white/5"
                >
                  {col.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Status */}
          <Select value={status} onValueChange={(val) => updateFilter("status", val)}>
            <SelectTrigger className="ticket-filter-trigger h-[42px] min-w-[135px] shrink-0 rounded-xl border-slate-200 bg-white dark:bg-white/5 dark:border-white/10 italic text-sm font-medium tracking-normal gap-2 px-4 shadow-sm hover:border-blue-400 transition-colors">
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

          {/* Priority */}
          <Select value={priority} onValueChange={(val) => updateFilter("priority", val)}>
            <SelectTrigger className="ticket-filter-trigger h-[42px] min-w-[135px] shrink-0 rounded-xl border-slate-200 bg-white dark:bg-white/5 dark:border-white/10 italic text-sm font-medium tracking-normal gap-2 px-4 shadow-sm hover:border-blue-400 transition-colors">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent className="rounded-xl italic">
              <SelectItem value="" className="font-bold underline decoration-blue-500/20 italic">Priority</SelectItem>
              <SelectItem value="Critical" className="text-red-600 font-bold italic">Critical</SelectItem>
              <SelectItem value="High" className="text-orange-500 font-bold italic">High</SelectItem>
              <SelectItem value="Medium" className="text-blue-500 font-bold italic">Medium</SelectItem>
              <SelectItem value="Low" className="text-slate-500 font-bold italic">Low</SelectItem>
            </SelectContent>
          </Select>

          {/* Category */}
          <Select value={category} onValueChange={(val) => updateFilter("category", val)}>
            <SelectTrigger className="ticket-filter-trigger h-[42px] min-w-[150px] shrink-0 rounded-xl border-slate-200 bg-white dark:bg-white/5 dark:border-white/10 italic text-sm font-medium tracking-normal gap-2 px-4 shadow-sm hover:border-blue-400 transition-colors text-left">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="rounded-xl italic">
              <SelectItem value="" className="font-bold underline decoration-blue-500/20 italic">Category</SelectItem>
              {categories.map(c => (
                <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Agent */}
          <Select value={assignedUserId} onValueChange={(val) => updateFilter("assignedUserId", val)}>
            <SelectTrigger className="ticket-filter-trigger h-[42px] min-w-[135px] shrink-0 rounded-xl border-slate-200 bg-white dark:bg-white/5 dark:border-white/10 italic text-sm font-medium tracking-normal gap-2 px-4 shadow-sm hover:border-blue-400 transition-colors">
              <SelectValue placeholder="Agent" />
            </SelectTrigger>
            <SelectContent className="rounded-xl italic">
              <SelectItem value="" className="font-bold underline decoration-blue-500/20 italic">Agent</SelectItem>
              <SelectItem value="unassigned" className="italic text-slate-400 font-bold italic">Unassigned</SelectItem>
              {users.map(u => (
                <SelectItem key={u.id} value={u.id} className="italic">{u.firstName} {u.lastName}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Date */}
          <Select value={dateRange} onValueChange={(val) => updateFilter("dateRange", val)}>
            <SelectTrigger className="ticket-filter-trigger h-[42px] min-w-[135px] shrink-0 rounded-xl border-slate-200 bg-white dark:bg-white/5 dark:border-white/10 italic text-sm font-medium tracking-normal gap-2 px-4 shadow-sm hover:border-blue-400 transition-colors">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              <SelectValue placeholder="Date" />
            </SelectTrigger>
            <SelectContent className="rounded-xl italic">
              <SelectItem value="" className="font-bold underline decoration-blue-500/20 italic">Date</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="week">Past 7 Days</SelectItem>
              <SelectItem value="month">Past 30 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Refresh */}
        <Button 
          variant="outline" 
          onClick={onRefresh}
          className="ticket-refresh-btn h-[42px] shrink-0 rounded-xl text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-600/10 border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 transition-all text-sm font-medium tracking-normal gap-2 flex items-center px-4 shadow-sm ml-auto active:scale-95"
        >
          <RefreshCcw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
          <span className="hidden sm:inline italic px-1">Refresh</span>
        </Button>
      </div>
    </Card>
  );
}
