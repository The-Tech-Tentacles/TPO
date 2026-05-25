"use client";

import { useState } from "react";
import { Check, ChevronDown, LogOut, Settings, SunMoon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { AvatarCircle } from "@/components/AvatarCircle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useApp } from "@/lib/store";
import { routes } from "@/shared/config/routes";
import { cn } from "@/lib/utils";

export function UserNav() {
  const { user, logout } = useApp();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [showThemeOptions, setShowThemeOptions] = useState(false);

  if (!user) return null;

  return (
    <DropdownMenu
      onOpenChange={(open) => {
        if (!open) setShowThemeOptions(false);
      }}
    >
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-white/50 dark:hover:bg-slate-800/40 transition-colors"
        >
          <AvatarCircle name={user.name} size={32} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 mt-2">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium text-sm">{user.name}</p>
            <p className="w-[200px] truncate text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            setShowThemeOptions(!showThemeOptions);
          }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center">
            <SunMoon className="mr-2 h-4 w-4" />
            <span>Theme</span>
          </div>
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              showThemeOptions && "rotate-180",
            )}
          />
        </DropdownMenuItem>

        {showThemeOptions && (
          <div className="bg-slate-100/50 dark:bg-slate-800/50 rounded-md mx-1 my-1 p-1 flex flex-col gap-0.5 shadow-inner border border-slate-200/50 dark:border-slate-700/50 animate-in slide-in-from-top-1 fade-in-0 duration-200">
            <DropdownMenuItem
              onClick={() => setTheme("light")}
              className={cn(
                "pl-8 text-sm",
                theme === "light" && "bg-slate-200/80 dark:bg-slate-700/80 font-medium",
              )}
            >
              Light
              {theme === "light" && <Check className="ml-auto h-4 w-4" />}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setTheme("dark")}
              className={cn(
                "pl-8 text-sm",
                theme === "dark" && "bg-slate-200/80 dark:bg-slate-700/80 font-medium",
              )}
            >
              Dark
              {theme === "dark" && <Check className="ml-auto h-4 w-4" />}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setTheme("system")}
              className={cn(
                "pl-8 text-sm",
                theme === "system" && "bg-slate-200/80 dark:bg-slate-700/80 font-medium",
              )}
            >
              System
              {theme === "system" && <Check className="ml-auto h-4 w-4" />}
            </DropdownMenuItem>
          </div>
        )}

        <DropdownMenuItem onClick={() => router.push(routes.student.profile)}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400 focus:bg-red-50 dark:focus:bg-red-950/50"
          onClick={() => {
            logout();
            router.replace(routes.auth.login);
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
