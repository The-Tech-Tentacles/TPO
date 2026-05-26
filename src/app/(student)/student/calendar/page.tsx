"use client";

import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Clock, MapPin, Video, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/lib/store";
import type { CalendarEvent } from "@/lib/types";
import { cn } from "@/lib/utils";

type EventType = "Placement" | "Workshop" | "Training" | "Assessment" | "Other";

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

export default function CalendarPage() {
  const { state } = useApp();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const today = new Date().toDateString();

  useEffect(() => {
    setSelectedDate(new Date().toDateString());
  }, []);

  // Upcoming only, sorted by date
  const upcoming = [...state.events]
    .filter((e) => new Date(e.date + "T00:00:00") >= new Date(today))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const selectedDateEvents = selectedDate
    ? upcoming.filter((e) => new Date(e.date + "T00:00:00").toDateString() === selectedDate)
    : [];

  // Group by month
  const grouped = upcoming.reduce(
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

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 flex items-center gap-2">
          <CalendarIcon className="size-6 text-emerald-600 dark:text-emerald-500" />
          Upcoming Events
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Placement drives, workshops and training sessions
        </p>
      </div>

      {/* Selected date events */}
      {selectedDate && (
        <div className="grid gap-4">
          <h2 className="text-base font-semibold text-slate-800 dark:text-slate-200">
            {selectedDate === today
              ? "Today's Events"
              : new Date(selectedDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
          </h2>
          {selectedDateEvents.length > 0 ? (
            <div className="grid gap-3">
              {selectedDateEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center border rounded-2xl border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/10">
              <div className="rounded-full bg-slate-100 p-3 dark:bg-slate-800/80 mb-3 text-slate-400">
                <CalendarIcon className="size-6" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                No events scheduled
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1">
                There are no training or placement events scheduled for this day.
              </p>
            </div>
          )}
        </div>
      )}


      {/* All upcoming grouped by month */}
      {upcoming.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border rounded-xl border-dashed border-slate-200 dark:border-slate-800">
          <div className="rounded-full bg-slate-100 p-3 dark:bg-slate-800 mb-3">
            <CalendarIcon className="size-6 text-slate-400" />
          </div>
          <h3 className="text-base font-medium text-slate-900 dark:text-slate-50">No upcoming events</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mt-1">
            Check back soon — your TPO will announce new events here.
          </p>
        </div>
      ) : (
        <div className="grid gap-8">
          {Object.entries(grouped).map(([month, events]) => (
            <div key={month} className="space-y-4">
              <div className="flex items-center gap-3">
                <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  {month}
                </h3>
                <div className="flex-1 h-px bg-slate-100 dark:bg-white/10" />
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  {events.length} event{events.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="grid gap-3">
                {events.map((event) => {
                  const d = new Date(event.date + "T00:00:00");
                  return (
                    <EventCard
                      key={event.id}
                      event={event}
                      onClick={() => setSelectedDate(d.toDateString())}
                      isSelected={selectedDate === d.toDateString()}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EventCard({
  event,
  onClick,
  isSelected,
}: {
  event: CalendarEvent;
  onClick?: () => void;
  isSelected?: boolean;
}) {
  const style = TYPE_STYLES[event.type as EventType] ?? TYPE_STYLES.Other;
  const eventDate = new Date(event.date + "T00:00:00");
  const today = new Date().toDateString();
  const isToday = eventDate.toDateString() === today;
  const isPast = eventDate < new Date(today);

  return (
    <div
      onClick={onClick}
      className={cn(
        "group flex gap-4 rounded-2xl border p-4 transition-all hover:shadow-md",
        onClick && "cursor-pointer",
        isSelected
          ? "border-emerald-500/80 bg-emerald-50/20 dark:border-emerald-500/60 dark:bg-emerald-950/20 shadow-sm shadow-emerald-500/5 ring-1 ring-emerald-500/30"
          : isPast
            ? "border-slate-100 bg-slate-50/50 dark:border-white/5 dark:bg-slate-900/30 opacity-60"
            : "border-white/60 bg-white/70 shadow-sm dark:border-white/10 dark:bg-slate-900/50",
      )}
    >
      {/* Date block */}
      <div className={cn("flex flex-col items-center justify-center min-w-[3.5rem] rounded-xl px-2 py-2 text-center shadow-sm", style.bg)}>
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
            <Clock className="size-3.5 shrink-0 text-slate-400" />
            {event.time}
          </span>
          <span className="flex items-center gap-1">
            {event.isOnline
              ? <Video className="size-3.5 shrink-0 text-emerald-500" />
              : <MapPin className="size-3.5 shrink-0 text-slate-400" />}
            {event.location}
          </span>
          {event.targetAudience && (
            <span className="flex items-center gap-1">
              <Users className="size-3.5 shrink-0 text-slate-400" />
              {event.targetAudience}
            </span>
          )}
        </div>

        {event.description && (
          <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">{event.description}</p>
        )}
      </div>
    </div>
  );
}
