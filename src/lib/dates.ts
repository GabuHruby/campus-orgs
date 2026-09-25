export type DateSection = 'Today' | 'This Week' | 'Later';

export const SECTION_ORDER: readonly DateSection[] = ['Today', 'This Week', 'Later'];

function startOfDay(d: Date): Date {
  const s = new Date(d);
  s.setHours(0, 0, 0, 0);
  return s;
}

const DAY = 24 * 60 * 60 * 1000;

/** Today = same calendar day; This Week = within the next 7 days; Later = beyond. */
export function sectionFor(iso: string, now: Date = new Date()): DateSection {
  const days = Math.floor((startOfDay(new Date(iso)).getTime() - startOfDay(now).getTime()) / DAY);
  if (days <= 0) return 'Today';
  if (days < 7) return 'This Week';
  return 'Later';
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

/** "Fri, Sep 25 · 7:00 PM", or "Today · 7:00 PM" / "Tomorrow · 7:00 PM". */
export function formatEventWhen(iso: string, now: Date = new Date()): string {
  const d = new Date(iso);
  const days = Math.round((startOfDay(d).getTime() - startOfDay(now).getTime()) / DAY);
  const day =
    days === 0
      ? 'Today'
      : days === 1
        ? 'Tomorrow'
        : d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  return `${day} · ${formatTime(iso)}`;
}

/** Month + day for the calendar tile on event cards, e.g. { month: 'SEP', day: '25' }. */
export function dateTile(iso: string): { month: string; day: string } {
  const d = new Date(iso);
  return {
    month: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
    day: String(d.getDate()),
  };
}

/** "3h ago", "2d ago", "just now". */
export function timeAgo(iso: string, now: Date = new Date()): string {
  const mins = Math.floor((now.getTime() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}
