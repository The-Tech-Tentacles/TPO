"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  Building2,
  LayoutDashboard,
  LogOut,
  Newspaper,
  School,
  Settings,
  Users,
} from "lucide-react";
import { AvatarCircle } from "@/components/AvatarCircle";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { RoleBadge } from "@/components/RoleBadge";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";
import { routes } from "@/shared/config/routes";
import { cn } from "@/lib/utils";

const nav = [
  { href: routes.tpo.dashboard, label: "Dashboard", icon: LayoutDashboard },
  { href: routes.tpo.students, label: "Students", icon: Users },
  { href: routes.tpo.faculty, label: "Faculty", icon: School },
  { href: routes.tpo.companies, label: "Companies", icon: Building2 },
  { href: routes.tpo.feed, label: "Feed", icon: Newspaper },
  { href: routes.tpo.settings, label: "Settings", icon: Settings },
];

export function TpoShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useApp();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!user) router.replace(routes.auth.login);
    else if (user.role === "student") router.replace(routes.student.home);
  }, [router, user]);

  if (!user || user.role === "student") return null;

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden h-screen w-64 shrink-0 flex-col gap-1 border-r bg-sidebar p-3 lg:flex">
        <div className="p-2">
          <Logo />
        </div>
        <div className="mb-2 flex items-center gap-3 rounded-xl border bg-card p-3">
          <AvatarCircle name={user.name} size={36} />
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">{user.name}</div>
            <RoleBadge role={user.role} />
          </div>
        </div>
        <nav className="flex flex-col gap-1">
          {nav.map((item) => {
            const active = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-sidebar-foreground hover:bg-sidebar-accent",
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2"
            onClick={() => {
              logout();
              router.replace(routes.auth.login);
            }}
          >
            <LogOut className="size-4" />
            Log out
          </Button>
        </div>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-card/80 px-4 backdrop-blur lg:px-6">
          <Logo />
          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
