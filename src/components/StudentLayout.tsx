import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { Home, User, LogOut } from "lucide-react";
import { useApp } from "@/lib/store";
import { Logo } from "./Logo";
import { NotificationBell } from "./NotificationBell";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const tabs = [
  { to: "/student/home", label: "Home", icon: Home },
  { to: "/student/profile", label: "Profile", icon: User },
] as const;

export function StudentLayout() {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  useEffect(() => {
    if (!user) navigate({ to: "/login" });
    else if (user.role !== "student") navigate({ to: "/tpo/dashboard" });
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-card/80 px-4 backdrop-blur">
        <Logo />
        <div className="flex items-center gap-1">
          <NotificationBell />
          <Button variant="ghost" size="icon" onClick={() => { logout(); navigate({ to: "/login" }); }}>
            <LogOut className="size-5" />
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-4">
        <Outlet />
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t bg-card/95 backdrop-blur">
        <div className="mx-auto grid max-w-2xl grid-cols-2">
          {tabs.map((t) => {
            const active = pathname.startsWith(t.to);
            const Icon = t.icon;
            return (
              <Link key={t.to} to={t.to} className={cn("flex flex-col items-center gap-1 py-3 text-xs font-medium transition", active ? "text-primary" : "text-muted-foreground hover:text-foreground")}>
                <Icon className={cn("size-5", active && "fill-primary/10")} />
                {t.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
