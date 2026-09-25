import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AnnouncementCard } from '@/components/AnnouncementCard';
import { EventCard } from '@/components/EventCard';
import { MyClubsRow } from '@/components/MyClubsRow';
import { Page } from '@/components/Page';
import { PopularClubs } from '@/components/PopularClubs';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SectionHeader } from '@/components/SectionHeader';
import { SegmentedControl } from '@/components/SegmentedControl';
import { useAppData } from '@/data/AppDataProvider';
import { groupUpcomingEvents, inClubs, sortAnnouncements } from '@/lib/feed';
import { colors, radius, spacing } from '@/theme';

type Feed = 'discover' | 'my-groups';

const FEED_OPTIONS = [
  { value: 'discover', label: 'Discover' },
  { value: 'my-groups', label: 'My Groups' },
] as const;

// How many announcements to surface above the event sections.
const LATEST_NEWS_LIMIT = 2;

export default function HomeScreen() {
  const [feed, setFeed] = useState<Feed>('discover');
  const { clubs, events, announcements, user, clubsById } = useAppData();

  const isMine = feed === 'my-groups';
  const joined = user.joinedClubIds;
  const feedEvents = isMine ? inClubs(events, joined) : events;
  const feedNews = sortAnnouncements(isMine ? inClubs(announcements, joined) : announcements).slice(
    0,
    LATEST_NEWS_LIMIT,
  );
  const sections = groupUpcomingEvents(feedEvents);
  const myClubs = clubs.filter((c) => joined.includes(c.id));

  return (
    <Page aside={<PopularClubs />}>
      <ScreenHeader
        title="Home"
        brandOnMobile
        subtitle={isMine ? 'What’s coming up in your clubs' : 'Everything happening on campus'}
      />
      <SegmentedControl options={FEED_OPTIONS} value={feed} onChange={setFeed} />

      {isMine && <MyClubsRow clubs={myClubs} onFindMore={() => setFeed('discover')} />}

      {feedNews.length > 0 && (
        <View style={styles.group}>
          <SectionHeader title="Latest news" />
          {feedNews.map((a) => {
            const club = clubsById.get(a.clubId);
            return club && <AnnouncementCard key={a.id} announcement={a} club={club} />;
          })}
        </View>
      )}

      {sections.map((section) => (
        <View key={section.title} style={styles.group}>
          <SectionHeader title={section.title} count={section.events.length} />
          {section.events.map((e) => {
            const club = clubsById.get(e.clubId);
            return club && <EventCard key={e.id} event={e} club={club} showJoin={!isMine} />;
          })}
        </View>
      ))}

      {sections.length === 0 && (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>
            {isMine ? 'No upcoming events in your clubs' : 'No upcoming events'}
          </Text>
          <Text style={styles.emptyBody}>
            {isMine ? 'Join a few clubs on Discover and their events show up here.' : 'Check back soon.'}
          </Text>
        </View>
      )}
    </Page>
  );
}

const styles = StyleSheet.create({
  group: { gap: spacing.md },
  empty: {
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.xxl,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: colors.text },
  emptyBody: { fontSize: 14, color: colors.textMuted, textAlign: 'center' },
});
