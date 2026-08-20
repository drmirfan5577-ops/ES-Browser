import React, { useState } from 'react';
import { useAppPermissions } from '@/hooks/useAppPermissions';
import { View, ScrollView, StyleSheet, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useBrowserContext } from '@/contexts/BrowserContext';
import { Header } from '@/components/layout/Header';
import { TickerStrip } from '@/components/layout/TickerStrip';
import { Sidebar } from '@/components/layout/Sidebar';
import { SearchBar } from '@/components/feature/SearchBar';
import { AppsGrid } from '@/components/feature/AppsGrid';
import { HubModal } from '@/components/feature/HubModal';
import { ThemePicker } from '@/components/feature/ThemePicker';
import { BrowserView } from '@/components/feature/BrowserView';
import { BookmarkManager } from '@/components/feature/BookmarkManager';
import { DownloadManager } from '@/components/feature/DownloadManager';
import { HistoryManager } from '@/components/feature/HistoryManager';
import { GalleryApp } from '@/components/feature/GalleryApp';
import { QRScanner } from '@/components/feature/QRScanner';
import { PasswordManager } from '@/components/feature/PasswordManager';
import { VoiceSearch } from '@/components/feature/VoiceSearch';
import { NotificationCenter } from '@/components/feature/NotificationCenter';
import { MediaPlayer } from '@/components/feature/MediaPlayer';
import { DigitalQuran } from '@/components/feature/DigitalQuran';

export default function HomeScreen() {
  const { theme, tickerMessages } = useBrowserContext();
  // Request all permissions on first launch
  useAppPermissions();
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);
  const [activeHub, setActiveHub] = useState<string | null>(null);
  const [browserUrl, setBrowserUrl] = useState<string | null>(null);
  const [incognito, setIncognito] = useState(false);
  const [themePickerOpen, setThemePickerOpen] = useState(false);

  // Browsing tools
  const [bookmarkOpen, setBookmarkOpen] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  // Device tools — accessible via Media tab only

  // 5 bottom tickers (t2–t6) — top 2 ticker strips removed per request
  const [, , t2, t3, t4, t5, t6] = tickerMessages;

  const openBrowser = (url: string, priv = false) => {
    setIncognito(priv);
    setBrowserUrl(url);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar style="light" />
      <LinearGradient colors={[...theme.gradient]} style={styles.root}>

        {/* MAIN SCROLL CONTENT — no top ticker strips */}
        <ScrollView
          style={styles.scroll}
          showsVerticalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Header
            onLeftSidebar={() => setLeftOpen(true)}
            onRightSidebar={() => setRightOpen(true)}
            onThemePicker={() => setThemePickerOpen(true)}
            onBookmarks={() => setBookmarkOpen(true)}
            onDownloads={() => setDownloadOpen(true)}
            onHistory={() => setHistoryOpen(true)}
            onIncognito={() => openBrowser('https://www.google.com', true)}
            onNotifications={() => setNotifOpen(true)}
            onQRScanner={() => setQrOpen(true)}
          />
          <SearchBar
            onSearch={(url) => openBrowser(url)}
            onVoiceSearch={() => setVoiceOpen(true)}
            onQRScanner={() => setQrOpen(true)}
          />
          <AppsGrid onHubPress={setActiveHub} onUrlPress={(url) => openBrowser(url)} />
        </ScrollView>

        {/* BOTTOM TICKERS (5) */}
        <TickerStrip text={t2 || ''} bgColor={theme.tickerColors[2]} direction="rtl" height={22} />
        <TickerStrip text={t3 || ''} bgColor={theme.tickerColors[3]} direction="ltr" height={22} />
        <TickerStrip text={t4 || ''} bgColor={theme.tickerColors[4]} direction="rtl" height={22} />
        <TickerStrip text={t5 || ''} bgColor={theme.tickerColors[0]} direction="ltr" height={22} />
        <TickerStrip text={t6 || ''} bgColor={theme.tickerColors[1]} direction="rtl" height={22} />

        {/* LEFT SIDEBAR — Browsing tools + Themes */}
        {leftOpen && (
          <Sidebar
            side="left" visible={leftOpen} onClose={() => setLeftOpen(false)}
            onOpenUrl={(url) => { openBrowser(url); setLeftOpen(false); }}
            onBookmarks={() => { setBookmarkOpen(true); setLeftOpen(false); }}
            onDownloads={() => { setDownloadOpen(true); setLeftOpen(false); }}
            onHistory={() => { setHistoryOpen(true); setLeftOpen(false); }}
            onIncognito={() => { openBrowser('https://www.google.com', true); setLeftOpen(false); }}
            onQRScanner={() => { setQrOpen(true); setLeftOpen(false); }}
            onPasswordManager={() => { setPasswordOpen(true); setLeftOpen(false); }}
            onVoiceSearch={() => { setVoiceOpen(true); setLeftOpen(false); }}
            onNotifications={() => { setNotifOpen(true); setLeftOpen(false); }}
            onThemePicker={() => { setThemePickerOpen(true); setLeftOpen(false); }}
          />
        )}

        {/* RIGHT SIDEBAR — Web links only */}
        {rightOpen && (
          <Sidebar
            side="right" visible={rightOpen} onClose={() => setRightOpen(false)}
            onOpenUrl={(url) => { openBrowser(url); setRightOpen(false); }}
          />
        )}

        {/* HUB MODAL */}
        {activeHub ? (
          <HubModal hubId={activeHub} visible={true} onClose={() => setActiveHub(null)} onOpenUrl={(url) => openBrowser(url)} />
        ) : null}

        {/* THEME PICKER */}
        <ThemePicker visible={themePickerOpen} onClose={() => setThemePickerOpen(false)} />

        {/* BOOKMARK MANAGER */}
        <BookmarkManager
          visible={bookmarkOpen}
          onClose={() => setBookmarkOpen(false)}
          onOpen={(url) => openBrowser(url)}
        />

        {/* DOWNLOAD MANAGER */}
        <DownloadManager
          visible={downloadOpen}
          onClose={() => setDownloadOpen(false)}
          onOpenFile={(item) => openBrowser(item.localUri || item.url)}
        />

        {/* HISTORY MANAGER */}
        <HistoryManager
          visible={historyOpen}
          onClose={() => setHistoryOpen(false)}
          onOpen={(url) => openBrowser(url)}
        />

        {/* VOICE SEARCH */}
        <VoiceSearch
          visible={voiceOpen}
          onClose={() => setVoiceOpen(false)}
          onResult={(url) => openBrowser(url)}
        />

        {/* NOTIFICATION CENTER */}
        <NotificationCenter
          visible={notifOpen}
          onClose={() => setNotifOpen(false)}
          onOpen={(url) => openBrowser(url)}
        />
      </LinearGradient>

      {/* BROWSER - Full Screen Modal */}
      <Modal visible={!!browserUrl} animationType="slide" presentationStyle="fullScreen" onRequestClose={() => setBrowserUrl(null)}>
        {browserUrl ? (
          <BrowserView
            url={browserUrl}
            onClose={() => { setBrowserUrl(null); setIncognito(false); }}
            incognito={incognito}
          />
        ) : null}
      </Modal>

      {/* QR SCANNER */}
      <QRScanner
        visible={qrOpen}
        onClose={() => setQrOpen(false)}
        onResult={(url) => { openBrowser(url); setQrOpen(false); }}
      />

      {/* PASSWORD MANAGER */}
      <PasswordManager
        visible={passwordOpen}
        onClose={() => setPasswordOpen(false)}
      />

      {/* Gallery, MediaPlayer, DigitalQuran — available via Media tab */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#000' },
  root: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 8 },
});
