# 📦 EvEr SmArT BrOwSeR — Complete Setup Guide
## پوری سیٹ اپ گائیڈ

---

## 🚀 STEP 1: Get the App on Your Phone RIGHT NOW (2 minutes)

### Option A — OnSpace App (Easiest)
1. Download **OnSpace** app from Play Store
2. Open this project → Tap **Preview** button
3. App is live on your phone instantly!

### Option B — Expo Go (No Build Required)
1. Install **Expo Go** from Play Store: https://play.google.com/store/apps/details?id=host.exp.exponent
2. Open terminal in project folder
3. Run: `npx expo start`
4. Scan the QR code with your phone camera
5. EvEr SmArT BrOwSeR opens immediately!

---

## 📲 STEP 2: Download as APK (Permanent Install)

### Using OnSpace Platform (Recommended)
1. Open this project in OnSpace App Builder
2. Click **Download** button (top-right toolbar)
3. Select **"Download Android APK"**
4. Wait for build (~5-10 minutes)
5. Install the downloaded APK on your Android device
6. **Enable "Install from Unknown Sources"** in Android Settings if prompted

### Using EAS Build (Developer Method)
```bash
npm install -g eas-cli
eas login
eas build --platform android --profile preview
# Download APK from the URL shown
```

---

## 🌐 STEP 3: Get a Real Website URL

### Method 1: OnSpace Publish (Easiest — Built-in)
1. In OnSpace App Builder → Click **Publish** (top right)
2. Select **"Publish as Web App"**
3. Your app gets a public URL instantly
4. Share this URL — it's your live website!

### Method 2: Netlify (Free — 5 minutes)
```bash
# 1. Build the web version
npx expo export --platform web

# 2. Deploy to Netlify
npx netlify-cli deploy --prod --dir dist

# Result: https://your-app-name.netlify.app
# Then add custom domain: SWO.EvESmArTBrOwSeR
```

### Method 3: Vercel (Free — 3 minutes)
```bash
npx vercel --prod
# Result: https://your-app.vercel.app
```

### Method 4: GitHub Pages (Free)
```bash
npx expo export --platform web
# Push 'dist' folder to GitHub repo
# Enable GitHub Pages → Done!
```

---

## 💾 STEP 4: Create ZIP Backup

### Quick Backup Command
```bash
# Windows (PowerShell)
Compress-Archive -Path . -DestinationPath "ESB_Backup_$(Get-Date -Format 'yyyyMMdd').zip" -Force

# macOS/Linux
zip -r "ESB_Backup_$(date +%Y%m%d).zip" . --exclude "node_modules/*" --exclude ".expo/*" --exclude "dist/*"
```

### What's in Your Backup
```
ESB_Backup_YYYYMMDD.zip
├── app/                    ← All screens & navigation
├── components/             ← All UI components
├── contexts/               ← Global state
├── constants/              ← Themes, config, styles
├── hooks/                  ← Custom React hooks
├── services/               ← Storage services
├── assets/images/          ← Logo + personality portraits
├── app.json                ← Expo configuration
├── eas.json                ← Build configuration
├── README.md               ← Full documentation
└── SETUP_GUIDE.md          ← This file
```

### Restore from Backup
```bash
unzip ESB_Backup_YYYYMMDD.zip -d ever-smart-browser
cd ever-smart-browser
npm install
npx expo start
```

---

## 🔐 Admin Panel Access

| Credential | Value |
|-----------|-------|
| **URL/Tab** | Admin tab (bottom navigation) |
| **Password** | `admin1234` |
| **Change Password** | Admin → Security section |

---

## 🛠️ Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `expo` | ~52.0 | Core framework |
| `expo-router` | ~4.0 | File-based navigation |
| `react-native-webview` | * | Browser engine |
| `expo-linear-gradient` | * | Glassmorphism effects |
| `react-native-reanimated` | ~3.17.5 | PiP animations |
| `@react-native-async-storage/async-storage` | * | Data persistence |
| `@expo/vector-icons` | * | UI icons |
| `expo-image` | * | Optimized images |
| `react-native-safe-area-context` | * | Safe area handling |

---

## 📋 Feature Checklist

- [x] Glassmorphism UI (4D illusion, luminous, NO dark mode in app)
- [x] 10 luminous + 6 dark gradient themes
- [x] Arabic/Urdu/English multilingual header
- [x] 7 animated ticker strips
- [x] Google Search + WebView browser
- [x] DNS-level + JS-injection ad blocker
- [x] VPN toggle with status indicator
- [x] PiP draggable floating video player
- [x] Bookmark manager with folders
- [x] Download manager with file actions
- [x] Incognito private browsing mode
- [x] 5 hubs (Islamic, News, AI, Social, General)
- [x] Password-protected admin panel
- [x] App grid slot editor
- [x] Icon library browser (50+ icons)
- [x] Custom theme creator with color picker
- [x] Rotating 3D ESB logo
- [x] Glowing digital clock
- [x] Historical personalities bar
- [x] Website landing page (app/web/index.tsx)
- [x] Android APK via EAS Build
- [x] README.md documentation
- [x] eas.json build configuration

---

## 🌐 Website Integration

The website at `app/web/index.tsx` is a full-featured landing page that:
- Shows all app features with glassmorphism design
- Links to download options (Expo Go, APK, source)
- Displays historical personalities with portraits
- Shows 8 theme previews
- Lists all 5 hubs
- Includes tech stack information
- Has animated ticker strips
- Fully responsive for mobile, tablet & desktop
- Branded with: **SWO.EvESmArTBrOwSeR/drirfan**

### To Access Website Route
The website is accessible at the `/web` route in Expo Router.
When published/exported for web, it serves as the public-facing landing page.

---

## 📞 Contact & Support

**Website**: SWO.EvESmArTBrOwSeR/drirfan  
**Version**: 2.0.0  
**Platform**: React Native + Expo + TypeScript  
**Built for**: Pakistan 🇵🇰

---

*بسم اللّٰہ الرحمٰن الرحیم*  
*In the Name of ALLAH Almighty, The most Gracious, The most Merciful*

© 2025 EvEr SmArT BrOwSeR — All Rights Reserved
