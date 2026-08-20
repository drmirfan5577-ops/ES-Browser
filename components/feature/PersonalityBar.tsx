import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useBrowserContext } from '@/contexts/BrowserContext';

export function PersonalityBar() {
  const { theme, customPersonalities } = useBrowserContext();
  
  // Use customPersonalities if available, otherwise fall back to defaults
  const personalities = customPersonalities && customPersonalities.length > 0
    ? customPersonalities
    : [
        { id: 'jinnah', name: 'Quaid-e-Azam', ur: 'قائد اعظم', title: 'Founder of Pakistan', titleUr: 'بانی پاکستان', imageUri: null },
        { id: 'iqbal', name: 'Dr Allama Iqbal', ur: 'علامہ اقبال', title: 'National Poet', titleUr: 'قومی شاعر', imageUri: null },
        { id: 'aqkhan', name: 'Dr AQ Khan', ur: 'ڈاکٹر عبد القدیر', title: 'Nuclear Pioneer', titleUr: 'ایٹمی علوم کے بانی', imageUri: null },
      ];

  return (
    <View style={styles.row}>
      {personalities.map(p => (
        <View key={p.id} style={[styles.card, { borderColor: theme.glassBorder }]}>
          <LinearGradient colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.05)']} style={StyleSheet.absoluteFillObject} />
          {p.imageUri ? (
            <Image source={{ uri: p.imageUri }} style={styles.img} contentFit="cover" transition={200} />
          ) : (
            <Image
              source={
                p.id === 'jinnah' ? require('@/assets/images/personality-jinnah.png')
                : p.id === 'iqbal' ? require('@/assets/images/personality-iqbal.png')
                : require('@/assets/images/personality-aqkhan.png')
              }
              style={styles.img} contentFit="cover" transition={200}
            />
          )}
          <View style={styles.info}>
            <Text style={styles.name} numberOfLines={1}>{p.name}</Text>
            <Text style={styles.nameUr} numberOfLines={1}>{p.ur}</Text>
            <Text style={[styles.title, { color: theme.glowColor }]} numberOfLines={1}>{p.title}</Text>
            <Text style={styles.titleUr} numberOfLines={1}>{p.titleUr}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'center', gap: 8, paddingHorizontal: 8 },
  card: { flex: 1, flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 12, borderWidth: 1, overflow: 'hidden', padding: 6, gap: 6, alignItems: 'center' },
  img: { width: 36, height: 44, borderRadius: 8 },
  info: { flex: 1 },
  name: { color: '#fff', fontSize: 9, fontWeight: '800' },
  nameUr: { color: 'rgba(255,255,255,0.85)', fontSize: 8, marginTop: 1 },
  title: { fontSize: 8, fontWeight: '700', marginTop: 2 },
  titleUr: { color: 'rgba(255,255,255,0.7)', fontSize: 7.5, marginTop: 1 },
});
