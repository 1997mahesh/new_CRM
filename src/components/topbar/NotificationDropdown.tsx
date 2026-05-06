import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

// Mock data
const notificationsData = [
  { id: 1, title: "New lead assigned", time: "2 min ago", type: "lead" },
  { id: 2, title: "Invoice overdue", time: "1 hour ago", type: "invoice" },
  { id: 3, title: "System maintenance at 12 PM", time: "4 hours ago", type: "system" },
];

export function NotificationDropdown() {
  const { t } = useTranslation();
  const [notifications] = useState(notificationsData);

  try {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 text-slate-500 rounded-full h-10 w-10 transition-colors"
          >
            <Bell className="h-5 w-5" />
            {Array.isArray(notifications) && notifications.length > 0 && (
              <Badge className="absolute top-1 right-1 h-4 w-4 p-0 flex items-center justify-center bg-blue-600 border-2 border-white dark:border-[#211c1f] text-[10px] shadow-sm animate-pulse rounded-full pointer-events-none">
                {notifications.length}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80 p-1 rounded-2xl shadow-2xl border-slate-100 dark:border-white/5 dark:bg-[#211c1f]">
          <DropdownMenuGroup>
            <DropdownMenuLabel className="px-4 py-3 flex items-center justify-between">
              <span className="font-bold text-slate-800 dark:text-slate-100">{t("notifications")}</span>
              {Array.isArray(notifications) && notifications.length > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 rounded-full text-[9px]">
                  {notifications.length} NEW
                </span>
              )}
            </DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuSeparator className="mx-1 bg-slate-100 dark:bg-white/5" />
          <div className="max-h-[300px] overflow-y-auto py-1">
            {Array.isArray(notifications) && notifications.length > 0 ? (
              notifications.map((n) => (
                <DropdownMenuItem key={n.id} className="px-4 py-3 cursor-pointer hover:bg-slate-50 dark:focus:bg-white/5 rounded-lg transition-colors m-1">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{n.title}</p>
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{n.time}</p>
                  </div>
                </DropdownMenuItem>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-slate-400">
                <p className="text-sm">{t("no_notifications")}</p>
              </div>
            )}
          </div>
          <DropdownMenuSeparator className="mx-1 bg-slate-100 dark:bg-white/5" />
          <div className="p-2">
            <Button variant="ghost" className="w-full text-xs font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-600/10 rounded-lg py-2">
              {t("view_all")}
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  } catch (error) {
    console.error("NotificationDropdown Error:", error);
    return (
      <Button variant="ghost" size="icon" className="text-slate-500 rounded-full h-10 w-10">
        <Bell className="h-5 w-5" />
      </Button>
    );
  }
}
