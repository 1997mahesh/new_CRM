import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "./topbar/LanguageSwitcher";
import { ThemeToggle } from "./topbar/ThemeToggle";
import { NotificationDropdown } from "./topbar/NotificationDropdown";
import { UserMenu } from "./topbar/UserMenu";

export function Topbar() {
  const { t } = useTranslation();

  return (
    <header className="h-16 flex items-center justify-between px-8 bg-white border-b border-slate-200 sticky top-0 z-40 dark:bg-gradient-to-r dark:from-[#181416] dark:to-[#141112] dark:border-border transition-colors duration-300">
      {/* Search Bar */}
      <div className="flex flex-1 items-center">
        <div className="relative w-72 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <Input 
            placeholder={t("search")} 
            className="block w-full pl-10 pr-20 py-2 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all dark:bg-[#1f1a1d] dark:border-border dark:text-slate-200 dark:placeholder:text-slate-500"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1">
            <kbd className="pointer-events-none h-5 select-none items-center gap-1 rounded border border-slate-200 bg-white px-1.5 font-mono text-[10px] font-medium text-slate-400 opacity-100 dark:bg-[#1f1a1d] dark:border-white/10 dark:text-slate-500">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-1 sm:gap-2">
        <LanguageSwitcher />
        
        <ThemeToggle />

        <NotificationDropdown />

        <div className="w-px h-6 bg-slate-100 mx-2 dark:bg-border" />

        <UserMenu />
      </div>
    </header>
  );
}
