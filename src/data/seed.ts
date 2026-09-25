import type { Announcement, Club, DemoUser, Event } from '@/types/domain';
import { palette } from '@/theme';

// Every date is computed from `now` at runtime, so the demo never shows stale events.

const HOUR = 60 * 60 * 1000;

/** Calendar day `days` from now at a fixed local time, e.g. at(now, 2, 19) = in 2 days, 7 PM. */
function at(now: Date, days: number, hour: number, minute = 0): Date {
  const d = new Date(now);
  d.setDate(d.getDate() + days);
  d.setHours(hour, minute, 0, 0);
  return d;
}

/** `hours` from now, rounded up to the next half hour so times look natural. */
function hoursFromNow(now: Date, hours: number): Date {
  const d = new Date(now.getTime() + hours * HOUR);
  const roundUp = d.getMinutes() === 0 ? 0 : d.getMinutes() <= 30 ? 30 : 60;
  d.setMinutes(roundUp, 0, 0);
  return d;
}

/**
 * A few hours from now if that still lands at a sane hour today (8 AM–10 PM),
 * otherwise tomorrow at `fallbackHour`. Keeps "Today" populated during the day
 * without producing 1 AM events for late-night viewers.
 */
function soon(now: Date, hours: number, fallbackHour: number): Date {
  const d = hoursFromNow(now, hours);
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay && d.getHours() >= 8 && d.getHours() <= 22) return d;
  return at(now, d.getHours() < 8 && sameDay ? 0 : 1, fallbackHour);
}

function hoursAgo(now: Date, hours: number): string {
  return new Date(now.getTime() - hours * HOUR).toISOString();
}

type EventSeed = Omit<Event, 'startTime' | 'endTime'> & { start: Date; durationHours: number };

function toEvent({ start, durationHours, ...rest }: EventSeed): Event {
  return {
    ...rest,
    startTime: start.toISOString(),
    endTime: new Date(start.getTime() + durationHours * HOUR).toISOString(),
  };
}

export const DEMO_USER_ID = 'demo-user';

export type SeedData = {
  clubs: Club[];
  events: Event[];
  announcements: Announcement[];
  user: DemoUser;
};

export function createSeed(now: Date = new Date()): SeedData {
  const clubs: Club[] = [
    {
      id: 'sibc',
      name: 'SIBC',
      shortDescription:
        'Student International Business Council. Student-run consulting and development projects with global partners.',
      category: 'Business',
      emoji: '🌐',
      avatarColor: palette.blue600,
      memberCount: 612,
    },
    {
      id: 'investment-club',
      name: 'Irish Investment Club',
      shortDescription:
        'Pitch stocks, manage a real student portfolio, and learn markets from alumni in finance.',
      category: 'Business',
      emoji: '📈',
      avatarColor: palette.green500,
      memberCount: 348,
    },
    {
      id: 'irish-devs',
      name: 'Irish Developers',
      shortDescription:
        'Build things with code. Weekly hack nights, cloud workshops, and a team for every hackathon.',
      category: 'Tech',
      emoji: '💻',
      avatarColor: palette.navy900,
      memberCount: 275,
    },
    {
      id: 'japan-club',
      name: 'Japan Club',
      shortDescription:
        'Food, film, language tables, and festivals celebrating Japanese culture on campus.',
      category: 'Cultural',
      emoji: '🎌',
      avatarColor: palette.blue500,
      memberCount: 189,
    },
    {
      id: 'habitat',
      name: 'ND Habitat for Humanity',
      shortDescription:
        'Build affordable homes with families in South Bend. No construction experience needed.',
      category: 'Service',
      emoji: '🔨',
      avatarColor: palette.navy700,
      memberCount: 156,
    },
    {
      id: 'club-ultimate',
      name: 'Club Ultimate Frisbee',
      shortDescription:
        'Competitive and casual ultimate. Practices three times a week, tournaments every fall and spring.',
      category: 'Sports',
      emoji: '🥏',
      avatarColor: palette.green500,
      memberCount: 94,
    },
    {
      id: 'irish-stage',
      name: 'Irish Stage Company',
      shortDescription:
        'Student theatre: two mainstage shows a year, improv nights, and workshops for all experience levels.',
      category: 'Arts',
      emoji: '🎭',
      avatarColor: palette.blue600,
      memberCount: 131,
    },
    {
      id: 'pre-law',
      name: 'Pre-Law Society',
      shortDescription:
        'LSAT prep, law school admissions advice, moot court, and panels with practicing attorneys.',
      category: 'Pre-Professional',
      emoji: '⚖️',
      avatarColor: palette.navy900,
      memberCount: 223,
    },
  ];

  const eventSeeds: EventSeed[] = [
    // Soon: today when possible (see `soon`), so the "Today" section is usually populated
    {
      id: 'e1',
      clubId: 'sibc',
      title: 'General Meeting: Project Kickoff',
      description:
        'Meet this semester’s project teams, hear from our partner organizations, and learn how project placement works. New members especially welcome.',
      start: soon(now, 2, 17),
      durationHours: 1,
      location: 'Mendoza College of Business, Room 161',
      rsvpCount: 84,
    },
    {
      id: 'e2',
      clubId: 'club-ultimate',
      title: 'Open Pickup Practice',
      description:
        'Casual pickup for all skill levels. Bring cleats and water; discs provided. Great way to try the sport before committing.',
      start: soon(now, 3, 16),
      durationHours: 2,
      location: 'Riehle Fields',
      rsvpCount: 26,
    },
    // This week
    {
      id: 'e3',
      clubId: 'irish-devs',
      title: 'Intro to AWS: Deploy Your First App',
      description:
        'Hands-on workshop: take a simple web app from your laptop to a public URL with AWS Amplify. Bring a laptop; we’ll provide credits.',
      start: at(now, 1, 19),
      durationHours: 1.5,
      location: 'DeBartolo Hall, Room 129',
      rsvpCount: 56,
    },
    {
      id: 'e4',
      clubId: 'japan-club',
      title: 'Mochi Making Night',
      description:
        'Pound, shape, and eat fresh mochi. We’ll cover the history of mochitsuki and make both sweet and savory versions.',
      start: at(now, 1, 20),
      durationHours: 2,
      location: 'LaFortune Student Center Ballroom',
      rsvpCount: 72,
    },
    {
      id: 'e5',
      clubId: 'investment-club',
      title: 'Stock Pitch Night',
      description:
        'Five analyst teams pitch long/short ideas to the portfolio committee. Vote on which picks make it into the fund.',
      start: at(now, 2, 18, 30),
      durationHours: 1.5,
      location: 'Mendoza College of Business, Giovanini Commons',
      rsvpCount: 45,
    },
    {
      id: 'e6',
      clubId: 'pre-law',
      title: 'LSAT Strategy Session',
      description:
        'A 7Sage-certified tutor walks through logical reasoning strategies and how to build a study schedule that fits a full course load.',
      start: at(now, 2, 19),
      durationHours: 1,
      location: 'Hesburgh Library, Room 218',
      rsvpCount: 31,
    },
    {
      id: 'e7',
      clubId: 'habitat',
      title: 'Saturday Build Day',
      description:
        'Framing and drywall at our current site on the west side of South Bend. Transportation leaves from Main Circle. Lunch provided.',
      start: at(now, 3, 9),
      durationHours: 5,
      location: 'Meet at Main Circle',
      rsvpCount: 22,
    },
    {
      id: 'e8',
      clubId: 'irish-stage',
      title: 'Fall Show Auditions',
      description:
        'Auditions for our fall mainstage production. Prepare a one-minute monologue; sides will also be available at the door.',
      start: at(now, 3, 13),
      durationHours: 4,
      location: 'Washington Hall',
      rsvpCount: 38,
    },
    {
      id: 'e9',
      clubId: 'sibc',
      title: 'Case Competition Info Session',
      description:
        'Everything you need to know about the fall case competition: format, teams, timeline, and what judges look for.',
      start: at(now, 4, 19),
      durationHours: 1,
      location: 'Duncan Student Center, Room 314',
      rsvpCount: 63,
    },
    {
      id: 'e10',
      clubId: 'club-ultimate',
      title: 'Scrimmage vs. Purdue',
      description:
        'Home scrimmage against Purdue’s club team. Come cheer, or suit up if you’re on the roster.',
      start: at(now, 4, 15),
      durationHours: 2,
      location: 'Riehle Fields',
      rsvpCount: 40,
    },
    {
      id: 'e11',
      clubId: 'irish-devs',
      title: 'Hack Night',
      description:
        'Open build session. Work on side projects, find teammates for upcoming hackathons, and get unstuck with help from upperclassmen.',
      start: at(now, 5, 20),
      durationHours: 3,
      location: 'Duncan Student Center, 3rd Floor',
      rsvpCount: 49,
    },
    {
      id: 'e12',
      clubId: 'pre-law',
      title: 'Alumni Panel: Life at a Big Law Firm',
      description:
        'Three Notre Dame alumni in corporate law talk about summer associate programs, billable hours, and choosing a practice area.',
      start: at(now, 5, 18),
      durationHours: 1.5,
      location: 'Jordan Hall of Science, Room 101',
      rsvpCount: 57,
    },
    {
      id: 'e13',
      clubId: 'investment-club',
      title: 'Markets Weekly: Fed Recap',
      description:
        'Quick 45-minute breakdown of this week’s Fed decision and what it means for rates, tech stocks, and our portfolio.',
      start: at(now, 6, 17),
      durationHours: 0.75,
      location: 'Mendoza College of Business, Room 242',
      rsvpCount: 23,
    },
    // Later
    {
      id: 'e14',
      clubId: 'japan-club',
      title: 'Anime & Ramen Night',
      description: 'Double feature screening with ramen from a local South Bend shop. Vote on the films in our group poll.',
      start: at(now, 8, 19),
      durationHours: 3,
      location: 'LaFortune Student Center, Montgomery Auditorium',
      rsvpCount: 90,
    },
    {
      id: 'e15',
      clubId: 'habitat',
      title: 'New Volunteer Orientation',
      description:
        'Required before your first build: safety overview, site expectations, and signing waivers. Takes under an hour.',
      start: at(now, 9, 18),
      durationHours: 1,
      location: 'Jordan Hall of Science, Room 105',
      rsvpCount: 18,
    },
    {
      id: 'e16',
      clubId: 'sibc',
      title: 'Networking Night with Amazon',
      description:
        'Meet Amazon recruiters and Notre Dame alumni working across AWS, operations, and retail. Business casual. Bring a resume.',
      start: at(now, 10, 18),
      durationHours: 2,
      location: 'Duncan Student Center Ballroom',
      rsvpCount: 142,
    },
    {
      id: 'e17',
      clubId: 'irish-stage',
      title: 'Improv Workshop',
      description:
        'Learn the fundamentals of long-form improv. No experience needed; just show up ready to play.',
      start: at(now, 11, 19, 30),
      durationHours: 1.5,
      location: 'Washington Hall, Lab Theatre',
      rsvpCount: 27,
    },
    {
      id: 'e18',
      clubId: 'irish-devs',
      title: 'Resume Review with Alumni Engineers',
      description:
        'One-on-one resume feedback from alumni software engineers ahead of internship recruiting season.',
      start: at(now, 13, 17),
      durationHours: 2,
      location: 'Hesburgh Library, Collaboration Hub',
      rsvpCount: 35,
    },
    {
      id: 'e19',
      clubId: 'club-ultimate',
      title: 'Fall Tournament Travel Meeting',
      description: 'Roster, carpools, and hotel rooms for the fall tournament. Mandatory for traveling players.',
      start: at(now, 14, 21),
      durationHours: 0.5,
      location: 'Duncan Student Center, Room 208',
      rsvpCount: 24,
    },
    {
      id: 'e20',
      clubId: 'pre-law',
      title: 'Moot Court Tryouts',
      description:
        'Argue a short appellate problem in front of a panel of upperclassmen. Problem packet available one week before.',
      start: at(now, 16, 18),
      durationHours: 3,
      location: 'DeBartolo Hall, Room 116',
      rsvpCount: 29,
    },
    {
      id: 'e21',
      clubId: 'investment-club',
      title: 'Portfolio Competition Launch',
      description:
        'Kick off the semester-long paper portfolio competition. Teams of three, $1M in virtual capital, prizes for the top return.',
      start: at(now, 18, 19),
      durationHours: 1,
      location: 'Mendoza College of Business, Giovanini Commons',
      rsvpCount: 41,
    },
  ];

  const announcements: Announcement[] = [
    {
      id: 'a1',
      clubId: 'sibc',
      title: 'Project applications are open',
      body: 'Applications for fall project teams close Sunday at midnight. Short answers only; no resume required for first-years.',
      postedAt: hoursAgo(now, 3),
    },
    {
      id: 'a2',
      clubId: 'irish-devs',
      title: 'Free AWS credits for members',
      body: 'Every member can claim $100 in AWS credits for personal projects. Grab a code at Hack Night or DM an officer.',
      postedAt: hoursAgo(now, 9),
    },
    {
      id: 'a3',
      clubId: 'club-ultimate',
      title: 'Team jerseys are in',
      body: 'Pick yours up after practice this week. Bring $25 cash or Venmo the treasurer.',
      postedAt: hoursAgo(now, 20),
    },
    {
      id: 'a4',
      clubId: 'japan-club',
      title: 'Volunteers needed for Mochi Night',
      body: 'We need 6 people to help with setup at 7 PM. Volunteers get first pick of mochi fillings.',
      postedAt: hoursAgo(now, 28),
    },
    {
      id: 'a5',
      clubId: 'pre-law',
      title: 'Room change for LSAT session',
      body: 'This week’s LSAT Strategy Session has moved to Hesburgh Library, Room 218.',
      postedAt: hoursAgo(now, 36),
    },
    {
      id: 'a6',
      clubId: 'habitat',
      title: 'Waivers due Friday',
      body: 'Anyone signed up for Saturday’s build must submit the online waiver by Friday at 5 PM or you can’t come on site.',
      postedAt: hoursAgo(now, 50),
    },
    {
      id: 'a7',
      clubId: 'investment-club',
      title: 'Pitch deck template posted',
      body: 'The updated stock pitch template is in the shared drive. Use it for Pitch Night so judging stays consistent.',
      postedAt: hoursAgo(now, 70),
    },
    {
      id: 'a8',
      clubId: 'irish-stage',
      title: 'Audition sides are posted',
      body: 'Sides for the fall show are posted outside Washington Hall and linked in our bio.',
      postedAt: hoursAgo(now, 96),
    },
  ];

  const user: DemoUser = {
    id: DEMO_USER_ID,
    name: 'Demo Student',
    // Pre-joined so My Groups isn't empty on first open.
    joinedClubIds: ['sibc', 'irish-devs', 'club-ultimate'],
    rsvpedEventIds: ['e1'],
  };

  return { clubs, events: eventSeeds.map(toEvent), announcements, user };
}
