import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useBrowserContext } from '@/contexts/BrowserContext';
import { ThemePicker } from '@/components/feature/ThemePicker';
import { ExportManager } from '@/components/feature/ExportManager';

export default function SettingsScreen() {
  const { theme, vpnEnabled, setVpnEnabled, adBlockEnabled, setAdBlockEnabled } = useBrowserContext();
  const router = useRouter();
  const [themePickerOpen, setThemePickerOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  const SETTINGS = [
    {
      section: '🛡️ Security | سیکیورٹی',
      items: [
        { id: 'vpn', icon: 'vpn-lock', label: '⚔️ VPN Shield', labelUr: 'وی پی این محافظ', color: '#00FF88', isToggle: true, toggleVal: vpnEnabled, onToggle: setVpnEnabled },
        { id: 'adb', icon: 'block', label: 'Ad Blocker', labelUr: 'ایڈ بلاکر', color: '#00DCFF', isToggle: true, toggleVal: adBlockEnabled, onToggle: setAdBlockEnabled },
      ]
    },
    {
      section: '🎨 Appearance | ظاہری شکل',
      items: [
        { id: 'themes', icon: 'palette', label: '🎨 Change Theme', labelUr: 'تھیم بدلیں', color: '#DA70D6', onPress: () => setThemePickerOpen(true) },
      ]
    },
    {
      section: '📦 Data | ڈیٹا',
      items: [
        { id: 'export', icon: 'backup', label: '📦 Export & Backup', labelUr: 'ایکسپورٹ', color: '#FFD700', onPress: () => setExportOpen(true) },
      ]
    },
    {
      section: '⚙️ Admin | ایڈمن',
      items: [
        { id: 'admin', icon: 'admin-panel-settings', label: '🔐 Admin Panel', labelUr: 'ایڈمن پینل — پاسورڈ محفوظ', color: '#FF7043', onPress: () => router.push('/(tabs)/admin') },
      ]
    },
    {
      section: '🌐 Links | لنکس',
      items: [
        { id: 'github', icon: 'code', label: '🐙 GitHub Repo', labelUr: 'سورس کوڈ', color: '#E040FB', onPress: () => Linking.openURL('https://github.com/drmirfan5577-ops/EverSmartBrowser-') },
        { id: 'expo', icon: 'phone-android', label: '⚡ Expo Dashboard', labelUr: 'ایکسپو', color: '#00B4D8', onPress: () => Linking.openURL('https://expo.dev') },
        { id: 'email', icon: 'email', label: '📧 Contact Developer', labelUr: 'ڈیولپر سے رابطہ', color: '#4FC3F7', onPress: () => Linking.openURL('mailto:dr.mirfann5577@gmail.com') },
      ]
    },
  ];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: '#000' }]} edges={['top']}>
      <StatusBar style="light" />
      <LinearGradient colors={[...theme.gradient]} style={styles.root}>
        <View style={styles.header}>
          <LinearGradient colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.05)']} style={StyleSheet.absoluteFillObject} />
          <Text style={[styles.title, { textShadowColor: theme.glowColor, textShadowRadius: 10 }]}>
            ⚙️ Settings | ترتیبات
          </Text>
          <Text style={styles.version}>EvEr SmArT BrOwSeR v2.0.0</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          {SETTINGS.map(group => (
            <View key={group.section}>
              <Text style={styles.sectionLabel}>{group.section}</Text>
              {group.items.map(item => (
                <Pressable key={item.id}
                  onPress={(item as any).onPress}
                  style={({ pressed }) => [styles.row, { borderColor: (item as any).color + '44', opacity: pressed ? 0.85 : 1 }]}>
                  <LinearGradient colors={[(item as any).color + '14', 'transparent']} style={StyleSheet.absoluteFillObject} />
                  <View style={[styles.iconWrap, { backgroundColor: (item as any).color + '25' }]}>
                    <MaterialIcons name={(item as any).icon as any} size={20} color={(item as any).color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.rowLabel}>{item.label}</Text>
                    <Text style={styles.rowSub}>{item.labelUr}</Text>
                  </View>
                  {(item as any).isToggle ? (
                    <Switch
                      value={(item as any).toggleVal}
                      onValueChange={(item as any).onToggle}
                      trackColor={{ false: 'rgba(255,255,255,0.2)', true: (item as any).color }}
                      thumbColor="#fff"
                    />
                  ) : (
                    <MaterialIcons name="chevron-right" size={20} color="rgba(255,255,255,0.4)" />
                  )}
                </Pressable>
              ))}
            </View>
          ))}

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: theme.glowColor }]}>EvEr SmArT BrOwSeR</Text>
            <Text style={styles.footerSub}>Designed with ❤️ for Pakistan</Text>
            <Text style={styles.footerSub}>Developer: Dr. M Irfan Qadir Thaheem</Text>
          </View>
        </ScrollView>

        <ThemePicker visible={themePickerOpen} onClose={() => setThemePickerOpen(false)} />
        <ExportManager visible={exportOpen} onClose={() => setExportOpen(false)} />
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  root: { flex: 1 },
  header: { overflow: 'hidden', paddingHorizontal: 18, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.15)' },
  title: { color: '#fff', fontSize: 20, fontWeight: '900' },
  version: { color: 'rgba(255,255,255,0.5)', fontSize: 10, marginTop: 3 },
  content: { padding: 14, gap: 4, paddingBottom: 40 },
  sectionLabel: { color: 'rgba(255,255,255,0.55)', fontSize: 11, fontWeight: '700', marginTop: 12, marginBottom: 6, paddingHorizontal: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 14, borderWidth: 1, overflow: 'hidden', padding: 13, marginBottom: 6 },
  iconWrap: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  rowLabel: { color: '#fff', fontSize: 13, fontWeight: '700' },
  rowSub: { color: 'rgba(255,255,255,0.55)', fontSize: 10, marginTop: 1 },
  footer: { alignItems: 'center', gap: 5, paddingVertical: 24, marginTop: 8 },
  footerText: { fontSize: 16, fontWeight: '900' },
  footerSub: { color: 'rgba(255,255,255,0.45)', fontSize: 10 },
});
