import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, Pressable, StyleSheet, Modal, ScrollView,
  Alert, Animated, TextInput, ActivityIndicator,
} from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBrowserContext } from '@/contexts/BrowserContext';

interface DigitalQuranProps { visible: boolean; onClose: () => void; }

const SURAHS = [
  { num: 1, name: 'Al-Fatiha', nameUr: 'الفاتحہ', verses: 7 },
  { num: 2, name: 'Al-Baqarah', nameUr: 'البقرہ', verses: 286 },
  { num: 3, name: 'Al-Imran', nameUr: 'آل عمران', verses: 200 },
  { num: 4, name: 'An-Nisa', nameUr: 'النساء', verses: 176 },
  { num: 5, name: 'Al-Maidah', nameUr: 'المائدہ', verses: 120 },
  { num: 6, name: 'Al-Anam', nameUr: 'الانعام', verses: 165 },
  { num: 7, name: 'Al-Araf', nameUr: 'الاعراف', verses: 206 },
  { num: 9, name: 'At-Tawbah', nameUr: 'التوبہ', verses: 129 },
  { num: 10, name: 'Yunus', nameUr: 'یونس', verses: 109 },
  { num: 12, name: 'Yusuf', nameUr: 'یوسف', verses: 111 },
  { num: 14, name: 'Ibrahim', nameUr: 'ابراہیم', verses: 52 },
  { num: 17, name: 'Al-Isra', nameUr: 'الاسراء', verses: 111 },
  { num: 18, name: 'Al-Kahf', nameUr: 'الکہف', verses: 110 },
  { num: 19, name: 'Maryam', nameUr: 'مریم', verses: 98 },
  { num: 20, name: 'Ta-Ha', nameUr: 'طہٰ', verses: 135 },
  { num: 24, name: 'An-Nur', nameUr: 'النور', verses: 64 },
  { num: 25, name: 'Al-Furqan', nameUr: 'الفرقان', verses: 77 },
  { num: 29, name: 'Al-Ankabut', nameUr: 'العنکبوت', verses: 69 },
  { num: 31, name: 'Luqman', nameUr: 'لقمان', verses: 34 },
  { num: 36, name: 'Ya-Sin', nameUr: 'یٰس', verses: 83 },
  { num: 37, name: 'As-Saffat', nameUr: 'الصافات', verses: 182 },
  { num: 39, name: 'Az-Zumar', nameUr: 'الزمر', verses: 75 },
  { num: 40, name: 'Ghafir', nameUr: 'غافر', verses: 85 },
  { num: 44, name: 'Ad-Dukhan', nameUr: 'الدخان', verses: 59 },
  { num: 47, name: 'Muhammad', nameUr: 'محمد', verses: 38 },
  { num: 48, name: 'Al-Fath', nameUr: 'الفتح', verses: 29 },
  { num: 49, name: 'Al-Hujurat', nameUr: 'الحجرات', verses: 18 },
  { num: 55, name: 'Ar-Rahman', nameUr: 'الرحمٰن', verses: 78 },
  { num: 56, name: 'Al-Waqiah', nameUr: 'الواقعہ', verses: 96 },
  { num: 67, name: 'Al-Mulk', nameUr: 'الملک', verses: 30 },
  { num: 68, name: 'Al-Qalam', nameUr: 'القلم', verses: 52 },
  { num: 71, name: 'Nuh', nameUr: 'نوح', verses: 28 },
  { num: 73, name: 'Al-Muzzammil', nameUr: 'المزمل', verses: 20 },
  { num: 74, name: 'Al-Muddaththir', nameUr: 'المدثر', verses: 56 },
  { num: 75, name: 'Al-Qiyamah', nameUr: 'القیامہ', verses: 40 },
  { num: 76, name: 'Al-Insan', nameUr: 'الانسان', verses: 31 },
  { num: 78, name: 'An-Naba', nameUr: 'النبا', verses: 40 },
  { num: 79, name: 'An-Naziat', nameUr: 'النازعات', verses: 46 },
  { num: 80, name: 'Abasa', nameUr: 'عبس', verses: 42 },
  { num: 81, name: 'At-Takwir', nameUr: 'التکویر', verses: 29 },
  { num: 85, name: 'Al-Buruj', nameUr: 'البروج', verses: 22 },
  { num: 86, name: 'At-Tariq', nameUr: 'الطارق', verses: 17 },
  { num: 87, name: 'Al-Ala', nameUr: 'الاعلی', verses: 19 },
  { num: 88, name: 'Al-Ghashiyah', nameUr: 'الغاشیہ', verses: 26 },
  { num: 89, name: 'Al-Fajr', nameUr: 'الفجر', verses: 30 },
  { num: 91, name: 'Ash-Shams', nameUr: 'الشمس', verses: 15 },
  { num: 92, name: 'Al-Layl', nameUr: 'الیل', verses: 21 },
  { num: 93, name: 'Ad-Duha', nameUr: 'الضحی', verses: 11 },
  { num: 94, name: 'Ash-Sharh', nameUr: 'الشرح', verses: 8 },
  { num: 95, name: 'At-Tin', nameUr: 'التین', verses: 8 },
  { num: 96, name: 'Al-Alaq', nameUr: 'العلق', verses: 19 },
  { num: 97, name: 'Al-Qadr', nameUr: 'القدر', verses: 5 },
  { num: 98, name: 'Al-Bayyinah', nameUr: 'البینہ', verses: 8 },
  { num: 99, name: 'Az-Zalzalah', nameUr: 'الزلزلہ', verses: 8 },
  { num: 100, name: 'Al-Adiyat', nameUr: 'العادیات', verses: 11 },
  { num: 101, name: 'Al-Qariah', nameUr: 'القارعہ', verses: 11 },
  { num: 102, name: 'At-Takathur', nameUr: 'التکاثر', verses: 8 },
  { num: 103, name: 'Al-Asr', nameUr: 'العصر', verses: 3 },
  { num: 104, name: 'Al-Humazah', nameUr: 'الہمزہ', verses: 9 },
  { num: 105, name: 'Al-Fil', nameUr: 'الفیل', verses: 5 },
  { num: 106, name: 'Quraysh', nameUr: 'قریش', verses: 4 },
  { num: 107, name: 'Al-Maun', nameUr: 'الماعون', verses: 7 },
  { num: 108, name: 'Al-Kawthar', nameUr: 'الکوثر', verses: 3 },
  { num: 109, name: 'Al-Kafirun', nameUr: 'الکافرون', verses: 6 },
  { num: 110, name: 'An-Nasr', nameUr: 'النصر', verses: 3 },
  { num: 111, name: 'Al-Masad', nameUr: 'المسد', verses: 5 },
  { num: 112, name: 'Al-Ikhlas', nameUr: 'الاخلاص', verses: 4 },
  { num: 113, name: 'Al-Falaq', nameUr: 'الفلق', verses: 5 },
  { num: 114, name: 'An-Nas', nameUr: 'الناس', verses: 6 },
];

// ── Reciter configurations with multiple CDN fallbacks ─────────────────────
const RECITERS = [
  { id: 'mishari', name: 'Mishary Al-Afasy', nameUr: 'مشاری العفاسی', everyayahId: '01' },
  { id: 'sudais', name: 'Abdurrahman As-Sudais', nameUr: 'عبدالرحمٰن السدیس', everyayahId: '07' },
  { id: 'husary', name: 'Mahmoud Khalil Al-Husary', nameUr: 'محمود خلیل الحصری', everyayahId: '09' },
  { id: 'muaiqly', name: 'Maher Al Muaiqly', nameUr: 'ماہر المعیقلی', everyayahId: '42' },
  { id: 'minshawi', name: 'Mohamed Siddiq El-Minshawi', nameUr: 'محمد صدیق المنشاوی', everyayahId: '52' },
];

// ── Multiple audio CDN sources for each reciter ───────────────────────────
function getAudioUrls(surahNum: number, reciterId: string): string[] {
  const padded = String(surahNum).padStart(3, '0');
  const reciter = RECITERS.find(r => r.id === reciterId) || RECITERS[0];
  const evId = reciter.everyayahId;

  // Map to Islamic Network CDN IDs
  const isNetMap: Record<string, string> = {
    mishari: 'ar.alafasy',
    sudais: 'ar.abdurrahmaansudais',
    husary: 'ar.husary',
    muaiqly: 'ar.mahermuaiqly',
    minshawi: 'ar.minshawi',
  };
  const isNetId = isNetMap[reciterId] || 'ar.alafasy';

  return [
    // Source 1: everyayah.com (very reliable, direct MP3)
    `https://everyayah.com/data/${reciter.name.split(' ')[0]}_${reciter.name.split(' ').pop()}_64kbps/${padded}000.mp3`,
    // Source 2: Islamic Network CDN (128kbps surah audio)
    `https://cdn.islamic.network/quran/audio-surah/128/${isNetId}/${surahNum}.mp3`,
    // Source 3: mp3quran.net (alternative)
    `https://server8.mp3quran.net/${evId}/${padded}.mp3`,
    // Source 4: Islamic Network 64kbps fallback
    `https://cdn.islamic.network/quran/audio-surah/64/${isNetId}/${surahNum}.mp3`,
  ];
}

// ── Urdu translation data (built-in, no API needed) ──────────────────────
// Source: Quran.com Urdu (Jalandhri) translation — selected popular verses
const URDU_TRANS: Record<number, { ar: string; ur: string }[]> = {
  1: [
    { ar: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ', ur: 'اللہ کے نام سے شروع جو بڑا مہربان نہایت رحم والا ہے' },
    { ar: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', ur: 'سب تعریف اللہ کے لیے جو سارے جہاں کا پالنے والا ہے' },
    { ar: 'الرَّحْمَنِ الرَّحِيمِ', ur: 'بڑا مہربان نہایت رحم والا' },
    { ar: 'مَالِكِ يَوْمِ الدِّينِ', ur: 'روزِ جزا کا مالک' },
    { ar: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ', ur: 'ہم تیری ہی عبادت کرتے ہیں اور تجھ سے ہی مدد مانگتے ہیں' },
    { ar: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ', ur: 'ہمیں سیدھا رستہ دکھا' },
    { ar: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ', ur: 'ان لوگوں کا رستہ جن پر تو نے انعام فرمایا' },
  ],
  112: [
    { ar: 'قُلْ هُوَ اللَّهُ أَحَدٌ', ur: 'کہو وہ اللہ ایک ہے' },
    { ar: 'اللَّهُ الصَّمَدُ', ur: 'اللہ بے نیاز ہے' },
    { ar: 'لَمْ يَلِدْ وَلَمْ يُولَدْ', ur: 'نہ اس سے کوئی پیدا ہوا نہ وہ کسی سے پیدا ہوا' },
    { ar: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ', ur: 'اور اس کا کوئی ہمسر نہیں' },
  ],
  113: [
    { ar: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ', ur: 'کہو میں پناہ مانگتا ہوں صبح کے رب کی' },
    { ar: 'مِن شَرِّ مَا خَلَقَ', ur: 'ہر چیز کی برائی سے جو اس نے پیدا کی' },
    { ar: 'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ', ur: 'اور رات کی تاریکی کی برائی سے جب وہ چھا جائے' },
    { ar: 'وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ', ur: 'اور گانٹھوں میں پھونک مارنے والیوں کی برائی سے' },
    { ar: 'وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ', ur: 'اور حسد کرنے والے کی برائی سے جب وہ حسد کرے' },
  ],
  114: [
    { ar: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ', ur: 'کہو میں پناہ مانگتا ہوں لوگوں کے رب کی' },
    { ar: 'مَلِكِ النَّاسِ', ur: 'لوگوں کے بادشاہ کی' },
    { ar: 'إِلَهِ النَّاسِ', ur: 'لوگوں کے معبود کی' },
    { ar: 'مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ', ur: 'وسوسہ ڈالنے والے پیچھے ہٹ جانے والے کی برائی سے' },
    { ar: 'الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ', ur: 'جو لوگوں کے سینوں میں وسوسے ڈالتا ہے' },
    { ar: 'مِنَ الْجِنَّةِ وَالنَّاسِ', ur: 'جنوں میں سے بھی اور انسانوں میں سے بھی' },
  ],
  67: [
    { ar: 'تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ', ur: 'بڑی بركت والا ہے وہ جس کے ہاتھ میں بادشاہت ہے' },
    { ar: 'وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ', ur: 'اور وہ ہر چیز پر قادر ہے' },
    { ar: 'الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ', ur: 'جس نے موت اور زندگی کو پیدا کیا' },
  ],
  36: [
    { ar: 'يس', ur: 'یٰسین' },
    { ar: 'وَالْقُرْآنِ الْحَكِيمِ', ur: 'قسم ہے حکمت والے قرآن کی' },
    { ar: 'إِنَّكَ لَمِنَ الْمُرْسَلِينَ', ur: 'بے شک آپ رسولوں میں سے ہیں' },
    { ar: 'عَلَى صِرَاطٍ مُّسْتَقِيمٍ', ur: 'سیدھے رستے پر' },
  ],
  55: [
    { ar: 'الرَّحْمَنُ', ur: 'رحمٰن' },
    { ar: 'عَلَّمَ الْقُرْآنَ', ur: 'نے قرآن سکھایا' },
    { ar: 'خَلَقَ الْإِنسَانَ', ur: 'انسان کو پیدا کیا' },
    { ar: 'عَلَّمَهُ الْبَيَانَ', ur: 'اسے بولنا سکھایا' },
    { ar: 'فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ', ur: 'تو تم دونوں اپنے رب کی کون کون سی نعمت کو جھٹلاؤ گے؟' },
  ],
};

const CACHE_DIR = FileSystem.documentDirectory + 'quran_cache/';

export function DigitalQuran({ visible, onClose }: DigitalQuranProps) {
  const { theme } = useBrowserContext();
  const insets = useSafeAreaInsets();

  // ── State ────────────────────────────────────────────────────────────────
  const [selectedSurah, setSelectedSurah] = useState<typeof SURAHS[0] | null>(null);
  const [selectedReciter, setSelectedReciter] = useState(RECITERS[0]);
  const [showSurahList, setShowSurahList] = useState(false);
  const [activeTab, setActiveTab] = useState<'player' | 'urdu' | 'arabic'>('player');
  const [searchQuery, setSearchQuery] = useState('');

  // Audio state
  const soundRef = useRef<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioError, setAudioError] = useState('');
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [cacheStatus, setCacheStatus] = useState<'none' | 'downloading' | 'cached'>('none');
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [cachedSurahs, setCachedSurahs] = useState<Set<string>>(new Set());
  const [urlTryIdx, setUrlTryIdx] = useState(0);

  // Translation state
  const [transLoading, setTransLoading] = useState(false);
  const [transVerses, setTransVerses] = useState<{ ar: string; ur: string; num: number }[]>([]);

  // Animations
  const glowAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(glowAnim, { toValue: 1, duration: 2500, useNativeDriver: true }),
      Animated.timing(glowAnim, { toValue: 0, duration: 2500, useNativeDriver: true }),
    ])).start();
    FileSystem.makeDirectoryAsync(CACHE_DIR, { intermediates: true }).catch(() => {});
    loadCachedList();
  }, []);

  useEffect(() => { if (!visible) stopAudio(); }, [visible]);

  useEffect(() => {
    if (selectedSurah) { checkCacheStatus(); setTransVerses([]); setAudioError(''); setUrlTryIdx(0); }
  }, [selectedSurah, selectedReciter]);

  // Load translation when urdu tab is opened
  useEffect(() => {
    if (activeTab === 'urdu' && selectedSurah) loadTranslation(selectedSurah.num);
  }, [activeTab, selectedSurah]);

  // ── Cache helpers ────────────────────────────────────────────────────────
  const getCachePath = (num: number, rid: string) =>
    `${CACHE_DIR}s${num}_${rid}.mp3`;

  const getCacheKey = (num: number, rid: string) => `${num}_${rid}`;

  const loadCachedList = async () => {
    try {
      const info = await FileSystem.getInfoAsync(CACHE_DIR);
      if (!info.exists) return;
      const files = await FileSystem.readDirectoryAsync(CACHE_DIR);
      const keys = new Set(
        files.map(f => { const m = f.match(/^s(\d+)_(.+)\.mp3$/); return m ? `${m[1]}_${m[2]}` : ''; })
          .filter(Boolean)
      );
      setCachedSurahs(keys);
    } catch {}
  };

  const checkCacheStatus = async () => {
    if (!selectedSurah) return;
    try {
      const path = getCachePath(selectedSurah.num, selectedReciter.id);
      const info = await FileSystem.getInfoAsync(path);
      setCacheStatus(info.exists && (info as any).size > 5000 ? 'cached' : 'none');
    } catch { setCacheStatus('none'); }
  };

  // ── Translation loader ────────────────────────────────────────────────
  const loadTranslation = async (surahNum: number) => {
    // Check built-in first
    if (URDU_TRANS[surahNum]) {
      const verses = URDU_TRANS[surahNum].map((v, i) => ({ ar: v.ar, ur: v.ur, num: i + 1 }));
      setTransVerses(verses);
      return;
    }
    // Fetch from Quran.com API
    setTransLoading(true);
    try {
      const apiUrl = `https://api.qurancdn.com/api/qdc/verses/by_chapter/${surahNum}?translations=97&per_page=50&fields=text_uthmani`;
      const res = await fetch(apiUrl, { signal: AbortSignal.timeout(10000) });
      if (!res.ok) throw new Error('API error');
      const json = await res.json();
      const verses = (json.verses || []).map((v: any, i: number) => ({
        num: i + 1,
        ar: v.text_uthmani || '',
        ur: v.translations?.[0]?.text?.replace(/<[^>]+>/g, '') || 'ترجمہ دستیاب نہیں',
      }));
      setTransVerses(verses);
    } catch {
      // Fallback: show first 5 known verses or a message
      setTransVerses([{ num: 0, ar: '', ur: 'انٹرنیٹ کنکشن چیک کریں یا بعد میں کوشش کریں۔ آف لائن فیچر کے لیے پہلے سے لوڈ کریں۔' }]);
    }
    setTransLoading(false);
  };

  // ── Audio helpers ─────────────────────────────────────────────────────
  const startPulse = () => {
    pulseAnim.stopAnimation();
    Animated.loop(Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 1.08, duration: 600, useNativeDriver: true }),
      Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
    ])).start();
  };

  const stopPulse = () => {
    pulseAnim.stopAnimation();
    Animated.timing(pulseAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
  };

  const stopAudio = async () => {
    if (soundRef.current) {
      try { await soundRef.current.stopAsync(); await soundRef.current.unloadAsync(); } catch {}
      soundRef.current = null;
    }
    setIsPlaying(false); setPosition(0); setDuration(0);
    stopPulse();
  };

  // Try audio URL with fallback on error
  const playWithUrl = async (uri: string): Promise<boolean> => {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        allowsRecordingIOS: false,
      });
      const { sound } = await Audio.Sound.createAsync(
        { uri, headers: { 'User-Agent': 'EvErSmArTBrOwSeR/2.0' } },
        { shouldPlay: true, progressUpdateIntervalMillis: 500 },
        (status) => {
          if (!status.isLoaded) return;
          setPosition(status.positionMillis || 0);
          setDuration(status.durationMillis || 0);
          setIsPlaying(!!status.isPlaying);
          if (status.didJustFinish) { setIsPlaying(false); stopPulse(); }
        }
      );
      soundRef.current = sound;
      setIsPlaying(true);
      setAudioError('');
      startPulse();
      return true;
    } catch {
      return false;
    }
  };

  const playAudio = async () => {
    if (!selectedSurah) return;
    setIsLoading(true);
    setAudioError('');
    await stopAudio();

    // 1. Try cached file first
    const cachePath = getCachePath(selectedSurah.num, selectedReciter.id);
    try {
      const cacheInfo = await FileSystem.getInfoAsync(cachePath);
      if (cacheInfo.exists && (cacheInfo as any).size > 5000) {
        const ok = await playWithUrl(cachePath);
        if (ok) { setIsLoading(false); return; }
      }
    } catch {}

    // 2. Try online URLs in order
    const urls = getAudioUrls(selectedSurah.num, selectedReciter.id);
    let success = false;
    for (let i = 0; i < urls.length; i++) {
      setUrlTryIdx(i);
      const ok = await playWithUrl(urls[i]);
      if (ok) { success = true; break; }
      // small delay between retries
      await new Promise(r => setTimeout(r, 500));
    }

    if (!success) {
      setAudioError('آڈیو لوڈ نہیں ہوئی۔ انٹرنیٹ چیک کریں یا دوسرا قاری منتخب کریں۔');
    }
    setIsLoading(false);
  };

  const togglePlay = async () => {
    if (!soundRef.current) { await playAudio(); return; }
    if (isPlaying) {
      await soundRef.current.pauseAsync(); stopPulse();
    } else {
      await soundRef.current.playAsync(); startPulse();
    }
  };

  const seekBy = async (ms: number) => {
    if (!soundRef.current) return;
    try {
      const newPos = Math.max(0, Math.min(duration, position + ms));
      await soundRef.current.setPositionAsync(newPos);
    } catch {}
  };

  // ── Cache download ────────────────────────────────────────────────────
  const downloadAndCache = async () => {
    if (!selectedSurah) return;
    const urls = getAudioUrls(selectedSurah.num, selectedReciter.id);
    const path = getCachePath(selectedSurah.num, selectedReciter.id);
    setCacheStatus('downloading'); setDownloadProgress(0);

    for (const url of urls) {
      try {
        const dl = FileSystem.createDownloadResumable(url, path, {},
          ({ totalBytesWritten, totalBytesExpectedToWrite }) => {
            if (totalBytesExpectedToWrite > 0) setDownloadProgress(totalBytesWritten / totalBytesExpectedToWrite);
          }
        );
        const result = await dl.downloadAsync();
        const info = result?.uri ? await FileSystem.getInfoAsync(result.uri) : null;
        if (result?.uri && info?.exists && (info as any).size > 5000) {
          setCacheStatus('cached');
          const key = getCacheKey(selectedSurah.num, selectedReciter.id);
          setCachedSurahs(prev => new Set(prev).add(key));
          Alert.alert('Downloaded ✅ | ڈاؤنلوڈ', `${selectedSurah.name} آف لائن محفوظ ہو گئی`);
          setDownloadProgress(0); return;
        }
      } catch {}
    }
    setCacheStatus('none'); setDownloadProgress(0);
    Alert.alert('Error | خرابی', 'Download failed. Check internet connection.');
  };

  const deleteCachedSurah = async () => {
    if (!selectedSurah) return;
    const path = getCachePath(selectedSurah.num, selectedReciter.id);
    await FileSystem.deleteAsync(path, { idempotent: true }).catch(() => {});
    const key = getCacheKey(selectedSurah.num, selectedReciter.id);
    setCachedSurahs(prev => { const s = new Set(prev); s.delete(key); return s; });
    setCacheStatus('none');
  };

  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  };

  const progressPct = duration > 0 ? (position / duration) * 100 : 0;
  const filteredSurahs = SURAHS.filter(s =>
    !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.nameUr.includes(searchQuery) || String(s.num).includes(searchQuery)
  );

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={() => { stopAudio(); onClose(); }}
    >
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <LinearGradient colors={['#080018', '#120030', '#0D001A', '#050010']} style={StyleSheet.absoluteFillObject} />
        <Animated.View style={[StyleSheet.absoluteFillObject, {
          opacity: glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0.06, 0.18] })
        }]}>
          <LinearGradient colors={['#FFD700', 'transparent', '#00FF88']} style={StyleSheet.absoluteFillObject} />
        </Animated.View>

        {/* ── Header ── */}
        <View style={[styles.header, { borderBottomColor: 'rgba(255,215,0,0.3)' }]}>
          <LinearGradient colors={['rgba(255,215,0,0.18)', 'rgba(255,215,0,0.03)']} style={StyleSheet.absoluteFillObject} />
          <Pressable onPress={() => { stopAudio(); onClose(); }} style={styles.closeBtn} hitSlop={10}>
            <MaterialIcons name="arrow-back" size={22} color="#FFD700" />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>📖 القرآن الکریم</Text>
            <Text style={styles.headerSub}>Digital Quran | ڈیجیٹل قرآن پاک</Text>
          </View>
          <Pressable onPress={() => setShowSurahList(true)} style={styles.surahBtn}>
            <MaterialIcons name="list" size={16} color="#FFD700" />
            <Text style={styles.surahBtnText}>Surahs | سورتیں</Text>
          </Pressable>
        </View>

        {/* ── Tab bar ── */}
        <View style={styles.tabBar}>
          {([
            { id: 'player', icon: 'music-note', label: '🎵 تلاوت' },
            { id: 'urdu', icon: 'translate', label: '📖 ترجمہ اردو' },
            { id: 'arabic', icon: 'menu-book', label: '🕌 عربی متن' },
          ] as const).map(t => (
            <Pressable key={t.id} onPress={() => setActiveTab(t.id)}
              style={[styles.tabItem, {
                borderBottomColor: activeTab === t.id ? '#FFD700' : 'transparent',
                borderBottomWidth: 2,
              }]}>
              <MaterialIcons name={t.icon} size={14} color={activeTab === t.id ? '#FFD700' : 'rgba(255,255,255,0.45)'} />
              <Text style={[styles.tabLabel, { color: activeTab === t.id ? '#FFD700' : 'rgba(255,255,255,0.45)' }]}>
                {t.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* ── Player Tab ── */}
        {activeTab === 'player' && (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.playerContent}>
            {/* Bismillah */}
            <Animated.Text style={[styles.bismillah, {
              opacity: glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0.75, 1] })
            }]}>
              {'بِسْمِ اللّٰہِ الرَّحْمٰنِ الرَّحِیْمِ'}
            </Animated.Text>

            {/* Surah selector */}
            <Pressable onPress={() => setShowSurahList(true)}
              style={[styles.surahSelector, { borderColor: 'rgba(255,215,0,0.4)' }]}>
              <LinearGradient colors={['rgba(255,215,0,0.15)', 'rgba(255,215,0,0.03)']} style={StyleSheet.absoluteFillObject} />
              <MaterialIcons name="menu-book" size={20} color="#FFD700" />
              <View style={{ flex: 1 }}>
                <Text style={styles.surahSelectorText} numberOfLines={1}>
                  {selectedSurah
                    ? `${selectedSurah.num}. ${selectedSurah.name} — ${selectedSurah.nameUr}`
                    : 'Select Surah | سورہ منتخب کریں ▼'}
                </Text>
                {selectedSurah && (
                  <Text style={styles.surahSelectorSub}>{selectedSurah.verses} آیات</Text>
                )}
              </View>
              <MaterialIcons name="expand-more" size={22} color="#FFD70099" />
            </Pressable>

            {/* Reciter chips */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.reciterRow}>
              {RECITERS.map(r => (
                <Pressable key={r.id}
                  onPress={() => { setSelectedReciter(r); stopAudio(); setAudioError(''); }}
                  style={[styles.reciterChip, {
                    backgroundColor: selectedReciter.id === r.id ? 'rgba(255,215,0,0.25)' : 'rgba(255,255,255,0.08)',
                    borderColor: selectedReciter.id === r.id ? '#FFD700' : 'rgba(255,255,255,0.2)',
                  }]}>
                  <Text style={[styles.reciterText, {
                    color: selectedReciter.id === r.id ? '#FFD700' : 'rgba(255,255,255,0.6)',
                  }]} numberOfLines={1}>{r.name.split(' ')[0]}</Text>
                </Pressable>
              ))}
            </ScrollView>

            {/* Player card */}
            <View style={[styles.playerCard, { borderColor: 'rgba(255,215,0,0.3)' }]}>
              <LinearGradient colors={['rgba(255,215,0,0.12)', 'rgba(255,215,0,0.03)', 'rgba(0,255,136,0.04)']} style={StyleSheet.absoluteFillObject} />

              <Animated.View style={[styles.albumArt, { transform: [{ scale: pulseAnim }] }]}>
                <LinearGradient colors={['#FFD700', '#FF8C00', '#FFD700']} style={styles.albumArtGrad} />
                <Text style={styles.albumArtText}>📖</Text>
              </Animated.View>

              {selectedSurah ? (
                <>
                  <Text style={styles.nowPlayingTitle}>{selectedSurah.name}</Text>
                  <Text style={styles.nowPlayingAr}>{selectedSurah.nameUr}</Text>
                  <Text style={styles.nowPlayingReciter}>{selectedReciter.name}</Text>

                  {/* Error message */}
                  {audioError ? (
                    <View style={styles.errorBox}>
                      <MaterialIcons name="warning" size={14} color="#FF8888" />
                      <Text style={styles.errorText}>{audioError}</Text>
                    </View>
                  ) : null}

                  {/* Loading indicator */}
                  {isLoading && (
                    <View style={styles.loadingRow}>
                      <ActivityIndicator size="small" color="#FFD700" />
                      <Text style={styles.loadingText}>
                        {urlTryIdx > 0 ? `Trying source ${urlTryIdx + 1}... | ذریعہ ${urlTryIdx + 1}` : 'Loading audio... | لوڈ ہو رہا ہے'}
                      </Text>
                    </View>
                  )}

                  {/* Progress */}
                  <View style={styles.progressRow}>
                    <Text style={styles.timeText}>{formatTime(position)}</Text>
                    <View style={styles.progressTrack}>
                      <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
                      {isPlaying && (
                        <Animated.View style={[styles.progressDot, {
                          left: `${progressPct}%`,
                          transform: [{ scale: pulseAnim }],
                        }]} />
                      )}
                    </View>
                    <Text style={styles.timeText}>{formatTime(duration)}</Text>
                  </View>

                  {/* Controls */}
                  <View style={styles.controls}>
                    <Pressable onPress={() => seekBy(-15000)} style={styles.ctrlBtn} hitSlop={6}>
                      <MaterialIcons name="replay-10" size={22} color="rgba(255,215,0,0.8)" />
                    </Pressable>
                    <Pressable onPress={togglePlay} disabled={isLoading}
                      style={[styles.playBtn, {
                        shadowColor: '#FFD700', shadowOpacity: isPlaying ? 1 : 0.4, shadowRadius: 16, elevation: 12
                      }]}>
                      <LinearGradient colors={['#FFD700', '#FF8C00']} style={styles.playBtnGrad} />
                      {isLoading
                        ? <ActivityIndicator size={32} color="#000" />
                        : <MaterialIcons name={isPlaying ? 'pause' : 'play-arrow'} size={38} color="#000" />
                      }
                    </Pressable>
                    <Pressable onPress={() => seekBy(15000)} style={styles.ctrlBtn} hitSlop={6}>
                      <MaterialIcons name="forward-10" size={22} color="rgba(255,215,0,0.8)" />
                    </Pressable>
                  </View>

                  {/* Stop button */}
                  {(isPlaying || position > 0) && (
                    <Pressable onPress={stopAudio} style={styles.stopBtn}>
                      <MaterialIcons name="stop" size={14} color="#FF5555" />
                      <Text style={styles.stopBtnText}>Stop | روکیں</Text>
                    </Pressable>
                  )}

                  {/* Cache controls */}
                  <View style={styles.cacheRow}>
                    {cacheStatus === 'none' && !isLoading && (
                      <Pressable onPress={downloadAndCache} style={styles.cacheBtn}>
                        <LinearGradient colors={['rgba(0,255,136,0.2)', 'rgba(0,255,136,0.05)']} style={StyleSheet.absoluteFillObject} />
                        <MaterialIcons name="download" size={14} color="#00FF88" />
                        <Text style={[styles.cacheBtnText, { color: '#00FF88' }]}>Cache Offline | آف لائن</Text>
                      </Pressable>
                    )}
                    {cacheStatus === 'downloading' && (
                      <View style={styles.cacheBtn}>
                        <LinearGradient colors={['rgba(0,200,255,0.2)', 'transparent']} style={StyleSheet.absoluteFillObject} />
                        <ActivityIndicator size={12} color="#00DCFF" />
                        <Text style={[styles.cacheBtnText, { color: '#00DCFF' }]}>
                          {Math.round(downloadProgress * 100)}% Downloading...
                        </Text>
                      </View>
                    )}
                    {cacheStatus === 'cached' && (
                      <>
                        <View style={[styles.cacheBtn, { borderColor: '#00FF8855' }]}>
                          <LinearGradient colors={['rgba(0,255,136,0.15)', 'transparent']} style={StyleSheet.absoluteFillObject} />
                          <MaterialIcons name="offline-pin" size={14} color="#00FF88" />
                          <Text style={[styles.cacheBtnText, { color: '#00FF88' }]}>Offline Ready | آف لائن</Text>
                        </View>
                        <Pressable onPress={deleteCachedSurah} style={[styles.cacheBtn, { borderColor: '#FF555544' }]}>
                          <MaterialIcons name="delete-outline" size={14} color="#FF5555" />
                          <Text style={[styles.cacheBtnText, { color: '#FF5555' }]}>Delete</Text>
                        </Pressable>
                      </>
                    )}
                  </View>

                  {cachedSurahs.size > 0 && (
                    <Text style={styles.cachedCount}>📥 {cachedSurahs.size} سورتیں آف لائن</Text>
                  )}
                </>
              ) : (
                <View style={styles.noSurahWrap}>
                  <Animated.Text style={[styles.noSurahIcon, {
                    opacity: glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] })
                  }]}>📖</Animated.Text>
                  <Text style={styles.noSurahText}>سورہ منتخب کریں تلاوت شروع کریں</Text>
                  <Pressable onPress={() => setShowSurahList(true)} style={styles.selectBtn}>
                    <LinearGradient colors={['#FFD700', '#FF8C00']} style={StyleSheet.absoluteFillObject} />
                    <Text style={styles.selectBtnText}>📋 سورہ منتخب کریں</Text>
                  </Pressable>
                </View>
              )}
            </View>

            {/* Feature chips */}
            <View style={styles.featRow}>
              {[
                { icon: 'offline-pin', label: 'Offline Cache', color: '#00FF88' },
                { icon: 'music-note', label: '5 Reciters', color: '#FFD700' },
                { icon: 'translate', label: 'Urdu Trans.', color: '#00DCFF' },
                { icon: 'book', label: `${SURAHS.length} Surahs`, color: '#FF69B4' },
              ].map(f => (
                <View key={f.label} style={[styles.featChip, { borderColor: f.color + '44' }]}>
                  <LinearGradient colors={[f.color + '15', 'transparent']} style={StyleSheet.absoluteFillObject} />
                  <MaterialIcons name={f.icon as any} size={12} color={f.color} />
                  <Text style={[styles.featText, { color: f.color }]}>{f.label}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        )}

        {/* ── Urdu Translation Tab ── */}
        {activeTab === 'urdu' && (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.transContent}>
            <Animated.Text style={[styles.bismillah, {
              opacity: glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0.75, 1] }),
              marginBottom: 4,
            }]}>{'بِسْمِ اللّٰہِ الرَّحْمٰنِ الرَّحِیْمِ'}</Animated.Text>

            {!selectedSurah ? (
              <View style={styles.noSurahWrap}>
                <Text style={styles.noSurahText}>سورہ منتخب کریں</Text>
                <Pressable onPress={() => setShowSurahList(true)} style={styles.selectBtn}>
                  <LinearGradient colors={['#FFD700', '#FF8C00']} style={StyleSheet.absoluteFillObject} />
                  <Text style={styles.selectBtnText}>📋 سورہ منتخب کریں</Text>
                </Pressable>
              </View>
            ) : transLoading ? (
              <View style={styles.transLoading}>
                <ActivityIndicator size="large" color="#FFD700" />
                <Text style={styles.loadingText}>ترجمہ لوڈ ہو رہا ہے...</Text>
              </View>
            ) : (
              <>
                <View style={styles.transHeader}>
                  <Text style={styles.transTitle}>{selectedSurah.name} — {selectedSurah.nameUr}</Text>
                  <Text style={styles.transSub}>{selectedSurah.verses} آیات</Text>
                </View>
                {transVerses.map((v, i) => (
                  <View key={i} style={[styles.verseCard, { borderColor: 'rgba(255,215,0,0.2)' }]}>
                    <LinearGradient colors={['rgba(255,215,0,0.08)', 'transparent']} style={StyleSheet.absoluteFillObject} />
                    {v.num > 0 && (
                      <View style={styles.verseNum}>
                        <Text style={styles.verseNumText}>{v.num}</Text>
                      </View>
                    )}
                    {v.ar ? (
                      <Text style={styles.verseAr} selectable>{v.ar}</Text>
                    ) : null}
                    <Text style={styles.verseUr} selectable>{v.ur}</Text>
                  </View>
                ))}
                {transVerses.length === 0 && (
                  <Text style={styles.loadingText}>ترجمہ دستیاب نہیں</Text>
                )}
              </>
            )}
          </ScrollView>
        )}

        {/* ── Arabic Text Tab ── */}
        {activeTab === 'arabic' && (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.transContent}>
            <Animated.Text style={[styles.bismillah, {
              opacity: glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0.75, 1] })
            }]}>{'بِسْمِ اللّٰہِ الرَّحْمٰنِ الرَّحِیْمِ'}</Animated.Text>

            {!selectedSurah ? (
              <View style={styles.noSurahWrap}>
                <Text style={styles.noSurahText}>سورہ منتخب کریں</Text>
                <Pressable onPress={() => setShowSurahList(true)} style={styles.selectBtn}>
                  <LinearGradient colors={['#FFD700', '#FF8C00']} style={StyleSheet.absoluteFillObject} />
                  <Text style={styles.selectBtnText}>📋 سورہ منتخب کریں</Text>
                </Pressable>
              </View>
            ) : (
              <>
                <View style={styles.transHeader}>
                  <Text style={styles.transTitle}>{selectedSurah.nameUr}</Text>
                  <Text style={styles.transSub}>{selectedSurah.verses} آیات • {selectedSurah.name}</Text>
                </View>
                {/* Show built-in Arabic text for known surahs */}
                {URDU_TRANS[selectedSurah.num] ? (
                  URDU_TRANS[selectedSurah.num].map((v, i) => (
                    <View key={i} style={[styles.verseCard, { borderColor: 'rgba(255,215,0,0.2)' }]}>
                      <LinearGradient colors={['rgba(255,215,0,0.08)', 'transparent']} style={StyleSheet.absoluteFillObject} />
                      <View style={styles.verseNum}>
                        <Text style={styles.verseNumText}>{i + 1}</Text>
                      </View>
                      <Text style={styles.verseArBig} selectable>{v.ar}</Text>
                    </View>
                  ))
                ) : (
                  <View style={[styles.verseCard, { borderColor: 'rgba(255,215,0,0.2)', alignItems: 'center', paddingVertical: 30 }]}>
                    <LinearGradient colors={['rgba(255,215,0,0.08)', 'transparent']} style={StyleSheet.absoluteFillObject} />
                    <Text style={styles.verseAr} selectable>
                      {'سورۃ ' + selectedSurah.nameUr + '\n\nآڈیو سننے کے لیے تلاوت ٹیب پر جائیں\nکامل عربی متن براؤزر میں کھلے گا'}
                    </Text>
                    <Pressable onPress={() => setActiveTab('player')} style={[styles.selectBtn, { marginTop: 16 }]}>
                      <LinearGradient colors={['#FFD700', '#FF8C00']} style={StyleSheet.absoluteFillObject} />
                      <Text style={styles.selectBtnText}>🎵 تلاوت سنیں</Text>
                    </Pressable>
                  </View>
                )}
              </>
            )}
          </ScrollView>
        )}

        {/* ── Surah List Modal ── rendered as child of root Modal to avoid black screen deadlock */}
        <Modal
          visible={showSurahList}
          animationType="slide"
          transparent
          onRequestClose={() => setShowSurahList(false)}
        >
          <View style={styles.surahOverlay}>
            <Pressable style={styles.surahBackdrop} onPress={() => setShowSurahList(false)} />
            <View style={[styles.surahSheet, { paddingBottom: insets.bottom + 10 }]}>
              <LinearGradient colors={['#150030', '#080018']} style={StyleSheet.absoluteFillObject} />

              {/* Sheet header */}
              <View style={styles.surahSheetHeader}>
                <Text style={styles.surahSheetTitle}>📖 سورہ منتخب کریں</Text>
                <Pressable onPress={() => setShowSurahList(false)} hitSlop={10} style={styles.sheetCloseBtn}>
                  <MaterialIcons name="close" size={22} color="#FFD700" />
                </Pressable>
              </View>

              {/* Search */}
              <View style={styles.searchBox}>
                <MaterialIcons name="search" size={16} color="rgba(255,215,0,0.6)" />
                <TextInput
                  style={styles.searchInput}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Search surah... | سورہ تلاش کریں"
                  placeholderTextColor="rgba(255,215,0,0.4)"
                />
                {searchQuery ? (
                  <Pressable onPress={() => setSearchQuery('')} hitSlop={6}>
                    <MaterialIcons name="cancel" size={16} color="rgba(255,215,0,0.6)" />
                  </Pressable>
                ) : null}
              </View>

              <Text style={styles.surahCount}>{filteredSurahs.length} سورتیں</Text>

              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
                {filteredSurahs.map(s => {
                  const key = getCacheKey(s.num, selectedReciter.id);
                  const offline = cachedSurahs.has(key);
                  const isActive = selectedSurah?.num === s.num;
                  return (
                    <Pressable
                      key={s.num}
                      onPress={() => {
                        setSelectedSurah(s);
                        setShowSurahList(false);
                        stopAudio();
                        setAudioError('');
                      }}
                      style={({ pressed }) => [styles.surahItem, {
                        borderColor: isActive ? '#FFD700' : 'rgba(255,255,255,0.08)',
                        backgroundColor: isActive ? 'rgba(255,215,0,0.1)' : pressed ? 'rgba(255,255,255,0.05)' : 'transparent',
                      }]}
                    >
                      <View style={[styles.surahNum, {
                        borderColor: offline ? '#00FF8866' : '#FFD70033',
                        backgroundColor: offline ? 'rgba(0,255,136,0.08)' : isActive ? 'rgba(255,215,0,0.15)' : 'transparent',
                      }]}>
                        <Text style={[styles.surahNumText, { color: offline ? '#00FF88' : '#FFD700' }]}>{s.num}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.surahName}>{s.name}</Text>
                        <Text style={styles.surahNameUr}>{s.nameUr} • {s.verses} آیات</Text>
                      </View>
                      {offline && <MaterialIcons name="offline-pin" size={14} color="#00FF88" />}
                      {isActive && <MaterialIcons name="check-circle" size={16} color="#FFD700" />}
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 12,
    borderBottomWidth: 1, overflow: 'hidden', gap: 8,
  },
  closeBtn: { padding: 6, backgroundColor: 'rgba(255,215,0,0.12)', borderRadius: 8 },
  headerTitle: { color: '#FFD700', fontSize: 18, fontWeight: '900', textShadowColor: '#FFD700', textShadowRadius: 12 },
  headerSub: { color: 'rgba(255,255,255,0.5)', fontSize: 10, marginTop: 2 },
  surahBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    borderRadius: 20, borderWidth: 1, borderColor: '#FFD70055',
    paddingHorizontal: 10, paddingVertical: 6, backgroundColor: 'rgba(255,215,0,0.12)',
  },
  surahBtnText: { color: '#FFD700', fontSize: 11, fontWeight: '700' },
  tabBar: {
    flexDirection: 'row', borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,215,0,0.2)',
  },
  tabItem: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 5, paddingVertical: 10,
  },
  tabLabel: { fontSize: 11, fontWeight: '700' },
  playerContent: { padding: 16, gap: 14, paddingBottom: 40 },
  bismillah: {
    color: '#FFD700', fontSize: 22, fontWeight: '900', textAlign: 'center',
    textShadowColor: '#FFD700', textShadowRadius: 16, writingDirection: 'rtl',
  },
  surahSelector: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderRadius: 16, borderWidth: 1, overflow: 'hidden', padding: 14,
  },
  surahSelectorText: { color: '#FFD700', fontSize: 13, fontWeight: '700' },
  surahSelectorSub: { color: 'rgba(255,215,0,0.6)', fontSize: 10, marginTop: 2 },
  reciterRow: { gap: 7, paddingVertical: 2 },
  reciterChip: { borderRadius: 18, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 7 },
  reciterText: { fontSize: 11, fontWeight: '600' },
  playerCard: {
    borderRadius: 20, borderWidth: 1, overflow: 'hidden',
    padding: 20, alignItems: 'center', gap: 10,
  },
  albumArt: {
    width: 80, height: 80, borderRadius: 40, overflow: 'hidden',
    justifyContent: 'center', alignItems: 'center', marginBottom: 4,
  },
  albumArtGrad: { ...StyleSheet.absoluteFillObject },
  albumArtText: { fontSize: 36 },
  nowPlayingTitle: {
    color: '#FFD700', fontSize: 20, fontWeight: '900',
    textShadowColor: '#FFD700', textShadowRadius: 10, textAlign: 'center',
  },
  nowPlayingAr: { color: 'rgba(255,215,0,0.8)', fontSize: 14, fontWeight: '700', textAlign: 'center' },
  nowPlayingReciter: { color: 'rgba(255,255,255,0.5)', fontSize: 11, textAlign: 'center' },
  errorBox: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderRadius: 10, backgroundColor: 'rgba(255,85,85,0.12)',
    borderWidth: 1, borderColor: 'rgba(255,85,85,0.3)',
    padding: 10, width: '100%',
  },
  errorText: { flex: 1, color: '#FF8888', fontSize: 11, lineHeight: 16 },
  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  loadingText: { color: 'rgba(255,215,0,0.7)', fontSize: 11, textAlign: 'center', marginTop: 4 },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 8, width: '100%' },
  timeText: { color: 'rgba(255,215,0,0.6)', fontSize: 10, minWidth: 32, textAlign: 'center' },
  progressTrack: {
    flex: 1, height: 6, backgroundColor: 'rgba(255,215,0,0.15)',
    borderRadius: 3, overflow: 'visible',
  },
  progressFill: { height: 6, borderRadius: 3, backgroundColor: '#FFD700' },
  progressDot: {
    position: 'absolute', top: -4, width: 14, height: 14,
    borderRadius: 7, backgroundColor: '#FFD700', marginLeft: -7,
    shadowColor: '#FFD700', shadowOpacity: 1, shadowRadius: 8, elevation: 6,
  },
  controls: { flexDirection: 'row', alignItems: 'center', gap: 20, marginTop: 4 },
  ctrlBtn: { padding: 10, backgroundColor: 'rgba(255,215,0,0.1)', borderRadius: 12 },
  playBtn: {
    width: 72, height: 72, borderRadius: 36,
    overflow: 'hidden', justifyContent: 'center', alignItems: 'center',
  },
  playBtnGrad: { ...StyleSheet.absoluteFillObject },
  stopBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    borderRadius: 14, borderWidth: 1, borderColor: '#FF555544',
    paddingHorizontal: 14, paddingVertical: 6, backgroundColor: 'rgba(255,85,85,0.08)',
  },
  stopBtnText: { color: '#FF5555', fontSize: 11, fontWeight: '700' },
  cacheRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', justifyContent: 'center' },
  cacheBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    borderRadius: 20, borderWidth: 1, borderColor: 'rgba(0,255,136,0.3)',
    overflow: 'hidden', paddingHorizontal: 12, paddingVertical: 7,
  },
  cacheBtnText: { fontSize: 11, fontWeight: '700' },
  cachedCount: { color: 'rgba(0,255,136,0.6)', fontSize: 10, textAlign: 'center' },
  noSurahWrap: { alignItems: 'center', gap: 10, padding: 24 },
  noSurahIcon: { fontSize: 48 },
  noSurahText: { color: 'rgba(255,215,0,0.7)', fontSize: 13, textAlign: 'center' },
  selectBtn: { borderRadius: 30, overflow: 'hidden', marginTop: 8, minWidth: 180, height: 46, justifyContent: 'center', alignItems: 'center' },
  selectBtnText: { color: '#000', fontSize: 14, fontWeight: '900', paddingVertical: 12, paddingHorizontal: 24 },
  featRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, justifyContent: 'center' },
  featChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    borderRadius: 16, borderWidth: 1, overflow: 'hidden', paddingHorizontal: 10, paddingVertical: 6,
  },
  featText: { fontSize: 10, fontWeight: '700' },
  // Translation tab
  transContent: { padding: 16, gap: 10, paddingBottom: 40 },
  transLoading: { alignItems: 'center', gap: 12, paddingVertical: 40 },
  transHeader: { alignItems: 'center', gap: 3, marginBottom: 8 },
  transTitle: { color: '#FFD700', fontSize: 16, fontWeight: '900', textAlign: 'center' },
  transSub: { color: 'rgba(255,215,0,0.6)', fontSize: 11, textAlign: 'center' },
  verseCard: {
    borderRadius: 14, borderWidth: 1, overflow: 'hidden',
    padding: 14, gap: 8,
  },
  verseNum: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: 'rgba(255,215,0,0.15)', borderWidth: 1,
    borderColor: '#FFD70055', justifyContent: 'center', alignItems: 'center',
    alignSelf: 'flex-end',
  },
  verseNumText: { color: '#FFD700', fontSize: 11, fontWeight: '900' },
  verseAr: {
    color: '#fff', fontSize: 18, fontWeight: '600', textAlign: 'right',
    lineHeight: 32, writingDirection: 'rtl', direction: 'rtl' as any,
  },
  verseArBig: {
    color: '#FFD700', fontSize: 22, fontWeight: '700', textAlign: 'right',
    lineHeight: 38, writingDirection: 'rtl', textShadowColor: '#FFD700', textShadowRadius: 6,
  },
  verseUr: {
    color: 'rgba(255,215,0,0.85)', fontSize: 14, lineHeight: 24,
    textAlign: 'right', writingDirection: 'rtl',
  },
  // Surah list modal
  surahOverlay: { flex: 1, justifyContent: 'flex-end' },
  surahBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.75)' },
  surahSheet: {
    maxHeight: '85%', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    overflow: 'hidden', padding: 16,
  },
  surahSheetHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10,
  },
  surahSheetTitle: { color: '#FFD700', fontSize: 16, fontWeight: '900' },
  sheetCloseBtn: { padding: 6, backgroundColor: 'rgba(255,215,0,0.15)', borderRadius: 8 },
  searchBox: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(255,215,0,0.1)', borderRadius: 50,
    paddingHorizontal: 14, height: 40, marginBottom: 8,
    borderWidth: 1, borderColor: 'rgba(255,215,0,0.25)',
  },
  searchInput: { flex: 1, color: '#FFD700', fontSize: 13 },
  surahCount: { color: 'rgba(255,255,255,0.35)', fontSize: 10, marginBottom: 8 },
  surahItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 12, borderRadius: 12, borderWidth: 1, marginBottom: 5,
  },
  surahNum: {
    width: 36, height: 36, borderRadius: 18, borderWidth: 1,
    justifyContent: 'center', alignItems: 'center',
  },
  surahNumText: { fontSize: 12, fontWeight: '900' },
  surahName: { color: '#fff', fontSize: 13, fontWeight: '700' },
  surahNameUr: { color: 'rgba(255,255,255,0.5)', fontSize: 10, marginTop: 2 },
});
