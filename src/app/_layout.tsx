import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="club/[id]" options={{ title: 'Club' }} />
      <Stack.Screen name="event/[id]" options={{ title: 'Event' }} />
    </Stack>
  );
}
