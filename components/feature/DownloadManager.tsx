import React, { useState } from 'react';
import {
  View, Text, Pressable, StyleSheet, FlatList,
  Share, Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassModal } from '@/components/ui/GlassModal';
import { useBrowserContext } from '@/contexts/BrowserContext';

export interface DownloadItem {
  id: string;
  filename: string;
  url: string;
  size: string;
  type: 'video' | 'audio' | 'image' | 'pdf' | 'file';
  status: 'downloading' | 'completed' | 'failed' | 'paused';
  progress: number;
  createdAt: number;
  localUri?: string;
}

interface DownloadManagerProps {
  visible: boolean;
  onClose: () => void;
  onOpenFile?: (item: DownloadItem) => void;
}

const TYPE_ICONS: Record<string, string> = {
  video: 'videocam',
  audio: 'audiotrack',
  image: 'image',
  pdf: 'picture-as-pdf',
  file: 'insert-drive-file',
};

const TYPE_COLORS: Record<string, string> = {
  video: '#E91E63',
  audio: '#9C27B0',
  image: '#2196F3',
  pdf: '#F44336',
  file: '#607D8B',
};

function ProgressBar({ progress, color }: { progress: number; color: string }) {
  return (
    <View style={styles.progressBg}>
      <View style={[styles.progressFill, { width: `${Math.min(100, progress)}%` as any, backgroundColor: color }]} />
    </View>
  );
}

export function DownloadManager({ visible, onClose, onOpenFile }: DownloadManagerProps) {
  const { downloads, deleteDownload, clearDownloads } = useBrowserContext();
  const [filter, setFilter] = useState<'all' | 'video' | 'audio' | 'image' | 'pdf' | 'file'>('all');

  const filtered = downloads.filter(d => filter === 'all' || d.type === filter);

  const handleShare = async (item: DownloadItem) => {
    try {
      await Share.share({ message: `${item.filename}\n${item.url}`, url: item.localUri || item.url });
    } catch {}
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete Download', 'Remove this download? | یہ ڈاؤنلوڈ حذف کریں؟', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteDownload(id) },
    ]);
  };

  const handleClearAll = () => {
    Alert.alert('Clear All', 'Remove all downloads? | تمام ڈاؤنلوڈز حذف کریں؟', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear All', style: 'destructive', onPress: clearDownloads },
    ]);
  };

  const statusColor = (s: string) => {
    if (s === 'completed') return '#4CAF50';
    if (s === 'failed') return '#F44336';
    if (s === 'paused') return '#FF9800';
    return '#2196F3';
  };

  return (
    <GlassModal visible={visible} onClose={onClose} title="📥 Downloads | ڈاؤنلوڈز" titleUr="تمام فائلیں" fullScreen>

      {/* Filter row */}
      <FlatList
        horizontal
        data={['all', 'video', 'audio', 'image', 'pdf', 'file'] as const}
        keyExtractor={f => f}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8, marginBottom: 14 }}
        renderItem={({ item: f }) => (
          <Pressable onPress={() => setFilter(f)}
            style={[styles.filterTab, { backgroundColor: filter === f ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.12)', borderColor: filter === f ? '#fff' : 'rgba(255,255,255,0.25)' }]}>
            {f !== 'all' && <MaterialIcons name={TYPE_ICONS[f] as any} size={13} color="#fff" />}
            <Text style={styles.filterText}>{f.toUpperCase()}</Text>
          </Pressable>
        )}
      />

      {/* Clear all button */}
      {downloads.length > 0 && (
        <Pressable onPress={handleClearAll} style={styles.clearBtn}>
          <MaterialIcons name="delete-sweep" size={16} color="rgba(255,100,100,0.9)" />
          <Text style={styles.clearBtnText}>Clear All | سب حذف کریں</Text>
        </Pressable>
      )}

      {filtered.length === 0 ? (
        <View style={styles.empty}>
          <MaterialIcons name="download-done" size={52} color="rgba(255,255,255,0.25)" />
          <Text style={styles.emptyText}>No downloads | کوئی ڈاؤنلوڈ نہیں</Text>
          <Text style={styles.emptySubText}>Files downloaded via the browser will appear here</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={d => d.id}
          scrollEnabled={false}
          contentContainerStyle={{ gap: 10 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <LinearGradient colors={['rgba(255,255,255,0.16)', 'rgba(255,255,255,0.04)']} style={StyleSheet.absoluteFillObject} />
              <View style={[styles.typeIcon, { backgroundColor: TYPE_COLORS[item.type] + '33' }]}>
                <MaterialIcons name={TYPE_ICONS[item.type] as any} size={22} color={TYPE_COLORS[item.type]} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.filename} numberOfLines={1}>{item.filename}</Text>
                <Text style={styles.fileSize}>{item.size} • <Text style={[styles.status, { color: statusColor(item.status) }]}>{item.status.toUpperCase()}</Text></Text>
                {item.status === 'downloading' && (
                  <ProgressBar progress={item.progress} color={TYPE_COLORS[item.type]} />
                )}
                <Text style={styles.fileUrl} numberOfLines={1}>{item.url.replace(/^https?:\/\//, '')}</Text>
              </View>
              <View style={styles.actions}>
                {item.status === 'completed' && onOpenFile && (
                  <Pressable onPress={() => { onOpenFile(item); onClose(); }} hitSlop={6} style={styles.actionBtn}>
                    <MaterialIcons name="play-circle-outline" size={20} color="#4CAF50" />
                  </Pressable>
                )}
                <Pressable onPress={() => handleShare(item)} hitSlop={6} style={styles.actionBtn}>
                  <MaterialIcons name="share" size={18} color="rgba(255,255,255,0.7)" />
                </Pressable>
                <Pressable onPress={() => handleDelete(item.id)} hitSlop={6} style={styles.actionBtn}>
                  <MaterialIcons name="delete-outline" size={18} color="rgba(255,100,100,0.8)" />
                </Pressable>
              </View>
            </View>
          )}
        />
      )}
    </GlassModal>
  );
}

const styles = StyleSheet.create({
  filterTab: { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 20, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 6 },
  filterText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  clearBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10, alignSelf: 'flex-end' },
  clearBtnText: { color: 'rgba(255,100,100,0.9)', fontSize: 12, fontWeight: '600' },
  empty: { alignItems: 'center', paddingVertical: 50, gap: 12 },
  emptyText: { color: 'rgba(255,255,255,0.5)', fontSize: 15, fontWeight: '600' },
  emptySubText: { color: 'rgba(255,255,255,0.35)', fontSize: 12, textAlign: 'center', paddingHorizontal: 30 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)', overflow: 'hidden', padding: 12 },
  typeIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  filename: { color: '#fff', fontSize: 13, fontWeight: '700' },
  fileSize: { color: 'rgba(255,255,255,0.6)', fontSize: 10, marginTop: 2 },
  status: { fontWeight: '800' },
  fileUrl: { color: 'rgba(255,255,255,0.4)', fontSize: 9, marginTop: 3 },
  progressBg: { height: 3, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 2, marginTop: 4 },
  progressFill: { height: 3, borderRadius: 2 },
  actions: { flexDirection: 'column', gap: 4 },
  actionBtn: { padding: 4 },
});
