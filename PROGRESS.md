# clubHQ — Progress

_Last updated: Fri Sept 25 (early morning)_

## Done
- Scaffold, SPA web output, `amplify.yml`, theme tokens, responsive nav (bottom tabs < 768px, navy sidebar ≥ 768px, Popular clubs panel ≥ 1000px).
- **Amplify deploy works.** Public URL is live; SPA rewrite confirmed (refresh on deep links doesn't 404). Build fix: lockfile regenerated + Amplify pinned to npm 11.
- Tabs: **Home · Inbox · Messages · Calendar · Profile** (Profile = "coming soon" popup).
- Data layer: types in `src/types/domain.ts`, runtime-relative seed, `DataRepository` → `MockRepository` → `AppDataProvider`/`useAppData()`.
- Home: Discover / My Groups, Latest news, events grouped Today / This Week / Later, Join chips, RSVP toggle + counts.
- **Club channels** (`/messages/[id]`): club header + Join/Leave, team with role badges, chat stream (messages + announcements, day dividers, shared events with inline RSVP), locked footer "Only leaders and approved members can post". Messages tab = chat list of joined clubs. Every club link on Home opens the channel.
- **Calendar**: 7-day strip (dots, tap to filter) + agenda of RSVP'd events; Going button cancels inline.
- Verified: tsc, lint, web export, headless-Chrome screenshots at 500 / 1400px.

## In progress / broken
- Joins/RSVPs are in memory only; they reset on refresh (next step).
- Not yet tested in Expo Go. "Could not connect to the server" = campus Wi-Fi blocks phone→Mac. Use `npx expo start --tunnel` (or phone hotspot).
- Latest push (channels + calendar) not yet confirmed live on Amplify. Check `/messages/sibc` and `/calendar` with a refresh.

## Next steps (Tier 1 due Sat night)
1. Persist joins/RSVPs with AsyncStorage inside `MockRepository` (~45m).
2. Test in Expo Go via tunnel.
3. Polish: snap seed message times to daytime hours (some show "12:31 AM"); general pass on phone.
4. Redeploy + verify. Then the slide.
5. Stretch (Sunday, only if above is done): lightweight Projects: seeded projects on club page + one invite in Inbox with Accept/Decline.

## Decisions
- **App name: clubHQ.** Styling: StyleSheet + `theme.ts` tokens, no NativeWind (SDK 57 setup risk).
- **Palette roles:** #011634 text/sidebar, #164075 headers/active item/leader badge, #205CA9 primary, #2F79D8 accents, #96C223 CTAs only with navy text (white on green fails contrast).
- **Scope for the demo = the home page and what's reachable from it.** Event detail page cut (tapping an event opens its club channel).
- **Clubs are Reddit-like communities whose page is a chat channel.** Channel lives inside the Messages tab (`/messages/[id]`) so the desktop sidebar stays, with `unstable_settings.anchor = 'index'` + `router.push(..., { withAnchor: true })` so Back works from Home and deep links.
- **Roles:** `leader` / `poster` (e.g. Marketing) / `member`. Leaders decide who can post. `Club.chatPermission` (`'posters' | 'everyone'`) is leader-controlled; the vision is everyone can chat, and the demo seeds all clubs as `'posters'`. Rule lives in `canPost()` in `src/lib/channel.ts`. Future: `sendMessage()` + composer; no model change needed.
- **Roadmap (slide, not code):** posting composer, leader UI to grant posting rights, projects with leader invites, auth, month calendar view.
- **Calendar is a week strip + agenda**, not a month grid (sparse and cramped on phones).
- Demo user starts pre-joined to 3 clubs and RSVP'd to 4 events so My Groups and Calendar aren't empty.
- Messages/Profile popups use `Modal`, not `Alert.alert` (no-op on web). Sidebar is a custom `tabBar` for the same Tabs navigator.
- **Both computers must use npm 11.** Lockfile drift between npm versions broke the Amplify build once.
