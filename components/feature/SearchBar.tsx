import React, { useState } from 'react';
import { View, TextInput, Pressable, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useBrowserContext } from '@/contexts/BrowserContext';

interface SearchBarProps {
  onSearch: (url: string) => void;
  onVoiceSearch?: () => void;
  onQRScanner?: () => void;
}

function formatUrl(input: string): string {
  const t = input.trim();
  if (!t) return '';
  if (t.startsWith('http://') || t.startsWith('https://')) return t;
  if (t.includes('.') && !t.includes(' ')) return `https://${t}`;
  return `https://www.google.com/search?q=${encodeURIComponent(t)}`;
}

export function SearchBar({ onSearch, onVoiceSearch, onQRScanner }: SearchBarProps) {
  const { theme } = useBrowserContext();
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);

  const handleSearch = () => {
    const url = formatUrl(query);
    if (url) { onSearch(url); setQuery(''); }
  };

  return (
    <View style={styles.wrapper}>
      <View style={[styles.container, { borderColor: focused ? theme.glowColor : 'rgba(255,255,255,0.45)', shadowColor: focused ? theme.glowColor : 'transparent' }]}>
        <LinearGradient colors={['rgba(255,255,255,0.32)', 'rgba(255,255,255,0.1)']} style={StyleSheet.absoluteFillObject} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />
        <MaterialIcons name="search" size={20} color={focused ? theme.glowColor : 'rgba(255,255,255,0.7)'} style={{ marginLeft: 12 }} />
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search Google or enter URL... | تلاش کریں"
          placeholderTextColor="rgba(255,255,255,0.5)"
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
          keyboardType="url"
        />
        {/* Voice Search Button */}
        {onVoiceSearch && (
          <Pressable onPress={onVoiceSearch} hitSlop={6} style={[styles.iconBtn, { backgroundColor: 'rgba(255,152,0,0.3)', borderColor: 'rgba(255,152,0,0.5)' }]}>
            <MaterialIcons name="mic" size={17} color="#FF9800" />
          </Pressable>
        )}
        {/* QR Scanner Button */}
        {onQRScanner && (
          <Pressable onPress={onQRScanner} hitSlop={6} style={[styles.iconBtn, { backgroundColor: 'rgba(79,195,247,0.3)', borderColor: 'rgba(79,195,247,0.5)' }]}>
            <MaterialIcons name="qr-code-scanner" size={17} color="#4FC3F7" />
          </Pressable>
        )}
        {query.length > 0 && (
          <Pressable onPress={() => setQuery('')} hitSlop={8} style={{ padding: 6 }}>
            <MaterialIcons name="close" size={16} color="rgba(255,255,255,0.6)" />
          </Pressable>
        )}
        <Pressable onPress={handleSearch} style={[styles.goBtn, { backgroundColor: theme.primary }]} hitSlop={4}>
          <Text style={styles.goText}>GO</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { paddingHorizontal: 12, paddingVertical: 8 },
  container: {
    flexDirection: 'row', alignItems: 'center', borderRadius: 50, borderWidth: 1.5, overflow: 'hidden', height: 50,
    shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 10, elevation: 6,
  },
  input: { flex: 1, color: '#fff', fontSize: 13, paddingHorizontal: 8, fontWeight: '500' },
  iconBtn: { marginHorizontal: 2, width: 30, height: 30, borderRadius: 15, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  goBtn: { margin: 4, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 40, marginRight: 4 },
  goText: { color: '#fff', fontWeight: '800', fontSize: 13 },
});
