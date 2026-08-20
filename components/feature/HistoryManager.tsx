import React, { useState, useMemo } from 'react';
import {
  View, Text, Pressable, StyleSheet, FlatList, TextInput, Modal, Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBrowserContext } from '@/contexts/BrowserContext';

export interface HistoryItem {
  id: string;
  url: string;
  title: string;
  visitedAt: number;
  domain: string;
  faviconUrl?: string;
}

interface HistoryManagerProps {
  visible: boolean;
  onClose: () => void;
  onOpen: (url: string) => void;
}

function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return url;
  }
}

function formatTime(ts: number): string {
  const d = new Date(ts);
  const now = new Date();
  const diffMs = now.getTime() - ts;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return d.toLocaleDateString();
}

function groupByDate(items: HistoryItem[]): { date: string; items: HistoryItem[] }[] {
  const groups: Record<string, HistoryItem[]> = {};
  items.forEach(item => {
    const d = new Date(item.visitedAt);
    const today = new Date();
    const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
    let key: string;
    if (d.toDateString() === today.toDateString()) key = 'Today | آج';
    else if (d.toDateString() === yesterday.toDateString()) key = 'Yesterday | کل';
    else key = d.toLocaleDateString('en-PK', { weekday: 'long', day: 'numeric', month: 'short' });
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  });
  return Object.entries(groups).map(([date, items]) => ({ date, items }));
}

export function HistoryManager({ visible, onClose, onOpen }: HistoryManagerProps) {
  const { theme, history, deleteHistory, clearHistory } = useBrowserContext();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const [filterDomain, setFilterDomain] = useState('');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return history.filter(h =>
      (!q || h.url.toLowerCase().includes(q) || h.title.toLowerCase().includes(q)) &&
      (!filterDomain || h.domain === filterDomain)
    );
  }, [history, search, filterDomain]);

  const grouped = useMemo(() => groupByDate(filtered), [filtered]);

  // Get top domains for filter chips
  const domains = useMemo(() => {
    const freq: Record<string, number> = {};
    history.forEach(h => { freq[h.domain] = (freq[h.domain] || 0) + 1; });
    return Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([d]) => d);
  }, [history]);

  const handleClearAll = () => {
    Alert.alert('Clear All History', 'Delete all browsing history?\nتمام براؤزنگ ہسٹری حذف کریں؟', [
      { text: 'Cancel | منسوخ', style: 'cancel' },
      { text: 'Clear All | سب حذف', style: 'destructive', onPress: clearHistory },
    ]);
  };

  const renderItem = ({ item }: { item: HistoryItem }) => (
    <Pressable
      onPress={() => { onOpen(item.url); onClose(); }}
      onLongPress={() => Alert.alert('Delete Entry', item.title || item.url, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete | حذف', style: 'destructive', onPress: () => deleteHistory(item.id) },
      ])}
      style={({ pressed }) => [styles.item, { borderColor: theme.glassBorder, opacity: pressed ? 0.75 : 1 }]}
    >
      <LinearGradient colors={['rgba(255,255,255,0.12)', 'rgba(255,255,255,0.03)']} style={StyleSheet.absoluteFillObject} />
      <View style={[styles.favicon, { backgroundColor: theme.cardBg }]}>
        <MaterialIcons name="language" size={16} color={theme.glowColor} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.itemTitle} numberOfLines={1}>{item.title || item.domain}</Text>
        <Text style={styles.itemUrl} numberOfLines={1}>{item.url.replace(/^https?:\/\//, '')}</Text>
        <View style={styles.itemMeta}>
          <View style={[styles.domainChip, { backgroundColor: theme.cardBg, borderColor: theme.glassBorder }]}>
            <Text style={[styles.domainText, { color: theme.glowColor }]}>{item.domain}</Text>
          </View>
          <Text style={styles.timeText}>{formatTime(item.visitedAt)}</Text>
        </View>
      </View>
      <Pressable onPress={() => deleteHistory(item.id)} hitSlop={8} style={styles.deleteBtn}>
        <MaterialIcons name="close" size={16} color="rgba(255,255,255,0.4)" />
      </Pressable>
    </Pressable>
  );

  const renderSection = ({ item }: { item: { date: string; items: HistoryItem[] } }) => (
    <View>
      <View style={styles.dateHeader}>
        <MaterialIcons name="calendar-today" size={12} color={theme.glowColor} />
        <Text style={[styles.dateText, { color: theme.glowColor }]}>{item.date}</Text>
      </View>
      {item.items.map(h => (
        <View key={h.id}>{renderItem({ item: h })}</View>
      ))}
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={[styles.container, { paddingTop: insets.top, backgroundColor: '#000' }]}>
        <LinearGradient colors={[...theme.gradient]} style={StyleSheet.absoluteFillObject} />
        <View style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.55)' }]}>

          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.glassBorder }]}>
            <LinearGradient colors={['rgba(255,255,255,0.22)', 'rgba(255,255,255,0.05)']} style={StyleSheet.absoluteFillObject} />
            <View>
              <Text style={[styles.headerTitle, { textShadowColor: theme.glowColor, textShadowRadius: 8 }]}>
                🕐 History | ہسٹری
              </Text>
              <Text style={styles.headerSub}>{history.length} sites visited | {history.length} سائٹس دیکھی</Text>
            </View>
            <View style={styles.headerActions}>
              {history.length > 0 && (
                <Pressable onPress={handleClearAll} style={styles.clearBtn} hitSlop={6}>
                  <MaterialIcons name="delete-sweep" size={18} color="#FF5555" />
                  <Text style={styles.clearBtnText}>Clear</Text>
                </Pressable>
              )}
              <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={8}>
                <MaterialIcons name="close" size={22} color="#fff" />
              </Pressable>
            </View>
          </View>

          {/* Search Bar */}
          <View style={[styles.searchWrap, { borderColor: theme.glassBorder }]}>
            <LinearGradient colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.06)']} style={StyleSheet.absoluteFillObject} />
            <MaterialIcons name="search" size={18} color="rgba(255,255,255,0.6)" />
            <TextInput
              style={styles.searchInput}
              value={search}
              onChangeText={setSearch}
              placeholder="Search history... | ہسٹری میں تلاش کریں"
              placeholderTextColor="rgba(255,255,255,0.4)"
              autoCapitalize="none"
            />
            {search.length > 0 && (
              <Pressable onPress={() => setSearch('')} hitSlop={8}>
                <MaterialIcons name="clear" size={16} color="rgba(255,255,255,0.5)" />
              </Pressable>
            )}
          </View>

          {/* Domain Filter Chips */}
          {domains.length > 0 && (
            <View>
              <FlatList
                data={['All', ...domains]}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => item}
                contentContainerStyle={styles.chipList}
                renderItem={({ item }) => {
                  const isActive = (item === 'All' && !filterDomain) || filterDomain === item;
                  return (
                    <Pressable
                      onPress={() => setFilterDomain(item === 'All' ? '' : item)}
                      style={[styles.chip, {
                        backgroundColor: isActive ? theme.primary : 'rgba(255,255,255,0.15)',
                        borderColor: isActive ? theme.glowColor : theme.glassBorder,
                      }]}
                    >
                      <Text style={[styles.chipText, isActive && { color: '#fff', fontWeight: '700' }]}>{item}</Text>
                    </Pressable>
                  );
                }}
              />
            </View>
          )}

          {/* History List */}
          {grouped.length === 0 ? (
            <View style={styles.emptyWrap}>
              <MaterialIcons name="history" size={64} color="rgba(255,255,255,0.2)" />
              <Text style={styles.emptyTitle}>
                {search ? 'No results found' : 'No browsing history yet'}
              </Text>
              <Text style={styles.emptyTitleUr}>
                {search ? 'کوئی نتیجہ نہیں' : 'ابھی تک کوئی ہسٹری نہیں'}
              </Text>
            </View>
          ) : (
            <FlatList
              data={grouped}
              keyExtractor={item => item.date}
              renderItem={renderSection}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.list}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16,
    paddingVertical: 14, borderBottomWidth: 1, overflow: 'hidden', gap: 12,
  },
  headerTitle: { color: '#fff', fontSize: 17, fontWeight: '900' },
  headerSub: { color: 'rgba(255,255,255,0.6)', fontSize: 11, marginTop: 2 },
  headerActions: { marginLeft: 'auto', flexDirection: 'row', gap: 8, alignItems: 'center' },
  clearBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255,85,85,0.2)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
  clearBtnText: { color: '#FF5555', fontSize: 12, fontWeight: '700' },
  closeBtn: { padding: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8 },
  searchWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 10, margin: 12,
    borderRadius: 50, borderWidth: 1, overflow: 'hidden', paddingHorizontal: 14, height: 44,
  },
  searchInput: { flex: 1, color: '#fff', fontSize: 13, fontWeight: '500' },
  chipList: { paddingHorizontal: 12, paddingBottom: 10, gap: 7 },
  chip: { borderRadius: 20, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 5 },
  chipText: { color: 'rgba(255,255,255,0.75)', fontSize: 11, fontWeight: '600' },
  list: { paddingHorizontal: 12, paddingBottom: 40, gap: 4 },
  dateHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingVertical: 10, paddingHorizontal: 4, marginTop: 8,
  },
  dateText: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8 },
  item: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderRadius: 12, borderWidth: 1, overflow: 'hidden',
    paddingHorizontal: 12, paddingVertical: 10, marginBottom: 6,
  },
  favicon: { width: 34, height: 34, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  itemTitle: { color: '#fff', fontSize: 13, fontWeight: '600' },
  itemUrl: { color: 'rgba(255,255,255,0.5)', fontSize: 10, marginTop: 2 },
  itemMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  domainChip: { borderRadius: 10, borderWidth: 1, paddingHorizontal: 6, paddingVertical: 2 },
  domainText: { fontSize: 9, fontWeight: '700' },
  timeText: { color: 'rgba(255,255,255,0.45)', fontSize: 10 },
  deleteBtn: { padding: 4 },
  emptyWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10 },
  emptyTitle: { color: 'rgba(255,255,255,0.6)', fontSize: 16, fontWeight: '700', textAlign: 'center' },
  emptyTitleUr: { color: 'rgba(255,255,255,0.4)', fontSize: 13, textAlign: 'center' },
});
