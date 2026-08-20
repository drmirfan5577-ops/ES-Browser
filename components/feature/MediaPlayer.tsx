import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, Pressable, StyleSheet, Modal, Dimensions,
  Animated, PanResponder, ScrollView, Alert, Platform,
} from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Audio } from 'expo-av';
import * as MediaLibrary from 'expo-media-library';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBrowserContext } from '@/contexts/BrowserContext';

const { width: SW, height: SH } = Dimensions.get('window');

type PlayerMode = 'hidden' | 'pip' | 'half' | 'full';
type MediaTab = 'videos' | 'audio';

interface MediaPlayerProps {
  visible: boolean;
  onClose: () => void;
  initialUri?: string;
}

interface MediaFile {
  id: string;
  uri: string;
  filename: string;
  mediaType: 'video' | 'audio';
  duration?: number;
  width?: number;
  height?: number;
}

/** Video player card using expo-video */
function VideoCard({ uri, mode }: { uri: string; mode: PlayerMode }) {
  const player = useVideoPlayer(uri, p => { p.play(); });
  const h = mode === 'pip' ? 120 : mode === 'half' ? SH * 0.42 : SH;
  return (
    <VideoView
      player={player}
      style={[styles.video, { height: h }]}
      allowsFullscreen
      allowsPictureInPicture
      contentFit="contain"
    />
  );
}

export function MediaPlayer({ visible, onClose, initialUri }: MediaPlayerProps) {
  const { theme } = useBrowserContext();
  const insets = useSafeAreaInsets();

  // Permissions
  const [permission, requestPermission] = MediaLibrary.usePermissions();

  // Media state
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [currentFile, setCurrentFile] = useState<MediaFile | null>(null);
  const [playerMode, setPlayerMode] = useState<PlayerMode>('hidden');
  const [tab, setTab] = useState<MediaTab>('videos');
  const [isLoading, setIsLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [endCursor, setEndCursor] = useState<string | undefined>(undefined);

  // Audio player
  const soundRef = useRef<Audio.Sound | null>(null);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioPos, setAudioPos] = useState(0);
  const [audioDur, setAudioDur] = useState(0);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // PiP drag
  const pan = useRef(new Animated.ValueXY({ x: 10, y: 100 })).current;
  const panResponder = useRef(PanResponder.create({
    onMoveShouldSetPanResponder: () => playerMode === 'pip',
    onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
    onPanResponderRelease: () => pan.extractOffset(),
  })).current;

  // Glow animation
  const glowAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(glowAnim, { toValue: 1, duration: 2200, useNativeDriver: true }),
      Animated.timing(glowAnim, { toValue: 0, duration: 2200, useNativeDriver: true }),
    ])).start();
  }, []);

  // Request permission on first open
  useEffect(() => {
    if (visible && !permission?.granted) {
      requestPermission().catch(() => {});
    }
  }, [visible]);

  // Load media
  const loadMedia = async (type: MediaTab, reset = true) => {
    if (!permission?.granted) return;
    setIsLoading(true);
    try {
      const mediaType = type === 'videos' ? MediaLibrary.MediaType.video : MediaLibrary.MediaType.audio;
      const res = await MediaLibrary.getAssetsAsync({
        mediaType: [mediaType],
        first: 60,
        after: reset ? undefined : endCursor,
        sortBy: [MediaLibrary.SortBy.creationTime],
      });
      const files: MediaFile[] = res.assets.map(a => ({
        id: a.id, uri: a.uri, filename: a.filename,
        mediaType: type === 'videos' ? 'video' : 'audio',
        duration: a.duration, width: a.width, height: a.height,
      }));
      setMediaFiles(reset ? files : prev => [...prev, ...files]);
      setHasNextPage(res.hasNextPage);
      setEndCursor(res.endCursor);
    } catch {}
    setIsLoading(false);
  };

  useEffect(() => {
    if (visible && permission?.granted) {
      setMediaFiles([]); setEndCursor(undefined);
      loadMedia(tab, true);
    }
  }, [visible, tab, permission?.granted]);

  useEffect(() => {
    if (initialUri && visible) {
      const f: MediaFile = { id: 'ext', uri: initialUri, filename: 'Media', mediaType: 'video' };
      setCurrentFile(f); setPlayerMode('half');
    }
  }, [initialUri, visible]);

  // Audio
  const stopAudio = async () => {
    if (soundRef.current) {
      try { await soundRef.current.stopAsync(); await soundRef.current.unloadAsync(); } catch {}
      soundRef.current = null;
    }
    setAudioPlaying(false); setAudioPos(0); setAudioDur(0);
    pulseAnim.stopAnimation();
  };

  const playAudio = async (file: MediaFile) => {
    await stopAudio();
    setCurrentFile(file);
    try {
      await Audio.setAudioModeAsync({ playsInSilentModeIOS: true, staysActiveInBackground: true });
      const { sound } = await Audio.Sound.createAsync(
        { uri: file.uri },
        { shouldPlay: true },
        status => {
          if (status.isLoaded) {
            setAudioPos(status.positionMillis || 0);
            setAudioDur(status.durationMillis || 0);
            setAudioPlaying(status.isPlaying);
          }
        }
      );
      soundRef.current = sound;
      Animated.loop(Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.1, duration: 600, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])).start();
    } catch {
      Alert.alert('Error', 'Could not play audio file.');
    }
  };

  const toggleAudio = async () => {
    if (!soundRef.current) return;
    if (audioPlaying) { await soundRef.current.pauseAsync(); pulseAnim.stopAnimation(); }
    else {
      await soundRef.current.playAsync();
      Animated.loop(Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.1, duration: 600, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])).start();
    }
  };

  useEffect(() => { if (!visible) stopAudio(); }, [visible]);

  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  };

  const progressPct = audioDur > 0 ? (audioPos / audioDur) * 100 : 0;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen" onRequestClose={onClose}>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <LinearGradient colors={[...theme.gradient]} style={StyleSheet.absoluteFillObject} />
        <Animated.View style={[StyleSheet.absoluteFillObject, {
          opacity: glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.07] })
        }]}>
          <LinearGradient colors={[theme.glowColor, 'transparent', theme.primary]} style={StyleSheet.absoluteFillObject} />
        </Animated.View>

        <View style={styles.overlay}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.glassBorder }]}>
            <LinearGradient colors={['rgba(255,255,255,0.22)', 'rgba(255,255,255,0.05)']} style={StyleSheet.absoluteFillObject} />
            <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={8}>
              <MaterialIcons name="arrow-back" size={22} color="#fff" />
            </Pressable>
            <Text style={[styles.headerTitle, { textShadowColor: theme.glowColor, textShadowRadius: 8 }]}>
              🎬 Media Player | میڈیا پلیئر
            </Text>
            {!permission?.granted && (
              <Pressable onPress={() => requestPermission()} style={[styles.permSmallBtn, { backgroundColor: theme.primary }]}>
                <MaterialIcons name="lock-open" size={14} color="#fff" />
                <Text style={styles.permSmallText}>Allow | اجازت</Text>
              </Pressable>
            )}
          </View>

          {/* Permission banner */}
          {!permission?.granted && (
            <View style={[styles.permNotice, { borderColor: '#FFD70055' }]}>
              <LinearGradient colors={['rgba(255,215,0,0.1)', 'transparent']} style={StyleSheet.absoluteFillObject} />
              <MaterialIcons name="warning" size={16} color="#FFD700" />
              <Text style={styles.permNoticeText}>
                Storage permission needed to browse media files.{'\n'}
                میڈیا فائلز تک رسائی کے لیے اجازت ضروری ہے۔
              </Text>
            </View>
          )}

          {/* Video Player */}
          {currentFile?.mediaType === 'video' && playerMode !== 'hidden' && (
            <VideoCard uri={currentFile.uri} mode={playerMode} />
          )}

          {/* Audio Player Bar */}
          {currentFile?.mediaType === 'audio' && (
            <View style={[styles.audioBar, { borderColor: theme.glowColor + '55' }]}>
              <LinearGradient colors={['rgba(255,105,180,0.2)', 'rgba(255,105,180,0.04)']} style={StyleSheet.absoluteFillObject} />
              <Animated.View style={[styles.audioBarIcon, { transform: [{ scale: pulseAnim }] }]}>
                <MaterialIcons name="music-note" size={22} color="#FF69B4" />
              </Animated.View>
              <View style={{ flex: 1 }}>
                <Text style={styles.audioBarName} numberOfLines={1}>{currentFile.filename}</Text>
                <View style={styles.progressBg}>
                  <View style={[styles.progressFill, { width: `${progressPct}%`, backgroundColor: '#FF69B4' }]} />
                </View>
                <Text style={styles.audioBarTime}>{formatTime(audioPos)} / {formatTime(audioDur)}</Text>
              </View>
              <Pressable onPress={toggleAudio} style={[styles.audioBarPlayBtn, { backgroundColor: '#FF69B4' }]}>
                <MaterialIcons name={audioPlaying ? 'pause' : 'play-arrow'} size={22} color="#fff" />
              </Pressable>
              <Pressable onPress={stopAudio} hitSlop={8} style={styles.audioBarStop}>
                <MaterialIcons name="stop" size={18} color="rgba(255,255,255,0.6)" />
              </Pressable>
            </View>
          )}

          {/* Tabs */}
          <View style={styles.tabRow}>
            {(['videos', 'audio'] as MediaTab[]).map(t => (
              <Pressable key={t} onPress={() => setTab(t)}
                style={[styles.tabBtn, {
                  backgroundColor: tab === t ? theme.primary : 'rgba(255,255,255,0.15)',
                  borderColor: tab === t ? theme.glowColor : 'rgba(255,255,255,0.2)',
                }]}>
                <MaterialIcons name={t === 'videos' ? 'videocam' : 'music-note'} size={14} color="#fff" />
                <Text style={styles.tabText}>
                  {t === 'videos' ? '🎬 Videos | ویڈیوز' : '🎵 Audio | آڈیو'}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* File List */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 12, gap: 8 }}
            onScrollEndDrag={({ nativeEvent }) => {
              const { contentOffset, layoutMeasurement, contentSize } = nativeEvent;
              if (contentOffset.y + layoutMeasurement.height >= contentSize.height - 60) {
                if (hasNextPage && !isLoading) loadMedia(tab, false);
              }
            }}
          >
            {isLoading && mediaFiles.length === 0 && (
              <View style={styles.emptyWrap}>
                <MaterialIcons name="hourglass-empty" size={40} color={theme.glowColor} />
                <Text style={styles.emptyText}>Loading... | لوڈ ہو رہا ہے</Text>
              </View>
            )}
            {!isLoading && mediaFiles.length === 0 && permission?.granted && (
              <View style={styles.emptyWrap}>
                <MaterialIcons name={tab === 'videos' ? 'videocam-off' : 'music-off'} size={48} color="rgba(255,255,255,0.2)" />
                <Text style={styles.emptyText}>No {tab} found | کوئی فائل نہیں ملی</Text>
              </View>
            )}
            {mediaFiles.map(file => {
              const isActive = currentFile?.id === file.id;
              return (
                <Pressable key={file.id}
                  onPress={() => {
                    if (file.mediaType === 'video') {
                      setCurrentFile(file);
                      setPlayerMode('half');
                    } else {
                      if (isActive && audioPlaying) toggleAudio();
                      else playAudio(file);
                    }
                  }}
                  style={[styles.fileRow, {
                    borderColor: isActive ? theme.glowColor : theme.glassBorder,
                    backgroundColor: isActive ? theme.glowColor + '12' : 'transparent',
                  }]}>
                  <LinearGradient colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.02)']} style={StyleSheet.absoluteFillObject} />
                  <View style={[styles.fileIcon, {
                    backgroundColor: file.mediaType === 'video' ? 'rgba(0,200,255,0.2)' : 'rgba(255,100,200,0.2)',
                  }]}>
                    <MaterialIcons
                      name={file.mediaType === 'video' ? (isActive ? 'play-circle-filled' : 'videocam') : (isActive && audioPlaying ? 'pause' : 'music-note')}
                      size={22}
                      color={file.mediaType === 'video' ? '#00DCFF' : '#FF69B4'}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.fileName, { color: isActive ? theme.glowColor : '#fff' }]} numberOfLines={1}>
                      {file.filename}
                    </Text>
                    <Text style={styles.fileMeta}>
                      {file.duration ? formatTime(file.duration * 1000) : ''}
                      {file.width && file.height ? `  ${file.width}×${file.height}` : ''}
                      {isActive ? '  ▶ Playing' : ''}
                    </Text>
                  </View>
                  <MaterialIcons
                    name={file.mediaType === 'video' ? 'play-circle-outline' : (isActive && audioPlaying ? 'pause-circle-filled' : 'play-circle-filled')}
                    size={26}
                    color={isActive ? theme.glowColor : 'rgba(255,255,255,0.4)'}
                  />
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* PiP overlay for video */}
        {playerMode === 'pip' && currentFile?.mediaType === 'video' && (
          <Animated.View
            {...panResponder.panHandlers}
            style={[styles.pipContainer, { transform: pan.getTranslateTransform(), borderColor: theme.glassBorder }]}
          >
            <VideoCard uri={currentFile.uri} mode="pip" />
            <View style={styles.pipControls}>
              <Pressable onPress={() => setPlayerMode('half')} style={styles.pipBtn}>
                <MaterialIcons name="open-in-full" size={14} color="#fff" />
              </Pressable>
              <Pressable onPress={() => setPlayerMode('hidden')} style={styles.pipBtn}>
                <MaterialIcons name="close" size={14} color="#fff" />
              </Pressable>
            </View>
          </Animated.View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1, overflow: 'hidden', gap: 10 },
  closeBtn: { padding: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8 },
  headerTitle: { flex: 1, color: '#fff', fontSize: 16, fontWeight: '900' },
  permSmallBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 6 },
  permSmallText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  permNotice: { flexDirection: 'row', alignItems: 'center', gap: 8, margin: 12, borderRadius: 12, borderWidth: 1, overflow: 'hidden', padding: 12 },
  permNoticeText: { flex: 1, color: 'rgba(255,255,255,0.8)', fontSize: 11, lineHeight: 17 },
  video: { width: '100%', backgroundColor: '#000' },
  audioBar: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, margin: 10, borderRadius: 14, borderWidth: 1, overflow: 'hidden' },
  audioBarIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,105,180,0.25)', justifyContent: 'center', alignItems: 'center' },
  audioBarName: { color: '#fff', fontSize: 11, fontWeight: '700' },
  progressBg: { height: 3, backgroundColor: 'rgba(255,105,180,0.2)', borderRadius: 2, marginVertical: 4, overflow: 'hidden' },
  progressFill: { height: 3, borderRadius: 2 },
  audioBarTime: { color: 'rgba(255,255,255,0.5)', fontSize: 9 },
  audioBarPlayBtn: { width: 38, height: 38, borderRadius: 19, justifyContent: 'center', alignItems: 'center' },
  audioBarStop: { padding: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8 },
  tabRow: { flexDirection: 'row', gap: 8, padding: 10 },
  tabBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: 20, borderWidth: 1, paddingVertical: 10 },
  tabText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  fileRow: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 14, borderWidth: 1, overflow: 'hidden', padding: 12 },
  fileIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  fileName: { fontSize: 12, fontWeight: '700' },
  fileMeta: { color: 'rgba(255,255,255,0.5)', fontSize: 10, marginTop: 2 },
  emptyWrap: { alignItems: 'center', gap: 12, paddingVertical: 50 },
  emptyText: { color: 'rgba(255,255,255,0.5)', fontSize: 14, fontWeight: '600' },
  pipContainer: { position: 'absolute', width: 200, height: 130, zIndex: 999, borderRadius: 12, overflow: 'hidden', borderWidth: 1.5 },
  pipControls: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 8, padding: 5, backgroundColor: 'rgba(0,0,0,0.65)' },
  pipBtn: { padding: 5, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 6 },
});
