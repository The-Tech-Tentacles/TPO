import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  LayoutDashboard, Users, School, Building2, Newspaper, Settings, LogOut, Menu, X,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { Logo } from "./Logo";
import { NotificationBell } from "./NotificationBell";
import { RoleBadge } from "./RoleBadge";
import { AvatarCircle } from "./AvatarCircle";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const allNav = [
  { to: "/tpo/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["tpo-admin", "tpo-co-admin", "tpo-department", "moderator"] },
  { to: "/tpo/students", label: "Students", icon: Users, roles: ["tpo-admin", "tpo-co-admin", "tpo-department", "moderator"] },
  { to: "/tpo/faculty", label: "Faculty", icon: School, roles: ["tpo-admin", "tpo-co-admin"] },
  { to: "/tpo/companies", label: "Companies", icon: Building2, roles: ["tpo-admin", "tpo-co-admin", "tpo-department", "moderator"] },
  { to: "/tpo/feed", label: "Feed", icon: Newspaper, roles: ["tpo-admin", "tpo-co-admin", "tpo-department", "moderator"] },
  { to: "/tpo/settings", label: "Settings", icon: Settings, roles: ["tpo-admin", "tpo-co-admin", "moderator"] },
] as const;

export function TpoLayout() {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!user) navigate({ to: "/login" });
    else if (user.role === "student") navigate({ to: "/student/home" });
  }, [user, navigate]);

  useEffect(() => { setOpen(false); }, [pathname]);

  if (!user || user.role === "student") return null;
  const nav = allNav.filter((n) => (n.roles as readonly string[]).includes(user.role));

  const Sidebar = (
    <aside className="flex h-full w-64 shrink-0 flex-col gap-1 border-r bg-sidebar p-3">
      <div className="flex items-center justify-between p-2">
        <Logo />
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(false)}><X className="size-5" /></Button>
      </div>
      <div className="mb-2 flex items-center gap-3 rounded-xl border bg-card p-3">
        <AvatarCircle name={user.name} size={36} />
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold">{user.name}</div>
          <RoleBadge role={user.role} />
        </div>
      </div>
      <nav className="flex flex-col gap-1">
        {nav.map((n) => {
          const active = pathname.startsWith(n.to);
          const Icon = n.icon;
          return (
            <Link key={n.to} to={n.to} className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition", active ? "bg-primary text-primary-foreground shadow-sm" : "text-sidebar-foreground hover:bg-sidebar-accent")}>
              <Icon className="size-4" />{n.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto">
        <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => { logout(); navigate({ to: "/login" }); }}>
          <LogOut className="size-4" />Log out
        </Button>
      </div>
    </aside>
  );

  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden lg:flex">{Sidebar}</div>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full">{Sidebar}</div>
        </div>
      )}

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-card/80 px-4 backdrop-blur lg:px-6">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(true)}><Menu className="size-5" /></Button>
            <div className="lg:hidden"><Logo /></div>
          </div>
          <div className="flex items-center gap-1">
            <NotificationBell />
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
