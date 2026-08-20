import React, { useState, useMemo } from 'react';
import {
  View, Text, Pressable, StyleSheet, FlatList, TextInput, Modal, Alert, ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBrowserContext, SavedPassword } from '@/contexts/BrowserContext';

interface PasswordManagerProps {
  visible: boolean;
  onClose: () => void;
  onAutoFill?: (username: string, password: string) => void;
  filterDomain?: string;
}

function maskPassword(p: string) { return '•'.repeat(Math.min(p.length, 10)); }

export function PasswordManager({ visible, onClose, onAutoFill, filterDomain }: PasswordManagerProps) {
  const { theme, passwords, addPassword, deletePassword, updatePassword } = useBrowserContext();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const [editingPwd, setEditingPwd] = useState<Partial<SavedPassword> | null>(null);
  const [showPwdIds, setShowPwdIds] = useState<Set<string>>(new Set());
  const [isNew, setIsNew] = useState(false);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    let list = passwords;
    if (filterDomain) list = list.filter(p => p.domain.includes(filterDomain));
    if (q) list = list.filter(p => p.domain.toLowerCase().includes(q) || p.username.toLowerCase().includes(q) || p.title.toLowerCase().includes(q));
    return list;
  }, [passwords, search, filterDomain]);

  const toggleShowPwd = (id: string) => {
    setShowPwdIds(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const handleSave = () => {
    if (!editingPwd?.domain || !editingPwd?.username || !editingPwd?.password) {
      Alert.alert('Required Fields', 'Please fill domain, username and password | تمام فیلڈ بھریں');
      return;
    }
    if (isNew) {
      addPassword({
        domain: editingPwd.domain,
        username: editingPwd.username,
        password: editingPwd.password,
        title: editingPwd.title || editingPwd.domain,
      });
    } else if (editingPwd.id) {
      updatePassword(editingPwd.id, editingPwd);
    }
    setEditingPwd(null);
    setIsNew(false);
  };

  const handleDelete = (id: string, domain: string) => {
    Alert.alert('Delete Password', `Remove "${domain}"?\n"${domain}" حذف کریں؟`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deletePassword(id) },
    ]);
  };

  const handleAutoFill = (pwd: SavedPassword) => {
    if (onAutoFill) { onAutoFill(pwd.username, pwd.password); onClose(); }
  };

  const renderItem = ({ item }: { item: SavedPassword }) => {
    const isVisible = showPwdIds.has(item.id);
    return (
      <View style={[styles.item, { borderColor: theme.glassBorder }]}>
        <LinearGradient colors={['rgba(255,255,255,0.12)', 'rgba(255,255,255,0.03)']} style={StyleSheet.absoluteFillObject} />
        {/* Domain icon */}
        <View style={[styles.domainIcon, { backgroundColor: theme.cardBg }]}>
          <MaterialIcons name="lock" size={18} color={theme.glowColor} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.itemDomain} numberOfLines={1}>{item.title || item.domain}</Text>
          <Text style={styles.itemUsername}>{item.username}</Text>
          <Text style={styles.itemPwd}>{isVisible ? item.password : maskPassword(item.password)}</Text>
        </View>
        <View style={styles.itemActions}>
          <Pressable onPress={() => toggleShowPwd(item.id)} style={styles.actionBtn} hitSlop={8}>
            <MaterialIcons name={isVisible ? 'visibility-off' : 'visibility'} size={16} color="rgba(255,255,255,0.6)" />
          </Pressable>
          <Pressable onPress={() => { setEditingPwd({ ...item }); setIsNew(false); }} style={styles.actionBtn} hitSlop={8}>
            <MaterialIcons name="edit" size={16} color="rgba(255,255,255,0.6)" />
          </Pressable>
          {onAutoFill && (
            <Pressable onPress={() => handleAutoFill(item)} style={[styles.actionBtn, { backgroundColor: theme.cardBg }]} hitSlop={8}>
              <MaterialIcons name="autofill" size={16} color={theme.glowColor} />
            </Pressable>
          )}
          <Pressable onPress={() => handleDelete(item.id, item.domain)} style={styles.actionBtn} hitSlop={8}>
            <MaterialIcons name="delete" size={16} color="#FF5555" />
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <LinearGradient colors={[...theme.gradient]} style={StyleSheet.absoluteFillObject} />
        <View style={styles.overlay}>

          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.glassBorder }]}>
            <LinearGradient colors={['rgba(255,255,255,0.22)', 'rgba(255,255,255,0.05)']} style={StyleSheet.absoluteFillObject} />
            <View>
              <Text style={[styles.headerTitle, { textShadowColor: theme.glowColor, textShadowRadius: 8 }]}>
                🔑 Password Vault | پاسورڈ والٹ
              </Text>
              <Text style={styles.headerSub}>{passwords.length} saved | {passwords.length} محفوظ</Text>
            </View>
            <View style={styles.headerRight}>
              <Pressable onPress={() => { setEditingPwd({ domain: '', username: '', password: '', title: '' }); setIsNew(true); }}
                style={[styles.addBtn, { backgroundColor: theme.primary }]}>
                <MaterialIcons name="add" size={18} color="#fff" />
                <Text style={styles.addBtnText}>Add</Text>
              </Pressable>
              <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={8}>
                <MaterialIcons name="close" size={22} color="#fff" />
              </Pressable>
            </View>
          </View>

          {/* Search */}
          <View style={[styles.searchWrap, { borderColor: theme.glassBorder }]}>
            <LinearGradient colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.06)']} style={StyleSheet.absoluteFillObject} />
            <MaterialIcons name="search" size={16} color="rgba(255,255,255,0.6)" />
            <TextInput style={styles.searchInput} value={search} onChangeText={setSearch}
              placeholder="Search passwords... | پاسورڈ تلاش کریں"
              placeholderTextColor="rgba(255,255,255,0.4)" autoCapitalize="none" />
          </View>

          {/* Security Notice */}
          <View style={[styles.noticeCard, { borderColor: '#FFD70055' }]}>
            <LinearGradient colors={['rgba(255,215,0,0.1)', 'transparent']} style={StyleSheet.absoluteFillObject} />
            <MaterialIcons name="shield" size={16} color="#FFD700" />
            <Text style={styles.noticeText}>
              Passwords stored locally on device | پاسورڈ ڈیوائس پر محفوظ
            </Text>
          </View>

          {/* List */}
          {filtered.length === 0 ? (
            <View style={styles.emptyWrap}>
              <MaterialIcons name="lock" size={60} color="rgba(255,255,255,0.2)" />
              <Text style={styles.emptyTitle}>{search ? 'No results' : 'No passwords saved yet'}</Text>
              <Text style={styles.emptyTitleUr}>{search ? 'کوئی نتیجہ نہیں' : 'ابھی تک کوئی پاسورڈ نہیں'}</Text>
              <Pressable onPress={() => { setEditingPwd({ domain: '', username: '', password: '', title: '' }); setIsNew(true); }}
                style={[styles.emptyAddBtn, { backgroundColor: theme.primary }]}>
                <MaterialIcons name="add" size={16} color="#fff" />
                <Text style={styles.emptyAddText}>Add Password | پاسورڈ شامل کریں</Text>
              </Pressable>
            </View>
          ) : (
            <FlatList
              data={filtered}
              keyExtractor={item => item.id}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.list}
            />
          )}
        </View>
      </View>

      {/* Edit / Add Modal */}
      {editingPwd && (
        <Modal visible transparent animationType="slide" onRequestClose={() => setEditingPwd(null)}>
          <View style={styles.editOverlay}>
            <View style={styles.editSheet}>
              <LinearGradient colors={[...theme.gradient]} style={StyleSheet.absoluteFillObject} />
              <Text style={styles.editTitle}>{isNew ? '➕ Add Password | پاسورڈ شامل' : '✏️ Edit Password | ترمیم'}</Text>
              {[
                { label: 'Website / App Name', key: 'title', placeholder: 'Google, Facebook...' },
                { label: 'Domain | ڈومین', key: 'domain', placeholder: 'google.com', keyboard: 'url' },
                { label: 'Username / Email | یوزرنیم', key: 'username', placeholder: 'user@email.com' },
                { label: 'Password | پاسورڈ', key: 'password', placeholder: 'Enter password', secure: true },
              ].map(f => (
                <View key={f.key} style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>{f.label}</Text>
                  <View style={[styles.fieldBox, { borderColor: theme.glassBorder }]}>
                    <TextInput
                      style={styles.fieldInput}
                      value={(editingPwd as any)[f.key] || ''}
                      onChangeText={v => setEditingPwd({ ...editingPwd, [f.key]: v })}
                      placeholder={f.placeholder}
                      placeholderTextColor="rgba(255,255,255,0.4)"
                      secureTextEntry={f.secure && !showPwdIds.has('new')}
                      autoCapitalize="none"
                      keyboardType={(f.keyboard as any) || 'default'}
                    />
                    {f.secure && (
                      <Pressable onPress={() => toggleShowPwd('new')} style={{ padding: 8 }}>
                        <MaterialIcons name={showPwdIds.has('new') ? 'visibility-off' : 'visibility'} size={18} color="rgba(255,255,255,0.5)" />
                      </Pressable>
                    )}
                  </View>
                </View>
              ))}
              <View style={styles.editBtns}>
                <Pressable onPress={() => { setEditingPwd(null); setIsNew(false); }} style={styles.cancelEditBtn}>
                  <Text style={styles.cancelEditText}>Cancel | منسوخ</Text>
                </Pressable>
                <Pressable onPress={handleSave} style={[styles.saveEditBtn, { backgroundColor: theme.primary }]}>
                  <MaterialIcons name="save" size={16} color="#fff" />
                  <Text style={styles.saveEditText}>Save | محفوظ</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, overflow: 'hidden', gap: 12 },
  headerTitle: { color: '#fff', fontSize: 17, fontWeight: '900' },
  headerSub: { color: 'rgba(255,255,255,0.6)', fontSize: 11, marginTop: 2 },
  headerRight: { marginLeft: 'auto', flexDirection: 'row', gap: 8, alignItems: 'center' },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  addBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  closeBtn: { padding: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8 },
  searchWrap: { flexDirection: 'row', alignItems: 'center', gap: 8, margin: 12, borderRadius: 50, borderWidth: 1, overflow: 'hidden', paddingHorizontal: 14, height: 44 },
  searchInput: { flex: 1, color: '#fff', fontSize: 13 },
  noticeCard: { flexDirection: 'row', alignItems: 'center', gap: 8, marginHorizontal: 12, marginBottom: 8, borderRadius: 10, borderWidth: 1, overflow: 'hidden', padding: 10 },
  noticeText: { color: 'rgba(255,255,255,0.7)', fontSize: 11, flex: 1 },
  list: { paddingHorizontal: 12, paddingBottom: 40, gap: 8 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 14, borderWidth: 1, overflow: 'hidden', padding: 12 },
  domainIcon: { width: 38, height: 38, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  itemDomain: { color: '#fff', fontSize: 13, fontWeight: '700' },
  itemUsername: { color: 'rgba(255,255,255,0.65)', fontSize: 11, marginTop: 2 },
  itemPwd: { color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 1, letterSpacing: 2 },
  itemActions: { flexDirection: 'column', gap: 4 },
  actionBtn: { padding: 5, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.12)' },
  emptyWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10, padding: 30 },
  emptyTitle: { color: 'rgba(255,255,255,0.6)', fontSize: 16, fontWeight: '700' },
  emptyTitleUr: { color: 'rgba(255,255,255,0.4)', fontSize: 13 },
  emptyAddBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 20, paddingVertical: 10, paddingHorizontal: 20, marginTop: 8 },
  emptyAddText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  editOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  editSheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: 'hidden', padding: 20, paddingBottom: 40, gap: 12 },
  editTitle: { color: '#fff', fontSize: 18, fontWeight: '900', marginBottom: 6 },
  fieldGroup: { gap: 5 },
  fieldLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: '600' },
  fieldBox: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, borderWidth: 1, overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.1)', minHeight: 46 },
  fieldInput: { flex: 1, color: '#fff', fontSize: 13, paddingHorizontal: 14, paddingVertical: 12 },
  editBtns: { flexDirection: 'row', gap: 10, marginTop: 8 },
  cancelEditBtn: { flex: 1, alignItems: 'center', paddingVertical: 13, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  cancelEditText: { color: 'rgba(255,255,255,0.8)', fontWeight: '700' },
  saveEditBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 13, borderRadius: 12 },
  saveEditText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
