# clubHQ — Progress

_Last updated: Thu Sept 24_

## Done
- Step 0: Expo SDK 57 scaffold, route skeleton (tabs + `club/[id]` + `event/[id]`), `web.output: "single"`, `amplify.yml` (Node 22, `expo export`).
- Step 1: housekeeping (CLAUDE.md title, this file, lockfile committed).
- Typecheck, lint, and `expo export --platform web` all pass.

## In progress / unverified
- Amplify deploy: believed deployed, not yet confirmed. Need to verify the public URL and that the SPA rewrite rule is set in the Amplify console (refresh on `/club/sibc` must not 404).
- Tab bar: adding Messages + Profile tabs that show a "not available in the demo" popup instead of navigating.

## Next steps
1. Confirm Amplify URL + rewrite rule.
2. NativeWind spike (45 min cap, fallback: `theme.ts` + StyleSheet).
3. Domain layer: types, relative-date seed data, `DataRepository` + `MockRepository` (AsyncStorage), provider/hooks.
4. Feed UI, club page, event detail, polish, redeploy.

## Decisions
- **App name: clubHQ.**
- **Keep the Inbox tab** (announcements from joined clubs). Home tab holds the Discover / My Groups toggle.
- **Messages and Profile tabs are placeholders**: tapping them shows a popup instead of navigating. They make the app look complete while staying out of scope.
- Popups use a custom modal, not `Alert.alert`, because `Alert` does nothing on react-native-web and web is the main demo target.
- Lockfile churn (`"peer": true` flips) comes from different npm versions on the two computers. Harmless; use the same npm major on both.
