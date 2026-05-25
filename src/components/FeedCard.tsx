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
  Message: "bg-emerald-100 text-emerald-800 border-emerald-200",
};

export function FeedCard({ post, canManage = false, onEdit, onDelete }: { post: Post; canManage?: boolean; onEdit?: () => void; onDelete?: () => void }) {
  const { setState, user } = useApp();
  const [expanded, setExpanded] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [draft, setDraft] = useState("");

  const toggleLike = () => {
    setState((s) => ({
      ...s,
      posts: s.posts.map((p) =>
        p.id === post.id ? { ...p, likedByMe: !p.likedByMe, likes: p.likes + (p.likedByMe ? -1 : 1) } : p,
      ),
    }));
  };

  const share = async () => {
    const url = typeof window !== "undefined" ? `${window.location.origin}/?post=${post.id}` : "";
    try { await navigator.clipboard.writeText(url); toast.success("Link copied"); } catch { toast.error("Could not copy"); }
  };

  const sendComment = () => {
    const text = draft.trim();
    if (!text) return;
    setState((s) => ({
      ...s,
      posts: s.posts.map((p) =>
        p.id === post.id
          ? { ...p, comments: [...p.comments, { id: `c${Date.now()}`, author: user?.name ?? "You", role: user?.role ?? "Student", text, createdAt: new Date().toISOString() }] }
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
              <span className="text-[11px] rounded-full bg-secondary px-2 py-0.5 text-secondary-foreground">{post.authorRole}</span>
            </div>
            <div className="text-xs text-muted-foreground">{timeAgo(post.createdAt)}</div>
          </div>
        </div>
        <Badge variant="outline" className={cn("border", typeStyles[post.type])}>{post.type}</Badge>
      </div>

      <h3 className="mt-3 font-bold text-[15px] leading-snug">{post.title}</h3>
      <p className={cn("mt-1 text-sm text-foreground/80 whitespace-pre-line", !expanded && "line-clamp-2")}>{post.body}</p>
      {post.body.length > 120 && (
        <button onClick={() => setExpanded((v) => !v)} className="mt-1 text-xs font-medium text-primary hover:underline">
          {expanded ? "Show less" : "Read more"}
        </button>
      )}

      {post.imageUrl && (
        <img src={post.imageUrl} alt="" className="mt-3 w-full rounded-lg border" />
      )}

      <div className="mt-3 flex items-center gap-1 border-t pt-2">
        <Button variant="ghost" size="sm" onClick={toggleLike} className="gap-1.5">
          <Heart className={cn("size-4", post.likedByMe && "fill-destructive text-destructive")} />
          <span className="text-xs">{post.likes}</span>
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setCommentsOpen((v) => !v)} className="gap-1.5">
          <MessageCircle className="size-4" /><span className="text-xs">{post.comments.length}</span>
        </Button>
        <Button variant="ghost" size="sm" onClick={share} className="gap-1.5">
          <Share2 className="size-4" /><span className="text-xs">Share</span>
        </Button>
        {canManage && (
          <div className="ml-auto flex gap-1">
            {onEdit && <Button variant="ghost" size="sm" onClick={onEdit}>Edit</Button>}
            {onDelete && <Button variant="ghost" size="sm" onClick={onDelete} className="text-destructive hover:text-destructive">Delete</Button>}
          </div>
        )}
      </div>

      {commentsOpen && (
        <div className="mt-3 space-y-3 border-t pt-3">
          {post.comments.length === 0 && <p className="text-xs text-muted-foreground">Be the first to comment</p>}
          {post.comments.map((c) => (
            <div key={c.id} className="flex items-start gap-2">
              <AvatarCircle name={c.author} size={28} />
              <div className="flex-1 rounded-lg bg-muted p-2">
                <div className="flex items-center gap-2"><span className="text-xs font-semibold">{c.author}</span><span className="text-[10px] text-muted-foreground">{timeAgo(c.createdAt)}</span></div>
                <p className="text-sm">{c.text}</p>
              </div>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <Input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendComment()} placeholder="Write a reply…" />
            <Button size="icon" onClick={sendComment}><Send className="size-4" /></Button>
          </div>
        </div>
      )}
    </Card>
  );
}
