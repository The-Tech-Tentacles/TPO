"use client";

import { useState } from "react";
import { Calendar as CalendarIcon, Clock, MapPin, Video } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const EVENTS = [
  {
    id: 1,
    title: "TCS Ninja Campus Drive",
    date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 2),
    time: "09:00 AM - 05:00 PM",
    location: "Main Auditorium",
    type: "Placement",
    isOnline: false,
  },
  {
    id: 2,
    title: "Resume Building Workshop",
    date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 5),
    time: "02:00 PM - 04:00 PM",
    location: "Online",
    type: "Workshop",
    isOnline: true,
  },
  {
    id: 3,
    title: "Mock Interview Session",
    date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 7),
    time: "10:00 AM - 01:00 PM",
    location: "Seminar Hall 2",
    type: "Training",
    isOnline: false,
  },
  {
    id: 4,
    title: "Aptitude Test Series - 3",
    date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 10),
    time: "04:00 PM - 05:30 PM",
    location: "Online",
    type: "Assessment",
    isOnline: true,
  },
];

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const selectedDateEvents = EVENTS.filter(
    (event) => date && event.date.toDateString() === date.toDateString()
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Track upcoming placements, training sessions, and events.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[auto_1fr]">
        <Card className="w-full h-fit border-emerald-100/50 dark:border-emerald-900/20 shadow-sm md:max-w-sm">
          <CardContent className="p-4 md:p-3">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md w-full"
              modifiers={{
                event: EVENTS.map(e => e.date)
              }}
              modifiersStyles={{
                event: { fontWeight: 'bold', textDecoration: 'underline', textDecorationColor: '#10b981' }
              }}
            />
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 flex items-center gap-2">
            <CalendarIcon className="size-5 text-emerald-600 dark:text-emerald-500" />
            {date ? date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : 'Upcoming Events'}
          </h2>

          {selectedDateEvents.length > 0 ? (
            <div className="grid gap-4">
              {selectedDateEvents.map((event) => (
                <Card key={event.id} className="border-emerald-100/50 dark:border-emerald-900/20 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between gap-4">
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                      <Badge variant={event.type === 'Placement' ? 'default' : 'secondary'} className={event.type === 'Placement' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}>
                        {event.type}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2 text-sm text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        <Clock className="size-4 text-emerald-600/70" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {event.isOnline ? (
                          <Video className="size-4 text-emerald-600/70" />
                        ) : (
                          <MapPin className="size-4 text-emerald-600/70" />
                        )}
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg border-dashed border-slate-200 dark:border-slate-800">
              <div className="rounded-full bg-slate-100 p-3 dark:bg-slate-800 mb-3">
                <CalendarIcon className="size-6 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-50">No events scheduled</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mt-1">
                There are no training or placement events scheduled for this day.
              </p>
            </div>
          )}

          <div className="mt-8">
            <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50 mb-4">
              All Upcoming Events
            </h3>
            <div className="grid gap-3">
              {EVENTS.sort((a, b) => a.date.getTime() - b.date.getTime()).map((event) => (
                <div key={event.id} className="flex items-start gap-4 p-3 rounded-lg border border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/50 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors" onClick={() => setDate(event.date)}>
                  <div className="flex flex-col items-center justify-center min-w-[3rem] px-2 py-1 rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-500 uppercase">{event.date.toLocaleString('default', { month: 'short' })}</span>
                    <span className="text-lg font-bold text-slate-900 dark:text-slate-50 leading-none">{event.date.getDate()}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-slate-50 text-sm">{event.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{event.time} • {event.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
