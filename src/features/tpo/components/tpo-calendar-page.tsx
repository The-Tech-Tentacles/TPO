"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  Plus,
  Clock,
  MapPin,
  Video,
  Trash2,
  Pencil,
  ChevronRight,
  Users,
  Filter,
  Search,
  X,
  CalendarCheck,
  MoreHorizontal,
} from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useApp } from "@/lib/store";
import type { CalendarEvent, EventType } from "@/lib/types";
import { cn } from "@/lib/utils";

const glass =
  "rounded-2xl border border-white/40 bg-white/50 shadow-xl shadow-emerald-900/5 backdrop-blur-2xl ring-1 ring-white/50 dark:border-white/10 dark:bg-slate-900/50 dark:ring-white/10 transition-all";

const EVENT_TYPES: EventType[] = ["Placement", "Workshop", "Training", "Assessment", "Other"];

const TYPE_STYLES: Record<EventType, { badge: string; dot: string; bg: string }> = {
  Placement: {
    badge: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800/50",
    dot: "bg-emerald-500",
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
  },
  Workshop: {
    badge: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800/50",
    dot: "bg-blue-500",
    bg: "bg-blue-50 dark:bg-blue-900/20",
  },
  Training: {
    badge: "bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-900/40 dark:text-violet-300 dark:border-violet-800/50",
    dot: "bg-violet-500",
    bg: "bg-violet-50 dark:bg-violet-900/20",
  },
  Assessment: {
    badge: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-800/50",
    dot: "bg-amber-500",
    bg: "bg-amber-50 dark:bg-amber-900/20",
  },
  Other: {
    badge: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
    dot: "bg-slate-400",
    bg: "bg-slate-50 dark:bg-slate-800/40",
  },
};

const ALL = "__all__";

// ─── Empty form ───────────────────────────────────────────────────────────────
const emptyForm = (): Partial<CalendarEvent> => ({
  title: "",
  date: new Date().toISOString().split("T")[0],
  time: "",
  location: "",
  isOnline: false,
  type: "Placement",
  description: "",
  targetAudience: "All Students",
});

// ─── Add / Edit Modal ─────────────────────────────────────────────────────────
function EventModal({
  open,
  initial,
  onClose,
  onSave,
}: {
  open: boolean;
  initial: Partial<CalendarEvent> | null;
  onClose: () => void;
  onSave: (ev: Partial<CalendarEvent>) => void;
}) {
  const { user } = useApp();
  const [form, setForm] = useState<Partial<CalendarEvent>>(initial ?? emptyForm());

  // Reset when re-opened
  const handleOpen = (o: boolean) => {
    if (!o) onClose();
    else setForm(initial ?? emptyForm());
  };

  const set = (k: keyof CalendarEvent, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const isEdit = !!initial?.id;

  const valid = form.title?.trim() && form.date && form.time?.trim() && form.location?.trim();

  const handleSave = () => {
    if (!valid) return;
    onSave({
      ...form,
      createdBy: user?.name ?? "TPO Admin",
      createdByRole: user?.role ?? "tpo-admin",
      createdAt: initial?.createdAt ?? new Date().toISOString(),
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarDays className="size-4 text-emerald-600" />
            {isEdit ? "Edit Event" : "Add New Event"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-1">
          {/* Title */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Event Title *</Label>
            <Input
              value={form.title ?? ""}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. TCS NQT Campus Drive"
            />
          </div>

          {/* Type */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Event Type *</Label>
            <Select value={form.type} onValueChange={(v) => set("type", v as EventType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EVENT_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date + Time */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Date *</Label>
              <Input
                type="date"
                value={form.date ?? ""}
                onChange={(e) => set("date", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Time *</Label>
              <Input
                value={form.time ?? ""}
                onChange={(e) => set("time", e.target.value)}
                placeholder="e.g. 10:00 AM – 01:00 PM"
              />
            </div>
          </div>

          {/* Online toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => set("isOnline", !form.isOnline)}
              className={cn(
                "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none",
                form.isOnline ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-700",
              )}
            >
              <span
                className={cn(
                  "pointer-events-none inline-block size-4 rounded-full bg-white shadow-sm ring-0 transition-transform duration-200",
                  form.isOnline ? "translate-x-4" : "translate-x-0",
                )}
              />
            </button>
            <Label className="text-sm font-medium cursor-pointer select-none">
              Online Event
            </Label>
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              {form.isOnline ? "Meeting Link / Platform *" : "Venue / Location *"}
            </Label>
            <Input
              value={form.location ?? ""}
              onChange={(e) => set("location", e.target.value)}
              placeholder={form.isOnline ? "e.g. Online – Google Meet" : "e.g. Main Auditorium, ADCET"}
            />
          </div>

          {/* Target Audience */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Target Audience</Label>
            <Input
              value={form.targetAudience ?? ""}
              onChange={(e) => set("targetAudience", e.target.value)}
              placeholder="e.g. Final Year – CSE, IT or All Students"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Description</Label>
            <Textarea
              value={form.description ?? ""}
              onChange={(e) => set("description", e.target.value)}
              rows={3}
              placeholder="Additional details about the event…"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            onClick={handleSave}
            disabled={!valid}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {isEdit ? "Save Changes" : "Create Event"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Event Card ───────────────────────────────────────────────────────────────
function EventCard({
  event,
  onEdit,
  onDelete,
}: {
  event: CalendarEvent;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const style = TYPE_STYLES[event.type] ?? TYPE_STYLES.Other;
  const eventDate = new Date(event.date + "T00:00:00");
  const isToday = eventDate.toDateString() === new Date().toDateString();
  const isPast = eventDate < new Date(new Date().toDateString());

  return (
    <div
      className={cn(
        "group flex gap-4 rounded-2xl border p-4 transition-all hover:shadow-md",
        isPast
          ? "border-slate-100 bg-slate-50/50 dark:border-white/5 dark:bg-slate-900/30 opacity-60"
          : "border-white/60 bg-white/70 shadow-sm dark:border-white/10 dark:bg-slate-900/50",
      )}
    >
      {/* Date block */}
      <div className={cn("flex flex-col items-center justify-center min-w-[3.5rem] rounded-xl px-2 py-2 text-center", style.bg)}>
        <span className={cn("text-[10px] font-bold uppercase tracking-widest", style.dot.replace("bg-", "text-"))}>
          {eventDate.toLocaleString("default", { month: "short" })}
        </span>
        <span className="text-2xl font-bold text-slate-800 dark:text-slate-100 leading-none mt-0.5">
          {eventDate.getDate()}
        </span>
        <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
          {eventDate.toLocaleString("default", { weekday: "short" })}
        </span>
        {isToday && (
          <span className="mt-1 text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">Today</span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-start gap-2 mb-1.5">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-snug">{event.title}</h3>
          <Badge className={cn("text-[10px] px-1.5 py-0 border", style.badge)} variant="outline">
            {event.type}
          </Badge>
          {isPast && (
            <Badge className="text-[10px] px-1.5 py-0 border border-slate-200 bg-slate-100 text-slate-500" variant="outline">
              Past
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <Clock className="size-3 shrink-0" />
            {event.time}
          </span>
          <span className="flex items-center gap-1">
            {event.isOnline
              ? <Video className="size-3 shrink-0 text-emerald-500" />
              : <MapPin className="size-3 shrink-0" />}
            {event.location}
          </span>
          {event.targetAudience && (
            <span className="flex items-center gap-1">
              <Users className="size-3 shrink-0" />
              {event.targetAudience}
            </span>
          )}
        </div>

        {event.description && (
          <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{event.description}</p>
        )}

        <p className="mt-1.5 text-[11px] text-slate-400 dark:text-slate-600">
          Created by {event.createdBy} · {event.createdByRole}
        </p>
      </div>

      {/* Actions */}
      <div className="shrink-0 flex items-start">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-slate-400 hover:text-slate-600 hover:bg-slate-100/50 dark:text-slate-500 dark:hover:text-slate-300 dark:hover:bg-slate-800/35 rounded-lg"
            >
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit} className="gap-2">
              <Pencil className="size-3.5" /> Edit Event
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onDelete}
              className="gap-2 text-destructive focus:text-destructive"
            >
              <Trash2 className="size-3.5" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export function TpoCalendarPage() {
  const { state, setState, user } = useApp();
  const [q, setQ] = useState("");
  const [filterType, setFilterType] = useState<string>(ALL);
  const [showPast, setShowPast] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<CalendarEvent | null>(null);

  const today = new Date().toDateString();

  const events = useMemo(() => {
    let list = [...state.events].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
    if (!showPast) list = list.filter((e) => new Date(e.date + "T00:00:00") >= new Date(today));
    if (filterType !== ALL) list = list.filter((e) => e.type === filterType);
    if (q.trim()) {
      const lq = q.toLowerCase();
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(lq) ||
          e.location.toLowerCase().includes(lq) ||
          e.createdBy.toLowerCase().includes(lq) ||
          (e.targetAudience ?? "").toLowerCase().includes(lq),
      );
    }
    return list;
  }, [state.events, filterType, q, showPast, today]);

  // Group by month
  const grouped = useMemo(() => {
    return events.reduce(
      (acc, ev) => {
        const key = new Date(ev.date + "T00:00:00").toLocaleString("default", {
          month: "long",
          year: "numeric",
        });
        if (!acc[key]) acc[key] = [];
        acc[key].push(ev);
        return acc;
      },
      {} as Record<string, CalendarEvent[]>,
    );
  }, [events]);

  const openAdd = () => {
    setEditTarget(null);
    setModalOpen(true);
  };

  const openEdit = (ev: CalendarEvent) => {
    setEditTarget(ev);
    setModalOpen(true);
  };

  const handleSave = (data: Partial<CalendarEvent>) => {
    if (editTarget) {
      setState((s) => ({
        ...s,
        events: s.events.map((e) => (e.id === editTarget.id ? { ...e, ...data } : e)),
      }));
      toast.success("Event updated");
    } else {
      const newEv: CalendarEvent = {
        ...(data as CalendarEvent),
        id: `ev-${Date.now()}`,
        createdBy: user?.name ?? "TPO Admin",
        createdByRole: user?.role ?? "tpo-admin",
        createdAt: new Date().toISOString(),
      };
      setState((s) => ({ ...s, events: [...s.events, newEv] }));
      toast.success("Event created");
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setState((s) => ({ ...s, events: s.events.filter((e) => e.id !== id) }));
    toast.success("Event deleted");
  };

  // Counts
  const todayStart = new Date(today);
  const totalCount = state.events.length;
  
  // Calculate upcoming events
  const upcomingEvents = state.events.filter((e) => new Date(e.date + "T00:00:00") >= todayStart);
  const upcomingCount = upcomingEvents.length;

  // diff to Sunday
  const diff = todayStart.getDay() === 0 ? 6 : todayStart.getDay() - 1;
  const startOfWeek = new Date(todayStart);
  startOfWeek.setDate(todayStart.getDate() - diff);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  // diff to end of month
  const endOfMonth = new Date(todayStart.getFullYear(), todayStart.getMonth() + 1, 0, 23, 59, 59, 999);

  // diff to end of year
  const endOfYear = new Date(todayStart.getFullYear(), 11, 31, 23, 59, 59, 999);

  const thisWeekCount = upcomingEvents.filter((e) => {
    const evDate = new Date(e.date + "T00:00:00");
    return evDate <= endOfWeek;
  }).length;

  const thisMonthCount = upcomingEvents.filter((e) => {
    const evDate = new Date(e.date + "T00:00:00");
    return evDate <= endOfMonth;
  }).length;

  const thisYearCount = upcomingEvents.filter((e) => {
    const evDate = new Date(e.date + "T00:00:00");
    return evDate <= endOfYear;
  }).length;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* ── Header ── */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Calendar</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {state.settings.collegeName} · Schedule and manage placement events
          </p>
        </div>
        <Button
          onClick={openAdd}
          className="mt-3 sm:mt-0 gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-900/10"
        >
          <Plus className="size-4" />
          Add Event
        </Button>
      </div>

      {/* ── Summary cards ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Total Events Card */}
        <Card className={cn(glass, "p-6 hover:shadow-2xl transition-all duration-300 group")}>
          <div className="flex flex-col justify-between h-full">
            <div className="flex items-center gap-3">
              <div className="inline-grid size-10 place-items-center rounded-xl border bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/40 shadow-sm animate-pulse-slow">
                <CalendarDays className="size-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400">Total Events</h3>
                <div className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mt-0.5 tracking-tight">
                  {totalCount}
                </div>
              </div>
            </div>
            
            {/* Breakdown inside total: training, placement, workshop, etc in one line */}
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-slate-100/60 dark:border-white/5 pt-4">
              {EVENT_TYPES.map((type) => {
                const count = state.events.filter((e) => e.type === type).length;
                const styles = TYPE_STYLES[type] ?? TYPE_STYLES.Other;
                return (
                  <div key={type} className="flex items-center gap-1.5 text-xs">
                    <span className={cn("size-2 rounded-full", styles.dot)} />
                    <span className="font-semibold text-slate-500 dark:text-slate-400">{type}:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Upcoming Events Card */}
        <Card className={cn(glass, "p-6 hover:shadow-2xl transition-all duration-300 group")}>
          <div className="flex flex-col justify-between h-full">
            <div className="flex items-center gap-3">
              <div className="inline-grid size-10 place-items-center rounded-xl border bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800/40 shadow-sm animate-pulse-slow">
                <CalendarCheck className="size-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400">Upcoming Events</h3>
                <div className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mt-0.5 tracking-tight">
                  {upcomingCount}
                </div>
              </div>
            </div>

            {/* Breakdown inside upcoming: this week, this month, this year in one line */}
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-slate-100/60 dark:border-white/5 pt-4">
              {[
                { label: "This Week", count: thisWeekCount, dot: "bg-emerald-500" },
                { label: "This Month", count: thisMonthCount, dot: "bg-blue-500" },
                { label: "This Year", count: thisYearCount, dot: "bg-violet-500" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-1.5 text-xs">
                  <span className={cn("size-2 rounded-full", item.dot)} />
                  <span className="font-semibold text-slate-500 dark:text-slate-400">{item.label}:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* ── Filters ── */}
      <Card className={cn(glass, "p-4")}>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search events, location, faculty…"
              className="pl-9"
            />
            {q && (
              <button onClick={() => setQ("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="size-3.5 text-slate-400 hover:text-slate-600" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <Filter className="size-4 text-slate-400" />
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="h-9 w-36">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All Types</SelectItem>
                {EVENT_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <button
            onClick={() => setShowPast(!showPast)}
            className={cn(
              "flex items-center gap-1.5 rounded-lg border px-3 h-9 text-sm font-medium transition-colors",
              showPast
                ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/50 dark:bg-emerald-900/20 dark:text-emerald-400"
                : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 dark:border-white/10 dark:bg-slate-800/50 dark:text-slate-400",
            )}
          >
            <Clock className="size-3.5" />
            {showPast ? "Hiding Past" : "Show Past"}
          </button>

          <span className="text-xs text-slate-400 dark:text-slate-500 ml-auto">
            {events.length} event{events.length !== 1 ? "s" : ""}
          </span>
        </div>
      </Card>

      {/* ── Event list grouped by month ── */}
      {Object.keys(grouped).length === 0 ? (
        <Card className={cn(glass, "p-16 flex flex-col items-center justify-center text-center")}>
          <div className="inline-grid size-14 place-items-center rounded-2xl bg-slate-100 dark:bg-slate-800 mb-4">
            <CalendarDays className="size-6 text-slate-400" />
          </div>
          <h3 className="font-semibold text-slate-700 dark:text-slate-300">No events found</h3>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1 max-w-xs">
            {q || filterType !== ALL
              ? "Try clearing your filters to see all events."
              : "Get started by adding your first placement or training event."}
          </p>
          <Button onClick={openAdd} className="mt-5 gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
            <Plus className="size-4" /> Add Event
          </Button>
        </Card>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([month, monthEvents]) => (
            <div key={month}>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  {month}
                </h2>
                <div className="flex-1 h-px bg-slate-100 dark:bg-white/10" />
                <span className="text-xs text-slate-400">{monthEvents.length} event{monthEvents.length !== 1 ? "s" : ""}</span>
              </div>
              <div className="space-y-3">
                {monthEvents.map((ev) => (
                  <EventCard
                    key={ev.id}
                    event={ev}
                    onEdit={() => openEdit(ev)}
                    onDelete={() => handleDelete(ev.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Modal ── */}
      <EventModal
        open={modalOpen}
        initial={editTarget}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
