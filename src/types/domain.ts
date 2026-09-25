// All domain types live here. UI and data layers both import from this file.

export type ClubCategory =
  | 'Business'
  | 'Tech'
  | 'Cultural'
  | 'Service'
  | 'Sports'
  | 'Arts'
  | 'Pre-Professional';

export type Club = {
  id: string;
  name: string;
  shortDescription: string;
  category: ClubCategory;
  emoji: string;
  avatarColor: string;
  memberCount: number;
};

export type Event = {
  id: string;
  clubId: string;
  title: string;
  description: string;
  // ISO 8601 strings: serializable for AsyncStorage now and DynamoDB/AppSync later.
  startTime: string;
  endTime: string;
  location: string;
  rsvpCount: number;
};

export type Announcement = {
  id: string;
  clubId: string;
  title: string;
  body: string;
  postedAt: string;
};

export type DemoUser = {
  id: string;
  name: string;
  joinedClubIds: string[];
  rsvpedEventIds: string[];
};

