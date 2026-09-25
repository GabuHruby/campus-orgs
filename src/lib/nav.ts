import { router } from 'expo-router';

/**
 * Open a club's channel. `withAnchor` puts the Messages list underneath it,
 * so Back returns to the club list even when coming from Home.
 */
export function openClub(clubId: string): void {
  router.push({ pathname: '/messages/[id]', params: { id: clubId } }, { withAnchor: true });
}
