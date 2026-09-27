# clubHQ — Progress

_Last updated: Sun Sept 27_

## Done
- Scaffold, SPA web output, `amplify.yml`, theme tokens, responsive nav (bottom tabs < 768px, navy sidebar ≥ 768px, Popular clubs panel ≥ 1000px).
- **Amplify deploy works.** SPA rewrite confirmed (deep-link refresh doesn't 404). Sun: pushed `4f03ec5` (polish + Find clubs); live check pending.
- Tabs: **Home · Inbox · Messages · Calendar · Profile** (Profile = "coming soon" popup).
- Data layer: types in `src/types/domain.ts`, runtime-relative seed, `DataRepository` → `MockRepository` → `AppDataProvider`/`useAppData()`.
- Home: Discover / My Groups, Latest news, events grouped Today / This Week / Later, Join chips, RSVP toggle + counts.
- Club channels (`/messages/[id]`), Calendar (week strip + agenda), persistence of joins/RSVPs in AsyncStorage (`clubhq:user:v1`).
- **Sun polish:** seed post times never land overnight (`daytimeAgo()` squeezes 11 PM–8 AM into 8–11 PM the evening before); green limited to RSVP CTA; phone-width check at 360/390/1280px found no overflow.
- **Find clubs popup** (`FindClubsModal`): all clubs + filter box (name/category/description), Join/Joined, tap club → channel. Closes on ✕, backdrop, Esc, Android back. Opens over Discover from My Groups' "Find clubs" and from Messages' empty-state "Discover clubs" (via `openFindClubs()` in `src/lib/nav.ts`, `?findClubs=1`). Shared `ClubRow` also used by Popular clubs.
- `.nvmrc` = 22.

## In progress / broken
- Live Amplify build of `4f03ec5` not yet verified.
- **Not yet tested in Expo Go.** Use `npx expo start --tunnel` (campus Wi-Fi blocks phone→Mac).
- Minor: opening `/?findClubs=1` directly leaves the param in the URL (refresh reopens popup). Nothing in the app links there.
- Minor nits, skipped: Calendar agenda titles truncate on phones; Pre-Law line wraps in desktop Popular clubs.

## Next steps (present Mon; deadline Mon 11:59 PM)
1. Verify live Amplify build: Find clubs from My Groups and empty Messages, deep-link refresh, no console errors.
2. Expo Go via tunnel: popup, keyboard over search, Join → My Groups.
3. Reset demo state before presenting: DevTools Console → `localStorage.removeItem('clubhq:user:v1'); location.reload()`.
4. Demo path (~60s): Discover → RSVP → My Groups → Find clubs → search "business" → Join Investment Club → My Groups shows it → open a channel → Calendar → refresh shows persistence.
5. Slide (claude.ai chat): move "search" to "basic club finder in demo; full search on roadmap".
6. Skip Projects stretch unless everything above is done.

## Decisions
- **App name: clubHQ.** Styling: StyleSheet + `theme.ts` tokens, no NativeWind (SDK 57 setup risk).
- **Color roles** in CLAUDE.md match `theme.ts`. Green = RSVP only; **Join stays blue** so there is one green action per card.
- **Persistence saves only the user's choices** (joined club IDs, RSVP'd event IDs), never events or counts. All inside `MockRepository`.
- **Scope = home page and what's reachable from it.** Event detail cut (tapping an event opens its club channel).
- **Clubs are Reddit-like communities whose page is a chat channel** at `/messages/[id]` with `withAnchor` so Back works.
- **Roles:** `leader` / `poster` / `member`; `canPost()` in `src/lib/channel.ts`.
- **Find clubs filter is client-side** over `useAppData().clubs`, no repository change, so it works unchanged with Tier 2. Cross-screen open uses a URL param (Expo Router idiom); Home reacts to it during render (lint forbids setState in effects) and clears it with `router.setParams`.
- **Web focus ring:** `src/global.css` (imported in root `_layout.tsx`) sets `input:focus-visible { outline: none }`; the search box border shows focus. Expo ignores global CSS on native. RN types don't allow `outlineStyle: 'none'`, hence CSS.
- **Roadmap (slide, not code):** posting composer, leader UI for posting rights, projects with invites, auth, month calendar, full search.
- Calendar is a week strip + agenda, not a month grid. Demo user starts joined to 3 clubs, RSVP'd to 4 events.
- Popups use `Modal`, not `Alert.alert` (no-op on web).
- **Node 22 via `.nvmrc`.** This Mac uses **fnm** (auto-switches on `cd`; manual: `fnm use`); the other Mac may use nvm (`nvm use`). Both must use **npm 11** (lockfile drift broke Amplify once).
- **After pulling, if `package.json` or the lockfile changed, run `npm ci`** (after `fnm use`/`nvm use`), then `expo start` (`--clear` if Metro fails).
- Tier 2 (Amplify Gen 2 backend) goes on a `tier2-backend` branch; merge only if it fully works.
