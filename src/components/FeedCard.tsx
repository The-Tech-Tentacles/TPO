import { useState } from "react";
import { Heart, MessageCircle, Share2, Send } from "lucide-react";
import type { Post } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AvatarCircle } from "./AvatarCircle";
import { timeAgo, useApp } from "@/lib/store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const typeStyles: Record<Post["type"], string> = {
  Notice: "bg-amber-100 text-amber-800 border-amber-200",
  Post: "bg-indigo-100 text-indigo-800 border-indigo-200",
  Poll: "bg-emerald-100 text-emerald-800 border-emerald-200",
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
      toast.success("Link copied");
    } catch {
      toast.error("Could not copy");
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
                  author: user?.name ?? "You",
                  role: user?.role ?? "Student",
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

  return (
    <Card className="overflow-hidden rounded-xl border-border/60 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <AvatarCircle name={post.authorName} />
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-sm">{post.authorName}</span>
            </div>
            <div className="text-xs text-muted-foreground">{timeAgo(post.createdAt)}</div>
          </div>
        </div>
        <Badge variant="outline" className={cn("border", typeStyles[post.type])}>
          {post.type}
        </Badge>
      </div>

      <h3 className="mt-3 font-bold text-[15px] leading-snug">{post.title}</h3>
      <p
        className={cn(
          "mt-1 text-sm text-foreground/80 whitespace-pre-line",
          !expanded && "line-clamp-2",
        )}
      >
        {post.body}
      </p>
      {post.body.length > 120 && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-1 text-xs font-medium text-primary hover:underline"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}

      {post.imageUrl && (
        <img src={post.imageUrl} alt="" className="mt-3 w-full rounded-lg border" />
      )}

      {post.type === "Poll" && post.pollOptions && (
        <div className="mt-4 space-y-2">
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
                  "relative w-full overflow-hidden rounded-lg border p-3 text-left text-sm transition-colors",
                  isVoted ? "border-emerald-500 bg-emerald-50" : "hover:bg-muted",
                )}
              >
                {post.pollVotedOptionId && (
                  <div
                    className="absolute inset-y-0 left-0 bg-emerald-100 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                )}
                <div className="relative flex items-center justify-between">
                  <span className={cn("font-medium", isVoted && "text-emerald-700")}>
                    {opt.text}
                  </span>
                  {post.pollVotedOptionId && (
                    <span className="text-xs text-muted-foreground">{percentage}%</span>
                  )}
                </div>
              </button>
            );
          })}
          <div className="text-xs text-muted-foreground mt-2">
            {post.pollOptions.reduce((acc, o) => acc + o.votes, 0)} votes
          </div>
        </div>
      )}

      <div className="mt-3 flex items-center gap-1 border-t pt-2">
        <Button variant="ghost" size="sm" onClick={toggleLike} className="gap-1.5">
          <Heart className={cn("size-4", post.likedByMe && "fill-destructive text-destructive")} />
          <span className="text-xs">{post.likes}</span>
        </Button>
        {post.type !== "Notice" && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCommentsOpen((v) => !v)}
            className="gap-1.5"
          >
            <MessageCircle className="size-4" />
            <span className="text-xs">{post.comments.length}</span>
          </Button>
        )}
        <Button variant="ghost" size="sm" onClick={share} className="gap-1.5">
          <Share2 className="size-4" />
          <span className="text-xs">Share</span>
        </Button>
        {canManage && (
          <div className="ml-auto flex gap-1">
            {onEdit && (
              <Button variant="ghost" size="sm" onClick={onEdit}>
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onDelete}
                className="text-destructive hover:text-destructive"
              >
                Delete
              </Button>
            )}
          </div>
        )}
      </div>

      {commentsOpen && post.type !== "Notice" && (
        <div className="mt-3 space-y-3 border-t pt-3">
          {post.comments.length === 0 && (
            <p className="text-xs text-muted-foreground">Be the first to comment</p>
          )}
          {post.comments.map((c) => (
            <div key={c.id} className="flex items-start gap-2">
              <AvatarCircle name={c.author} size={28} />
              <div className="flex-1 rounded-lg bg-muted p-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold">{c.author}</span>
                  <span className="text-[10px] text-muted-foreground">{timeAgo(c.createdAt)}</span>
                </div>
                <p className="text-sm">{c.text}</p>
              </div>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendComment()}
              placeholder="Write a reply…"
            />
            <Button size="icon" onClick={sendComment}>
              <Send className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
