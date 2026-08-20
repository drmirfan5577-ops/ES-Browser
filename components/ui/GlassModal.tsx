import React from 'react';
import { Modal, View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBrowserContext } from '@/contexts/BrowserContext';

interface GlassModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  titleUr?: string;
  children: React.ReactNode;
  fullScreen?: boolean;
}

export function GlassModal({ visible, onClose, title, titleUr, children, fullScreen }: GlassModalProps) {
  const { theme } = useBrowserContext();
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.sheet, fullScreen && styles.fullSheet, { paddingBottom: insets.bottom + 8 }]}>
          <LinearGradient colors={[...theme.gradient]} style={StyleSheet.absoluteFillObject} />
          <View style={styles.handle} />
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{title}</Text>
              {titleUr ? <Text style={styles.titleUr}>{titleUr}</Text> : null}
            </View>
            <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={8}>
              <MaterialIcons name="close" size={24} color="#fff" />
            </Pressable>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' },
  sheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: 'hidden', maxHeight: '90%', minHeight: '50%' },
  fullSheet: { flex: 1, maxHeight: '100%', borderRadius: 0 },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.5)', alignSelf: 'center', marginTop: 10, marginBottom: 4 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.2)' },
  title: { color: '#fff', fontSize: 18, fontWeight: '800', textShadowColor: 'rgba(255,255,255,0.5)', textShadowRadius: 8 },
  titleUr: { color: 'rgba(255,255,255,0.85)', fontSize: 13, marginTop: 2 },
  closeBtn: { padding: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8 },
  content: { paddingHorizontal: 16, paddingBottom: 24, paddingTop: 8 },
});
