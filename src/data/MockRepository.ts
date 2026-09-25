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

// Tier 1 implementation: in-memory seed data. Counts update on join/RSVP so the UI
// behaves like a real backend. Persistence (AsyncStorage) is added in a later step.
export class MockRepository implements DataRepository {
  private data: SeedData;

  constructor(seed: SeedData = createSeed()) {
    this.data = seed;
  }

  async getClubs(): Promise<Club[]> {
    return this.data.clubs.map((c) => ({ ...c }));
  }

  async getEvents(): Promise<Event[]> {
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
    const { user } = this.data;
    return { ...user, joinedClubIds: [...user.joinedClubIds], rsvpedEventIds: [...user.rsvpedEventIds] };
  }

  async joinClub(clubId: string): Promise<void> {
    const { user } = this.data;
    if (user.joinedClubIds.includes(clubId)) return;
    user.joinedClubIds.push(clubId);
    this.adjustClub(clubId, 1);
  }

  async leaveClub(clubId: string): Promise<void> {
    const { user } = this.data;
    if (!user.joinedClubIds.includes(clubId)) return;
    user.joinedClubIds = user.joinedClubIds.filter((id) => id !== clubId);
    this.adjustClub(clubId, -1);
  }

  async rsvp(eventId: string): Promise<void> {
    const { user } = this.data;
    if (user.rsvpedEventIds.includes(eventId)) return;
    user.rsvpedEventIds.push(eventId);
    this.adjustEvent(eventId, 1);
  }

  async cancelRsvp(eventId: string): Promise<void> {
    const { user } = this.data;
    if (!user.rsvpedEventIds.includes(eventId)) return;
    user.rsvpedEventIds = user.rsvpedEventIds.filter((id) => id !== eventId);
    this.adjustEvent(eventId, -1);
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
