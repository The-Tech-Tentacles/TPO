"use client";

import { useState, useMemo, useEffect } from "react";
import { Plus, Search, Filter, MessageSquare, AlertCircle, Sparkles, Megaphone, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/lib/store";
import { DEPARTMENTS } from "@/lib/dummy-data";
import type { Post } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FeedCard } from "@/components/FeedCard";
import { cn } from "@/lib/utils";

const ALL = "__all__";

const glassCard =
  "rounded-2xl border border-white/40 bg-white/50 shadow-xl shadow-emerald-900/5 backdrop-blur-2xl ring-1 ring-white/50 dark:border-white/10 dark:bg-slate-900/50 dark:ring-white/10 transition-all duration-300";

export function TpoFeedPage() {
  const { state, setState, user } = useApp();
  const [open, setOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [q, setQ] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>(ALL);

  // Search & Filter Matching
  const filteredPosts = useMemo(() => {
    return state.posts.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(q.toLowerCase()) ||
        p.body.toLowerCase().includes(q.toLowerCase());
      const matchesType = typeFilter === ALL || p.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [state.posts, q, typeFilter]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-8xl mx-auto pb-20">
      {/* Header Block */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            Placement Feed Board
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Publish official announcements, resource notices, or interactive student polls.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingPost(null);
            setOpen(true);
          }}
          className="h-10 rounded-xl shadow-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2 px-4 shrink-0 border-0"
        >
          <Plus className="size-4" />
          Create Post
        </Button>
      </div>

      {/* Modern Filter Suite */}
      <Card className={cn(glassCard, "p-4 space-y-4")}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search announcements, subject files, recruitment dates..."
              className="pl-9 bg-white/50 dark:bg-slate-900/50 border-slate-200/60 dark:border-slate-700/50 focus-visible:ring-emerald-500/20"
            />
          </div>
          <div className="flex items-center gap-2 self-stretch">
            <Tabs
              value={typeFilter}
              onValueChange={setTypeFilter}
              className="w-full sm:w-auto"
            >
              <TabsList className="bg-slate-100/80 dark:bg-slate-800/80 p-0.5 rounded-xl border border-slate-200/40 dark:border-slate-700/40">
                <TabsTrigger value={ALL} className="rounded-lg text-xs font-semibold px-3 py-1">
                  All
                </TabsTrigger>
                <TabsTrigger value="Post" className="rounded-lg text-xs font-semibold px-3 py-1">
                  Posts
                </TabsTrigger>
                <TabsTrigger value="Notice" className="rounded-lg text-xs font-semibold px-3 py-1">
                  Notices
                </TabsTrigger>
                <TabsTrigger value="Poll" className="rounded-lg text-xs font-semibold px-3 py-1">
                  Polls
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </Card>

      {/* Main Feed Column */}
      <div className="space-y-4">
        {filteredPosts.map((p) => (
          <FeedCard
            key={p.id}
            post={p}
            canManage
            onEdit={() => setEditingPost(p)}
            onDelete={() => {
              setState((s) => ({ ...s, posts: s.posts.filter((x) => x.id !== p.id) }));
              toast.success("Feed post removed successfully");
            }}
          />
        ))}

        {filteredPosts.length === 0 && (
          <Card className={cn(glassCard, "p-12 text-center border-dashed text-slate-400 dark:text-slate-500")}>
            <AlertCircle className="size-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-sm font-medium">No announcements published matching your selection.</p>
          </Card>
        )}
      </div>



      {/* Create / Edit Dialog Modal */}
      <CreatePostDialog
        open={open || !!editingPost}
        onOpenChange={(o) => {
          if (!o) {
            setOpen(false);
            setEditingPost(null);
          }
        }}
        post={editingPost}
        onSave={(p) => {
          setState((s) => {
            if (editingPost) {
              return {
                ...s,
                posts: s.posts.map((x) =>
                  x.id === editingPost.id
                    ? {
                      ...x,
                      type: p.type,
                      title: p.title,
                      body: p.body,
                      audience: p.audience,
                      pollOptions: p.pollOptions ?? x.pollOptions,
                    }
                    : x
                ),
              };
            } else {
              return {
                ...s,
                posts: [
                  {
                    ...p,
                    id: `p-${Date.now()}`,
                    authorName: user?.name ?? "TPO Officer",
                    authorRole: user?.role === "tpo-admin" ? "TPO Admin" : "TPO Coordinator",
                    createdAt: new Date().toISOString(),
                    likes: 0,
                    comments: [],
                  },
                  ...s.posts,
                ],
              };
            }
          });
          toast.success(editingPost ? "Announcement updated successfully" : "Announcement published to student dashboards");
          setOpen(false);
          setEditingPost(null);
        }}
      />
    </div>
  );
}

function CreatePostDialog({
  open,
  onOpenChange,
  post,
  onSave,
}: {
  open: boolean;
  onOpenChange: (b: boolean) => void;
  post: Post | null;
  onSave: (p: Post) => void;
}) {
  const [type, setType] = useState<Post["type"]>("Post");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [pollOptionsText, setPollOptionsText] = useState("");
  const [targetAll, setTargetAll] = useState(true);
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");

  useEffect(() => {
    if (open) {
      setType(post?.type ?? "Post");
      setTitle(post?.title ?? "");
      setBody(post?.body ?? "");
      setPollOptionsText(post?.pollOptions?.map((o) => o.text).join("\n") ?? "");

      const aud = post?.audience ?? ["All Students"];
      const isAll = aud.includes("All Students") || aud.length === 0;
      setTargetAll(isAll);

      if (!isAll) {
        const foundDept = DEPARTMENTS.find((d) => aud.includes(d)) ?? "All";
        const foundYear = ["First", "Second", "Third", "Fourth"].find((y) => aud.includes(y)) ?? "All";
        setSelectedDept(foundDept);
        setSelectedYear(foundYear);
      } else {
        setSelectedDept("All");
        setSelectedYear("All");
      }
    }
  }, [post, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[92vh] overflow-y-auto sm:rounded-2xl border-emerald-500/20 bg-white/95 dark:bg-slate-900/95 shadow-2xl p-6 ring-1 ring-black/5">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
            {type === "Post" && <Sparkles className="size-5 text-indigo-500" />}
            {type === "Notice" && <Megaphone className="size-5 text-amber-500" />}
            {type === "Poll" && <HelpCircle className="size-5 text-emerald-500" />}
            {post ? "Edit Feed Post" : "Publish to Feed Board"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2 text-sm">
          {/* Post Type Selector Tabs */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Select announcement channel
            </Label>
            <Tabs value={type} onValueChange={(v) => setType(v as Post["type"])}>
              <TabsList className="grid w-full grid-cols-3 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200/40">
                <TabsTrigger value="Post" className="rounded-lg text-xs font-semibold py-1.5">Standard Post</TabsTrigger>
                <TabsTrigger value="Notice" className="rounded-lg text-xs font-semibold py-1.5">Official Notice</TabsTrigger>
                <TabsTrigger value="Poll" className="rounded-lg text-xs font-semibold py-1.5">Student Poll</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Notice Heading / Title
            </Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. TCS NQT Registration guidelines"
              className="bg-white/50 dark:bg-slate-900/50 border-slate-200/60 dark:border-slate-700/50"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Body Message details
            </Label>
            <Textarea
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Provide complete structural information here..."
              className="bg-white/50 dark:bg-slate-900/50 border-slate-200/60 dark:border-slate-700/50"
            />
          </div>

          {type === "Poll" && (
            <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-300">
              <Label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Poll Options (One per line)
              </Label>
              <Textarea
                rows={3}
                value={pollOptionsText}
                onChange={(e) => setPollOptionsText(e.target.value)}
                placeholder="Option 1&#10;Option 2&#10;Option 3"
                className="bg-white/50 dark:bg-slate-900/50 border-slate-200/60 font-mono text-xs"
              />
            </div>
          )}

          {/* Target Audience Dropdowns Row */}
          <div className="space-y-3">
            <Label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Target Audience
            </Label>

            {/* Checkbox Row */}
            <div className="flex items-center gap-2 px-1">
              <input
                type="checkbox"
                id="target-all-students"
                checked={targetAll}
                onChange={(e) => {
                  setTargetAll(e.target.checked);
                  if (e.target.checked) {
                    setSelectedDept("All");
                    setSelectedYear("All");
                  }
                }}
                className="size-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500/20 dark:border-slate-800 dark:bg-slate-900 cursor-pointer"
              />
              <label
                htmlFor="target-all-students"
                className="text-xs font-semibold text-slate-700 dark:text-slate-350 cursor-pointer select-none"
              >
                Target All Students
              </label>
            </div>

            {/* Dropdowns side-by-side */}
            <div className="grid gap-3 grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="target-dept" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Department
                </Label>
                <select
                  id="target-dept"
                  value={selectedDept}
                  disabled={targetAll}
                  onChange={(e) => {
                    setSelectedDept(e.target.value);
                    if (e.target.value === "All" && selectedYear === "All") {
                      setTargetAll(true);
                    } else {
                      setTargetAll(false);
                    }
                  }}
                  className="h-9 w-full rounded-lg border border-slate-200 bg-white/50 px-3 py-1.5 text-xs text-slate-700 dark:border-slate-700/50 dark:bg-slate-900/50 dark:text-slate-350 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="All">All Departments</option>
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="target-year" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Academic Year
                </Label>
                <select
                  id="target-year"
                  value={selectedYear}
                  disabled={targetAll}
                  onChange={(e) => {
                    setSelectedYear(e.target.value);
                    if (selectedDept === "All" && e.target.value === "All") {
                      setTargetAll(true);
                    } else {
                      setTargetAll(false);
                    }
                  }}
                  className="h-9 w-full rounded-lg border border-slate-200 bg-white/50 px-3 py-1.5 text-xs text-slate-700 dark:border-slate-700/50 dark:bg-slate-900/50 dark:text-slate-355 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="All">All Years</option>
                  <option value="First">First Year</option>
                  <option value="Second">Second Year</option>
                  <option value="Third">Third Year</option>
                  <option value="Fourth">Fourth Year</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-4 gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() =>
              onSave({
                id: post?.id ?? "",
                type,
                title,
                body,
                audience: targetAll
                  ? ["All Students"]
                  : [
                    ...(selectedDept !== "All" ? [selectedDept] : []),
                    ...(selectedYear !== "All" ? [selectedYear] : []),
                  ].length > 0
                    ? [
                      ...(selectedDept !== "All" ? [selectedDept] : []),
                      ...(selectedYear !== "All" ? [selectedYear] : []),
                    ]
                    : ["All Students"],
                authorName: post?.authorName ?? "",
                authorRole: post?.authorRole ?? "",
                createdAt: post?.createdAt ?? "",
                likes: post?.likes ?? 0,
                comments: post?.comments ?? [],
                pollOptions:
                  type === "Poll"
                    ? pollOptionsText
                      .split("\n")
                      .filter((t) => t.trim())
                      .map((t, i) => {
                        const existingOpt = post?.pollOptions?.find((o) => o.text === t.trim());
                        return { id: existingOpt?.id ?? `opt-${i}`, text: t.trim(), votes: existingOpt?.votes ?? 0 };
                      })
                    : undefined,
              })
            }
            disabled={!title.trim() || !body.trim() || (type === "Poll" && !pollOptionsText.trim())}
            className="bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-600 dark:hover:bg-emerald-700 border-0"
          >
            {post ? "Save Changes" : "Publish Notice"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
