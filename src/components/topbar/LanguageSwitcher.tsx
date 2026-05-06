import React from "react";
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const languages = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "fr", label: "French" },
  { code: "es", label: "Spanish" },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem("lang", code);
  };

  const currentLang = languages.find((l) => l.code === (i18n.language?.split('-')[0] || 'en')) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-white/5 text-slate-500 rounded-lg px-2 h-10 transition-colors">
          <Globe className="h-5 w-5" />
          <span className="text-xs font-semibold uppercase">{currentLang.code}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 p-1 rounded-2xl shadow-2xl border-slate-100 dark:border-white/5 dark:bg-[#211c1f]">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            className="rounded-lg py-2 cursor-pointer transition-colors hover:bg-slate-50 dark:focus:bg-white/5 dark:text-slate-300"
            onClick={() => handleLanguageChange(lang.code)}
          >
            <span className={lang.code === currentLang.code ? "font-bold text-blue-600 dark:text-blue-400" : ""}>
              {lang.label}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
