import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { useBrowserContext } from '@/contexts/BrowserContext';
import { HUB_META } from '@/constants/config';
import { HubModal } from '@/components/feature/HubModal';
import { BrowserView } from '@/components/feature/BrowserView';

const HUB_IDS = ['islamic', 'news', 'ai', 'social', 'general'];

export default function HubsScreen() {
  const { theme } = useBrowserContext();
  const [activeHub, setActiveHub] = useState<string | null>(null);
  const [browserUrl, setBrowserUrl] = useState<string | null>(null);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar style="light" />
      <LinearGradient colors={[...theme.gradient]} style={styles.root}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.glassBorder }]}>
          <LinearGradient colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.05)']} style={StyleSheet.absoluteFillObject} />
          <Text style={[styles.headerTitle, { textShadowColor: theme.glowColor, textShadowRadius: 10 }]}>
            📱 All Hubs | تمام مراکز
          </Text>
          <Text style={styles.headerSub}>Tap any hub to explore 20 apps</Text>
          <Text style={styles.headerSubUr}>کسی بھی مرکز کو ٹیپ کریں — ۲۰ ایپس دریافت کریں</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          {HUB_IDS.map(id => {
            const meta = HUB_META[id];
            if (!meta) return null;
            return (
              <Pressable key={id} onPress={() => setActiveHub(id)} style={({ pressed }) => [styles.card, { opacity: pressed ? 0.85 : 1, borderColor: theme.glassBorder }]}>
                <LinearGradient colors={['rgba(255,255,255,0.28)', 'rgba(255,255,255,0.06)']} style={StyleSheet.absoluteFillObject} />
                <View style={[styles.iconCircle, { backgroundColor: meta.color }]}>
                  <Text style={styles.hubEmoji}>{meta.icon}</Text>
                </View>
                <View style={styles.cardText}>
                  <Text style={[styles.cardTitle, { textShadowColor: theme.glowColor, textShadowRadius: 8 }]}>{meta.name}</Text>
                  <Text style={styles.cardTitleUr}>{meta.ur}</Text>
                  <Text style={styles.cardDesc}>{meta.desc}</Text>
                  <Text style={styles.cardDescUr}>{meta.descUr}</Text>
                </View>
                <View style={[styles.appCountBadge, { backgroundColor: theme.primary + 'AA' }]}>
                  <Text style={styles.appCount}>20</Text>
                  <Text style={styles.appCountLabel}>Apps</Text>
                </View>
                <MaterialIcons name="chevron-right" size={22} color={theme.glowColor} />
              </Pressable>
            );
          })}
        </ScrollView>

        {activeHub ? (
          <HubModal hubId={activeHub} visible={true} onClose={() => setActiveHub(null)} onOpenUrl={setBrowserUrl} />
        ) : null}
      </LinearGradient>

      <Modal visible={!!browserUrl} animationType="slide" presentationStyle="fullScreen" onRequestClose={() => setBrowserUrl(null)}>
        {browserUrl ? <BrowserView url={browserUrl} onClose={() => setBrowserUrl(null)} /> : null}
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#000' },
  root: { flex: 1 },
  header: { padding: 20, paddingBottom: 16, borderBottomWidth: 1, overflow: 'hidden' },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: '900', textAlign: 'center' },
  headerSub: { color: 'rgba(255,255,255,0.8)', fontSize: 12, textAlign: 'center', marginTop: 4 },
  headerSubUr: { color: 'rgba(255,255,255,0.65)', fontSize: 11, textAlign: 'center', marginTop: 2 },
  content: { padding: 14, gap: 14 },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 14, borderRadius: 20, borderWidth: 1,
    overflow: 'hidden', padding: 16,
    shadowColor: '#fff', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 10, elevation: 6,
  },
  iconCircle: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
  hubEmoji: { fontSize: 28 },
  cardText: { flex: 1 },
  cardTitle: { color: '#fff', fontSize: 17, fontWeight: '800' },
  cardTitleUr: { color: 'rgba(255,255,255,0.85)', fontSize: 13, marginTop: 2 },
  cardDesc: { color: 'rgba(255,255,255,0.75)', fontSize: 11, marginTop: 4 },
  cardDescUr: { color: 'rgba(255,255,255,0.6)', fontSize: 10, marginTop: 2 },
  appCountBadge: { borderRadius: 10, padding: 8, alignItems: 'center', minWidth: 36 },
  appCount: { color: '#fff', fontWeight: '900', fontSize: 16 },
  appCountLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 9, fontWeight: '600' },
});
