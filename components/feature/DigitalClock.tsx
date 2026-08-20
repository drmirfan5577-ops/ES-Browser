import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useDigitalClock } from '@/hooks/useDigitalClock';
import { useBrowserContext } from '@/contexts/BrowserContext';

export function DigitalClock() {
  const { theme } = useBrowserContext();
  const clock = useDigitalClock();
  const glow = theme.glowColor;

  return (
    <View style={styles.container}>
      {/* Big clock */}
      <View style={styles.timeRow}>
        <Text style={[styles.timeText, { color: '#fff', textShadowColor: glow, textShadowRadius: 12 }]}>
          {clock.hours12}:{clock.minutes}
        </Text>
        <View style={styles.ampmCol}>
          <Text style={[styles.ampm, { color: glow }]}>{clock.ampm}</Text>
          <Text style={[styles.ampm, { color: 'rgba(255,255,255,0.85)' }]}>{clock.ampmUr}</Text>
          <Text style={[styles.secs, { color: glow, textShadowColor: glow, textShadowRadius: 6 }]}>:{clock.seconds}</Text>
        </View>
      </View>
      {/* Calendar lines */}
      <Text style={[styles.cal, { color: '#fff' }]} numberOfLines={1}>{clock.gregorianStr}</Text>
      <Text style={[styles.cal, { color: '#FFD700' }]} numberOfLines={1}>{clock.hijriStr}</Text>
      <Text style={[styles.cal, { color: '#7DF9FF' }]} numberOfLines={1}>{clock.chineseStr}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'flex-end', minWidth: 100 },
  timeRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 3 },
  timeText: { fontSize: 26, fontWeight: '900', letterSpacing: 1, fontVariant: ['tabular-nums'] as any },
  ampmCol: { marginBottom: 2, alignItems: 'flex-start' },
  ampm: { fontSize: 9, fontWeight: '700', lineHeight: 11 },
  secs: { fontSize: 11, fontWeight: '800', fontVariant: ['tabular-nums'] as any, marginTop: 1 },
  cal: { fontSize: 8, fontWeight: '600', maxWidth: 120, textAlign: 'right', lineHeight: 12, marginTop: 1 },
});
