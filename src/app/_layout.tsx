import { Stack } from 'expo-router';

import { AppDataProvider } from '@/data/AppDataProvider';
import { colors } from '@/theme';

export default function RootLayout() {
  return (
    <AppDataProvider>
      <Stack
        screenOptions={{
          headerTintColor: colors.primary,
          headerTitleStyle: { color: colors.text, fontWeight: '700' },
          headerStyle: { backgroundColor: colors.surface },
          contentStyle: { backgroundColor: colors.background },
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="club/[id]" options={{ title: 'Club' }} />
        <Stack.Screen name="event/[id]" options={{ title: 'Event' }} />
      </Stack>
    </AppDataProvider>
  );
}
