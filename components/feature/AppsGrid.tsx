import React, { useState, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions, Alert } from 'react-native';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { GridApp, GRID_ROW1, GRID_ROW2, GRID_ROW3, GRID_ROW4 } from '@/constants/config';
import { useBrowserContext, InstalledApp } from '@/contexts/BrowserContext';
import { useAlert } from '@/template';
import { InstalledAppsPicker } from '@/components/feature/InstalledAppsPicker';

const SW = Dimensions.get('window').width;
// Icons reduced 50% — compact grid
const ICON_SIZE = Math.floor((SW - 32 - 40) / 5 * 0.65);

interface AppsGridProps {
  onHubPress: (hubId: string) => void;
  onUrlPress: (url: string) => void;
}

function AppIcon({ app, onHubPress, onUrlPress }: { app: GridApp; onHubPress: (id: string) => void; onUrlPress: (url: string) => void }) {
  const { theme } = useBrowserContext();
  const { showAlert } = useAlert();

  const handlePress = () => {
    if (app.type === 'hub' && app.hubId) onHubPress(app.hubId);
    else if (app.type === 'url' && app.url) onUrlPress(app.url);
    else showAlert('Add App', 'Customize this slot via Admin Panel\nایڈمن پینل سے ترتیب دیں');
  };

  return (
    <Pressable onPress={handlePress} style={({ pressed }) => [styles.iconWrapper, { opacity: pressed ? 0.8 : 1 }]}>
      <View style={[styles.iconBg, { width: ICON_SIZE, height: ICON_SIZE, borderRadius: 18, backgroundColor: app.bg, borderColor: theme.glassBorder }]}>
        <LinearGradient colors={['rgba(255,255,255,0.35)', 'rgba(255,255,255,0.05)']} style={StyleSheet.absoluteFillObject} />
        <Text style={styles.emoji}>{app.emoji}</Text>
      </View>
      <Text style={styles.label} numberOfLines={1}>{app.name}</Text>
      <Text style={styles.labelUr} numberOfLines={1}>{app.ur}</Text>
    </Pressable>
  );
}

function InstalledAppIcon({ app, onUrlPress, onLongPress }: { app: InstalledApp; onUrlPress: (url: string) => void; onLongPress: (app: InstalledApp) => void }) {
  const { theme } = useBrowserContext();
  return (
    <Pressable
      onPress={() => app.url && onUrlPress(app.url)}
      onLongPress={() => onLongPress(app)}
      style={({ pressed }) => [styles.iconWrapper, { opacity: pressed ? 0.8 : 1 }]}
    >
      <View style={[styles.iconBg, { width: ICON_SIZE, height: ICON_SIZE, borderRadius: 18, backgroundColor: app.bg, borderColor: theme.glassBorder }]}>
        <LinearGradient colors={['rgba(255,255,255,0.35)', 'rgba(255,255,255,0.05)']} style={StyleSheet.absoluteFillObject} />
        <Text style={styles.emoji}>{app.emoji}</Text>
      </View>
      <Text style={styles.label} numberOfLines={1}>{app.name}</Text>
      <Text style={styles.labelUr} numberOfLines={1}>{app.nameUr}</Text>
    </Pressable>
  );
}

// EmptySlot intentionally hidden — blank slots don't render, only real apps show

const APPS_PER_ROW = 5;
const INSTALLED_ROWS = 2;
const TOTAL_INSTALLED_SLOTS = APPS_PER_ROW * INSTALLED_ROWS;

export function AppsGrid({ onHubPress, onUrlPress }: AppsGridProps) {
  const { installedApps, addInstalledApp, removeInstalledApp } = useBrowserContext();
  const { showAlert } = useAlert();
  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerSlot, setPickerSlot] = useState<number | null>(null);

  const predefinedRows = [GRID_ROW1, GRID_ROW2, GRID_ROW3, ...(GRID_ROW4.length ? [GRID_ROW4] : [])];

  // Build installed rows — fill slots up to TOTAL_INSTALLED_SLOTS
  const installedSlots: (InstalledApp | null)[] = Array.from({ length: TOTAL_INSTALLED_SLOTS }, (_, i) =>
    i < installedApps.length ? installedApps[i] : null
  );

  // Split into rows of 5
  const installedRows: (InstalledApp | null)[][] = [];
  for (let i = 0; i < INSTALLED_ROWS; i++) {
    installedRows.push(installedSlots.slice(i * APPS_PER_ROW, (i + 1) * APPS_PER_ROW));
  }

  const handleEmptySlotPress = (idx: number) => {
    setPickerSlot(idx);
    setPickerVisible(true);
  };

  const handleLongPress = (app: InstalledApp) => {
    showAlert(app.name, `Remove "${app.name}" from grid?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove | ہٹائیں', style: 'destructive', onPress: () => removeInstalledApp(app.id) },
    ]);
  };

  const handleAddApp = (app: InstalledApp) => {
    addInstalledApp(app);
  };

  // Filter out empty installed slots — don't render blank icons
  const filledInstalled = installedApps.slice(0, TOTAL_INSTALLED_SLOTS);

  // Build rows of 5 from filled apps only
  const filledRows: InstalledApp[][] = [];
  for (let i = 0; i < filledInstalled.length; i += APPS_PER_ROW) {
    filledRows.push(filledInstalled.slice(i, i + APPS_PER_ROW));
  }

  return (
    <View style={styles.grid}>
      {/* Predefined Rows */}
      {predefinedRows.map((row, ri) => (
        <View key={ri} style={styles.row}>
          {row.map(app => (
            <AppIcon key={app.id} app={app} onHubPress={onHubPress} onUrlPress={onUrlPress} />
          ))}
        </View>
      ))}

      {/* My Apps — only shown when user has added apps */}
      {filledInstalled.length > 0 && (
        <>
          <View style={styles.sectionDivider}>
            <View style={[styles.dividerLine, { backgroundColor: 'rgba(255,255,255,0.15)' }]} />
            <Text style={styles.dividerLabel}>📱 My Apps | میری ایپس</Text>
            <View style={[styles.dividerLine, { backgroundColor: 'rgba(255,255,255,0.15)' }]} />
          </View>

          {filledRows.map((row, ri) => (
            <View key={`installed_${ri}`} style={styles.row}>
              {row.map(app => (
                <InstalledAppIcon
                  key={app.id}
                  app={app}
                  onUrlPress={onUrlPress}
                  onLongPress={handleLongPress}
                />
              ))}
            </View>
          ))}
        </>
      )}

      {/* Add button — always visible at end */}
      <Pressable onPress={() => { setPickerSlot(0); setPickerVisible(true); }}
        style={styles.addAppBtn}>
        <MaterialIcons name="add-circle-outline" size={16} color="rgba(255,255,255,0.4)" />
        <Text style={styles.addAppText}>Add App | ایپ شامل کریں</Text>
      </Pressable>

      {/* Apps Picker Modal */}
      <InstalledAppsPicker
        visible={pickerVisible}
        onClose={() => { setPickerVisible(false); setPickerSlot(null); }}
        onAdd={(app) => { handleAddApp(app); }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { paddingHorizontal: 8, paddingTop: 4, paddingBottom: 6, gap: 5 },
  row: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-start' },
  iconWrapper: { alignItems: 'center', width: ICON_SIZE + 6 },
  iconBg: { borderWidth: 1, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', shadowColor: '#fff', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 },
  emoji: { fontSize: ICON_SIZE * 0.40 },
  label: { color: '#fff', fontSize: 8, fontWeight: '700', marginTop: 3, textAlign: 'center', width: ICON_SIZE + 4 },
  labelUr: { color: 'rgba(255,255,255,0.65)', fontSize: 7, textAlign: 'center', width: ICON_SIZE + 4, marginTop: 1 },
  emptySlot: { borderStyle: 'dashed', backgroundColor: 'rgba(255,255,255,0.05)' },
  sectionDivider: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 4, marginVertical: 3 },
  dividerLine: { flex: 1, height: 1 },
  dividerLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 10, fontWeight: '700' },
  addAppBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderStyle: 'dashed', borderColor: 'rgba(255,255,255,0.2)', marginTop: 4, marginHorizontal: 4 },
  addAppText: { color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: '600' },
});
