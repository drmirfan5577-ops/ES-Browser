import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet, TextInput,
  Switch, Alert, Modal, Image, Animated, Linking,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useBrowserContext, CustomPersonality, LinkedSite } from '@/contexts/BrowserContext';
import { THEMES, AppTheme } from '@/constants/theme';
import { FeatureManager } from '@/components/feature/FeatureManager';
import { ExportManager } from '@/components/feature/ExportManager';
import { HUB_APPS, HUB_META } from '@/constants/config';

// ── Icon Library data ──────────────────────────────────────────────────────
const ICON_LIBRARY = [
  { name: 'language', lib: 'mat' }, { name: 'search', lib: 'mat' }, { name: 'public', lib: 'mat' },
  { name: 'home', lib: 'mat' }, { name: 'star', lib: 'mat' }, { name: 'favorite', lib: 'mat' },
  { name: 'bookmark', lib: 'mat' }, { name: 'share', lib: 'mat' }, { name: 'download', lib: 'mat' },
  { name: 'play-circle-filled', lib: 'mat' }, { name: 'videocam', lib: 'mat' }, { name: 'music-note', lib: 'mat' },
  { name: 'camera', lib: 'mat' }, { name: 'photo-library', lib: 'mat' }, { name: 'article', lib: 'mat' },
  { name: 'mail', lib: 'mat' }, { name: 'chat', lib: 'mat' }, { name: 'phone', lib: 'mat' },
  { name: 'map', lib: 'mat' }, { name: 'navigation', lib: 'mat' }, { name: 'place', lib: 'mat' },
  { name: 'shopping-cart', lib: 'mat' }, { name: 'store', lib: 'mat' }, { name: 'payment', lib: 'mat' },
  { name: 'work', lib: 'mat' }, { name: 'school', lib: 'mat' }, { name: 'calculate', lib: 'mat' },
  { name: 'analytics', lib: 'mat' }, { name: 'dashboard', lib: 'mat' }, { name: 'settings', lib: 'mat' },
  { name: 'security', lib: 'mat' }, { name: 'lock', lib: 'mat' }, { name: 'vpn-lock', lib: 'mat' },
  { name: 'sports-soccer', lib: 'mat' }, { name: 'fitness-center', lib: 'mat' }, { name: 'local-hospital', lib: 'mat' },
  { name: 'restaurant', lib: 'mat' }, { name: 'flight', lib: 'mat' }, { name: 'hotel', lib: 'mat' },
  { name: 'eco', lib: 'mat' }, { name: 'wb-sunny', lib: 'mat' }, { name: 'cloud', lib: 'mat' },
  { name: 'logo-youtube', lib: 'ion' }, { name: 'logo-facebook', lib: 'ion' }, { name: 'logo-instagram', lib: 'ion' },
  { name: 'logo-twitter', lib: 'ion' }, { name: 'logo-whatsapp', lib: 'ion' }, { name: 'logo-tiktok', lib: 'ion' },
  { name: 'logo-google', lib: 'ion' }, { name: 'logo-apple', lib: 'ion' }, { name: 'logo-android', lib: 'ion' },
  { name: 'globe', lib: 'ion' }, { name: 'planet', lib: 'ion' }, { name: 'rocket', lib: 'ion' },
];

const EMOJI_LIST = ['🌐', '📱', '💻', '🎮', '📷', '🎵', '📰', '🛒', '✈️', '🏠', '📚', '💰', '🔒', '⚙️', '🎯', '🔍', '📊', '🎨', '🏆', '❤️', '⭐', '🚀', '🌟', '💡', '🎬', '📡', '🕌', '🤖', '🌐', '📘', '▶️', '💬', '📰', '⚙️'];

const BG_PRESETS = [
  'rgba(0,160,80,0.32)', 'rgba(30,80,200,0.32)', 'rgba(130,0,200,0.32)',
  'rgba(200,80,0,0.32)', 'rgba(80,80,80,0.32)', 'rgba(200,30,30,0.32)',
  'rgba(0,180,200,0.32)', 'rgba(160,120,0,0.32)', 'rgba(0,100,0,0.32)',
  'rgba(100,0,100,0.32)', 'rgba(0,80,160,0.32)', 'rgba(200,100,0,0.32)',
];

interface CustomApp {
  id: string; name: string; ur: string; icon: string; iconLib: string;
  emoji: string; url: string; bg: string;
}

const DEFAULT_CUSTOM_APPS: CustomApp[] = Array.from({ length: 10 }, (_, i) => ({
  id: `custom_${i}`, name: 'Add App', ur: 'ایپ شامل کریں',
  icon: 'add-circle-outline', iconLib: 'mat', emoji: '➕', url: '', bg: 'rgba(120,120,120,0.2)',
}));

const COLOR_SWATCHES = [
  '#FF0000','#FF4500','#FF8C00','#FFD700','#FFFF00','#ADFF2F',
  '#00FF00','#00FA9A','#00FFFF','#00BFFF','#0000FF','#7B68EE',
  '#8B00FF','#FF00FF','#FF69B4','#FF1493','#FFFFFF','#C0C0C0',
  '#808080','#000000','#8B4513','#D2691E','#F5DEB3','#FFE4B5',
];

function ColorPicker({ value, onChange }: { value: string; onChange: (c: string) => void }) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
      {COLOR_SWATCHES.map(c => (
        <Pressable key={c} onPress={() => onChange(c)}
          style={[styles.swatch, { backgroundColor: c, borderWidth: value === c ? 3 : 1, borderColor: value === c ? '#fff' : 'rgba(255,255,255,0.3)' }]} />
      ))}
      <View style={styles.swatchHex}>
        <TextInput
          style={styles.hexInput}
          value={value}
          onChangeText={onChange}
          placeholder="#RRGGBB"
          placeholderTextColor="rgba(255,255,255,0.4)"
          autoCapitalize="none"
        />
      </View>
    </View>
  );
}

export default function AdminScreen() {
  const {
    theme, setTheme, vpnEnabled, setVpnEnabled, adBlockEnabled, setAdBlockEnabled,
    tickerMessages, setTickerMessages, brandingText, setBrandingText,
    adminPassword, setAdminPassword, bookmarks, downloads,
    customLogoUri, setCustomLogoUri, customPersonalities, setCustomPersonalities,
    customHubApps, setCustomHubApps,
    linkedSites, setLinkedSites,
  } = useBrowserContext();

  // ── ALL HOOKS MUST BE DECLARED BEFORE ANY CONDITIONAL RETURN ──────────────
  const glowAnim = useRef(new Animated.Value(0)).current;

  // Auth state
  const [authed, setAuthed] = useState(false);
  const [pwdInput, setPwdInput] = useState('');
  const [pwdError, setPwdError] = useState('');

  // UI state
  const [section, setSection] = useState<string>('overview');
  const [exportOpen, setExportOpen] = useState(false);
  const [updateChecking, setUpdateChecking] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<'idle' | 'uptodate' | 'available'>('idle');
  const [featureManagerOpen, setFeatureManagerOpen] = useState(false);
  const [localTickers, setLocalTickers] = useState(tickerMessages);
  const [localBranding, setLocalBranding] = useState(brandingText);
  const [newPwd, setNewPwd] = useState('');

  // Hub Manager
  const [activeHubId, setActiveHubId] = useState('islamic');
  const [editingHubApp, setEditingHubApp] = useState<any | null>(null);

  // Personalities editor
  const [editingPersonalities, setEditingPersonalities] = useState<CustomPersonality[]>(
    customPersonalities.length > 0 ? customPersonalities : [
      { id: 'jinnah', name: 'Quaid-e-Azam', ur: 'قائد اعظم', title: 'Founder of Pakistan', titleUr: 'بانی پاکستان', imageUri: null },
      { id: 'iqbal', name: 'Dr Allama Iqbal', ur: 'علامہ اقبال', title: 'National Poet', titleUr: 'قومی شاعر', imageUri: null },
      { id: 'aqkhan', name: 'Dr AQ Khan', ur: 'ڈاکٹر عبد القدیر', title: 'Nuclear Pioneer', titleUr: 'ایٹمی علوم کے بانی', imageUri: null },
    ]
  );

  // App Grid Editor
  const [customApps, setCustomApps] = useState<CustomApp[]>(DEFAULT_CUSTOM_APPS);
  const [editingApp, setEditingApp] = useState<CustomApp | null>(null);
  const [iconSearch, setIconSearch] = useState('');
  const [iconLibModal, setIconLibModal] = useState(false);
  const [pendingIconFor, setPendingIconFor] = useState<string | null>(null);

  // Theme Creator
  const [newThemeName, setNewThemeName] = useState('My Theme');
  const [newThemeNameUr, setNewThemeNameUr] = useState('میری تھیم');
  const [tc1, setTc1] = useState('#FF6B6B');
  const [tc2, setTc2] = useState('#4ECDC4');
  const [tc3, setTc3] = useState('#45B7D1');
  const [glowC, setGlowC] = useState('#FFD700');
  const [primaryC, setPrimaryC] = useState('#FF6B6B');
  const [themeColorProp, setThemeColorProp] = useState<'c1' | 'c2' | 'c3' | 'glow' | 'primary' | null>(null);

  // Theme Scheduler
  const [schedulerEnabled, setSchedulerEnabled] = useState(false);
  const [dayThemeId, setDayThemeId] = useState(THEMES[0].id);
  const [nightThemeId, setNightThemeId] = useState(THEMES.find(t => t.isDark)?.id || THEMES[0].id);
  const [dayHour, setDayHour] = useState('06');
  const [nightHour, setNightHour] = useState('20');

  // Integrations
  const [customIntegrations, setCustomIntegrations] = useState([
    { id: 'i1', name: 'ChatGPT Widget', icon: 'psychology', color: '#16A374', url: 'https://chat.openai.com', enabled: true },
    { id: 'i2', name: 'Google Workspace', icon: 'work', color: '#4285F4', url: 'https://workspace.google.com', enabled: false },
    { id: 'i3', name: 'GitHub Projects', icon: 'code', color: '#E040FB', url: 'https://github.com', enabled: false },
  ]);
  const [newIntegName, setNewIntegName] = useState('');
  const [newIntegUrl, setNewIntegUrl] = useState('');
  const [newIntegColor, setNewIntegColor] = useState('#00FF88');

  // Linked Sites editor state
  const [editingLinkedSites, setEditingLinkedSites] = useState<LinkedSite[]>(linkedSites);
  const [linkedSitesSaved, setLinkedSitesSaved] = useState(false);
  // sync when context loads
  React.useEffect(() => { setEditingLinkedSites(linkedSites); }, [linkedSites.length]);

  // ── Effects (must be before any conditional return) ────────────────────────
  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(glowAnim, { toValue: 1, duration: 2500, useNativeDriver: true }),
      Animated.timing(glowAnim, { toValue: 0, duration: 2500, useNativeDriver: true }),
    ])).start();
  }, []);

  useEffect(() => {
    if (!schedulerEnabled) return;
    const checkSchedule = () => {
      const hour = new Date().getHours();
      const dayH = parseInt(dayHour, 10);
      const nightH = parseInt(nightHour, 10);
      if (hour >= dayH && hour < nightH) {
        const t = THEMES.find(x => x.id === dayThemeId);
        if (t && theme.id !== t.id) setTheme(t);
      } else {
        const t = THEMES.find(x => x.id === nightThemeId);
        if (t && theme.id !== t.id) setTheme(t);
      }
    };
    checkSchedule();
    const interval = setInterval(checkSchedule, 60000);
    return () => clearInterval(interval);
  }, [schedulerEnabled, dayThemeId, nightThemeId, dayHour, nightHour, theme.id]);

  // ── Derived / computed ─────────────────────────────────────────────────────
  const filteredIcons = ICON_LIBRARY.filter(i => !iconSearch || i.name.includes(iconSearch.toLowerCase()));

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleLogin = () => {
    if (pwdInput === adminPassword) { setAuthed(true); setPwdError(''); }
    else { setPwdError('Incorrect password | غلط پاسورڈ'); }
  };

  const saveTickers = () => {
    setTickerMessages(localTickers);
    Alert.alert('Saved ✓', 'Ticker messages updated | ٹیکر پیغامات محفوظ');
  };

  const saveBranding = () => {
    setBrandingText(localBranding);
    Alert.alert('Saved ✓', 'Branding updated | برانڈنگ محفوظ');
  };

  const changePassword = () => {
    if (newPwd.length < 4) { Alert.alert('Error', 'Min 4 chars | کم از کم 4 حروف'); return; }
    setAdminPassword(newPwd); setNewPwd('');
    Alert.alert('Done ✓', 'Password changed | پاسورڈ تبدیل ہو گیا');
  };

  const handleSaveCustomTheme = () => {
    const customTheme: AppTheme = {
      id: `custom_${Date.now()}`,
      name: newThemeName || 'Custom',
      nameUrdu: newThemeNameUr || 'کسٹم',
      gradient: [tc1, tc2, tc3, tc1] as const,
      primary: primaryC, secondary: tc2,
      glass: 'rgba(255,255,255,0.22)',
      glassBorder: glowC + '70',
      glowColor: glowC,
      tickerColors: [tc1, tc2, tc3, tc1, tc2, tc3, tc1],
      cardBg: `${primaryC}2A`,
      tabBg: 'rgba(0,0,0,0.9)',
      tabActive: glowC,
      tabInactive: 'rgba(255,255,255,0.5)',
    };
    setTheme(customTheme);
    Alert.alert('Theme Applied ✓', `"${newThemeName}" applied | تھیم لگا دی گئی`);
  };

  const handleSelectIcon = (icon: string, lib: string) => {
    if (pendingIconFor && editingApp) {
      setEditingApp({ ...editingApp, icon, iconLib: lib });
    }
    setIconLibModal(false);
    setPendingIconFor(null);
  };

  const saveAppEdit = () => {
    if (!editingApp) return;
    setCustomApps(prev => prev.map(a => a.id === editingApp.id ? editingApp : a));
    setEditingApp(null);
  };

  const handlePickLogo = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.9,
    });
    if (!res.canceled && res.assets[0]) setCustomLogoUri(res.assets[0].uri);
  };

  const handlePickPersonalityImage = async (pid: string) => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], allowsEditing: true, aspect: [3, 4], quality: 0.9,
    });
    if (!res.canceled && res.assets[0]) {
      const uri = res.assets[0].uri;
      const updated = editingPersonalities.map(p => p.id === pid ? { ...p, imageUri: uri } : p);
      setEditingPersonalities(updated);
      setCustomPersonalities(updated);
    }
  };

  const savePersonalities = () => {
    setCustomPersonalities(editingPersonalities);
    Alert.alert('Saved ✓', 'Personality data updated | شخصیات اپ ڈیٹ');
  };

  const getHubApps = (hubId: string) => customHubApps[hubId] || HUB_APPS[hubId] || [];

  const saveHubApp = (hubId: string, app: any) => {
    const current = getHubApps(hubId);
    const idx = current.findIndex((a: any) => a.id === app.id);
    const updated = idx >= 0 ? current.map((a: any) => a.id === app.id ? app : a) : [...current, app];
    setCustomHubApps(hubId, updated);
    setEditingHubApp(null);
    Alert.alert('Saved ✓ | محفوظ', `${app.name} updated in ${HUB_META[hubId]?.name}`);
  };

  const removeHubApp = (hubId: string, appId: string) => {
    Alert.alert('Remove App | ایپ ہٹائیں', 'Remove this app from the hub?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => {
        const updated = getHubApps(hubId).filter((a: any) => a.id !== appId);
        setCustomHubApps(hubId, updated);
      }},
    ]);
  };

  const resetHubToDefault = (hubId: string) => {
    Alert.alert('Reset Hub | ری سیٹ', 'Restore default apps for this hub?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: () => {
        setCustomHubApps(hubId, [...(HUB_APPS[hubId] || [])]);
        Alert.alert('Done ✓', 'Hub restored to defaults');
      }},
    ]);
  };

  const addIntegration = () => {
    if (!newIntegName.trim() || !newIntegUrl.trim()) { Alert.alert('Required', 'Name and URL are required.'); return; }
    setCustomIntegrations(prev => [...prev, {
      id: `i_${Date.now()}`, name: newIntegName, icon: 'extension', color: newIntegColor,
      url: newIntegUrl, enabled: true,
    }]);
    setNewIntegName(''); setNewIntegUrl('');
    Alert.alert('Added ✅', `${newIntegName} integration added!`);
  };

  const removeIntegration = (id: string) => {
    setCustomIntegrations(prev => prev.filter(i => i.id !== id));
  };

  // ── CONDITIONAL EARLY RETURN — safe now, all hooks are above ──────────────
  if (!authed) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <StatusBar style="light" />
        <LinearGradient colors={[...theme.gradient]} style={styles.root}>
          <View style={styles.loginWrap}>
            <LinearGradient colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.06)']} style={StyleSheet.absoluteFillObject} />
            <Text style={styles.loginIcon}>🔐</Text>
            <Text style={[styles.loginTitle, { textShadowColor: theme.glowColor, textShadowRadius: 12 }]}>Admin Panel</Text>
            <Text style={styles.loginTitleUr}>ایڈمن پینل</Text>
            <Text style={styles.loginSub}>Password Protected | پاسورڈ سے محفوظ</Text>
            <View style={[styles.inputWrap, { borderColor: pwdError ? '#FF5555' : theme.glassBorder }]}>
              <LinearGradient colors={['rgba(255,255,255,0.28)', 'rgba(255,255,255,0.08)']} style={StyleSheet.absoluteFillObject} />
              <MaterialIcons name="lock" size={20} color="rgba(255,255,255,0.7)" />
              <TextInput style={styles.pwdInput} value={pwdInput} onChangeText={setPwdInput}
                placeholder="Enter admin password" placeholderTextColor="rgba(255,255,255,0.45)"
                secureTextEntry onSubmitEditing={handleLogin} returnKeyType="done" />
            </View>
            {pwdError ? <Text style={styles.errorText}>{pwdError}</Text> : null}
            <Pressable onPress={handleLogin} style={[styles.loginBtn, { backgroundColor: theme.primary }]}>
              <Text style={styles.loginBtnText}>Login | داخل ہوں</Text>
            </Pressable>
          </View>
        </LinearGradient>
        <ExportManager visible={exportOpen} onClose={() => setExportOpen(false)} />
      </SafeAreaView>
    );
  }

  // ── SECTIONS CONFIG ────────────────────────────────────────────────────────
  const SECTIONS = [
    { id: 'overview', label: 'Overview', icon: 'dashboard' },
    { id: 'media', label: '🎬 Media & Quran', icon: 'play-circle-filled' },
    { id: 'github', label: '🐙 GitHub Push', icon: 'code' },
    { id: 'netlify', label: '🚀 Netlify Deploy', icon: 'cloud-upload' },
    { id: 'download', label: '📥 APK Download', icon: 'download' },
    { id: 'sourcecode', label: '💾 Source Code', icon: 'code' },
    { id: 'linkedsites', label: '🔗 Linked Sites', icon: 'link' },
    { id: 'pwa', label: '📲 PWA', icon: 'phone-android' },
    { id: 'appdocs', label: '📋 App Store Docs', icon: 'description' },
    { id: 'theme', label: 'Themes', icon: 'palette' },
    { id: 'scheduler', label: '⏰ Scheduler', icon: 'schedule' },
    { id: 'themecreator', label: 'Theme Creator', icon: 'auto-fix-high' },
    { id: 'appgrid', label: 'App Grid', icon: 'grid-view' },
    { id: 'hubmanager', label: 'Hub Manager', icon: 'hub' },
    { id: 'integrations', label: '➕ Integrations', icon: 'add-circle' },
    { id: 'iconlib', label: 'Icon Library', icon: 'extension' },
    { id: 'features', label: 'Features', icon: 'tune' },
    { id: 'branding', label: 'Branding', icon: 'text-fields' },
    { id: 'ticker', label: 'Tickers', icon: 'announcement' },
    { id: 'logopics', label: 'Logo & Pics', icon: 'image' },
    { id: 'export', label: 'Export', icon: 'backup' },
    { id: 'stats', label: 'Stats', icon: 'bar-chart' },
    { id: 'updates', label: 'Updates', icon: 'system-update' },
    { id: 'security', label: 'Security', icon: 'security' },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar style="light" />
      <LinearGradient colors={[...theme.gradient]} style={styles.root}>

        {/* Header */}
        <View style={[styles.adminHeader, { borderBottomColor: theme.glassBorder }]}>
          <LinearGradient colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.05)']} style={StyleSheet.absoluteFillObject} />
          <Text style={[styles.adminTitle, { textShadowColor: theme.glowColor, textShadowRadius: 10 }]}>⚙️ Admin Panel | ایڈمن پینل</Text>
          <Pressable onPress={() => setAuthed(false)} style={[styles.logoutBtn, { borderColor: theme.glassBorder }]}>
            <MaterialIcons name="logout" size={18} color="#fff" />
            <Text style={styles.logoutText}>Logout</Text>
          </Pressable>
        </View>

        {/* Section Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ maxHeight: 52 }}
          contentContainerStyle={{ gap: 8, paddingHorizontal: 14, paddingVertical: 8 }}>
          {SECTIONS.map(s => (
            <Pressable key={s.id} onPress={() => setSection(s.id)}
              style={[styles.sectionTab, { backgroundColor: section === s.id ? theme.primary : 'rgba(255,255,255,0.2)', borderColor: section === s.id ? '#fff' : theme.glassBorder }]}>
              <MaterialIcons name={s.icon as any} size={13} color="#fff" />
              <Text style={styles.sectionTabText}>{s.label}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.adminContent}>

          {/* ── OVERVIEW ─────────────────────────────────── */}
          {section === 'overview' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Quick Controls | فوری کنٹرول</Text>
              {[
                { icon: 'vpn-lock', label: 'VPN Shield', labelUr: 'وی پی این', key: 'vpn', val: vpnEnabled, color: '#00FF88' },
                { icon: 'block', label: 'Ad Blocker', labelUr: 'ایڈ بلاکر', key: 'adb', val: adBlockEnabled, color: '#00DCFF' },
              ].map(item => (
                <View key={item.key} style={[styles.settingRow, { borderColor: theme.glassBorder }]}>
                  <LinearGradient colors={['rgba(255,255,255,0.18)', 'rgba(255,255,255,0.04)']} style={StyleSheet.absoluteFillObject} />
                  <MaterialIcons name={item.icon as any} size={22} color={item.val ? item.color : 'rgba(255,255,255,0.6)'} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.settingLabel}>{item.label}</Text>
                    <Text style={styles.settingDesc}>{item.val ? 'Active — فعال' : 'Inactive — غیر فعال'}</Text>
                  </View>
                  <Switch value={item.val} onValueChange={item.key === 'vpn' ? setVpnEnabled : setAdBlockEnabled}
                    trackColor={{ false: 'rgba(255,255,255,0.2)', true: item.color }} thumbColor="#fff" />
                </View>
              ))}
              <View style={styles.statsStrip}>
                {[
                  { icon: 'bookmark', label: 'Bookmarks', val: bookmarks.length, color: '#FFD700' },
                  { icon: 'download', label: 'Downloads', val: downloads.length, color: '#00DCFF' },
                  { icon: 'palette', label: 'Themes', val: THEMES.length, color: '#DA70D6' },
                ].map(s => (
                  <View key={s.label} style={[styles.statCard, { borderColor: theme.glassBorder }]}>
                    <LinearGradient colors={['rgba(255,255,255,0.18)', 'rgba(255,255,255,0.04)']} style={StyleSheet.absoluteFillObject} />
                    <MaterialIcons name={s.icon as any} size={18} color={s.color} />
                    <Text style={[styles.statNum, { color: s.color }]}>{s.val}</Text>
                    <Text style={styles.statLabel}>{s.label}</Text>
                  </View>
                ))}
              </View>
              <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Active Theme | فعال تھیم</Text>
              <Pressable onPress={() => setSection('theme')}
                style={[styles.themePreviewBtn, { borderColor: theme.glassBorder }]}>
                <LinearGradient colors={[...theme.gradient]} style={StyleSheet.absoluteFillObject} />
                <Text style={styles.themePreviewName}>🎨 {theme.name}</Text>
                <Text style={styles.themePreviewSub}>{theme.nameUrdu} • Tap to change</Text>
              </Pressable>
            </View>
          )}

          {/* ── APK DOWNLOAD ─────────────────────────────── */}
          {section === 'media' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🎬 Media, Gallery & Quran | میڈیا سینٹر</Text>
              <View style={[styles.infoCard, { borderColor: '#00FF8844' }]}>
                <LinearGradient colors={['rgba(0,255,136,0.1)', 'transparent']} style={StyleSheet.absoluteFillObject} />
                <MaterialIcons name="info" size={16} color="#00FF88" />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.infoText, { color: '#00FF88' }]}>یہ فیچرز Media Tab سے Access کریں</Text>
                  <Text style={styles.infoSubText}>Bottom tab bar → Media بٹن پر جائیں</Text>
                </View>
              </View>
              {[
                { icon: 'photo-library', label: '📸 Gallery', color: '#FF69B4', desc: 'Photos, Videos, Audio — expo-media-library' },
                { icon: 'play-circle-filled', label: '🎬 Media Player', color: '#00DCFF', desc: 'Video (expo-video) + Audio (expo-av) + PiP' },
                { icon: 'menu-book', label: '📖 Digital Quran', color: '#FFD700', desc: '5 Reciters, Offline MP3, Urdu Translation' },
              ].map(item => (
                <View key={item.label} style={[styles.settingRow, { borderColor: item.color + '44' }]}>
                  <LinearGradient colors={[item.color + '12', 'transparent']} style={StyleSheet.absoluteFillObject} />
                  <View style={[styles.hubAppIcon, { backgroundColor: item.color + '25' }]}>
                    <MaterialIcons name={item.icon as any} size={20} color={item.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.settingLabel}>{item.label}</Text>
                    <Text style={styles.settingDesc}>{item.desc}</Text>
                  </View>
                  <MaterialIcons name="check-circle" size={16} color={item.color} />
                </View>
              ))}
            </View>
          )}

          {section === 'github' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🐙 GitHub Repository | سورس کوڈ ڈیلوری</Text>
              <View style={[styles.infoCard, { borderColor: '#E040FB44' }]}>
                <LinearGradient colors={['rgba(224,64,251,0.12)', 'transparent']} style={StyleSheet.absoluteFillObject} />
                <MaterialIcons name="code" size={18} color="#E040FB" />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.infoText, { color: '#E040FB' }]}>آپ کا GitHub Repo</Text>
                  <Text style={styles.infoSubText} selectable>https://github.com/drmirfan5577-ops/Smart-Browser-Ons3</Text>
                </View>
              </View>
              <View style={[styles.dlCard, { borderColor: '#00FF8844' }]}>
                <LinearGradient colors={['rgba(0,255,136,0.12)', 'transparent']} style={StyleSheet.absoluteFillObject} />
                <View style={styles.dlCardHeader}>
                  <MaterialIcons name="upload" size={20} color="#00FF88" />
                  <Text style={[styles.dlCardTitle, { color: '#00FF88', flex: 1 }]}>OnSpace Toolbar سے Push</Text>
                </View>
                <Text style={styles.dlCardText}>{'1. Desktop browser میں OnSpace کھولیں\n2. Top-right GitHub icon (🐙) پر کلک\n3. Smart-Browser-Ons3 repo منتخب کریں\n4. Push بٹن دبائیں\n5. تمام files آٹو push ہو جائیں گی!'}</Text>
                <Pressable onPress={() => Linking.openURL('https://github.com/drmirfan5577-ops/Smart-Browser-Ons3')}
                  style={[styles.dlBtn, { backgroundColor: '#00FF8822', borderWidth: 1, borderColor: '#00FF8844' }]}>
                  <MaterialIcons name="open-in-new" size={14} color="#00FF88" />
                  <Text style={[styles.dlBtnText, { color: '#00FF88' }]}>Open GitHub Repo</Text>
                </Pressable>
              </View>
              <View style={[styles.infoCard, { borderColor: '#FF555544' }]}>
                <LinearGradient colors={['rgba(255,85,85,0.08)', 'transparent']} style={StyleSheet.absoluteFillObject} />
                <MaterialIcons name="info" size={16} color="#FF8888" />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.infoText, { color: '#FF8888' }]}>اہم نوٹ</Text>
                  <Text style={styles.infoSubText}>OnSpace AI براہ راست GitHub push نہیں کر سکتا۔ OnSpace toolbar → GitHub icon استعمال کریں۔</Text>
                </View>
              </View>
            </View>
          )}

          {section === 'netlify' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🚀 Netlify Deploy | نیٹلیفائی</Text>
              <Text style={styles.settingDesc}>مفت میں EvEr SmArT BrOwSeR web app deploy کریں</Text>
              <View style={[styles.dlCard, { borderColor: '#00C7B744' }]}>
                <LinearGradient colors={['rgba(0,199,183,0.15)', 'transparent']} style={StyleSheet.absoluteFillObject} />
                <View style={styles.dlCardHeader}>
                  <MaterialIcons name="cloud-done" size={22} color="#00C7B7" />
                  <Text style={[styles.dlCardTitle, { color: '#00C7B7', flex: 1 }]}>Netlify Free Plan — مفت</Text>
                </View>
                <Text style={styles.dlCardText}>{'✅ Unlimited bandwidth\n✅ Free HTTPS\n✅ Custom domain\n✅ GitHub auto-deploy\n✅ سب بالکل مفت!'}</Text>
              </View>
              <View style={[styles.dlCard, { borderColor: '#FFD70044' }]}>
                <LinearGradient colors={['rgba(255,215,0,0.1)', 'transparent']} style={StyleSheet.absoluteFillObject} />
                <View style={styles.dlCardHeader}>
                  <MaterialIcons name="upload" size={20} color="#FFD700" />
                  <Text style={[styles.dlCardTitle, { color: '#FFD700', flex: 1 }]}>Netlify Drop — 30 سیکنڈ</Text>
                </View>
                <Text style={styles.dlCardText}>{'1. OnSpace → Download ZIP\n2. netlify.com/drop پر جائیں\n3. Folder drag & drop\n4. فوری URL مل جائی گا!\n\nhttps://eversmartbrowser.netlify.app'}</Text>
                <Pressable onPress={() => Linking.openURL('https://app.netlify.com/drop')}
                  style={[styles.dlBtn, { backgroundColor: '#FFD70022', borderWidth: 1, borderColor: '#FFD70044' }]}>
                  <MaterialIcons name="open-in-new" size={14} color="#FFD700" />
                  <Text style={[styles.dlBtnText, { color: '#FFD700' }]}>Netlify Drop | ڈریگ اینڈ ڈراپ</Text>
                </Pressable>
              </View>
              <View style={[styles.dlCard, { borderColor: '#E040FB44' }]}>
                <LinearGradient colors={['rgba(224,64,251,0.12)', 'transparent']} style={StyleSheet.absoluteFillObject} />
                <View style={styles.dlCardHeader}>
                  <Text style={[styles.dlCardTitle, { color: '#E040FB', flex: 1 }]}>GitHub سے Auto-Deploy</Text>
                </View>
                <Text style={styles.dlCardText}>{'1. Netlify → Add new site → Import from GitHub\n2. Repo: EverSmartBrowser-\n3. Build: npx expo export --platform web\n4. Publish dir: dist\n5. Deploy site!'}</Text>
                <Pressable onPress={() => Linking.openURL('https://app.netlify.com/start')}
                  style={[styles.dlBtn, { backgroundColor: '#E040FB22', borderWidth: 1, borderColor: '#E040FB44' }]}>
                  <MaterialIcons name="open-in-new" size={14} color="#E040FB" />
                  <Text style={[styles.dlBtnText, { color: '#E040FB' }]}>New Site from GitHub</Text>
                </Pressable>
              </View>
              <View style={[styles.infoCard, { borderColor: '#00C7B744' }]}>
                <LinearGradient colors={['rgba(0,199,183,0.1)', 'transparent']} style={StyleSheet.absoluteFillObject} />
                <MaterialIcons name="link" size={16} color="#00C7B7" />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.infoText, { color: '#00C7B7' }]}>آپ کا Expected URL</Text>
                  <Text style={styles.infoSubText} selectable>https://eversmartbrowser.netlify.app</Text>
                  <Text style={styles.infoSubText} selectable>https://drmirfan5577-ops.github.io/EverSmartBrowser-</Text>
                </View>
              </View>
              <Pressable onPress={() => Linking.openURL('https://github.com/drmirfan5577-ops/EverSmartBrowser-')}
                style={[styles.dlBtn, { backgroundColor: theme.primary, marginTop: 4 }]}>
                <MaterialIcons name="code" size={16} color="#fff" />
                <Text style={[styles.dlBtnText, { color: '#fff' }]}>GitHub Repo | گٹ ہب</Text>
              </Pressable>
            </View>
          )}

          {section === 'download' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📥 APK Download | اے پی کے ڈاؤنلوڈ</Text>

              {/* OnSpace Toolbar Guide */}
              <View style={[styles.dlCard, { borderColor: '#00FF8855' }]}>
                <LinearGradient colors={['rgba(0,255,136,0.15)', 'rgba(0,255,136,0.03)']} style={StyleSheet.absoluteFillObject} />
                <View style={styles.dlCardHeader}>
                  <MaterialIcons name="phone-android" size={22} color="#00FF88" />
                  <Text style={[styles.dlCardTitle, { color: '#00FF88' }]}>OnSpace Toolbar — کہاں ہے؟</Text>
                </View>
                <Text style={styles.dlCardText}>
                  {'1. OnSpace website کو Desktop/Laptop browser میں کھولیں\n'}
                  {'2. اپنے project کو open کریں\n'}
                  {'3. Screen کے TOP RIGHT کونے میں look کریں\n'}
                  {'4. "Download" بٹن یا ☁️ cloud icon پر کلک کریں\n'}
                  {'5. "Download APK" option منتخب کریں\n\n'}
                  {'⚠️ یہ صرف Desktop browser میں visible ہوتی ہے — mobile browser میں نہیں!'}
                </Text>
                <Pressable onPress={() => Linking.openURL('https://app.onspace.ai')} style={[styles.dlBtn, { backgroundColor: '#00FF88' }]}>
                  <MaterialIcons name="open-in-new" size={16} color="#000" />
                  <Text style={[styles.dlBtnText, { color: '#000' }]}>Open OnSpace (Desktop) | کھولیں</Text>
                </Pressable>
              </View>

              {/* EAS Free Build */}
              <View style={[styles.dlCard, { borderColor: '#00B4D855' }]}>
                <LinearGradient colors={['rgba(0,180,216,0.15)', 'rgba(0,180,216,0.03)']} style={StyleSheet.absoluteFillObject} />
                <View style={styles.dlCardHeader}>
                  <MaterialIcons name="build" size={22} color="#00B4D8" />
                  <Text style={[styles.dlCardTitle, { color: '#00B4D8' }]}>Free EAS Build (بالکل مفت)</Text>
                </View>
                <Text style={styles.dlCardText}>
                  {'EAS Build سے FREE میں APK بنائیں:\n\n'}
                  {'Step 1: expo.dev پر account بنائیں (مفت)\n'}
                  {'Step 2: Terminal میں یہ commands چلائیں:\n\n'}
                  {'npm install -g eas-cli\n'}
                  {'eas login\n'}
                  {'eas build --platform android --profile preview\n\n'}
                  {'Step 3: Build complete ہونے پر email میں APK download link ملے گا\n'}
                  {'Step 4: expo.dev/builds پر جا کر APK download کریں'}
                </Text>
                {[{ label: '⚡ Create Expo Account (Free)', url: 'https://expo.dev/signup', color: '#00B4D8' },
                  { label: '📦 View My Builds', url: 'https://expo.dev/builds', color: '#00FF88' },
                  { label: '📚 EAS Build Docs', url: 'https://docs.expo.dev/build/introduction/', color: '#FFD700' }]
                  .map(link => (
                    <Pressable key={link.url} onPress={() => Linking.openURL(link.url)} style={[styles.dlBtn, { backgroundColor: link.color + '22', borderWidth: 1, borderColor: link.color + '55' }]}>
                      <Text style={[styles.dlBtnText, { color: link.color }]}>{link.label}</Text>
                      <MaterialIcons name="open-in-new" size={13} color={link.color} />
                    </Pressable>
                  ))}
              </View>

              {/* Expo Go Preview */}
              <View style={[styles.dlCard, { borderColor: '#AB47BC55' }]}>
                <LinearGradient colors={['rgba(171,71,188,0.15)', 'rgba(171,71,188,0.03)']} style={StyleSheet.absoluteFillObject} />
                <View style={styles.dlCardHeader}>
                  <MaterialIcons name="qr-code" size={22} color="#AB47BC" />
                  <Text style={[styles.dlCardTitle, { color: '#AB47BC' }]}>Expo Go — ابھی Test کریں</Text>
                </View>
                <Text style={styles.dlCardText}>
                  {'APK بنائے بغیر فوری test کریں:\n\n'}
                  {'1. Expo Go app install کریں (نیچے لنک)\n'}
                  {'2. expo.dev میں login کریں\n'}
                  {'3. Project → "Open in Expo Go"\n'}
                  {'4. QR code scan کریں\n\n'}
                  {'آپ کی app فوری موبائل پر چلے گی!'}
                </Text>
                {[{ label: '📱 Expo Go — Android', url: 'https://play.google.com/store/apps/details?id=host.exp.exponent', color: '#00FF88' },
                  { label: '🍎 Expo Go — iOS', url: 'https://apps.apple.com/app/expo-go/id982107779', color: '#4FC3F7' }]
                  .map(link => (
                    <Pressable key={link.url} onPress={() => Linking.openURL(link.url)} style={[styles.dlBtn, { backgroundColor: link.color + '22', borderWidth: 1, borderColor: link.color + '55' }]}>
                      <Text style={[styles.dlBtnText, { color: link.color }]}>{link.label}</Text>
                      <MaterialIcons name="open-in-new" size={13} color={link.color} />
                    </Pressable>
                  ))}
              </View>

              {/* Email APK Link */}
              <Pressable onPress={() => {
                const sub = encodeURIComponent('APK Build Request — EvEr SmArT BrOwSeR');
                const body = encodeURIComponent('Please send me the APK build link for EvEr SmArT BrOwSeR v2.0.0\nEmail: dr.mirfann5577@gmail.com');
                Linking.openURL(`mailto:dr.mirfann5577@gmail.com?subject=${sub}&body=${body}`);
              }} style={[styles.dlBtn, { backgroundColor: theme.primary, marginTop: 4 }]}>
                <MaterialIcons name="email" size={16} color="#fff" />
                <Text style={[styles.dlBtnText, { color: '#fff' }]}>Email APK Request to Myself | ای میل</Text>
              </Pressable>
            </View>
          )}

          {/* ── LINKED SITES ──────────────────────────────── */}
          {section === 'linkedsites' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🔗 Linked Sites | لنکڈ ویب سائٹس</Text>
              <Text style={styles.settingDesc}>ایپ کو 5 ویب سائٹس / ڈومینز / ای میل سے مستقل لنک کریں — ٹیپ سے سیدھا کھلیں گی</Text>
              <View style={[styles.infoCard, { borderColor: '#00FF8844', marginBottom: 4 }]}>
                <LinearGradient colors={['rgba(0,255,136,0.1)', 'transparent']} style={StyleSheet.absoluteFillObject} />
                <MaterialIcons name="info" size={16} color="#00FF88" />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.infoText, { color: '#00FF88' }]}>GitHub Repo | گٹ ہب ریپو</Text>
                  <Text style={styles.infoSubText} selectable>github.com/drmirfan5577-ops/EverSmartBrowser-</Text>
                </View>
              </View>

              {editingLinkedSites.map((site, idx) => (
                <View key={site.id} style={[styles.settingRow, { borderColor: site.enabled && site.url ? site.color + '55' : theme.glassBorder, flexDirection: 'column', gap: 10 }]}>
                  <LinearGradient colors={[site.color + '10', 'transparent']} style={StyleSheet.absoluteFillObject} />
                  {/* Site header */}
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <View style={[styles.hubAppIcon, { backgroundColor: site.color + '25' }]}>
                      <MaterialIcons name={site.icon as any} size={18} color={site.color} />
                    </View>
                    <Text style={[styles.settingLabel, { flex: 1 }]}>Site {idx + 1} | سائٹ {idx + 1}</Text>
                    <Switch
                      value={site.enabled}
                      onValueChange={v => {
                        const u = editingLinkedSites.map(s => s.id === site.id ? { ...s, enabled: v } : s);
                        setEditingLinkedSites(u);
                      }}
                      trackColor={{ false: 'rgba(255,255,255,0.2)', true: site.color }}
                      thumbColor="#fff"
                    />
                  </View>
                  {/* Site Name */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Site Name | نام</Text>
                    <View style={styles.inputBox2}>
                      <TextInput
                        style={styles.adminInput}
                        value={site.name}
                        onChangeText={v => {
                          const u = editingLinkedSites.map(s => s.id === site.id ? { ...s, name: v } : s);
                          setEditingLinkedSites(u);
                        }}
                        placeholder="My Website" placeholderTextColor="rgba(255,255,255,0.4)"
                      />
                    </View>
                  </View>
                  {/* URL */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>URL / Email / Domain</Text>
                    <View style={styles.inputBox2}>
                      <TextInput
                        style={styles.adminInput}
                        value={site.url}
                        onChangeText={v => {
                          const u = editingLinkedSites.map(s => s.id === site.id ? { ...s, url: v } : s);
                          setEditingLinkedSites(u);
                        }}
                        placeholder="https://example.com" placeholderTextColor="rgba(255,255,255,0.4)"
                        autoCapitalize="none" keyboardType="url"
                      />
                    </View>
                  </View>
                  {/* Color picker */}
                  <Text style={styles.inputLabel}>Color | رنگ</Text>
                  <View style={{ flexDirection: 'row', gap: 7, flexWrap: 'wrap' }}>
                    {['#00FF88','#00DCFF','#FFD700','#AB47BC','#FF7043','#FF69B4','#4FC3F7','#E040FB'].map(c => (
                      <Pressable key={c} onPress={() => {
                        const u = editingLinkedSites.map(s => s.id === site.id ? { ...s, color: c } : s);
                        setEditingLinkedSites(u);
                      }}
                        style={[styles.swatch, { backgroundColor: c, borderWidth: site.color === c ? 3 : 1, borderColor: site.color === c ? '#fff' : 'rgba(255,255,255,0.3)' }]}
                      />
                    ))}
                  </View>
                  {/* Open button */}
                  {site.url ? (
                    <Pressable onPress={() => Linking.openURL(site.url.startsWith('http') ? site.url : `https://${site.url}`)}
                      style={[styles.dlBtn, { backgroundColor: site.color + '22', borderWidth: 1, borderColor: site.color + '55' }]}>
                      <MaterialIcons name="open-in-new" size={14} color={site.color} />
                      <Text style={[styles.dlBtnText, { color: site.color }]}>Open | کھولیں — {site.url.slice(0, 40)}</Text>
                    </Pressable>
                  ) : null}
                </View>
              ))}

              <Pressable onPress={() => {
                setLinkedSites(editingLinkedSites);
                setLinkedSitesSaved(true);
                setTimeout(() => setLinkedSitesSaved(false), 2000);
                Alert.alert('Saved ✅ | محفوظ', '5 linked sites updated | 5 لنکڈ سائٹس اپ ڈیٹ');
              }} style={[styles.saveBtn, { backgroundColor: linkedSitesSaved ? '#00FF88' : theme.primary }]}>
                <MaterialIcons name={linkedSitesSaved ? 'check-circle' : 'save'} size={18} color="#fff" />
                <Text style={styles.saveBtnText}>{linkedSitesSaved ? 'Saved ✅' : 'Save All Sites | سب محفوظ کریں'}</Text>
              </Pressable>

              {/* Quick launch row */}
              {editingLinkedSites.filter(s => s.enabled && s.url).length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionSubTitle}>🚀 Quick Launch | فوری کھولیں</Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                    {editingLinkedSites.filter(s => s.enabled && s.url).map(s => (
                      <Pressable key={s.id} onPress={() => Linking.openURL(s.url.startsWith('http') ? s.url : `https://${s.url}`)}
                        style={[styles.sectionTab, { backgroundColor: s.color + '22', borderColor: s.color + '66', paddingHorizontal: 14, paddingVertical: 10 }]}>
                        <MaterialIcons name={s.icon as any} size={16} color={s.color} />
                        <Text style={[styles.sectionTabText, { color: s.color, fontSize: 12 }]}>{s.name}</Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              )}
            </View>
          )}

          {/* ── PWA SECTION ───────────────────────────────── */}
          {section === 'pwa' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📲 PWA & Web Access | ویب رسائی</Text>
              <Text style={styles.settingDesc}>Progressive Web App — موبائل پر انسٹال کریں بغیر APK کے</Text>

              {/* What is PWA */}
              <View style={[styles.infoCard, { borderColor: '#00DCFF44' }]}>
                <LinearGradient colors={['rgba(0,220,255,0.12)', 'transparent']} style={StyleSheet.absoluteFillObject} />
                <MaterialIcons name="info" size={18} color="#00DCFF" />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.infoText, { color: '#00DCFF' }]}>PWA کیا ہے؟</Text>
                  <Text style={styles.infoSubText}>
                    PWA (Progressive Web App) ایک ویب سائٹ ہے جو موبائل کی ہوم اسکرین پر ایپ کی طرح انسٹال ہوتی ہے۔ APK کی ضرورت نہیں!
                  </Text>
                </View>
              </View>

              {/* GitHub Pages = Free PWA Hosting */}
              <View style={[styles.dlCard, { borderColor: '#E040FB44' }]}>
                <LinearGradient colors={['rgba(224,64,251,0.12)', 'transparent']} style={StyleSheet.absoluteFillObject} />
                <View style={styles.dlCardHeader}>
                  <MaterialIcons name="cloud" size={20} color="#E040FB" />
                  <Text style={[styles.dlCardTitle, { color: '#E040FB' }]}>GitHub Pages — مفت PWA</Text>
                </View>
                <Text style={styles.dlCardText}>
                  {'آپ کا ریپو: github.com/drmirfan5577-ops/EverSmartBrowser-\n\n'}
                  {'بعد از GitHub push:\n'}
                  {'Settings → Pages → Branch: main → Save\n'}
                  {'آپ کا PWA link:\n'}
                  {'https://drmirfan5577-ops.github.io/EverSmartBrowser-\n\n'}
                  {'پھر Chrome/Firefox پر کھولیں → Add to Home Screen'}
                </Text>
                <Pressable onPress={() => Linking.openURL('https://github.com/drmirfan5577-ops/EverSmartBrowser-/settings/pages')}
                  style={[styles.dlBtn, { backgroundColor: '#E040FB22', borderWidth: 1, borderColor: '#E040FB44' }]}>
                  <MaterialIcons name="open-in-new" size={14} color="#E040FB" />
                  <Text style={[styles.dlBtnText, { color: '#E040FB' }]}>GitHub Pages Settings | گٹ ہب پیجز</Text>
                </Pressable>
              </View>

              {/* Netlify Drop */}
              <View style={[styles.dlCard, { borderColor: '#00C7B744' }]}>
                <LinearGradient colors={['rgba(0,199,183,0.12)', 'transparent']} style={StyleSheet.absoluteFillObject} />
                <View style={styles.dlCardHeader}>
                  <MaterialIcons name="cloud-upload" size={20} color="#00C7B7" />
                  <Text style={[styles.dlCardTitle, { color: '#00C7B7' }]}>Netlify Drop — 30 سیکنڈ میں آن لائن</Text>
                </View>
                <Text style={styles.dlCardText}>
                  {'1. OnSpace → Code icon → Download ZIP\n'}
                  {'2. app/web/index.tsx فائل ڈھونڈیں\n'}
                  {'3. netlify.com/drop پر جائیں\n'}
                  {'4. ZIP فائل drag & drop کریں\n'}
                  {'5. فوری live URL ملے گا!\n\n'}
                  {'آپ کا لنک کچھ اس طرح ہوگا:\nhttps://eversmartbrowser.netlify.app'}
                </Text>
                <Pressable onPress={() => Linking.openURL('https://app.netlify.com/drop')}
                  style={[styles.dlBtn, { backgroundColor: '#00C7B722', borderWidth: 1, borderColor: '#00C7B744' }]}>
                  <MaterialIcons name="open-in-new" size={14} color="#00C7B7" />
                  <Text style={[styles.dlBtnText, { color: '#00C7B7' }]}>Netlify Drop | نیٹلیفائی</Text>
                </Pressable>
              </View>

              {/* Expo Web Deploy */}
              <View style={[styles.dlCard, { borderColor: '#00B4D844' }]}>
                <LinearGradient colors={['rgba(0,180,216,0.12)', 'transparent']} style={StyleSheet.absoluteFillObject} />
                <View style={styles.dlCardHeader}>
                  <MaterialIcons name="phone-android" size={20} color="#00B4D8" />
                  <Text style={[styles.dlCardTitle, { color: '#00B4D8' }]}>Expo Go — ابھی ٹیسٹ کریں</Text>
                </View>
                <Text style={styles.dlCardText}>
                  {'فوری موبائل ٹیسٹ بغیر APK:\n'}
                  {'1. Expo Go انسٹال کریں (نیچے)\n'}
                  {'2. expo.dev → Login → Projects\n'}
                  {'3. QR scan کریں\n\n'}
                  {'یہ ابھی بھی کام کرتا ہے!'}
                </Text>
                {[
                  { l: '📱 Expo Go Android', u: 'https://play.google.com/store/apps/details?id=host.exp.exponent', c: '#00FF88' },
                  { l: '🍎 Expo Go iOS', u: 'https://apps.apple.com/app/expo-go/id982107779', c: '#4FC3F7' },
                  { l: '⚡ Expo Dashboard', u: 'https://expo.dev', c: '#00B4D8' },
                ].map(x => (
                  <Pressable key={x.u} onPress={() => Linking.openURL(x.u)}
                    style={[styles.dlBtn, { backgroundColor: x.c + '22', borderWidth: 1, borderColor: x.c + '44' }]}>
                    <Text style={[styles.dlBtnText, { color: x.c }]}>{x.l}</Text>
                    <MaterialIcons name="open-in-new" size={13} color={x.c} />
                  </Pressable>
                ))}
              </View>

              {/* Your GitHub repo direct link */}
              <View style={[styles.dlCard, { borderColor: '#FFD70044' }]}>
                <LinearGradient colors={['rgba(255,215,0,0.10)', 'transparent']} style={StyleSheet.absoluteFillObject} />
                <View style={styles.dlCardHeader}>
                  <MaterialIcons name="code" size={20} color="#FFD700" />
                  <Text style={[styles.dlCardTitle, { color: '#FFD700' }]}>آپ کا GitHub ریپو</Text>
                </View>
                <Text style={styles.dlCardText} selectable>
                  {'https://github.com/drmirfan5577-ops/EverSmartBrowser-\n\n'}
                  {'OnSpace → Top right GitHub icon → Connect → یہ ریپو منتخب کریں → Push\n'}
                  {'پھر خودکار GitHub Pages پر deploy ہو جائے گا'}
                </Text>
                <Pressable onPress={() => Linking.openURL('https://github.com/drmirfan5577-ops/EverSmartBrowser-')}
                  style={[styles.dlBtn, { backgroundColor: '#FFD70022', borderWidth: 1, borderColor: '#FFD70044' }]}>
                  <MaterialIcons name="open-in-new" size={14} color="#FFD700" />
                  <Text style={[styles.dlBtnText, { color: '#FFD700' }]}>Open GitHub Repo | ریپو کھولیں</Text>
                </Pressable>
              </View>

              {/* OnSpace cannot auto-push explanation */}
              <View style={[styles.infoCard, { borderColor: '#FF555544' }]}>
                <LinearGradient colors={['rgba(255,85,85,0.08)', 'transparent']} style={StyleSheet.absoluteFillObject} />
                <MaterialIcons name="warning" size={16} color="#FF8888" />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.infoText, { color: '#FF8888' }]}>اہم وضاحت</Text>
                  <Text style={styles.infoSubText}>
                    {"OnSpace AI آپ کے GitHub ریپو میں براہ راست code push نہیں کر سکتا۔ یہ GitHub کی security policy ہے۔\n\nحل: OnSpace toolbar \u2192 GitHub icon (top-right) \u2192 Connect to your repo \u2192 Push. یا Desktop browser میں جائیں۔"}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* ── SOURCE CODE ───────────────────────────────── */}
          {section === 'sourcecode' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>💾 Source Code & Backup | سورس کوڈ</Text>
              <View style={[styles.infoCard, { borderColor: '#00FF8844' }]}>
                <LinearGradient colors={['rgba(0,255,136,0.1)', 'transparent']} style={StyleSheet.absoluteFillObject} />
                <MaterialIcons name="info" size={18} color="#00FF88" />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.infoText, { color: '#00FF88' }]}>OnSpace Code Download | کوڈ ڈاؤنلوڈ</Text>
                  <Text style={styles.infoSubText}>
                    {'OnSpace → Top Right → Code icon (</>) → Download ZIP\n'}
                    {'یا GitHub سے download کریں'}
                  </Text>
                </View>
              </View>

              {[{ label: '⬇️ OnSpace Code View', url: 'https://app.onspace.ai', color: '#00FF88', desc: 'Top-right </> icon → Download ZIP' },
                { label: '🐙 GitHub — Push & Download', url: 'https://github.com', color: '#E040FB', desc: 'git push کریں پھر ZIP download کریں' },
                { label: '📦 Expo Snack (Online)', url: 'https://snack.expo.dev', color: '#00B4D8', desc: 'Online IDE میں code دیکھیں' }]
                .map(item => (
                  <Pressable key={item.url} onPress={() => Linking.openURL(item.url)}
                    style={[styles.dlCard, { borderColor: item.color + '44' }]}>
                    <LinearGradient colors={[item.color + '12', 'transparent']} style={StyleSheet.absoluteFillObject} />
                    <Text style={[styles.dlCardTitle, { color: item.color }]}>{item.label}</Text>
                    <Text style={styles.dlCardText}>{item.desc}</Text>
                    <View style={styles.dlCardHeader}>
                      <MaterialIcons name="open-in-new" size={14} color={item.color} />
                      <Text style={[styles.dlBtnText, { color: item.color }]}>Open | کھولیں</Text>
                    </View>
                  </Pressable>
                ))}

              <Text style={[styles.sectionSubTitle, { marginTop: 8 }]}>📋 Project Structure | پروجیکٹ ڈھانچہ</Text>
              {[['app/(tabs)/index.tsx', 'Browser Home Screen'],
                ['app/(tabs)/admin.tsx', 'Admin Panel (Password: Daood5577)'],
                ['app/(tabs)/hubs.tsx', 'Hubs Screen'],
                ['contexts/BrowserContext.tsx', 'Global State Management'],
                ['constants/theme.ts', '26 Themes (10 Light + 16 Dark)'],
                ['constants/config.ts', '5 Hubs + Apps Config'],
                ['components/feature/', '20+ Feature Components'],
                ['components/layout/', 'Header + Sidebar + Ticker']]
                .map(([file, desc]) => (
                  <View key={file} style={[styles.fileRow, { borderColor: theme.glassBorder }]}>
                    <LinearGradient colors={['rgba(255,255,255,0.08)', 'transparent']} style={StyleSheet.absoluteFillObject} />
                    <MaterialIcons name="insert-drive-file" size={14} color={theme.glowColor} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.fileName} selectable>{file}</Text>
                      <Text style={styles.fileDesc}>{desc}</Text>
                    </View>
                  </View>
                ))}

              <Pressable onPress={() => setExportOpen(true)} style={[styles.saveBtn, { backgroundColor: theme.primary, marginTop: 8 }]}>
                <MaterialIcons name="backup" size={18} color="#fff" />
                <Text style={styles.saveBtnText}>Export Data Backup | ڈیٹا بیک اپ</Text>
              </Pressable>
            </View>
          )}

          {/* ── APP STORE DOCS ────────────────────────────── */}
          {section === 'appdocs' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📋 App Store Docs | ایپ اسٹور دستاویزات</Text>

              {/* App Identity */}
              <Text style={styles.sectionSubTitle}>🏷️ App Identity | ایپ شناخت</Text>
              {[['App Name', 'EvEr SmArT BrOwSeR'],
                ['Package ID', 'com.drirfan.eversmartbrowser'],
                ['Version', '2.0.0 (Build 1)'],
                ['Developer', 'Dr. Irfan'],
                ['Email', 'dr.mirfann5577@gmail.com'],
                ['Category', 'Tools / Browser'],
                ['Target SDK', 'Android 34 (API Level 34)'],
                ['Min SDK', 'Android 21 (API Level 21)'],
                ['Languages', 'Urdu, Arabic, English'],
                ['Target Audience', 'All Ages (General)']]
                .map(([k, v]) => (
                  <View key={k} style={[styles.docRow, { borderColor: theme.glassBorder }]}>
                    <LinearGradient colors={['rgba(255,255,255,0.08)', 'transparent']} style={StyleSheet.absoluteFillObject} />
                    <Text style={styles.docKey}>{k}</Text>
                    <Text style={styles.docVal} selectable>{v}</Text>
                  </View>
                ))}

              {/* Permissions */}
              <Text style={[styles.sectionSubTitle, { marginTop: 12 }]}>🔒 Required Permissions | درکار اجازتیں</Text>
              {[['INTERNET', 'Web browsing & content loading'],
                ['CAMERA', 'QR code scanning'],
                ['READ_EXTERNAL_STORAGE', 'Gallery & media access'],
                ['READ_MEDIA_IMAGES', 'Photo library access'],
                ['READ_MEDIA_VIDEO', 'Video library access'],
                ['READ_MEDIA_AUDIO', 'Audio library access'],
                ['RECORD_AUDIO', 'Voice search feature'],
                ['VIBRATE', 'Haptic feedback']]
                .map(([perm, reason]) => (
                  <View key={perm} style={[styles.docRow, { borderColor: theme.glassBorder }]}>
                    <LinearGradient colors={['rgba(255,255,255,0.06)', 'transparent']} style={StyleSheet.absoluteFillObject} />
                    <MaterialIcons name="check" size={14} color="#00FF88" />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.docKey}>{perm}</Text>
                      <Text style={styles.docVal}>{reason}</Text>
                    </View>
                  </View>
                ))}

              {/* Privacy Policy */}
              <Text style={[styles.sectionSubTitle, { marginTop: 12 }]}>📄 Privacy Policy | پرائیویسی پالیسی</Text>
              <View style={[styles.policyBox, { borderColor: theme.glassBorder }]}>
                <LinearGradient colors={['rgba(255,255,255,0.08)', 'transparent']} style={StyleSheet.absoluteFillObject} />
                <Text style={styles.policyText} selectable>{
                  'PRIVACY POLICY — EvEr SmArT BrOwSeR\n' +
                  'Last Updated: August 2025\n\n' +
                  'DATA COLLECTION:\n' +
                  'This app stores all data locally on your device only.\n' +
                  'No data is transmitted to external servers.\n\n' +
                  'PERMISSIONS USAGE:\n' +
                  '• Camera: Used only for QR code scanning\n' +
                  '• Storage: Used only to access your media files\n' +
                  '• Microphone: Used only for voice search feature\n\n' +
                  'THIRD PARTY SERVICES:\n' +
                  '• Google Search (search queries)\n' +
                  '• Islamic Network API (Quran audio)\n\n' +
                  'CONTACT: dr.mirfann5577@gmail.com\n' +
                  'DEVELOPER: Dr. Irfan | Pakistan'
                }</Text>
              </View>

              {/* Play Store Links */}
              <Text style={[styles.sectionSubTitle, { marginTop: 12 }]}>🏪 Store Submission | اسٹور جمع کروانا</Text>
              {[{ label: '🏪 Google Play Console', url: 'https://play.google.com/console/signup', color: '#00FF88', desc: 'Play Store developer account ($25 one-time fee)' },
                { label: '🍎 Apple Developer', url: 'https://developer.apple.com/programs/', color: '#4FC3F7', desc: 'iOS App Store ($99/year fee)' },
                { label: '📋 Play Store Listing Guide', url: 'https://support.google.com/googleplay/android-developer/answer/9859751', color: '#FFD700', desc: 'App listing requirements & guidelines' },
                { label: '📊 Google Play Academy', url: 'https://playacademy.exceedlms.com/', color: '#AB47BC', desc: 'Free training for store submission' }]
                .map(item => (
                  <Pressable key={item.url} onPress={() => Linking.openURL(item.url)}
                    style={[styles.docLinkBtn, { borderColor: item.color + '44' }]}>
                    <LinearGradient colors={[item.color + '12', 'transparent']} style={StyleSheet.absoluteFillObject} />
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.docKey, { color: item.color }]}>{item.label}</Text>
                      <Text style={styles.docVal}>{item.desc}</Text>
                    </View>
                    <MaterialIcons name="open-in-new" size={14} color={item.color} />
                  </Pressable>
                ))}

              {/* Email docs */}
              <Pressable onPress={() => {
                const sub = encodeURIComponent('EvEr SmArT BrOwSeR — App Store Documents');
                const body = encodeURIComponent(
                  'APP STORE SUBMISSION DOCUMENTS\n\n' +
                  'App Name: EvEr SmArT BrOwSeR\n' +
                  'Package: com.drirfan.eversmartbrowser\n' +
                  'Version: 2.0.0\n' +
                  'Developer: Dr. Irfan\n' +
                  'Email: dr.mirfann5577@gmail.com\n\n' +
                  'Play Store Console: https://play.google.com/console\n' +
                  'EAS Build: eas build --platform android --profile production\n' +
                  'Submit: eas submit --platform android --latest\n\n' +
                  'Privacy Policy: Data stored locally only, no external transmission.'
                );
                Linking.openURL(`mailto:dr.mirfann5577@gmail.com?subject=${sub}&body=${body}`);
              }} style={[styles.saveBtn, { backgroundColor: theme.primary, marginTop: 8 }]}>
                <MaterialIcons name="email" size={18} color="#fff" />
                <Text style={styles.saveBtnText}>Email All Docs to Myself | دستاویزات ای میل کریں</Text>
              </Pressable>
            </View>
          )}

          {/* ── THEME SCHEDULER ──────────────────────────── */}
          {section === 'scheduler' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>⏰ Theme Scheduler | تھیم شیڈیولر</Text>
              <Text style={styles.settingDesc}>Auto-switch themes based on time of day | وقت کے مطابق خودکار تھیم تبدیلی</Text>
              <View style={[styles.settingRow, { borderColor: theme.glassBorder }]}>
                <LinearGradient colors={['rgba(255,255,255,0.18)', 'rgba(255,255,255,0.04)']} style={StyleSheet.absoluteFillObject} />
                <MaterialIcons name="schedule" size={22} color={schedulerEnabled ? '#00FF88' : 'rgba(255,255,255,0.5)'} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.settingLabel}>Auto Theme Switch | خودکار تھیم</Text>
                  <Text style={styles.settingDesc}>{schedulerEnabled ? 'Active — checking every minute' : 'Inactive — manual theme selection'}</Text>
                </View>
                <Switch value={schedulerEnabled} onValueChange={setSchedulerEnabled}
                  trackColor={{ false: 'rgba(255,255,255,0.2)', true: '#00FF88' }} thumbColor="#fff" />
              </View>
              {schedulerEnabled && (
                <>
                  <Text style={[styles.sectionSubTitle, { marginTop: 10 }]}>☀️ Day Theme | دن کی تھیم</Text>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Start Hour (0–23) | شروع کا وقت</Text>
                    <View style={styles.inputBox2}>
                      <TextInput style={styles.adminInput} value={dayHour} onChangeText={setDayHour}
                        placeholder="06" placeholderTextColor="rgba(255,255,255,0.4)" keyboardType="numeric" />
                    </View>
                  </View>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 7, paddingVertical: 6 }}>
                    {THEMES.filter(t => !t.isDark).map(t => (
                      <Pressable key={t.id} onPress={() => setDayThemeId(t.id)}
                        style={[styles.themeListItem, { borderColor: dayThemeId === t.id ? '#FFD700' : 'rgba(255,255,255,0.2)', borderWidth: dayThemeId === t.id ? 2 : 1, width: 140 }]}>
                        <LinearGradient colors={[...t.gradient]} style={StyleSheet.absoluteFillObject} />
                        <Text style={styles.themeListName} numberOfLines={1}>{t.name}</Text>
                        {dayThemeId === t.id && <MaterialIcons name="check-circle" size={14} color="#FFD700" />}
                      </Pressable>
                    ))}
                  </ScrollView>
                  <Text style={[styles.sectionSubTitle, { marginTop: 10 }]}>🌙 Night Theme | رات کی تھیم</Text>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Start Hour (0–23) | شروع کا وقت</Text>
                    <View style={styles.inputBox2}>
                      <TextInput style={styles.adminInput} value={nightHour} onChangeText={setNightHour}
                        placeholder="20" placeholderTextColor="rgba(255,255,255,0.4)" keyboardType="numeric" />
                    </View>
                  </View>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 7, paddingVertical: 6 }}>
                    {THEMES.filter(t => t.isDark).map(t => (
                      <Pressable key={t.id} onPress={() => setNightThemeId(t.id)}
                        style={[styles.themeListItem, { borderColor: nightThemeId === t.id ? '#CE93D8' : 'rgba(255,255,255,0.2)', borderWidth: nightThemeId === t.id ? 2 : 1, width: 140 }]}>
                        <LinearGradient colors={[...t.gradient]} style={StyleSheet.absoluteFillObject} />
                        <Text style={styles.themeListName} numberOfLines={1}>{t.name}</Text>
                        {nightThemeId === t.id && <MaterialIcons name="check-circle" size={14} color="#CE93D8" />}
                      </Pressable>
                    ))}
                  </ScrollView>
                  <View style={[styles.infoCard, { borderColor: '#00FF8844' }]}>
                    <LinearGradient colors={['rgba(0,255,136,0.1)', 'transparent']} style={StyleSheet.absoluteFillObject} />
                    <MaterialIcons name="info" size={16} color="#00FF88" />
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.infoText, { color: '#00FF88' }]}>Scheduler Active | شیڈیولر فعال ہے</Text>
                      <Text style={styles.infoSubText}>
                        ☀️ Day: {dayThemeId} starts at {dayHour}:00{"\n"}
                        🌙 Night: {nightThemeId} starts at {nightHour}:00
                      </Text>
                    </View>
                  </View>
                </>
              )}
            </View>
          )}

          {/* ── INTEGRATIONS ──────────────────────────────── */}
          {section === 'integrations' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>➕ Feature Integrations | فیچر انٹیگریشن</Text>
              <Text style={styles.settingDesc}>Add, enable/disable, or remove any integration | کوئی بھی انٹیگریشن شامل، فعال/غیر فعال یا ہٹائیں</Text>
              {customIntegrations.map(integ => (
                <View key={integ.id} style={[styles.settingRow, { borderColor: integ.enabled ? integ.color + '55' : theme.glassBorder }]}>
                  <LinearGradient colors={[integ.color + '12', 'transparent']} style={StyleSheet.absoluteFillObject} />
                  <View style={[styles.hubAppIcon, { backgroundColor: integ.color + '25' }]}>
                    <MaterialIcons name={integ.icon as any} size={18} color={integ.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.settingLabel}>{integ.name}</Text>
                    <Text style={styles.hubAppUrl} numberOfLines={1}>{integ.url}</Text>
                  </View>
                  <Switch
                    value={integ.enabled}
                    onValueChange={v => setCustomIntegrations(prev => prev.map(i => i.id === integ.id ? { ...i, enabled: v } : i))}
                    trackColor={{ false: 'rgba(255,255,255,0.2)', true: integ.color }}
                    thumbColor="#fff"
                  />
                  <Pressable onPress={() => removeIntegration(integ.id)} style={styles.hubDeleteBtn}>
                    <MaterialIcons name="delete" size={14} color="#FF5555" />
                  </Pressable>
                </View>
              ))}
              <Text style={[styles.sectionSubTitle, { marginTop: 16 }]}>➕ Add New Integration | نئی انٹیگریشن شامل کریں</Text>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Integration Name | نام</Text>
                <View style={styles.inputBox2}>
                  <TextInput style={styles.adminInput} value={newIntegName} onChangeText={setNewIntegName}
                    placeholder="e.g. My Custom Tool" placeholderTextColor="rgba(255,255,255,0.4)" />
                </View>
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>URL | لنک</Text>
                <View style={styles.inputBox2}>
                  <TextInput style={styles.adminInput} value={newIntegUrl} onChangeText={setNewIntegUrl}
                    placeholder="https://example.com" placeholderTextColor="rgba(255,255,255,0.4)" autoCapitalize="none" keyboardType="url" />
                </View>
              </View>
              <Text style={styles.inputLabel}>Color | رنگ</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginBottom: 10 }}>
                {['#00FF88','#FFD700','#00DCFF','#FF69B4','#E040FB','#FF7043','#4FC3F7','#AB47BC'].map(c => (
                  <Pressable key={c} onPress={() => setNewIntegColor(c)}
                    style={[styles.swatch, { backgroundColor: c, borderWidth: newIntegColor === c ? 3 : 1, borderColor: newIntegColor === c ? '#fff' : 'rgba(255,255,255,0.3)' }]} />
                ))}
              </View>
              <Pressable onPress={addIntegration} style={[styles.saveBtn, { backgroundColor: theme.primary }]}>
                <MaterialIcons name="add-circle" size={18} color="#fff" />
                <Text style={styles.saveBtnText}>Add Integration | انٹیگریشن شامل کریں</Text>
              </Pressable>
            </View>
          )}

          {/* ── THEME SELECTOR ───────────────────────────── */}
          {section === 'theme' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Select Theme | تھیم منتخب کریں</Text>
              <Text style={styles.sectionSubTitle}>Light Themes | روشن تھیمز</Text>
              {THEMES.filter(t => !t.isDark).map(t => (
                <ThemeRow key={t.id} t={t} active={theme.id === t.id} onSelect={() => setTheme(t)} />
              ))}
              <Text style={[styles.sectionSubTitle, { marginTop: 16 }]}>Dark Backgrounds | تاریک پس منظر</Text>
              {THEMES.filter(t => t.isDark).map(t => (
                <ThemeRow key={t.id} t={t} active={theme.id === t.id} onSelect={() => setTheme(t)} />
              ))}
            </View>
          )}

          {/* ── THEME CREATOR ────────────────────────────── */}
          {section === 'themecreator' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🎨 Theme Creator | تھیم بنائیں</Text>
              <View style={styles.themePreviewBox}>
                <LinearGradient colors={[tc1, tc2, tc3]} style={StyleSheet.absoluteFillObject} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
                <Text style={[styles.previewLabel, { textShadowColor: glowC, textShadowRadius: 10 }]}>{newThemeName || 'Preview'}</Text>
                <Text style={[styles.previewLabelUr, { color: glowC }]}>{newThemeNameUr}</Text>
                <View style={[styles.glowDot, { backgroundColor: glowC }]} />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Theme Name (English)</Text>
                <View style={styles.inputBox2}>
                  <TextInput style={styles.adminInput} value={newThemeName} onChangeText={setNewThemeName}
                    placeholder="My Custom Theme" placeholderTextColor="rgba(255,255,255,0.4)" />
                </View>
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Theme Name (Urdu) | اردو نام</Text>
                <View style={styles.inputBox2}>
                  <TextInput style={styles.adminInput} value={newThemeNameUr} onChangeText={setNewThemeNameUr}
                    placeholder="میری تھیم" placeholderTextColor="rgba(255,255,255,0.4)" />
                </View>
              </View>
              {[
                { label: 'Gradient Color 1 | رنگ ۱', val: tc1, setter: setTc1 },
                { label: 'Gradient Color 2 | رنگ ۲', val: tc2, setter: setTc2 },
                { label: 'Gradient Color 3 | رنگ ۳', val: tc3, setter: setTc3 },
                { label: 'Glow / Accent | چمک کا رنگ', val: glowC, setter: setGlowC },
                { label: 'Primary Action | بنیادی رنگ', val: primaryC, setter: setPrimaryC },
              ].map(row => (
                <View key={row.label} style={styles.inputGroup}>
                  <View style={styles.colorLabelRow}>
                    <View style={[styles.colorPreview, { backgroundColor: row.val }]} />
                    <Text style={styles.inputLabel}>{row.label}</Text>
                  </View>
                  <ColorPicker value={row.val} onChange={row.setter} />
                </View>
              ))}
              <Pressable onPress={handleSaveCustomTheme} style={[styles.saveBtn, { backgroundColor: theme.primary }]}>
                <MaterialIcons name="palette" size={18} color="#fff" />
                <Text style={styles.saveBtnText}>Apply Theme | تھیم لگائیں</Text>
              </Pressable>
            </View>
          )}

          {/* ── APP GRID EDITOR ──────────────────────────── */}
          {section === 'appgrid' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>App Grid Editor | ایپ گرڈ ایڈیٹر</Text>
              <Text style={styles.settingDesc}>Customize rows 3 & 4 of your home screen app grid</Text>
              <View style={styles.appGridList}>
                {customApps.map((app) => (
                  <Pressable key={app.id} onPress={() => setEditingApp({ ...app })}
                    style={[styles.appGridItem, { borderColor: theme.glassBorder }]}>
                    <LinearGradient colors={['rgba(255,255,255,0.18)', 'rgba(255,255,255,0.04)']} style={StyleSheet.absoluteFillObject} />
                    <View style={[styles.appGridIcon, { backgroundColor: app.bg }]}>
                      <Text style={{ fontSize: 20 }}>{app.emoji}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.appGridName} numberOfLines={1}>{app.name}</Text>
                      <Text style={styles.appGridUr} numberOfLines={1}>{app.ur}</Text>
                    </View>
                    <MaterialIcons name="edit" size={16} color="rgba(255,255,255,0.5)" />
                  </Pressable>
                ))}
              </View>
              {editingApp && (
                <Modal visible transparent animationType="slide" onRequestClose={() => setEditingApp(null)}>
                  <View style={styles.editOverlay}>
                    <View style={styles.editSheet}>
                      <LinearGradient colors={[...theme.gradient]} style={StyleSheet.absoluteFillObject} />
                      <Text style={styles.editTitle}>Edit App | ایپ ترمیم</Text>
                      {[
                        { label: 'App Name (English)', key: 'name', placeholder: 'My App' },
                        { label: 'App Name (Urdu) | اردو نام', key: 'ur', placeholder: 'میری ایپ' },
                        { label: 'URL', key: 'url', placeholder: 'https://example.com' },
                      ].map(f => (
                        <View key={f.key} style={styles.inputGroup}>
                          <Text style={styles.inputLabel}>{f.label}</Text>
                          <View style={styles.inputBox2}>
                            <TextInput style={styles.adminInput}
                              value={(editingApp as any)[f.key]} placeholder={f.placeholder}
                              placeholderTextColor="rgba(255,255,255,0.4)"
                              onChangeText={v => setEditingApp({ ...editingApp, [f.key]: v })} />
                          </View>
                        </View>
                      ))}
                      <Text style={styles.inputLabel}>Emoji | ایموجی</Text>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6, marginBottom: 10 }}>
                        {EMOJI_LIST.map(e => (
                          <Pressable key={e} onPress={() => setEditingApp({ ...editingApp, emoji: e })}
                            style={[styles.emojiBtn, { backgroundColor: editingApp.emoji === e ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.15)' }]}>
                            <Text style={{ fontSize: 22 }}>{e}</Text>
                          </Pressable>
                        ))}
                      </ScrollView>
                      <Text style={styles.inputLabel}>Background Color | پس منظر</Text>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6, marginBottom: 10 }}>
                        {BG_PRESETS.map(bg => (
                          <Pressable key={bg} onPress={() => setEditingApp({ ...editingApp, bg })}
                            style={[styles.bgSwatch, { backgroundColor: bg, borderWidth: editingApp.bg === bg ? 2.5 : 1 }]} />
                        ))}
                      </ScrollView>
                      <Pressable onPress={() => { setPendingIconFor(editingApp.id); setIconLibModal(true); }}
                        style={styles.iconLibBtn}>
                        <LinearGradient colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.08)']} style={StyleSheet.absoluteFillObject} />
                        <MaterialIcons name="extension" size={16} color="#fff" />
                        <Text style={styles.iconLibBtnText}>Choose Icon from Library | آئیکن لائبریری</Text>
                      </Pressable>
                      <View style={styles.formBtns}>
                        <Pressable onPress={() => setEditingApp(null)} style={styles.cancelBtn2}>
                          <Text style={styles.cancelBtnText2}>Cancel</Text>
                        </Pressable>
                        <Pressable onPress={saveAppEdit} style={[styles.saveBtn2, { backgroundColor: theme.primary }]}>
                          <Text style={styles.saveBtnText2}>Save | محفوظ</Text>
                        </Pressable>
                      </View>
                    </View>
                  </View>
                </Modal>
              )}
            </View>
          )}

          {/* ── ICON LIBRARY ─────────────────────────────── */}
          {section === 'iconlib' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Icon Library | آئیکن لائبریری</Text>
              <View style={styles.iconSearchBox}>
                <MaterialIcons name="search" size={18} color="rgba(255,255,255,0.6)" />
                <TextInput style={styles.iconSearchInput} value={iconSearch} onChangeText={setIconSearch}
                  placeholder="Search icons..." placeholderTextColor="rgba(255,255,255,0.4)" />
              </View>
              <View style={styles.iconGrid}>
                {filteredIcons.map(icon => (
                  <Pressable key={icon.name + icon.lib} style={styles.iconCard}
                    onPress={() => Alert.alert('Icon', `${icon.name} (${icon.lib})\nUse in App Grid Editor`)}>
                    <LinearGradient colors={['rgba(255,255,255,0.18)', 'rgba(255,255,255,0.04)']} style={StyleSheet.absoluteFillObject} />
                    {icon.lib === 'mat'
                      ? <MaterialIcons name={icon.name as any} size={24} color="#fff" />
                      : <Ionicons name={icon.name as any} size={24} color="#fff" />
                    }
                    <Text style={styles.iconName} numberOfLines={1}>{icon.name.replace(/-/g, '\n')}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {/* ── FEATURE MANAGER ─────────────────────────── */}
          {section === 'features' && (
            <FeatureManager theme={theme} />
          )}

          {/* ── HUB MANAGER ──────────────────────────────── */}
          {section === 'hubmanager' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📱 Hub Manager | ہب مینیجر</Text>
              <Text style={styles.sectionSubTitle}>Edit, remove, replace apps in each Hub | ہر ہب میں ایپس ترمیم کریں</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 8 }}>
                {Object.keys(HUB_META).map(hid => (
                  <Pressable key={hid} onPress={() => setActiveHubId(hid)}
                    style={[styles.sectionTab, { backgroundColor: activeHubId === hid ? theme.primary : 'rgba(255,255,255,0.18)', borderColor: activeHubId === hid ? '#fff' : theme.glassBorder }]}>
                    <Text style={{ fontSize: 14 }}>{HUB_META[hid].icon}</Text>
                    <Text style={styles.sectionTabText}>{HUB_META[hid].name}</Text>
                  </Pressable>
                ))}
              </ScrollView>
              <View style={styles.hubActRow}>
                <Text style={styles.hubAppsCount}>{getHubApps(activeHubId).length} apps in {HUB_META[activeHubId]?.name}</Text>
                <Pressable onPress={() => resetHubToDefault(activeHubId)} style={styles.resetBtn}>
                  <MaterialIcons name="refresh" size={14} color="#FFD700" />
                  <Text style={styles.resetBtnText}>Reset</Text>
                </Pressable>
              </View>
              {getHubApps(activeHubId).map((app: any) => (
                <View key={app.id} style={[styles.hubAppRow, { borderColor: theme.glassBorder }]}>
                  <LinearGradient colors={['rgba(255,255,255,0.12)', 'rgba(255,255,255,0.03)']} style={StyleSheet.absoluteFillObject} />
                  <View style={[styles.hubAppIcon, { backgroundColor: app.bg || 'rgba(0,150,200,0.2)' }]}>
                    <Text style={{ fontSize: 18 }}>{app.name.charAt(0)}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.hubAppName} numberOfLines={1}>{app.name}</Text>
                    <Text style={styles.hubAppUr} numberOfLines={1}>{app.ur}</Text>
                    <Text style={styles.hubAppUrl} numberOfLines={1}>{app.url}</Text>
                  </View>
                  <Pressable onPress={() => setEditingHubApp({ ...app, __hubId: activeHubId })} style={styles.hubEditBtn}>
                    <MaterialIcons name="edit" size={14} color="#4FC3F7" />
                  </Pressable>
                  <Pressable onPress={() => removeHubApp(activeHubId, app.id)} style={styles.hubDeleteBtn}>
                    <MaterialIcons name="delete" size={14} color="#FF5555" />
                  </Pressable>
                </View>
              ))}
              <Pressable onPress={() => setEditingHubApp({ id: `new_${Date.now()}`, name: '', ur: '', url: '', bg: 'rgba(0,150,200,0.3)', __hubId: activeHubId, __isNew: true })}
                style={[styles.saveBtn, { backgroundColor: theme.primary }]}>
                <MaterialIcons name="add" size={18} color="#fff" />
                <Text style={styles.saveBtnText}>Add New App | نئی ایپ شامل کریں</Text>
              </Pressable>
            </View>
          )}

          {/* ── LOGO / PERSONALITIES ─────────────────────────── */}
          {section === 'logopics' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🖼️ Logo & Personalities | لوگو اور شخصیات</Text>
              <Text style={styles.sectionSubTitle}>Browser Logo | براؤزر لوگو</Text>
              <View style={[styles.logoCard, { borderColor: theme.glassBorder }]}>
                <LinearGradient colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.03)']} style={StyleSheet.absoluteFillObject} />
                <View style={styles.logoPreview}>
                  {customLogoUri
                    ? <Image source={{ uri: customLogoUri }} style={styles.logoImg} resizeMode="contain" />
                    : <MaterialIcons name="auto-awesome" size={40} color={theme.glowColor} />}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.logoLabel}>{customLogoUri ? 'Custom Logo' : 'Default ESB Logo'}</Text>
                  <Text style={styles.logoSubLabel}>Tap to replace from Gallery | گیلری سے تبدیل کریں</Text>
                </View>
                <View style={styles.logoActions}>
                  <Pressable onPress={handlePickLogo} style={[styles.logoBtn, { backgroundColor: theme.primary }]}>
                    <MaterialIcons name="photo-library" size={16} color="#fff" />
                    <Text style={styles.logoBtnText}>Gallery</Text>
                  </Pressable>
                  {customLogoUri && (
                    <Pressable onPress={() => setCustomLogoUri(null)} style={[styles.logoBtn, { backgroundColor: '#FF5555' }]}>
                      <MaterialIcons name="restore" size={16} color="#fff" />
                      <Text style={styles.logoBtnText}>Reset</Text>
                    </Pressable>
                  )}
                </View>
              </View>
              <Text style={[styles.sectionSubTitle, { marginTop: 16 }]}>Historical Personalities | شخصیات</Text>
              {editingPersonalities.map((p, idx) => (
                <View key={p.id} style={[styles.persCard, { borderColor: theme.glassBorder }]}>
                  <LinearGradient colors={['rgba(255,255,255,0.12)', 'rgba(255,255,255,0.03)']} style={StyleSheet.absoluteFillObject} />
                  <View style={styles.persImgWrap}>
                    {p.imageUri
                      ? <Image source={{ uri: p.imageUri }} style={styles.persImg} resizeMode="cover" />
                      : <MaterialIcons name="person" size={32} color="rgba(255,255,255,0.4)" />}
                  </View>
                  <View style={{ flex: 1, gap: 4 }}>
                    <TextInput style={[styles.persInput, { borderColor: theme.glassBorder }]}
                      value={p.name} onChangeText={v => {
                        const u = [...editingPersonalities]; u[idx] = { ...u[idx], name: v }; setEditingPersonalities(u);
                      }} placeholder="Name" placeholderTextColor="rgba(255,255,255,0.3)" />
                    <TextInput style={[styles.persInput, { borderColor: theme.glassBorder }]}
                      value={p.ur} onChangeText={v => {
                        const u = [...editingPersonalities]; u[idx] = { ...u[idx], ur: v }; setEditingPersonalities(u);
                      }} placeholder="اردو نام" placeholderTextColor="rgba(255,255,255,0.3)" />
                    <TextInput style={[styles.persInput, { borderColor: theme.glassBorder }]}
                      value={p.title} onChangeText={v => {
                        const u = [...editingPersonalities]; u[idx] = { ...u[idx], title: v }; setEditingPersonalities(u);
                      }} placeholder="Title" placeholderTextColor="rgba(255,255,255,0.3)" />
                  </View>
                  <Pressable onPress={() => handlePickPersonalityImage(p.id)}
                    style={[styles.logoBtn, { backgroundColor: theme.primary, alignSelf: 'flex-start' }]}>
                    <MaterialIcons name="photo-camera" size={16} color="#fff" />
                    <Text style={styles.logoBtnText}>Photo</Text>
                  </Pressable>
                </View>
              ))}
              <Pressable onPress={savePersonalities} style={[styles.saveBtn, { backgroundColor: theme.primary, marginTop: 8 }]}>
                <MaterialIcons name="save" size={18} color="#fff" />
                <Text style={styles.saveBtnText}>Save All | سب محفوظ کریں</Text>
              </Pressable>
            </View>
          )}

          {/* ── EXPORT ───────────────────────────────────── */}
          {section === 'export' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📦 Export & Backup | ایکسپورٹ</Text>
              <View style={[styles.infoCard, { borderColor: '#00FF8844' }]}>
                <LinearGradient colors={['rgba(0,255,136,0.08)', 'transparent']} style={StyleSheet.absoluteFillObject} />
                <MaterialIcons name="shield" size={18} color="#00FF88" />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.infoText, { color: '#00FF88' }]}>Admin Access Only | صرف ایڈمن رسائی</Text>
                  <Text style={styles.infoSubText}>Export manager is password-protected here.</Text>
                </View>
              </View>
              <Pressable onPress={() => setExportOpen(true)} style={[styles.saveBtn, { backgroundColor: theme.primary }]}>
                <MaterialIcons name="backup" size={18} color="#fff" />
                <Text style={styles.saveBtnText}>Open Export Manager | ایکسپورٹ مینیجر کھولیں</Text>
              </Pressable>
            </View>
          )}

          {/* ── TICKER ───────────────────────────────────── */}
          {section === 'ticker' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Ticker Messages | ٹیکر پیغامات</Text>
              {['Top Ticker 1', 'Top Ticker 2', 'Bottom Ticker 1', 'Bottom Ticker 2', 'Bottom Ticker 3', 'Bottom Ticker 4', 'Bottom Ticker 5'].map((label, i) => (
                <View key={i} style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>{label}</Text>
                  <View style={[styles.inputBox2, { borderColor: theme.glassBorder }]}>
                    <TextInput style={styles.adminInput} value={localTickers[i] || ''}
                      onChangeText={v => { const c = [...localTickers]; c[i] = v; setLocalTickers(c); }}
                      placeholder={`Ticker ${i + 1}...`} placeholderTextColor="rgba(255,255,255,0.4)" multiline />
                  </View>
                </View>
              ))}
              <Pressable onPress={saveTickers} style={[styles.saveBtn, { backgroundColor: theme.primary }]}>
                <MaterialIcons name="save" size={18} color="#fff" />
                <Text style={styles.saveBtnText}>Save Tickers | محفوظ کریں</Text>
              </Pressable>
            </View>
          )}

          {/* ── BRANDING ─────────────────────────────────── */}
          {section === 'branding' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Branding Text | برانڈنگ متن</Text>
              {[
                { key: 'arabic', label: 'Arabic Line | عربی سطر' },
                { key: 'urdu', label: 'Urdu Line | اردو سطر' },
                { key: 'english', label: 'English Line | انگریزی سطر' },
              ].map(f => (
                <View key={f.key} style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>{f.label}</Text>
                  <View style={[styles.inputBox2, { borderColor: theme.glassBorder }]}>
                    <TextInput style={styles.adminInput}
                      value={(localBranding as any)[f.key] || ''}
                      onChangeText={v => setLocalBranding({ ...localBranding, [f.key]: v })}
                      multiline />
                  </View>
                </View>
              ))}
              <Pressable onPress={saveBranding} style={[styles.saveBtn, { backgroundColor: theme.primary }]}>
                <MaterialIcons name="save" size={18} color="#fff" />
                <Text style={styles.saveBtnText}>Save Branding | محفوظ کریں</Text>
              </Pressable>
            </View>
          )}

          {/* ── STATS ────────────────────────────────────── */}
          {section === 'stats' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Browser Stats | براؤزر اعداد و شمار</Text>
              {[
                { label: 'Bookmarks Saved', labelUr: 'محفوظ بک مارکس', val: bookmarks.length, icon: 'bookmark', color: '#FFD700' },
                { label: 'Downloads', labelUr: 'ڈاؤنلوڈز', val: downloads.length, icon: 'download', color: '#00DCFF' },
                { label: 'Total Themes', labelUr: 'کل تھیمز', val: THEMES.length, icon: 'palette', color: '#DA70D6' },
                { label: 'App Slots', labelUr: 'ایپ سلاٹس', val: 10, icon: 'grid-view', color: '#FF9800' },
                { label: 'Ticker Strips', labelUr: 'ٹیکر پٹیاں', val: 7, icon: 'announcement', color: '#4CAF50' },
              ].map(s => (
                <View key={s.label} style={[styles.statsRow, { borderColor: theme.glassBorder }]}>
                  <LinearGradient colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.03)']} style={StyleSheet.absoluteFillObject} />
                  <View style={[styles.statsIcon, { backgroundColor: s.color + '25' }]}>
                    <MaterialIcons name={s.icon as any} size={20} color={s.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.statsLabel}>{s.label}</Text>
                    <Text style={styles.statsLabelUr}>{s.labelUr}</Text>
                  </View>
                  <Text style={[styles.statsVal, { color: s.color }]}>{s.val}</Text>
                </View>
              ))}
              <View style={[styles.infoCard, { borderColor: theme.glassBorder, marginTop: 20 }]}>
                <LinearGradient colors={['rgba(255,255,255,0.18)', 'rgba(255,255,255,0.04)']} style={StyleSheet.absoluteFillObject} />
                <MaterialIcons name="info" size={20} color={theme.glowColor} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.infoText}>EvEr SmArT BrOwSeR v2.0</Text>
                  <Text style={styles.infoSubText}>SWO.EvESmArTBrOwSeR/drirfan</Text>
                  <Text style={styles.infoSubText}>پاکستان کا بہترین ڈیجیٹل براؤزر</Text>
                </View>
              </View>
            </View>
          )}

          {/* ── UPDATES ──────────────────────────────────── */}
          {section === 'updates' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🔄 Updates | اپ ڈیٹس</Text>
              <View style={[styles.settingRow, { borderColor: theme.glassBorder }]}>
                <LinearGradient colors={['rgba(255,255,255,0.18)', 'rgba(255,255,255,0.04)']} style={StyleSheet.absoluteFillObject} />
                <MaterialIcons name="info" size={22} color={theme.glowColor} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.settingLabel}>Current Version | موجودہ ورژن</Text>
                  <Text style={styles.settingDesc}>EvEr SmArT BrOwSeR v2.0.0 — June 2025</Text>
                </View>
              </View>
              <Pressable
                onPress={() => {
                  setUpdateChecking(true);
                  setTimeout(() => { setUpdateChecking(false); setUpdateStatus('uptodate'); }, 2500);
                }}
                style={[styles.saveBtn, { backgroundColor: updateChecking ? 'rgba(255,255,255,0.2)' : theme.primary }]}
                disabled={updateChecking}
              >
                <MaterialIcons name={updateChecking ? 'hourglass-empty' : 'system-update'} size={18} color="#fff" />
                <Text style={styles.saveBtnText}>
                  {updateChecking ? 'Checking... | چیک ہو رہا ہے' : 'Check for Updates | اپ ڈیٹ چیک کریں'}
                </Text>
              </Pressable>
              {updateStatus === 'uptodate' && (
                <View style={[styles.settingRow, { borderColor: '#00FF8855' }]}>
                  <LinearGradient colors={['rgba(0,255,136,0.12)', 'transparent']} style={StyleSheet.absoluteFillObject} />
                  <MaterialIcons name="check-circle" size={22} color="#00FF88" />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.settingLabel, { color: '#00FF88' }]}>Up to date! | تازہ ترین ورژن</Text>
                    <Text style={styles.settingDesc}>You have the latest version | آپ کے پاس تازہ ترین ورژن ہے</Text>
                  </View>
                </View>
              )}
            </View>
          )}

          {/* ── SECURITY ─────────────────────────────────── */}
          {section === 'security' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Change Password | پاسورڈ تبدیل کریں</Text>
              <View style={[styles.inputBox2, { borderColor: theme.glassBorder }]}>
                <TextInput style={styles.adminInput} value={newPwd} onChangeText={setNewPwd}
                  placeholder="New password (min 4 chars)" placeholderTextColor="rgba(255,255,255,0.4)" secureTextEntry />
              </View>
              <Pressable onPress={changePassword} style={[styles.saveBtn, { backgroundColor: theme.primary, marginTop: 12 }]}>
                <MaterialIcons name="lock-reset" size={18} color="#fff" />
                <Text style={styles.saveBtnText}>Update Password | پاسورڈ اپ ڈیٹ کریں</Text>
              </Pressable>
            </View>
          )}

        </ScrollView>
      </LinearGradient>

      {/* Hub App Edit Modal */}
      {editingHubApp && (
        <Modal visible transparent animationType="slide" onRequestClose={() => setEditingHubApp(null)}>
          <View style={styles.editOverlay}>
            <View style={styles.editSheet}>
              <LinearGradient colors={[...theme.gradient]} style={StyleSheet.absoluteFillObject} />
              <Text style={styles.editTitle}>
                {editingHubApp.__isNew ? '➕ Add App | ایپ شامل' : '✏️ Edit Hub App | ترمیم'}
              </Text>
              {[{ label: 'App Name (English)', key: 'name', placeholder: 'App Name' },
                { label: 'اردو نام', key: 'ur', placeholder: 'ایپ کا نام' },
                { label: 'URL', key: 'url', placeholder: 'https://example.com', keyboard: 'url' },
              ].map(f => (
                <View key={f.key} style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>{f.label}</Text>
                  <View style={styles.inputBox2}>
                    <TextInput style={styles.adminInput}
                      value={(editingHubApp as any)[f.key] || ''} placeholder={f.placeholder}
                      placeholderTextColor="rgba(255,255,255,0.4)"
                      autoCapitalize="none"
                      keyboardType={(f as any).keyboard || 'default'}
                      onChangeText={v => setEditingHubApp({ ...editingHubApp, [f.key]: v })} />
                  </View>
                </View>
              ))}
              <View style={styles.formBtns}>
                <Pressable onPress={() => setEditingHubApp(null)} style={styles.cancelBtn2}>
                  <Text style={styles.cancelBtnText2}>Cancel</Text>
                </Pressable>
                <Pressable onPress={() => saveHubApp(editingHubApp.__hubId, editingHubApp)}
                  style={[styles.saveBtn2, { backgroundColor: theme.primary }]}>
                  <Text style={styles.saveBtnText2}>Save | محفوظ</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Export Manager */}
      <ExportManager visible={exportOpen} onClose={() => setExportOpen(false)} />

      {/* Icon Library Modal */}
      <Modal visible={iconLibModal} animationType="slide" transparent onRequestClose={() => setIconLibModal(false)}>
        <View style={styles.iconLibOverlay}>
          <View style={styles.iconLibSheet}>
            <LinearGradient colors={['rgba(20,20,40,0.97)', 'rgba(10,10,25,0.97)']} style={StyleSheet.absoluteFillObject} />
            <View style={styles.iconLibHeader}>
              <Text style={styles.iconLibTitle}>Icon Library</Text>
              <Pressable onPress={() => setIconLibModal(false)} hitSlop={8} style={styles.iconLibClose}>
                <MaterialIcons name="close" size={22} color="#fff" />
              </Pressable>
            </View>
            <View style={styles.iconSearchBox}>
              <MaterialIcons name="search" size={16} color="rgba(255,255,255,0.6)" />
              <TextInput style={styles.iconSearchInput} value={iconSearch} onChangeText={setIconSearch}
                placeholder="Search..." placeholderTextColor="rgba(255,255,255,0.4)" />
            </View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.iconGrid}>
              {filteredIcons.map(icon => (
                <Pressable key={icon.name + icon.lib} onPress={() => handleSelectIcon(icon.name, icon.lib)}
                  style={styles.iconCard}>
                  <LinearGradient colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.03)']} style={StyleSheet.absoluteFillObject} />
                  {icon.lib === 'mat'
                    ? <MaterialIcons name={icon.name as any} size={22} color="#fff" />
                    : <Ionicons name={icon.name as any} size={22} color="#fff" />
                  }
                  <Text style={styles.iconName} numberOfLines={2}>{icon.name}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function ThemeRow({ t, active, onSelect }: { t: AppTheme; active: boolean; onSelect: () => void }) {
  return (
    <Pressable onPress={onSelect}
      style={[styles.themeListItem, { borderColor: active ? '#fff' : 'rgba(255,255,255,0.25)', borderWidth: active ? 2 : 1 }]}>
      <LinearGradient colors={[...t.gradient]} style={styles.themeListGrad} />
      <View style={{ flex: 1 }}>
        <Text style={styles.themeListName}>{t.name} {t.isDark ? '🌑' : '☀️'}</Text>
        <Text style={styles.themeListNameUr}>{t.nameUrdu}</Text>
      </View>
      {active && <MaterialIcons name="check-circle" size={20} color="#fff" />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#000' },
  root: { flex: 1 },
  loginWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32, overflow: 'hidden' },
  loginIcon: { fontSize: 56, marginBottom: 12 },
  loginTitle: { color: '#fff', fontSize: 26, fontWeight: '900', textAlign: 'center' },
  loginTitleUr: { color: 'rgba(255,255,255,0.85)', fontSize: 16, marginTop: 4, textAlign: 'center' },
  loginSub: { color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 8, marginBottom: 32 },
  inputWrap: { width: '100%', flexDirection: 'row', alignItems: 'center', borderRadius: 50, borderWidth: 1.5, overflow: 'hidden', paddingHorizontal: 16, height: 52, gap: 10 },
  pwdInput: { flex: 1, color: '#fff', fontSize: 15, fontWeight: '500' },
  errorText: { color: '#FF5555', fontSize: 13, marginTop: 10, textAlign: 'center' },
  loginBtn: { marginTop: 20, paddingVertical: 14, paddingHorizontal: 40, borderRadius: 50, width: '100%', alignItems: 'center' },
  loginBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  adminHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, overflow: 'hidden', gap: 10 },
  adminTitle: { flex: 1, color: '#fff', fontSize: 15, fontWeight: '800' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 20, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 6 },
  logoutText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  dlCard: { borderRadius: 14, borderWidth: 1, overflow: 'hidden', padding: 14, gap: 8 },
  dlCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dlCardTitle: { color: '#fff', fontSize: 13, fontWeight: '800', flex: 1 },
  dlCardText: { color: 'rgba(255,255,255,0.75)', fontSize: 11, lineHeight: 18 },
  dlBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 10, paddingVertical: 10, paddingHorizontal: 14 },
  dlBtnText: { fontSize: 12, fontWeight: '700', flex: 1, textAlign: 'center' },
  fileRow: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 10, borderWidth: 1, overflow: 'hidden', padding: 10 },
  fileName: { color: '#fff', fontSize: 11, fontWeight: '700', fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
  fileDesc: { color: 'rgba(255,255,255,0.55)', fontSize: 10, marginTop: 2 },
  docRow: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 10, borderWidth: 1, overflow: 'hidden', padding: 10, marginBottom: 4 },
  docKey: { color: 'rgba(255,255,255,0.7)', fontSize: 10, fontWeight: '700', width: 120, flexShrink: 0 },
  docVal: { color: '#fff', fontSize: 11, fontWeight: '600', flex: 1 },
  policyBox: { borderRadius: 12, borderWidth: 1, overflow: 'hidden', padding: 14 },
  policyText: { color: 'rgba(255,255,255,0.8)', fontSize: 10, lineHeight: 17 },
  docLinkBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 12, borderWidth: 1, overflow: 'hidden', padding: 12, marginBottom: 6 },
  adminContent: { padding: 14, paddingBottom: 40, gap: 10 },
  section: { gap: 10 },
  sectionTitle: { color: '#fff', fontSize: 15, fontWeight: '800', marginBottom: 2 },
  sectionSubTitle: { color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: '600', marginBottom: 4 },
  settingRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 14, borderWidth: 1, overflow: 'hidden' },
  settingLabel: { color: '#fff', fontSize: 14, fontWeight: '700' },
  settingDesc: { color: 'rgba(255,255,255,0.6)', fontSize: 11, marginTop: 2 },
  statsStrip: { flexDirection: 'row', gap: 8 },
  statCard: { flex: 1, borderRadius: 12, borderWidth: 1, overflow: 'hidden', padding: 10, alignItems: 'center', gap: 4 },
  statNum: { fontSize: 22, fontWeight: '900' },
  statLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 9, fontWeight: '600', textAlign: 'center' },
  themePreviewBtn: { borderRadius: 14, borderWidth: 1, overflow: 'hidden', height: 80, justifyContent: 'flex-end', padding: 12 },
  themePreviewName: { color: '#fff', fontWeight: '800', fontSize: 14 },
  themePreviewSub: { color: 'rgba(255,255,255,0.75)', fontSize: 11 },
  themeListItem: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 12, overflow: 'hidden', padding: 12, marginBottom: 6 },
  themeListGrad: { ...StyleSheet.absoluteFillObject },
  themeListName: { color: '#fff', fontWeight: '700', fontSize: 13 },
  themeListNameUr: { color: 'rgba(255,255,255,0.75)', fontSize: 11 },
  sectionTab: { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 20, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 5 },
  sectionTabText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  inputGroup: { gap: 6 },
  inputLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: '600' },
  inputBox2: { borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)', overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.1)', minHeight: 44 },
  adminInput: { color: '#fff', fontSize: 13, padding: 12, fontWeight: '500' },
  saveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 12, paddingVertical: 13 },
  saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  infoCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 14, borderWidth: 1, overflow: 'hidden' },
  infoText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  infoSubText: { color: 'rgba(255,255,255,0.7)', fontSize: 11, marginTop: 2 },
  statsRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 14, borderWidth: 1, overflow: 'hidden' },
  statsIcon: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  statsLabel: { color: '#fff', fontSize: 13, fontWeight: '700' },
  statsLabelUr: { color: 'rgba(255,255,255,0.6)', fontSize: 10 },
  statsVal: { fontSize: 24, fontWeight: '900' },
  hubActRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  hubAppsCount: { color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: '600' },
  resetBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255,215,0,0.15)', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5 },
  resetBtnText: { color: '#FFD700', fontSize: 11, fontWeight: '700' },
  hubAppRow: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 12, borderWidth: 1, overflow: 'hidden', padding: 10 },
  hubAppIcon: { width: 36, height: 36, borderRadius: 9, justifyContent: 'center', alignItems: 'center' },
  hubAppName: { color: '#fff', fontSize: 12, fontWeight: '700' },
  hubAppUr: { color: 'rgba(255,255,255,0.6)', fontSize: 10, marginTop: 1 },
  hubAppUrl: { color: 'rgba(255,255,255,0.35)', fontSize: 9, marginTop: 1 },
  hubEditBtn: { padding: 6, backgroundColor: 'rgba(79,195,247,0.2)', borderRadius: 7 },
  hubDeleteBtn: { padding: 6, backgroundColor: 'rgba(255,85,85,0.2)', borderRadius: 7 },
  logoCard: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 14, borderWidth: 1, overflow: 'hidden', padding: 14 },
  logoPreview: { width: 60, height: 60, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  logoImg: { width: 60, height: 60, borderRadius: 14 },
  logoLabel: { color: '#fff', fontSize: 13, fontWeight: '700' },
  logoSubLabel: { color: 'rgba(255,255,255,0.55)', fontSize: 10, marginTop: 3 },
  logoActions: { flexDirection: 'column', gap: 6 },
  logoBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6 },
  logoBtnText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  persCard: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 12, borderWidth: 1, overflow: 'hidden', padding: 12 },
  persImgWrap: { width: 52, height: 64, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  persImg: { width: 52, height: 64 },
  persInput: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8, borderWidth: 1, color: '#fff', fontSize: 11, paddingHorizontal: 8, paddingVertical: 5 },
  appGridList: { gap: 8 },
  appGridItem: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 12, borderWidth: 1, overflow: 'hidden', padding: 12 },
  appGridIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  appGridName: { color: '#fff', fontSize: 13, fontWeight: '700' },
  appGridUr: { color: 'rgba(255,255,255,0.65)', fontSize: 10, marginTop: 2 },
  editOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  editSheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: 'hidden', padding: 20, paddingBottom: 40, gap: 10 },
  editTitle: { color: '#fff', fontSize: 18, fontWeight: '900', marginBottom: 8 },
  emojiBtn: { width: 44, height: 44, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  bgSwatch: { width: 36, height: 36, borderRadius: 8, borderColor: 'rgba(255,255,255,0.5)' },
  iconLibBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)', overflow: 'hidden', padding: 12 },
  iconLibBtnText: { color: '#fff', fontSize: 13, fontWeight: '600', flex: 1 },
  formBtns: { flexDirection: 'row', gap: 10 },
  cancelBtn2: { flex: 1, alignItems: 'center', paddingVertical: 12, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  cancelBtnText2: { color: 'rgba(255,255,255,0.8)', fontWeight: '600' },
  saveBtn2: { flex: 1, alignItems: 'center', paddingVertical: 12, borderRadius: 10 },
  saveBtnText2: { color: '#fff', fontWeight: '700' },
  iconSearchBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 50, paddingHorizontal: 12, height: 40, marginBottom: 10 },
  iconSearchInput: { flex: 1, color: '#fff', fontSize: 13 },
  iconGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  iconCard: { width: 72, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)', overflow: 'hidden', alignItems: 'center', padding: 8, gap: 4 },
  iconName: { color: 'rgba(255,255,255,0.65)', fontSize: 8, textAlign: 'center' },
  iconLibOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  iconLibSheet: { height: '80%', borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: 'hidden', padding: 16 },
  iconLibHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  iconLibTitle: { flex: 1, color: '#fff', fontSize: 18, fontWeight: '800' },
  iconLibClose: { padding: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8 },
  themePreviewBox: { height: 100, borderRadius: 16, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  previewLabel: { color: '#fff', fontSize: 20, fontWeight: '900' },
  previewLabelUr: { fontSize: 13, fontWeight: '600', marginTop: 4 },
  glowDot: { position: 'absolute', top: 10, right: 10, width: 12, height: 12, borderRadius: 6 },
  colorLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  colorPreview: { width: 20, height: 20, borderRadius: 5, borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)' },
  swatch: { width: 28, height: 28, borderRadius: 6 },
  swatchHex: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 6, paddingHorizontal: 8, height: 28, justifyContent: 'center' },
  hexInput: { color: '#fff', fontSize: 11, width: 80 },
});
