// All domain types live here. UI and data layers both import from this file.

export type ClubCategory =
  | 'Business'
  | 'Tech'
  | 'Cultural'
  | 'Service'
  | 'Sports'
  | 'Arts'
  | 'Pre-Professional';

/**
 * leader: runs the club and decides who can post.
 * poster: a member a leader has allowed to post (e.g. Marketing).
 * member: everyone else who joined.
 */
export type ClubRole = 'leader' | 'poster' | 'member';

/**
 * Who can send messages in a club's channel. Leaders set this per club.
 * The demo seeds every club as 'posters'; 'everyone' turns the channel into a group chat.
 */
export type ChatPermission = 'posters' | 'everyone';

export type Club = {
  id: string;
  name: string;
  shortDescription: string;
  category: ClubCategory;
  emoji: string;
  avatarColor: string;
  memberCount: number;
  chatPermission: ChatPermission;
};

/** Anyone who can author messages. The demo user is a Person too. */
export type Person = {
  id: string;
  name: string;
  avatarColor: string;
};

/**
 * A person's role in one club. The seed only lists leaders and posters;
 * anyone who joined without a row here is a plain 'member'.
 */
export type ClubMember = {
  clubId: string;
  personId: string;
  role: ClubRole;
  /** Shown as the badge, e.g. "President" or "Marketing". Falls back to the role name. */
  title?: string;
};

/** A message in a club's channel. `eventId` attaches an event card to the message. */
export type Message = {
  id: string;
  clubId: string;
  authorId: string;
  body: string;
  sentAt: string;
  eventId?: string;
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
  authorId: string;
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

