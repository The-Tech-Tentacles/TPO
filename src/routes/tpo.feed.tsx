import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/lib/store";
import { DEPARTMENTS } from "@/lib/dummy-data";
import type { Post } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FeedCard } from "@/components/FeedCard";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tpo/feed")({ component: TpoFeed });

function TpoFeed() {
  const { state, setState, user } = useApp();
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Feed</h1>
          <p className="text-sm text-muted-foreground">Posts, notices, and messages for students.</p>
        </div>
      </div>

      <div className="mx-auto grid max-w-2xl gap-3">
        {state.posts.map((p) => (
          <FeedCard key={p.id} post={p} canManage onDelete={() => { setState((s) => ({ ...s, posts: s.posts.filter((x) => x.id !== p.id) })); toast.success("Post deleted"); }} />
        ))}
      </div>

      <Button onClick={() => setOpen(true)} size="lg" className="fixed bottom-6 right-6 h-14 rounded-full shadow-xl gap-2"><Plus className="size-5" />Create Post</Button>

      <CreatePostDialog
        open={open}
        onOpenChange={setOpen}
        onSave={(p) => {
          setState((s) => ({ ...s, posts: [{ ...p, id: `p-${Date.now()}`, authorName: user?.name ?? "TPO", authorRole: "TPO Admin", createdAt: new Date().toISOString(), likes: 0, comments: [] }, ...s.posts] }));
          toast.success("Published");
          setOpen(false);
        }}
      />
    </div>
  );
}

function CreatePostDialog({ open, onOpenChange, onSave }: { open: boolean; onOpenChange: (b: boolean) => void; onSave: (p: Post) => void }) {
  const [type, setType] = useState<Post["type"]>("Post");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [audience, setAudience] = useState<string[]>([]);

  const toggleAud = (a: string) => setAudience((arr) => arr.includes(a) ? arr.filter((x) => x !== a) : [...arr, a]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader><DialogTitle>Create</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <Tabs value={type} onValueChange={(v) => setType(v as Post["type"])}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="Post">Post</TabsTrigger>
              <TabsTrigger value="Notice">Notice</TabsTrigger>
              <TabsTrigger value="Message">Message</TabsTrigger>
            </TabsList>
          </Tabs>
          <div><Label className="text-xs">Title</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
          <div><Label className="text-xs">Body</Label><Textarea rows={5} value={body} onChange={(e) => setBody(e.target.value)} /></div>
          <div><Label className="text-xs">Media (optional)</Label><Input type="file" accept="image/*" /></div>
          <div>
            <Label className="text-xs">Target audience</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {[ "All Students", ...DEPARTMENTS, "First", "Second", "Third", "Fourth"].map((a) => (
                <button key={a} type="button" onClick={() => toggleAud(a)} className={cn("rounded-full border px-3 py-1 text-xs font-medium", audience.includes(a) ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:bg-secondary")}>
                  {a}
                </button>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter className="flex-col-reverse sm:flex-row">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Save as Draft</Button>
          <Button onClick={() => onSave({ id: "", type, title, body, audience, authorName: "", authorRole: "", createdAt: "", likes: 0, comments: [] })} disabled={!title.trim() || !body.trim()}>Publish</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
