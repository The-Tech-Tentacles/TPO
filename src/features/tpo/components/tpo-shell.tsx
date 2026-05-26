"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  Building2,
  CalendarDays,
  LayoutDashboard,
  Newspaper,
  School,
  Settings,
  Users,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { UserNav } from "@/components/UserNav";
import { useApp } from "@/lib/store";
import { routes } from "@/shared/config/routes";
import { cn } from "@/lib/utils";

const nav = [
  { href: routes.tpo.dashboard, label: "Dashboard", icon: LayoutDashboard },
  { href: routes.tpo.students, label: "Students", icon: Users },
  { href: routes.tpo.faculty, label: "Faculty", icon: School },
  { href: routes.tpo.companies, label: "Companies", icon: Building2 },
  { href: routes.tpo.feed, label: "Feed", icon: Newspaper },
  { href: routes.tpo.calendar, label: "Calendar", icon: CalendarDays },
  { href: routes.tpo.settings, label: "Settings", icon: Settings },
];

export function TpoShell({ children }: { children: React.ReactNode }) {
  const { user } = useApp();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!user) router.replace(routes.auth.login);
    else if (user.role === "student") router.replace(routes.student.home);
  }, [router, user]);

  if (!user || user.role === "student") return null;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-24 md:pb-8 dark:bg-slate-950">
      {/* Top Header - Glass Floating */}
      <header className="sticky top-4 z-30 mx-auto w-[calc(100%-2rem)] max-w-7xl flex h-14 items-center justify-between rounded-full border border-white/40 bg-white/10 px-4 md:px-5 backdrop-blur-2xl shadow-xl shadow-emerald-900/5 ring-1 ring-white/50 dark:border-white/10 dark:bg-slate-900/10 dark:ring-white/20 transition-all">
        <div className="flex items-center gap-4">
          <Logo />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1.5">
          {nav.map((item) => {
            const active = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ease-out",
                  active
                    ? "text-emerald-800 dark:text-emerald-300 bg-white/60 dark:bg-emerald-900/40 shadow-sm border border-white/50 dark:border-emerald-700/30"
                    : "text-slate-600 hover:text-emerald-700 hover:bg-white/50 dark:text-slate-400 dark:hover:text-emerald-300 dark:hover:bg-slate-800/40",
                )}
              >
                <Icon
                  className={cn(
                    "size-4 transition-transform duration-300",
                    active && "stroke-[2.5px]",
                  )}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <UserNav />
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-8xl px-4 py-8">{children}</main>

      {/* Floating Bottom Navigation - Glass Theme (Mobile Only) */}
      <nav className="lg:hidden fixed inset-x-0 bottom-4 z-30 mx-auto max-w-[95%] px-2">
        <div className="flex items-center gap-1 rounded-full border border-white/40 bg-white/10 p-1.5 shadow-2xl shadow-emerald-900/10 backdrop-blur-2xl ring-1 ring-white/50 dark:border-white/10 dark:bg-slate-900/10 dark:ring-white/20 transition-all overflow-x-auto no-scrollbar">
          {nav.map((item) => {
            const active = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex min-w-[4rem] shrink-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-full py-1.5 px-1 text-[10px] font-semibold transition-all duration-300 ease-out text-center",
                  active
                    ? "text-emerald-800 dark:text-emerald-300 bg-white/60 dark:bg-emerald-900/40 shadow-sm border border-white/50 dark:border-emerald-700/30 scale-105"
                    : "text-slate-600 hover:text-emerald-700 hover:bg-white/50 dark:text-slate-400 dark:hover:text-emerald-300 dark:hover:bg-slate-800/40",
                )}
              >
                <Icon
                  className={cn(
                    "size-4 transition-transform duration-300",
                    active && "stroke-[2.5px]",
                  )}
                />
                <span className="leading-tight max-w-full truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
