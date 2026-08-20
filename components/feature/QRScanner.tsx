import React, { useState, useRef } from 'react';
import {
  View, Text, Pressable, StyleSheet, Modal, Alert, TextInput, Dimensions,
} from 'react-native';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBrowserContext } from '@/contexts/BrowserContext';

const SW = Dimensions.get('window').width;
const BOX = SW * 0.7;

interface QRScannerProps {
  visible: boolean;
  onClose: () => void;
  onResult: (url: string) => void;
}

export function QRScanner({ visible, onClose, onResult }: QRScannerProps) {
  const { theme, addNotification } = useBrowserContext();
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [scanResult, setScanResult] = useState('');
  const [torch, setTorch] = useState(false);
  const [tab, setTab] = useState<'scan' | 'history'>('scan');
  const [scanHistory, setScanHistory] = useState<{ value: string; type: string; ts: number }[]>([]);

  const handleBarcodeScanned = (result: BarcodeScanningResult) => {
    if (scanned) return;
    setScanned(true);
    setScanResult(result.data);
    setScanHistory(prev => [{ value: result.data, type: result.type, ts: Date.now() }, ...prev.slice(0, 19)]);
    addNotification({ title: '📷 QR Code Scanned', message: result.data.substring(0, 60), type: 'info' });
  };

  const handleOpen = (val: string) => {
    const url = val.startsWith('http') ? val : `https://www.google.com/search?q=${encodeURIComponent(val)}`;
    onResult(url);
    onClose();
  };

  const handleRescan = () => { setScanned(false); setScanResult(''); };

  if (!visible) return null;

  const renderPermission = () => (
    <View style={styles.permWrap}>
      <LinearGradient colors={[...theme.gradient]} style={StyleSheet.absoluteFillObject} />
      <MaterialIcons name="qr-code-scanner" size={72} color="rgba(255,255,255,0.4)" />
      <Text style={styles.permTitle}>Camera Access | کیمرہ رسائی</Text>
      <Text style={styles.permSub}>
        Allow camera access to scan QR codes and barcodes.{'\n'}
        کیو آر کوڈ اسکین کرنے کے لیے کیمرہ رسائی دیں۔
      </Text>
      <Pressable onPress={requestPermission} style={[styles.permBtn, { backgroundColor: theme.primary }]}>
        <MaterialIcons name="camera-alt" size={18} color="#fff" />
        <Text style={styles.permBtnText}>Allow Camera | کیمرہ اجازت</Text>
      </Pressable>
      <Pressable onPress={onClose} style={styles.cancelBtn}>
        <Text style={styles.cancelText}>Cancel</Text>
      </Pressable>
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen" onRequestClose={onClose}>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <LinearGradient colors={[...theme.gradient]} style={StyleSheet.absoluteFillObject} />

        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.glassBorder }]}>
          <LinearGradient colors={['rgba(255,255,255,0.22)', 'rgba(255,255,255,0.05)']} style={StyleSheet.absoluteFillObject} />
          <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={8}>
            <MaterialIcons name="close" size={22} color="#fff" />
          </Pressable>
          <Text style={[styles.headerTitle, { textShadowColor: theme.glowColor, textShadowRadius: 8 }]}>
            📷 QR Scanner | اسکینر
          </Text>
          <Pressable onPress={() => setTorch(!torch)} style={[styles.torchBtn, { backgroundColor: torch ? '#FFD700' : 'rgba(255,255,255,0.2)' }]}>
            <MaterialIcons name="flashlight-on" size={18} color={torch ? '#000' : '#fff'} />
          </Pressable>
        </View>

        {/* Tabs */}
        <View style={styles.tabRow}>
          {(['scan', 'history'] as const).map(t => (
            <Pressable key={t} onPress={() => setTab(t)}
              style={[styles.tabBtn, { backgroundColor: tab === t ? theme.primary : 'rgba(255,255,255,0.15)', borderColor: tab === t ? theme.glowColor : 'rgba(255,255,255,0.2)' }]}>
              <MaterialIcons name={t === 'scan' ? 'qr-code-scanner' : 'history'} size={14} color="#fff" />
              <Text style={styles.tabText}>{t === 'scan' ? 'Scan' : 'History | ہسٹری'}</Text>
            </Pressable>
          ))}
        </View>

        {tab === 'scan' && (
          <View style={styles.scanArea}>
            {!permission?.granted ? renderPermission() : (
              <>
                {!scanned ? (
                  <View style={styles.cameraWrap}>
                    <CameraView
                      style={styles.camera}
                      facing="back"
                      enableTorch={torch}
                      barcodeScannerSettings={{ barcodeTypes: ['qr', 'pdf417', 'ean13', 'code128', 'code39', 'aztec', 'datamatrix', 'upc_e'] }}
                      onBarcodeScanned={handleBarcodeScanned}
                    />
                    {/* Scan overlay */}
                    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
                      <View style={styles.scanOverlay}>
                        <View style={styles.scanBox}>
                          {/* Corner brackets */}
                          {['tl', 'tr', 'bl', 'br'].map(c => (
                            <View key={c} style={[styles.corner, {
                              top: c.startsWith('t') ? -2 : undefined,
                              bottom: c.startsWith('b') ? -2 : undefined,
                              left: c.endsWith('l') ? -2 : undefined,
                              right: c.endsWith('r') ? -2 : undefined,
                              borderTopWidth: c.startsWith('t') ? 4 : 0,
                              borderBottomWidth: c.startsWith('b') ? 4 : 0,
                              borderLeftWidth: c.endsWith('l') ? 4 : 0,
                              borderRightWidth: c.endsWith('r') ? 4 : 0,
                              borderColor: '#00FF88',
                            }]} />
                          ))}
                          <View style={[styles.scanLine, { backgroundColor: theme.glowColor }]} />
                        </View>
                        <Text style={styles.scanHint}>Point camera at QR code | کیو آر کوڈ پر کیمرہ لگائیں</Text>
                        <Text style={styles.scanHintUr}>بارکوڈ، QR کوڈ، تمام فارمیٹ سپورٹ</Text>
                      </View>
                    </View>
                  </View>
                ) : (
                  <View style={styles.resultCard}>
                    <LinearGradient colors={['rgba(255,255,255,0.18)', 'rgba(255,255,255,0.05)']} style={StyleSheet.absoluteFillObject} />
                    <MaterialIcons name="check-circle" size={48} color="#00FF88" />
                    <Text style={styles.resultTitle}>Scanned! | اسکین ہوگیا</Text>
                    <View style={[styles.resultBox, { borderColor: theme.glassBorder }]}>
                      <Text style={styles.resultValue} selectable numberOfLines={4}>{scanResult}</Text>
                    </View>
                    <View style={styles.resultBtns}>
                      <Pressable onPress={() => handleOpen(scanResult)}
                        style={[styles.resultBtn, { backgroundColor: theme.primary }]}>
                        <MaterialIcons name="open-in-browser" size={16} color="#fff" />
                        <Text style={styles.resultBtnText}>Open | کھولیں</Text>
                      </Pressable>
                      <Pressable onPress={handleRescan} style={styles.rescanBtn}>
                        <MaterialIcons name="qr-code-scanner" size={16} color="#fff" />
                        <Text style={styles.rescanText}>Scan Again | دوبارہ</Text>
                      </Pressable>
                    </View>
                  </View>
                )}
              </>
            )}
          </View>
        )}

        {tab === 'history' && (
          <View style={styles.historyWrap}>
            {scanHistory.length === 0 ? (
              <View style={styles.emptyWrap}>
                <MaterialIcons name="history" size={52} color="rgba(255,255,255,0.2)" />
                <Text style={styles.emptyText}>No scan history | کوئی ہسٹری نہیں</Text>
              </View>
            ) : (
              scanHistory.map((h, i) => (
                <Pressable key={i} onPress={() => handleOpen(h.value)}
                  style={[styles.histItem, { borderColor: theme.glassBorder }]}>
                  <LinearGradient colors={['rgba(255,255,255,0.12)', 'rgba(255,255,255,0.03)']} style={StyleSheet.absoluteFillObject} />
                  <MaterialIcons name="qr-code" size={20} color={theme.glowColor} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.histValue} numberOfLines={1}>{h.value}</Text>
                    <Text style={styles.histMeta}>{h.type} • {new Date(h.ts).toLocaleTimeString()}</Text>
                  </View>
                  <MaterialIcons name="open-in-new" size={16} color="rgba(255,255,255,0.4)" />
                </Pressable>
              ))
            )}
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1, overflow: 'hidden', gap: 10 },
  closeBtn: { padding: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8 },
  headerTitle: { flex: 1, color: '#fff', fontSize: 16, fontWeight: '900' },
  torchBtn: { padding: 8, borderRadius: 10 },
  tabRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 12, paddingVertical: 8 },
  tabBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: 20, borderWidth: 1, paddingVertical: 8 },
  tabText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  scanArea: { flex: 1, padding: 16 },
  permWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16, overflow: 'hidden' },
  permTitle: { color: '#fff', fontSize: 20, fontWeight: '900', textAlign: 'center' },
  permSub: { color: 'rgba(255,255,255,0.75)', fontSize: 12, textAlign: 'center', lineHeight: 20 },
  permBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 50, paddingVertical: 13, paddingHorizontal: 24 },
  permBtnText: { color: '#fff', fontSize: 14, fontWeight: '800' },
  cancelBtn: { padding: 10 },
  cancelText: { color: 'rgba(255,255,255,0.5)', fontSize: 13 },
  cameraWrap: { flex: 1, borderRadius: 20, overflow: 'hidden' },
  camera: { flex: 1 },
  scanOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 20, backgroundColor: 'rgba(0,0,0,0.4)' },
  scanBox: { width: BOX, height: BOX, position: 'relative', justifyContent: 'center', alignItems: 'center' },
  corner: { position: 'absolute', width: 30, height: 30 },
  scanLine: { position: 'absolute', height: 2, width: '90%', opacity: 0.8 },
  scanHint: { color: '#fff', fontSize: 13, fontWeight: '700', textAlign: 'center', textShadowColor: '#000', textShadowRadius: 4 },
  scanHintUr: { color: 'rgba(255,255,255,0.8)', fontSize: 10, textAlign: 'center' },
  resultCard: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16, borderRadius: 20, overflow: 'hidden', padding: 24 },
  resultTitle: { color: '#fff', fontSize: 20, fontWeight: '900' },
  resultBox: { width: '100%', borderRadius: 12, borderWidth: 1, padding: 14, backgroundColor: 'rgba(255,255,255,0.1)' },
  resultValue: { color: '#fff', fontSize: 13, lineHeight: 20 },
  resultBtns: { flexDirection: 'row', gap: 12, width: '100%' },
  resultBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 12, paddingVertical: 13 },
  resultBtnText: { color: '#fff', fontSize: 14, fontWeight: '800' },
  rescanBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 12, paddingVertical: 13, backgroundColor: 'rgba(255,255,255,0.2)' },
  rescanText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  historyWrap: { flex: 1, padding: 12, gap: 8 },
  emptyWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10 },
  emptyText: { color: 'rgba(255,255,255,0.5)', fontSize: 15, fontWeight: '600' },
  histItem: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 12, borderWidth: 1, overflow: 'hidden', padding: 12 },
  histValue: { color: '#fff', fontSize: 12, fontWeight: '600' },
  histMeta: { color: 'rgba(255,255,255,0.5)', fontSize: 10, marginTop: 2 },
});
