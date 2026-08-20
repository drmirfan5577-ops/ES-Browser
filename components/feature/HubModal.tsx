import React from 'react';
import { View, Text, Pressable, StyleSheet, FlatList, Dimensions } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassModal } from '@/components/ui/GlassModal';
import { HUB_APPS, HUB_META, HubApp } from '@/constants/config';
import { useBrowserContext } from '@/contexts/BrowserContext';

const SW = Dimensions.get('window').width;
const ITEM_W = (SW - 48) / 3;

interface HubModalProps { hubId: string; visible: boolean; onClose: () => void; onOpenUrl: (url: string) => void; }

function AppCard({ app, onPress }: { app: HubApp; onPress: () => void }) {
  const { theme } = useBrowserContext();
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, { opacity: pressed ? 0.8 : 1 }]}>
      <View style={[styles.cardInner, { backgroundColor: app.bg, borderColor: theme.glassBorder }]}>
        <LinearGradient colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.05)']} style={StyleSheet.absoluteFillObject} />
        {app.iconLib === 'mat'
          ? <MaterialIcons name={app.icon as any} size={26} color="#fff" />
          : <Ionicons name={app.icon as any} size={26} color="#fff" />
        }
        <Text style={styles.cardName} numberOfLines={2}>{app.name}</Text>
        <Text style={styles.cardNameUr} numberOfLines={1}>{app.ur}</Text>
      </View>
    </Pressable>
  );
}

export function HubModal({ hubId, visible, onClose, onOpenUrl }: HubModalProps) {
  const meta = HUB_META[hubId];
  const apps = HUB_APPS[hubId] || [];

  const handleOpen = (url: string) => { onOpenUrl(url); onClose(); };

  return (
    <GlassModal visible={visible} onClose={onClose} title={`${meta?.icon || '📱'} ${meta?.name || 'Hub'}`} titleUr={meta?.ur} fullScreen>
      {meta && (
        <View style={styles.desc}>
          <Text style={styles.descText}>{meta.desc}</Text>
          <Text style={styles.descUr}>{meta.descUr}</Text>
        </View>
      )}
      <FlatList
        data={apps}
        keyExtractor={i => i.id}
        numColumns={3}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => <AppCard app={item} onPress={() => handleOpen(item.url)} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        scrollEnabled={false}
      />
    </GlassModal>
  );
}

const styles = StyleSheet.create({
  desc: { marginBottom: 12, padding: 12, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12 },
  descText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  descUr: { color: 'rgba(255,255,255,0.8)', fontSize: 11, marginTop: 4 },
  row: { justifyContent: 'flex-start', gap: 8, marginBottom: 8 },
  card: { width: ITEM_W },
  cardInner: { borderRadius: 14, borderWidth: 1, overflow: 'hidden', alignItems: 'center', padding: 10, minHeight: 90, justifyContent: 'center', gap: 4 },
  cardName: { color: '#fff', fontSize: 10, fontWeight: '700', textAlign: 'center' },
  cardNameUr: { color: 'rgba(255,255,255,0.75)', fontSize: 9, textAlign: 'center' },
});
