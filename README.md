# clubHQ

**Live demo:** https://master.dahrh25qvwmp0.amplifyapp.com — no login, no install.

A proof-of-concept platform that gives campus student organizations one place for events, announcements, and club communication, instead of a mix of group chats, spreadsheets, and drives. Built as a student project demo.

## What you can do
- **Discover** upcoming events and announcements from every club, grouped by Today / This Week / Later.
- **Join** clubs; their events appear in **My Groups** right away.
- **RSVP** to events and see the count update.
- **Find clubs** by name, category, or description.
- Open a club's **channel** for its announcements and events.
- See your RSVPs in **Calendar**.

Joins and RSVPs are saved in your browser, so they survive a refresh.

## How it's built
- **Expo (SDK 57) + Expo Router + TypeScript**, exported as a single-page web app.
- **Hosted on AWS Amplify Hosting**: it builds from `master` via `amplify.yml`, with a rewrite rule so deep links work on refresh.
- **Repository pattern:** all data access goes through the `DataRepository` interface (`src/data/DataRepository.ts`). The demo uses `MockRepository` (seed data + AsyncStorage). An AWS-backed version (Amplify Gen 2: AppSync + DynamoDB) can replace it without changing any UI code.
- Seed event dates are computed relative to today, so the demo never shows past events.

## Run locally
Requires Node 22 (see `.nvmrc`) and npm 11.

```bash
fnm use          # or: nvm use
npm ci
npx expo start   # press w for web; scan the QR code with Expo Go for mobile
```

## Project layout
```
src/app/         screens (file-based routes)
src/components/  UI components
src/data/        DataRepository, MockRepository, seed data, provider
src/lib/         feed grouping, dates, navigation helpers
src/types/       domain types
src/theme.ts     colors and spacing tokens
```

## Roadmap (not in the demo)
Authentication, posting from the app, leader tools for posting rights, a month calendar, full search, notifications, and an AWS backend.
