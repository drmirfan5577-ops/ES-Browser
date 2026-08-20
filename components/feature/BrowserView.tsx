import React, { useRef, useState, useCallback } from 'react';
import {
  View, Text, Pressable, StyleSheet, ActivityIndicator,
  TextInput, Modal, ScrollView, FlatList, Share, Alert,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useBrowserContext } from '@/contexts/BrowserContext';
import { PiPPlayer, PlayerMode } from '@/components/feature/PiPPlayer';
import { BookmarkManager } from '@/components/feature/BookmarkManager';
import { DownloadManager } from '@/components/feature/DownloadManager';
import { HistoryManager } from '@/components/feature/HistoryManager';

interface BrowserTab {
  id: string;
  url: string;
  title: string;
  canGoBack: boolean;
  canGoForward: boolean;
  loading: boolean;
}

interface BrowserViewProps {
  url: string;
  onClose: () => void;
  incognito?: boolean;
}

function genId() { return `t_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`; }

function fmt(u: string) {
  if (!u.trim()) return 'https://www.google.com';
  if (u.startsWith('http://') || u.startsWith('https://')) return u;
  if (u.includes('.') && !u.includes(' ')) return `https://${u}`;
  return `https://www.google.com/search?q=${encodeURIComponent(u)}`;
}

// ── ADVANCED AD BLOCKER — uBlock + EasyList level filtering ──────────────────
const AD_BLOCK_SCRIPT = `(function(){
  // ── CSS SELECTOR BLACKLIST ─────────────────────────────────────────────────
  var CSS_SELECTORS=[
    // Standard ad elements
    'ins.adsbygoogle','ins[data-ad-client]','[data-ad-slot]','[data-ad-unit]',
    '[id*="google_ads"]','[id*="google-ads"]','[class*="google-ad"]',
    // Advertisement classes
    '[class*="advertisement"]','[class*="advertorial"]','[id*="advertisement"]',
    '[class*="ad-banner"]','[class*="adbanner"]','[id*="ad-banner"]',
    '[class*="banner-ad"]','[class*="bannerad"]',
    '[class*="ad-container"]','[id*="ad-container"]',
    '[class*="ad-wrapper"]','[id*="ad-wrapper"]',
    '[class*="ad-block"]','[id*="ad-block"]',
    '[class*="ads-"]','[class*="-ads"]','[id*="ads-"]','[id*="-ads"]',
    // Sponsor / promo
    '[class*="sponsor"]','[class*="sponsored"]','[data-sponsored]',
    '[class*="promo-banner"]','[class*="promotion-banner"]',
    // Popup / overlay
    '[class*="popup-overlay"]','[class*="popup-ad"]','[id*="popup-ad"]',
    '[class*="interstitial"]','[class*="overlay-ad"]','#overlay-ad',
    '.fixed-ad','[class*="floating-ad"]','[class*="sticky-ad"]',
    // DFP / GPT (Google Publisher Tags)
    'div[id^="div-gpt-ad"]','[class*="dfp-"]','[id*="dfp-"]',
    'div[data-google-query-id]','[id*="gpt-ad"]',
    // DoubleClick / Programmatic
    'iframe[src*="doubleclick.net"]','iframe[src*="googlesyndication"]',
    'iframe[src*="adnxs.com"]','iframe[src*="adsystem"]',
    'iframe[src*="adserver"]','iframe[src*="adbrite"]',
    'iframe[src*="adroll"]','iframe[src*="openx.net"]',
    'iframe[src*="rubiconproject"]','iframe[src*="pubmatic"]',
    'iframe[src*="criteo"]','iframe[src*="taboola"]',
    'iframe[src*="outbrain"]','iframe[src*="revcontent"]',
    // Scripts
    'script[src*="pagead2.googlesyndication"]',
    'script[src*="adsbygoogle"]',
    'script[src*="taboola"]','script[src*="outbrain"]',
    'script[src*="ads.twitter"]',
    // Taboola / Outbrain widgets
    '[id*="taboola"]','[class*="taboola"]',
    '[id*="outbrain"]','[class*="outbrain"]',
    '[class*="widget-sponsored"]',
    // Cookie consent banners (bonus)
    '#cookie-notice','#cookie-banner',
    '[class*="cookie-consent"]','[id*="cookie-consent"]',
    '[class*="gdpr-banner"]','[id*="gdpr"]',
  ];

  // ── NETWORK-LEVEL DOMAIN BLACKLIST ─────────────────────────────────────────
  var BAD_DOMAINS=[
    'doubleclick.net','googlesyndication.com','adnxs.com','adsystem.com',
    'taboola.com','outbrain.com','revcontent.com','criteo.com',
    'rubiconproject.com','pubmatic.com','openx.net','adroll.com',
    'adbrite.com','media.net','yllix.com','propellerads.com',
    'popcash.net','popads.net','bidvertiser.com','adsterra.com',
    'trafficjunky.net','exoclick.com','juicyads.com','hilltopads.net',
    'ad.gt','adcash.com','ad-maven.com','plugrush.com',
  ];

  // ── INJECT BLOCKING CSS ────────────────────────────────────────────────────
  function injectCSS(){
    var css=CSS_SELECTORS.join(',')+'{ display:none!important;visibility:hidden!important;height:0!important;max-height:0!important;opacity:0!important;pointer-events:none!important; }';
    var style=document.createElement('style');
    style.textContent=css;
    (document.head||document.documentElement).appendChild(style);
  }

  // ── DOM CLEANUP ────────────────────────────────────────────────────────────
  function domClean(){
    CSS_SELECTORS.forEach(function(sel){
      try{
        document.querySelectorAll(sel).forEach(function(el){
          try{
            el.style.cssText='display:none!important;visibility:hidden!important;height:0!important;max-height:0!important;';
            if(el.tagName==='IFRAME'||el.tagName==='SCRIPT'){if(el.parentNode)el.parentNode.removeChild(el);}
          }catch(e){}
        });
      }catch(e){}
    });
  }

  // ── BLOCK BAD IFRAMES ON INSERT ────────────────────────────────────────────
  function checkEl(el){
    if(!el||!el.tagName)return;
    var src=(el.src||el.href||'').toLowerCase();
    var isAdDomain=BAD_DOMAINS.some(function(d){return src.indexOf(d)>-1;});
    if(isAdDomain){
      try{if(el.parentNode)el.parentNode.removeChild(el);}catch(e){el.style.display='none';}
      return;
    }
    // Check class/id patterns
    var id=(el.id||'').toLowerCase();
    var cls=(el.className||'').toLowerCase();
    var adPatterns=['advert','adsense','adblock-','ad-unit','ad-slot','doubleclick','taboola','outbrain','googletag'];
    var isAdPattern=adPatterns.some(function(p){return id.indexOf(p)>-1||cls.indexOf(p)>-1;});
    if(isAdPattern){
      try{el.style.cssText='display:none!important;visibility:hidden!important;height:0!important;';}catch(e){}
    }
  }

  // ── OVERRIDE WINDOW.OPEN ───────────────────────────────────────────────────
  try{
    var _open=window.open;
    window.open=function(u,n,f){
      if(!u)return null;
      var lu=(u||'').toString().toLowerCase();
      var isAd=BAD_DOMAINS.some(function(d){return lu.indexOf(d)>-1;});
      if(isAd)return null;
      // Block blank popups (often ads)
      if(!n&&!f)return null;
      return _open?_open.apply(window,arguments):null;
    };
  }catch(e){}

  // ── THROTTLED ALERT SPAM BLOCKER ───────────────────────────────────────────
  try{
    var _alert=window.alert;
    var alertCount=0;
    window.alert=function(m){
      alertCount++;
      if(alertCount<=2&&_alert)_alert.call(window,m);
    };
    var _confirm=window.confirm;
    window.confirm=function(){return false;};
    var _prompt=window.prompt;
    window.prompt=function(){return null;};
  }catch(e){}

  // ── XMLHttpRequest INTERCEPT ───────────────────────────────────────────────
  try{
    var _xhrOpen=XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open=function(method,url){
      var lu=(url||'').toString().toLowerCase();
      var isAd=BAD_DOMAINS.some(function(d){return lu.indexOf(d)>-1;});
      if(isAd){this._blocked=true;return;}
      return _xhrOpen.apply(this,arguments);
    };
    var _xhrSend=XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send=function(){
      if(this._blocked)return;
      return _xhrSend.apply(this,arguments);
    };
  }catch(e){}

  // ── FETCH INTERCEPT ────────────────────────────────────────────────────────
  try{
    var _fetch=window.fetch;
    window.fetch=function(resource,init){
      var url=(typeof resource==='string'?resource:(resource&&resource.url)||'').toLowerCase();
      var isAd=BAD_DOMAINS.some(function(d){return url.indexOf(d)>-1;});
      if(isAd)return new Promise(function(){});
      return _fetch.apply(window,arguments);
    };
  }catch(e){}

  // ── MUTATION OBSERVER ──────────────────────────────────────────────────────
  function onMutation(mutations){
    mutations.forEach(function(m){
      m.addedNodes.forEach(function(node){
        if(node.nodeType===1){
          checkEl(node);
          // Check children
          var children=node.querySelectorAll?node.querySelectorAll('iframe,script,[class],[id]'):[];
          children.forEach(checkEl);
        }
      });
    });
    domClean();
  }

  // ── INIT ───────────────────────────────────────────────────────────────────
  injectCSS();
  domClean();
  try{
    new MutationObserver(onMutation).observe(
      document.documentElement,
      {childList:true,subtree:true,attributes:false}
    );
  }catch(e){}

  // Re-run periodically for lazy-loaded ads
  setInterval(domClean,3000);

})();true;`;

const READING_MODE_SCRIPT = `(function(){
  function extract(){
    var candidates=['article','main','[role="main"]','.post-content','.article-body','.entry-content','.content'];
    var el=null;
    for(var i=0;i<candidates.length;i++){var e=document.querySelector(candidates[i]);if(e&&e.innerText.length>200){el=e;break;}}
    if(!el)el=document.body;
    var text=el?el.innerText:'';
    window.ReactNativeWebView.postMessage(JSON.stringify({type:'reading_content',text:text,title:document.title}));
  }
  extract();
})();true;`;

export function BrowserView({ url, onClose, incognito = false }: BrowserViewProps) {
  const { theme, adBlockEnabled, addBookmark, bookmarks, addHistory } = useBrowserContext();
  const insets = useSafeAreaInsets();

  // ── TABS ───────────────────────────────────────────────────────────────────
  const initialTab: BrowserTab = { id: genId(), url: fmt(url), title: '', canGoBack: false, canGoForward: false, loading: true };
  const [tabs, setTabs] = useState<BrowserTab[]>([initialTab]);
  const [activeTabId, setActiveTabId] = useState(initialTab.id);
  const [tabBarOpen, setTabBarOpen] = useState(false);
  const webRefs = useRef<Record<string, WebView | null>>({});

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  // ── URL BAR ────────────────────────────────────────────────────────────────
  const [editingUrl, setEditingUrl] = useState(false);
  const [urlInput, setUrlInput] = useState(url);

  // ── PiP ────────────────────────────────────────────────────────────────────
  const [pipMode, setPipMode] = useState<PlayerMode>('hidden');
  const [pipUrl, setPipUrl] = useState('');

  // ── MODALS ─────────────────────────────────────────────────────────────────
  const [bookmarkOpen, setBookmarkOpen] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // ── READING MODE ───────────────────────────────────────────────────────────
  const [readingMode, setReadingMode] = useState(false);
  const [readingContent, setReadingContent] = useState('');
  const [readingTitle, setReadingTitle] = useState('');
  const [readingFontSize, setReadingFontSize] = useState(16);

  const isBookmarked = bookmarks.some(b => b.url === activeTab.url);

  // ── TAB ACTIONS ────────────────────────────────────────────────────────────
  const addTab = (newUrl = 'https://www.google.com') => {
    const tab: BrowserTab = { id: genId(), url: fmt(newUrl), title: '', canGoBack: false, canGoForward: false, loading: true };
    setTabs(prev => [...prev, tab]);
    setActiveTabId(tab.id);
    setTabBarOpen(false);
  };

  const closeTab = (id: string) => {
    if (tabs.length === 1) { onClose(); return; }
    const idx = tabs.findIndex(t => t.id === id);
    const newTabs = tabs.filter(t => t.id !== id);
    setTabs(newTabs);
    if (activeTabId === id) {
      const newActive = newTabs[Math.min(idx, newTabs.length - 1)];
      setActiveTabId(newActive.id);
    }
  };

  const updateTab = (id: string, changes: Partial<BrowserTab>) => {
    setTabs(prev => prev.map(t => t.id === id ? { ...t, ...changes } : t));
  };

  // ── NAVIGATE ───────────────────────────────────────────────────────────────
  const navigate = (u: string, tabId?: string) => {
    const full = fmt(u);
    const tid = tabId || activeTabId;
    const ref = webRefs.current[tid];
    if (ref) {
      ref.injectJavaScript(`window.location.href="${full}";true;`);
    }
    updateTab(tid, { url: full });
    setUrlInput(full);
    setEditingUrl(false);
  };

  // ── MESSAGE HANDLER ────────────────────────────────────────────────────────
  const handleMessage = (e: any, tabId: string) => {
    try {
      const msg = JSON.parse(e.nativeEvent.data);
      if (msg.type === 'title') updateTab(tabId, { title: msg.value });
      if (msg.type === 'reading_content') {
        setReadingContent(msg.text);
        setReadingTitle(msg.title);
        setReadingMode(true);
      }
    } catch {}
  };

  const handleBookmark = () => {
    if (!isBookmarked) {
      addBookmark({ title: activeTab.title || activeTab.url, url: activeTab.url, folder: 'All' });
    } else {
      setBookmarkOpen(true);
    }
  };

  const handleShare = async () => {
    try { await Share.share({ url: activeTab.url, message: activeTab.url }); } catch {}
    setMenuOpen(false);
  };

  const handleOpenPiP = () => {
    setPipUrl(activeTab.url);
    setPipMode('pip');
    setMenuOpen(false);
  };

  const handleReadingMode = () => {
    webRefs.current[activeTabId]?.injectJavaScript(READING_MODE_SCRIPT);
    setMenuOpen(false);
  };

  const handleNavEnd = useCallback((nav: any, tabId: string) => {
    updateTab(tabId, {
      url: nav.url,
      canGoBack: nav.canGoBack,
      canGoForward: nav.canGoForward,
      loading: nav.loading,
      title: nav.title || '',
    });
    if (!nav.loading && nav.url && !incognito) {
      addHistory({ url: nav.url, title: nav.title || '', visitedAt: Date.now(), domain: '' });
    }
    if (tabId === activeTabId) setUrlInput(nav.url);
  }, [activeTabId, incognito]);

  // Chrome background
  const chromeBg = incognito
    ? ['#1A0030', '#2D0050', '#1A0030'] as const
    : [...theme.gradient] as any;

  const titleScript = `(function(){window.ReactNativeWebView.postMessage(JSON.stringify({type:'title',value:document.title}));})();true;`;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>

      {/* INCOGNITO BANNER */}
      {incognito && (
        <View style={styles.incognitoBanner}>
          <MaterialIcons name="privacy-tip" size={14} color="#CE93D8" />
          <Text style={styles.incognitoText}>Incognito Mode | نجی موڈ — No history saved</Text>
        </View>
      )}

      {/* ── TAB BAR (when open) ── */}
      {tabBarOpen && (
        <View style={styles.tabBarOverlay}>
          <LinearGradient colors={['rgba(0,0,0,0.97)', 'rgba(10,10,25,0.97)']} style={StyleSheet.absoluteFillObject} />
          <View style={styles.tabBarHeader}>
            <Text style={styles.tabBarTitle}>{tabs.length} Tab{tabs.length !== 1 ? 's' : ''} | {tabs.length} ٹیب</Text>
            <Pressable onPress={() => addTab()} style={styles.newTabBtn}>
              <MaterialIcons name="add" size={20} color="#fff" />
              <Text style={styles.newTabText}>New Tab</Text>
            </Pressable>
            <Pressable onPress={() => setTabBarOpen(false)} hitSlop={8} style={styles.closeTabBar}>
              <MaterialIcons name="close" size={22} color="#fff" />
            </Pressable>
          </View>
          <FlatList
            data={tabs}
            keyExtractor={t => t.id}
            numColumns={2}
            contentContainerStyle={{ padding: 10, gap: 10 }}
            columnWrapperStyle={{ gap: 10 }}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => { setActiveTabId(item.id); setTabBarOpen(false); }}
                style={[styles.tabCard, { borderColor: item.id === activeTabId ? theme.glowColor : 'rgba(255,255,255,0.15)' }]}
              >
                <LinearGradient
                  colors={item.id === activeTabId ? [theme.primary + '40', 'transparent'] : ['rgba(255,255,255,0.08)', 'transparent']}
                  style={StyleSheet.absoluteFillObject}
                />
                <View style={styles.tabCardHeader}>
                  <MaterialIcons name="language" size={14} color={item.id === activeTabId ? theme.glowColor : 'rgba(255,255,255,0.6)'} />
                  <Text style={styles.tabCardDomain} numberOfLines={1}>
                    {item.url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}
                  </Text>
                  <Pressable onPress={() => closeTab(item.id)} hitSlop={8} style={styles.tabCloseBtn}>
                    <MaterialIcons name="close" size={14} color="rgba(255,255,255,0.6)" />
                  </Pressable>
                </View>
                <Text style={styles.tabCardTitle} numberOfLines={2}>
                  {item.title || item.url.replace(/^https?:\/\//, '')}
                </Text>
                {item.loading && <ActivityIndicator size="small" color={theme.glowColor} style={{ marginTop: 4 }} />}
              </Pressable>
            )}
          />
        </View>
      )}

      {/* CHROME BAR */}
      <LinearGradient colors={chromeBg} style={styles.chrome}>
        {/* Close */}
        <Pressable onPress={onClose} style={styles.chromeBtn} hitSlop={8}>
          <MaterialIcons name="close" size={20} color="#fff" />
        </Pressable>

        {/* Back / Forward */}
        <Pressable onPress={() => webRefs.current[activeTabId]?.goBack()} hitSlop={6} style={styles.chromeBtn}>
          <MaterialIcons name="arrow-back" size={18} color={activeTab.canGoBack ? '#fff' : 'rgba(255,255,255,0.3)'} />
        </Pressable>
        <Pressable onPress={() => webRefs.current[activeTabId]?.goForward()} hitSlop={6} style={styles.chromeBtn}>
          <MaterialIcons name="arrow-forward" size={18} color={activeTab.canGoForward ? '#fff' : 'rgba(255,255,255,0.3)'} />
        </Pressable>

        {/* URL Bar */}
        {editingUrl ? (
          <TextInput
            style={styles.urlInput}
            value={urlInput}
            onChangeText={setUrlInput}
            onSubmitEditing={() => navigate(urlInput)}
            onBlur={() => setEditingUrl(false)}
            autoFocus autoCapitalize="none" autoCorrect={false}
            keyboardType="url" returnKeyType="go" selectTextOnFocus
          />
        ) : (
          <Pressable style={styles.urlDisplay} onPress={() => { setUrlInput(activeTab.url); setEditingUrl(true); }}>
            <MaterialIcons
              name={incognito ? 'privacy-tip' : 'lock'}
              size={11}
              color={incognito ? '#CE93D8' : 'rgba(255,255,255,0.7)'}
            />
            <Text style={[styles.urlText, incognito && { color: '#CE93D8' }]} numberOfLines={1}>
              {activeTab.title || activeTab.url.replace(/^https?:\/\//, '')}
            </Text>
          </Pressable>
        )}

        {/* Reload */}
        <Pressable onPress={() => webRefs.current[activeTabId]?.reload()} hitSlop={6} style={styles.chromeBtn}>
          <MaterialIcons name={activeTab.loading ? 'close' : 'refresh'} size={18} color="#fff" />
        </Pressable>

        {/* Bookmark */}
        <Pressable onPress={handleBookmark} hitSlop={6} style={styles.chromeBtn}>
          <MaterialIcons name={isBookmarked ? 'bookmark' : 'bookmark-border'} size={18} color={isBookmarked ? '#FFD700' : '#fff'} />
        </Pressable>

        {/* Tabs */}
        <Pressable onPress={() => setTabBarOpen(true)} style={styles.tabCountBtn} hitSlop={6}>
          <LinearGradient colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']} style={StyleSheet.absoluteFillObject} />
          <Text style={styles.tabCount}>{tabs.length}</Text>
        </Pressable>

        {/* Menu */}
        <Pressable onPress={() => setMenuOpen(true)} hitSlop={6} style={styles.chromeBtn}>
          <MaterialIcons name="more-vert" size={18} color="#fff" />
        </Pressable>

        {/* AdBlock dot */}
        <View style={[styles.statusDot, { backgroundColor: adBlockEnabled ? '#00FF88' : '#FF5555' }]} />
      </LinearGradient>

      {/* Loading bar */}
      {activeTab.loading && (
        <View style={styles.loadingBar}>
          <View style={[styles.loadingFill, { backgroundColor: theme.glowColor }]} />
        </View>
      )}

      {/* WEBVIEW(s) — render all tabs but only show active */}
      {tabs.map(tab => (
        <View key={tab.id} style={[styles.webviewWrap, tab.id !== activeTabId && styles.hidden]}>
          <WebView
            ref={r => { webRefs.current[tab.id] = r; }}
            source={{ uri: tab.url }}
            style={styles.webview}
            incognito={incognito}
            onNavigationStateChange={(nav) => handleNavEnd(nav, tab.id)}
            onLoadEnd={() => {
              webRefs.current[tab.id]?.injectJavaScript(titleScript);
              if (adBlockEnabled && !incognito) {
                webRefs.current[tab.id]?.injectJavaScript(AD_BLOCK_SCRIPT);
              }
            }}
            onMessage={(e) => handleMessage(e, tab.id)}
            javaScriptEnabled
            domStorageEnabled
            allowsInlineMediaPlayback
            mediaPlaybackRequiresUserAction={false}
            allowsFullscreenVideo
            sharedCookiesEnabled={!incognito}
            thirdPartyCookiesEnabled={!incognito}
          />
        </View>
      ))}

      {/* PiP Player */}
      {pipMode !== 'hidden' && (
        <PiPPlayer
          url={pipUrl}
          title={activeTab.title}
          mode={pipMode}
          onModeChange={setPipMode}
          onClose={() => setPipMode('hidden')}
        />
      )}

      {/* ── READING MODE OVERLAY ── */}
      <Modal visible={readingMode} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setReadingMode(false)}>
        <View style={styles.readingContainer}>
          <LinearGradient colors={['#FAF7F0', '#FFF8E7']} style={StyleSheet.absoluteFillObject} />
          <View style={styles.readingHeader}>
            <Pressable onPress={() => setReadingMode(false)} style={styles.readingClose}>
              <MaterialIcons name="close" size={22} color="#333" />
            </Pressable>
            <Text style={styles.readingHeaderTitle} numberOfLines={1}>{readingTitle}</Text>
            <View style={styles.readingFontControls}>
              <Pressable onPress={() => setReadingFontSize(s => Math.max(12, s - 2))} style={styles.fontBtn}>
                <Text style={styles.fontBtnText}>A-</Text>
              </Pressable>
              <Text style={styles.fontSizeDisplay}>{readingFontSize}</Text>
              <Pressable onPress={() => setReadingFontSize(s => Math.min(28, s + 2))} style={styles.fontBtn}>
                <Text style={styles.fontBtnText}>A+</Text>
              </Pressable>
            </View>
          </View>
          <ScrollView style={styles.readingScroll} showsVerticalScrollIndicator={false}>
            <View style={styles.readingContent}>
              <Text style={styles.readingArticleTitle}>{readingTitle}</Text>
              <View style={styles.readingDivider} />
              <Text style={[styles.readingText, { fontSize: readingFontSize, lineHeight: readingFontSize * 1.7 }]}>
                {readingContent}
              </Text>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* BROWSER MENU */}
      <Modal visible={menuOpen} transparent animationType="fade" onRequestClose={() => setMenuOpen(false)}>
        <Pressable style={styles.menuOverlay} onPress={() => setMenuOpen(false)}>
          <View style={[styles.menuSheet, { marginTop: insets.top + 56 }]}>
            <LinearGradient colors={['rgba(15,15,35,0.98)', 'rgba(5,5,20,0.98)']} style={StyleSheet.absoluteFillObject} />
            {[
              { icon: 'picture-in-picture-alt', label: 'Picture-in-Picture', labelUr: 'پی آئی پی موڈ', onPress: handleOpenPiP },
              { icon: 'chrome-reader-mode', label: 'Reading Mode', labelUr: 'ریڈنگ موڈ', onPress: handleReadingMode },
              { icon: 'add', label: 'New Tab', labelUr: 'نئی ٹیب', onPress: () => { addTab(); setMenuOpen(false); } },
              { icon: 'bookmark-add', label: 'Bookmarks', labelUr: 'بک مارکس', onPress: () => { setBookmarkOpen(true); setMenuOpen(false); } },
              { icon: 'history', label: 'History', labelUr: 'ہسٹری', onPress: () => { setHistoryOpen(true); setMenuOpen(false); } },
              { icon: 'download', label: 'Downloads', labelUr: 'ڈاؤنلوڈز', onPress: () => { setDownloadOpen(true); setMenuOpen(false); } },
              { icon: 'share', label: 'Share', labelUr: 'شیئر', onPress: handleShare },
            ].map(item => (
              <Pressable key={item.label} onPress={item.onPress}
                style={({ pressed }) => [styles.menuItem, { opacity: pressed ? 0.7 : 1 }]}>
                <MaterialIcons name={item.icon as any} size={20} color="#fff" />
                <View>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  <Text style={styles.menuLabelUr}>{item.labelUr}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>

      {/* BOOKMARK MANAGER */}
      <BookmarkManager
        visible={bookmarkOpen}
        onClose={() => setBookmarkOpen(false)}
        onOpen={navigate}
        currentUrl={activeTab.url}
        currentTitle={activeTab.title}
      />

      {/* DOWNLOAD MANAGER */}
      <DownloadManager
        visible={downloadOpen}
        onClose={() => setDownloadOpen(false)}
        onOpenFile={(item) => { setPipUrl(item.localUri || item.url); setPipMode('half'); }}
      />

      {/* HISTORY MANAGER */}
      <HistoryManager
        visible={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onOpen={(u) => { navigate(u); setHistoryOpen(false); }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  incognitoBanner: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(100,0,120,0.85)', paddingHorizontal: 14, paddingVertical: 5 },
  incognitoText: { color: '#CE93D8', fontSize: 11, fontWeight: '600', flex: 1 },

  // Tab Bar
  tabBarOverlay: { ...StyleSheet.absoluteFillObject, zIndex: 50, overflow: 'hidden' },
  tabBarHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
  tabBarTitle: { flex: 1, color: '#fff', fontSize: 15, fontWeight: '700' },
  newTabBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
  newTabText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  closeTabBar: { padding: 6, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 8 },
  tabCard: { flex: 1, borderRadius: 12, borderWidth: 1.5, overflow: 'hidden', padding: 10, minHeight: 80, gap: 4 },
  tabCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  tabCardDomain: { flex: 1, color: 'rgba(255,255,255,0.7)', fontSize: 10 },
  tabCloseBtn: { padding: 2 },
  tabCardTitle: { color: '#fff', fontSize: 11, fontWeight: '600' },

  // Chrome
  chrome: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 4, paddingVertical: 7, gap: 2 },
  chromeBtn: { padding: 5, borderRadius: 7, minWidth: 30, alignItems: 'center' },
  urlDisplay: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, paddingHorizontal: 9, paddingVertical: 6 },
  urlText: { flex: 1, color: '#fff', fontSize: 10, fontWeight: '500' },
  urlInput: { flex: 1, backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5, fontSize: 12, color: '#333' },
  tabCountBtn: { width: 26, height: 26, borderRadius: 7, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.5)' },
  tabCount: { color: '#fff', fontSize: 11, fontWeight: '900' },
  statusDot: { width: 7, height: 7, borderRadius: 4, marginLeft: 2, marginRight: 2 },
  webviewWrap: { flex: 1 },
  hidden: { opacity: 0, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1 },
  webview: { flex: 1 },
  loadingBar: { height: 2.5, backgroundColor: 'rgba(255,255,255,0.15)' },
  loadingFill: { height: 2.5, width: '60%' },

  // Reading Mode
  readingContainer: { flex: 1, overflow: 'hidden' },
  readingHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.1)', backgroundColor: 'rgba(255,255,255,0.9)' },
  readingClose: { padding: 6 },
  readingHeaderTitle: { flex: 1, color: '#333', fontSize: 13, fontWeight: '700' },
  readingFontControls: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(0,0,0,0.08)', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  fontBtn: { padding: 3 },
  fontBtnText: { color: '#333', fontSize: 12, fontWeight: '800' },
  fontSizeDisplay: { color: '#666', fontSize: 11, minWidth: 22, textAlign: 'center' },
  readingScroll: { flex: 1 },
  readingContent: { padding: 20, paddingBottom: 60 },
  readingArticleTitle: { color: '#1A1A1A', fontSize: 22, fontWeight: '900', lineHeight: 32, marginBottom: 12 },
  readingDivider: { height: 2, backgroundColor: '#E5E5E5', borderRadius: 1, marginBottom: 18 },
  readingText: { color: '#333', lineHeight: 26 },

  // Menu
  menuOverlay: { flex: 1 },
  menuSheet: { position: 'absolute', right: 8, width: 230, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', shadowColor: '#000', shadowOpacity: 0.5, shadowRadius: 20, elevation: 20 },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.07)' },
  menuLabel: { color: '#fff', fontSize: 13, fontWeight: '600' },
  menuLabelUr: { color: 'rgba(255,255,255,0.5)', fontSize: 10 },
});
