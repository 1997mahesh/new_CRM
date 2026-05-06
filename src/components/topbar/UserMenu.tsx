import React from "react";
import { useTranslation } from "react-i18next";
import { 
  User, 
  Settings, 
  HelpCircle, 
  LogOut, 
  UserCircle 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function UserMenu() {
  const { t } = useTranslation();

  const user = {
    name: "Admin User",
    email: "admin@tpdcrm.io",
    role: "Super Admin",
    avatar: ""
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="p-1 hover:bg-slate-50 dark:hover:bg-white/5 rounded-full flex items-center gap-2 pr-3 transition-colors h-10">
          <Avatar className="h-8 w-8 border border-white shadow-sm ring-2 ring-slate-100 dark:ring-white/5 ring-offset-0 transition-shadow group-hover:ring-blue-100 dark:group-hover:ring-blue-900">
            <AvatarImage src={user.avatar} />
            <AvatarFallback className="bg-blue-600 text-white text-xs font-bold uppercase transition-colors">A</AvatarFallback>
          </Avatar>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-none truncate w-24">Admin</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium leading-none mt-1 uppercase tracking-tighter">Super Admin</p>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 p-1 rounded-2xl shadow-2xl border-slate-100 dark:border-white/5 dark:bg-[#211c1f]">
        <div className="p-4 bg-slate-50/50 dark:bg-white/5 rounded-lg m-1 mb-2 border border-slate-100/50 dark:border-white/5">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-white dark:border-white/10 shadow-sm">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="bg-blue-600 text-white text-sm font-bold">A</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{user.name}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
            </div>
          </div>
        </div>
        
        <DropdownMenuSeparator className="mx-1 bg-slate-100 dark:bg-white/5" />
        
        <div className="p-1">
          <DropdownMenuItem className="rounded-lg py-2.5 cursor-pointer font-medium mb-1 dark:text-slate-300 dark:focus:bg-white/5">
            <UserCircle className="mr-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
            <span>{t("edit_profile")}</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="rounded-lg py-2.5 cursor-pointer font-medium mb-1 dark:text-slate-300 dark:focus:bg-white/5">
            <Settings className="mr-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
            <span>{t("settings")}</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="rounded-lg py-2.5 cursor-pointer font-medium dark:text-slate-300 dark:focus:bg-white/5">
            <HelpCircle className="mr-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
            <span>{t("support_help")}</span>
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator className="mx-1 bg-slate-100 dark:bg-white/5" />
        
        <div className="p-1">
          <DropdownMenuItem className="rounded-lg py-2.5 cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-50 dark:focus:bg-red-500/10 font-bold">
            <LogOut className="mr-3 h-4 w-4" />
            <span className="flex-1">{t("sign_out")}</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
