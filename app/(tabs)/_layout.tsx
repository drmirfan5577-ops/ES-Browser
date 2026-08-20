import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBrowserContext } from '@/contexts/BrowserContext';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { theme } = useBrowserContext();

  const tabBarStyle = {
    backgroundColor: theme.tabBg,
    borderTopWidth: 1,
    borderTopColor: theme.glassBorder,
    height: Platform.select({ ios: insets.bottom + 60, android: insets.bottom + 60, default: 68 }),
    paddingTop: 8,
    paddingBottom: Platform.select({ ios: insets.bottom + 8, android: insets.bottom + 8, default: 10 }),
    paddingHorizontal: 8,
  };

  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarStyle,
      tabBarActiveTintColor: theme.tabActive,
      tabBarInactiveTintColor: theme.tabInactive,
      tabBarLabelStyle: { fontSize: 9, fontWeight: '700' },
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Browser',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="language" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="media"
        options={{
          title: 'Media',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="play-circle-filled" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="hubs"
        options={{
          title: 'My Hub',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="hub" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="esnews"
        options={{
          title: 'ESNews',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="newspaper" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="settings" size={size} color={color} />,
        }}
      />
      {/* Admin hidden from tab bar — accessible via Settings */}
      <Tabs.Screen
        name="admin"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
