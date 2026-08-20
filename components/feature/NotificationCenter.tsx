import React from 'react';
import {
  View, Text, Pressable, StyleSheet, FlatList, Modal,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBrowserContext, Notification } from '@/contexts/BrowserContext';

interface NotificationCenterProps {
  visible: boolean;
  onClose: () => void;
  onOpen?: (url: string) => void;
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const TYPE_ICONS: Record<string, { icon: string; color: string }> = {
  info: { icon: 'info', color: '#00B4D8' },
  success: { icon: 'check-circle', color: '#00C853' },
  warning: { icon: 'warning', color: '#FF9800' },
  error: { icon: 'error', color: '#FF5555' },
  download: { icon: 'download', color: '#00DCFF' },
  vpn: { icon: 'vpn-lock', color: '#00FF88' },
  bookmark: { icon: 'bookmark', color: '#FFD700' },
};

export function NotificationCenter({ visible, onClose, onOpen }: NotificationCenterProps) {
  const { theme, notifications, markNotificationRead, markAllNotificationsRead, clearNotifications, unreadCount } = useBrowserContext();
  const insets = useSafeAreaInsets();

  const renderItem = ({ item }: { item: Notification }) => {
    const typeInfo = TYPE_ICONS[item.type] || TYPE_ICONS.info;
    return (
      <Pressable
        onPress={() => {
          markNotificationRead(item.id);
          if (item.url && onOpen) { onOpen(item.url); onClose(); }
        }}
        style={[styles.item, {
          borderColor: item.read ? 'rgba(255,255,255,0.1)' : typeInfo.color + '55',
          backgroundColor: item.read ? 'transparent' : typeInfo.color + '08',
        }]}
      >
        {!item.read && (
          <LinearGradient
            colors={[typeInfo.color + '12', 'transparent']}
            style={StyleSheet.absoluteFillObject}
          />
        )}
        <View style={[styles.typeIcon, { backgroundColor: typeInfo.color + '22', borderColor: typeInfo.color + '55' }]}>
          <MaterialIcons name={typeInfo.icon as any} size={18} color={typeInfo.color} />
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
            {!item.read && <View style={[styles.unreadDot, { backgroundColor: typeInfo.color }]} />}
          </View>
          <Text style={styles.itemMsg} numberOfLines={2}>{item.message}</Text>
          <Text style={styles.itemTime}>{timeAgo(item.createdAt)}</Text>
        </View>
        <Pressable onPress={() => markNotificationRead(item.id)} hitSlop={8} style={{ padding: 4 }}>
          <MaterialIcons name="check" size={14} color={item.read ? 'rgba(255,255,255,0.2)' : typeInfo.color} />
        </Pressable>
      </Pressable>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <LinearGradient colors={[...theme.gradient]} style={StyleSheet.absoluteFillObject} />
        <View style={styles.overlay}>

          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.glassBorder }]}>
            <LinearGradient colors={['rgba(255,255,255,0.22)', 'rgba(255,255,255,0.05)']} style={StyleSheet.absoluteFillObject} />
            <View>
              <View style={styles.titleRow}>
                <Text style={[styles.headerTitle, { textShadowColor: theme.glowColor, textShadowRadius: 8 }]}>
                  🔔 Notifications | اطلاعات
                </Text>
                {unreadCount > 0 && (
                  <View style={[styles.unreadBadge, { backgroundColor: '#FF5555' }]}>
                    <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.headerSub}>{notifications.length} total | {unreadCount} unread</Text>
            </View>
            <View style={styles.headerActions}>
              {unreadCount > 0 && (
                <Pressable onPress={markAllNotificationsRead} style={styles.markAllBtn} hitSlop={6}>
                  <MaterialIcons name="done-all" size={16} color={theme.glowColor} />
                  <Text style={[styles.markAllText, { color: theme.glowColor }]}>Mark all read</Text>
                </Pressable>
              )}
              {notifications.length > 0 && (
                <Pressable onPress={clearNotifications} style={styles.clearBtn} hitSlop={6}>
                  <MaterialIcons name="clear-all" size={18} color="#FF5555" />
                </Pressable>
              )}
              <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={8}>
                <MaterialIcons name="close" size={22} color="#fff" />
              </Pressable>
            </View>
          </View>

          {/* Legend */}
          <View style={styles.legend}>
            {Object.entries(TYPE_ICONS).slice(0, 5).map(([type, info]) => (
              <View key={type} style={styles.legendItem}>
                <MaterialIcons name={info.icon as any} size={10} color={info.color} />
                <Text style={[styles.legendText, { color: info.color }]}>{type}</Text>
              </View>
            ))}
          </View>

          {/* List */}
          {notifications.length === 0 ? (
            <View style={styles.emptyWrap}>
              <MaterialIcons name="notifications-none" size={64} color="rgba(255,255,255,0.2)" />
              <Text style={styles.emptyTitle}>No notifications yet</Text>
              <Text style={styles.emptyTitleUr}>ابھی تک کوئی اطلاع نہیں</Text>
              <Text style={styles.emptyHint}>
                VPN status, bookmarks, downloads and other events appear here.
                {'\n'}وی پی این، بک مارکس، ڈاؤنلوڈز یہاں نظر آئیں گے۔
              </Text>
            </View>
          ) : (
            <FlatList
              data={notifications}
              keyExtractor={item => item.id}
              renderItem={renderItem}
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
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, overflow: 'hidden', gap: 12 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle: { color: '#fff', fontSize: 17, fontWeight: '900' },
  unreadBadge: { borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2, minWidth: 20, alignItems: 'center' },
  unreadBadgeText: { color: '#fff', fontSize: 10, fontWeight: '900' },
  headerSub: { color: 'rgba(255,255,255,0.6)', fontSize: 11, marginTop: 2 },
  headerActions: { marginLeft: 'auto', flexDirection: 'row', gap: 6, alignItems: 'center' },
  markAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.12)', paddingHorizontal: 8, paddingVertical: 5 },
  markAllText: { fontSize: 10, fontWeight: '700' },
  clearBtn: { padding: 6, backgroundColor: 'rgba(255,85,85,0.2)', borderRadius: 8 },
  closeBtn: { padding: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8 },
  legend: { flexDirection: 'row', gap: 10, paddingHorizontal: 14, paddingVertical: 8, flexWrap: 'wrap' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  legendText: { fontSize: 9, fontWeight: '700', textTransform: 'uppercase' },
  list: { paddingHorizontal: 12, paddingBottom: 40, gap: 6, paddingTop: 6 },
  item: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, borderRadius: 14, borderWidth: 1, overflow: 'hidden', padding: 12 },
  typeIcon: { width: 36, height: 36, borderRadius: 10, borderWidth: 1, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  itemHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
  itemTitle: { flex: 1, color: '#fff', fontSize: 13, fontWeight: '800' },
  unreadDot: { width: 7, height: 7, borderRadius: 4 },
  itemMsg: { color: 'rgba(255,255,255,0.7)', fontSize: 12, lineHeight: 17 },
  itemTime: { color: 'rgba(255,255,255,0.4)', fontSize: 10, marginTop: 4 },
  emptyWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10, padding: 32 },
  emptyTitle: { color: 'rgba(255,255,255,0.6)', fontSize: 16, fontWeight: '700' },
  emptyTitleUr: { color: 'rgba(255,255,255,0.4)', fontSize: 13 },
  emptyHint: { color: 'rgba(255,255,255,0.3)', fontSize: 11, textAlign: 'center', lineHeight: 18 },
});
