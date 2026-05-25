"use client";

import { useMemo, useState } from "react";
import { Check, Filter, Search } from "lucide-react";
import { FeedCard } from "@/components/FeedCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

const filters = ["All", "Posts", "Notices", "Polls"] as const;

export function StudentHomePage() {
  const { state, user } = useApp();
  const [active, setActive] = useState<(typeof filters)[number]>("All");
  const [search, setSearch] = useState("");

  const visible = useMemo(() => {
    return state.posts
      .filter((p) => {
        const matchesSearch =
          search === "" ||
          p.authorName.toLowerCase().includes(search.toLowerCase()) ||
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.body.toLowerCase().includes(search.toLowerCase());

        if (!matchesSearch) return false;

        if (active === "All") return true;
        if (active === "Posts") return p.type === "Post";
        if (active === "Notices") return p.type === "Notice";
        return p.type === "Poll";
      })
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  }, [active, search, state.posts]);

  return (
    <div className="space-y-6">
      <div className="flex flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by faculty, title, or desc."
            className="pl-9 bg-card border-border/60 shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="shrink-0 gap-2 bg-card border-border/60 shadow-sm px-3 sm:px-4">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="hidden sm:inline-block">{active === "All" ? "Filter" : active}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[180px]">
            {filters.map((f) => (
              <DropdownMenuItem
                key={f}
                onClick={() => setActive(f)}
                className="justify-between cursor-pointer"
              >
                {f}
                {active === f && <Check className="h-4 w-4 text-primary" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="space-y-3">
        {visible.map((p) => (
          <FeedCard key={p.id} post={p} />
        ))}
      </div>
    </div>
  );
}
