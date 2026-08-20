import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { useBrowserContext } from '@/contexts/BrowserContext';

const NEWS_FEEDS = [
  { id: 'geo', label: 'Geo News', labelUr: 'جیو نیوز', url: 'https://www.geo.tv', color: '#E53935', icon: 'tv' },
  { id: 'ard', label: 'ARY News', labelUr: 'اے آر وائی نیوز', url: 'https://arynews.tv', color: '#0077CC', icon: 'tv' },
  { id: 'dawn', label: 'Dawn News', labelUr: 'ڈان نیوز', url: 'https://www.dawn.com', color: '#1A237E', icon: 'newspaper' },
  { id: 'jang', label: 'Jang', labelUr: 'جنگ', url: 'https://www.jang.com.pk', color: '#006400', icon: 'newspaper' },
  { id: 'express', label: 'Express Tribune', labelUr: 'ایکسپریس', url: 'https://tribune.com.pk', color: '#B71C1C', icon: 'newspaper' },
  { id: 'bbcur', label: 'BBC Urdu', labelUr: 'بی بی سی اردو', url: 'https://www.bbc.com/urdu', color: '#BB1919', icon: 'radio' },
  { id: 'alj', label: 'Al Jazeera', labelUr: 'الجزیرہ', url: 'https://aljazeera.com', color: '#FA7017', icon: 'public' },
  { id: 'goog', label: 'Google News', labelUr: 'گوگل نیوز', url: 'https://news.google.com', color: '#4285F4', icon: 'article' },
];

export default function ESNewsScreen() {
  const { theme } = useBrowserContext();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: '#000' }]} edges={['top']}>
      <StatusBar style="light" />
      <LinearGradient colors={[...theme.gradient]} style={styles.root}>
        <View style={styles.header}>
          <LinearGradient colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.05)']} style={StyleSheet.absoluteFillObject} />
          <Text style={[styles.title, { textShadowColor: theme.glowColor, textShadowRadius: 10 }]}>
            📰 ESNews | خبریں
          </Text>
          <Text style={styles.subtitle}>Pakistan & World News | پاکستان و عالمی خبریں</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          {NEWS_FEEDS.map(feed => (
            <Pressable key={feed.id} onPress={() => Linking.openURL(feed.url)}
              style={({ pressed }) => [styles.card, { borderColor: feed.color + '55', opacity: pressed ? 0.85 : 1 }]}>
              <LinearGradient colors={[feed.color + '18', 'rgba(0,0,0,0)']} style={StyleSheet.absoluteFillObject} />
              <View style={[styles.cardIcon, { backgroundColor: feed.color + '25' }]}>
                <MaterialIcons name={feed.icon as any} size={28} color={feed.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.cardTitle, { color: feed.color }]}>{feed.label}</Text>
                <Text style={styles.cardUr}>{feed.labelUr}</Text>
              </View>
              <MaterialIcons name="open-in-new" size={18} color={feed.color + '88'} />
            </Pressable>
          ))}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  root: { flex: 1 },
  header: { overflow: 'hidden', paddingHorizontal: 18, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.15)' },
  title: { color: '#fff', fontSize: 20, fontWeight: '900' },
  subtitle: { color: 'rgba(255,255,255,0.6)', fontSize: 11, marginTop: 3 },
  content: { padding: 14, gap: 10 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 14, borderRadius: 16, borderWidth: 1, overflow: 'hidden', padding: 14 },
  cardIcon: { width: 50, height: 50, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  cardTitle: { fontSize: 14, fontWeight: '800' },
  cardUr: { color: 'rgba(255,255,255,0.6)', fontSize: 11, marginTop: 2 },
});
