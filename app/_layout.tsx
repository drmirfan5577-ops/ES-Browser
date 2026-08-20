import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AlertProvider } from '@/template';
import { BrowserProvider } from '@/contexts/BrowserContext';

export default function RootLayout() {
  return (
    <AlertProvider>
      <SafeAreaProvider>
        <BrowserProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="web/index" options={{ headerShown: false }} />
            <Stack.Screen name="web/download" options={{ headerShown: false }} />
          </Stack>
        </BrowserProvider>
      </SafeAreaProvider>
    </AlertProvider>
  );
}
