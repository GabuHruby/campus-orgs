@AGENTS.md

# Project: clubHQ — Campus Org Platform Demo

## Context

I'm a freshman at Notre Dame doing a tryout deliverable for SIBC (Student International Business Council) on an Amazon-sponsored project. The prompt: student orgs rely on a fragmented mix of group chats, spreadsheets, and drives to manage events and communication. The goal is a proof-of-concept application on AWS that gives student orgs a single platform.

I chose the AWS Dev track. My deliverable is 1 slide scoping an MVP, plus this working demo app linked from the slide. The demo exists to impress project leaders. It must be polished, fast to open, and require zero setup (no login, no install).

**Deadline: Monday, Sept 28, 11:59 PM.** Tier 1 must be deployed by Saturday night. Scope discipline matters more than feature count.

## What we're building

A two-tab home screen for students:

1. **Discover**: a campus-wide feed of upcoming events and announcements from all clubs.
2. **My Groups**: the same feed filtered to clubs the user has joined, plus a horizontal row of the user's clubs at the top.

Supporting screens:

- **Club page**: name, description, category, member count, Join/Leave button, that club's upcoming events and announcements.
- **Event detail**: full info plus RSVP button.

### The one interaction that must work end-to-end

Joining a club on Discover or on a club page makes that club's events appear in My Groups immediately. RSVPing updates the button state and the RSVP count. This is the "it's a real app" moment of the demo.

## UX direction

- **Structure is Reddit-like**: clubs are communities (like subreddits), with a Join button. My Groups is the "home" feed and Discover is the "all" feed.
- **Event cards are Luma/Partiful-like**: club avatar and name, title, date and time, location, RSVP count, and an RSVP button, all scannable at a glance.
- **Feed is ordered by upcoming date, NOT by recency or popularity.** Group it under section headers: "Today", "This Week", "Later". Hide past events.
- **Announcements render differently from events**: slimmer text-only cards, visually distinct.
- **No upvotes, comments, or likes.** This is not a social network.
- Mobile-first, clean, modern, generous spacing. It must look good both on a phone and in a desktop browser (constrain the content width on desktop so it doesn't stretch).

## Color palette

All colors live in `src/theme.ts`. `palette` holds the 5 brand hex codes; `colors` gives each one a job (`primary`, `cta`, `text`, `border`, etc.). Screens and components use `colors` names only, never raw hex codes or `palette` directly (seed data may use `palette` for avatar colors).

| Hex       | Role |
|-----------|------|
| `#011634` | Darkest navy (`text`, `sidebar`): primary text, headings, desktop sidebar |
| `#164075` | Navy (`primaryDark`): sidebar active item, feed section headers, leader badge |
| `#205CA9` | Blue (`primary`): primary buttons, active tab, segmented control, header tint, links |
| `#2F79D8` | Bright blue (`accent`): highlights, hover/selected borders, info icons |
| `#96C223` | Green (`cta`): accent for primary calls to action only (RSVP, Join, "Going" state) |

Rules:
- Green is the accent. Use it only for the main action on a screen, so RSVP/Join stand out.
- Text on green must be `#011634`, not white. White on this green fails contrast.
- White text is fine on `#011634`, `#164075`, and `#205CA9`.
- Backgrounds, card surfaces, borders, and muted text use neutral grays defined in `colors`. The brand colors are for brand elements, not every surface.
- Light mode only for the demo. No dark mode.

## Tech stack

- **Expo** (SDK 57) with **Expo Router** (file-based routing, tabs layout).
- **TypeScript, strict mode.** No `any`. All domain types defined in one place.
- **Styling: React Native `StyleSheet.create` + design tokens in `src/theme.ts`** (colors, spacing, and other token sets). No NativeWind/Tailwind: it adds a Babel/Metro/Tailwind build layer that is a setup risk on a new SDK, with no visual benefit for a demo. `StyleSheet` needs no setup and behaves the same on web, iOS, and Android.
- **Web is the primary demo target**, built via `npx expo export --platform web` and hosted on **AWS Amplify Hosting** from a GitHub repo (branch `master`). It must also run on iOS/Android via Expo Go for a screen recording.
- Node 22, pinned in `.nvmrc` locally and in `amplify.yml`.
- Local persistence of joins/RSVPs via AsyncStorage (it works on web too), so a viewer's actions survive a refresh.
- The project was scaffolded with `create-expo-app` (TypeScript + Expo Router template). Build on it; don't re-scaffold.
- `"web": { "output": "single" }` in app.json, so the web build is a single-page app (works with Amplify's rewrite rule).

### Architecture requirement

Put all data access behind a repository interface (e.g. `DataRepository` with methods like `getEvents()`, `joinClub()`, `rsvp()`). Tier 1 uses a local/mock implementation. Tier 2 swaps in an AWS implementation without touching UI code. Keep this seam clean, because I'll describe it on my slide.

## Data model (starting point; refine as needed)

- `Club`: id, name, shortDescription, category (Business, Tech, Cultural, Service, Sports, Arts, etc.), avatarColor or emoji, memberCount
- `Event`: id, clubId, title, description, startTime, endTime, location, rsvpCount
- `Announcement`: id, clubId, title, body, postedAt
- `DemoUser`: id, name, joinedClubIds, rsvpedEventIds

## Seed data

- 8 clubs that feel real at Notre Dame: SIBC, an investment club, a CS/tech club, a cultural club, a service club, a club sport, a performing arts group, a debate or pre-law group.
- About 20 events and 6–8 announcements, with realistic titles and descriptions.
- Use real campus locations: Duncan Student Center, DeBartolo Hall, Hesburgh Library, LaFortune Student Center, Jordan Hall of Science, Mendoza College of Business.
- **Generate all event dates relative to the current date at runtime** (e.g. today + 2 days, 7 PM), so the demo never shows stale or past events no matter when someone opens it.
- The demo user starts pre-joined to 3 clubs, so My Groups isn't empty on first open.

## Build tiers

**Tier 1 (must be done and deployed by Saturday night)**

- Scaffold, types, seed data, mock repository
- Tabs, feed with date sections, event cards, announcement cards
- Club page, event detail, Join/Leave, RSVP with persistence
- Deployed to Amplify Hosting with a public URL, using `amplify.yml` for the Expo web export and a rewrite rule so client-side routes resolve to `index.html` instead of 404ing on refresh.

**Tier 2 (only if Tier 1 is fully done)**

- Amplify Gen 2 backend: data model in TypeScript → AppSync + DynamoDB
- AWS implementation of the repository, seeded with the same data
- Still no login: use a fixed demo user id
- Do this on a `tier2-backend` branch. Merge into `master` only if it fully works; otherwise Tier 1 stays live.

**Explicitly out of scope:** authentication, budget tracker, push/email notifications, creating clubs or events from the UI, comments, search. These go on the slide as "roadmap", not in the code.

## How I want you to work with me

- **Before any multi-step task, outline the plan and wait for my approval before executing.**
- **Before deleting, overwriting, or renaming existing files, show me what will change and wait for confirmation.**
- I know React Native from building a recipe app, but I'm newer to Expo Router and AWS Amplify. Briefly explain non-obvious decisions so I can defend them to the project leaders.
- Work in small, testable steps. After each step, tell me how to run and verify it. Test the web build early, not just native, since web quirks are the main risk.
- Suggest a git commit at each working milestone.
- If something I ask for threatens the deadline, push back and say so.
- At the end of each task, list the files you created or modified.

## Session handoff

I work on this project from two computers, and each Claude session starts fresh. The initial planning is done and the app name is clubHQ; the current state and plan live in PROGRESS.md.

- At the start of every session: read PROGRESS.md and run `git log --oneline -10` before doing anything else.
- When I say "wrap up": update PROGRESS.md with (1) what we finished, (2) what's in progress or broken, (3) the next steps, and (4) any decisions we made and why. Keep it short and replace outdated info rather than appending forever. Then suggest a commit message.
