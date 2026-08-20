import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, Pressable, StyleSheet, Modal, Alert, ScrollView,
  Linking, Platform, TextInput, Animated,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBrowserContext } from '@/contexts/BrowserContext';

interface ExportManagerProps { visible: boolean; onClose: () => void; }

const PLAY_STORE_DOCS = `# EvEr SmArT BrOwSeR — Google Play Store Submission Guide
## App Details
- App Name: EvEr SmArT BrOwSeR
- Package: com.drirfan.eversmartbrowser
- Developer: Dr. Irfan | dr.mirfann5577@gmail.com
- Version: 2.0.0
- Category: Tools / Browser
- Target SDK: 34 (Android 14)

## Build Commands
npm install -g eas-cli
eas login
eas build --platform android --profile preview        # APK
eas build --platform android --profile production     # AAB
eas submit --platform android --latest                # Play Store

## Required Permissions
INTERNET, CAMERA, READ_EXTERNAL_STORAGE, RECORD_AUDIO, VIBRATE
`;

const SOURCE_README = `# EvEr SmArT BrOwSeR — Source Code Package
## Tech Stack: React Native + Expo 52 + TypeScript
## Setup
npm install && npx expo start
## Build APK
eas build --platform android --profile preview
## Admin Password: Daood5577
`;

const GITHUB_GUIDE = `# EvEr SmArT BrOwSeR — GitHub Deployment Guide
# ایور سمارٹ براؤزر — گٹ ہب ڈیپلوئے گائیڈ

## Step 1 — Create GitHub Repository | گٹ ہب ریپوزٹری بنائیں
1. Go to: https://github.com/new
2. Repository name: EvErSmArTBrOwSeR
3. Description: Pakistan's Smartest Digital Browser | پاکستان کا بہترین ڈیجیٹل براؤزر
4. Visibility: Public (for free CI) or Private
5. Click "Create repository"

## Step 2 — Initialize Git & Push | گٹ شروع کریں
\`\`\`bash
# In your project folder:
git init
git add .
git commit -m "🚀 Initial commit — EvEr SmArT BrOwSeR v2.0.0"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/EvErSmArTBrOwSeR.git
git push -u origin main
\`\`\`

## Step 3 — Setup Expo EAS on GitHub | گٹ ہب پر EAS سیٹ اپ
1. Login at https://expo.dev → Create account if needed
2. Run: eas build:configure
3. Link your GitHub repo: eas github:link

## Step 4 — Auto Build on Push (GitHub Actions) | خودکار بلڈ
Create file: .github/workflows/eas-build.yml
\`\`\`yaml
name: EAS Build
on: push:
  branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with: {node-version: '18'}
      - run: npm install -g eas-cli
      - run: npm install
      - run: eas build --platform android --profile preview --non-interactive
        env:
          EXPO_TOKEN: \${{ secrets.EXPO_TOKEN }}
\`\`\`

## Step 5 — Add EXPO_TOKEN to GitHub Secrets
1. Go to: https://expo.dev/accounts/[username]/settings/access-tokens
2. Create new token → Copy it
3. GitHub repo → Settings → Secrets → New secret
4. Name: EXPO_TOKEN, Value: (paste token)

## Step 6 — Expo Go Preview Link
After linking GitHub repo, every push creates a preview:
- Visit: https://expo.dev/accounts/[username]/projects/EvErSmArTBrOwSeR
- Scan QR with Expo Go app on your Android/iOS device
- Share link: exp://u.expo.dev/[project-id]

## Step 7 — View Your Project
- GitHub Repo: https://github.com/YOUR_USERNAME/EvErSmArTBrOwSeR
- Expo Dashboard: https://expo.dev/accounts/[username]/projects
- EAS Builds: https://expo.dev/accounts/[username]/builds

## Quick Links | فوری لنکس
- GitHub: https://github.com
- Expo Dev: https://expo.dev
- EAS Build Docs: https://docs.expo.dev/build/introduction/
- Expo Go (Android): https://play.google.com/store/apps/details?id=host.exp.exponent
- Expo Go (iOS): https://apps.apple.com/app/expo-go/id982107779

## Contact
Developer: Dr. Irfan
Email: dr.mirfann5577@gmail.com
App: EvEr SmArT BrOwSeR v2.0.0
`;

export function ExportManager({ visible, onClose }: ExportManagerProps) {
  const { theme, bookmarks, downloads, history, passwords, notifications, installedApps,
    addBookmark, addHistory } = useBrowserContext();
  const insets = useSafeAreaInsets();
  const [exporting, setExporting] = useState<string | null>(null);
  const [restoring, setRestoring] = useState(false);
  const [tab, setTab] = useState<'export' | 'restore' | 'github' | 'deploy' | 'email' | 'sourcecode'>('export');
  const [emailInput, setEmailInput] = useState('dr.mirfann5577@gmail.com');
  const [emailSending, setEmailSending] = useState(false);

  // Animated glow
  const glowAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(glowAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
      Animated.timing(glowAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
    ])).start();
  }, []);

  const shareFile = async (path: string, mimeType: string, dialogTitle: string) => {
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(path, { mimeType, dialogTitle });
    } else {
      Alert.alert('Saved', path);
    }
  };

  const handleExportFullBackup = async () => {
    setExporting('backup');
    try {
      const backup = {
        __type: 'ESB_BACKUP', app: 'EvEr SmArT BrOwSeR', version: '2.0.0',
        exportedAt: new Date().toISOString(),
        data: { bookmarks, history: history.slice(0, 200), downloads, passwords, installedApps },
      };
      const path = `${FileSystem.documentDirectory}esb_backup_${Date.now()}.json`;
      await FileSystem.writeAsStringAsync(path, JSON.stringify(backup, null, 2));
      await shareFile(path, 'application/json', '📦 ESB Full Backup');
    } catch (e) { Alert.alert('Export Failed', String(e)); }
    setExporting(null);
  };

  const handleExportBookmarks = async () => {
    setExporting('bookmarks');
    try {
      const path = `${FileSystem.documentDirectory}esb_bookmarks.json`;
      await FileSystem.writeAsStringAsync(path, JSON.stringify({ __type: 'ESB_BOOKMARKS', bookmarks, exportedAt: new Date().toISOString() }, null, 2));
      await shareFile(path, 'application/json', '🔖 ESB Bookmarks');
    } catch (e) { Alert.alert('Export Failed', String(e)); }
    setExporting(null);
  };

  const handleExportGitHubGuide = async () => {
    setExporting('github');
    try {
      const path = `${FileSystem.documentDirectory}esb_github_deploy_guide.md`;
      await FileSystem.writeAsStringAsync(path, GITHUB_GUIDE);
      await shareFile(path, 'text/markdown', '🐙 GitHub Deploy Guide');
    } catch (e) { Alert.alert('Export Failed', String(e)); }
    setExporting(null);
  };

  const handleExportPlayStoreDocs = async () => {
    setExporting('playstore');
    try {
      const path = `${FileSystem.documentDirectory}esb_playstore_guide.md`;
      await FileSystem.writeAsStringAsync(path, PLAY_STORE_DOCS);
      await shareFile(path, 'text/markdown', '🏪 Play Store Guide');
    } catch (e) { Alert.alert('Export Failed', String(e)); }
    setExporting(null);
  };

  const handleRestore = async () => {
    setRestoring(true);
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: ['application/json', '*/*'], copyToCacheDirectory: true });
      if (result.canceled || !result.assets?.length) { setRestoring(false); return; }
      const rawContent = await FileSystem.readAsStringAsync(result.assets[0].uri);
      const parsed = JSON.parse(rawContent);
      if (!parsed.__type?.startsWith('ESB_')) {
        Alert.alert('Invalid File | غلط فائل', 'This is not a valid ESB backup file.');
        setRestoring(false); return;
      }
      let restored = 0;
      if (parsed.__type === 'ESB_BACKUP' && parsed.data) {
        parsed.data.bookmarks?.forEach((bm: any) => { try { addBookmark({ title: bm.title, url: bm.url, folder: bm.folder || 'All', favicon: bm.favicon }); restored++; } catch {} });
        parsed.data.history?.forEach((h: any) => { try { addHistory({ url: h.url, title: h.title || '', visitedAt: h.visitedAt || Date.now(), domain: h.domain || '' }); restored++; } catch {} });
      } else if (parsed.__type === 'ESB_BOOKMARKS') {
        parsed.bookmarks?.forEach((bm: any) => { try { addBookmark({ title: bm.title, url: bm.url, folder: bm.folder || 'All', favicon: bm.favicon }); restored++; } catch {} });
      }
      Alert.alert('Restore Complete ✅', `${restored} items restored | ${restored} آئٹمز بحال`);
    } catch (e) { Alert.alert('Restore Failed', String(e)); }
    setRestoring(false);
  };

  const handleEmailDeploy = async () => {
    const email = emailInput.trim();
    if (!email.includes('@')) { Alert.alert('Invalid Email', 'Please enter a valid email.'); return; }
    setEmailSending(true);
    try {
      const subject = encodeURIComponent('EvEr SmArT BrOwSeR — GitHub Deploy & APK Guide');
      const body = encodeURIComponent(
        `EvEr SmArT BrOwSeR v2.0.0 — Deployment Guide\n\n` +
        `GITHUB:\n1. git init && git add . && git commit -m "ESB v2"\n` +
        `2. git remote add origin https://github.com/YOUR/EvErSmArTBrOwSeR.git\n` +
        `3. git push -u origin main\n\n` +
        `APK BUILD:\n1. npm install -g eas-cli\n2. eas login\n` +
        `3. eas build --platform android --profile preview\n\n` +
        `EXPO GO: https://expo.dev/accounts/[username]/projects\n\n` +
        `Admin Password: Daood5577\nContact: dr.mirfann5577@gmail.com`
      );
      await Linking.openURL(`mailto:${email}?subject=${subject}&body=${body}`);
    } catch (e) { Alert.alert('Failed', String(e)); }
    setEmailSending(false);
  };

  const EXPORT_ITEMS = [
    { id: 'backup', icon: 'backup', color: '#00FF88', title: 'Full Backup | مکمل بیک اپ', subtitle: `${bookmarks.length} bookmarks + ${history.length} history`, onPress: handleExportFullBackup },
    { id: 'bookmarks', icon: 'bookmarks', color: '#FFD700', title: 'Export Bookmarks | بک مارکس', subtitle: `${bookmarks.length} bookmarks as JSON`, onPress: handleExportBookmarks },
    { id: 'github', icon: 'code', color: '#E040FB', title: '🐙 GitHub Deploy Guide', subtitle: 'Complete GitHub + Expo Go + EAS setup', onPress: handleExportGitHubGuide },
    { id: 'playstore', icon: 'shop', color: '#FF7043', title: 'Play Store Guide | پلے اسٹور', subtitle: 'Build, submit, ownership guide', onPress: handleExportPlayStoreDocs },
  ];

  const GITHUB_STEPS = [
    { num: '1', label: 'Create GitHub Repo', cmd: 'github.com/new → Name: EvErSmArTBrOwSeR', color: '#E040FB' },
    { num: '2', label: 'Initialize Git', cmd: 'git init && git add . && git commit -m "ESB v2"', color: '#00FF88' },
    { num: '3', label: 'Add Remote & Push', cmd: 'git remote add origin [URL] && git push -u origin main', color: '#00B4D8' },
    { num: '4', label: 'Link to Expo EAS', cmd: 'eas login && eas build:configure && eas github:link', color: '#FFD700' },
    { num: '5', label: 'Build APK Preview', cmd: 'eas build --platform android --profile preview', color: '#FF7043' },
    { num: '6', label: 'Get Expo Go Link', cmd: 'expo.dev/accounts/[user]/projects → Scan QR', color: '#4FC3F7' },
  ];

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <LinearGradient colors={[...theme.gradient]} style={StyleSheet.absoluteFillObject} />
        {/* Animated glow overlay */}
        <Animated.View style={[StyleSheet.absoluteFillObject, {
          opacity: glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.05] })
        }]}>
          <LinearGradient colors={[theme.glowColor, 'transparent']} style={StyleSheet.absoluteFillObject} />
        </Animated.View>

        <View style={styles.overlay}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.glassBorder }]}>
            <LinearGradient colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.06)']} style={StyleSheet.absoluteFillObject} />
            <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={8}>
              <MaterialIcons name="close" size={22} color="#fff" />
            </Pressable>
            <View style={{ flex: 1 }}>
              <Text style={[styles.headerTitle, { textShadowColor: theme.glowColor, textShadowRadius: 10 }]}>
                📦 Export, Backup & Deploy
              </Text>
              <Text style={styles.headerSub}>GitHub • Expo Go • Play Store • Backup | ایکسپورٹ</Text>
            </View>
          </View>

          {/* Tabs */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabRow}>
            {([
              { id: 'export', icon: 'upload', label: 'Export', color: '#00FF88' },
              { id: 'restore', icon: 'restore', label: 'Restore', color: '#FFD700' },
              { id: 'github', icon: 'code', label: '🐙 GitHub', color: '#E040FB' },
              { id: 'deploy', icon: 'rocket-launch', label: 'Deploy', color: '#FF7043' },
              { id: 'email', icon: 'email', label: 'Email', color: '#4FC3F7' },
            { id: 'sourcecode', icon: 'code', label: '💾 Source Code', color: '#00FF88' },
            ] as const).map(t => (
              <Pressable key={t.id} onPress={() => setTab(t.id)}
                style={[styles.tabBtn, {
                  backgroundColor: tab === t.id ? t.color + '25' : 'rgba(255,255,255,0.12)',
                  borderColor: tab === t.id ? t.color : 'rgba(255,255,255,0.2)',
                  shadowColor: tab === t.id ? t.color : 'transparent',
                  shadowOpacity: 0.7, shadowRadius: 6,
                }]}>
                <MaterialIcons name={t.icon as any} size={12} color={tab === t.id ? t.color : 'rgba(255,255,255,0.6)'} />
                <Text style={[styles.tabText, { color: tab === t.id ? t.color : 'rgba(255,255,255,0.6)' }]}>{t.label}</Text>
              </Pressable>
            ))}
          </ScrollView>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

            {/* ── EXPORT TAB ─────────────────────────────── */}
            {tab === 'export' && (
              <>
                <Text style={styles.sectionTitle}>📤 Export Options | ایکسپورٹ</Text>
                {EXPORT_ITEMS.map(exp => (
                  <Pressable key={exp.id} onPress={exp.onPress} disabled={exporting === exp.id}
                    style={({ pressed }) => [styles.exportCard, { borderColor: exp.color + '55', opacity: pressed ? 0.8 : 1 }]}>
                    <LinearGradient colors={[exp.color + '15', 'transparent']} style={StyleSheet.absoluteFillObject} />
                    <View style={[styles.exportIcon, { backgroundColor: exp.color + '25' }]}>
                      {exporting === exp.id
                        ? <MaterialIcons name="hourglass-empty" size={22} color={exp.color} />
                        : <MaterialIcons name={exp.icon as any} size={22} color={exp.color} />}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.exportTitle, { color: exp.color }]}>{exp.title}</Text>
                      <Text style={styles.exportSub}>{exp.subtitle}</Text>
                    </View>
                    <MaterialIcons name="share" size={16} color={exp.color + '88'} />
                  </Pressable>
                ))}
                {/* Data summary */}
                <View style={styles.statsGrid}>
                  {[
                    { label: 'Bookmarks', val: bookmarks.length, color: '#FFD700' },
                    { label: 'History', val: history.length, color: '#AB47BC' },
                    { label: 'Downloads', val: downloads.length, color: '#00DCFF' },
                    { label: 'Passwords', val: passwords.length, color: '#00FF88' },
                  ].map(s => (
                    <View key={s.label} style={[styles.statCard, { borderColor: s.color + '44' }]}>
                      <LinearGradient colors={[s.color + '15', 'transparent']} style={StyleSheet.absoluteFillObject} />
                      <Text style={[styles.statNum, { color: s.color }]}>{s.val}</Text>
                      <Text style={styles.statLabel}>{s.label}</Text>
                    </View>
                  ))}
                </View>
              </>
            )}

            {/* ── RESTORE TAB ────────────────────────────── */}
            {tab === 'restore' && (
              <>
                <Text style={styles.sectionTitle}>🔄 Restore from Backup | بیک اپ سے بحال</Text>
                <View style={[styles.infoBox, { borderColor: '#FFD70044' }]}>
                  <LinearGradient colors={['rgba(255,215,0,0.08)', 'transparent']} style={StyleSheet.absoluteFillObject} />
                  <MaterialIcons name="warning" size={16} color="#FFD700" />
                  <Text style={styles.infoBoxText}>Restore MERGES with existing data — nothing deleted. | بحالی موجودہ ڈیٹا کو حذف نہیں کرتی۔</Text>
                </View>
                <View style={[styles.restoreCard, { borderColor: theme.glassBorder }]}>
                  <LinearGradient colors={['rgba(255,255,255,0.12)', 'rgba(255,255,255,0.03)']} style={StyleSheet.absoluteFillObject} />
                  <Animated.View style={{ opacity: glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }) }}>
                    <MaterialIcons name="folder-open" size={52} color={theme.glowColor} />
                  </Animated.View>
                  <Text style={styles.restoreTitle}>Select Backup File | بیک اپ فائل منتخب کریں</Text>
                  <Text style={styles.restoreSub}>Pick any ESB JSON backup from device, WhatsApp, Drive, or email.{'\n'}ESB JSON بیک اپ فائل منتخب کریں۔</Text>
                  <Pressable onPress={handleRestore} disabled={restoring}
                    style={[styles.restoreBtn, { backgroundColor: restoring ? 'rgba(255,255,255,0.2)' : theme.primary }]}>
                    <MaterialIcons name={restoring ? 'hourglass-empty' : 'restore'} size={20} color="#fff" />
                    <Text style={styles.restoreBtnText}>{restoring ? 'Processing...' : 'Pick File & Restore | فائل منتخب'}</Text>
                  </Pressable>
                </View>
              </>
            )}

            {/* ── GITHUB TAB ─────────────────────────────── */}
            {tab === 'github' && (
              <>
                <Text style={styles.sectionTitle}>🐙 GitHub + Expo Go Deploy | گٹ ہب ڈیپلوئے</Text>
                <View style={[styles.infoBox, { borderColor: '#E040FB44' }]}>
                  <LinearGradient colors={['rgba(224,64,251,0.1)', 'transparent']} style={StyleSheet.absoluteFillObject} />
                  <MaterialIcons name="info" size={16} color="#E040FB" />
                  <Text style={[styles.infoBoxText, { color: 'rgba(255,255,255,0.85)' }]}>
                    Push to GitHub → Auto-build APK via EAS → Preview on Expo Go app with QR scan.{'\n\n'}
                    گٹ ہب پر پش کریں → EAS سے APK بنائیں → Expo Go سے QR اسکین کریں۔
                  </Text>
                </View>

                {GITHUB_STEPS.map(step => (
                  <View key={step.num} style={[styles.buildStep, { borderColor: step.color + '33' }]}>
                    <LinearGradient colors={[step.color + '12', 'transparent']} style={StyleSheet.absoluteFillObject} />
                    <View style={[styles.stepNum, { backgroundColor: step.color + '22', borderColor: step.color }]}>
                      <Text style={[styles.stepNumText, { color: step.color }]}>{step.num}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.stepLabel}>{step.label}</Text>
                      <View style={styles.codeBox}>
                        <Text style={styles.codeText} selectable>{step.cmd}</Text>
                      </View>
                    </View>
                  </View>
                ))}

                <View style={styles.quickLinks}>
                  <Text style={styles.sectionTitle}>🔗 Quick Links | فوری لنکس</Text>
                  {[
                    { label: '🐙 GitHub', url: 'https://github.com/new', color: '#E040FB' },
                    { label: '⚡ Expo Dev', url: 'https://expo.dev', color: '#00B4D8' },
                    { label: '📦 EAS Builds', url: 'https://expo.dev/accounts/onspace/projects', color: '#FFD700' },
                    { label: '📱 Expo Go (Android)', url: 'https://play.google.com/store/apps/details?id=host.exp.exponent', color: '#00FF88' },
                    { label: '🍎 Expo Go (iOS)', url: 'https://apps.apple.com/app/expo-go/id982107779', color: '#4FC3F7' },
                    { label: '📚 EAS Docs', url: 'https://docs.expo.dev/build/introduction/', color: '#FF9800' },
                  ].map(link => (
                    <Pressable key={link.url} onPress={() => Linking.openURL(link.url)}
                      style={[styles.linkBtn, { borderColor: link.color + '55' }]}>
                      <LinearGradient colors={[link.color + '15', 'transparent']} style={StyleSheet.absoluteFillObject} />
                      <Text style={[styles.linkBtnText, { color: link.color }]}>{link.label}</Text>
                      <MaterialIcons name="open-in-new" size={14} color={link.color + '88'} />
                    </Pressable>
                  ))}
                </View>

                <Pressable onPress={handleExportGitHubGuide}
                  style={[styles.exportCard, { borderColor: '#E040FB55' }]}>
                  <LinearGradient colors={['rgba(224,64,251,0.15)', 'transparent']} style={StyleSheet.absoluteFillObject} />
                  <View style={[styles.exportIcon, { backgroundColor: 'rgba(224,64,251,0.25)' }]}>
                    <MaterialIcons name="download" size={22} color="#E040FB" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.exportTitle, { color: '#E040FB' }]}>Download Full GitHub Guide</Text>
                    <Text style={styles.exportSub}>Complete step-by-step Markdown guide + GitHub Actions config</Text>
                  </View>
                  <MaterialIcons name="share" size={16} color="#E040FB88" />
                </Pressable>

                {/* APK Download info */}
                <View style={[styles.infoBox, { borderColor: '#FFD70044', marginTop: 8 }]}>
                  <LinearGradient colors={['rgba(255,215,0,0.08)', 'transparent']} style={StyleSheet.absoluteFillObject} />
                  <MaterialIcons name="help" size={16} color="#FFD700" />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.infoBoxText, { color: '#FFD700', fontWeight: '800' }]}>APK Download — Free vs Premium</Text>
                    <Text style={styles.infoBoxText}>
                      {'• OnSpace Free Tier: Build with EAS (external)\n'}
                      {'• Premium/Pro Tier: Direct APK download from OnSpace toolbar\n'}
                      {'• Free EAS Build: expo.dev → Projects → Build → Download APK\n'}
                      {'• The OnSpace toolbar download button is only visible when you tap the top-right "⋮" or cloud icon AFTER publishing the app from the toolbar.\n\n'}
                      {'🔑 Alternative: Use EAS Build (free) — run the commands above to get your APK download link sent to your email by Expo.'}
                    </Text>
                  </View>
                </View>
              </>
            )}

            {/* ── DEPLOY TAB ─────────────────────────────── */}
            {tab === 'deploy' && (
              <>
                <Text style={styles.sectionTitle}>🚀 Build & Deploy | بلڈ اینڈ ڈیپلوئے</Text>
                {[
                  { num: '1', label: 'Install EAS CLI', cmd: 'npm install -g eas-cli', color: '#00FF88' },
                  { num: '2', label: 'Login to Expo', cmd: 'eas login', color: '#00B4D8' },
                  { num: '3', label: 'Build APK (Shareable)', cmd: 'eas build --platform android --profile preview', color: '#FFD700' },
                  { num: '4', label: 'Build AAB (Play Store)', cmd: 'eas build --platform android --profile production', color: '#E040FB' },
                  { num: '5', label: 'Submit to Play Store', cmd: 'eas submit --platform android --latest', color: '#FF7043' },
                ].map(step => (
                  <View key={step.num} style={[styles.buildStep, { borderColor: step.color + '33' }]}>
                    <LinearGradient colors={[step.color + '12', 'transparent']} style={StyleSheet.absoluteFillObject} />
                    <View style={[styles.stepNum, { backgroundColor: step.color + '22', borderColor: step.color }]}>
                      <Text style={[styles.stepNumText, { color: step.color }]}>{step.num}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.stepLabel}>{step.label}</Text>
                      <View style={styles.codeBox}>
                        <Text style={styles.codeText} selectable>{step.cmd}</Text>
                      </View>
                    </View>
                  </View>
                ))}
                <View style={styles.quickLinks}>
                  {[
                    { label: '☁️ EAS Dashboard', url: 'https://expo.dev/accounts/onspace/projects', color: '#00B4D8' },
                    { label: '🏪 Google Play Console', url: 'https://play.google.com/console', color: '#4CAF50' },
                    { label: '🌐 Netlify Deploy', url: 'https://netlify.com', color: '#00C7B7' },
                    { label: '▲ Vercel Deploy', url: 'https://vercel.com', color: '#aaa' },
                  ].map(link => (
                    <Pressable key={link.url} onPress={() => Linking.openURL(link.url)}
                      style={[styles.linkBtn, { borderColor: link.color + '55' }]}>
                      <LinearGradient colors={[link.color + '12', 'transparent']} style={StyleSheet.absoluteFillObject} />
                      <Text style={[styles.linkBtnText, { color: link.color }]}>{link.label}</Text>
                      <MaterialIcons name="open-in-new" size={13} color={link.color + '77'} />
                    </Pressable>
                  ))}
                </View>
              </>
            )}

            {/* ── SOURCE CODE TAB ────────────────────────── */}
            {tab === 'sourcecode' && (
              <>
                <Text style={styles.sectionTitle}>💾 Source Code & Download | سورس کوڈ</Text>
                <View style={[styles.infoBox, { borderColor: '#00FF8844' }]}>
                  <LinearGradient colors={['rgba(0,255,136,0.1)', 'transparent']} style={StyleSheet.absoluteFillObject} />
                  <MaterialIcons name="info" size={16} color="#00FF88" />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.infoBoxText, { color: '#00FF88', fontWeight: '800' }]}>3 Ways to Get Source Code | 3 طریقے</Text>
                    <Text style={styles.infoBoxText}>
                      {'1. OnSpace App: Code icon (</>) top-right → Download ZIP\n'}
                      {'2. GitHub: Push code → Download ZIP from repo\n'}
                      {'3. EAS: Expo dashboard → Source snapshot'}
                    </Text>
                  </View>
                </View>

                {[{ label: '⬇️ OnSpace Source Code', url: 'https://app.onspace.ai', color: '#00FF88',
                    desc: 'Top-right Code icon (</>) → "Download" → ZIP file download ہو جائے گی' },
                  { label: '🐙 GitHub Repository', url: 'https://github.com/new', color: '#E040FB',
                    desc: 'git push کریں پھر Code → Download ZIP کریں' },
                  { label: '⚡ Expo Dashboard', url: 'https://expo.dev', color: '#00B4D8',
                    desc: 'Projects → Source snapshots اور build history دیکھیں' }]
                  .map(item => (
                    <Pressable key={item.url} onPress={() => Linking.openURL(item.url)}
                      style={[styles.exportCard, { borderColor: item.color + '44' }]}>
                      <LinearGradient colors={[item.color + '12', 'transparent']} style={StyleSheet.absoluteFillObject} />
                      <View style={[styles.exportIcon, { backgroundColor: item.color + '22' }]}>
                        <MaterialIcons name="open-in-new" size={22} color={item.color} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.exportTitle, { color: item.color }]}>{item.label}</Text>
                        <Text style={styles.exportSub}>{item.desc}</Text>
                      </View>
                    </Pressable>
                  ))}

                <Text style={[styles.sectionTitle, { marginTop: 4 }]}>📌 Key Files | اہم فائلیں</Text>
                {[['app/(tabs)/admin.tsx', 'Admin Panel — پاسورڈ: Daood5577'],
                  ['contexts/BrowserContext.tsx', 'Global State + AsyncStorage'],
                  ['constants/theme.ts', '26 Themes'],
                  ['constants/config.ts', 'Hubs + Apps Config'],
                  ['components/feature/', '20+ Feature Components'],
                  ['eas.json', 'EAS Build Profiles']]
                  .map(([file, desc]) => (
                    <View key={file} style={[styles.infoBox, { borderColor: 'rgba(255,255,255,0.12)' }]}>
                      <MaterialIcons name="insert-drive-file" size={14} color="rgba(255,255,255,0.5)" />
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.infoBoxText, { color: '#fff', fontWeight: '800', fontSize: 10 }]} selectable>{file}</Text>
                        <Text style={[styles.infoBoxText, { fontSize: 10 }]}>{desc}</Text>
                      </View>
                    </View>
                  ))}
              </>
            )}

            {/* ── EMAIL TAB ────────────────────────────────── */}
            {tab === 'email' && (
              <>
                <Text style={styles.sectionTitle}>📧 Email Delivery | ای میل</Text>
                <View style={[styles.emailInputWrap, { borderColor: theme.glassBorder }]}>
                  <LinearGradient colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.04)']} style={StyleSheet.absoluteFillObject} />
                  <MaterialIcons name="alternate-email" size={18} color={theme.glowColor} />
                  <TextInput style={styles.emailInput} value={emailInput} onChangeText={setEmailInput}
                    placeholder="your@email.com" placeholderTextColor="rgba(255,255,255,0.4)"
                    keyboardType="email-address" autoCapitalize="none" />
                </View>
                <Pressable onPress={() => setEmailInput('dr.mirfann5577@gmail.com')}
                  style={[styles.quickEmailBtn, { borderColor: '#FFD70044' }]}>
                  <LinearGradient colors={['rgba(255,215,0,0.1)', 'transparent']} style={StyleSheet.absoluteFillObject} />
                  <MaterialIcons name="star" size={14} color="#FFD700" />
                  <Text style={styles.quickEmailText}>dr.mirfann5577@gmail.com</Text>
                </Pressable>
                <Pressable onPress={handleEmailDeploy} disabled={emailSending}
                  style={[styles.emailSendBtn, { backgroundColor: emailSending ? 'rgba(255,255,255,0.2)' : theme.primary }]}>
                  <MaterialIcons name={emailSending ? 'hourglass-empty' : 'send'} size={18} color="#fff" />
                  <Text style={styles.emailSendBtnText}>{emailSending ? 'Opening...' : 'Send GitHub + Deploy Guide | ای میل بھیجیں'}</Text>
                </Pressable>
                <View style={[styles.infoBox, { borderColor: 'rgba(255,255,255,0.15)' }]}>
                  <MaterialIcons name="info-outline" size={14} color="rgba(255,255,255,0.45)" />
                  <Text style={[styles.infoBoxText, { color: 'rgba(255,255,255,0.55)' }]}>
                    Opens your device email client with pre-filled GitHub & APK deployment guide.{'\n'}
                    آپ کا ای میل ایپ کھلے گا — تیار پیغام کے ساتھ۔
                  </Text>
                </View>
              </>
            )}

          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.25)' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1, overflow: 'hidden', gap: 10 },
  closeBtn: { padding: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8 },
  headerTitle: { color: '#fff', fontSize: 15, fontWeight: '900' },
  headerSub: { color: 'rgba(255,255,255,0.55)', fontSize: 10, marginTop: 2 },
  tabRow: { paddingHorizontal: 10, paddingVertical: 8, gap: 7 },
  tabBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 20, borderWidth: 1, paddingHorizontal: 11, paddingVertical: 7 },
  tabText: { fontSize: 10, fontWeight: '700' },
  content: { padding: 14, gap: 10, paddingBottom: 50 },
  sectionTitle: { color: '#fff', fontSize: 14, fontWeight: '800', marginBottom: 4 },
  infoBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, borderRadius: 12, borderWidth: 1, overflow: 'hidden', padding: 12 },
  infoBoxText: { flex: 1, color: 'rgba(255,255,255,0.8)', fontSize: 11, lineHeight: 18 },
  exportCard: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 14, borderWidth: 1, overflow: 'hidden', padding: 14 },
  exportIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  exportTitle: { fontSize: 13, fontWeight: '800' },
  exportSub: { color: 'rgba(255,255,255,0.55)', fontSize: 11, marginTop: 2 },
  statsGrid: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  statCard: { flex: 1, minWidth: '22%', borderRadius: 12, borderWidth: 1, overflow: 'hidden', padding: 10, alignItems: 'center', gap: 3 },
  statNum: { fontSize: 20, fontWeight: '900' },
  statLabel: { color: 'rgba(255,255,255,0.55)', fontSize: 9, fontWeight: '600' },
  restoreCard: { borderRadius: 16, borderWidth: 1, overflow: 'hidden', padding: 20, alignItems: 'center', gap: 12 },
  restoreTitle: { color: '#fff', fontSize: 15, fontWeight: '800', textAlign: 'center' },
  restoreSub: { color: 'rgba(255,255,255,0.65)', fontSize: 12, lineHeight: 20, textAlign: 'center' },
  restoreBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 50, paddingVertical: 13, paddingHorizontal: 24 },
  restoreBtnText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  buildStep: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, borderRadius: 12, borderWidth: 1, overflow: 'hidden', padding: 12 },
  stepNum: { width: 28, height: 28, borderRadius: 14, borderWidth: 1.5, justifyContent: 'center', alignItems: 'center', flexShrink: 0, marginTop: 1 },
  stepNumText: { fontSize: 12, fontWeight: '900' },
  stepLabel: { color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: '700', marginBottom: 4 },
  codeBox: { backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 6, padding: 6, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  codeText: { color: '#00FF88', fontSize: 10, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
  quickLinks: { gap: 7 },
  linkBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: 12, borderWidth: 1, overflow: 'hidden', paddingHorizontal: 14, paddingVertical: 11 },
  linkBtnText: { fontSize: 13, fontWeight: '700', flex: 1 },
  emailInputWrap: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 14, borderWidth: 1, overflow: 'hidden', padding: 13 },
  emailInput: { flex: 1, color: '#fff', fontSize: 13, fontWeight: '500' },
  quickEmailBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 12, borderWidth: 1, overflow: 'hidden', padding: 12 },
  quickEmailText: { flex: 1, color: '#FFD700', fontSize: 12, fontWeight: '700' },
  emailSendBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 12, paddingVertical: 13 },
  emailSendBtnText: { color: '#fff', fontWeight: '800', fontSize: 13 },
});
