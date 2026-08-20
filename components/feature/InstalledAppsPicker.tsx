import React, { useState } from 'react';
import {
  View, Text, Pressable, StyleSheet, Modal, ScrollView, Alert,
  Linking, Platform, TextInput,
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBrowserContext, InstalledApp } from '@/contexts/BrowserContext';

interface InstalledAppsPickerProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (app: InstalledApp) => void;
}

// ── URL scheme deep links for instant native app launch ────────────────────────
const URL_SCHEMES: Record<string, string[]> = {
  'com.whatsapp': ['whatsapp://'],
  'com.google.android.youtube': ['youtube://','vnd.youtube://'],
  'com.facebook.katana': ['fb://'],
  'com.instagram.android': ['instagram://'],
  'com.zhiliaoapp.musically': ['snssdk1233://','musically://'],
  'com.twitter.android': ['twitter://'],
  'org.telegram.messenger': ['tg://'],
  'com.google.android.gm': ['googlegmail://'],
  'com.google.android.apps.maps': ['comgooglemaps://','geo://'],
  'com.spotify.music': ['spotify://'],
  'com.netflix.mediaclient': ['netflix://'],
  'com.amazon.mShop.android': ['amzn://'],
  'com.linkedin.android': ['linkedin://'],
  'us.zoom.videomeetings': ['zoomus://'],
  'com.snapchat.android': ['snapchat://'],
  'com.pinterest': ['pinterest://'],
};

// ── Popular apps list ──────────────────────────────────────────────────────────
const COMMON_APPS = [
  { name: 'WhatsApp', nameUr: 'واٹس ایپ', emoji: '💬', packageName: 'com.whatsapp', url: 'https://web.whatsapp.com', bg: 'rgba(37,211,102,0.3)' },
  { name: 'YouTube', nameUr: 'یوٹیوب', emoji: '▶️', packageName: 'com.google.android.youtube', url: 'https://youtube.com', bg: 'rgba(255,0,0,0.3)' },
  { name: 'Facebook', nameUr: 'فیس بک', emoji: '📘', packageName: 'com.facebook.katana', url: 'https://facebook.com', bg: 'rgba(24,119,242,0.3)' },
  { name: 'Instagram', nameUr: 'انسٹاگرام', emoji: '📸', packageName: 'com.instagram.android', url: 'https://instagram.com', bg: 'rgba(225,48,108,0.3)' },
  { name: 'TikTok', nameUr: 'ٹک ٹاک', emoji: '🎵', packageName: 'com.zhiliaoapp.musically', url: 'https://tiktok.com', bg: 'rgba(0,0,0,0.4)' },
  { name: 'Twitter/X', nameUr: 'ٹوئٹر', emoji: '🐦', packageName: 'com.twitter.android', url: 'https://twitter.com', bg: 'rgba(29,161,242,0.3)' },
  { name: 'Telegram', nameUr: 'ٹیلیگرام', emoji: '✈️', packageName: 'org.telegram.messenger', url: 'https://web.telegram.org', bg: 'rgba(40,171,235,0.3)' },
  { name: 'Gmail', nameUr: 'جی میل', emoji: '📧', packageName: 'com.google.android.gm', url: 'https://mail.google.com', bg: 'rgba(234,67,53,0.3)' },
  { name: 'Maps', nameUr: 'نقشہ', emoji: '🗺️', packageName: 'com.google.android.apps.maps', url: 'https://maps.google.com', bg: 'rgba(66,133,244,0.3)' },
  { name: 'Spotify', nameUr: 'اسپاٹیفائی', emoji: '🎵', packageName: 'com.spotify.music', url: 'https://open.spotify.com', bg: 'rgba(30,215,96,0.3)' },
  { name: 'Netflix', nameUr: 'نیٹ فلیکس', emoji: '🎬', packageName: 'com.netflix.mediaclient', url: 'https://netflix.com', bg: 'rgba(229,9,20,0.3)' },
  { name: 'Amazon', nameUr: 'ایمازون', emoji: '🛒', packageName: 'com.amazon.mShop.android', url: 'https://amazon.com', bg: 'rgba(255,153,0,0.3)' },
  { name: 'LinkedIn', nameUr: 'لنکڈ ان', emoji: '💼', packageName: 'com.linkedin.android', url: 'https://linkedin.com', bg: 'rgba(10,102,194,0.3)' },
  { name: 'Zoom', nameUr: 'زوم', emoji: '📹', packageName: 'us.zoom.videomeetings', url: 'https://zoom.us', bg: 'rgba(45,140,255,0.3)' },
  { name: 'Snapchat', nameUr: 'اسنیپ چیٹ', emoji: '👻', packageName: 'com.snapchat.android', url: 'https://snapchat.com', bg: 'rgba(255,252,0,0.3)' },
  { name: 'Pinterest', nameUr: 'پنٹرسٹ', emoji: '📌', packageName: 'com.pinterest', url: 'https://pinterest.com', bg: 'rgba(230,0,35,0.3)' },
];

const EMOJI_LIST = ['🌐','📱','💻','🎮','📷','🎵','📰','🛒','✈️','🏠','📚','💰','🔒','⚙️','🎯','🔍','📊','🎨','🏆','❤️'];

export function InstalledAppsPicker({ visible, onClose, onAdd }: InstalledAppsPickerProps) {
  const { theme, installedApps } = useBrowserContext();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<'common' | 'url' | 'email' | 'added'>('common');

  // Custom URL form
  const [customName, setCustomName] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [customEmoji, setCustomEmoji] = useState('🌐');

  // Email launcher
  const [emailAddr, setEmailAddr] = useState('dr.mirfann5577@gmail.com');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  const isAdded = (id: string) => installedApps.some(a => a.id === id);

  // ── Launch native app via URL scheme → intent → web fallback ─────────────
  const handleLaunchApp = async (app: typeof COMMON_APPS[0]) => {
    // 1. Try registered deep-link URL schemes (fastest)
    const schemes = URL_SCHEMES[app.packageName] || [];
    for (const scheme of schemes) {
      try {
        const canOpen = await Linking.canOpenURL(scheme);
        if (canOpen) { await Linking.openURL(scheme); return; }
      } catch {}
    }

    // 2. Try Android intent URI
    if (Platform.OS === 'android') {
      const intentUri = `intent://#Intent;package=${app.packageName};end`;
      try {
        const canOpen = await Linking.canOpenURL(intentUri);
        if (canOpen) { await Linking.openURL(intentUri); return; }
      } catch {}
    }

    // 3. Not installed — offer choices
    Alert.alert(
      'App Not Installed | ایپ انسٹال نہیں',
      `${app.name} is not installed.\n${app.name} انسٹال نہیں ہے۔`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: '🏪 Play Store', onPress: () => handleOpenInPlayStore(app) },
        { text: '🌐 Open Web', onPress: () => Linking.openURL(app.url) },
      ]
    );
  };

  const handleOpenInPlayStore = (app: typeof COMMON_APPS[0]) => {
    Linking.openURL(`market://details?id=${app.packageName}`).catch(() =>
      Linking.openURL(`https://play.google.com/store/apps/details?id=${app.packageName}`)
    );
  };

  const handleAddFromCommon = (app: typeof COMMON_APPS[0]) => {
    const newApp: InstalledApp = {
      id: `app_${app.packageName}`,
      name: app.name, nameUr: app.nameUr,
      emoji: app.emoji, url: app.url,
      packageName: app.packageName, bg: app.bg,
      source: 'mobile',
    };
    onAdd(newApp);
    Alert.alert('Added ✅ | شامل ہوگیا', `${app.name} added to your home screen.`);
  };

  // ── Add by URL ─────────────────────────────────────────────────────────────
  const handleAddByUrl = () => {
    if (!customName.trim() || !customUrl.trim()) {
      Alert.alert('Missing Fields | خالی فیلڈز', 'Enter app name and URL.');
      return;
    }
    let url = customUrl.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) url = 'https://' + url;
    const newApp: InstalledApp = {
      id: 'app_url_' + Date.now(),
      name: customName.trim(),
      nameUr: customName.trim(),
      emoji: customEmoji,
      url, bg: 'rgba(0,160,200,0.3)',
      source: 'url',
    };
    onAdd(newApp);
    setCustomName(''); setCustomUrl(''); setCustomEmoji('🌐');
    Alert.alert('Added ✅ | شامل ہوگیا', `${newApp.name} added to home screen.`);
  };

  // ── Email launch ───────────────────────────────────────────────────────────
  const handleOpenEmail = () => {
    const addr = emailAddr.trim();
    if (!addr || !addr.includes('@')) {
      Alert.alert('Invalid Email | غلط ای میل', 'Enter a valid email address.\nصحیح ای میل درج کریں۔');
      return;
    }
    let mailto = `mailto:${addr}`;
    const params: string[] = [];
    if (emailSubject.trim()) params.push(`subject=${encodeURIComponent(emailSubject.trim())}`);
    if (emailBody.trim()) params.push(`body=${encodeURIComponent(emailBody.trim())}`);
    if (params.length) mailto += '?' + params.join('&');

    Linking.openURL(mailto).catch(() => {
      Alert.alert(
        'No Email App | ای میل ایپ نہیں',
        'No email client found. Install Gmail or another mail app.',
        [{ text: 'Get Gmail', onPress: () => Linking.openURL('market://details?id=com.google.android.gm') }, { text: 'OK', style: 'cancel' }]
      );
    });
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <LinearGradient colors={[...theme.gradient]} style={StyleSheet.absoluteFillObject} />
        <View style={styles.overlay}>

          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.glassBorder }]}>
            <LinearGradient colors={['rgba(255,255,255,0.22)', 'rgba(255,255,255,0.05)']} style={StyleSheet.absoluteFillObject} />
            <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={8}>
              <MaterialIcons name="close" size={22} color="#fff" />
            </Pressable>
            <View style={{ flex: 1 }}>
              <Text style={[styles.headerTitle, { textShadowColor: theme.glowColor, textShadowRadius: 8 }]}>
                📱 App Launcher | ایپ لانچر
              </Text>
              <Text style={styles.headerSub}>
                {installedApps.length} added · {COMMON_APPS.length} popular · URL & Email launch
              </Text>
            </View>
          </View>

          {/* Tabs */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 6, padding: 10 }}>
            {([
              { id: 'common', icon: 'apps', label: 'Popular Apps' },
              { id: 'url', icon: 'add-link', label: 'Add by URL' },
              { id: 'email', icon: 'email', label: 'Email Launch' },
              { id: 'added', icon: 'check-circle', label: `Added (${installedApps.length})` },
            ] as const).map(t => (
              <Pressable key={t.id} onPress={() => setTab(t.id)}
                style={[styles.tabBtn, { backgroundColor: tab === t.id ? theme.primary : 'rgba(255,255,255,0.15)', borderColor: tab === t.id ? theme.glowColor : 'rgba(255,255,255,0.2)' }]}>
                <MaterialIcons name={t.icon as any} size={13} color="#fff" />
                <Text style={styles.tabText}>{t.label}</Text>
              </Pressable>
            ))}
          </ScrollView>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>

            {/* ── POPULAR APPS ─────────────────────────────── */}
            {tab === 'common' && COMMON_APPS.map(app => (
              <View key={app.packageName} style={[styles.appRow, { borderColor: theme.glassBorder }]}>
                <LinearGradient colors={['rgba(255,255,255,0.12)', 'rgba(255,255,255,0.03)']} style={StyleSheet.absoluteFillObject} />
                <View style={[styles.appEmoji, { backgroundColor: app.bg }]}>
                  <Text style={{ fontSize: 22 }}>{app.emoji}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.appName}>{app.name}</Text>
                  <Text style={styles.appNameUr}>{app.nameUr}</Text>
                  <Text style={styles.appPkg} numberOfLines={1}>{app.packageName}</Text>
                </View>
                <View style={styles.appActions}>
                  {/* Launch native app */}
                  <Pressable onPress={() => handleLaunchApp(app)}
                    style={[styles.actionBtn, { backgroundColor: 'rgba(0,200,100,0.3)' }]}>
                    <MaterialIcons name="launch" size={13} color="#00FF88" />
                  </Pressable>
                  {/* Play Store */}
                  <Pressable onPress={() => handleOpenInPlayStore(app)}
                    style={[styles.actionBtn, { backgroundColor: 'rgba(0,100,255,0.3)' }]}>
                    <MaterialIcons name="shop" size={13} color="#4FC3F7" />
                  </Pressable>
                  {/* Open web */}
                  <Pressable onPress={() => Linking.openURL(app.url)}
                    style={[styles.actionBtn, { backgroundColor: 'rgba(255,150,0,0.3)' }]}>
                    <MaterialIcons name="language" size={13} color="#FFA500" />
                  </Pressable>
                  {/* Add to home */}
                  {!isAdded(`app_${app.packageName}`) ? (
                    <Pressable onPress={() => handleAddFromCommon(app)}
                      style={[styles.actionBtn, { backgroundColor: theme.primary }]}>
                      <MaterialIcons name="add" size={13} color="#fff" />
                    </Pressable>
                  ) : (
                    <View style={[styles.actionBtn, { backgroundColor: '#00FF8825' }]}>
                      <MaterialIcons name="check" size={13} color="#00FF88" />
                    </View>
                  )}
                </View>
              </View>
            ))}

            {/* ── ADD BY URL ────────────────────────────────── */}
            {tab === 'url' && (
              <View style={[styles.formCard, { borderColor: theme.glassBorder }]}>
                <LinearGradient colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.02)']} style={StyleSheet.absoluteFillObject} />
                <Text style={[styles.formTitle, { textShadowColor: theme.glowColor, textShadowRadius: 6 }]}>
                  🔗 Add Custom App by URL | URL سے ایپ شامل کریں
                </Text>
                <Text style={styles.formDesc}>
                  Add any website or web app as a shortcut on your home screen. Enter its name and URL below.
                </Text>

                <Text style={styles.fieldLabel}>App Name | ایپ کا نام</Text>
                <View style={[styles.fieldWrap, { borderColor: theme.glassBorder }]}>
                  <TextInput style={styles.fieldInput} value={customName} onChangeText={setCustomName}
                    placeholder="My App / میری ایپ" placeholderTextColor="rgba(255,255,255,0.35)" />
                </View>

                <Text style={styles.fieldLabel}>Website URL | ویب سائٹ لنک</Text>
                <View style={[styles.fieldWrap, { borderColor: theme.glassBorder }]}>
                  <MaterialIcons name="link" size={16} color="rgba(255,255,255,0.5)" style={{ paddingLeft: 12 }} />
                  <TextInput style={[styles.fieldInput, { paddingLeft: 6 }]} value={customUrl} onChangeText={setCustomUrl}
                    placeholder="https://example.com" placeholderTextColor="rgba(255,255,255,0.35)"
                    keyboardType="url" autoCapitalize="none" autoCorrect={false} />
                </View>

                <Text style={styles.fieldLabel}>Emoji Icon | ایموجی</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: 6, paddingBottom: 4 }}>
                  {EMOJI_LIST.map(e => (
                    <Pressable key={e} onPress={() => setCustomEmoji(e)}
                      style={[styles.emojiBtn, { backgroundColor: customEmoji === e ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.12)' }]}>
                      <Text style={{ fontSize: 22 }}>{e}</Text>
                    </Pressable>
                  ))}
                </ScrollView>

                <View style={[styles.previewRow, { borderColor: theme.glassBorder + '80' }]}>
                  <Text style={{ fontSize: 28 }}>{customEmoji}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.previewName}>{customName || 'App Name'}</Text>
                    <Text style={styles.previewUrl}>{customUrl || 'https://...'}</Text>
                  </View>
                </View>

                <Pressable onPress={handleAddByUrl} style={[styles.addBtn, { backgroundColor: theme.primary }]}>
                  <MaterialIcons name="add-circle" size={18} color="#fff" />
                  <Text style={styles.addBtnText}>Add to Home Screen | ہوم اسکرین پر شامل کریں</Text>
                </Pressable>

                {/* Quick presets */}
                <Text style={[styles.fieldLabel, { marginTop: 16 }]}>Quick Presets | فوری آپشن</Text>
                {[
                  { name: 'Google', url: 'https://google.com', emoji: '🔍' },
                  { name: 'Wikipedia', url: 'https://wikipedia.org', emoji: '📚' },
                  { name: 'BBC Urdu', url: 'https://bbc.com/urdu', emoji: '📰' },
                  { name: 'ARY News', url: 'https://arynews.tv', emoji: '📺' },
                  { name: 'Geo TV', url: 'https://geo.tv', emoji: '📡' },
                  { name: 'Al Jazeera', url: 'https://aljazeera.com', emoji: '🌍' },
                ].map(preset => (
                  <Pressable key={preset.name} onPress={() => { setCustomName(preset.name); setCustomUrl(preset.url); setCustomEmoji(preset.emoji); }}
                    style={[styles.presetRow, { borderColor: theme.glassBorder }]}>
                    <LinearGradient colors={['rgba(255,255,255,0.08)', 'transparent']} style={StyleSheet.absoluteFillObject} />
                    <Text style={{ fontSize: 20 }}>{preset.emoji}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.presetName}>{preset.name}</Text>
                      <Text style={styles.presetUrl}>{preset.url}</Text>
                    </View>
                    <MaterialIcons name="arrow-forward-ios" size={12} color="rgba(255,255,255,0.4)" />
                  </Pressable>
                ))}
              </View>
            )}

            {/* ── EMAIL LAUNCH ──────────────────────────────── */}
            {tab === 'email' && (
              <View style={[styles.formCard, { borderColor: theme.glassBorder }]}>
                <LinearGradient colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.02)']} style={StyleSheet.absoluteFillObject} />
                <Text style={[styles.formTitle, { textShadowColor: theme.glowColor, textShadowRadius: 6 }]}>
                  📧 Email Launcher | ای میل لانچر
                </Text>
                <Text style={styles.formDesc}>
                  Compose and open an email directly in your mail app (Gmail, Outlook, etc.)
                  {'\n'}اپنے میل ایپ میں ای میل کمپوز کریں۔
                </Text>

                <Text style={styles.fieldLabel}>To (Email Address) | ای میل ایڈریس</Text>
                <View style={[styles.fieldWrap, { borderColor: theme.glassBorder }]}>
                  <MaterialIcons name="alternate-email" size={16} color="rgba(255,255,255,0.5)" style={{ paddingLeft: 12 }} />
                  <TextInput style={[styles.fieldInput, { paddingLeft: 6 }]} value={emailAddr} onChangeText={setEmailAddr}
                    placeholder="recipient@email.com" placeholderTextColor="rgba(255,255,255,0.35)"
                    keyboardType="email-address" autoCapitalize="none" autoCorrect={false} />
                </View>

                {/* Quick fill saved email */}
                <Pressable onPress={() => setEmailAddr('dr.mirfann5577@gmail.com')} style={styles.quickFillRow}>
                  <MaterialIcons name="star" size={13} color="#FFD700" />
                  <Text style={styles.quickFillText}>dr.mirfann5577@gmail.com</Text>
                  <MaterialIcons name="touch-app" size={13} color="rgba(255,255,255,0.3)" />
                </Pressable>

                <Text style={styles.fieldLabel}>Subject (Optional) | موضوع</Text>
                <View style={[styles.fieldWrap, { borderColor: theme.glassBorder }]}>
                  <TextInput style={styles.fieldInput} value={emailSubject} onChangeText={setEmailSubject}
                    placeholder="Email subject..." placeholderTextColor="rgba(255,255,255,0.35)" />
                </View>

                <Text style={styles.fieldLabel}>Message (Optional) | پیغام</Text>
                <View style={[styles.fieldWrap, { borderColor: theme.glassBorder, minHeight: 80 }]}>
                  <TextInput style={[styles.fieldInput, { height: 76, textAlignVertical: 'top' }]}
                    value={emailBody} onChangeText={setEmailBody}
                    placeholder="Type your message..." placeholderTextColor="rgba(255,255,255,0.35)"
                    multiline numberOfLines={4} />
                </View>

                <Pressable onPress={handleOpenEmail} style={[styles.addBtn, { backgroundColor: '#4FC3F7' }]}>
                  <MaterialIcons name="send" size={18} color="#000" />
                  <Text style={[styles.addBtnText, { color: '#000' }]}>Open in Email App | ای میل ایپ میں کھولیں</Text>
                </Pressable>

                {/* Info */}
                <View style={[styles.infoRow, { borderColor: 'rgba(255,255,255,0.1)' }]}>
                  <MaterialIcons name="info-outline" size={14} color="rgba(255,255,255,0.4)" />
                  <Text style={styles.infoText}>
                    This opens your device default email client with the fields pre-filled. You can review and send from there.
                  </Text>
                </View>
              </View>
            )}

            {/* ── ADDED APPS ────────────────────────────────── */}
            {tab === 'added' && (
              installedApps.length === 0 ? (
                <View style={styles.emptyWrap}>
                  <MaterialIcons name="apps" size={52} color="rgba(255,255,255,0.2)" />
                  <Text style={styles.emptyText}>No apps added yet | ابھی کوئی ایپ نہیں</Text>
                  <Pressable onPress={() => setTab('common')} style={[styles.addMoreBtn, { backgroundColor: theme.primary }]}>
                    <Text style={styles.addMoreText}>Browse Popular Apps</Text>
                  </Pressable>
                </View>
              ) : (
                installedApps.map(app => (
                  <View key={app.id} style={[styles.appRow, { borderColor: theme.glassBorder }]}>
                    <LinearGradient colors={['rgba(255,255,255,0.12)', 'rgba(255,255,255,0.03)']} style={StyleSheet.absoluteFillObject} />
                    <View style={[styles.appEmoji, { backgroundColor: app.bg }]}>
                      <Text style={{ fontSize: 22 }}>{app.emoji}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.appName}>{app.name}</Text>
                      <Text style={styles.appNameUr}>{app.nameUr}</Text>
                      {app.url ? <Text style={styles.appPkg} numberOfLines={1}>{app.url}</Text> : null}
                    </View>
                    <View style={[styles.sourceBadge, { backgroundColor: theme.cardBg }]}>
                      <Text style={styles.sourceText}>{app.source}</Text>
                    </View>
                  </View>
                ))
              )
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },

  // Header
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1, overflow: 'hidden', gap: 10 },
  closeBtn: { padding: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8 },
  headerTitle: { color: '#fff', fontSize: 16, fontWeight: '900' },
  headerSub: { color: 'rgba(255,255,255,0.6)', fontSize: 10, marginTop: 2 },

  // Tabs
  tabBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 20, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 8 },
  tabText: { color: '#fff', fontSize: 11, fontWeight: '700' },

  // App row
  list: { padding: 12, gap: 8, paddingBottom: 40 },
  appRow: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 14, borderWidth: 1, overflow: 'hidden', padding: 12 },
  appEmoji: { width: 46, height: 46, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  appName: { color: '#fff', fontSize: 13, fontWeight: '700' },
  appNameUr: { color: 'rgba(255,255,255,0.65)', fontSize: 10, marginTop: 1 },
  appPkg: { color: 'rgba(255,255,255,0.35)', fontSize: 9, marginTop: 2 },
  appActions: { flexDirection: 'row', gap: 4 },
  actionBtn: { width: 28, height: 28, borderRadius: 7, justifyContent: 'center', alignItems: 'center' },

  // Form (URL / Email)
  formCard: { borderRadius: 16, borderWidth: 1, overflow: 'hidden', padding: 16, gap: 10 },
  formTitle: { color: '#fff', fontSize: 15, fontWeight: '900' },
  formDesc: { color: 'rgba(255,255,255,0.65)', fontSize: 11, lineHeight: 18 },
  fieldLabel: { color: 'rgba(255,255,255,0.75)', fontSize: 11, fontWeight: '700' },
  fieldWrap: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, borderWidth: 1, backgroundColor: 'rgba(255,255,255,0.1)', overflow: 'hidden', minHeight: 44 },
  fieldInput: { flex: 1, color: '#fff', fontSize: 13, padding: 12, fontWeight: '500' },
  emojiBtn: { width: 44, height: 44, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  previewRow: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 12, borderWidth: 1, padding: 12, backgroundColor: 'rgba(255,255,255,0.06)' },
  previewName: { color: '#fff', fontSize: 14, fontWeight: '700' },
  previewUrl: { color: 'rgba(255,255,255,0.5)', fontSize: 10, marginTop: 2 },
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 50, paddingVertical: 13 },
  addBtnText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  presetRow: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 12, borderWidth: 1, overflow: 'hidden', padding: 11 },
  presetName: { color: '#fff', fontSize: 12, fontWeight: '700' },
  presetUrl: { color: 'rgba(255,255,255,0.45)', fontSize: 9, marginTop: 2 },
  quickFillRow: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,215,0,0.08)', borderRadius: 8, padding: 8 },
  quickFillText: { flex: 1, color: '#FFD700', fontSize: 11, fontWeight: '600' },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, borderRadius: 10, borderWidth: 1, padding: 10, marginTop: 6 },
  infoText: { flex: 1, color: 'rgba(255,255,255,0.45)', fontSize: 10, lineHeight: 16 },

  // Added tab
  sourceBadge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  sourceText: { color: 'rgba(255,255,255,0.7)', fontSize: 9, fontWeight: '700' },
  emptyWrap: { alignItems: 'center', gap: 12, paddingVertical: 48 },
  emptyText: { color: 'rgba(255,255,255,0.5)', fontSize: 14, fontWeight: '600' },
  addMoreBtn: { borderRadius: 20, paddingVertical: 10, paddingHorizontal: 24 },
  addMoreText: { color: '#fff', fontWeight: '700', fontSize: 13 },
});
