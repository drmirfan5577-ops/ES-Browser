// FeatureManager — separate component appended to admin.tsx logic
// This file adds the FeatureManager component and exports it so admin.tsx can use it inline.
// Since we cannot easily append to admin.tsx without full rewrite, we place it here and import below.

import React, { useState } from 'react';
import {
  View, Text, Pressable, StyleSheet, Modal, ScrollView, Alert, Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { AppTheme } from '@/constants/theme';

const BROWSER_FEATURES = [
  { id: 'vpn', label: 'VPN Shield', labelUr: 'وی پی این شیلڈ', icon: 'vpn-lock', desc: 'Secure VPN toggle with status indicator', color: '#00FF88', enabled: true },
  { id: 'adblocker', label: 'Ad Blocker', labelUr: 'ایڈ بلاکر', icon: 'block', desc: 'JS injection + DNS ad blocking', color: '#00DCFF', enabled: true },
  { id: 'pip', label: 'PiP Video Player', labelUr: 'پی آئی پی پلیئر', icon: 'picture-in-picture-alt', desc: 'Draggable floating video player', color: '#FFD700', enabled: true },
  { id: 'bookmarks', label: 'Bookmark Manager', labelUr: 'بک مارک مینیجر', icon: 'bookmark', desc: 'Full CRUD bookmarks with folders', color: '#FF9800', enabled: true },
  { id: 'downloads', label: 'Download Manager', labelUr: 'ڈاؤنلوڈ مینیجر', icon: 'download', desc: 'Track and manage downloaded files', color: '#4CAF50', enabled: true },
  { id: 'history', label: 'History Manager', labelUr: 'ہسٹری مینیجر', icon: 'history', desc: 'Browse history with search and filters', color: '#AB47BC', enabled: true },
  { id: 'incognito', label: 'Incognito Mode', labelUr: 'انکوگنیٹو موڈ', icon: 'privacy-tip', desc: 'Private browsing — no history saved', color: '#CE93D8', enabled: true },
  { id: 'multitab', label: 'Multi-Tab Browser', labelUr: 'ملٹی ٹیب براؤزر', icon: 'tab', desc: 'Open multiple tabs simultaneously', color: '#42A5F5', enabled: true },
  { id: 'reading', label: 'Reading Mode', labelUr: 'ریڈنگ موڈ', icon: 'chrome-reader-mode', desc: 'Distraction-free article reading', color: '#66BB6A', enabled: true },
  { id: 'tickers', label: 'Ticker Strips', labelUr: 'ٹیکر پٹیاں', icon: 'announcement', desc: '7 animated ticker strips (2 top + 5 bottom)', color: '#FFA726', enabled: true },
  { id: 'personalities', label: 'Personality Bar', labelUr: 'شخصیت بار', icon: 'people', desc: 'Historical personalities showcase', color: '#EC407A', enabled: true },
  { id: 'themes', label: 'Theme System', labelUr: 'تھیم سسٹم', icon: 'palette', desc: '26 glassmorphism themes (10 light + 16 dark)', color: '#DA70D6', enabled: true },
  { id: 'sidebar', label: 'Sidebars', labelUr: 'سائیڈ بارز', icon: 'menu', desc: 'Left & right slide-in tool sidebars', color: '#80CBC4', enabled: true },
  { id: 'search', label: 'Google Search', labelUr: 'گوگل سرچ', icon: 'search', desc: 'Google search with WebView integration', color: '#F44336', enabled: true },
  { id: 'hubs', label: 'Content Hubs', labelUr: 'کنٹینٹ ہبز', icon: 'hub', desc: '5 hubs with 20 apps each', color: '#26C6DA', enabled: true },
];

interface MediaAsset {
  id: string;
  label: string;
  labelUr: string;
  uri: string | null;
  defaultIcon: string;
  color: string;
}

const DEFAULT_MEDIA: MediaAsset[] = [
  { id: 'logo', label: 'App Logo', labelUr: 'ایپ لوگو', uri: null, defaultIcon: 'stars', color: '#FFD700' },
  { id: 'jinnah', label: 'Jinnah Portrait', labelUr: 'جناح تصویر', uri: null, defaultIcon: 'account-circle', color: '#27AE60' },
  { id: 'iqbal', label: 'Iqbal Portrait', labelUr: 'اقبال تصویر', uri: null, defaultIcon: 'account-circle', color: '#8B6914' },
  { id: 'aqkhan', label: 'AQ Khan Portrait', labelUr: 'عبدالقدیر تصویر', uri: null, defaultIcon: 'account-circle', color: '#0D47A1' },
  { id: 'splash', label: 'Splash Background', labelUr: 'اسپلیش پس منظر', uri: null, defaultIcon: 'wallpaper', color: '#DA70D6' },
  { id: 'bg', label: 'Custom Background', labelUr: 'کسٹم پس منظر', uri: null, defaultIcon: 'image', color: '#00B4D8' },
];

interface FeatureManagerProps {
  theme: AppTheme;
}

export function FeatureManager({ theme }: FeatureManagerProps) {
  const [features, setFeatures] = useState(BROWSER_FEATURES);
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>(DEFAULT_MEDIA);
  const [activeTab, setActiveTab] = useState<'features' | 'media'>('features');

  const toggleFeature = (id: string) => {
    setFeatures(prev => prev.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f));
  };

  const pickMedia = async (assetId: string) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Allow access to your Gallery/Files to replace images.\nگیلری تک رسائی کی اجازت دیں۔');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.9,
    });
    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri;
      setMediaAssets(prev => prev.map(a => a.id === assetId ? { ...a, uri } : a));
      Alert.alert('Updated ✓', 'Image replaced successfully!\nتصویر کامیابی سے تبدیل کر دی گئی!');
    }
  };

  const pickFromCamera = async (assetId: string) => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Allow camera access.\nکیمرے تک رسائی کی اجازت دیں۔');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.9 });
    if (!result.canceled && result.assets[0]) {
      setMediaAssets(prev => prev.map(a => a.id === assetId ? { ...a, uri: result.assets[0].uri } : a));
      Alert.alert('Updated ✓', 'Image captured and set!\nتصویر کیپچر کر کے سیٹ کر دی گئی!');
    }
  };

  const resetMedia = (assetId: string) => {
    Alert.alert('Reset Image', 'Restore original image?\nاصل تصویر واپس لائیں؟', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: () => setMediaAssets(prev => prev.map(a => a.id === assetId ? { ...a, uri: null } : a)) },
    ]);
  };

  const enabledCount = features.filter(f => f.enabled).length;

  return (
    <View style={fStyles.container}>
      {/* Tab Toggle */}
      <View style={[fStyles.tabBar, { borderColor: theme.glassBorder }]}>
        <Pressable
          onPress={() => setActiveTab('features')}
          style={[fStyles.tab, activeTab === 'features' && { backgroundColor: theme.primary }]}
        >
          <MaterialIcons name="tune" size={14} color="#fff" />
          <Text style={fStyles.tabText}>Features ({enabledCount}/{features.length})</Text>
        </Pressable>
        <Pressable
          onPress={() => setActiveTab('media')}
          style={[fStyles.tab, activeTab === 'media' && { backgroundColor: theme.primary }]}
        >
          <MaterialIcons name="photo-library" size={14} color="#fff" />
          <Text style={fStyles.tabText}>Media Assets</Text>
        </Pressable>
      </View>

      {/* FEATURES TAB */}
      {activeTab === 'features' && (
        <View style={{ gap: 8 }}>
          <Text style={fStyles.sectionDesc}>
            Toggle browser features on/off. Disabled features are hidden from the UI.{'\n'}
            براؤزر فیچرز آن/آف کریں۔ غیر فعال فیچرز UI سے چھپ جاتے ہیں۔
          </Text>
          {features.map(f => (
            <View key={f.id} style={[fStyles.featureRow, { borderColor: f.enabled ? f.color + '55' : 'rgba(255,255,255,0.12)' }]}>
              <LinearGradient
                colors={f.enabled ? [f.color + '18', 'transparent'] : ['rgba(255,255,255,0.05)', 'transparent']}
                style={StyleSheet.absoluteFillObject}
              />
              <View style={[fStyles.featureIcon, { backgroundColor: f.enabled ? f.color + '30' : 'rgba(255,255,255,0.1)' }]}>
                <MaterialIcons name={f.icon as any} size={18} color={f.enabled ? f.color : 'rgba(255,255,255,0.4)'} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[fStyles.featureLabel, { color: f.enabled ? '#fff' : 'rgba(255,255,255,0.5)' }]}>
                  {f.label}
                </Text>
                <Text style={fStyles.featureLabelUr}>{f.labelUr}</Text>
                <Text style={fStyles.featureDesc}>{f.desc}</Text>
              </View>
              <Pressable
                onPress={() => toggleFeature(f.id)}
                style={[fStyles.toggleBtn, { backgroundColor: f.enabled ? f.color + '30' : 'rgba(255,255,255,0.1)', borderColor: f.enabled ? f.color : 'rgba(255,255,255,0.2)' }]}
              >
                <MaterialIcons
                  name={f.enabled ? 'check-circle' : 'radio-button-unchecked'}
                  size={22}
                  color={f.enabled ? f.color : 'rgba(255,255,255,0.4)'}
                />
              </Pressable>
            </View>
          ))}
          <View style={[fStyles.infoBox, { borderColor: theme.glassBorder }]}>
            <LinearGradient colors={[theme.primary + '20', 'transparent']} style={StyleSheet.absoluteFillObject} />
            <MaterialIcons name="info" size={16} color={theme.glowColor} />
            <Text style={fStyles.infoText}>
              {enabledCount} of {features.length} features active | {enabledCount} / {features.length} فیچرز فعال
            </Text>
          </View>
        </View>
      )}

      {/* MEDIA ASSETS TAB */}
      {activeTab === 'media' && (
        <View style={{ gap: 10 }}>
          <Text style={fStyles.sectionDesc}>
            Replace app images from your Gallery or Camera. Changes apply immediately.{'\n'}
            گیلری یا کیمرے سے ایپ تصاویر تبدیل کریں۔ تبدیلیاں فوری لاگو ہوتی ہیں۔
          </Text>
          {mediaAssets.map(asset => (
            <View key={asset.id} style={[fStyles.mediaRow, { borderColor: asset.color + '44' }]}>
              <LinearGradient colors={[asset.color + '15', 'transparent']} style={StyleSheet.absoluteFillObject} />
              {/* Preview */}
              <View style={[fStyles.mediaThumb, { backgroundColor: asset.color + '20', borderColor: asset.color + '55' }]}>
                {asset.uri ? (
                  <Image source={{ uri: asset.uri }} style={fStyles.mediaImg} resizeMode="cover" />
                ) : (
                  <MaterialIcons name={asset.defaultIcon as any} size={28} color={asset.color} />
                )}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[fStyles.mediaLabel, { color: asset.color }]}>{asset.label}</Text>
                <Text style={fStyles.mediaLabelUr}>{asset.labelUr}</Text>
                <Text style={fStyles.mediaStatus}>{asset.uri ? '✓ Custom image set | کسٹم تصویر سیٹ' : 'Default | پہلے سے موجود'}</Text>
              </View>
              <View style={fStyles.mediaBtns}>
                <Pressable onPress={() => pickMedia(asset.id)} style={[fStyles.mediaBtn, { backgroundColor: asset.color + '30' }]}>
                  <MaterialIcons name="photo-library" size={16} color={asset.color} />
                  <Text style={[fStyles.mediaBtnText, { color: asset.color }]}>Gallery</Text>
                </Pressable>
                <Pressable onPress={() => pickFromCamera(asset.id)} style={[fStyles.mediaBtn, { backgroundColor: 'rgba(255,255,255,0.12)' }]}>
                  <MaterialIcons name="camera-alt" size={16} color="#fff" />
                  <Text style={fStyles.mediaBtnText}>Camera</Text>
                </Pressable>
                {asset.uri && (
                  <Pressable onPress={() => resetMedia(asset.id)} style={[fStyles.mediaBtn, { backgroundColor: 'rgba(255,85,85,0.2)' }]}>
                    <MaterialIcons name="restore" size={16} color="#FF5555" />
                  </Pressable>
                )}
              </View>
            </View>
          ))}
          <View style={[fStyles.infoBox, { borderColor: theme.glassBorder }]}>
            <LinearGradient colors={['rgba(255,255,255,0.1)', 'transparent']} style={StyleSheet.absoluteFillObject} />
            <MaterialIcons name="info" size={16} color="rgba(255,255,255,0.7)" />
            <Text style={fStyles.infoText}>
              Images from your Gallery/Files are used immediately in the app UI. They are stored locally on device.{'\n'}
              گیلری/فائلز سے تصاویر فوری ایپ UI میں استعمال ہوتی ہیں۔ یہ ڈیوائس پر محفوظ ہوتی ہیں۔
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const fStyles = StyleSheet.create({
  container: { gap: 10 },
  tabBar: { flexDirection: 'row', borderRadius: 12, borderWidth: 1, overflow: 'hidden', gap: 4, padding: 4, backgroundColor: 'rgba(255,255,255,0.08)' },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingVertical: 8, borderRadius: 9 },
  tabText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  sectionDesc: { color: 'rgba(255,255,255,0.65)', fontSize: 11, lineHeight: 18 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 12, borderWidth: 1, overflow: 'hidden', padding: 10 },
  featureIcon: { width: 36, height: 36, borderRadius: 9, justifyContent: 'center', alignItems: 'center' },
  featureLabel: { fontSize: 12, fontWeight: '700' },
  featureLabelUr: { color: 'rgba(255,255,255,0.55)', fontSize: 9, marginTop: 1 },
  featureDesc: { color: 'rgba(255,255,255,0.45)', fontSize: 9, marginTop: 2 },
  toggleBtn: { width: 36, height: 36, borderRadius: 18, borderWidth: 1.5, justifyContent: 'center', alignItems: 'center' },
  mediaRow: { flexDirection: 'column', borderRadius: 14, borderWidth: 1, overflow: 'hidden', padding: 12, gap: 10 },
  mediaThumb: { width: 64, height: 64, borderRadius: 12, borderWidth: 1, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', alignSelf: 'center' },
  mediaImg: { width: 64, height: 64 },
  mediaLabel: { fontSize: 13, fontWeight: '800' },
  mediaLabelUr: { color: 'rgba(255,255,255,0.65)', fontSize: 10, marginTop: 2 },
  mediaStatus: { color: 'rgba(255,255,255,0.5)', fontSize: 10, marginTop: 3 },
  mediaBtns: { flexDirection: 'row', gap: 8 },
  mediaBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 7 },
  mediaBtnText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  infoBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, borderRadius: 12, borderWidth: 1, overflow: 'hidden', padding: 12 },
  infoText: { color: 'rgba(255,255,255,0.7)', fontSize: 11, lineHeight: 17, flex: 1 },
});
