import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useApp } from "@/lib/store";
import { FeedCard } from "@/components/FeedCard";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/student/home")({ component: StudentHome });

const filters = ["All", "Posts", "Notices", "Messages"] as const;

function StudentHome() {
  const { state, user } = useApp();
  const [active, setActive] = useState<(typeof filters)[number]>("All");

  const visible = useMemo(() => {
    return state.posts
      .filter((p) => {
        if (active === "All") return true;
        if (active === "Posts") return p.type === "Post";
        if (active === "Notices") return p.type === "Notice";
        return p.type === "Message";
      })
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  }, [state.posts, active]);

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-gradient-to-br from-primary/15 via-primary/5 to-accent/10 p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-primary">{greeting}</p>
        <h1 className="mt-1 text-2xl font-bold">{user?.name?.split(" ")[0] ?? "Student"} 👋</h1>
        <p className="mt-1 text-sm text-muted-foreground">Here's what's new in your placement cell.</p>
      </div>

      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActive(f)}
            className={cn(
              "shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition",
              active === f
                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                : "border-border bg-card text-foreground hover:bg-secondary",
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {visible.length === 0 && (
          <div className="rounded-xl border border-dashed bg-card p-10 text-center">
            <p className="text-sm text-muted-foreground">No items in this filter yet.</p>
          </div>
        )}
        {visible.map((p) => <FeedCard key={p.id} post={p} />)}
      </div>
    </div>
  );
}
