import React, { useState } from 'react';
import {
  View, Text, Pressable, StyleSheet, TextInput,
  FlatList, Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassModal } from '@/components/ui/GlassModal';
import { useBrowserContext } from '@/contexts/BrowserContext';

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  folder: string;
  createdAt: number;
}

interface BookmarkManagerProps {
  visible: boolean;
  onClose: () => void;
  onOpen: (url: string) => void;
  currentUrl?: string;
  currentTitle?: string;
}

const FOLDER_COLORS: Record<string, string> = {
  'All': '#6C63FF',
  'News': '#E74C3C',
  'Islamic': '#27AE60',
  'Social': '#3498DB',
  'AI': '#9B59B6',
  'Work': '#F39C12',
  'Entertainment': '#E91E63',
};

function getFolderColor(folder: string) {
  return FOLDER_COLORS[folder] || '#607D8B';
}

export function BookmarkManager({ visible, onClose, onOpen, currentUrl, currentTitle }: BookmarkManagerProps) {
  const { bookmarks, addBookmark, deleteBookmark, editBookmark } = useBrowserContext();
  const [activeFolder, setActiveFolder] = useState('All');
  const [searchQ, setSearchQ] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editFolder, setEditFolder] = useState('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState(currentTitle || '');
  const [newFolder, setNewFolder] = useState('All');

  const folders = ['All', ...Array.from(new Set(bookmarks.map(b => b.folder).filter(f => f !== 'All')))];

  const filtered = bookmarks.filter(b => {
    const inFolder = activeFolder === 'All' || b.folder === activeFolder;
    const inSearch = !searchQ || b.title.toLowerCase().includes(searchQ.toLowerCase()) || b.url.toLowerCase().includes(searchQ.toLowerCase());
    return inFolder && inSearch;
  });

  const handleAdd = () => {
    if (!currentUrl) return;
    addBookmark({ title: newTitle || currentUrl, url: currentUrl, folder: newFolder });
    setShowAddForm(false);
    setNewTitle('');
    setNewFolder('All');
  };

  const handleSaveEdit = () => {
    if (!editingId) return;
    editBookmark(editingId, { title: editTitle, folder: editFolder });
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete Bookmark', 'Remove this bookmark? | یہ بک مارک ہٹائیں؟', [
      { text: 'Cancel | منسوخ', style: 'cancel' },
      { text: 'Delete | حذف', style: 'destructive', onPress: () => deleteBookmark(id) },
    ]);
  };

  return (
    <GlassModal visible={visible} onClose={onClose} title="🔖 Bookmarks | بک مارکس" titleUr="محفوظ ویب پیجز" fullScreen>

      {/* Add Bookmark Banner */}
      {currentUrl && !showAddForm && (
        <Pressable onPress={() => { setShowAddForm(true); setNewTitle(currentTitle || currentUrl); }} style={styles.addBanner}>
          <LinearGradient colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.08)']} style={StyleSheet.absoluteFillObject} />
          <MaterialIcons name="bookmark-add" size={20} color="#fff" />
          <Text style={styles.addBannerText}>Bookmark current page | موجودہ صفحہ محفوظ کریں</Text>
        </Pressable>
      )}

      {/* Add Form */}
      {showAddForm && (
        <View style={styles.addForm}>
          <LinearGradient colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.06)']} style={StyleSheet.absoluteFillObject} />
          <Text style={styles.formLabel}>Title | عنوان</Text>
          <View style={styles.inputBox}>
            <TextInput
              style={styles.input}
              value={newTitle}
              onChangeText={setNewTitle}
              placeholder="Page title..."
              placeholderTextColor="rgba(255,255,255,0.4)"
            />
          </View>
          <Text style={styles.formLabel}>Folder | فولڈر</Text>
          <View style={styles.folderRow}>
            {['All', 'News', 'Islamic', 'Social', 'AI', 'Work', 'Entertainment'].map(f => (
              <Pressable key={f} onPress={() => setNewFolder(f)}
                style={[styles.folderChip, { backgroundColor: newFolder === f ? getFolderColor(f) + 'CC' : 'rgba(255,255,255,0.15)', borderColor: newFolder === f ? '#fff' : 'rgba(255,255,255,0.3)' }]}>
                <Text style={styles.folderChipText}>{f}</Text>
              </Pressable>
            ))}
          </View>
          <View style={styles.formBtns}>
            <Pressable onPress={() => setShowAddForm(false)} style={styles.cancelBtn}>
              <Text style={styles.cancelBtnText}>Cancel | منسوخ</Text>
            </Pressable>
            <Pressable onPress={handleAdd} style={styles.saveBtn}>
              <LinearGradient colors={['rgba(255,255,255,0.35)', 'rgba(255,255,255,0.15)']} style={StyleSheet.absoluteFillObject} />
              <MaterialIcons name="bookmark-add" size={16} color="#fff" />
              <Text style={styles.saveBtnText}>Save | محفوظ</Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* Search */}
      <View style={styles.searchBox}>
        <MaterialIcons name="search" size={18} color="rgba(255,255,255,0.6)" />
        <TextInput
          style={styles.searchInput}
          value={searchQ}
          onChangeText={setSearchQ}
          placeholder="Search bookmarks | تلاش کریں"
          placeholderTextColor="rgba(255,255,255,0.4)"
        />
        {searchQ.length > 0 && (
          <Pressable onPress={() => setSearchQ('')} hitSlop={8}>
            <MaterialIcons name="close" size={16} color="rgba(255,255,255,0.6)" />
          </Pressable>
        )}
      </View>

      {/* Folder Tabs */}
      <FlatList
        horizontal
        data={folders}
        keyExtractor={f => f}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8, paddingHorizontal: 4, marginBottom: 12 }}
        renderItem={({ item: f }) => (
          <Pressable onPress={() => setActiveFolder(f)}
            style={[styles.tab, { backgroundColor: activeFolder === f ? getFolderColor(f) + 'CC' : 'rgba(255,255,255,0.15)', borderColor: activeFolder === f ? '#fff' : 'rgba(255,255,255,0.25)' }]}>
            <Text style={styles.tabText}>{f}</Text>
          </Pressable>
        )}
      />

      {/* Bookmark List */}
      {filtered.length === 0 ? (
        <View style={styles.empty}>
          <MaterialIcons name="bookmark-border" size={48} color="rgba(255,255,255,0.3)" />
          <Text style={styles.emptyText}>No bookmarks yet | ابھی کوئی بک مارک نہیں</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={b => b.id}
          scrollEnabled={false}
          renderItem={({ item: bm }) => {
            if (editingId === bm.id) {
              return (
                <View style={styles.editCard}>
                  <LinearGradient colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.06)']} style={StyleSheet.absoluteFillObject} />
                  <TextInput style={styles.editInput} value={editTitle} onChangeText={setEditTitle} autoFocus />
                  <View style={styles.folderRow}>
                    {['All', 'News', 'Islamic', 'Social', 'AI', 'Work'].map(f => (
                      <Pressable key={f} onPress={() => setEditFolder(f)}
                        style={[styles.folderChip, { backgroundColor: editFolder === f ? getFolderColor(f) + 'CC' : 'rgba(255,255,255,0.15)' }]}>
                        <Text style={styles.folderChipText}>{f}</Text>
                      </Pressable>
                    ))}
                  </View>
                  <View style={styles.formBtns}>
                    <Pressable onPress={() => setEditingId(null)} style={styles.cancelBtn}><Text style={styles.cancelBtnText}>Cancel</Text></Pressable>
                    <Pressable onPress={handleSaveEdit} style={styles.saveBtn}>
                      <LinearGradient colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']} style={StyleSheet.absoluteFillObject} />
                      <Text style={styles.saveBtnText}>Save</Text>
                    </Pressable>
                  </View>
                </View>
              );
            }
            return (
              <Pressable onPress={() => { onOpen(bm.url); onClose(); }}
                style={styles.bookmarkCard}>
                <LinearGradient colors={['rgba(255,255,255,0.18)', 'rgba(255,255,255,0.04)']} style={StyleSheet.absoluteFillObject} />
                <View style={[styles.folderDot, { backgroundColor: getFolderColor(bm.folder) }]} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.bmTitle} numberOfLines={1}>{bm.title}</Text>
                  <Text style={styles.bmUrl} numberOfLines={1}>{bm.url.replace(/^https?:\/\//, '')}</Text>
                  <Text style={styles.bmFolder}>{bm.folder}</Text>
                </View>
                <Pressable onPress={() => { setEditingId(bm.id); setEditTitle(bm.title); setEditFolder(bm.folder); }} hitSlop={8} style={styles.iconBtn}>
                  <MaterialIcons name="edit" size={16} color="rgba(255,255,255,0.7)" />
                </Pressable>
                <Pressable onPress={() => handleDelete(bm.id)} hitSlop={8} style={styles.iconBtn}>
                  <MaterialIcons name="delete-outline" size={16} color="rgba(255,100,100,0.8)" />
                </Pressable>
              </Pressable>
            );
          }}
          contentContainerStyle={{ gap: 8 }}
        />
      )}
    </GlassModal>
  );
}

const styles = StyleSheet.create({
  addBanner: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)', overflow: 'hidden', padding: 12, marginBottom: 12 },
  addBannerText: { color: '#fff', fontWeight: '600', fontSize: 13, flex: 1 },
  addForm: { borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)', overflow: 'hidden', padding: 14, marginBottom: 12, gap: 8 },
  formLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: '600' },
  inputBox: { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 10, paddingHorizontal: 12, height: 42 },
  input: { color: '#fff', fontSize: 13, height: 42 },
  folderRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  folderChip: { borderRadius: 20, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 5 },
  folderChipText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  formBtns: { flexDirection: 'row', gap: 10, marginTop: 4 },
  cancelBtn: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  cancelBtnText: { color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: '600' },
  saveBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 10, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)' },
  saveBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  searchBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 50, paddingHorizontal: 12, height: 40, marginBottom: 10 },
  searchInput: { flex: 1, color: '#fff', fontSize: 13 },
  tab: { borderRadius: 20, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 6 },
  tabText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  empty: { alignItems: 'center', paddingVertical: 40, gap: 12 },
  emptyText: { color: 'rgba(255,255,255,0.5)', fontSize: 14, textAlign: 'center' },
  bookmarkCard: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)', overflow: 'hidden', padding: 12 },
  folderDot: { width: 10, height: 10, borderRadius: 5 },
  bmTitle: { color: '#fff', fontSize: 13, fontWeight: '700' },
  bmUrl: { color: 'rgba(255,255,255,0.6)', fontSize: 10, marginTop: 2 },
  bmFolder: { color: 'rgba(255,255,255,0.45)', fontSize: 9, marginTop: 2 },
  iconBtn: { padding: 6 },
  editCard: { borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)', overflow: 'hidden', padding: 12, gap: 8 },
  editInput: { color: '#fff', fontSize: 13, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 10, paddingHorizontal: 12, height: 40 },
});
