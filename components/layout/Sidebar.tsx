import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Pressable, StyleSheet, ScrollView, Switch, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBrowserContext } from '@/contexts/BrowserContext';

const SW = Dimensions.get('window').width;
const SIDEBAR_W = Math.min(SW * 0.78, 300);

interface SidebarProps {
  side: 'left' | 'right';
  visible: boolean;
  onClose: () => void;
  onOpenUrl?: (url: string) => void;
  // Left sidebar features — browser tools
  onBookmarks?: () => void;
  onDownloads?: () => void;
  onHistory?: () => void;
  onIncognito?: () => void;
  onQRScanner?: () => void;
  onPasswordManager?: () => void;
  onVoiceSearch?: () => void;
  onNotifications?: () => void;
  onThemePicker?: () => void;
  // Right sidebar features — device & media
  onGallery?: () => void;
  onMediaPlayer?: () => void;
  onDigitalQuran?: () => void;
}

// LEFT SIDEBAR — Browsing-focused tools (Themes moved here from header)
const LEFT_TOOLS = [
  { id: 'vpn', icon: 'vpn-lock', label: '⚔️ VPN Shield', labelUr: 'وی پی این محافظ', isToggle: true, toggleKey: 'vpn', glowColor: '#00FF88' },
  { id: 'adb', icon: 'block', label: 'Ad Blocker', labelUr: 'ایڈ بلاکر', isToggle: true, toggleKey: 'adblock', glowColor: '#00DCFF' },
  { id: 'themes', icon: 'palette', label: '🎨 Themes', labelUr: 'تھیمز', special: 'themes', color: '#DA70D6' },
  { id: 'incognito', icon: 'privacy-tip', label: 'Incognito', labelUr: 'نجی موڈ', special: 'incognito', color: '#CE93D8' },
  { id: 'history', icon: 'history', label: 'History', labelUr: 'ہسٹری', special: 'history', color: '#AB47BC' },
  { id: 'bookmarks', icon: 'bookmarks', label: 'Bookmarks', labelUr: 'بک مارکس', special: 'bookmarks', color: '#FFD700' },
  { id: 'downloads', icon: 'download', label: 'Downloads', labelUr: 'ڈاؤنلوڈز', special: 'downloads', color: '#00DCFF' },
  { id: 'passwords', icon: 'lock', label: 'Password Vault', labelUr: 'پاسورڈ والٹ', special: 'passwords', color: '#00FF88' },
  { id: 'qr', icon: 'qr-code-scanner', label: 'QR Scanner', labelUr: 'کیو آر اسکینر', special: 'qr', color: '#4FC3F7' },
  { id: 'voice', icon: 'mic', label: 'Voice Search', labelUr: 'آواز سے تلاش', special: 'voice', color: '#FF9800' },
  { id: 'notifs', icon: 'notifications', label: 'Notifications', labelUr: 'اطلاعات', special: 'notifs', color: '#FF6B9D' },
  { id: 'translate', icon: 'translate', label: 'Translator', labelUr: 'ترجمہ', url: 'https://translate.google.com', color: '#4FC3F7' },
  { id: 'read', icon: 'chrome-reader-mode', label: 'Reading Mode', labelUr: 'ریڈنگ موڈ', url: 'https://getpocket.com', color: '#A5D6A7' },
];

// RIGHT SIDEBAR — Web tools & quick launchers only
// Intellectual features (Gallery, Media Player, Quran, QR, Voice, Password) moved to Admin Panel
const RIGHT_TOOLS = [
  { id: 'maps', icon: 'map', label: '🗺️ Maps', labelUr: 'نقشہ', url: 'https://maps.google.com', color: '#4FC3F7' },
  { id: 'weather', icon: 'cloud', label: '⛅ Weather', labelUr: 'موسم', url: 'https://weather.com', color: '#87CEEB' },
  { id: 'calc', icon: 'calculate', label: '🔢 Calculator', labelUr: 'کیلکولیٹر', url: 'https://www.desmos.com/scientific', color: '#AB47BC' },
  { id: 'notes', icon: 'notes', label: '📝 Notes', labelUr: 'نوٹس', url: 'https://keep.google.com', color: '#FFB300' },
  { id: 'drive', icon: 'cloud-upload', label: '☁️ Cloud Drive', labelUr: 'کلاؤڈ ڈرائیو', url: 'https://drive.google.com', color: '#4FC3F7' },
  { id: 'tasks', icon: 'task-alt', label: '✅ Task Planner', labelUr: 'ٹاسک پلانر', url: 'https://tasks.google.com', color: '#00C853' },
  { id: 'playstore', icon: 'shop', label: '🛒 Play Store', labelUr: 'پلے اسٹور', url: 'https://play.google.com', color: '#00C853' },
  { id: 'website', icon: 'language', label: '🌐 ESB GitHub', labelUr: 'گٹ ہب ریپو', url: 'https://github.com/drmirfan5577-ops/Smart-Browser-Ons3', color: '#DD2476' },
  { id: 'l_chatgpt', icon: 'psychology', label: '🤖 ChatGPT', labelUr: 'چیٹ جی پی ٹی', url: 'https://chat.openai.com', color: '#16A374' },
  { id: 'l_youtube', icon: 'play-circle-outline', label: '▶️ YouTube', labelUr: 'یوٹیوب', url: 'https://m.youtube.com', color: '#FF0000' },
  { id: 'l_gmail', icon: 'mail', label: '📧 Gmail', labelUr: 'جی میل', url: 'https://mail.google.com', color: '#EA4335' },
];

export function Sidebar({
  side, visible, onClose, onOpenUrl,
  onBookmarks, onDownloads, onHistory, onIncognito, onQRScanner, onPasswordManager, onVoiceSearch, onNotifications, onThemePicker,
  onGallery, onMediaPlayer, onDigitalQuran,
}: SidebarProps) {
  const { theme, vpnEnabled, setVpnEnabled, adBlockEnabled, setAdBlockEnabled, bookmarks, downloads, history, unreadCount } = useBrowserContext();
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(side === 'left' ? -SIDEBAR_W : SIDEBAR_W)).current;

  useEffect(() => {
    Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, bounciness: 6 }).start();
  }, []);

  const handleClose = () => {
    Animated.timing(slideAnim, { toValue: side === 'left' ? -SIDEBAR_W : SIDEBAR_W, duration: 250, useNativeDriver: true }).start(onClose);
  };

  const handleTool = (tool: any) => {
    if (tool.url && onOpenUrl) { onOpenUrl(tool.url); handleClose(); return; }
    const actions: Record<string, (() => void) | undefined> = {
      incognito: onIncognito,
      history: onHistory,
      bookmarks: onBookmarks,
      downloads: onDownloads,
      passwords: onPasswordManager,
      qr: onQRScanner,
      voice: onVoiceSearch,
      notifs: onNotifications,
      themes: onThemePicker,
      gallery: onGallery,
      player: onMediaPlayer,
      quran: onDigitalQuran,
    };
    const action = actions[tool.special];
    if (action) { action(); handleClose(); }
  };

  const getCount = (id: string) => {
    if (id === 'bookmarks') return bookmarks.length;
    if (id === 'downloads') return downloads.length;
    if (id === 'history') return history.length > 99 ? 99 : history.length;
    if (id === 'notifs') return unreadCount;
    return 0;
  };

  const TOOLS = side === 'left' ? LEFT_TOOLS : RIGHT_TOOLS;
  const sideLabel = side === 'left' ? '🔍 Browser Tools' : '🌐 Web & Quick Links';
  const sideUrdu = side === 'left' ? 'براؤزر ٹولز' : 'ویب ٹولز اور لنکس';

  return (
    <View style={styles.overlay}>
      <Pressable style={styles.backdrop} onPress={handleClose} />
      <Animated.View style={[
        styles.panel,
        { [side]: 0, transform: [{ translateX: slideAnim }], paddingTop: insets.top + 10, paddingBottom: insets.bottom + 10, borderColor: theme.glassBorder },
      ]}>
        <LinearGradient colors={[...theme.gradient]} style={StyleSheet.absoluteFillObject} />
        <View style={styles.panelInner}>

          {/* Header with arrow */}
          <View style={styles.panelHeader}>
            {side === 'right' && (
              <Pressable onPress={handleClose} style={styles.arrowCloseBtn} hitSlop={8}>
                <MaterialIcons name="chevron-right" size={26} color="#fff" />
              </Pressable>
            )}
            <View style={{ flex: 1 }}>
              <Text style={styles.panelTitle}>{sideLabel}</Text>
              <Text style={styles.panelTitleUr}>{sideUrdu}</Text>
            </View>
            {side === 'left' && (
              <Pressable onPress={handleClose} style={styles.arrowCloseBtn} hitSlop={8}>
                <MaterialIcons name="chevron-left" size={26} color="#fff" />
              </Pressable>
            )}
          </View>

          {/* VPN Status Banner (left sidebar only) */}
          {side === 'left' && vpnEnabled && (
            <View style={styles.vpnBanner}>
              <LinearGradient colors={['rgba(0,255,136,0.2)', 'transparent']} style={StyleSheet.absoluteFillObject} />
              <Text style={styles.vpnBannerText}>⚔️ VPN CONNECTED | متصل</Text>
            </View>
          )}

          <ScrollView showsVerticalScrollIndicator={false}>
            {TOOLS.map(tool => {
              const count = getCount(tool.id);
              return (
                <Pressable key={tool.id} onPress={() => handleTool(tool)}
                  style={({ pressed }) => [styles.toolItem, { borderColor: 'rgba(255,255,255,0.15)', opacity: pressed ? 0.8 : 1 }]}>
                  <View style={[styles.toolIcon, { backgroundColor: ((tool as any).color || '#fff') + '22' }]}>
                    <MaterialIcons name={tool.icon as any} size={20} color={(tool as any).color || '#fff'} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.toolLabel}>{tool.label}</Text>
                    <Text style={styles.toolLabelUr}>{tool.labelUr}</Text>
                  </View>
                  {/* Toggle */}
                  {(tool as any).toggleKey && (
                    <Switch
                      value={(tool as any).toggleKey === 'vpn' ? vpnEnabled : adBlockEnabled}
                      onValueChange={(v) => (tool as any).toggleKey === 'vpn' ? setVpnEnabled(v) : setAdBlockEnabled(v)}
                      trackColor={{ false: 'rgba(255,255,255,0.2)', true: (tool as any).glowColor || theme.glowColor }}
                      thumbColor="#fff"
                    />
                  )}
                  {/* Count badge */}
                  {count > 0 && !(tool as any).toggleKey && (
                    <View style={[styles.countBadge, { backgroundColor: (tool as any).color || theme.primary }]}>
                      <Text style={styles.countText}>{count > 99 ? '99+' : count}</Text>
                    </View>
                  )}
                  {/* Arrow indicators */}
                  {(tool as any).url && <MaterialIcons name="open-in-new" size={13} color="rgba(255,255,255,0.35)" />}
                  {(tool as any).special && !(tool as any).toggleKey && <MaterialIcons name="chevron-right" size={18} color="rgba(255,255,255,0.4)" />}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100 },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.55)' },
  panel: { position: 'absolute', top: 0, bottom: 0, width: SIDEBAR_W, overflow: 'hidden', borderWidth: 1 },
  panelInner: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)' },
  panelHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 10, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.15)',
  },
  arrowCloseBtn: { padding: 4, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8 },
  panelTitle: { color: '#fff', fontSize: 15, fontWeight: '900' },
  panelTitleUr: { color: 'rgba(255,255,255,0.65)', fontSize: 11, marginTop: 2 },
  vpnBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: 'rgba(0,255,136,0.2)', overflow: 'hidden',
  },
  vpnBannerText: { color: '#00FF88', fontSize: 12, fontWeight: '900', letterSpacing: 0.5 },
  toolItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 11, paddingHorizontal: 16, borderBottomWidth: 1,
  },
  toolIcon: { width: 38, height: 38, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  toolLabel: { color: '#fff', fontSize: 13, fontWeight: '600' },
  toolLabelUr: { color: 'rgba(255,255,255,0.65)', fontSize: 10, marginTop: 1 },
  countBadge: { borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2, minWidth: 22, alignItems: 'center' },
  countText: { color: '#000', fontSize: 9, fontWeight: '900' },
});
