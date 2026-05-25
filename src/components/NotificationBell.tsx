import { Bell, Check, AlertCircle, Megaphone, Info } from "lucide-react";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useApp, timeAgo } from "@/lib/store";
import { cn } from "@/lib/utils";

const iconFor = (t: string) => {
  if (t === "approval") return <Check className="size-4 text-emerald-600" />;
  if (t === "rejection") return <AlertCircle className="size-4 text-destructive" />;
  if (t === "notice") return <Megaphone className="size-4 text-amber-600" />;
  return <Info className="size-4 text-primary" />;
};

export function NotificationBell() {
  const { state, setState } = useApp();
  const unread = state.notifications.filter((n) => !n.read).length;

  const markAll = () =>
    setState((s) => ({ ...s, notifications: s.notifications.map((n) => ({ ...n, read: true })) }));

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="size-5" />
          {unread > 0 && (
            <span className="absolute -right-0.5 -top-0.5 grid min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">{unread}</span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            Notifications
            {unread > 0 && <Button variant="ghost" size="sm" onClick={markAll}>Mark all read</Button>}
          </SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-2 overflow-y-auto px-4 pb-4">
          {state.notifications.length === 0 && <p className="text-sm text-muted-foreground">No notifications yet.</p>}
          {state.notifications.map((n) => (
            <div key={n.id} className={cn("flex gap-3 rounded-lg border p-3", !n.read && "bg-primary/5 border-primary/20")}>
              <div className="mt-0.5">{iconFor(n.type)}</div>
              <div className="flex-1">
                <div className="text-sm font-medium">{n.title}</div>
                {n.body && <div className="text-xs text-muted-foreground">{n.body}</div>}
                <div className="mt-1 text-[10px] text-muted-foreground">{timeAgo(n.createdAt)}</div>
              </div>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
