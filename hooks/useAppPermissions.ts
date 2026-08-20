import { useEffect, useRef } from 'react';
import { Alert, Platform } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { Camera } from 'expo-camera';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PERM_KEY = 'esb_permissions_granted_v1';

/**
 * Requests ALL required permissions on first app launch.
 * After first grant, stores a flag so the dialog never shows again.
 */
export function useAppPermissions() {
  const requested = useRef(false);

  useEffect(() => {
    if (requested.current) return;
    requested.current = true;

    const run = async () => {
      try {
        const already = await AsyncStorage.getItem(PERM_KEY);
        if (already === 'true') return; // Already done on previous launch
      } catch {}

      // Small delay so the UI is fully rendered first
      await new Promise(r => setTimeout(r, 1200));

      const results = await Promise.allSettled([
        // Media Library (photos, videos, audio — READ)
        MediaLibrary.requestPermissionsAsync(),
        // Camera
        Camera.requestCameraPermissionsAsync(),
        // Microphone (audio recording + voice search)
        Audio.requestPermissionsAsync(),
      ]);

      const allGranted = results.every(r => r.status === 'fulfilled' && r.value?.granted);

      if (allGranted) {
        await AsyncStorage.setItem(PERM_KEY, 'true').catch(() => {});
      } else {
        // Some were denied — show a helpful message but don't block the app
        const denied = results
          .map((r, i) => {
            if (r.status === 'fulfilled' && !r.value?.granted) {
              return ['Storage / Media', 'Camera', 'Microphone'][i];
            }
            return null;
          })
          .filter(Boolean);

        if (denied.length > 0) {
          Alert.alert(
            'Permissions Required | اجازتیں درکار ہیں',
            `Please allow the following in device Settings:\n${denied.join(', ')}\n\nڈیوائس سیٹنگز میں درج ذیل اجازتیں دیں تاکہ Gallery، Camera، اور Voice Search کام کریں۔`,
            [{ text: 'OK | ٹھیک ہے', style: 'default' }]
          );
        }
      }
    };

    run();
  }, []);
}
