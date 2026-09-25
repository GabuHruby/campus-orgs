import AsyncStorage from '@react-native-async-storage/async-storage';

import type { DataRepository } from '@/data/DataRepository';
import { createSeed, type SeedData } from '@/data/seed';
import type {
  Announcement,
  Club,
  ClubMember,
  DemoUser,
  Event,
  Message,
  Person,
} from '@/types/domain';

// Bump the version if the saved shape changes; old data is then ignored.
const STORAGE_KEY = 'clubhq:user:v1';

// Only the user's choices are saved, never events or counts: dates are regenerated
// relative to today on every launch, and counts are re-derived from the seed.
type SavedUser = { joinedClubIds: string[]; rsvpedEventIds: string[] };

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((v) => typeof v === 'string');
}

function parseSaved(raw: string | null): SavedUser | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return null;
    const { joinedClubIds, rsvpedEventIds } = parsed as Record<string, unknown>;
    if (!isStringArray(joinedClubIds) || !isStringArray(rsvpedEventIds)) return null;
    return { joinedClubIds, rsvpedEventIds };
  } catch {
    return null;
  }
}

/** Calls adjust(id, -1) for ids dropped from `before` and adjust(id, +1) for ids added in `after`. */
function applyDiff(before: string[], after: string[], adjust: (id: string, delta: number) => void): void {
  for (const id of before) if (!after.includes(id)) adjust(id, -1);
  for (const id of after) if (!before.includes(id)) adjust(id, 1);
}

// Tier 1 implementation: seed data in memory, with the user's joins and RSVPs saved
// to AsyncStorage (localStorage on web) so they survive a refresh. Counts update on
// join/RSVP so the UI behaves like a real backend.
export class MockRepository implements DataRepository {
  private data: SeedData;
  private ready: Promise<void>;

  constructor(seed: SeedData = createSeed()) {
    this.data = seed;
    this.ready = this.restore();
  }

  // Replays saved choices on top of the fresh seed. Storage failures (private browsing,
  // quota) fall back to the seed so the demo always opens.
  private async restore(): Promise<void> {
    let saved: SavedUser | null = null;
    try {
      saved = parseSaved(await AsyncStorage.getItem(STORAGE_KEY));
    } catch {
      return;
    }
    if (!saved) return;

    const clubIds = new Set(this.data.clubs.map((c) => c.id));
    const eventIds = new Set(this.data.events.map((e) => e.id));
    const joined = saved.joinedClubIds.filter((id) => clubIds.has(id));
    const rsvped = saved.rsvpedEventIds.filter((id) => eventIds.has(id));

    applyDiff(this.data.user.joinedClubIds, joined, (id, delta) => this.adjustClub(id, delta));
    applyDiff(this.data.user.rsvpedEventIds, rsvped, (id, delta) => this.adjustEvent(id, delta));

    this.data.user.joinedClubIds = joined;
    this.data.user.rsvpedEventIds = rsvped;
  }

  private async persist(): Promise<void> {
    const { joinedClubIds, rsvpedEventIds } = this.data.user;
    const saved: SavedUser = { joinedClubIds, rsvpedEventIds };
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    } catch {
      // Not fatal: the change still applies for this session.
    }
  }

  async getClubs(): Promise<Club[]> {
    await this.ready;
    return this.data.clubs.map((c) => ({ ...c }));
  }

  async getEvents(): Promise<Event[]> {
    await this.ready;
    return this.data.events.map((e) => ({ ...e }));
  }

  async getAnnouncements(): Promise<Announcement[]> {
    return this.data.announcements.map((a) => ({ ...a }));
  }

  async getPeople(): Promise<Person[]> {
    return this.data.people.map((p) => ({ ...p }));
  }

  async getMembers(): Promise<ClubMember[]> {
    return this.data.members.map((m) => ({ ...m }));
  }

  async getMessages(): Promise<Message[]> {
    return this.data.messages.map((m) => ({ ...m }));
  }

  async getCurrentUser(): Promise<DemoUser> {
    await this.ready;
    const { user } = this.data;
    return { ...user, joinedClubIds: [...user.joinedClubIds], rsvpedEventIds: [...user.rsvpedEventIds] };
  }

  async joinClub(clubId: string): Promise<void> {
    await this.ready;
    const { user } = this.data;
    if (user.joinedClubIds.includes(clubId)) return;
    user.joinedClubIds.push(clubId);
    this.adjustClub(clubId, 1);
    await this.persist();
  }

  async leaveClub(clubId: string): Promise<void> {
    await this.ready;
    const { user } = this.data;
    if (!user.joinedClubIds.includes(clubId)) return;
    user.joinedClubIds = user.joinedClubIds.filter((id) => id !== clubId);
    this.adjustClub(clubId, -1);
    await this.persist();
  }

  async rsvp(eventId: string): Promise<void> {
    await this.ready;
    const { user } = this.data;
    if (user.rsvpedEventIds.includes(eventId)) return;
    user.rsvpedEventIds.push(eventId);
    this.adjustEvent(eventId, 1);
    await this.persist();
  }

  async cancelRsvp(eventId: string): Promise<void> {
    await this.ready;
    const { user } = this.data;
    if (!user.rsvpedEventIds.includes(eventId)) return;
    user.rsvpedEventIds = user.rsvpedEventIds.filter((id) => id !== eventId);
    this.adjustEvent(eventId, -1);
    await this.persist();
  }

  private adjustClub(clubId: string, delta: number): void {
    const club = this.data.clubs.find((c) => c.id === clubId);
    if (club) club.memberCount += delta;
  }

  private adjustEvent(eventId: string, delta: number): void {
    const event = this.data.events.find((e) => e.id === eventId);
    if (event) event.rsvpCount += delta;
  }
}
