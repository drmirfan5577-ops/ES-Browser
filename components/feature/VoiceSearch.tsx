import React, { useState, useRef } from 'react';
import {
  View, Text, Pressable, StyleSheet, Modal, Animated, Easing,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBrowserContext } from '@/contexts/BrowserContext';

interface VoiceSearchProps {
  visible: boolean;
  onClose: () => void;
  onResult: (query: string) => void;
}

// HTML page that uses Web Speech API for voice recognition
const VOICE_HTML = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { background:transparent; display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:100vh; font-family:sans-serif; gap:16px; }
  #status { color:#fff; font-size:14px; text-align:center; padding:0 20px; }
  #transcript { color:#fff; font-size:18px; font-weight:bold; text-align:center; min-height:40px; padding:0 20px; }
  #lang { color:rgba(255,255,255,0.6); font-size:12px; }
  button { padding:12px 28px; border-radius:50px; border:none; font-size:14px; font-weight:700; cursor:pointer; }
  #startBtn { background:#00FF88; color:#000; }
  #stopBtn { background:#FF5555; color:#fff; display:none; }
</style>
</head>
<body>
<div id="status">🎤 Ready to listen | سننے کے لیے تیار</div>
<div id="transcript"></div>
<div id="lang">English & Urdu supported | اردو اور انگریزی</div>
<button id="startBtn" onclick="startRecognition()">🎤 Start Listening</button>
<button id="stopBtn" onclick="stopRecognition()">⏹ Stop</button>
<script>
var recognition;
var isListening = false;
function startRecognition() {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    document.getElementById('status').innerText = 'Speech recognition not supported on this device.';
    window.ReactNativeWebView.postMessage(JSON.stringify({type:'error',msg:'Not supported'}));
    return;
  }
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SR();
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.lang = 'en-US';
  recognition.onstart = function() {
    isListening = true;
    document.getElementById('status').innerText = '🔴 Listening... | سن رہا ہوں...';
    document.getElementById('startBtn').style.display = 'none';
    document.getElementById('stopBtn').style.display = 'block';
    window.ReactNativeWebView.postMessage(JSON.stringify({type:'listening',value:true}));
  };
  recognition.onresult = function(e) {
    var transcript = '';
    for (var i = e.resultIndex; i < e.results.length; i++) {
      transcript += e.results[i][0].transcript;
    }
    document.getElementById('transcript').innerText = transcript;
    if (e.results[e.results.length-1].isFinal) {
      window.ReactNativeWebView.postMessage(JSON.stringify({type:'result',value:transcript}));
    }
  };
  recognition.onerror = function(e) {
    document.getElementById('status').innerText = 'Error: ' + e.error;
    window.ReactNativeWebView.postMessage(JSON.stringify({type:'error',msg:e.error}));
    reset();
  };
  recognition.onend = function() { reset(); };
  recognition.start();
}
function stopRecognition() { if(recognition) recognition.stop(); }
function reset() {
  isListening = false;
  document.getElementById('status').innerText = '🎤 Ready to listen | سننے کے لیے تیار';
  document.getElementById('startBtn').style.display = 'block';
  document.getElementById('stopBtn').style.display = 'none';
  document.getElementById('transcript').innerText = '';
  window.ReactNativeWebView.postMessage(JSON.stringify({type:'listening',value:false}));
}
</script>
</body>
</html>`;

export function VoiceSearch({ visible, onClose, onResult }: VoiceSearchProps) {
  const { theme } = useBrowserContext();
  const insets = useSafeAreaInsets();
  const [isListening, setIsListening] = useState(false);
  const [lastResult, setLastResult] = useState('');
  const [status, setStatus] = useState<'idle' | 'listening' | 'result' | 'error'>('idle');
  const pulseAnim = useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (isListening) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.3, duration: 500, easing: Easing.ease, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 500, easing: Easing.ease, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.stopAnimation();
      Animated.timing(pulseAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    }
  }, [isListening]);

  const handleMessage = (e: any) => {
    try {
      const msg = JSON.parse(e.nativeEvent.data);
      if (msg.type === 'listening') { setIsListening(msg.value); setStatus(msg.value ? 'listening' : 'idle'); }
      if (msg.type === 'result') {
        setLastResult(msg.value);
        setStatus('result');
        setIsListening(false);
      }
      if (msg.type === 'error') { setStatus('error'); setIsListening(false); }
    } catch {}
  };

  const handleUseResult = () => {
    if (lastResult) {
      const url = `https://www.google.com/search?q=${encodeURIComponent(lastResult)}`;
      onResult(url);
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 20, borderColor: theme.glassBorder }]}>
          <LinearGradient colors={['rgba(15,5,30,0.98)', 'rgba(5,0,15,0.98)']} style={StyleSheet.absoluteFillObject} />

          <View style={styles.handle} />

          <Text style={[styles.title, { textShadowColor: theme.glowColor, textShadowRadius: 10 }]}>
            🎤 Voice Search | آواز سے تلاش
          </Text>
          <Text style={styles.subtitle}>Speak in English or Urdu | انگریزی یا اردو میں بولیں</Text>

          {/* Animated mic */}
          <Animated.View style={[styles.micWrap, { transform: [{ scale: pulseAnim }] }]}>
            <LinearGradient
              colors={isListening ? ['#00FF88', '#00B060'] : [theme.primary, theme.secondary]}
              style={styles.micBg}
            />
            <MaterialIcons name="mic" size={48} color="#fff" />
          </Animated.View>

          {/* Status */}
          <Text style={[styles.statusText, {
            color: isListening ? '#00FF88' : status === 'error' ? '#FF5555' : 'rgba(255,255,255,0.7)'
          }]}>
            {isListening ? '🔴 Listening... | سن رہا ہوں'
              : status === 'error' ? '❌ Try again | دوبارہ کوشش کریں'
              : status === 'result' ? '✅ Got it! | سمجھ گیا'
              : 'Tap button below to speak | بولنے کے لیے بٹن دبائیں'}
          </Text>

          {lastResult ? (
            <View style={[styles.resultBox, { borderColor: theme.glassBorder }]}>
              <MaterialIcons name="record-voice-over" size={16} color={theme.glowColor} />
              <Text style={styles.resultText} numberOfLines={2}>{lastResult}</Text>
            </View>
          ) : null}

          {/* WebView hidden voice controller */}
          <View style={styles.webviewHidden}>
            <WebView
              source={{ html: VOICE_HTML }}
              onMessage={handleMessage}
              style={styles.webview}
              javaScriptEnabled
              mediaPlaybackRequiresUserAction={false}
              allowsInlineMediaPlayback
            />
          </View>

          {lastResult ? (
            <View style={styles.actionBtns}>
              <Pressable onPress={handleUseResult} style={[styles.useBtn, { backgroundColor: theme.primary }]}>
                <MaterialIcons name="search" size={18} color="#fff" />
                <Text style={styles.useBtnText}>Search: "{lastResult.substring(0, 20)}..."</Text>
              </Pressable>
            </View>
          ) : null}

          <Pressable onPress={onClose} style={styles.cancelBtn}>
            <Text style={styles.cancelText}>Cancel | منسوخ</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)' },
  sheet: { borderTopLeftRadius: 28, borderTopRightRadius: 28, overflow: 'hidden', alignItems: 'center', gap: 14, padding: 24, borderWidth: 1, borderBottomWidth: 0 },
  handle: { width: 40, height: 4, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 2, marginBottom: 4 },
  title: { color: '#fff', fontSize: 20, fontWeight: '900' },
  subtitle: { color: 'rgba(255,255,255,0.65)', fontSize: 12 },
  micWrap: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', shadowColor: '#00FF88', shadowOpacity: 0.5, shadowRadius: 20, elevation: 10 },
  micBg: { ...StyleSheet.absoluteFillObject },
  statusText: { fontSize: 13, fontWeight: '600', textAlign: 'center' },
  resultBox: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 12, borderWidth: 1, backgroundColor: 'rgba(255,255,255,0.1)', padding: 12, width: '100%' },
  resultText: { flex: 1, color: '#fff', fontSize: 14, fontWeight: '600' },
  webviewHidden: { width: '100%', height: 120 },
  webview: { flex: 1, backgroundColor: 'transparent' },
  actionBtns: { width: '100%', gap: 8 },
  useBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 50, paddingVertical: 13, paddingHorizontal: 20 },
  useBtnText: { color: '#fff', fontSize: 13, fontWeight: '700', flex: 1 },
  cancelBtn: { padding: 10, marginTop: 4 },
  cancelText: { color: 'rgba(255,255,255,0.5)', fontSize: 13 },
});
