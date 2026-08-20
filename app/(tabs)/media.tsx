import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useBrowserContext } from '@/contexts/BrowserContext';
import { MediaPlayer } from '@/components/feature/MediaPlayer';
import { GalleryApp } from '@/components/feature/GalleryApp';
import { DigitalQuran } from '@/components/feature/DigitalQuran';
import { MaterialIcons } from '@expo/vector-icons';
import { Pressable } from 'react-native';

export default function MediaScreen() {
  const { theme } = useBrowserContext();
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [playerOpen, setPlayerOpen] = useState(false);
  const [quranOpen, setQuranOpen] = useState(false);

  const items = [
    { id: 'gallery', icon: 'photo-library', label: '📸 Gallery', labelUr: 'گیلری', color: '#FF69B4', onPress: () => setGalleryOpen(true) },
    { id: 'player', icon: 'play-circle-filled', label: '🎬 Media Player', labelUr: 'میڈیا پلیئر', color: '#00DCFF', onPress: () => setPlayerOpen(true) },
    { id: 'quran', icon: 'menu-book', label: '📖 Digital Quran', labelUr: 'قرآن پاک', color: '#FFD700', onPress: () => setQuranOpen(true) },
  ];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: '#000' }]} edges={['top']}>
      <StatusBar style="light" />
      <LinearGradient colors={[...theme.gradient]} style={styles.root}>
        <View style={styles.header}>
          <LinearGradient colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.05)']} style={StyleSheet.absoluteFillObject} />
          <Text style={[styles.title, { textShadowColor: theme.glowColor, textShadowRadius: 10 }]}>
            🎬 Media Centre | میڈیا سینٹر
          </Text>
        </View>

        <View style={styles.grid}>
          {items.map(item => (
            <Pressable key={item.id} onPress={item.onPress}
              style={({ pressed }) => [styles.card, { borderColor: item.color + '55', opacity: pressed ? 0.85 : 1 }]}>
              <LinearGradient colors={[item.color + '20', item.color + '08']} style={StyleSheet.absoluteFillObject} />
              <View style={[styles.cardIcon, { backgroundColor: item.color + '25' }]}>
                <MaterialIcons name={item.icon as any} size={36} color={item.color} />
              </View>
              <Text style={[styles.cardTitle, { color: item.color }]}>{item.label}</Text>
              <Text style={styles.cardUr}>{item.labelUr}</Text>
            </Pressable>
          ))}
        </View>

        <GalleryApp visible={galleryOpen} onClose={() => setGalleryOpen(false)} />
        <MediaPlayer visible={playerOpen} onClose={() => setPlayerOpen(false)} />
        <DigitalQuran visible={quranOpen} onClose={() => setQuranOpen(false)} />
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  root: { flex: 1 },
  header: { overflow: 'hidden', paddingHorizontal: 18, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.15)' },
  title: { color: '#fff', fontSize: 20, fontWeight: '900' },
  grid: { padding: 16, gap: 14 },
  card: { borderRadius: 20, borderWidth: 1, overflow: 'hidden', padding: 24, alignItems: 'center', gap: 10 },
  cardIcon: { width: 72, height: 72, borderRadius: 36, justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
  cardTitle: { fontSize: 18, fontWeight: '900' },
  cardUr: { color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: '600' },
});
