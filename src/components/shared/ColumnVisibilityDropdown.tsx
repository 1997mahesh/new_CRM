import React, { useState, useEffect } from "react";
import { Columns, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

interface Column {
  key: string;
  label: string;
}

interface ColumnVisibilityDropdownProps {
  columns: Column[];
  visibleColumns: Record<string, boolean>;
  onChange: (visibleColumns: Record<string, boolean>) => void;
  persistenceKey: string;
}

export function ColumnVisibilityDropdown({
  columns,
  visibleColumns,
  onChange,
  persistenceKey,
}: ColumnVisibilityDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Initialize from localStorage if exists
  useEffect(() => {
    const saved = localStorage.getItem(persistenceKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure we don't overwrite with invalid keys if columns changed
        const filtered = { ...visibleColumns };
        let hasChanges = false;
        
        Object.keys(parsed).forEach(key => {
          if (columns.some(col => col.key === key)) {
            filtered[key] = !!parsed[key];
            if (filtered[key] !== visibleColumns[key]) {
              hasChanges = true;
            }
          }
        });

        if (hasChanges) {
          onChange(filtered);
        }
      } catch (e) {
        console.error("Failed to parse column visibility", e);
      }
    }
  }, []);

  const toggleColumn = (key: string) => {
    const next = { ...visibleColumns, [key]: !visibleColumns[key] };
    onChange(next);
    localStorage.setItem(persistenceKey, JSON.stringify(next));
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "h-11 w-11 rounded-xl border-slate-200 dark:border-white/5 bg-white dark:bg-[#1f1a1d] transition-all duration-200",
            isOpen && "ring-2 ring-blue-500/20 border-blue-500/50 shadow-blue-500/10"
          )}
        >
          <Columns className={cn("h-4 w-4 transition-colors", isOpen ? "text-blue-500" : "text-slate-400")} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-64 rounded-2xl dark:bg-[#1f1a1d] dark:border-white/10 p-3 shadow-2xl border-slate-200 animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="px-2 py-2 flex items-center justify-between">
          <span className="text-[10px] uppercase font-black tracking-[0.2em] text-blue-600 dark:text-blue-400">
            Toggle Columns
          </span>
          <Columns className="h-3 w-3 text-slate-300" />
        </div>
        
        <DropdownMenuSeparator className="my-2 bg-slate-100 dark:bg-white/5" />
        
        <div className="space-y-1 max-h-[350px] overflow-y-auto pr-1 custom-scrollbar">
          {columns.map((column) => (
            <button
              key={column.key}
              onClick={() => toggleColumn(column.key)}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all group relative overflow-hidden",
                visibleColumns[column.key]
                  ? "text-slate-900 dark:text-slate-100 bg-blue-50/50 dark:bg-blue-600/5"
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5"
              )}
            >
              <span className="relative z-10">{column.label}</span>
              
              <div className={cn(
                "h-5 w-5 rounded-lg flex items-center justify-center transition-all border",
                visibleColumns[column.key]
                  ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20 scale-100"
                  : "bg-transparent border-slate-200 dark:border-white/10 text-transparent scale-90"
              )}>
                <Check className="h-3 w-3 stroke-[3px]" />
              </div>

              {/* Hover highlight effect */}
              {visibleColumns[column.key] && (
                <motion.div 
                  layoutId="active-pill"
                  className="absolute left-0 w-1 h-4 bg-blue-600 rounded-r-full"
                />
              )}
            </button>
          ))}
        </div>

        <DropdownMenuSeparator className="my-2 bg-slate-100 dark:bg-white/5" />
        
        <div className="px-2 py-1 text-[9px] text-slate-400 italic">
          Changes are saved automatically to your preferences.
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
