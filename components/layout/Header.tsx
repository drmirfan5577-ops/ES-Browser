import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { RotatingLogo } from '@/components/feature/RotatingLogo';
import { DigitalClock } from '@/components/feature/DigitalClock';
import { useBrowserContext } from '@/contexts/BrowserContext';

interface HeaderProps {
  onLeftSidebar: () => void;
  onRightSidebar: () => void;
  onThemePicker: () => void;
  onBookmarks?: () => void;
  onDownloads?: () => void;
  onHistory?: () => void;
  onIncognito?: () => void;
  onNotifications?: () => void;
  onQRScanner?: () => void;
}

export function Header({
  onLeftSidebar, onRightSidebar, onThemePicker,
  onBookmarks, onNotifications, onIncognito,
}: HeaderProps) {
  const { theme, brandingText, bookmarks, unreadCount } = useBrowserContext();

  return (
    <View style={[styles.container, { borderColor: theme.glassBorder }]}>
      <LinearGradient colors={['rgba(255,255,255,0.28)', 'rgba(255,255,255,0.06)']} style={StyleSheet.absoluteFillObject} />

      {/* ── BISMILLAH at very top ── */}
      <View style={styles.bismillahRow}>
        <LinearGradient colors={['rgba(255,215,0,0.18)', 'rgba(255,215,0,0.04)']} style={StyleSheet.absoluteFillObject} />
        <Text style={[styles.bismillah, { textShadowColor: '#FFD700', textShadowRadius: 20 }]}>
          {'\u0628\u0650\u0633\u0652\u0645\u0650 \u0627\u0644\u0644\u0651\u0670\u0647\u0650 \u0627\u0644\u0631\u0651\u064E\u062D\u0652\u0645\u0670\u0646\u0650 \u0627\u0644\u0631\u0651\u064E\u062D\u0650\u064A\u0652\u0645\u0650'}
        </Text>
      </View>

      {/* ── MAIN ROW: Logo | Title | Clock ── */}
      <View style={styles.mainRow}>

        {/* LEFT: Sidebar arrow + Logo */}
        <View style={styles.leftGroup}>
          <Pressable onPress={onLeftSidebar} style={styles.arrowBtn} hitSlop={8}>
            <MaterialIcons name="chevron-left" size={24} color="#fff" />
          </Pressable>
          <RotatingLogo size={40} onPress={onThemePicker} />
        </View>

        {/* CENTER: Title block */}
        <View style={styles.centerGroup}>
          <Text style={[styles.arabic, { textShadowColor: theme.glowColor, textShadowRadius: 8 }]} numberOfLines={1}>
            {brandingText.arabic}
          </Text>
          <Text style={[styles.mainTitle, { textShadowColor: theme.glowColor, textShadowRadius: 12 }]} numberOfLines={1}>
            ✨ EvEr SmArT BrOwSeR ✨
          </Text>
          <Text style={[styles.mainTitleUr, { color: theme.glowColor }]} numberOfLines={1}>
            ایور سمارٹ براؤزر
          </Text>
          {/* Quick action buttons */}
          <View style={styles.quickBtns}>
            {onNotifications && (
              <Pressable onPress={onNotifications} style={styles.qBtn} hitSlop={5}>
                <MaterialIcons name="notifications" size={12} color="#FF6B9D" />
                {unreadCount > 0 && (
                  <View style={styles.dot}><Text style={styles.dotNum}>{unreadCount > 9 ? '9+' : unreadCount}</Text></View>
                )}
              </Pressable>
            )}
            {onBookmarks && (
              <Pressable onPress={onBookmarks} style={styles.qBtn} hitSlop={5}>
                <MaterialIcons name="bookmark" size={12} color="#FFD700" />
                {bookmarks.length > 0 && (
                  <View style={[styles.dot, { backgroundColor: '#FFD700' }]}><Text style={styles.dotNum}>{bookmarks.length > 9 ? '9+' : bookmarks.length}</Text></View>
                )}
              </Pressable>
            )}
            {onIncognito && (
              <Pressable onPress={onIncognito} style={[styles.qBtn, { backgroundColor: 'rgba(150,0,180,0.25)' }]} hitSlop={5}>
                <MaterialIcons name="privacy-tip" size={12} color="#CE93D8" />
              </Pressable>
            )}
          </View>
        </View>

        {/* RIGHT: Clock + Sidebar arrow */}
        <View style={styles.rightGroup}>
          <DigitalClock />
          <Pressable onPress={onRightSidebar} style={styles.arrowBtn} hitSlop={8}>
            <MaterialIcons name="chevron-right" size={24} color="#fff" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1, borderLeftWidth: 0, borderRightWidth: 0, borderTopWidth: 0,
    paddingBottom: 6, overflow: 'hidden',
  },
  bismillahRow: {
    overflow: 'hidden',
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,215,0,0.25)',
    alignItems: 'center',
  },
  bismillah: {
    color: '#FFD700',
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 1,
  },
  mainRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 4, paddingTop: 6, gap: 4,
  },
  leftGroup: { flexDirection: 'row', alignItems: 'center', gap: 2, flexShrink: 0 },
  centerGroup: { flex: 1, alignItems: 'center', gap: 1 },
  rightGroup: { flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 },
  arrowBtn: {
    padding: 4, backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 8,
  },
  arabic: { color: '#fff', fontSize: 10, fontWeight: '700', textAlign: 'center' },
  mainTitle: { color: '#fff', fontSize: 13, fontWeight: '900', textAlign: 'center', letterSpacing: 0.5 },
  mainTitleUr: { fontSize: 10, fontWeight: '700', textAlign: 'center' },
  quickBtns: { flexDirection: 'row', gap: 4, marginTop: 2 },
  qBtn: { padding: 4, backgroundColor: 'rgba(255,255,255,0.16)', borderRadius: 7, position: 'relative', minWidth: 22, alignItems: 'center' },
  dot: { position: 'absolute', top: -3, right: -3, width: 12, height: 12, borderRadius: 6, backgroundColor: '#FF5555', justifyContent: 'center', alignItems: 'center' },
  dotNum: { color: '#000', fontSize: 6, fontWeight: '900' },
});
