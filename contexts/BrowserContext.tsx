import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppTheme, THEMES, DEFAULT_THEME } from '@/constants/theme';
import { TICKER_DEFAULTS } from '@/constants/config';
import { Bookmark } from '@/components/feature/BookmarkManager';
import { DownloadItem } from '@/components/feature/DownloadManager';
import { HistoryItem } from '@/components/feature/HistoryManager';

export interface SavedPassword {
  id: string;
  domain: string;
  username: string;
  password: string;
  title: string;
  createdAt: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'download' | 'vpn' | 'bookmark';
  read: boolean;
  createdAt: number;
  url?: string;
}

export interface CustomPersonality {
  id: string;
  name: string;
  ur: string;
  title: string;
  titleUr: string;
  imageUri: string | null;
}

export interface LinkedSite {
  id: string;
  name: string;
  nameUr: string;
  url: string;
  icon: string;
  color: string;
  enabled: boolean;
}

export interface InstalledApp {
  id: string;
  name: string;
  nameUr: string;
  url?: string;
  packageName?: string;
  emoji: string;
  bg: string;
  source: 'url' | 'playstore' | 'mobile';
}

interface BrandingText { arabic: string; urdu: string; english: string; }

interface BrowserContextType {
  // Theme
  theme: AppTheme;
  setTheme: (t: AppTheme) => void;
  // Features
  vpnEnabled: boolean;
  setVpnEnabled: (v: boolean) => void;
  adBlockEnabled: boolean;
  setAdBlockEnabled: (v: boolean) => void;
  // Tickers / Branding
  tickerMessages: string[];
  setTickerMessages: (msgs: string[]) => void;
  brandingText: BrandingText;
  setBrandingText: (b: BrandingText) => void;
  // Admin
  adminPassword: string;
  setAdminPassword: (p: string) => void;
  // Bookmarks
  bookmarks: Bookmark[];
  addBookmark: (bm: Omit<Bookmark, 'id' | 'createdAt'>) => void;
  deleteBookmark: (id: string) => void;
  editBookmark: (id: string, changes: Partial<Bookmark>) => void;
  // Downloads
  downloads: DownloadItem[];
  addDownload: (dl: Omit<DownloadItem, 'id' | 'createdAt'>) => void;
  deleteDownload: (id: string) => void;
  clearDownloads: () => void;
  updateDownload: (id: string, changes: Partial<DownloadItem>) => void;
  // History
  history: HistoryItem[];
  addHistory: (item: Omit<HistoryItem, 'id'>) => void;
  deleteHistory: (id: string) => void;
  clearHistory: () => void;
  // Passwords
  passwords: SavedPassword[];
  addPassword: (p: Omit<SavedPassword, 'id' | 'createdAt'>) => void;
  deletePassword: (id: string) => void;
  updatePassword: (id: string, changes: Partial<SavedPassword>) => void;
  // Notifications
  notifications: Notification[];
  addNotification: (n: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;
  unreadCount: number;
  // Installed Apps
  installedApps: InstalledApp[];
  addInstalledApp: (app: InstalledApp) => void;
  removeInstalledApp: (id: string) => void;
  // Logo & Personalities
  customLogoUri: string | null;
  setCustomLogoUri: (uri: string | null) => void;
  customPersonalities: CustomPersonality[];
  setCustomPersonalities: (p: CustomPersonality[]) => void;
  // Hub Apps (admin editable)
  customHubApps: Record<string, any[]>;
  setCustomHubApps: (hubId: string, apps: any[]) => void;
  // Linked Sites
  linkedSites: LinkedSite[];
  setLinkedSites: (sites: LinkedSite[]) => void;
}

const BrowserContext = createContext<BrowserContextType | undefined>(undefined);

const KEYS = {
  theme: 'esb_theme',
  vpn: 'esb_vpn',
  adblock: 'esb_adblock',
  tickers: 'esb_tickers',
  branding: 'esb_branding',
  adminPwd: 'esb_admin_pwd',
  bookmarks: 'esb_bookmarks',
  downloads: 'esb_downloads',
  history: 'esb_history',
  passwords: 'esb_passwords',
  notifications: 'esb_notifications',
  installedApps: 'esb_installed_apps',
  customLogo: 'esb_custom_logo',
  customPersonalities: 'esb_custom_personalities',
  customHubApps: 'esb_custom_hub_apps',
  linkedSites: 'esb_linked_sites',
};

const DEFAULT_BRANDING: BrandingText = {
  arabic: 'بسم اللّٰہ الرحمٰن الرحیم',
  urdu: 'شروع اللہ کے نام سے جو بڑا مہربان نہایت رحم والا ہے',
  english: 'In the Name of ALLAH Almighty, The most Gracious, The most Merciful',
};

function genId() { return `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`; }
function getDomain(url: string): string {
  try { return new URL(url).hostname.replace('www.', ''); } catch { return url; }
}

export function BrowserProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<AppTheme>(DEFAULT_THEME);
  const [vpnEnabled, setVpnState] = useState(false);
  const [adBlockEnabled, setAdBlockState] = useState(true);
  const [tickerMessages, setTickerState] = useState<string[]>(TICKER_DEFAULTS);
  const [brandingText, setBrandingState] = useState<BrandingText>(DEFAULT_BRANDING);
  const [adminPassword, setAdminPwdState] = useState('Daood5577');
  const [bookmarks, setBookmarksState] = useState<Bookmark[]>([]);
  const [downloads, setDownloadsState] = useState<DownloadItem[]>([]);
  const [history, setHistoryState] = useState<HistoryItem[]>([]);
  const [passwords, setPasswordsState] = useState<SavedPassword[]>([]);
  const [notifications, setNotificationsState] = useState<Notification[]>([]);
  const [installedApps, setInstalledAppsState] = useState<InstalledApp[]>([]);
  const [customLogoUri, setCustomLogoUriState] = useState<string | null>(null);
  const [customPersonalities, setCustomPersonalitiesState] = useState<CustomPersonality[]>([]);
  const [customHubApps, setCustomHubAppsState] = useState<Record<string, any[]>>({});
  const [linkedSites, setLinkedSitesState] = useState<LinkedSite[]>([
    { id: 'ls1', name: 'EvEr SmArT BrOwSeR', nameUr: 'براؤزر ویب سائٹ', url: 'https://github.com/drmirfan5577-ops/EverSmartBrowser-', icon: 'language', color: '#00FF88', enabled: true },
    { id: 'ls2', name: 'My Website 2', nameUr: 'میری ویب سائٹ', url: '', icon: 'public', color: '#00DCFF', enabled: false },
    { id: 'ls3', name: 'My Website 3', nameUr: 'میری ویب سائٹ', url: '', icon: 'web', color: '#FFD700', enabled: false },
    { id: 'ls4', name: 'My Website 4', nameUr: 'میری ویب سائٹ', url: '', icon: 'link', color: '#AB47BC', enabled: false },
    { id: 'ls5', name: 'My Website 5', nameUr: 'میری ویب سائٹ', url: '', icon: 'share', color: '#FF7043', enabled: false },
  ]);

  useEffect(() => {
    (async () => {
      try {
        const vals = await Promise.all([
          AsyncStorage.getItem(KEYS.theme),
          AsyncStorage.getItem(KEYS.vpn),
          AsyncStorage.getItem(KEYS.adblock),
          AsyncStorage.getItem(KEYS.tickers),
          AsyncStorage.getItem(KEYS.branding),
          AsyncStorage.getItem(KEYS.adminPwd),
          AsyncStorage.getItem(KEYS.bookmarks),
          AsyncStorage.getItem(KEYS.downloads),
          AsyncStorage.getItem(KEYS.history),
          AsyncStorage.getItem(KEYS.passwords),
          AsyncStorage.getItem(KEYS.notifications),
          AsyncStorage.getItem(KEYS.installedApps),
        ]);
        const [tid, vpn, adb, ticks, brand, pwd, bms, dls, hist, pwds, notifs, iapps] = vals;
        if (tid) { const t = THEMES.find(x => x.id === tid); if (t) setThemeState(t); }
        if (vpn !== null) setVpnState(vpn === 'true');
        if (adb !== null) setAdBlockState(adb !== 'false');
        if (ticks) setTickerState(JSON.parse(ticks));
        if (brand) setBrandingState(JSON.parse(brand));
        if (pwd) setAdminPwdState(pwd);
        if (bms) setBookmarksState(JSON.parse(bms));
        if (dls) setDownloadsState(JSON.parse(dls));
        if (hist) setHistoryState(JSON.parse(hist));
        if (pwds) setPasswordsState(JSON.parse(pwds));
        if (notifs) setNotificationsState(JSON.parse(notifs));
        if (iapps) setInstalledAppsState(JSON.parse(iapps));
        const [logo, cpers, chubs] = await Promise.all([
          AsyncStorage.getItem(KEYS.customLogo),
          AsyncStorage.getItem(KEYS.customPersonalities),
          AsyncStorage.getItem(KEYS.customHubApps),
        ]);
        if (logo) setCustomLogoUriState(logo);
        if (cpers) setCustomPersonalitiesState(JSON.parse(cpers));
        if (chubs) setCustomHubAppsState(JSON.parse(chubs));
        const lsites = await AsyncStorage.getItem(KEYS.linkedSites);
        if (lsites) setLinkedSitesState(JSON.parse(lsites));
      } catch (e) {}
    })();
  }, []);

  const setTheme = (t: AppTheme) => { setThemeState(t); AsyncStorage.setItem(KEYS.theme, t.id); };
  const setVpnEnabled = (v: boolean) => {
    setVpnState(v);
    AsyncStorage.setItem(KEYS.vpn, String(v));
    // Add VPN notification
    const notif: Notification = {
      id: genId(), title: v ? '⚔️ VPN Connected' : '🔓 VPN Disconnected',
      message: v ? 'VPN shield is now ACTIVE — محفوظ براؤزنگ' : 'VPN shield turned off | وی پی این بند',
      type: 'vpn', read: false, createdAt: Date.now(),
    };
    setNotificationsState(prev => {
      const u = [notif, ...prev].slice(0, 100);
      AsyncStorage.setItem(KEYS.notifications, JSON.stringify(u));
      return u;
    });
  };
  const setAdBlockEnabled = (v: boolean) => { setAdBlockState(v); AsyncStorage.setItem(KEYS.adblock, String(v)); };
  const setTickerMessages = (msgs: string[]) => { setTickerState(msgs); AsyncStorage.setItem(KEYS.tickers, JSON.stringify(msgs)); };
  const setBrandingText = (b: BrandingText) => { setBrandingState(b); AsyncStorage.setItem(KEYS.branding, JSON.stringify(b)); };
  const setAdminPassword = (p: string) => { setAdminPwdState(p); AsyncStorage.setItem(KEYS.adminPwd, p); };

  // Bookmarks
  const addBookmark = (bm: Omit<Bookmark, 'id' | 'createdAt'>) => {
    const newBm: Bookmark = { ...bm, id: genId(), createdAt: Date.now() };
    setBookmarksState(prev => { const u = [newBm, ...prev]; AsyncStorage.setItem(KEYS.bookmarks, JSON.stringify(u)); return u; });
    addNotification({ title: '🔖 Bookmark Saved', message: bm.title || bm.url, type: 'bookmark', url: bm.url });
  };
  const deleteBookmark = (id: string) => {
    setBookmarksState(prev => { const u = prev.filter(b => b.id !== id); AsyncStorage.setItem(KEYS.bookmarks, JSON.stringify(u)); return u; });
  };
  const editBookmark = (id: string, changes: Partial<Bookmark>) => {
    setBookmarksState(prev => { const u = prev.map(b => b.id === id ? { ...b, ...changes } : b); AsyncStorage.setItem(KEYS.bookmarks, JSON.stringify(u)); return u; });
  };

  // Downloads
  const addDownload = (dl: Omit<DownloadItem, 'id' | 'createdAt'>) => {
    const newDl: DownloadItem = { ...dl, id: genId(), createdAt: Date.now() };
    setDownloadsState(prev => { const u = [newDl, ...prev]; AsyncStorage.setItem(KEYS.downloads, JSON.stringify(u)); return u; });
  };
  const deleteDownload = (id: string) => {
    setDownloadsState(prev => { const u = prev.filter(d => d.id !== id); AsyncStorage.setItem(KEYS.downloads, JSON.stringify(u)); return u; });
  };
  const clearDownloads = () => { setDownloadsState([]); AsyncStorage.setItem(KEYS.downloads, '[]'); };
  const updateDownload = (id: string, changes: Partial<DownloadItem>) => {
    setDownloadsState(prev => { const u = prev.map(d => d.id === id ? { ...d, ...changes } : d); AsyncStorage.setItem(KEYS.downloads, JSON.stringify(u)); return u; });
  };

  // History
  const addHistory = (item: Omit<HistoryItem, 'id'>) => {
    const newItem: HistoryItem = { ...item, id: genId(), domain: getDomain(item.url) };
    setHistoryState(prev => {
      const deduped = prev.filter(h => !(h.url === item.url && Date.now() - h.visitedAt < 30000));
      const u = [newItem, ...deduped].slice(0, 500);
      AsyncStorage.setItem(KEYS.history, JSON.stringify(u));
      return u;
    });
  };
  const deleteHistory = (id: string) => {
    setHistoryState(prev => { const u = prev.filter(h => h.id !== id); AsyncStorage.setItem(KEYS.history, JSON.stringify(u)); return u; });
  };
  const clearHistory = () => { setHistoryState([]); AsyncStorage.setItem(KEYS.history, '[]'); };

  // Passwords
  const addPassword = (p: Omit<SavedPassword, 'id' | 'createdAt'>) => {
    const newP: SavedPassword = { ...p, id: genId(), createdAt: Date.now() };
    setPasswordsState(prev => { const u = [newP, ...prev]; AsyncStorage.setItem(KEYS.passwords, JSON.stringify(u)); return u; });
    addNotification({ title: '🔑 Password Saved', message: `${p.domain} — ${p.username}`, type: 'info' });
  };
  const deletePassword = (id: string) => {
    setPasswordsState(prev => { const u = prev.filter(p => p.id !== id); AsyncStorage.setItem(KEYS.passwords, JSON.stringify(u)); return u; });
  };
  const updatePassword = (id: string, changes: Partial<SavedPassword>) => {
    setPasswordsState(prev => { const u = prev.map(p => p.id === id ? { ...p, ...changes } : p); AsyncStorage.setItem(KEYS.passwords, JSON.stringify(u)); return u; });
  };

  // Notifications
  const addNotification = (n: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const newN: Notification = { ...n, id: genId(), createdAt: Date.now(), read: false };
    setNotificationsState(prev => {
      const u = [newN, ...prev].slice(0, 100);
      AsyncStorage.setItem(KEYS.notifications, JSON.stringify(u));
      return u;
    });
  };
  const markNotificationRead = (id: string) => {
    setNotificationsState(prev => { const u = prev.map(n => n.id === id ? { ...n, read: true } : n); AsyncStorage.setItem(KEYS.notifications, JSON.stringify(u)); return u; });
  };
  const markAllNotificationsRead = () => {
    setNotificationsState(prev => { const u = prev.map(n => ({ ...n, read: true })); AsyncStorage.setItem(KEYS.notifications, JSON.stringify(u)); return u; });
  };
  const clearNotifications = () => { setNotificationsState([]); AsyncStorage.setItem(KEYS.notifications, '[]'); };
  const unreadCount = notifications.filter(n => !n.read).length;

  const setCustomLogoUri = (uri: string | null) => {
    setCustomLogoUriState(uri);
    if (uri) AsyncStorage.setItem(KEYS.customLogo, uri);
    else AsyncStorage.removeItem(KEYS.customLogo);
  };
  const setCustomPersonalities = (p: CustomPersonality[]) => {
    setCustomPersonalitiesState(p);
    AsyncStorage.setItem(KEYS.customPersonalities, JSON.stringify(p));
  };
  const setLinkedSites = (sites: LinkedSite[]) => {
    setLinkedSitesState(sites);
    AsyncStorage.setItem(KEYS.linkedSites, JSON.stringify(sites));
  };

  const setCustomHubApps = (hubId: string, apps: any[]) => {
    setCustomHubAppsState(prev => {
      const u = { ...prev, [hubId]: apps };
      AsyncStorage.setItem(KEYS.customHubApps, JSON.stringify(u));
      return u;
    });
  };

  // Installed Apps
  const addInstalledApp = (app: InstalledApp) => {
    setInstalledAppsState(prev => {
      if (prev.find(a => a.id === app.id)) return prev;
      const u = [...prev, app];
      AsyncStorage.setItem(KEYS.installedApps, JSON.stringify(u));
      return u;
    });
  };
  const removeInstalledApp = (id: string) => {
    setInstalledAppsState(prev => { const u = prev.filter(a => a.id !== id); AsyncStorage.setItem(KEYS.installedApps, JSON.stringify(u)); return u; });
  };

  return (
    <BrowserContext.Provider value={{
      theme, setTheme,
      vpnEnabled, setVpnEnabled,
      adBlockEnabled, setAdBlockEnabled,
      tickerMessages, setTickerMessages,
      brandingText, setBrandingText,
      adminPassword, setAdminPassword,
      bookmarks, addBookmark, deleteBookmark, editBookmark,
      downloads, addDownload, deleteDownload, clearDownloads, updateDownload,
      history, addHistory, deleteHistory, clearHistory,
      passwords, addPassword, deletePassword, updatePassword,
      notifications, addNotification, markNotificationRead, markAllNotificationsRead, clearNotifications, unreadCount,
      installedApps, addInstalledApp, removeInstalledApp,
      customLogoUri, setCustomLogoUri,
      customPersonalities, setCustomPersonalities,
      customHubApps, setCustomHubApps,
      linkedSites, setLinkedSites,
    }}>
      {children}
    </BrowserContext.Provider>
  );
}

export function useBrowserContext() {
  const ctx = useContext(BrowserContext);
  if (!ctx) throw new Error('useBrowserContext must be used within BrowserProvider');
  return ctx;
}
