import { Stack } from 'expo-router';

import { colors } from '@/theme';

// Deep links like /messages/sibc load the club list underneath, so Back always works.
export const unstable_settings = { anchor: 'index' };

export default function MessagesLayout() {
  return (
    <Stack
      screenOptions={{
        headerTintColor: colors.primary,
        headerTitleStyle: { color: colors.text, fontWeight: '700' },
        headerStyle: { backgroundColor: colors.surface },
        headerBackTitle: 'Messages',
        contentStyle: { backgroundColor: colors.background },
      }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="[id]" options={{ title: 'Club' }} />
    </Stack>
  );
}
