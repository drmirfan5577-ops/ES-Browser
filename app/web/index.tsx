import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet, Dimensions,
  Animated, Linking, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';

const { width: SW } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';
const MAX_W = Math.min(SW, 1100);

// ── Data ──────────────────────────────────────────────────────────────────────

const FEATURES = [
  { icon: 'language', color: '#00B4D8', title: 'Smart Browser Engine', titleUr: 'سمارٹ براؤزر انجن', desc: 'Full WebView browser with Google Search integration, URL navigation, history and safe browsing.' },
  { icon: 'palette', color: '#DA70D6', title: '16 Glassy Themes', titleUr: '۱۶ شیشہ دار تھیمز', desc: '10 luminous + 6 dark glassmorphism themes. Each with sparkling gradient and glow effects.' },
  { icon: 'vpn-lock', color: '#00FF88', title: 'VPN Shield', titleUr: 'وی پی این شیلڈ', desc: 'Built-in VPN toggle with status indicator. Secure & Play Protect compliant architecture.' },
  { icon: 'block', color: '#00DCFF', title: 'Ad Blocker', titleUr: 'ایڈ بلاکر', desc: 'WebView JS injection + DNS-level ad blocking. Powered by uBlock-compatible filter lists.' },
  { icon: 'picture-in-picture', color: '#FFD700', title: 'PiP Video Player', titleUr: 'پکچر ان پکچر', desc: 'Draggable floating video player. PiP / half-screen / fullscreen modes with Reanimated gestures.' },
  { icon: 'bookmark', color: '#FF9800', title: 'Bookmark Manager', titleUr: 'بک مارک مینیجر', desc: 'Full CRUD bookmarks with folder organization, search and one-tap navigation.' },
  { icon: 'download', color: '#4CAF50', title: 'Download Manager', titleUr: 'ڈاؤنلوڈ مینیجر', desc: 'Track all downloads by type. Open, share, delete and save to device.' },
  { icon: 'privacy-tip', color: '#CE93D8', title: 'Incognito Mode', titleUr: 'پرائیویٹ موڈ', desc: 'Private browsing session. No history, no traces, distinct purple tint for awareness.' },
  { icon: 'admin-panel-settings', color: '#FF6B6B', title: 'Admin Panel', titleUr: 'ایڈمن پینل', desc: 'Password-protected full customisation: themes, tickers, branding, app grid, icon library & theme creator.' },
  { icon: 'mosque', color: '#38ef7d', title: 'Islamic Hub', titleUr: 'اسلامک ہب', desc: 'Digital Quran Paak, Ahadees Encyclopedia, Islamic Literature, Azkaar and Kids Seedlings.' },
  { icon: 'smart-toy', color: '#00B4D8', title: 'A.I Hub', titleUr: 'اے آئی ہب', desc: 'ChatGPT, Gemini, Claude, Copilot, Perplexity and 15+ leading AI tools in one hub.' },
  { icon: 'announcement', color: '#f7971e', title: 'Live Ticker Strips', titleUr: 'لائیو ٹیکر', desc: '7 animated ticker strips (2 top + 5 bottom) with customisable text, speed and direction.' },
];

const HUBS = [
  { emoji: '🕌', name: 'Islamic Hub', ur: 'اسلامک ہب', color: '#27AE60', apps: 'Quran, Ahadees, Azkaar, Islamic Literature, Kids' },
  { emoji: '📰', name: 'News Hub', ur: 'نیوز ہب', color: '#E74C3C', apps: 'ARY, Geo, Dawn, BBC Urdu, Al-Jazeera, Reuters' },
  { emoji: '🤖', name: 'A.I Hub', ur: 'اے آئی ہب', color: '#9B59B6', apps: 'ChatGPT, Gemini, Claude, Copilot, Perplexity' },
  { emoji: '🌐', name: 'Social Hub', ur: 'سوشل ہب', color: '#3498DB', apps: 'Facebook, Instagram, YouTube, Twitter, WhatsApp' },
  { emoji: '⚙️', name: 'General Hub', ur: 'جنرل ہب', color: '#E67E22', apps: 'VPN, Gallery, Calculator, Office Suite, More' },
];

const THEMES_PREVIEW = [
  { name: 'Crimson Gold', g: ['#FF512F', '#DD2476', '#f5af19'] },
  { name: 'Emerald Green', g: ['#11998e', '#38ef7d', '#56ab2f'] },
  { name: 'Royal Blue', g: ['#1e3c72', '#2a69ac', '#00d2ff'] },
  { name: 'Violet Pink', g: ['#8B00FF', '#DA70D6', '#FF69B4'] },
  { name: 'Sapphire', g: ['#0F52BA', '#1E90FF', '#87CEEB'] },
  { name: 'Dark Abyss', g: ['#0A0A0F', '#1A1A2E', '#533483'] },
  { name: 'Dark Nebula', g: ['#05020E', '#1C0A3C', '#E040FB'] },
  { name: 'Dark Ocean', g: ['#000510', '#002952', '#00B4D8'] },
];

const PERSONALITIES = [
  { name: 'Quaid-e-Azam M.A. Jinnah', nameUr: 'قائداعظم محمد علی جناح', title: 'Founder of Pakistan', titleUr: 'بانئ پاکستان', img: require('@/assets/images/personality-jinnah.png'), color: '#27AE60' },
  { name: 'Dr. Allama Muhammad Iqbal', nameUr: 'ڈاکٹر علامہ محمد اقبال', title: 'National Poet', titleUr: 'قومی شاعر', img: require('@/assets/images/personality-iqbal.png'), color: '#8B6914' },
  { name: 'Dr. Abdul Qadeer Khan', nameUr: 'ڈاکٹر عبدالقدیر خان', title: 'Father of Nuclear Pakistan', titleUr: 'ایٹمی پاکستان کے بانی', img: require('@/assets/images/personality-aqkhan.png'), color: '#0D47A1' },
];

const NAV_LINKS = [
  { label: 'Features', anchor: '#features' },
  { label: 'Themes', anchor: '#themes' },
  { label: 'Hubs', anchor: '#hubs' },
  { label: 'Download', anchor: '#download' },
  { label: 'About', anchor: '#about' },
];

// ── Glow Button ────────────────────────────────────────────────────────────────
function GlowBtn({ label, icon, onPress, color = '#FFD700', secondary = false }: { label: string; icon?: string; onPress: () => void; color?: string; secondary?: boolean }) {
  return (
    <Pressable onPress={onPress}
      style={({ pressed }) => [styles.glowBtn, secondary ? styles.glowBtnSecondary : { backgroundColor: color + 'EE', borderColor: color },
        pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] }]}>
      {icon && <MaterialIcons name={icon as any} size={18} color="#fff" />}
      <Text style={styles.glowBtnText}>{label}</Text>
    </Pressable>
  );
}

// ── Feature Card ───────────────────────────────────────────────────────────────
function FeatureCard({ item }: { item: typeof FEATURES[0] }) {
  return (
    <View style={[styles.featureCard, { borderColor: item.color + '55' }]}>
      <LinearGradient colors={['rgba(255,255,255,0.09)', 'rgba(255,255,255,0.02)']} style={StyleSheet.absoluteFillObject} />
      <View style={[styles.featureIcon, { backgroundColor: item.color + '25' }]}>
        <MaterialIcons name={item.icon as any} size={28} color={item.color} />
      </View>
      <Text style={[styles.featureTitle, { color: item.color }]}>{item.title}</Text>
      <Text style={styles.featureTitleUr}>{item.titleUr}</Text>
      <Text style={styles.featureDesc}>{item.desc}</Text>
    </View>
  );
}

// ── Ticker Animation ───────────────────────────────────────────────────────────
function WebTicker({ text, color, dir = 'ltr' }: { text: string; color: string; dir?: 'ltr' | 'rtl' }) {
  const anim = useRef(new Animated.Value(dir === 'ltr' ? -800 : 800)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: dir === 'ltr' ? 800 : -800, duration: 18000, useNativeDriver: true }),
        Animated.timing(anim, { toValue: dir === 'ltr' ? -800 : 800, duration: 0, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return (
    <View style={[styles.ticker, { backgroundColor: color }]}>
      <Animated.Text style={[styles.tickerText, { transform: [{ translateX: anim }] }]} numberOfLines={1}>
        {text} ◆ {text} ◆ {text} ◆
      </Animated.Text>
    </View>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function WebLandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleDownloadApk = () => {
    Linking.openURL('https://expo.dev/accounts/onspace/projects/ever-smart-browser/builds');
  };
  const handleExpoGo = () => {
    Linking.openURL('https://expo.dev/go');
  };
  const handleGitHub = () => {
    Linking.openURL('https://github.com');
  };

  return (
    <ScrollView style={styles.root} showsVerticalScrollIndicator={false}>
      <StatusBar style="light" />

      {/* ── TOP TICKERS ── */}
      <WebTicker text="✨ EvEr SmArT BrOwSeR — Pakistan's Most Advanced Glassmorphism Browser App ✨ بک مارکس، ڈاؤنلوڈز، پی آئی پی، انکوگنیٹو، ۱۶ تھیمز اور بھی بہت کچھ ✨" color="#8B0000" dir="ltr" />
      <WebTicker text="🕌 Islamic Hub • 📰 News Hub • 🤖 AI Hub • 🌐 Social Hub • ⚙️ General Hub — 100 Apps Inside One Browser 🌟 براؤزر میں ۱۰۰ سے زائد ایپس 🌟" color="#003580" dir="rtl" />

      {/* ── NAV BAR ── */}
      <View style={styles.navbar}>
        <LinearGradient colors={['rgba(10,5,30,0.97)', 'rgba(20,10,50,0.97)']} style={StyleSheet.absoluteFillObject} />
        <View style={[styles.navInner, { maxWidth: MAX_W }]}>
          <View style={styles.navBrand}>
            <Image source={require('@/assets/images/esb-logo.png')} style={styles.navLogo} contentFit="contain" />
            <View>
              <Text style={styles.navTitle}>EvEr SmArT BrOwSeR</Text>
              <Text style={styles.navTitleUr}>ایور سمارٹ براؤزر</Text>
            </View>
          </View>
          <View style={styles.navLinks}>
            {NAV_LINKS.map(l => (
              <Pressable key={l.label} style={styles.navLink}>
                <Text style={styles.navLinkText}>{l.label}</Text>
              </Pressable>
            ))}
          </View>
          <GlowBtn label="Download App" icon="download" onPress={handleDownloadApk} color="#DD2476" />
        </View>
      </View>

      {/* ── HERO ── */}
      <LinearGradient colors={['#0D0020', '#1A003A', '#0A0A3F', '#001A40']} style={styles.hero}>
        {/* Glow orbs */}
        <View style={[styles.orb, { backgroundColor: '#8B00FF44', top: 60, left: '10%', width: 220, height: 220 }]} />
        <View style={[styles.orb, { backgroundColor: '#DD247644', top: 120, right: '8%', width: 180, height: 180 }]} />
        <View style={[styles.orb, { backgroundColor: '#00B4D844', bottom: 80, left: '35%', width: 160, height: 160 }]} />

        <View style={[styles.heroInner, { maxWidth: MAX_W }]}>
          <Text style={styles.heroArabic}>بسم اللّٰہ الرحمٰن الرحیم</Text>
          <Text style={styles.heroUrduLine}>شروع اللہ کے نام سے جو بڑا مہربان نہایت رحم والا ہے</Text>

          <Image source={require('@/assets/images/esb-logo.png')} style={styles.heroLogo} contentFit="contain" />

          <Text style={styles.heroTitle}>✨ EvEr SmArT BrOwSeR ✨</Text>
          <Text style={styles.heroTitleUr}>ایور سمارٹ براؤزر</Text>
          <Text style={styles.heroSubtitle}>
            Pakistan's most luminous, glassmorphic & intelligent mobile browser.{'\n'}
            Built with love for the Urdu-speaking world.
          </Text>
          <Text style={styles.heroSubtitleUr}>
            پاکستان کا سب سے روشن، شیشہ دار اور ذہین موبائل براؤزر
          </Text>

          <Text style={styles.heroDomain}>🌐  SWO.EvESmArTBrOwSeR/drirfan</Text>

          <View style={styles.heroBtns}>
            <GlowBtn label="📱 Download APK" onPress={handleDownloadApk} color="#DD2476" />
            <GlowBtn label="🚀 Expo Go Preview" onPress={handleExpoGo} color="#7B68EE" />
            <GlowBtn label="⭐ GitHub" onPress={handleGitHub} secondary />
          </View>

          {/* Badges */}
          <View style={styles.heroBadges}>
            {['React Native', 'Expo', 'TypeScript', 'Android', 'iOS', 'Web'].map(b => (
              <View key={b} style={styles.badge}>
                <Text style={styles.badgeText}>{b}</Text>
              </View>
            ))}
          </View>
        </View>
      </LinearGradient>

      {/* ── STATS STRIP ── */}
      <LinearGradient colors={['rgba(255,255,255,0.07)', 'rgba(255,255,255,0.03)']} style={styles.statsStrip}>
        {[
          { val: '16', label: 'Themes', ur: 'تھیمز', icon: 'palette', color: '#DA70D6' },
          { val: '100+', label: 'Apps', ur: 'ایپس', icon: 'apps', color: '#00B4D8' },
          { val: '5', label: 'Hubs', ur: 'ہبز', icon: 'hub', color: '#38ef7d' },
          { val: '7', label: 'Tickers', ur: 'ٹیکرز', icon: 'announcement', color: '#FFD700' },
          { val: '∞', label: 'Bookmarks', ur: 'بک مارکس', icon: 'bookmark', color: '#FF9800' },
        ].map(s => (
          <View key={s.label} style={styles.statItem}>
            <MaterialIcons name={s.icon as any} size={22} color={s.color} />
            <Text style={[styles.statVal, { color: s.color }]}>{s.val}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
            <Text style={styles.statLabelUr}>{s.ur}</Text>
          </View>
        ))}
      </LinearGradient>

      {/* ── PERSONALITIES ── */}
      <View style={styles.section}>
        <View style={[styles.sectionInner, { maxWidth: MAX_W }]}>
          <Text style={styles.sectionTag}>وطن کے عظیم ستارے</Text>
          <Text style={styles.sectionTitle}>Dedicated to Pakistan's Great Icons</Text>
          <Text style={styles.sectionTitleUr}>پاکستان کے عظیم رہنماؤں کے نام</Text>
          <View style={styles.personalityRow}>
            {PERSONALITIES.map(p => (
              <View key={p.name} style={[styles.personalityCard, { borderColor: p.color + '55' }]}>
                <LinearGradient colors={[p.color + '22', 'transparent']} style={StyleSheet.absoluteFillObject} />
                <Image source={p.img} style={styles.personalityImg} contentFit="cover" />
                <Text style={[styles.personalityName, { color: p.color }]}>{p.name}</Text>
                <Text style={styles.personalityNameUr}>{p.nameUr}</Text>
                <View style={[styles.personalityBadge, { backgroundColor: p.color + '33', borderColor: p.color + '66' }]}>
                  <Text style={[styles.personalityTitle, { color: p.color }]}>{p.title}</Text>
                </View>
                <Text style={styles.personalityTitleUr}>{p.titleUr}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* ── FEATURES ── */}
      <LinearGradient colors={['#080014', '#10002A', '#050018']} style={styles.section}>
        <View style={[styles.sectionInner, { maxWidth: MAX_W }]}>
          <Text style={styles.sectionTag}>فیچرز</Text>
          <Text style={styles.sectionTitle}>Everything You Need in One Browser</Text>
          <Text style={styles.sectionTitleUr}>ایک براؤزر میں وہ سب کچھ جو آپ کو چاہیے</Text>
          <View style={styles.featuresGrid}>
            {FEATURES.map(f => <FeatureCard key={f.title} item={f} />)}
          </View>
        </View>
      </LinearGradient>

      {/* ── THEMES ── */}
      <View style={[styles.section, { backgroundColor: '#06001A' }]}>
        <View style={[styles.sectionInner, { maxWidth: MAX_W }]}>
          <Text style={styles.sectionTag}>تھیمز</Text>
          <Text style={styles.sectionTitle}>16 Stunning Glassmorphism Themes</Text>
          <Text style={styles.sectionTitleUr}>۱۶ شاندار شیشہ دار تھیمز</Text>
          <View style={styles.themesGrid}>
            {THEMES_PREVIEW.map(t => (
              <View key={t.name} style={styles.themeCard}>
                <LinearGradient colors={t.g as [string, string, string]} style={styles.themeGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                  <View style={styles.themeGlassChip}>
                    <Text style={styles.themeGlassText}>{t.name}</Text>
                  </View>
                </LinearGradient>
              </View>
            ))}
          </View>
          <Text style={styles.themeNote}>+ Custom Theme Creator in Admin Panel | ایڈمن پینل میں کسٹم تھیم بنائیں</Text>
        </View>
      </View>

      {/* ── HUBS ── */}
      <LinearGradient colors={['#020C06', '#041A0C', '#010806']} style={styles.section}>
        <View style={[styles.sectionInner, { maxWidth: MAX_W }]}>
          <Text style={styles.sectionTag}>ہبز</Text>
          <Text style={styles.sectionTitle}>5 Powerful Content Hubs</Text>
          <Text style={styles.sectionTitleUr}>۵ طاقتور کنٹینٹ ہبز — ہر ہب میں ۲۰ ایپس</Text>
          <View style={styles.hubsGrid}>
            {HUBS.map(h => (
              <View key={h.name} style={[styles.hubCard, { borderColor: h.color + '55' }]}>
                <LinearGradient colors={[h.color + '22', 'transparent']} style={StyleSheet.absoluteFillObject} />
                <Text style={styles.hubEmoji}>{h.emoji}</Text>
                <Text style={[styles.hubName, { color: h.color }]}>{h.name}</Text>
                <Text style={styles.hubNameUr}>{h.ur}</Text>
                <Text style={styles.hubApps}>{h.apps}</Text>
              </View>
            ))}
          </View>
        </View>
      </LinearGradient>

      {/* ── HOW TO DOWNLOAD ── */}
      <View style={[styles.section, { backgroundColor: '#050010' }]}>
        <View style={[styles.sectionInner, { maxWidth: MAX_W }]}>
          <Text style={styles.sectionTag}>ڈاؤنلوڈ</Text>
          <Text style={styles.sectionTitle}>Get EvEr SmArT BrOwSeR on Your Device</Text>
          <Text style={styles.sectionTitleUr}>اپنے ڈیوائس پر ایور سمارٹ براؤزر انسٹال کریں</Text>

          <View style={styles.downloadGrid}>
            {/* Method 1 */}
            <View style={[styles.downloadCard, { borderColor: '#00FF8855' }]}>
              <LinearGradient colors={['rgba(0,255,136,0.1)', 'rgba(0,255,136,0.02)']} style={StyleSheet.absoluteFillObject} />
              <MaterialIcons name="phone-android" size={40} color="#00FF88" />
              <Text style={[styles.downloadTitle, { color: '#00FF88' }]}>Method 1: Expo Go</Text>
              <Text style={styles.downloadTitleUr}>ایکسپو گو (فوری پریویو)</Text>
              <Text style={styles.downloadDesc}>
                1. Install "Expo Go" from Play Store / App Store{'\n'}
                2. Open Expo Go → Scan QR Code{'\n'}
                3. App runs instantly — no installation needed{'\n\n'}
                Best for: Quick testing & preview
              </Text>
              <GlowBtn label="Get Expo Go" icon="download" onPress={handleExpoGo} color="#00FF88" />
            </View>

            {/* Method 2 */}
            <View style={[styles.downloadCard, { borderColor: '#DD247655' }]}>
              <LinearGradient colors={['rgba(221,36,118,0.1)', 'rgba(221,36,118,0.02)']} style={StyleSheet.absoluteFillObject} />
              <FontAwesome5 name="android" size={40} color="#DD2476" />
              <Text style={[styles.downloadTitle, { color: '#DD2476' }]}>Method 2: Android APK</Text>
              <Text style={styles.downloadTitleUr}>اینڈرائیڈ اے پی کے</Text>
              <Text style={styles.downloadDesc}>
                1. Click "Download APK" button above{'\n'}
                2. Enable "Install from unknown sources" in Settings{'\n'}
                3. Install the downloaded APK file{'\n'}
                4. Launch EvEr SmArT BrOwSeR{'\n\n'}
                Best for: Permanent installation on Android
              </Text>
              <GlowBtn label="Download APK" icon="download" onPress={handleDownloadApk} color="#DD2476" />
            </View>

            {/* Method 3 */}
            <View style={[styles.downloadCard, { borderColor: '#7B68EE55' }]}>
              <LinearGradient colors={['rgba(123,104,238,0.1)', 'rgba(123,104,238,0.02)']} style={StyleSheet.absoluteFillObject} />
              <MaterialIcons name="build" size={40} color="#7B68EE" />
              <Text style={[styles.downloadTitle, { color: '#7B68EE' }]}>Method 3: Build from Source</Text>
              <Text style={styles.downloadTitleUr}>سورس کوڈ سے بنائیں</Text>
              <Text style={styles.downloadDesc}>
                1. Download source code ZIP{'\n'}
                2. Run: npm install{'\n'}
                3. Run: npx expo start{'\n'}
                4. Build APK: eas build -p android{'\n\n'}
                Best for: Developers & customization
              </Text>
              <GlowBtn label="View Build Guide" icon="code" onPress={() => Linking.openURL('#readme')} color="#7B68EE" />
            </View>
          </View>

          {/* QR Code section */}
          <View style={[styles.qrSection, { borderColor: 'rgba(255,255,255,0.15)' }]}>
            <LinearGradient colors={['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.02)']} style={StyleSheet.absoluteFillObject} />
            <View style={styles.qrLeft}>
              <Text style={styles.qrTitle}>📱 Scan to Open in Expo Go</Text>
              <Text style={styles.qrTitleUr}>ایکسپو گو میں کھولنے کے لیے اسکین کریں</Text>
              <Text style={styles.qrDesc}>
                Open camera on your phone and point at the QR code,{'\n'}
                or open Expo Go and scan manually.
              </Text>
            </View>
            <View style={styles.qrBox}>
              <MaterialIcons name="qr-code-2" size={80} color="rgba(255,255,255,0.8)" />
              <Text style={styles.qrLabel}>Expo QR Code</Text>
              <Text style={styles.qrSubLabel}>Available after publishing</Text>
            </View>
          </View>
        </View>
      </View>

      {/* ── TECH STACK ── */}
      <LinearGradient colors={['#0A0015', '#15003A']} style={styles.section}>
        <View style={[styles.sectionInner, { maxWidth: MAX_W }]}>
          <Text style={styles.sectionTag}>ٹیکنالوجی</Text>
          <Text style={styles.sectionTitle}>Built with Modern Tech Stack</Text>
          <Text style={styles.sectionTitleUr}>جدید ٹیکنالوجی سے بنایا گیا</Text>
          <View style={styles.techGrid}>
            {[
              { icon: 'code', label: 'React Native', desc: 'Cross-platform mobile framework', color: '#61DAFB' },
              { icon: 'bolt', label: 'Expo SDK 52', desc: 'Managed workflow with OTA updates', color: '#000020' },
              { icon: 'description', label: 'TypeScript', desc: 'Type-safe, scalable codebase', color: '#3178C6' },
              { icon: 'route', label: 'Expo Router', desc: 'File-based navigation system', color: '#FF6B6B' },
              { icon: 'animation', label: 'Reanimated 3', desc: 'Smooth 60fps animations & gestures', color: '#DA70D6' },
              { icon: 'gradient', label: 'Linear Gradient', desc: '4D glassmorphism depth effects', color: '#FFD700' },
              { icon: 'storage', label: 'AsyncStorage', desc: 'Local persistent data storage', color: '#27AE60' },
              { icon: 'web', label: 'WebView', desc: 'Full browser engine integration', color: '#00B4D8' },
            ].map(t => (
              <View key={t.label} style={[styles.techCard, { borderColor: t.color + '44' }]}>
                <LinearGradient colors={[t.color + '18', 'transparent']} style={StyleSheet.absoluteFillObject} />
                <MaterialIcons name={t.icon as any} size={26} color={t.color} />
                <Text style={[styles.techLabel, { color: t.color }]}>{t.label}</Text>
                <Text style={styles.techDesc}>{t.desc}</Text>
              </View>
            ))}
          </View>
        </View>
      </LinearGradient>

      {/* ── ABOUT ── */}
      <View style={[styles.section, { backgroundColor: '#030008' }]}>
        <View style={[styles.sectionInner, { maxWidth: MAX_W }]}>
          <Text style={styles.sectionTag}>بارے میں</Text>
          <Text style={styles.sectionTitle}>About EvEr SmArT BrOwSeR</Text>
          <Text style={styles.sectionTitleUr}>ایور سمارٹ براؤزر کے بارے میں</Text>
          <View style={[styles.aboutCard, { borderColor: 'rgba(255,215,0,0.3)' }]}>
            <LinearGradient colors={['rgba(255,215,0,0.08)', 'rgba(255,215,0,0.02)']} style={StyleSheet.absoluteFillObject} />
            <Text style={styles.aboutText}>
              EvEr SmArT BrOwSeR is a production-grade, glassmorphic mobile browser application
              built with React Native (Expo) and TypeScript. It features a luminous, sparkling UI
              with 16 customizable themes, multilingual support (Arabic, Urdu, English), and
              an intelligent admin panel for full customization.
            </Text>
            <Text style={styles.aboutTextUr}>
              ایور سمارٹ براؤزر ایک پروڈکشن گریڈ، شیشہ دار موبائل براؤزر ایپلیکیشن ہے جو
              ری ایکٹ نیٹو (ایکسپو) اور ٹائپ اسکرپٹ سے بنائی گئی ہے۔ اس میں ۱۶ اپنی مرضی
              کے قابل تھیمز، کثیر لسانی معاونت اور ایک ذہین ایڈمن پینل شامل ہے۔
            </Text>
            <View style={styles.aboutDomain}>
              <MaterialIcons name="public" size={18} color="#FFD700" />
              <Text style={styles.aboutDomainText}>SWO.EvESmArTBrOwSeR/drirfan</Text>
            </View>
          </View>
        </View>
      </View>

      {/* ── FOOTER ── */}
      <LinearGradient colors={['#0A0015', '#050008', '#000005']} style={styles.footer}>
        <WebTicker text="🌟 EvEr SmArT BrOwSeR — The Future of Mobile Browsing in Pakistan 🌟 ایور سمارٹ براؤزر — پاکستان میں موبائل براؤزنگ کا مستقبل 🌟" color="#1A0035" dir="ltr" />

        <View style={[styles.footerInner, { maxWidth: MAX_W }]}>
          <View style={styles.footerBrand}>
            <Image source={require('@/assets/images/esb-logo.png')} style={{ width: 52, height: 52 }} contentFit="contain" />
            <View>
              <Text style={styles.footerTitle}>✨ EvEr SmArT BrOwSeR ✨</Text>
              <Text style={styles.footerTitleUr}>ایور سمارٹ براؤزر</Text>
              <Text style={styles.footerDomain}>SWO.EvESmArTBrOwSeR/drirfan</Text>
            </View>
          </View>

          <View style={styles.footerLinks}>
            <Text style={styles.footerLinksTitle}>Quick Links | فوری روابط</Text>
            {['Download APK', 'Expo Go Preview', 'Admin Panel', 'Theme Gallery', 'Islamic Hub', 'GitHub'].map(l => (
              <Text key={l} style={styles.footerLink}>→ {l}</Text>
            ))}
          </View>

          <View style={styles.footerLinks}>
            <Text style={styles.footerLinksTitle}>Features | فیچرز</Text>
            {['VPN Shield', 'Ad Blocker', 'PiP Player', 'Bookmark Manager', 'Download Manager', 'Incognito Mode'].map(l => (
              <Text key={l} style={styles.footerLink}>→ {l}</Text>
            ))}
          </View>
        </View>

        <View style={styles.footerBottom}>
          <Text style={styles.footerBottomText}>
            © 2025 EvEr SmArT BrOwSeR | All Rights Reserved | تمام حقوق محفوظ ہیں
          </Text>
          <Text style={styles.footerBottomSub}>
            Built with ❤️ for Pakistan | پاکستان کے لیے محبت سے بنایا گیا
          </Text>
        </View>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#030008' },
  ticker: { height: 24, justifyContent: 'center', overflow: 'hidden' },
  tickerText: { color: 'rgba(255,255,255,0.9)', fontSize: 11, fontWeight: '600', paddingHorizontal: 20 },

  // NAVBAR
  navbar: { overflow: 'hidden', borderBottomWidth: 1, borderBottomColor: 'rgba(123,104,238,0.3)', position: isWeb ? 'sticky' as any : 'relative', top: 0, zIndex: 100 },
  navInner: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 12, alignSelf: 'center', width: '100%', gap: 20 },
  navBrand: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  navLogo: { width: 36, height: 36 },
  navTitle: { color: '#fff', fontSize: 14, fontWeight: '900', textShadowColor: '#7B68EE', textShadowRadius: 8 },
  navTitleUr: { color: 'rgba(255,255,255,0.7)', fontSize: 10, marginTop: 1 },
  navLinks: { flexDirection: 'row', gap: 8 },
  navLink: { paddingHorizontal: 12, paddingVertical: 6 },
  navLinkText: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: '600' },

  // HERO
  hero: { paddingVertical: 80, paddingHorizontal: 20, overflow: 'hidden' },
  heroInner: { alignItems: 'center', alignSelf: 'center', width: '100%' },
  orb: { position: 'absolute', borderRadius: 999 },
  heroArabic: { color: '#fff', fontSize: 22, fontWeight: '700', textAlign: 'center', textShadowColor: '#FFD700', textShadowRadius: 12, marginBottom: 6 },
  heroUrduLine: { color: 'rgba(255,255,255,0.8)', fontSize: 14, textAlign: 'center', marginBottom: 30 },
  heroLogo: { width: 110, height: 110, marginBottom: 16 },
  heroTitle: { color: '#fff', fontSize: isWeb ? 40 : 28, fontWeight: '900', textAlign: 'center', textShadowColor: '#DA70D6', textShadowRadius: 20, letterSpacing: 1 },
  heroTitleUr: { color: 'rgba(255,255,255,0.8)', fontSize: 18, fontWeight: '700', marginTop: 4, textAlign: 'center', textShadowColor: '#DA70D6', textShadowRadius: 10 },
  heroSubtitle: { color: 'rgba(255,255,255,0.75)', fontSize: 15, textAlign: 'center', marginTop: 16, maxWidth: 600, lineHeight: 24 },
  heroSubtitleUr: { color: 'rgba(255,255,255,0.65)', fontSize: 13, textAlign: 'center', marginTop: 6, maxWidth: 550 },
  heroDomain: { color: '#00E5FF', fontSize: 14, fontWeight: '700', marginTop: 14, letterSpacing: 0.5 },
  heroBtns: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 28, justifyContent: 'center' },
  heroBadges: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 24, justifyContent: 'center' },
  badge: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)', paddingHorizontal: 12, paddingVertical: 4 },
  badgeText: { color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: '600' },

  // GLOW BUTTON
  glowBtn: { flexDirection: 'row', alignItems: 'center', gap: 7, borderRadius: 50, paddingVertical: 12, paddingHorizontal: 22, borderWidth: 1.5 },
  glowBtnSecondary: { backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.3)' },
  glowBtnText: { color: '#fff', fontSize: 14, fontWeight: '800' },

  // STATS STRIP
  statsStrip: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 24, paddingHorizontal: 16, borderTopWidth: 1, borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  statItem: { alignItems: 'center', gap: 3 },
  statVal: { fontSize: 26, fontWeight: '900' },
  statLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: '700' },
  statLabelUr: { color: 'rgba(255,255,255,0.5)', fontSize: 9 },

  // SECTIONS
  section: { paddingVertical: 64, paddingHorizontal: 20 },
  sectionInner: { alignSelf: 'center', width: '100%' },
  sectionTag: { color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: '700', textAlign: 'center', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 },
  sectionTitle: { color: '#fff', fontSize: isWeb ? 32 : 22, fontWeight: '900', textAlign: 'center', marginBottom: 4 },
  sectionTitleUr: { color: 'rgba(255,255,255,0.7)', fontSize: 15, textAlign: 'center', marginBottom: 36 },

  // PERSONALITIES
  personalityRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, justifyContent: 'center' },
  personalityCard: { width: isWeb ? 300 : SW * 0.85, borderRadius: 20, borderWidth: 1, overflow: 'hidden', padding: 16, alignItems: 'center', gap: 6 },
  personalityImg: { width: 120, height: 160, borderRadius: 14, marginBottom: 8 },
  personalityName: { fontSize: 14, fontWeight: '800', textAlign: 'center' },
  personalityNameUr: { color: 'rgba(255,255,255,0.75)', fontSize: 12, textAlign: 'center' },
  personalityBadge: { borderRadius: 20, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 4, marginTop: 4 },
  personalityTitle: { fontSize: 11, fontWeight: '700' },
  personalityTitleUr: { color: 'rgba(255,255,255,0.6)', fontSize: 10 },

  // FEATURES
  featuresGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, justifyContent: 'center' },
  featureCard: { width: isWeb ? 280 : SW * 0.43, borderRadius: 16, borderWidth: 1, overflow: 'hidden', padding: 16, gap: 6 },
  featureIcon: { width: 52, height: 52, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
  featureTitle: { fontSize: 13, fontWeight: '800' },
  featureTitleUr: { color: 'rgba(255,255,255,0.7)', fontSize: 10, marginBottom: 2 },
  featureDesc: { color: 'rgba(255,255,255,0.65)', fontSize: 11, lineHeight: 17 },

  // THEMES
  themesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
  themeCard: { width: isWeb ? 220 : (SW - 52) / 2, borderRadius: 14, overflow: 'hidden' },
  themeGrad: { height: 80, justifyContent: 'flex-end', padding: 8 },
  themeGlassChip: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start' },
  themeGlassText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  themeNote: { color: 'rgba(255,255,255,0.6)', fontSize: 12, textAlign: 'center', marginTop: 18, fontStyle: 'italic' },

  // HUBS
  hubsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' },
  hubCard: { width: isWeb ? 200 : (SW - 52) / 2, borderRadius: 16, borderWidth: 1, overflow: 'hidden', padding: 16, alignItems: 'center', gap: 5 },
  hubEmoji: { fontSize: 36 },
  hubName: { fontSize: 14, fontWeight: '800' },
  hubNameUr: { color: 'rgba(255,255,255,0.75)', fontSize: 11 },
  hubApps: { color: 'rgba(255,255,255,0.55)', fontSize: 9, textAlign: 'center', marginTop: 4 },

  // DOWNLOAD
  downloadGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, justifyContent: 'center', marginBottom: 32 },
  downloadCard: { width: isWeb ? 300 : SW - 40, borderRadius: 20, borderWidth: 1, overflow: 'hidden', padding: 20, alignItems: 'center', gap: 10 },
  downloadTitle: { fontSize: 16, fontWeight: '900', textAlign: 'center' },
  downloadTitleUr: { color: 'rgba(255,255,255,0.7)', fontSize: 11, textAlign: 'center' },
  downloadDesc: { color: 'rgba(255,255,255,0.7)', fontSize: 12, lineHeight: 20, textAlign: 'center' },

  // QR Section
  qrSection: { flexDirection: isWeb ? 'row' : 'column', borderWidth: 1, borderRadius: 20, overflow: 'hidden', padding: 24, gap: 24, alignItems: 'center' },
  qrLeft: { flex: 1 },
  qrTitle: { color: '#fff', fontSize: 16, fontWeight: '800', marginBottom: 6 },
  qrTitleUr: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginBottom: 12 },
  qrDesc: { color: 'rgba(255,255,255,0.65)', fontSize: 12, lineHeight: 20 },
  qrBox: { alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
  qrLabel: { color: '#fff', fontSize: 12, fontWeight: '700', marginTop: 8 },
  qrSubLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 10, marginTop: 3 },

  // TECH
  techGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' },
  techCard: { width: isWeb ? 220 : (SW - 52) / 2, borderRadius: 14, borderWidth: 1, overflow: 'hidden', padding: 14, gap: 5 },
  techLabel: { fontSize: 13, fontWeight: '800' },
  techDesc: { color: 'rgba(255,255,255,0.6)', fontSize: 10, lineHeight: 15 },

  // ABOUT
  aboutCard: { borderRadius: 20, borderWidth: 1, overflow: 'hidden', padding: 24, gap: 12 },
  aboutText: { color: 'rgba(255,255,255,0.8)', fontSize: 14, lineHeight: 24 },
  aboutTextUr: { color: 'rgba(255,255,255,0.7)', fontSize: 13, lineHeight: 22, textAlign: 'right' },
  aboutDomain: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  aboutDomainText: { color: '#FFD700', fontSize: 14, fontWeight: '700' },

  // FOOTER
  footer: { paddingTop: 0 },
  footerInner: { flexDirection: isWeb ? 'row' : 'column', gap: 36, padding: 40, alignSelf: 'center', width: '100%' },
  footerBrand: { flex: 1, flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  footerTitle: { color: '#fff', fontSize: 15, fontWeight: '900', textShadowColor: '#DA70D6', textShadowRadius: 8 },
  footerTitleUr: { color: 'rgba(255,255,255,0.75)', fontSize: 12, marginTop: 2 },
  footerDomain: { color: '#00E5FF', fontSize: 11, fontWeight: '600', marginTop: 4 },
  footerLinks: { gap: 6 },
  footerLinksTitle: { color: '#fff', fontSize: 12, fontWeight: '800', marginBottom: 8 },
  footerLink: { color: 'rgba(255,255,255,0.6)', fontSize: 11 },
  footerBottom: { alignItems: 'center', padding: 20, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', gap: 4 },
  footerBottomText: { color: 'rgba(255,255,255,0.5)', fontSize: 11, textAlign: 'center' },
  footerBottomSub: { color: 'rgba(255,255,255,0.35)', fontSize: 10 },
});
