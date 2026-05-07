import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  ChevronDown, 
  ChevronRight, 
  LogOut, 
  Menu, 
  Search, 
  PanelLeftClose, 
  PanelLeftOpen 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SIDEBAR_MENU } from "@/constants";
import { useLayoutStore } from "@/store/useLayoutStore";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

import { useTranslation } from "react-i18next";

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useLayoutStore();
  const location = useLocation();
  const { t } = useTranslation();

  // Find which section should be open initially based on current path
  const initialSection = React.useMemo(() => {
    const saved = localStorage.getItem("sidebar_expanded_section");
    if (saved) return JSON.parse(saved);
    
    return [SIDEBAR_MENU.find(section => 
      section.items?.some(item => 
        location.pathname.startsWith(item.path) || 
        item.subItems?.some(itemSub => location.pathname === itemSub.path)
      )
    )?.title || ""];
  }, []);

  const initialSubmenus = React.useMemo(() => {
    const saved = localStorage.getItem("sidebar_expanded_submenus");
    if (saved) return JSON.parse(saved);
    
    const subs: string[] = [];
    SIDEBAR_MENU.forEach(section => {
      section.items?.forEach(item => {
        if (item.subItems && location.pathname.startsWith(item.path)) {
          subs.push(item.path);
        }
      });
    });
    return subs;
  }, []);

  const [expandedSections, setExpandedSections] = React.useState<string[]>(initialSection);
  const [expandedSubmenus, setExpandedSubmenus] = React.useState<string[]>(initialSubmenus);

  // Persist state changes
  React.useEffect(() => {
    localStorage.setItem("sidebar_expanded_section", JSON.stringify(expandedSections));
  }, [expandedSections]);

  React.useEffect(() => {
    localStorage.setItem("sidebar_expanded_submenus", JSON.stringify(expandedSubmenus));
  }, [expandedSubmenus]);

  const toggleSubmenu = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedSubmenus(prev => 
      prev.includes(path) 
        ? prev.filter(p => p !== path) 
        : [...prev, path]
    );
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarCollapsed ? "80px" : "256px" }}
      className={cn(
        "fixed left-0 top-0 h-screen z-50 bg-white border-r border-slate-200 flex flex-col transition-all duration-300 ease-in-out overflow-hidden shadow-none dark:bg-sidebar dark:border-border",
        sidebarCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Sidebar Header */}
      <div className={cn(
        "h-16 flex items-center border-b border-slate-100 shrink-0 dark:border-border",
        sidebarCollapsed ? "justify-center px-0 flex-col py-4 h-auto" : "justify-between px-6"
      )}>
        <div className={cn(
          "flex items-center gap-3",
          sidebarCollapsed && "flex-col gap-2 mb-4"
        )}>
          <img 
            src="/logo.png" 
            alt="tpdCRM" 
            className="w-10 h-10 object-contain rounded-lg shadow-sm bg-blue-50 p-1 dark:bg-white/5"
            onError={(e) => {
              // Fallback if image doesn't exist
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent && !parent.querySelector('.fallback-logo')) {
                const fallback = document.createElement('div');
                fallback.className = 'fallback-logo h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center';
                fallback.innerHTML = '<span class="text-white font-bold">t</span>';
                parent.prepend(fallback);
              }
            }}
          />
          {!sidebarCollapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100"
            >
              tpdCRM
            </motion.span>
          )}
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className={cn(
            "hover:bg-slate-100 text-slate-400 rounded-lg h-8 w-8 dark:hover:bg-white/5",
            sidebarCollapsed ? "mt-2" : ""
          )}
        >
          {sidebarCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </Button>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto sidebar-scroll py-4">
        <div className="flex flex-col">
          <TooltipProvider delay={0}>
            {SIDEBAR_MENU.map((section, idx) => {
              const isSectionActive = section.items?.some(item => 
                location.pathname.startsWith(item.path) || 
                item.subItems?.some(sub => location.pathname === sub.path)
              );
              
              // If sidebar is collapsed and it has items, render sub-items as flattened icons
              if (sidebarCollapsed && section.items) {
                return (
                  <div key={idx} className="flex flex-col gap-1 mb-4">
                    {/* Section Label Icon */}
                    <div className="w-full">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className={cn(
                              "flex items-center justify-center py-2 text-slate-400 transition-all duration-200 border-l-4 border-transparent opacity-50",
                              isSectionActive && "text-blue-600 opacity-100"
                            )}
                          >
                            <section.icon className="h-4 w-4 shrink-0" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="font-bold uppercase tracking-wider text-[10px]">
                          {section.title}
                        </TooltipContent>
                      </Tooltip>
                    </div>

                    {section.items.map((item, itemIdx) => (
                      <React.Fragment key={`${idx}-${itemIdx}`}>
                        <div className="w-full">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                  cn(
                                    "flex items-center justify-center py-3 transition-all duration-200 group border-l-4",
                                    (isActive || (item.subItems && location.pathname.startsWith(item.path)))
                                      ? "bg-blue-50 text-blue-600 border-blue-600 shadow-sm dark:bg-blue-600/20 dark:text-white"
                                      : "text-slate-600 hover:bg-slate-50 border-transparent dark:text-slate-400 dark:hover:bg-white/5"
                                  )
                                }
                              >
                                {item.icon && <item.icon className={cn("h-5 w-5 shrink-0", (location.pathname === item.path || (item.subItems && location.pathname.startsWith(item.path))) ? "text-blue-600" : "text-slate-400")} />}
                              </NavLink>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="font-medium">
                              {item.title}
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        
                        {/* Sub-items as icons when collapsed */}
                        {item.subItems?.map((sub, subIdx) => (
                          <div key={`${idx}-${itemIdx}-sub-${subIdx}`} className="w-full">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <NavLink
                                  to={sub.path}
                                  className={({ isActive }) =>
                                    cn(
                                      "flex items-center justify-center py-2.5 transition-all duration-200 group border-l-4",
                                      isActive
                                        ? "bg-blue-50 text-blue-600 border-blue-600 shadow-sm dark:bg-blue-600/20 dark:text-white"
                                        : "text-slate-500 hover:bg-slate-50 border-transparent dark:text-slate-400/80 dark:hover:bg-white/5"
                                    )
                                  }
                                >
                                  {sub.icon && <sub.icon className={cn("h-4 w-4 shrink-0", location.pathname === sub.path ? "text-blue-600" : "text-slate-400")} />}
                                </NavLink>
                              </TooltipTrigger>
                              <TooltipContent side="right" className="font-medium">
                                {sub.title}
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                );
              }

              if (!section.items) {
                return (
                  <div key={idx} className="w-full">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <NavLink
                          to={section.path!}
                          className={({ isActive }) =>
                            cn(
                              "flex items-center gap-3 py-3 transition-all duration-200 group border-l-4",
                              sidebarCollapsed ? "justify-center px-0" : "px-6 justify-start",
                              isActive
                                ? "bg-blue-50 text-blue-600 border-blue-600 font-semibold dark:bg-blue-600/20 dark:text-white"
                                : "text-slate-600 hover:bg-slate-50 border-transparent dark:text-slate-400 dark:hover:bg-white/5"
                            )
                          }
                        >
                          <section.icon className={cn("h-5 w-5 shrink-0", location.pathname === section.path ? "text-blue-600" : "text-slate-400")} />
                          {!sidebarCollapsed && <span className="text-sm">{section.title}</span>}
                        </NavLink>
                      </TooltipTrigger>
                      {sidebarCollapsed && (
                        <TooltipContent side="right">
                          {section.title}
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </div>
                );
              }

              const AccordionAny = Accordion as any;
              return (
                <AccordionAny
                  key={idx}
                  type="multiple"
                  value={expandedSections}
                  onValueChange={setExpandedSections}
                  className="w-full"
                >
                  <AccordionItem value={section.title} className="border-none">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <AccordionTrigger
                          hideChevron={sidebarCollapsed}
                          className={cn(
                            "flex items-center px-4 py-3 text-slate-600 transition-all duration-200 group hover:no-underline hover:bg-slate-50 border-l-4 border-transparent dark:text-slate-400 dark:hover:bg-white/5",
                            isSectionActive && !sidebarCollapsed && "text-slate-900 font-bold dark:text-white",
                            sidebarCollapsed ? "justify-center px-0" : "justify-between px-6"
                          )}
                        >
                          <div className={cn("flex items-center gap-3", !sidebarCollapsed && "flex-1")}>
                            <section.icon className={cn("h-5 w-5 shrink-0", isSectionActive ? "text-blue-600" : "text-slate-400")} />
                            {!sidebarCollapsed && (
                              <span className="text-xs font-bold uppercase tracking-widest">
                                {section.title}
                              </span>
                            )}
                          </div>
                        </AccordionTrigger>
                      </TooltipTrigger>
                      {sidebarCollapsed && (
                        <TooltipContent side="right" className="p-0 border-none bg-transparent shadow-none">
                          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl py-2 min-w-[200px]">
                            <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{section.title}</span>
                            </div>
                            {section.items.map((item, itemIdx) => (
                              <React.Fragment key={itemIdx}>
                                <NavLink
                                  to={item.path}
                                  className={({ isActive }) =>
                                    cn(
                                      "flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-200 mx-2 rounded-lg",
                                      isActive
                                        ? "text-blue-600 bg-blue-50/50 dark:bg-blue-600/10 font-medium"
                                        : "text-slate-600 hover:text-blue-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-white/5"
                                    )
                                  }
                                >
                                  {item.icon && <item.icon className="h-4 w-4 shrink-0" />}
                                  {item.title}
                                </NavLink>
                                {item.subItems?.map((sub, sIdx) => (
                                  <NavLink
                                    key={`sub-${sIdx}`}
                                    to={sub.path}
                                    className={({ isActive }) =>
                                      cn(
                                        "flex items-center gap-3 pl-10 pr-4 py-2 text-xs transition-all duration-200 mx-2 rounded-lg",
                                        isActive
                                          ? "text-blue-600 bg-blue-50/30 dark:bg-blue-600/10 font-medium"
                                          : "text-slate-500 hover:text-blue-600 hover:bg-slate-50 dark:text-slate-400/80 dark:hover:bg-white/5"
                                      )
                                    }
                                  >
                                    {sub.icon && <sub.icon className="h-3.5 w-3.5 shrink-0" />}
                                    {sub.title}
                                  </NavLink>
                                ))}
                              </React.Fragment>
                            ))}
                          </div>
                        </TooltipContent>
                      )}
                    </Tooltip>
                    
                    {!sidebarCollapsed && (
                      <AccordionContent className="pb-1 bg-[#F9FAFB] dark:bg-black/10">
                        <div className="flex flex-col relative">
                          {/* Vertical Connector Line */}
                          <div className="absolute left-[27px] top-0 bottom-4 w-px bg-slate-200 dark:bg-slate-800" />
                          
                          {section.items.map((item, itemIdx) => {
                            const isSubmenuExpanded = expandedSubmenus.includes(item.path);
                            const isItemActive = location.pathname.startsWith(item.path);

                            return (
                              <div key={itemIdx} className="flex flex-col relative group">
                                <NavLink
                                  to={item.path}
                                  onClick={(e) => {
                                    if (item.subItems) {
                                      toggleSubmenu(item.path, e);
                                    }
                                  }}
                                  className={({ isActive }) =>
                                    cn(
                                      "flex items-center gap-3 pl-12 pr-4 py-2 text-sm transition-all duration-200 relative mx-2 rounded-lg",
                                      (isActive || (item.subItems && isItemActive))
                                        ? "text-blue-600 font-semibold bg-blue-50/80 dark:bg-blue-600/10"
                                        : "text-slate-600 hover:text-blue-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-white"
                                    )
                                  }
                                >
                                  {/* Horizontal connector dot/line */}
                                  <div className={cn(
                                    "absolute left-[15px] top-1/2 -translate-y-1/2 w-3 h-px bg-slate-200 dark:bg-slate-800",
                                    isItemActive && "bg-blue-400"
                                  )} />
                                  
                                  {item.icon && <item.icon className={cn("h-4 w-4 shrink-0 transition-colors", (location.pathname === item.path || (item.subItems && isItemActive)) ? "text-blue-600" : "text-slate-400 group-hover:text-blue-500")} />}
                                  <span>{item.title}</span>
                                  
                                  {item.subItems && (
                                    <ChevronRight className={cn(
                                      "ml-auto h-3.5 w-3.5 transition-transform duration-300 ease-in-out",
                                      isSubmenuExpanded && "rotate-90"
                                    )} />
                                  )}
                                </NavLink>
                                
                                {/* Third level nesting for subItems */}
                                {item.subItems && (
                                  <AnimatePresence initial={false}>
                                    {isSubmenuExpanded && (
                                      <motion.div 
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                                        className="overflow-hidden flex flex-col pl-14 relative"
                                      >
                                        {/* Sub-item vertical line */}
                                        <div className="absolute left-[27px] top-0 bottom-2 w-px bg-slate-200 dark:bg-slate-800" />
                                        
                                        {item.subItems.map((sub, subIdx) => (
                                          <NavLink
                                            key={subIdx}
                                            to={sub.path}
                                            className={({ isActive }) =>
                                              cn(
                                                "flex items-center gap-3 pl-6 pr-4 py-1.5 text-[13px] transition-all duration-200 relative group/sub mx-2 rounded-lg mt-0.5",
                                                isActive
                                                  ? "text-blue-600 font-medium bg-blue-50/50 dark:bg-blue-600/10"
                                                  : "text-slate-500 hover:text-blue-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-white"
                                              )
                                            }
                                          >
                                            {sub.icon && (
                                              <sub.icon className={cn(
                                                "h-3.5 w-3.5 shrink-0 transition-colors z-10",
                                                location.pathname === sub.path 
                                                  ? "text-blue-600" 
                                                  : "text-slate-400 group-hover/sub:text-blue-500"
                                              )} />
                                            )}
                                            {sub.title}
                                          </NavLink>
                                        ))}
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </AccordionContent>
                    )}
                  </AccordionItem>
                </AccordionAny>
              );
            })}
          </TooltipProvider>
        </div>
      </div>

      <div className="border-t border-slate-100 shrink-0 dark:border-border">
        <div className={cn(
          "flex items-center gap-3 p-4 transition-all",
          sidebarCollapsed ? "flex-col justify-center" : "px-6 py-6"
        )}>
          <Avatar className="h-10 w-10 border border-slate-200 shadow-sm shrink-0 dark:border-border">
            <AvatarImage src="" />
            <AvatarFallback className="bg-blue-600 text-white font-bold text-sm uppercase">A</AvatarFallback>
          </Avatar>
          {!sidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-800 uppercase tracking-tight dark:text-white">Admin User</p>
              <p className="text-[10px] text-slate-500 truncate font-medium dark:text-slate-400">admin@tpdcrm.io</p>
            </div>
          )}
        </div>
        
        <div className={cn("pb-6", sidebarCollapsed ? "px-2" : "px-6")}>
          <Button 
            variant="ghost" 
            className={cn(
              "w-full text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 h-9 rounded-lg dark:text-slate-400 dark:hover:bg-red-900/20 dark:hover:text-red-400",
              sidebarCollapsed ? "px-0 justify-center" : "justify-start px-3"
            )}
          >
            <LogOut className={cn("h-4 w-4", !sidebarCollapsed && "mr-3")} />
            {!sidebarCollapsed && <span className="text-sm font-medium">{t("sign_out")}</span>}
          </Button>
        </div>
      </div>
    </motion.aside>
  );
}
