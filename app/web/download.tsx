import React, { useState } from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet, Dimensions, Linking, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SW } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';
const MAX_W = Math.min(SW, 900);

const APP_VERSION = '2.0.0';
const BUILD_DATE = 'June 2025';

const CHANGELOG = [
  {
    version: '2.0.0', date: 'June 2025', label: 'Latest | تازہ ترین',
    color: '#00FF88',
    changes: [
      'Added 16 glassmorphism themes (10 light + 16 dark)',
      'PiP draggable floating video player with Reanimated',
      'Full bookmark manager with folder organization',
      'Download manager with file type filters',
      'Incognito / private browsing mode',
      'Multi-tab browser with tab switcher',
      'Browser history manager with search',
      'Reading mode with JS article extraction',
      'Admin: app grid editor, icon library, theme creator',
      'Gallery/files manager integration in Admin',
      'New download page and website (SWO.EvESmArTBrOwSeR/drirfan)',
    ],
    changesUr: [
      '۱۶ شیشہ دار تھیمز شامل کیے',
      'پی آئی پی ڈریگ ایبل ویڈیو پلیئر',
      'بک مارک مینیجر فولڈرز کے ساتھ',
      'ڈاؤنلوڈ مینیجر فائل قسم فلٹرز کے ساتھ',
      'انکوگنیٹو / نجی براؤزنگ موڈ',
      'ملٹی ٹیب براؤزر',
      'ہسٹری مینیجر سرچ کے ساتھ',
      'ریڈنگ موڈ',
      'ایڈمن: ایپ گرڈ ایڈیٹر، آئیکن لائبریری',
    ],
  },
  {
    version: '1.0.0', date: 'May 2025', label: 'Initial Release | پہلا اجرا',
    color: '#7B68EE',
    changes: [
      'Initial release with 10 luminous themes',
      'Google Search + WebView browser engine',
      'Islamic, News, AI, Social, General hubs',
      '7 animated ticker strips',
      'VPN toggle + Ad Blocker injection',
      'Password-protected Admin Panel',
      'Arabic/Urdu/English multilingual header',
      'Rotating ESB logo + digital clock',
      'Historical personalities bar',
    ],
    changesUr: [
      '۱۰ روشن تھیمز کے ساتھ پہلا اجرا',
      'گوگل سرچ + ویب ویو براؤزر',
      'اسلامک، نیوز، اے آئی، سوشل، جنرل ہبز',
      '۷ متحرک ٹیکر پٹیاں',
      'وی پی این + ایڈ بلاکر',
    ],
  },
];

const REQUIREMENTS = [
  { icon: 'android', label: 'Android 8.0+', labelUr: 'اینڈرائیڈ ۸.۰ یا اوپر', ok: true, color: '#00FF88' },
  { icon: 'apple', label: 'iOS 14.0+', labelUr: 'آئی او ایس ۱۴.۰ یا اوپر', ok: true, color: '#AAAAAA' },
  { icon: 'memory', label: '2 GB RAM min', labelUr: '۲ جی بی ریم کم از کم', ok: true, color: '#00B4D8' },
  { icon: 'storage', label: '80 MB Storage', labelUr: '۸۰ ایم بی اسٹوریج', ok: true, color: '#FFD700' },
  { icon: 'wifi', label: 'Internet Required', labelUr: 'انٹرنیٹ ضروری', ok: true, color: '#FF9800' },
  { icon: 'language', label: 'Any Browser (Web)', labelUr: 'ویب کے لیے کوئی بھی براؤزر', ok: true, color: '#DA70D6' },
];

const INSTALL_STEPS = [
  {
    num: '1', title: 'Download APK', titleUr: 'اے پی کے ڈاؤنلوڈ کریں',
    desc: 'Click the "Download APK" button below to get the latest release APK file.',
    descUr: 'سب سے نیچے "ڈاؤنلوڈ اے پی کے" بٹن دبائیں۔',
    icon: 'download', color: '#00FF88',
  },
  {
    num: '2', title: 'Allow Unknown Sources', titleUr: 'نامعلوم ذرائع کی اجازت دیں',
    desc: 'Go to Settings → Security → Enable "Install from Unknown Sources" (Android).',
    descUr: 'ترتیبات → سیکیورٹی → نامعلوم ذرائع سے انسٹال کریں فعال کریں۔',
    icon: 'security', color: '#FF9800',
  },
  {
    num: '3', title: 'Install APK', titleUr: 'اے پی کے انسٹال کریں',
    desc: 'Open the downloaded APK file in your file manager and tap "Install".',
    descUr: 'ڈاؤنلوڈ شدہ اے پی کے فائل فائل مینیجر میں کھولیں اور انسٹال دبائیں۔',
    icon: 'install-mobile', color: '#7B68EE',
  },
  {
    num: '4', title: 'Launch & Enjoy', titleUr: 'شروع کریں اور لطف اٹھائیں',
    desc: 'Open EvEr SmArT BrOwSeR and explore all features. Default admin password: Ask admin.',
    descUr: 'ایور سمارٹ براؤزر کھولیں اور تمام فیچرز استعمال کریں۔',
    icon: 'rocket-launch', color: '#DD2476',
  },
];

function StepCard({ step }: { item?: any; step: typeof INSTALL_STEPS[0] }) {
  return (
    <View style={[styles.stepCard, { borderColor: step.color + '55' }]}>
      <LinearGradient colors={[step.color + '18', 'transparent']} style={StyleSheet.absoluteFillObject} />
      <View style={[styles.stepNum, { backgroundColor: step.color + '33', borderColor: step.color }]}>
        <Text style={[styles.stepNumText, { color: step.color }]}>{step.num}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.stepTitle, { color: step.color }]}>{step.title}</Text>
        <Text style={styles.stepTitleUr}>{step.titleUr}</Text>
        <Text style={styles.stepDesc}>{step.desc}</Text>
        <Text style={styles.stepDescUr}>{step.descUr}</Text>
      </View>
      <MaterialIcons name={step.icon as any} size={28} color={step.color + '88'} />
    </View>
  );
}

export default function DownloadPage() {
  const [activeMethod, setActiveMethod] = useState<'apk' | 'expo' | 'source'>('apk');

  const handleDownload = () => {
    Linking.openURL('https://expo.dev/accounts/onspace/projects/ever-smart-browser/builds');
  };
  const handleExpo = () => {
    Linking.openURL('https://expo.dev/go');
  };
  const handleGitHub = () => {
    Linking.openURL('https://github.com');
  };
  const handleBack = () => {
    // Navigate back to main website
    Linking.openURL('/');
  };

  return (
    <ScrollView style={styles.root} showsVerticalScrollIndicator={false}>
      <StatusBar style="light" />

      {/* TOP TICKER */}
      <LinearGradient colors={['#8B0000', '#DC143C']} style={styles.ticker}>
        <Text style={styles.tickerText}>
          📱 EvEr SmArT BrOwSeR v{APP_VERSION} — Download Now | ابھی ڈاؤنلوڈ کریں 📱
        </Text>
      </LinearGradient>

      {/* NAV */}
      <LinearGradient colors={['rgba(8,0,20,0.97)', 'rgba(15,0,40,0.97)']} style={styles.nav}>
        <Pressable onPress={handleBack} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={20} color="#fff" />
          <Text style={styles.backText}>Back | واپس</Text>
        </Pressable>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Image source={require('@/assets/images/esb-logo.png')} style={styles.navLogo} contentFit="contain" />
          <Text style={styles.navTitle}>Download | ڈاؤنلوڈ</Text>
        </View>
        <View style={[styles.versionBadge, { backgroundColor: '#00FF8833', borderColor: '#00FF88' }]}>
          <Text style={styles.versionText}>v{APP_VERSION}</Text>
        </View>
      </LinearGradient>

      {/* HERO */}
      <LinearGradient colors={['#050010', '#0D0030', '#150050']} style={styles.hero}>
        <View style={[styles.orb, { backgroundColor: '#8B00FF33', top: 20, left: '5%', width: 200, height: 200 }]} />
        <View style={[styles.orb, { backgroundColor: '#00FF8822', bottom: 20, right: '10%', width: 150, height: 150 }]} />

        <Image source={require('@/assets/images/esb-logo.png')} style={styles.heroLogo} contentFit="contain" />
        <Text style={styles.heroTitle}>✨ EvEr SmArT BrOwSeR ✨</Text>
        <Text style={styles.heroVersion}>Version {APP_VERSION} — {BUILD_DATE} | {BUILD_DATE}</Text>
        <Text style={styles.heroDomain}>🌐 SWO.EvESmArTBrOwSeR/drirfan</Text>

        <View style={styles.heroBtns}>
          <Pressable onPress={handleDownload} style={({ pressed }) => [styles.mainDlBtn, pressed && { opacity: 0.85 }]}>
            <LinearGradient colors={['#DD2476', '#FF512F']} style={StyleSheet.absoluteFillObject} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />
            <MaterialIcons name="download" size={22} color="#fff" />
            <View>
              <Text style={styles.mainDlBtnText}>Download APK</Text>
              <Text style={styles.mainDlBtnSub}>Android • Free • v{APP_VERSION}</Text>
            </View>
          </Pressable>
          <Pressable onPress={handleExpo} style={({ pressed }) => [styles.expoBtn, pressed && { opacity: 0.85 }]}>
            <LinearGradient colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.05)']} style={StyleSheet.absoluteFillObject} />
            <MaterialIcons name="phone-iphone" size={20} color="#fff" />
            <Text style={styles.expoBtnText}>Expo Go Preview</Text>
          </Pressable>
        </View>

        {/* Size info */}
        <View style={styles.sizeInfo}>
          {[
            { icon: 'storage', label: '~75 MB', sub: 'APK Size' },
            { icon: 'update', label: 'June 2025', sub: 'Last Updated' },
            { icon: 'star', label: '5.0 ★', sub: 'Rating' },
          ].map(s => (
            <View key={s.label} style={styles.sizeItem}>
              <MaterialIcons name={s.icon as any} size={16} color="rgba(255,255,255,0.6)" />
              <Text style={styles.sizeVal}>{s.label}</Text>
              <Text style={styles.sizeSub}>{s.sub}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      <View style={[styles.content, { maxWidth: MAX_W, alignSelf: 'center', width: '100%' }]}>

        {/* METHOD TABS */}
        <View style={styles.methodTabs}>
          {[
            { id: 'apk', label: 'Android APK', icon: 'android' },
            { id: 'expo', label: 'Expo Go', icon: 'phone-android' },
            { id: 'source', label: 'Source Code', icon: 'code' },
          ].map(m => (
            <Pressable
              key={m.id}
              onPress={() => setActiveMethod(m.id as any)}
              style={[styles.methodTab, activeMethod === m.id && styles.methodTabActive]}
            >
              <LinearGradient
                colors={activeMethod === m.id ? ['#DD2476', '#FF512F'] : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.03)']}
                style={StyleSheet.absoluteFillObject}
              />
              <MaterialIcons name={m.icon as any} size={16} color="#fff" />
              <Text style={styles.methodTabText}>{m.label}</Text>
            </Pressable>
          ))}
        </View>

        {/* METHOD DETAILS */}
        <View style={styles.methodDetail}>
          <LinearGradient colors={['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.02)']} style={StyleSheet.absoluteFillObject} />
          {activeMethod === 'apk' && (
            <View style={{ gap: 16 }}>
              <Text style={styles.methodTitle}>📱 Android APK Installation</Text>
              <Text style={styles.methodTitleUr}>اینڈرائیڈ اے پی کے انسٹالیشن</Text>
              <Text style={styles.methodDesc}>
                The APK (Android Package) allows you to install EvEr SmArT BrOwSeR directly on any
                Android device. This is the recommended method for permanent installation.
              </Text>
              <Pressable onPress={handleDownload} style={styles.methodDlBtn}>
                <LinearGradient colors={['#11998e', '#38ef7d']} style={StyleSheet.absoluteFillObject} />
                <MaterialIcons name="download" size={20} color="#fff" />
                <Text style={styles.methodDlBtnText}>Download APK v{APP_VERSION}</Text>
              </Pressable>
              <View style={[styles.warningBox, { borderColor: '#FF980055' }]}>
                <LinearGradient colors={['rgba(255,152,0,0.12)', 'transparent']} style={StyleSheet.absoluteFillObject} />
                <MaterialIcons name="info" size={18} color="#FF9800" />
                <Text style={styles.warningText}>
                  Enable "Install from Unknown Sources" in Android Settings before installing.
                  {'\n'}انسٹال کرنے سے پہلے "نامعلوم ذرائع سے انسٹال" آن کریں۔
                </Text>
              </View>
            </View>
          )}
          {activeMethod === 'expo' && (
            <View style={{ gap: 16 }}>
              <Text style={styles.methodTitle}>🚀 Expo Go — Instant Preview</Text>
              <Text style={styles.methodTitleUr}>ایکسپو گو — فوری پریویو</Text>
              <Text style={styles.methodDesc}>
                The fastest way to try EvEr SmArT BrOwSeR without any installation. Works on
                Android and iOS. Download Expo Go and scan the QR code to launch instantly.
              </Text>
              <Pressable onPress={handleExpo} style={styles.methodDlBtn}>
                <LinearGradient colors={['#7B68EE', '#9370DB']} style={StyleSheet.absoluteFillObject} />
                <MaterialIcons name="download" size={20} color="#fff" />
                <Text style={styles.methodDlBtnText}>Get Expo Go App</Text>
              </Pressable>
              <View style={styles.qrPlaceholder}>
                <LinearGradient colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.03)']} style={StyleSheet.absoluteFillObject} />
                <MaterialIcons name="qr-code-2" size={90} color="rgba(255,255,255,0.7)" />
                <Text style={styles.qrTitle}>Scan QR with Expo Go</Text>
                <Text style={styles.qrSub}>Available after OnSpace Publish | پبلش کے بعد دستیاب</Text>
              </View>
            </View>
          )}
          {activeMethod === 'source' && (
            <View style={{ gap: 16 }}>
              <Text style={styles.methodTitle}>💻 Build from Source Code</Text>
              <Text style={styles.methodTitleUr}>سورس کوڈ سے بنائیں</Text>
              <View style={styles.codeBlock}>
                {[
                  '# Clone / extract the project',
                  'cd ever-smart-browser',
                  '',
                  '# Install dependencies',
                  'npm install',
                  '',
                  '# Start development',
                  'npx expo start',
                  '',
                  '# Build Android APK',
                  'eas build --platform android --profile preview',
                ].map((line, i) => (
                  <Text key={i} style={[styles.codeLine, line.startsWith('#') && { color: '#6EF083' }]}>
                    {line || ' '}
                  </Text>
                ))}
              </View>
              <Pressable onPress={handleGitHub} style={styles.methodDlBtn}>
                <LinearGradient colors={['#333', '#555']} style={StyleSheet.absoluteFillObject} />
                <Ionicons name="logo-github" size={20} color="#fff" />
                <Text style={styles.methodDlBtnText}>View on GitHub</Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* INSTALL STEPS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 Installation Steps | انسٹالیشن مراحل</Text>
          <Text style={styles.sectionTitleUr}>Step-by-Step Guide | قدم بہ قدم گائیڈ</Text>
          <View style={{ gap: 10 }}>
            {INSTALL_STEPS.map(step => <StepCard key={step.num} step={step} />)}
          </View>
        </View>

        {/* SCREENSHOTS PLACEHOLDER */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📸 App Screenshots | ایپ اسکرین شاٹس</Text>
          <Text style={styles.sectionTitleUr}>Visual Preview | بصری پریویو</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingBottom: 8 }}>
            {[
              { label: 'Home Screen', labelUr: 'مرکزی صفحہ', color: '#DD2476' },
              { label: 'Browser', labelUr: 'براؤزر', color: '#7B68EE' },
              { label: 'Islamic Hub', labelUr: 'اسلامک ہب', color: '#27AE60' },
              { label: 'Dark Theme', labelUr: 'تاریک تھیم', color: '#333' },
              { label: 'Admin Panel', labelUr: 'ایڈمن پینل', color: '#E040FB' },
            ].map(s => (
              <View key={s.label} style={[styles.screenshotCard, { borderColor: s.color + '66' }]}>
                <LinearGradient colors={[s.color + '30', s.color + '10']} style={StyleSheet.absoluteFillObject} />
                <MaterialIcons name="screenshot-monitor" size={40} color={s.color + 'CC'} />
                <Text style={[styles.screenshotLabel, { color: s.color }]}>{s.label}</Text>
                <Text style={styles.screenshotLabelUr}>{s.labelUr}</Text>
                <Text style={styles.screenshotComingSoon}>Coming Soon</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* DEVICE COMPATIBILITY */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📱 Device Compatibility | ڈیوائس مطابقت</Text>
          <Text style={styles.sectionTitleUr}>Minimum Requirements | کم از کم ضروریات</Text>
          <View style={styles.reqGrid}>
            {REQUIREMENTS.map(r => (
              <View key={r.label} style={[styles.reqCard, { borderColor: r.color + '44' }]}>
                <LinearGradient colors={[r.color + '18', 'transparent']} style={StyleSheet.absoluteFillObject} />
                <MaterialIcons name={r.icon as any} size={24} color={r.color} />
                <Text style={[styles.reqLabel, { color: r.color }]}>{r.label}</Text>
                <Text style={styles.reqLabelUr}>{r.labelUr}</Text>
                <View style={[styles.reqStatus, { backgroundColor: r.ok ? '#00FF8825' : '#FF555525', borderColor: r.ok ? '#00FF88' : '#FF5555' }]}>
                  <MaterialIcons name={r.ok ? 'check' : 'close'} size={12} color={r.ok ? '#00FF88' : '#FF5555'} />
                  <Text style={[styles.reqStatusText, { color: r.ok ? '#00FF88' : '#FF5555' }]}>
                    {r.ok ? 'Supported' : 'Not Supported'}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* CHANGELOG */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 Version Changelog | تبدیلیوں کی تاریخ</Text>
          {CHANGELOG.map(v => (
            <View key={v.version} style={[styles.changeCard, { borderColor: v.color + '44' }]}>
              <LinearGradient colors={[v.color + '15', 'transparent']} style={StyleSheet.absoluteFillObject} />
              <View style={styles.changeHeader}>
                <View style={[styles.versionBadge2, { backgroundColor: v.color + '30', borderColor: v.color }]}>
                  <Text style={[styles.versionBadgeText, { color: v.color }]}>v{v.version}</Text>
                </View>
                <View>
                  <Text style={styles.changeDate}>{v.date}</Text>
                  <Text style={[styles.changeLabel, { color: v.color }]}>{v.label}</Text>
                </View>
              </View>
              <View style={styles.changeList}>
                {v.changes.map((c, i) => (
                  <View key={i} style={styles.changeItem}>
                    <View style={[styles.changeDot, { backgroundColor: v.color }]} />
                    <Text style={styles.changeText}>{c}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* FINAL CTA */}
        <Pressable onPress={handleDownload} style={styles.finalCta}>
          <LinearGradient colors={['#DD2476', '#FF512F', '#f5af19']} style={StyleSheet.absoluteFillObject} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />
          <MaterialIcons name="download" size={28} color="#fff" />
          <View>
            <Text style={styles.finalCtaTitle}>Download EvEr SmArT BrOwSeR Now</Text>
            <Text style={styles.finalCtaUr}>ابھی ایور سمارٹ براؤزر ڈاؤنلوڈ کریں</Text>
          </View>
        </Pressable>
      </View>

      {/* FOOTER */}
      <LinearGradient colors={['#050008', '#000005']} style={styles.footer}>
        <Text style={styles.footerText}>© 2025 EvEr SmArT BrOwSeR | SWO.EvESmArTBrOwSeR/drirfan</Text>
        <Text style={styles.footerTextUr}>© ۲۰۲۵ ایور سمارٹ براؤزر | تمام حقوق محفوظ</Text>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#050008' },
  ticker: { height: 26, justifyContent: 'center', alignItems: 'center' },
  tickerText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  nav: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, gap: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  backText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  navLogo: { width: 28, height: 28 },
  navTitle: { color: '#fff', fontSize: 15, fontWeight: '800', flex: 1 },
  versionBadge: { borderRadius: 12, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 3 },
  versionText: { color: '#00FF88', fontSize: 11, fontWeight: '700' },
  hero: { paddingVertical: 48, paddingHorizontal: 20, alignItems: 'center', overflow: 'hidden', gap: 10 },
  orb: { position: 'absolute', borderRadius: 999 },
  heroLogo: { width: 90, height: 90, marginBottom: 6 },
  heroTitle: { color: '#fff', fontSize: 26, fontWeight: '900', textAlign: 'center', textShadowColor: '#DA70D6', textShadowRadius: 12 },
  heroVersion: { color: 'rgba(255,255,255,0.7)', fontSize: 12, textAlign: 'center' },
  heroDomain: { color: '#00E5FF', fontSize: 13, fontWeight: '700' },
  heroBtns: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginTop: 10 },
  mainDlBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 50, overflow: 'hidden', paddingVertical: 14, paddingHorizontal: 22 },
  mainDlBtnText: { color: '#fff', fontSize: 15, fontWeight: '900' },
  mainDlBtnSub: { color: 'rgba(255,255,255,0.75)', fontSize: 10 },
  expoBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 50, overflow: 'hidden', paddingVertical: 14, paddingHorizontal: 20, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.3)' },
  expoBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  sizeInfo: { flexDirection: 'row', gap: 24, marginTop: 10 },
  sizeItem: { alignItems: 'center', gap: 3 },
  sizeVal: { color: '#fff', fontSize: 13, fontWeight: '700' },
  sizeSub: { color: 'rgba(255,255,255,0.5)', fontSize: 9 },
  content: { padding: 16, gap: 24 },
  methodTabs: { flexDirection: 'row', gap: 8, borderRadius: 14, overflow: 'hidden' },
  methodTab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: 12, overflow: 'hidden', paddingVertical: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  methodTabActive: { borderColor: 'rgba(255,255,255,0.4)' },
  methodTabText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  methodDetail: { borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', overflow: 'hidden', padding: 18 },
  methodTitle: { color: '#fff', fontSize: 16, fontWeight: '900' },
  methodTitleUr: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginBottom: 4 },
  methodDesc: { color: 'rgba(255,255,255,0.75)', fontSize: 13, lineHeight: 22 },
  methodDlBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, borderRadius: 12, overflow: 'hidden', paddingVertical: 13 },
  methodDlBtnText: { color: '#fff', fontSize: 14, fontWeight: '800' },
  warningBox: { flexDirection: 'row', gap: 10, borderRadius: 12, borderWidth: 1, overflow: 'hidden', padding: 12 },
  warningText: { color: 'rgba(255,255,255,0.8)', fontSize: 12, lineHeight: 18, flex: 1 },
  qrPlaceholder: { borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', overflow: 'hidden', padding: 24, alignItems: 'center', gap: 8 },
  qrTitle: { color: '#fff', fontSize: 14, fontWeight: '700' },
  qrSub: { color: 'rgba(255,255,255,0.5)', fontSize: 11, textAlign: 'center' },
  codeBlock: { backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', gap: 2 },
  codeLine: { color: '#AADDFF', fontSize: 11, fontFamily: 'monospace' },
  section: { gap: 12 },
  sectionTitle: { color: '#fff', fontSize: 16, fontWeight: '900' },
  sectionTitleUr: { color: 'rgba(255,255,255,0.65)', fontSize: 12, marginBottom: 4 },
  stepCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, borderRadius: 14, borderWidth: 1, overflow: 'hidden', padding: 14 },
  stepNum: { width: 38, height: 38, borderRadius: 19, borderWidth: 2, justifyContent: 'center', alignItems: 'center' },
  stepNumText: { fontSize: 16, fontWeight: '900' },
  stepTitle: { fontSize: 14, fontWeight: '800' },
  stepTitleUr: { color: 'rgba(255,255,255,0.7)', fontSize: 11, marginBottom: 4 },
  stepDesc: { color: 'rgba(255,255,255,0.75)', fontSize: 12, lineHeight: 18 },
  stepDescUr: { color: 'rgba(255,255,255,0.55)', fontSize: 10, marginTop: 3 },
  screenshotCard: { width: 140, borderRadius: 14, borderWidth: 1, overflow: 'hidden', padding: 16, alignItems: 'center', gap: 6, aspectRatio: 9 / 16 },
  screenshotLabel: { fontSize: 11, fontWeight: '800', textAlign: 'center' },
  screenshotLabelUr: { color: 'rgba(255,255,255,0.6)', fontSize: 9, textAlign: 'center' },
  screenshotComingSoon: { color: 'rgba(255,255,255,0.35)', fontSize: 8, marginTop: 'auto' },
  reqGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  reqCard: { width: (SW - 44) / 2, borderRadius: 14, borderWidth: 1, overflow: 'hidden', padding: 14, gap: 5 },
  reqLabel: { fontSize: 13, fontWeight: '800' },
  reqLabelUr: { color: 'rgba(255,255,255,0.65)', fontSize: 10 },
  reqStatus: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 8, borderWidth: 1, paddingHorizontal: 7, paddingVertical: 3, alignSelf: 'flex-start', marginTop: 2 },
  reqStatusText: { fontSize: 9, fontWeight: '700' },
  changeCard: { borderRadius: 16, borderWidth: 1, overflow: 'hidden', padding: 16, gap: 12, marginBottom: 12 },
  changeHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  versionBadge2: { borderRadius: 12, borderWidth: 1.5, paddingHorizontal: 12, paddingVertical: 5 },
  versionBadgeText: { fontSize: 14, fontWeight: '900' },
  changeDate: { color: 'rgba(255,255,255,0.7)', fontSize: 11 },
  changeLabel: { fontSize: 12, fontWeight: '700' },
  changeList: { gap: 6 },
  changeItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  changeDot: { width: 6, height: 6, borderRadius: 3, marginTop: 5 },
  changeText: { color: 'rgba(255,255,255,0.8)', fontSize: 12, flex: 1, lineHeight: 18 },
  finalCta: { flexDirection: 'row', alignItems: 'center', gap: 14, borderRadius: 18, overflow: 'hidden', padding: 20, marginVertical: 8 },
  finalCtaTitle: { color: '#fff', fontSize: 15, fontWeight: '900' },
  finalCtaUr: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 2 },
  footer: { padding: 20, alignItems: 'center', gap: 4 },
  footerText: { color: 'rgba(255,255,255,0.5)', fontSize: 11, textAlign: 'center' },
  footerTextUr: { color: 'rgba(255,255,255,0.3)', fontSize: 10, textAlign: 'center' },
});
