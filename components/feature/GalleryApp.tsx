import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View, Text, Pressable, StyleSheet, FlatList, Dimensions,
  Modal, Alert, ScrollView, Animated,
} from 'react-native';
import { Image } from 'expo-image';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Audio } from 'expo-av';
import * as MediaLibrary from 'expo-media-library';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBrowserContext } from '@/contexts/BrowserContext';

const SW = Dimensions.get('window').width;
const THUMB = (SW - 8) / 3;

type MediaTab = 'photos' | 'videos' | 'audio' | 'albums';

interface GalleryAppProps { visible: boolean; onClose: () => void; }

function formatDuration(seconds: number): string {
  if (!seconds) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

/** Video player using expo-video (required per stack constraints) */
function VideoPlayerWrapper({ uri }: { uri: string }) {
  const player = useVideoPlayer(uri, p => { p.play(); });
  return (
    <VideoView
      player={player}
      style={styles.viewerVideo}
      allowsFullscreen
      allowsPictureInPicture
      contentFit="contain"
    />
  );
}

/** Shows the first asset's thumbnail for an album folder */
function AlbumThumbnail({ album }: { album: MediaLibrary.Album }) {
  const [thumb, setThumb] = React.useState<string | null>(null);
  React.useEffect(() => {
    MediaLibrary.getAssetsAsync({ first: 1, album: album.id, mediaType: ['photo', 'video'] })
      .then(res => { if (res.assets[0]) setThumb(res.assets[0].uri); })
      .catch(() => {});
  }, [album.id]);

  if (thumb) {
    return <Image source={{ uri: thumb }} style={styles.albumThumb} contentFit="cover" transition={150} />;
  }
  return (
    <View style={styles.albumThumb}>
      <MaterialIcons name="photo-album" size={32} color="rgba(255,255,255,0.35)" />
    </View>
  );
}

export function GalleryApp({ visible, onClose }: GalleryAppProps) {
  const { theme } = useBrowserContext();
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = MediaLibrary.usePermissions();
  const [assets, setAssets] = useState<MediaLibrary.Asset[]>([]);
  const [albums, setAlbums] = useState<MediaLibrary.Album[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [viewingAsset, setViewingAsset] = useState<MediaLibrary.Asset | null>(null);
  const [tab, setTab] = useState<MediaTab>('photos');
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<string | undefined>(undefined);

  // Audio player state
  const soundRef = useRef<Audio.Sound | null>(null);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioPos, setAudioPos] = useState(0);
  const [audioDur, setAudioDur] = useState(0);
  const [audioAsset, setAudioAsset] = useState<MediaLibrary.Asset | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Animated glow
  const glowAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(glowAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
      Animated.timing(glowAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
    ])).start();
  }, []);
  const glowOpacity = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] });

  const mediaTypeForTab = (): MediaLibrary.MediaTypeValue[] => {
    if (tab === 'photos') return ['photo'];
    if (tab === 'videos') return ['video'];
    if (tab === 'audio') return ['audio'];
    return ['photo', 'video'];
  };

  const loadAssets = useCallback(async (reset = false) => {
    if (!permission?.granted || loading) return;
    setLoading(true);
    try {
      const res = await MediaLibrary.getAssetsAsync({
        first: 60,
        after: reset ? undefined : cursor,
        mediaType: mediaTypeForTab(),
        album: selectedAlbum || undefined,
        sortBy: [MediaLibrary.SortBy.creationTime],
      });
      setAssets(prev => reset ? res.assets : [...prev, ...res.assets]);
      setHasMore(res.hasNextPage);
      setCursor(res.endCursor);
    } catch {}
    setLoading(false);
  }, [permission, tab, selectedAlbum, cursor, loading]);

  const loadAlbums = useCallback(async () => {
    if (!permission?.granted) return;
    try {
      // Get all albums including smart albums and asset count per album
      const albumList = await MediaLibrary.getAlbumsAsync({ includeSmartAlbums: true });
      // Sort: Albums with more assets first
      const sorted = [...albumList].sort((a, b) => (b.assetCount || 0) - (a.assetCount || 0));
      setAlbums(sorted);
    } catch {}
  }, [permission]);

  useEffect(() => {
    if (visible && permission?.granted) {
      setAssets([]); setCursor(undefined); setHasMore(true);
      loadAssets(true);
      loadAlbums();
    }
  }, [visible, permission?.granted, tab, selectedAlbum]);

  // Stop audio on close
  useEffect(() => {
    if (!visible) stopAudio();
  }, [visible]);

  const stopAudio = async () => {
    if (soundRef.current) {
      try { await soundRef.current.stopAsync(); await soundRef.current.unloadAsync(); } catch {}
      soundRef.current = null;
    }
    setAudioPlaying(false); setAudioPos(0); setAudioDur(0);
    Animated.timing(pulseAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
  };

  const playAudio = async (asset: MediaLibrary.Asset) => {
    await stopAudio();
    setAudioAsset(asset);
    try {
      await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
      const { sound } = await Audio.Sound.createAsync(
        { uri: asset.uri },
        { shouldPlay: true },
        (status) => {
          if (status.isLoaded) {
            setAudioPos(status.positionMillis || 0);
            setAudioDur(status.durationMillis || 0);
            setAudioPlaying(status.isPlaying);
            if (status.didJustFinish) {
              setAudioPlaying(false);
              Animated.timing(pulseAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
            }
          }
        }
      );
      soundRef.current = sound;
      // Pulse animation
      Animated.loop(Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.12, duration: 500, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      ])).start();
    } catch (e) {
      Alert.alert('Playback Error', 'Could not play audio file.');
    }
  };

  const toggleAudioPause = async () => {
    if (!soundRef.current) return;
    if (audioPlaying) {
      await soundRef.current.pauseAsync();
      Animated.timing(pulseAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    } else {
      await soundRef.current.playAsync();
      Animated.loop(Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.12, duration: 500, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      ])).start();
    }
  };

  const handleRequestPermission = async () => {
    const res = await requestPermission();
    if (!res.granted) {
      Alert.alert('Permission Required', 'Please allow media library access in device Settings.');
    }
  };

  if (!visible) return null;

  if (!permission?.granted) {
    return (
      <Modal visible animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
        <View style={[styles.permWrap, { paddingTop: insets.top }]}>
          <LinearGradient colors={[...theme.gradient]} style={StyleSheet.absoluteFillObject} />
          <Animated.View style={{ opacity: glowOpacity }}>
            <MaterialIcons name="photo-library" size={72} color={theme.glowColor} />
          </Animated.View>
          <Text style={[styles.permTitle, { textShadowColor: theme.glowColor, textShadowRadius: 16 }]}>
            Gallery Access | گیلری رسائی
          </Text>
          <Text style={styles.permSub}>
            Allow access to browse your photos, videos and audio files.{'\n\n'}
            تصاویر، ویڈیوز اور آڈیو فائلیں براؤز کرنے کے لیے رسائی دیں۔
          </Text>
          <Pressable onPress={handleRequestPermission} style={[styles.permBtn, { backgroundColor: theme.primary }]}>
            <MaterialIcons name="lock-open" size={18} color="#fff" />
            <Text style={styles.permBtnText}>Allow Access | رسائی دیں</Text>
          </Pressable>
          <Pressable onPress={onClose} style={styles.cancelBtn}>
            <Text style={styles.cancelText}>Cancel | منسوخ</Text>
          </Pressable>
        </View>
      </Modal>
    );
  }

  const progressPct = audioDur > 0 ? (audioPos / audioDur) * 100 : 0;

  return (
    <Modal visible animationType="slide" presentationStyle="fullScreen" onRequestClose={onClose}>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <LinearGradient colors={[...theme.gradient]} style={StyleSheet.absoluteFillObject} />

        {/* Animated live background overlay */}
        <Animated.View style={[StyleSheet.absoluteFillObject, { opacity: glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.06] }) }]}>
          <LinearGradient colors={[theme.glowColor, 'transparent', theme.primary]} style={StyleSheet.absoluteFillObject} />
        </Animated.View>

        <View style={styles.overlay}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.glassBorder }]}>
            <LinearGradient colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.06)']} style={StyleSheet.absoluteFillObject} />
            <Pressable onPress={onClose} style={styles.backBtn} hitSlop={8}>
              <MaterialIcons name="arrow-back" size={22} color="#fff" />
            </Pressable>
            <View style={{ flex: 1 }}>
              <Text style={[styles.headerTitle, { textShadowColor: theme.glowColor, textShadowRadius: 12 }]}>
                📸 Gallery | گیلری
              </Text>
              <Text style={styles.headerSub}>{assets.length} items | {assets.length} آئٹمز</Text>
            </View>
            {selectedAlbum && (
              <Pressable onPress={() => setSelectedAlbum(null)} style={styles.clearAlbumBtn} hitSlop={8}>
                <MaterialIcons name="clear" size={16} color="#FF5555" />
                <Text style={styles.clearAlbumText}>All</Text>
              </Pressable>
            )}
          </View>

          {/* Tabs */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabRow}>
            {([
              { id: 'photos', icon: 'image', label: 'Photos | تصاویر', color: '#FFD700' },
              { id: 'videos', icon: 'videocam', label: 'Videos | ویڈیوز', color: '#00DCFF' },
              { id: 'audio', icon: 'music-note', label: 'Audio | آڈیو', color: '#FF69B4' },
              { id: 'albums', icon: 'photo-album', label: 'Albums | البمز', color: '#AB47BC' },
            ] as const).map(t => (
              <Pressable key={t.id} onPress={() => setTab(t.id)}
                style={[styles.tabBtn, {
                  backgroundColor: tab === t.id ? t.color + '30' : 'rgba(255,255,255,0.12)',
                  borderColor: tab === t.id ? t.color : 'rgba(255,255,255,0.2)',
                  shadowColor: tab === t.id ? t.color : 'transparent',
                  shadowOpacity: tab === t.id ? 0.7 : 0,
                  shadowRadius: 8,
                  elevation: tab === t.id ? 6 : 0,
                }]}>
                <MaterialIcons name={t.icon as any} size={14} color={tab === t.id ? t.color : 'rgba(255,255,255,0.7)'} />
                <Text style={[styles.tabBtnText, { color: tab === t.id ? t.color : 'rgba(255,255,255,0.7)' }]}>{t.label}</Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* Audio Player Bar (when audio is loaded) */}
          {audioAsset && tab === 'audio' && (
            <View style={[styles.audioPlayerBar, { borderColor: theme.glassBorder }]}>
              <LinearGradient colors={['rgba(255,105,180,0.22)', 'rgba(255,105,180,0.06)']} style={StyleSheet.absoluteFillObject} />
              <Animated.View style={[styles.audioIcon, { transform: [{ scale: pulseAnim }], backgroundColor: '#FF69B4' + '33' }]}>
                <MaterialIcons name="music-note" size={20} color="#FF69B4" />
              </Animated.View>
              <View style={{ flex: 1 }}>
                <Text style={styles.audioTitle} numberOfLines={1}>{audioAsset.filename}</Text>
                <View style={styles.progressWrap}>
                  <View style={[styles.progressBg, { backgroundColor: 'rgba(255,105,180,0.2)' }]}>
                    <View style={[styles.progressFill, { width: `${progressPct}%`, backgroundColor: '#FF69B4' }]} />
                  </View>
                </View>
                <Text style={styles.audioTime}>{formatDuration(audioPos / 1000)} / {formatDuration(audioDur / 1000)}</Text>
              </View>
              <Pressable onPress={toggleAudioPause} style={[styles.audioCtrl, { backgroundColor: '#FF69B4' }]}>
                <MaterialIcons name={audioPlaying ? 'pause' : 'play-arrow'} size={20} color="#fff" />
              </Pressable>
              <Pressable onPress={stopAudio} style={styles.audioStopBtn} hitSlop={8}>
                <MaterialIcons name="stop" size={18} color="rgba(255,255,255,0.6)" />
              </Pressable>
            </View>
          )}

          {/* Albums Grid — native gallery style with folder thumbnails */}
          {tab === 'albums' && (
            <FlatList
              data={albums}
              numColumns={2}
              keyExtractor={a => a.id}
              contentContainerStyle={styles.albumGrid}
              columnWrapperStyle={{ gap: 10 }}
              ListHeaderComponent={
                <Text style={[styles.headerSub, { paddingHorizontal: 4, paddingBottom: 6, color: 'rgba(255,255,255,0.5)', fontSize: 11 }]}>
                  {albums.length} Albums | {albums.length} فولڈرز
                </Text>
              }
              renderItem={({ item }) => (
                <Pressable onPress={() => { setSelectedAlbum(item.id); setTab('photos'); }}
                  style={({ pressed }) => [styles.albumCard, { borderColor: theme.glassBorder, opacity: pressed ? 0.85 : 1 }]}>
                  <LinearGradient colors={['rgba(255,255,255,0.18)', 'rgba(255,255,255,0.04)']} style={StyleSheet.absoluteFillObject} />
                  <AlbumThumbnail album={item} />
                  <Text style={[styles.albumName, { textShadowColor: theme.glowColor, textShadowRadius: 6 }]} numberOfLines={1}>{item.title}</Text>
                  <Text style={styles.albumCount}>{item.assetCount || 0} items</Text>
                </Pressable>
              )}
            />
          )}

          {/* Photo Grid */}
          {(tab === 'photos' || tab === 'videos') && (
            <FlatList
              data={assets}
              numColumns={3}
              keyExtractor={a => a.id}
              contentContainerStyle={{ gap: 3, padding: 3 }}
              columnWrapperStyle={{ gap: 3 }}
              onEndReached={() => hasMore && loadAssets(false)}
              onEndReachedThreshold={0.5}
              ListEmptyComponent={!loading ? (
                <View style={styles.emptyWrap}>
                  <MaterialIcons name={tab === 'videos' ? 'videocam-off' : 'image-not-supported'} size={48} color="rgba(255,255,255,0.2)" />
                  <Text style={styles.emptyText}>No {tab} found</Text>
                </View>
              ) : null}
              renderItem={({ item }) => (
                <Pressable onPress={() => setViewingAsset(item)}
                  style={({ pressed }) => [styles.thumb, { opacity: pressed ? 0.75 : 1 }]}>
                  <Image source={{ uri: item.uri }} style={styles.thumbImg} contentFit="cover" transition={150} />
                  {item.mediaType === 'video' && (
                    <View style={styles.videoBadge}>
                      <MaterialIcons name="play-arrow" size={12} color="#fff" />
                      <Text style={styles.videoDur}>{formatDuration(item.duration || 0)}</Text>
                    </View>
                  )}
                  {/* Glowing border for selected */}
                </Pressable>
              )}
            />
          )}

          {/* Audio List */}
          {tab === 'audio' && (
            <FlatList
              data={assets}
              keyExtractor={a => a.id}
              contentContainerStyle={{ padding: 10, gap: 8 }}
              onEndReached={() => hasMore && loadAssets(false)}
              onEndReachedThreshold={0.5}
              ListEmptyComponent={!loading ? (
                <View style={styles.emptyWrap}>
                  <MaterialIcons name="music-off" size={48} color="rgba(255,255,255,0.2)" />
                  <Text style={styles.emptyText}>No audio found | کوئی آڈیو نہیں ملی</Text>
                </View>
              ) : null}
              renderItem={({ item }) => {
                const isActive = audioAsset?.id === item.id;
                return (
                  <Pressable onPress={() => {
                    if (isActive && audioPlaying) toggleAudioPause();
                    else playAudio(item);
                  }}
                    style={[styles.audioRow, {
                      borderColor: isActive ? '#FF69B4' : theme.glassBorder,
                      backgroundColor: isActive ? 'rgba(255,105,180,0.12)' : 'transparent',
                      shadowColor: isActive ? '#FF69B4' : 'transparent',
                      shadowOpacity: isActive ? 0.6 : 0,
                      shadowRadius: 8,
                      elevation: isActive ? 6 : 0,
                    }]}>
                    <LinearGradient colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.02)']} style={StyleSheet.absoluteFillObject} />
                    <Animated.View style={[styles.audioThumb, {
                      backgroundColor: isActive ? '#FF69B4' + '33' : 'rgba(255,105,180,0.15)',
                      transform: isActive ? [{ scale: pulseAnim }] : [],
                    }]}>
                      <MaterialIcons
                        name={isActive && audioPlaying ? 'pause' : 'music-note'}
                        size={22}
                        color="#FF69B4"
                      />
                    </Animated.View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.audioFileName, { color: isActive ? '#FF69B4' : '#fff' }]} numberOfLines={1}>
                        {item.filename}
                      </Text>
                      <Text style={styles.audioMeta}>
                        {formatDuration(item.duration || 0)}
                        {isActive ? '  🎵 Playing...' : ''}
                      </Text>
                      {isActive && (
                        <View style={styles.miniProgress}>
                          <View style={[styles.miniProgressFill, { width: `${progressPct}%`, backgroundColor: '#FF69B4' }]} />
                        </View>
                      )}
                    </View>
                    <MaterialIcons
                      name={isActive && audioPlaying ? 'pause-circle-filled' : 'play-circle-filled'}
                      size={30}
                      color={isActive ? '#FF69B4' : 'rgba(255,255,255,0.3)'}
                    />
                  </Pressable>
                );
              }}
            />
          )}
        </View>
      </View>

      {/* Asset Viewer */}
      {viewingAsset && (
        <Modal visible animationType="fade" onRequestClose={() => setViewingAsset(null)}>
          <View style={styles.viewer}>
            <LinearGradient colors={['#000', '#050510', '#000']} style={StyleSheet.absoluteFillObject} />
            <View style={[styles.viewerHeader, { paddingTop: insets.top }]}>
              <Pressable onPress={() => setViewingAsset(null)} style={styles.viewerClose} hitSlop={8}>
                <MaterialIcons name="close" size={24} color="#fff" />
              </Pressable>
              <Text style={[styles.viewerTitle, { textShadowColor: theme.glowColor, textShadowRadius: 8 }]} numberOfLines={1}>
                {viewingAsset.filename}
              </Text>
              <Pressable style={styles.viewerShare} hitSlop={8}>
                <MaterialIcons name="share" size={20} color="#fff" />
              </Pressable>
            </View>

            {viewingAsset.mediaType === 'video' ? (
              <VideoPlayerWrapper uri={viewingAsset.uri} />
            ) : (
              <Image
                source={{ uri: viewingAsset.uri }}
                style={styles.viewerImage}
                contentFit="contain"
                transition={300}
              />
            )}

            <LinearGradient colors={['transparent', 'rgba(0,0,0,0.9)']}
              style={[styles.viewerInfo, { paddingBottom: insets.bottom + 16 }]}>
              <Text style={styles.viewerFilename}>{viewingAsset.filename}</Text>
              <Text style={styles.viewerMeta}>
                {viewingAsset.mediaType === 'video' ? `🎬 Video • ${formatDuration(viewingAsset.duration || 0)}` : '📷 Photo'}
                {viewingAsset.width ? `  •  ${viewingAsset.width}×${viewingAsset.height}` : ''}
                {' • '}{new Date(viewingAsset.creationTime).toLocaleDateString('en-PK')}
              </Text>
            </LinearGradient>
          </View>
        </Modal>
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.25)' },
  permWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 18, padding: 32, overflow: 'hidden' },
  permTitle: { color: '#fff', fontSize: 22, fontWeight: '900', textAlign: 'center' },
  permSub: { color: 'rgba(255,255,255,0.75)', fontSize: 13, textAlign: 'center', lineHeight: 22 },
  permBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 50, paddingVertical: 14, paddingHorizontal: 28 },
  permBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' },
  cancelBtn: { marginTop: 4, padding: 10 },
  cancelText: { color: 'rgba(255,255,255,0.6)', fontSize: 13 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 12, borderBottomWidth: 1, overflow: 'hidden', gap: 12 },
  backBtn: { padding: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8 },
  headerTitle: { color: '#fff', fontSize: 17, fontWeight: '900' },
  headerSub: { color: 'rgba(255,255,255,0.6)', fontSize: 10, marginTop: 2 },
  clearAlbumBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255,85,85,0.18)', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 5 },
  clearAlbumText: { color: '#FF5555', fontSize: 11, fontWeight: '700' },
  tabRow: { paddingHorizontal: 10, paddingVertical: 8, gap: 7 },
  tabBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 20, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 7 },
  tabBtnText: { fontSize: 11, fontWeight: '700' },
  albumGrid: { padding: 12, gap: 10 },
  albumCard: { flex: 1, borderRadius: 14, borderWidth: 1, overflow: 'hidden', alignItems: 'center', gap: 6, minHeight: 140 },
  albumThumb: { width: '100%', height: 90, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.08)', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  albumName: { color: '#fff', fontSize: 12, fontWeight: '800', textAlign: 'center', paddingHorizontal: 6, paddingTop: 4 },
  albumCount: { color: 'rgba(255,255,255,0.55)', fontSize: 10 },
  thumb: { width: THUMB, height: THUMB, overflow: 'hidden' },
  thumbImg: { width: '100%', height: '100%' },
  videoBadge: { position: 'absolute', bottom: 3, left: 3, flexDirection: 'row', alignItems: 'center', gap: 2, backgroundColor: 'rgba(0,0,0,0.75)', borderRadius: 7, paddingHorizontal: 5, paddingVertical: 2 },
  videoDur: { color: '#fff', fontSize: 8, fontWeight: '700' },
  emptyWrap: { alignItems: 'center', gap: 10, paddingVertical: 60 },
  emptyText: { color: 'rgba(255,255,255,0.4)', fontSize: 14, fontWeight: '600' },
  // Audio player bar
  audioPlayerBar: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10, borderTopWidth: 1, borderBottomWidth: 1, overflow: 'hidden' },
  audioIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  audioTitle: { color: '#fff', fontSize: 11, fontWeight: '700' },
  progressWrap: { marginTop: 5 },
  progressBg: { height: 3, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: 3, borderRadius: 2 },
  audioTime: { color: 'rgba(255,255,255,0.5)', fontSize: 9, marginTop: 2 },
  audioCtrl: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  audioStopBtn: { padding: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8 },
  // Audio list
  audioRow: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 14, borderWidth: 1, overflow: 'hidden', padding: 12 },
  audioThumb: { width: 46, height: 46, borderRadius: 23, justifyContent: 'center', alignItems: 'center' },
  audioFileName: { fontSize: 12, fontWeight: '700' },
  audioMeta: { color: 'rgba(255,255,255,0.5)', fontSize: 10, marginTop: 2 },
  miniProgress: { height: 3, backgroundColor: 'rgba(255,105,180,0.2)', borderRadius: 2, marginTop: 5, overflow: 'hidden' },
  miniProgressFill: { height: 3, borderRadius: 2 },
  // Viewer
  viewer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  viewerHeader: { position: 'absolute', top: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', padding: 14, zIndex: 10, backgroundColor: 'rgba(0,0,0,0.7)' },
  viewerClose: { padding: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8 },
  viewerTitle: { flex: 1, color: '#fff', fontSize: 12, fontWeight: '700', marginHorizontal: 8 },
  viewerShare: { padding: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8 },
  viewerVideo: { width: '100%', height: '70%' },
  viewerImage: { width: '100%', height: '100%' },
  viewerInfo: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16 },
  viewerFilename: { color: '#fff', fontSize: 13, fontWeight: '800' },
  viewerMeta: { color: 'rgba(255,255,255,0.6)', fontSize: 11, marginTop: 4 },
});
