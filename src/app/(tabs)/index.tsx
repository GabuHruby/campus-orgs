import { Link } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Placeholder: replaced by the real feed in Step 4.
type Feed = 'discover' | 'my-groups';

export default function HomeScreen() {
  const [feed, setFeed] = useState<Feed>('discover');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.toggle}>
        <Pressable onPress={() => setFeed('discover')}>
          <Text style={feed === 'discover' ? styles.active : styles.inactive}>Discover</Text>
        </Pressable>
        <Pressable onPress={() => setFeed('my-groups')}>
          <Text style={feed === 'my-groups' ? styles.active : styles.inactive}>My Groups</Text>
        </Pressable>
      </View>
      <Text>{feed === 'discover' ? 'All campus events' : 'Events from my clubs'}</Text>
      <Link href={{ pathname: '/club/[id]', params: { id: 'sibc' } }}>Open a club</Link>
      <Link href={{ pathname: '/event/[id]', params: { id: 'e1' } }}>Open an event</Link>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 16 },
  toggle: { flexDirection: 'row', gap: 24 },
  active: { fontSize: 18, fontWeight: '700' },
  inactive: { fontSize: 18, color: '#888' },
});
