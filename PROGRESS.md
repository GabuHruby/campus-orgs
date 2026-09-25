# clubHQ — Progress

_Last updated: Thu Sept 24 (night)_

## Done
- Step 0–1: scaffold, route skeleton, SPA web output, `amplify.yml`, housekeeping.
- Tabs: Home · Inbox · Messages · Profile. Messages/Profile show a "coming soon" popup.
- Theme tokens (`src/theme.ts`) with the brand palette.
- Responsive nav: bottom tabs < 768px; navy left sidebar ≥ 768px (icons only until 1100px, then labels). Popular clubs panel ≥ 1000px.
- Data layer: domain types, runtime-relative seed data (8 clubs, 21 events, 8 announcements), `DataRepository` interface, `MockRepository`, `AppDataProvider` + `useAppData()`.
- Home feed: Discover / My Groups toggle, "Latest news" announcements, events grouped Today / This Week / Later, Join chips on Discover, working RSVP toggle + counts. My Groups has a club row. Inbox lists announcements from joined clubs.
- Verified: tsc, lint, web export, and headless-Chrome screenshots at 500 / 850 / 1400px widths.

## In progress / unverified
- Amplify deploy: believed deployed, not confirmed. Check the public URL and the SPA rewrite rule (refresh on `/inbox` or `/club/sibc` must not 404).
- Joins/RSVPs are in memory only; they reset on refresh until the persistence step.
- Not yet tested in Expo Go on a phone.
- Club page and event detail are still placeholders.

## Next steps
1. Confirm Amplify URL + rewrite rule; push to trigger a redeploy.
2. Club page (header, Join/Leave, club events + announcements) and event detail (full info + RSVP).
3. Persist joins/RSVPs with AsyncStorage inside `MockRepository`.
4. Test in Expo Go; polish; redeploy.

## Decisions
- **App name: clubHQ.**
- **Styling: StyleSheet + `theme.ts` tokens, no NativeWind** (setup risk on SDK 57 / Reanimated 4; the tokens give the same consistency).
- **Palette roles:** #011634 text/sidebar, #164075 section headers/active sidebar item, #205CA9 primary, #2F79D8 accents, #96C223 CTAs only (RSVP) with navy text, since white on green fails contrast.
- **Keep Inbox tab**; Messages/Profile are popups to look complete while staying out of scope. Popup uses `Modal`, not `Alert.alert` (no-op on web).
- **Sidebar is a custom `tabBar` for the same Tabs navigator** (not a separate layout), so routes, icons, and tabPress listeners are shared between phone and desktop.
- **Announcements in the feed:** the 2 newest appear under "Latest news" above the event sections; the full list lives in Inbox.
- **"Today" events** use `soon()` in seed.ts: a few hours from now, or tomorrow afternoon if that would land late at night.
- Lockfile `"peer": true` churn comes from different npm versions on the two computers. Use the same npm major on both.
