import { useState } from "react";
import { Heart, MessageCircle, Share2, Send, Trash2, CheckCircle2, MoreHorizontal, Pencil } from "lucide-react";
import type { Post } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AvatarCircle } from "./AvatarCircle";
import { timeAgo, useApp } from "@/lib/store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const typeStyles: Record<Post["type"], string> = {
  Notice: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:bg-amber-950/20 dark:text-amber-400",
  Post: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20 dark:bg-indigo-950/20 dark:text-indigo-400",
  Poll: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:bg-emerald-950/20 dark:text-emerald-400",
};

export function FeedCard({
  post,
  canManage = false,
  onEdit,
  onDelete,
}: {
  post: Post;
  canManage?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  const { setState, user } = useApp();
  const [expanded, setExpanded] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [draft, setDraft] = useState("");

  const toggleLike = () => {
    setState((s) => ({
      ...s,
      posts: s.posts.map((p) =>
        p.id === post.id
          ? { ...p, likedByMe: !p.likedByMe, likes: p.likes + (p.likedByMe ? -1 : 1) }
          : p,
      ),
    }));
  };

  const share = async () => {
    const url = typeof window !== "undefined" ? `${window.location.origin}/?post=${post.id}` : "";
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Feed post link copied to clipboard");
    } catch {
      toast.error("Could not copy link");
    }
  };

  const sendComment = () => {
    const text = draft.trim();
    if (!text) return;
    setState((s) => ({
      ...s,
      posts: s.posts.map((p) =>
        p.id === post.id
          ? {
              ...p,
              comments: [
                ...p.comments,
                {
                  id: `c${Date.now()}`,
                  author: user?.name ?? "Anonymous Student",
                  role: user?.role === "student" ? "Student" : "TPO Admin",
                  text,
                  createdAt: new Date().toISOString(),
                },
              ],
            }
          : p,
      ),
    }));
    setDraft("");
  };

  const glassCard =
    "rounded-2xl border border-white/40 bg-white/50 shadow-xl shadow-emerald-900/5 backdrop-blur-2xl ring-1 ring-white/50 dark:border-white/10 dark:bg-slate-900/50 dark:ring-white/10 transition-all duration-300";

  return (
    <Card className={cn(glassCard, "overflow-hidden p-5 hover:border-emerald-500/20 dark:hover:border-emerald-500/30 group")}>
      {/* Top Header Block */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <AvatarCircle name={post.authorName} />
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-sm text-slate-800 dark:text-slate-100">{post.authorName}</span>
              <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-semibold px-2 py-0.5 rounded-full">
                {post.authorRole}
              </span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">{timeAgo(post.createdAt)}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className={cn("border text-[10px] font-semibold py-0.5 px-2.5 rounded-full uppercase tracking-wider", typeStyles[post.type])}>
            {post.type}
          </Badge>
          {canManage && (onEdit || onDelete) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-slate-400 hover:text-slate-600 hover:bg-slate-100/50 dark:text-slate-500 dark:hover:text-slate-300 dark:hover:bg-slate-800/35 rounded-lg"
                >
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 shadow-xl p-1 backdrop-blur-xl">
                {onEdit && (
                  <DropdownMenuItem
                    onClick={onEdit}
                    className="flex items-center gap-2 text-xs font-semibold text-slate-650 dark:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-slate-800/40 rounded-lg cursor-pointer px-2 py-1.5"
                  >
                    <Pencil className="size-3.5 text-indigo-500" />
                    Edit Post
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem
                    onClick={onDelete}
                    className="flex items-center gap-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/35 rounded-lg cursor-pointer px-2 py-1.5"
                  >
                    <Trash2 className="size-3.5" />
                    Delete Post
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Title & Body */}
      <h3 className="mt-4 font-bold text-base text-slate-900 dark:text-slate-50 leading-snug">{post.title}</h3>
      <p
        className={cn(
          "mt-2 text-sm text-slate-600 dark:text-slate-350 leading-relaxed whitespace-pre-line",
          !expanded && "line-clamp-3",
        )}
      >
        {post.body}
      </p>
      {post.body.length > 180 && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-450 hover:underline"
        >
          {expanded ? "Show less" : "Read complete announcement"}
        </button>
      )}

      {post.imageUrl && (
        <div className="mt-4 rounded-xl overflow-hidden border border-slate-100 dark:border-white/5">
          <img src={post.imageUrl} alt="" className="w-full h-auto object-cover max-h-[300px]" />
        </div>
      )}

      {/* Target Audience Badge list */}
      {post.audience && post.audience.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5 items-center">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Audience:</span>
          {post.audience.map((aud) => (
            <Badge
              key={aud}
              variant="secondary"
              className="bg-slate-100 text-slate-600 border border-slate-200/50 dark:bg-slate-800/80 dark:text-slate-400 dark:border-slate-700/50 text-[9px] font-semibold px-2 py-0"
            >
              {aud}
            </Badge>
          ))}
        </div>
      )}

      {/* Poll Options Block */}
      {post.type === "Poll" && post.pollOptions && (
        <div className="mt-4 space-y-2.5">
          {post.pollOptions.map((opt) => {
            const totalVotes = post.pollOptions!.reduce((acc, o) => acc + o.votes, 0);
            const percentage = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
            const isVoted = post.pollVotedOptionId === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => {
                  if (post.pollVotedOptionId) return;
                  setState((s) => ({
                    ...s,
                    posts: s.posts.map((p) =>
                      p.id === post.id
                        ? {
                            ...p,
                            pollVotedOptionId: opt.id,
                            pollOptions: p.pollOptions?.map((o) =>
                              o.id === opt.id ? { ...o, votes: o.votes + 1 } : o,
                            ),
                          }
                        : p,
                    ),
                  }));
                }}
                disabled={!!post.pollVotedOptionId}
                className={cn(
                  "relative w-full overflow-hidden rounded-xl border p-3.5 text-left text-xs transition-all duration-300",
                  isVoted
                    ? "border-emerald-500 bg-emerald-500/5 dark:bg-emerald-950/20"
                    : "border-slate-200/60 dark:border-slate-800/50 hover:bg-slate-100/50 dark:hover:bg-slate-800/30",
                )}
              >
                {post.pollVotedOptionId && (
                  <div
                    className="absolute inset-y-0 left-0 bg-emerald-500/10 dark:bg-emerald-500/20 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                )}
                <div className="relative flex items-center justify-between">
                  <span className={cn("font-semibold text-slate-700 dark:text-slate-250 flex items-center gap-1.5", isVoted && "text-emerald-600 dark:text-emerald-400")}>
                    {isVoted && <CheckCircle2 className="size-3.5 shrink-0 text-emerald-500" />}
                    {opt.text}
                  </span>
                  {post.pollVotedOptionId && (
                    <span className="text-xs font-bold font-mono text-slate-500 dark:text-slate-400">{percentage}%</span>
                  )}
                </div>
              </button>
            );
          })}
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-2">
            {post.pollOptions.reduce((acc, o) => acc + o.votes, 0)} votes casted
          </div>
        </div>
      )}

      {/* Action Toolbar */}
      <div className="mt-4 flex items-center gap-1 border-t border-slate-100 dark:border-white/5 pt-2.5">
        <Button variant="ghost" size="sm" onClick={toggleLike} className="gap-1.5 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 hover:text-rose-600">
          <Heart className={cn("size-4 transition-transform active:scale-125", post.likedByMe && "fill-rose-500 text-rose-500")} />
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">{post.likes}</span>
        </Button>
        {post.type !== "Notice" && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCommentsOpen((v) => !v)}
            className="gap-1.5 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 hover:text-emerald-600"
          >
            <MessageCircle className="size-4" />
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">{post.comments.length}</span>
          </Button>
        )}
        <Button variant="ghost" size="sm" onClick={share} className="gap-1.5 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 hover:text-emerald-600">
          <Share2 className="size-4" />
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Share</span>
        </Button>
      </div>

      {/* Comments Block Drawer */}
      {commentsOpen && post.type !== "Notice" && (
        <div className="mt-4 space-y-3.5 border-t border-slate-100 dark:border-white/5 pt-4 animate-in slide-in-from-top-2 duration-300">
          {post.comments.length === 0 && (
            <p className="text-xs text-slate-400 dark:text-slate-500 italic pl-1">No comments posted yet. Be the first to start the discussion!</p>
          )}
          {post.comments.map((c) => (
            <div key={c.id} className="flex items-start gap-2.5">
              <AvatarCircle name={c.author} size={28} />
              <div className="flex-1 rounded-2xl bg-slate-50/60 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{c.author}</span>
                  <span className="text-[9px] text-slate-400">{timeAgo(c.createdAt)}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-350 mt-1 leading-relaxed">{c.text}</p>
              </div>
            </div>
          ))}

          {/* New comment input block */}
          <div className="flex items-center gap-2 pt-2">
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendComment()}
              placeholder="Write a constructive reply..."
              className="bg-white/50 dark:bg-slate-900/50 border-slate-200/60 focus-visible:ring-emerald-500/20 text-xs"
            />
            <Button size="icon" onClick={sendComment} className="bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-600 dark:hover:bg-emerald-700 shrink-0">
              <Send className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
