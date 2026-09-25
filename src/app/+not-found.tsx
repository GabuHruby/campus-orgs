import { Link, Stack } from 'expo-router';
import { Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 }}>
      <Stack.Screen options={{ title: 'Not found' }} />
      <Text>This page doesn&apos;t exist.</Text>
      <Link href="/">Back to clubHQ</Link>
    </View>
  );
}
