import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, Pressable, StyleSheet, Modal, Dimensions,
  Animated, ScrollView, Alert, Platform, TextInput,
} from 'react-native';
import { Video, ResizeMode, Audio } from 'expo-av';
import * as MediaLibrary from 'expo-media-library';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBrowserContext } from '@/contexts/BrowserContext';

const { width: SW, height: SH } = Dimensions.get('window');

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
}

// Sample media URLs for Web testing
const SAMPLE_VIDEOS = [
  { id: 'v1', uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', filename: 'Big Buck Bunny (Sample)', mediaType: 'video' as const },
  { id: 'v2', uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', filename: 'Elephants Dream (Sample)', mediaType: 'video' as const },
  { id: 'v3', uri: 'https://www.w3schools.com/html/mov_bbb.mp4', filename: 'W3Schools Sample', mediaType: 'video' as const },
];

const SAMPLE_AUDIOS = [
  { id: 'a1', uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', filename: 'Sample Audio 1', mediaType: 'audio' as const },
  { id: 'a2', uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', filename: 'Sample Audio 2', mediaType: 'audio' as const },
];

export function MediaPlayer({ visible, onClose, initialUri }: MediaPlayerProps) {
  const { theme } = useBrowserContext();
  const insets = useSafeAreaInsets();
  
  const [permission, requestPermission] = MediaLibrary.usePermissions();
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [currentFile, setCurrentFile] = useState<MediaFile | null>(null);
  const [tab, setTab] = useState<'videos' | 'audio'>('videos');
  const [isLoading, setIsLoading] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  
  // Audio state
  const soundRef = useRef<any>(null);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioPos, setAudioPos] = useState(0);
  const [audioDur, setAudioDur] = useState(0);

  // Load device media (Android only)
  const loadDeviceMedia = async (type: 'videos' | 'audio') => {
    if (Platform.OS !== 'web' && permission?.granted) {
      setIsLoading(true);
      try {
        const mediaType = type === 'videos' ? MediaLibrary.MediaType.video : MediaLibrary.MediaType.audio;
        const res = await MediaLibrary.getAssetsAsync({
          mediaType: [mediaType],
          first: 50,
        });
        const files: MediaFile[] = res.assets.map(a => ({
          id: a.id,
          uri: a.uri,
          filename: a.filename,
          mediaType: type,
          duration: a.duration,
        }));
        setMediaFiles(files);
      } catch (error) {
        console.error('Error loading media:', error);
      }
      setIsLoading(false);
    } else {
      // Web: Use sample URLs
      setMediaFiles(type === 'videos' ? SAMPLE_VIDEOS : SAMPLE_AUDIOS);
    }
  };

  useEffect(() => {
    if (visible) {
      if (Platform.OS === 'web') {
        setMediaFiles(tab === 'videos' ? SAMPLE_VIDEOS : SAMPLE_AUDIOS);
      } else if (permission?.granted) {
        loadDeviceMedia(tab);
      } else {
        requestPermission();
      }
    }
  }, [visible, tab, permission]);

  useEffect(() => {
    if (initialUri && visible) {
      const f: MediaFile = { 
        id: 'ext', 
        uri: initialUri, 
        filename: 'External Media', 
        mediaType: tab === 'videos' ? 'video' : 'audio' 
      };
      setCurrentFile(f);
    }
  }, [initialUri, visible, tab]);

  // Audio controls
  const playAudio = async (file: MediaFile) => {
    await stopAudio();
    setCurrentFile(file);
    try {
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
    } catch (error) {
      Alert.alert('Error', 'Could not play audio');
    }
  };

  const stopAudio = async () => {
    if (soundRef.current) {
      try {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
      } catch {}
      soundRef.current = null;
    }
    setAudioPlaying(false);
    setAudioPos(0);
    setAudioDur(0);
  };

  const toggleAudio = async () => {
    if (!soundRef.current) return;
    if (audioPlaying) {
      await soundRef.current.pauseAsync();
    } else {
      await soundRef.current.playAsync();
    }
  };

  useEffect(() => {
    if (!visible) stopAudio();
  }, [visible]);

  // Custom URL handler
  const handleCustomUrl = () => {
    if (customUrl.trim()) {
      const isVideo = customUrl.includes('.mp4') || customUrl.includes('.webm');
      const f: MediaFile = {
        id: 'custom',
        uri: customUrl,
        filename: 'Custom Media',
        mediaType: isVideo ? 'video' : 'audio',
      };
      setCurrentFile(f);
      setShowUrlInput(false);
      setCustomUrl('');
    }
  };

  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  };

  const progressPct = audioDur > 0 ? (audioPos / audioDur) * 100 : 0;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <View style={[styles.container, { paddingTop: insets.top, backgroundColor: theme.primary }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.glassBorder }]}>
          <Pressable onPress={onClose} style={styles.closeBtn}>
            <MaterialIcons name="arrow-back" size={22} color="#fff" />
          </Pressable>
          <Text style={[styles.headerTitle, { color: '#fff' }]}>
            🎬 Media Player
          </Text>
          {Platform.OS === 'web' && (
            <Pressable 
              onPress={() => setShowUrlInput(!showUrlInput)}
              style={[styles.urlBtn, { backgroundColor: theme.accent }]}
            >
              <MaterialIcons name="link" size={18} color="#fff" />
            </Pressable>
          )}
        </View>

        {/* URL Input (Web only) */}
        {showUrlInput && Platform.OS === 'web' && (
          <View style={styles.urlInputContainer}>
            <TextInput
              style={[styles.urlInput, { backgroundColor: 'rgba(255,255,255,0.9)', color: '#000' }]}
              placeholder="Enter media URL (mp4, mp3...)"
              placeholderTextColor="#666"
              value={customUrl}
              onChangeText={setCustomUrl}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Pressable onPress={handleCustomUrl} style={styles.urlGoBtn}>
              <Text style={styles.urlGoText}>Load</Text>
            </Pressable>
          </View>
        )}

        {/* Permission Notice (Android) */}
        {Platform.OS !== 'web' && !permission?.granted && (
          <View style={styles.permNotice}>
            <MaterialIcons name="warning" size={16} color="#FFD700" />
            <Text style={styles.permNoticeText}>
              Storage permission needed
            </Text>
            <Pressable onPress={requestPermission} style={styles.permBtn}>
              <Text style={styles.permBtnText}>Allow</Text>
            </Pressable>
          </View>
        )}

        {/* Video Player */}
        {currentFile?.mediaType === 'video' && (
          <View style={styles.videoContainer}>
            <Video
              ref={useRef<Video>(null)}
              style={styles.video}
              source={{ uri: currentFile.uri }}
              useNativeControls={true}
              resizeMode={ResizeMode.CONTAIN}
              shouldPlay={true}
            />
          </View>
        )}

        {/* Audio Player */}
        {currentFile?.mediaType === 'audio' && (
          <View style={[styles.audioBar, { backgroundColor: theme.accent + '22' }]}>
            <MaterialIcons name="music-note" size={24} color={theme.accent} />
            <View style={styles.audioInfo}>
              <Text style={[styles.audioName, { color: '#fff' }]} numberOfLines={1}>
                {currentFile.filename}
              </Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progressPct}%`, backgroundColor: theme.accent }]} />
              </View>
              <Text style={styles.audioTime}>{formatTime(audioPos)} / {formatTime(audioDur)}</Text>
            </View>
            <Pressable onPress={toggleAudio} style={[styles.playBtn, { backgroundColor: theme.accent }]}>
              <MaterialIcons name={audioPlaying ? 'pause' : 'play-arrow'} size={24} color="#fff" />
            </Pressable>
            <Pressable onPress={stopAudio} style={styles.stopBtn}>
              <MaterialIcons name="stop" size={20} color="#fff" />
            </Pressable>
          </View>
        )}

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <Pressable 
            onPress={() => { setTab('videos'); setMediaFiles(SAMPLE_VIDEOS); }}
            style={[styles.tab, tab === 'videos' && styles.activeTab]}
          >
            <MaterialIcons name="videocam" size={18} color={tab === 'videos' ? '#fff' : '#aaa'} />
            <Text style={[styles.tabText, { color: tab === 'videos' ? '#fff' : '#aaa' }]}>Videos</Text>
          </Pressable>
          <Pressable 
            onPress={() => { setTab('audio'); setMediaFiles(SAMPLE_AUDIOS); }}
            style={[styles.tab, tab === 'audio' && styles.activeTab]}
          >
            <MaterialIcons name="music-note" size={18} color={tab === 'audio' ? '#fff' : '#aaa'} />
            <Text style={[styles.tabText, { color: tab === 'audio' ? '#fff' : '#aaa' }]}>Audio</Text>
          </Pressable>
        </View>

        {/* Media List */}
        <ScrollView style={styles.listContainer}>
          {isLoading ? (
            <View style={styles.loading}>
              <Text style={{ color: '#fff' }}>Loading...</Text>
            </View>
          ) : (
            mediaFiles.map(file => (
              <Pressable
                key={file.id}
                onPress={() => {
                  if (file.mediaType === 'video') {
                    setCurrentFile(file);
                  } else {
                    playAudio(file);
                  }
                }}
                style={[styles.fileItem, { 
                  backgroundColor: currentFile?.id === file.id ? theme.accent + '33' : 'rgba(255,255,255,0.1)',
                  borderColor: currentFile?.id === file.id ? theme.accent : 'transparent'
                }]}
              >
                <MaterialIcons 
                  name={file.mediaType === 'video' ? 'videocam' : 'music-note'} 
                  size={24} 
                  color={file.mediaType === 'video' ? '#00DCFF' : '#FF69B4'} 
                />
                <View style={styles.fileInfo}>
                  <Text style={[styles.fileName, { color: '#fff' }]} numberOfLines={1}>
                    {file.filename}
                  </Text>
                  {file.duration && (
                    <Text style={styles.fileDuration}>{formatTime(file.duration * 1000)}</Text>
                  )}
                </View>
                <MaterialIcons name="play-circle" size={28} color={theme.accent} />
              </Pressable>
            ))
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1, gap: 10 },
  closeBtn: { padding: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8 },
  headerTitle: { flex: 1, fontSize: 16, fontWeight: 'bold' },
  urlBtn: { padding: 8, borderRadius: 8 },
  urlInputContainer: { flexDirection: 'row', padding: 10, gap: 8 },
  urlInput: { flex: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 },
  urlGoBtn: { backgroundColor: '#00DCFF', paddingHorizontal: 16, borderRadius: 8, justifyContent: 'center' },
  urlGoText: { color: '#fff', fontWeight: 'bold' },
  permNotice: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, backgroundColor: 'rgba(255,215,0,0.2)', margin: 10, borderRadius: 8 },
  permNoticeText: { flex: 1, color: '#FFD700' },
  permBtn: { padding: 6, backgroundColor: '#FFD700', borderRadius: 6 },
  permBtnText: { color: '#000', fontWeight: 'bold', fontSize: 12 },
  videoContainer: { width: '100%', aspectRatio: 16/9, backgroundColor: '#000' },
  video: { width: '100%', height: '100%' },
  audioBar: { flexDirection: 'row', alignItems: 'center', padding: 12, margin: 10, borderRadius: 12, gap: 10 },
  audioInfo: { flex: 1 },
  audioName: { fontSize: 12, fontWeight: 'bold' },
  progressBar: { height: 4, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 2, marginVertical: 4, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 2 },
  audioTime: { fontSize: 10, opacity: 0.7 },
  playBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  stopBtn: { padding: 8 },
  tabContainer: { flexDirection: 'row', padding: 10, gap: 10 },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, padding: 12, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)' },
  activeTab: { backgroundColor: 'rgba(0,220,255,0.3)' },
  tabText: { fontSize: 12, fontWeight: 'bold' },
  listContainer: { flex: 1 },
  loading: { padding: 20, alignItems: 'center' },
  fileItem: { flexDirection: 'row', alignItems: 'center', padding: 12, marginHorizontal: 10, marginVertical: 4, borderRadius: 12, gap: 12, borderWidth: 1 },
  fileInfo: { flex: 1 },
  fileName: { fontSize: 13, fontWeight: '600' },
  fileDuration: { fontSize: 10, opacity: 0.6, marginTop: 2 },
});