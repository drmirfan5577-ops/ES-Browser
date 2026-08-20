# ✨ EvEr SmArT BrOwSeR — Complete Setup & Documentation

> **SWO.EvESmArTBrOwSeR/drirfan**
> Pakistan's most luminous, glassmorphic & intelligent mobile browser

---

## 📖 Table of Contents

1. [Project Overview](#overview)
2. [Quick Start](#quick-start)
3. [Install on Mobile](#install-mobile)
4. [Build Android APK](#build-apk)
5. [Publish Website](#publish-website)
6. [Admin Panel](#admin-panel)
7. [Feature Reference](#features)
8. [File Structure](#structure)
9. [Backup & Recovery](#backup)
10. [Troubleshooting](#troubleshooting)

---

## 🌟 Project Overview {#overview}

**EvEr SmArT BrOwSeR** is a production-grade React Native (Expo) mobile browser application with:

- **Bilingual UI** — English + Urdu throughout
- **16 Glassy Themes** — 10 luminous + 6 dark background variants
- **Full WebView Browser** with Google Search, ad blocking & incognito
- **PiP Floating Player** — Draggable video player with Reanimated gestures
- **Bookmark Manager** — Full CRUD with folder organization
- **Download Manager** — Track, open, share & delete files
- **5 Content Hubs** — Islamic, News, AI, Social, General (20 apps each)
- **Password-protected Admin Panel** with theme creator, app grid editor & icon library
- **7 Animated Ticker Strips** (2 top + 5 bottom)
- **Historical Personalities Bar** — Jinnah, Iqbal, AQ Khan

---

## ⚡ Quick Start {#quick-start}

### Prerequisites

```bash
Node.js >= 18.0
npm >= 9.0
Expo CLI (installed automatically)
```

### Installation

```bash
# 1. Clone or extract the project
cd ever-smart-browser

# 2. Install dependencies
npm install

# 3. Start development server
npx expo start

# 4. Press:
#    'a' → Open Android emulator
#    'i' → Open iOS simulator
#    'w' → Open in web browser
#    Scan QR with Expo Go app
```

---

## 📱 Install on Mobile {#install-mobile}

### Method 1: Expo Go (Fastest — No Build Required)

1. Install **Expo Go** from:
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - [Apple App Store](https://apps.apple.com/app/expo-go/id982107779)

2. Run `npx expo start` in the project directory

3. **Android**: Scan QR code with camera app or Expo Go
   **iOS**: Scan QR code with default camera app

4. App launches instantly — no APK install needed!

### Method 2: Development Build (Full Features)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo account
eas login

# Create development build
eas build --profile development --platform android

# Install on device
adb install ever-smart-browser.apk
```

### Method 3: OnSpace App Preview

1. Open **OnSpace App** on your phone
2. Navigate to this project
3. Tap "Preview on Device"
4. Full app runs with live updates

---

## 🤖 Build Android APK {#build-apk}

### Option A: EAS Build (Recommended)

```bash
# 1. Install EAS CLI
npm install -g eas-cli

# 2. Login to your Expo account
eas login

# 3. Configure the project (first time only)
eas build:configure

# 4. Build release APK
eas build --platform android --profile production

# 5. Download APK from the URL provided
```

### Option B: Local Build

```bash
# Requires Android SDK + Java JDK 17

# 1. Generate native project
npx expo prebuild --platform android

# 2. Build APK
cd android
./gradlew assembleRelease

# 3. Find APK at:
# android/app/build/outputs/apk/release/app-release.apk
```

### EAS Configuration (eas.json)

```json
{
  "cli": { "version": ">= 7.0.0" },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "android": { "buildType": "apk" }
    },
    "preview": {
      "distribution": "internal",
      "android": { "buildType": "apk" }
    },
    "production": {
      "android": { "buildType": "aab" }
    }
  }
}
```

---

## 🌐 Publish Website {#publish-website}

### The built-in website at `/web` route

The project includes a full-featured website at `app/web/index.tsx` that can be published.

### Method 1: Expo Web Export

```bash
# Build static website
npx expo export --platform web

# Output folder: dist/
# Upload dist/ to any static host:
# - Vercel, Netlify, GitHub Pages, Cloudflare Pages
```

### Method 2: Netlify (Free & Easy)

```bash
# 1. Build
npx expo export --platform web

# 2. Install Netlify CLI
npm install -g netlify-cli

# 3. Deploy
netlify deploy --prod --dir dist
# You get a URL like: https://esb-browser.netlify.app
```

### Method 3: Vercel

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy
vercel --prod

# Custom domain: Add SWO.EvESmArTBrOwSeR in Vercel dashboard
```

### Method 4: OnSpace Publish

In the OnSpace App Builder:
1. Click **Publish** button (top-right toolbar)
2. Follow Apple App Store / Google Play Store workflow
3. Your app gets a public store URL

### Getting a Real URL for the Website

The fastest free option:

```bash
# Option 1: Netlify (instant free URL)
npx expo export --platform web
npx netlify deploy --prod --dir dist

# Option 2: GitHub Pages
npx expo export --platform web
# Push dist/ to GitHub → Enable Pages → Free URL

# Option 3: Vercel
vercel --prod
```

**Recommended Domain Setup:**
1. Get a domain from Namecheap / GoDaddy
2. Point `SWO.EvESmArTBrOwSeR` CNAME to your Netlify/Vercel URL
3. Configure SSL (automatic on both platforms)

---

## 🔐 Admin Panel {#admin-panel}

### Default Credentials

```
Password: admin1234
```

### Admin Sections

| Section | Description |
|---------|-------------|
| **Overview** | VPN/AdBlock toggles, quick stats, active theme |
| **Theme Selector** | Browse & apply any of 16 themes |
| **Theme Creator** | Custom color picker, gradient builder, live preview |
| **App Grid Editor** | Customize rows 3 & 4 of home screen |
| **Icon Library** | 50+ searchable icons for app slots |
| **Tickers** | Edit all 7 ticker strip messages |
| **Branding** | Arabic, Urdu, English header lines |
| **Stats** | Browser usage statistics |
| **Security** | Change admin password |

### Changing Default Password

1. Open Admin tab → Login with `admin1234`
2. Go to **Security** section
3. Enter new password (min 4 characters)
4. Tap "Update Password"

---

## 📋 Feature Reference {#features}

### Browser Features

| Feature | Description |
|---------|-------------|
| Google Search | Full Google integration via WebView |
| URL Navigation | Direct URL entry with protocol detection |
| Back/Forward | Full navigation history |
| Reload | Refresh current page |
| Ad Blocker | JS injection + element removal |
| Incognito | Private session (purple tint) |
| Bookmark | Save current page with title & folder |
| Share | Share URL via system share sheet |
| PiP | Drag-out floating video player |

### Keyboard Shortcuts (Web)

| Key | Action |
|-----|--------|
| Enter | Navigate to URL / Search |
| Ctrl+B | Open bookmarks |
| Ctrl+D | Open downloads |
| Escape | Close modals |

### Theme IDs

```
crimson_gold | emerald_green | royal_blue | ruby_red
violet_pink  | sapphire | rose_gold | sunset_orange
mint_fresh   | ocean_deep
dark_abyss   | dark_crimson | dark_ocean | dark_forest
dark_gold    | dark_nebula
```

---

## 🗂️ File Structure {#structure}

```
ever-smart-browser/
├── app/
│   ├── _layout.tsx              # Root layout with providers
│   ├── web/
│   │   └── index.tsx            # Website landing page
│   └── (tabs)/
│       ├── _layout.tsx          # Tab bar configuration
│       ├── index.tsx            # Home browser screen
│       ├── hubs.tsx             # Hubs overview
│       └── admin.tsx            # Admin panel
│
├── components/
│   ├── ui/
│   │   ├── GlassCard.tsx        # Reusable glass card
│   │   ├── GlassButton.tsx      # Reusable glass button
│   │   └── GlassModal.tsx       # Reusable modal sheet
│   ├── layout/
│   │   ├── Header.tsx           # Main app header
│   │   ├── TickerStrip.tsx      # Animated ticker
│   │   └── Sidebar.tsx          # Slide-in sidebar
│   └── feature/
│       ├── SearchBar.tsx        # Google search input
│       ├── AppsGrid.tsx         # 4-row app grid
│       ├── HubModal.tsx         # Hub apps modal
│       ├── BrowserView.tsx      # Full WebView browser
│       ├── PiPPlayer.tsx        # Picture-in-picture player
│       ├── BookmarkManager.tsx  # Bookmark CRUD
│       ├── DownloadManager.tsx  # Download tracker
│       ├── ThemePicker.tsx      # Theme selector
│       ├── DigitalClock.tsx     # Glowing clock
│       ├── RotatingLogo.tsx     # ESB sphere logo
│       └── PersonalityBar.tsx   # Historical figures
│
├── constants/
│   ├── theme.ts                 # 16 theme definitions
│   ├── config.ts                # App grid, hub, ticker data
│   └── styles.ts                # Shared glassmorphism styles
│
├── contexts/
│   └── BrowserContext.tsx       # Global state + AsyncStorage
│
├── hooks/
│   └── useDigitalClock.ts       # Clock hook
│
├── services/
│   └── storageService.ts        # Storage utilities
│
├── assets/
│   └── images/
│       ├── esb-logo.png         # ESB sphere logo
│       ├── personality-jinnah.png
│       ├── personality-iqbal.png
│       └── personality-aqkhan.png
│
├── README.md                    # This file
├── eas.json                     # EAS build config
└── app.json                     # Expo config
```

---

## 💾 Backup & Recovery {#backup}

### Creating a Backup

```bash
# Create full project backup ZIP
zip -r ever-smart-browser-backup-$(date +%Y%m%d).zip . \
  --exclude "node_modules/*" \
  --exclude ".expo/*" \
  --exclude "dist/*" \
  --exclude ".git/*"
```

### What's Backed Up

- All source code (`app/`, `components/`, `contexts/`, `constants/`, `hooks/`, `services/`)
- All assets (`assets/images/`)
- Configuration (`app.json`, `eas.json`, `tsconfig.json`, `babel.config.js`)
- Documentation (`README.md`)

### Restoring from Backup

```bash
# 1. Extract backup
unzip ever-smart-browser-backup-YYYYMMDD.zip -d ever-smart-browser-restored

# 2. Navigate into project
cd ever-smart-browser-restored

# 3. Install dependencies
npm install

# 4. Start the app
npx expo start
```

### User Data Recovery

User data (bookmarks, downloads, theme preference) is stored in AsyncStorage on the device. To export:

```javascript
// In Admin Panel → Export Data (future feature)
// Or manually access AsyncStorage keys:
// esb_theme, esb_bookmarks, esb_downloads, esb_tickers, esb_branding
```

---

## 🔧 Troubleshooting {#troubleshooting}

### App won't start

```bash
# Clear Expo cache
npx expo start --clear

# Reset node_modules
rm -rf node_modules
npm install
```

### WebView not loading

- Check internet connection
- Ensure `react-native-webview` is installed: `npx expo install react-native-webview`
- For development builds: `npx expo prebuild` is required for WebView

### Build failures

```bash
# Check Expo SDK version compatibility
npx expo-doctor

# Update all packages
npx expo install --fix
```

### AsyncStorage issues

```bash
# Install if missing
npx expo install @react-native-async-storage/async-storage
```

### Fonts/Icons not loading

```bash
# Install vector icons
npx expo install @expo/vector-icons

# Install linear gradient
npx expo install expo-linear-gradient
```

### Web build issues

```bash
# Ensure web bundler is set
# In app.json: "web": { "bundler": "metro" }

# Build for web
npx expo export --platform web
```

---

## 📞 Support & Contact

- **Website**: SWO.EvESmArTBrOwSeR/drirfan
- **Project**: EvEr SmArT BrOwSeR v2.0
- **Platform**: OnSpace App Builder
- **Stack**: React Native + Expo + TypeScript

---

## 📄 License

© 2025 EvEr SmArT BrOwSeR — All Rights Reserved
Built with ❤️ for Pakistan | پاکستان کے لیے محبت سے بنایا گیا

---

*"In the Name of ALLAH Almighty, The most Gracious, The most Merciful"*
*بسم اللّٰہ الرحمٰن الرحیم*
