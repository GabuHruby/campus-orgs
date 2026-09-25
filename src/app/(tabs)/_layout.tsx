import Ionicons from '@expo/vector-icons/Ionicons';
import { BottomTabBar, Tabs } from 'expo-router/js-tabs';
import { useState } from 'react';

import { ComingSoonModal } from '@/components/ComingSoonModal';
import { Sidebar } from '@/components/Sidebar';
import { useBreakpoints } from '@/hooks/useBreakpoints';
import { colors } from '@/theme';

export default function TabsLayout() {
  const [comingSoon, setComingSoon] = useState<string | null>(null);
  const { isWide, sidebarExpanded } = useBreakpoints();

  // Demo-only tabs: cancel navigation and show the popup instead.
  const demoOnly = (feature: string) => ({
    tabPress: (e: { preventDefault: () => void }) => {
      e.preventDefault();
      setComingSoon(feature);
    },
  });

  return (
    <>
      <Tabs
        // Phones: standard bottom bar. Tablets/desktop: Twitter-style left sidebar.
        tabBar={(props) =>
          isWide ? <Sidebar {...props} expanded={sidebarExpanded} /> : <BottomTabBar {...props} />
        }
        screenOptions={{
          headerShown: false,
          tabBarPosition: isWide ? 'left' : 'bottom',
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSubtle,
          tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
          sceneStyle: { backgroundColor: colors.background },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? 'home' : 'home-outline'} color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="inbox"
          options={{
            title: 'Inbox',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? 'mail' : 'mail-outline'} color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="messages"
          options={{
            title: 'Messages',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? 'chatbubbles' : 'chatbubbles-outline'} color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          listeners={demoOnly('Profile')}
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-circle-outline" color={color} size={size} />
            ),
          }}
        />
      </Tabs>
      <ComingSoonModal feature={comingSoon} onClose={() => setComingSoon(null)} />
    </>
  );
}
