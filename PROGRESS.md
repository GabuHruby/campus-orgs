# clubHQ — Progress

_Last updated: Fri Sept 25_

## Done
- Scaffold, SPA web output, `amplify.yml`, theme tokens, responsive nav (bottom tabs < 768px, navy sidebar ≥ 768px, Popular clubs panel ≥ 1000px).
- **Amplify deploy works** and is up to date with `master` (persistence build confirmed live). SPA rewrite confirmed (deep-link refresh doesn't 404).
- Tabs: **Home · Inbox · Messages · Calendar · Profile** (Profile = "coming soon" popup).
- Data layer: types in `src/types/domain.ts`, runtime-relative seed, `DataRepository` → `MockRepository` → `AppDataProvider`/`useAppData()`.
- Home: Discover / My Groups, Latest news, events grouped Today / This Week / Later, Join chips, RSVP toggle + counts.
- **Club channels** (`/messages/[id]`) and **Calendar** (week strip + agenda): confirmed live on Amplify.
- **Persistence:** joins/RSVPs saved to AsyncStorage (localStorage on web) under `clubhq:user:v1`. Verified in headless Chrome: survives reload, counts stay in sync.
- Slide brief written and pasted into a claude.ai chat to draft the slide (file not kept in the repo).

## In progress / broken
- Not yet tested in Expo Go. "Could not connect to the server" = campus Wi-Fi blocks phone→Mac. Use `npx expo start --tunnel` (or phone hotspot).
- Seed message times can land at night (e.g. "12:31 AM").
- Green (`cta`) is used beyond CTAs (announcement borders, calendar dots/bar, Wordmark, 2 club avatars); CLAUDE.md says CTAs only.

## Next steps (Tier 1 due Sat night)
1. Polish (~30–45m): snap seed message times to daytime; trim green to CTAs only; phone-width pass.
2. Test in Expo Go via tunnel.
3. Redeploy + verify. **Before presenting/recording, reset demo state:** DevTools Console → `localStorage.removeItem('clubhq:user:v1'); location.reload()`.
4. The slide (in progress in a claude.ai chat).
5. Stretch (Sunday, only if above is done): lightweight Projects: seeded projects on club page + one invite in Inbox with Accept/Decline.

## Decisions
- **App name: clubHQ.** Styling: StyleSheet + `theme.ts` tokens, no NativeWind (SDK 57 setup risk).
- **Color roles** are documented in CLAUDE.md and match `theme.ts`: `#205CA9` = `primary`, `#164075` = `primaryDark`, green = CTAs with navy text.
- **Persistence saves only the user's choices** (joined club IDs, RSVP'd event IDs), never events or counts: dates stay relative to today and counts are re-derived from the seed. Storage failure falls back to the seed. All of it is inside `MockRepository`; no UI changed.
- **Scope for the demo = the home page and what's reachable from it.** Event detail page cut (tapping an event opens its club channel).
- **Clubs are Reddit-like communities whose page is a chat channel.** Channel lives inside the Messages tab (`/messages/[id]`) so the desktop sidebar stays, with `unstable_settings.anchor = 'index'` + `router.push(..., { withAnchor: true })` so Back works from Home and deep links.
- **Roles:** `leader` / `poster` (e.g. Marketing) / `member`. `Club.chatPermission` (`'posters' | 'everyone'`) is leader-controlled; demo seeds all clubs as `'posters'`. Rule lives in `canPost()` in `src/lib/channel.ts`.
- **Roadmap (slide, not code):** posting composer, leader UI to grant posting rights, projects with leader invites, auth, month calendar view.
- **Calendar is a week strip + agenda**, not a month grid (sparse and cramped on phones).
- Demo user starts pre-joined to 3 clubs and RSVP'd to 4 events so My Groups and Calendar aren't empty.
- Messages/Profile popups use `Modal`, not `Alert.alert` (no-op on web). Sidebar is a custom `tabBar` for the same Tabs navigator.
- **Both computers must use npm 11.** Lockfile drift between npm versions broke the Amplify build once.
- Tier 2 (Amplify Gen 2 backend) goes on a `tier2-backend` branch; merge only if it fully works.
