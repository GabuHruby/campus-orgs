import type { Announcement, Club, DemoUser, Event } from '@/types/domain';

// The seam between UI and data. Tier 1: MockRepository (local seed data).
// Tier 2: an AWS implementation (AppSync + DynamoDB) with the same methods.
// UI code only ever talks to this interface, so swapping backends touches no screens.
export interface DataRepository {
  getClubs(): Promise<Club[]>;
  getEvents(): Promise<Event[]>;
  getAnnouncements(): Promise<Announcement[]>;
  getCurrentUser(): Promise<DemoUser>;

  joinClub(clubId: string): Promise<void>;
  leaveClub(clubId: string): Promise<void>;
  rsvp(eventId: string): Promise<void>;
  cancelRsvp(eventId: string): Promise<void>;
}
