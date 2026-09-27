import { router } from 'expo-router';

/**
 * Open a club's channel. `withAnchor` puts the Messages list underneath it,
 * so Back returns to the club list even when coming from Home.
 */
export function openClub(clubId: string): void {
  router.push({ pathname: '/messages/[id]', params: { id: clubId } }, { withAnchor: true });
}

/** Go to Home and open the Find clubs popup over Discover (Home reads the `findClubs` param). */
export function openFindClubs(): void {
  router.navigate({ pathname: '/', params: { findClubs: '1' } });
}
