import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { GlassModal } from '@/components/ui/GlassModal';
import { THEMES, AppTheme } from '@/constants/theme';
import { useBrowserContext } from '@/contexts/BrowserContext';

interface ThemePickerProps { visible: boolean; onClose: () => void; }

export function ThemePicker({ visible, onClose }: ThemePickerProps) {
  const { theme, setTheme } = useBrowserContext();
  const [tab, setTab] = useState<'light' | 'dark'>('light');

  const handleSelect = (t: AppTheme) => { setTheme(t); onClose(); };
  const filtered = THEMES.filter(t => tab === 'dark' ? !!t.isDark : !t.isDark);

  return (
    <GlassModal visible={visible} onClose={onClose} title="🎨 Select Theme" titleUr="تھیم منتخب کریں">

      {/* Tab toggle */}
      <View style={styles.tabs}>
        {[
          { key: 'light', label: '☀️ Luminous', labelUr: 'روشن تھیمز' },
          { key: 'dark', label: '🌑 Dark BG', labelUr: 'تاریک پس منظر' },
        ].map(t => (
          <Pressable key={t.key} onPress={() => setTab(t.key as any)}
            style={[styles.tabBtn, { backgroundColor: tab === t.key ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.12)', borderColor: tab === t.key ? '#fff' : 'rgba(255,255,255,0.25)' }]}>
            <Text style={styles.tabBtnText}>{t.label}</Text>
            <Text style={styles.tabBtnUr}>{t.labelUr}</Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={t => t.id}
        numColumns={2}
        columnWrapperStyle={{ gap: 10, marginBottom: 10 }}
        renderItem={({ item }) => (
          <Pressable onPress={() => handleSelect(item)}
            style={[styles.themeCard, item.id === theme.id && styles.selectedCard]}>
            <LinearGradient colors={[...item.gradient]} style={styles.preview} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              {item.id === theme.id && (
                <View style={styles.checkWrap}>
                  <MaterialIcons name="check-circle" size={22} color="#fff" />
                </View>
              )}
              {item.isDark && (
                <View style={styles.darkTag}>
                  <Text style={styles.darkTagText}>DARK</Text>
                </View>
              )}
            </LinearGradient>
            <Text style={[styles.themeName, item.isDark && { backgroundColor: 'rgba(0,0,0,0.7)' }]}>{item.name}</Text>
            <Text style={[styles.themeNameUr, item.isDark && { backgroundColor: 'rgba(0,0,0,0.7)' }]}>{item.nameUrdu}</Text>
          </Pressable>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
        scrollEnabled={false}
      />
    </GlassModal>
  );
}

const styles = StyleSheet.create({
  tabs: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  tabBtn: { flex: 1, borderRadius: 12, borderWidth: 1, padding: 10, alignItems: 'center' },
  tabBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  tabBtnUr: { color: 'rgba(255,255,255,0.7)', fontSize: 10, marginTop: 2 },
  themeCard: { flex: 1, borderRadius: 14, overflow: 'hidden', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.3)' },
  selectedCard: { borderColor: '#fff', borderWidth: 2.5, shadowColor: '#fff', shadowRadius: 8, shadowOpacity: 0.5, elevation: 8 },
  preview: { height: 70, justifyContent: 'flex-end', padding: 8 },
  checkWrap: { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 12 },
  darkTag: { position: 'absolute', top: 8, left: 8, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  darkTagText: { color: '#fff', fontSize: 8, fontWeight: '900' },
  themeName: { color: '#fff', fontSize: 11, fontWeight: '700', padding: 6, backgroundColor: 'rgba(0,0,0,0.4)', textAlign: 'center' },
  themeNameUr: { color: 'rgba(255,255,255,0.8)', fontSize: 10, textAlign: 'center', paddingBottom: 6, backgroundColor: 'rgba(0,0,0,0.4)' },
});
