import React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { useLayoutStore } from "@/store/useLayoutStore";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

export function AppLayout() {
  const { sidebarCollapsed } = useLayoutStore();

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans dark:bg-background transition-colors duration-300">
      <Sidebar />
      
      <motion.main
        initial={false}
        animate={{ 
          marginLeft: sidebarCollapsed ? "80px" : "256px" 
        }}
        className={cn(
          "flex-1 flex flex-col min-w-0 bg-slate-50 transition-all duration-300 ease-in-out dark:bg-background",
          sidebarCollapsed ? "ml-20" : "ml-64"
        )}
      >
        <Topbar />
        
        <div className="p-4 md:p-6 lg:p-8 flex-1 overflow-y-auto">
          <div className="max-w-[1600px] mx-auto w-full space-y-6">
            <Outlet />
          </div>
        </div>
      </motion.main>
    </div>
  );
}
