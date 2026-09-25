import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

import type { DataRepository } from '@/data/DataRepository';
import { MockRepository } from '@/data/MockRepository';
import type {
  Announcement,
  Club,
  ClubMember,
  DemoUser,
  Event,
  Message,
  Person,
} from '@/types/domain';

type Snapshot = {
  clubs: Club[];
  events: Event[];
  announcements: Announcement[];
  people: Person[];
  members: ClubMember[];
  messages: Message[];
  user: DemoUser;
};

type AppData = Snapshot & {
  clubsById: Map<string, Club>;
  eventsById: Map<string, Event>;
  peopleById: Map<string, Person>;
  /** The person's leader/poster row in that club, if they have one. */
  roleIn: (clubId: string, personId: string) => ClubMember | undefined;
  isJoined: (clubId: string) => boolean;
  isRsvped: (eventId: string) => boolean;
  toggleJoin: (clubId: string) => Promise<void>;
  toggleRsvp: (eventId: string) => Promise<void>;
};

const AppDataContext = createContext<AppData | null>(null);

// The one line that picks the backend. Tier 2 swaps this for an AWS repository.
const defaultRepository: DataRepository = new MockRepository();

async function loadSnapshot(repo: DataRepository): Promise<Snapshot> {
  const [clubs, events, announcements, people, members, messages, user] = await Promise.all([
    repo.getClubs(),
    repo.getEvents(),
    repo.getAnnouncements(),
    repo.getPeople(),
    repo.getMembers(),
    repo.getMessages(),
    repo.getCurrentUser(),
  ]);
  return { clubs, events, announcements, people, members, messages, user };
}

type Props = { children: ReactNode; repository?: DataRepository };

export function AppDataProvider({ children, repository = defaultRepository }: Props) {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);

  const refresh = useCallback(async () => {
    setSnapshot(await loadSnapshot(repository));
  }, [repository]);

  // Initial load. The flag ignores a stale result if the repository changes mid-load.
  useEffect(() => {
    let cancelled = false;
    loadSnapshot(repository).then((s) => {
      if (!cancelled) setSnapshot(s);
    });
    return () => {
      cancelled = true;
    };
  }, [repository]);

  if (!snapshot) return null;

  const { user } = snapshot;
  const isJoined = (clubId: string) => user.joinedClubIds.includes(clubId);
  const isRsvped = (eventId: string) => user.rsvpedEventIds.includes(eventId);

  const value: AppData = {
    ...snapshot,
    clubsById: new Map(snapshot.clubs.map((c) => [c.id, c])),
    eventsById: new Map(snapshot.events.map((e) => [e.id, e])),
    peopleById: new Map(snapshot.people.map((p) => [p.id, p])),
    roleIn: (clubId, personId) =>
      snapshot.members.find((m) => m.clubId === clubId && m.personId === personId),
    isJoined,
    isRsvped,
    toggleJoin: async (clubId) => {
      await (isJoined(clubId) ? repository.leaveClub(clubId) : repository.joinClub(clubId));
      await refresh();
    },
    toggleRsvp: async (eventId) => {
      await (isRsvped(eventId) ? repository.cancelRsvp(eventId) : repository.rsvp(eventId));
      await refresh();
    },
  };

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData(): AppData {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used inside <AppDataProvider>');
  return ctx;
}
