import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Pressable, Dimensions,
  PanResponder, Animated, Modal,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { WebView } from 'react-native-webview';
import { useBrowserContext } from '@/contexts/BrowserContext';

const SW = Dimensions.get('window').width;
const SH = Dimensions.get('window').height;

const PIP_W = 220;
const PIP_H = 138;
const HALF_W = SW;
const HALF_H = SH * 0.45;

export type PlayerMode = 'pip' | 'half' | 'full' | 'hidden';

interface PiPPlayerProps {
  url: string;
  title?: string;
  mode: PlayerMode;
  onModeChange: (mode: PlayerMode) => void;
  onClose: () => void;
}

export function PiPPlayer({ url, title, mode, onModeChange, onClose }: PiPPlayerProps) {
  const { theme } = useBrowserContext();
  const pan = useRef(new Animated.ValueXY({ x: SW - PIP_W - 12, y: SH - PIP_H - 120 })).current;
  const webRef = useRef<WebView>(null);
  const [muted, setMuted] = useState(false);
  const [paused, setPaused] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => mode === 'pip',
      onPanResponderGrant: () => {
        pan.setOffset({ x: (pan.x as any)._value, y: (pan.y as any)._value });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
      onPanResponderRelease: (_, gs) => {
        pan.flattenOffset();
        // Snap to nearest edge
        const currentX = (pan.x as any)._value;
        const currentY = (pan.y as any)._value;
        const snapX = currentX < SW / 2 ? 12 : SW - PIP_W - 12;
        const clampedY = Math.max(80, Math.min(SH - PIP_H - 120, currentY));
        Animated.spring(pan, {
          toValue: { x: snapX, y: clampedY },
          useNativeDriver: false,
          bounciness: 5,
        }).start();
      },
    })
  ).current;

  const muteScript = muted
    ? `document.querySelectorAll('video,audio').forEach(v=>v.muted=true);true;`
    : `document.querySelectorAll('video,audio').forEach(v=>v.muted=false);true;`;

  useEffect(() => {
    webRef.current?.injectJavaScript(muteScript);
  }, [muted]);

  if (mode === 'hidden') return null;

  if (mode === 'full') {
    return (
      <Modal visible animationType="slide" presentationStyle="fullScreen" onRequestClose={() => onModeChange('pip')}>
        <View style={styles.fullContainer}>
          <LinearGradient colors={[...theme.gradient]} style={styles.fullChrome}>
            <Pressable onPress={() => onModeChange('pip')} style={styles.controlBtn} hitSlop={8}>
              <MaterialIcons name="picture-in-picture-alt" size={20} color="#fff" />
            </Pressable>
            <Pressable onPress={() => onModeChange('half')} style={styles.controlBtn} hitSlop={8}>
              <MaterialIcons name="vertical-split" size={20} color="#fff" />
            </Pressable>
            <Text style={styles.chromeTitle} numberOfLines={1}>{title || 'Media Player | میڈیا پلیئر'}</Text>
            <Pressable onPress={() => setMuted(m => !m)} style={styles.controlBtn} hitSlop={8}>
              <MaterialIcons name={muted ? 'volume-off' : 'volume-up'} size={20} color="#fff" />
            </Pressable>
            <Pressable onPress={onClose} style={styles.controlBtn} hitSlop={8}>
              <MaterialIcons name="close" size={22} color="#fff" />
            </Pressable>
          </LinearGradient>
          <WebView
            ref={webRef}
            source={{ uri: url }}
            style={styles.fullWebView}
            allowsInlineMediaPlayback
            mediaPlaybackRequiresUserAction={false}
            allowsFullscreenVideo
            javaScriptEnabled
            domStorageEnabled
          />
        </View>
      </Modal>
    );
  }

  if (mode === 'half') {
    return (
      <Modal visible animationType="slide" transparent onRequestClose={() => onModeChange('pip')}>
        <View style={styles.halfOverlay}>
          <Pressable style={styles.halfBackdrop} onPress={() => onModeChange('pip')} />
          <View style={styles.halfContainer}>
            <LinearGradient colors={[...theme.gradient]} style={styles.halfChrome}>
              <Pressable onPress={() => onModeChange('pip')} style={styles.controlBtn} hitSlop={8}>
                <MaterialIcons name="picture-in-picture-alt" size={18} color="#fff" />
              </Pressable>
              <Pressable onPress={() => onModeChange('full')} style={styles.controlBtn} hitSlop={8}>
                <MaterialIcons name="fullscreen" size={20} color="#fff" />
              </Pressable>
              <Text style={styles.chromeTitle} numberOfLines={1}>{title || 'Player | پلیئر'}</Text>
              <Pressable onPress={() => setMuted(m => !m)} style={styles.controlBtn} hitSlop={8}>
                <MaterialIcons name={muted ? 'volume-off' : 'volume-up'} size={18} color="#fff" />
              </Pressable>
              <Pressable onPress={onClose} style={styles.controlBtn} hitSlop={8}>
                <MaterialIcons name="close" size={20} color="#fff" />
              </Pressable>
            </LinearGradient>
            <WebView
              ref={webRef}
              source={{ uri: url }}
              style={{ width: HALF_W, height: HALF_H }}
              allowsInlineMediaPlayback
              mediaPlaybackRequiresUserAction={false}
              allowsFullscreenVideo
              javaScriptEnabled
              domStorageEnabled
            />
          </View>
        </View>
      </Modal>
    );
  }

  // PiP mode
  return (
    <Animated.View
      style={[styles.pip, { transform: pan.getTranslateTransform() }]}
      {...panResponder.panHandlers}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.88)', 'rgba(0,0,0,0.75)']}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.pipBorder} />

      {/* Mini WebView */}
      <WebView
        ref={webRef}
        source={{ uri: url }}
        style={styles.pipWebView}
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        javaScriptEnabled
        scrollEnabled={false}
      />

      {/* PiP Controls overlay */}
      <View style={styles.pipControls}>
        <Pressable onPress={() => onModeChange('half')} style={styles.pipBtn} hitSlop={6}>
          <MaterialIcons name="vertical-split" size={15} color="#fff" />
        </Pressable>
        <Pressable onPress={() => onModeChange('full')} style={styles.pipBtn} hitSlop={6}>
          <MaterialIcons name="fullscreen" size={16} color="#fff" />
        </Pressable>
        <Pressable onPress={() => setMuted(m => !m)} style={styles.pipBtn} hitSlop={6}>
          <MaterialIcons name={muted ? 'volume-off' : 'volume-up'} size={14} color="#fff" />
        </Pressable>
        <Pressable onPress={onClose} style={[styles.pipBtn, styles.pipClose]} hitSlop={6}>
          <MaterialIcons name="close" size={14} color="#fff" />
        </Pressable>
      </View>

      {/* Drag handle label */}
      <View style={styles.pipLabel}>
        <Text style={styles.pipLabelText} numberOfLines={1}>
          {title ? title.substring(0, 18) : 'Media Player'}
        </Text>
        <MaterialIcons name="drag-indicator" size={14} color="rgba(255,255,255,0.5)" />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  // PiP
  pip: {
    position: 'absolute', width: PIP_W, height: PIP_H + 32,
    borderRadius: 14, overflow: 'hidden', zIndex: 9999,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.6, shadowRadius: 12, elevation: 20,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.25)',
  },
  pipBorder: { ...StyleSheet.absoluteFillObject, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
  pipWebView: { width: PIP_W, height: PIP_H },
  pipControls: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 4, paddingHorizontal: 8, paddingVertical: 4,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  pipBtn: { padding: 5, backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 6 },
  pipClose: { backgroundColor: 'rgba(255,50,50,0.4)' },
  pipLabel: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 8, paddingBottom: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  pipLabelText: { color: 'rgba(255,255,255,0.7)', fontSize: 9, fontWeight: '600', flex: 1 },

  // Full
  fullContainer: { flex: 1, backgroundColor: '#000' },
  fullChrome: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 12, paddingVertical: 10, paddingTop: 50,
  },
  fullWebView: { flex: 1 },

  // Half
  halfOverlay: { flex: 1, justifyContent: 'flex-end' },
  halfBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  halfContainer: { width: HALF_W, height: HALF_H + 48, backgroundColor: '#000', overflow: 'hidden' },
  halfChrome: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 10, paddingVertical: 8,
  },
  chromeTitle: { flex: 1, color: '#fff', fontSize: 12, fontWeight: '600' },
  controlBtn: { padding: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8 },
});
