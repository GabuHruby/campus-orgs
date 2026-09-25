import { isSameDay, SECTION_ORDER, sectionFor, type DateSection } from '@/lib/dates';
import type { Announcement, Club, Event } from '@/types/domain';

export type EventSection = { title: DateSection; events: Event[] };

/** Upcoming (not yet ended) events, soonest first, grouped into Today / This Week / Later. */
export function groupUpcomingEvents(events: Event[], now: Date = new Date()): EventSection[] {
  const upcoming = events
    .filter((e) => new Date(e.endTime).getTime() > now.getTime())
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return SECTION_ORDER.map((title) => ({
    title,
    events: upcoming.filter((e) => sectionFor(e.startTime, now) === title),
  })).filter((s) => s.events.length > 0);
}

export type DayGroup = { day: string; events: Event[] };

/** Upcoming events, soonest first, grouped by calendar day. `day` is the first event's start. */
export function groupByDay(events: Event[], now: Date = new Date()): DayGroup[] {
  const upcoming = events
    .filter((e) => new Date(e.endTime).getTime() > now.getTime())
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const groups: DayGroup[] = [];
  for (const e of upcoming) {
    const last = groups.at(-1);
    if (last && isSameDay(last.day, e.startTime)) last.events.push(e);
    else groups.push({ day: e.startTime, events: [e] });
  }
  return groups;
}

/** Newest first. */
export function sortAnnouncements(announcements: Announcement[]): Announcement[] {
  return [...announcements].sort((a, b) => b.postedAt.localeCompare(a.postedAt));
}

export function inClubs<T extends { clubId: string }>(items: T[], clubIds: string[]): T[] {
  return items.filter((i) => clubIds.includes(i.clubId));
}

export function clubsByPopularity(clubs: Club[]): Club[] {
  return [...clubs].sort((a, b) => b.memberCount - a.memberCount);
}
