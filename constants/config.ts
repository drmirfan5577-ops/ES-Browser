export interface HubApp {
  id: string; name: string; ur: string; icon: string; iconLib: 'mat' | 'ion' | 'fa5';
  url: string; bg: string;
}
export interface GridApp {
  id: string; name: string; ur: string; icon: string; iconLib: 'mat' | 'ion' | 'fa5';
  type: 'hub' | 'url' | 'custom'; hubId?: string; url?: string; bg: string; emoji: string;
}
export interface Personality { id: string; name: string; ur: string; title: string; titleUr: string; image: any; }

export const GRID_ROW1: GridApp[] = [
  { id: 'hub_islamic', name: 'Islamic Hub', ur: 'اسلامی مرکز', icon: 'mosque', iconLib: 'mat', type: 'hub', hubId: 'islamic', bg: 'rgba(0,160,80,0.32)', emoji: '🕌' },
  { id: 'hub_news', name: 'News Hub', ur: 'خبروں کا مرکز', icon: 'article', iconLib: 'mat', type: 'hub', hubId: 'news', bg: 'rgba(30,80,200,0.32)', emoji: '📰' },
  { id: 'hub_ai', name: 'A.I Hub', ur: 'مصنوعی ذہانت', icon: 'psychology', iconLib: 'mat', type: 'hub', hubId: 'ai', bg: 'rgba(130,0,200,0.32)', emoji: '🤖' },
  { id: 'hub_social', name: 'Social Hub', ur: 'سوشل میڈیا', icon: 'people', iconLib: 'mat', type: 'hub', hubId: 'social', bg: 'rgba(200,80,0,0.32)', emoji: '🌐' },
  { id: 'hub_general', name: 'General Hub', ur: 'عمومی مرکز', icon: 'apps', iconLib: 'mat', type: 'hub', hubId: 'general', bg: 'rgba(80,80,80,0.32)', emoji: '⚙️' },
];
export const GRID_ROW2: GridApp[] = [
  { id: 'smart_news', name: 'SMART News', ur: 'سمارٹ نیوز', icon: 'rss-feed', iconLib: 'mat', type: 'url', url: 'https://news.google.com', bg: 'rgba(200,30,30,0.32)', emoji: '📡' },
  { id: 'youtube', name: 'YouTube', ur: 'یوٹیوب', icon: 'youtube', iconLib: 'fa5', type: 'url', url: 'https://m.youtube.com', bg: 'rgba(255,0,0,0.32)', emoji: '▶️' },
  { id: 'whatsapp', name: 'WhatsApp', ur: 'واٹس ایپ', icon: 'whatsapp', iconLib: 'fa5', type: 'url', url: 'https://web.whatsapp.com', bg: 'rgba(37,211,102,0.32)', emoji: '💬' },
  { id: 'facebook', name: 'Facebook', ur: 'فیس بک', icon: 'facebook', iconLib: 'fa5', type: 'url', url: 'https://m.facebook.com', bg: 'rgba(66,103,178,0.32)', emoji: '📘' },
  { id: 'playstore', name: 'Play Store', ur: 'پلے اسٹور', icon: 'google-play', iconLib: 'fa5', type: 'url', url: 'https://play.google.com/store', bg: 'rgba(0,180,0,0.32)', emoji: '🛒' },
];
export const GRID_ROW3: GridApp[] = [
  { id: 'google', name: 'Google', ur: 'گوگل', icon: 'search', iconLib: 'mat', type: 'url', url: 'https://www.google.com', bg: 'rgba(66,133,244,0.32)', emoji: '🔍' },
  { id: 'gmail', name: 'Gmail', ur: 'جی میل', icon: 'email', iconLib: 'mat', type: 'url', url: 'https://mail.google.com', bg: 'rgba(234,67,53,0.32)', emoji: '📧' },
  { id: 'drive', name: 'Drive', ur: 'گوگل ڈرائیو', icon: 'cloud', iconLib: 'mat', type: 'url', url: 'https://drive.google.com', bg: 'rgba(0,135,68,0.32)', emoji: '☁️' },
  { id: 'maps', name: 'Maps', ur: 'نقشہ', icon: 'map', iconLib: 'mat', type: 'url', url: 'https://maps.google.com', bg: 'rgba(0,150,136,0.32)', emoji: '🗺️' },
  { id: 'translate', name: 'Translate', ur: 'ترجمہ', icon: 'translate', iconLib: 'mat', type: 'url', url: 'https://translate.google.com', bg: 'rgba(25,118,210,0.32)', emoji: '🌐' },
];
export const GRID_ROW4: GridApp[] = [];

export const HUB_APPS: Record<string, HubApp[]> = {
  islamic: [
    { id: 'qi1', name: 'Digital Quran', ur: 'ڈیجیٹل قرآن پاک', icon: 'book', iconLib: 'ion', url: 'https://quran.com', bg: 'rgba(0,150,80,0.32)' },
    { id: 'qi2', name: 'Ahadees Encyclopedia', ur: 'احادیث انسائیکلوپیڈیا', icon: 'library', iconLib: 'ion', url: 'https://sunnah.com', bg: 'rgba(0,100,150,0.32)' },
    { id: 'qi3', name: 'Islamic Literature', ur: 'اسلامی ادب', icon: 'book-outline', iconLib: 'ion', url: 'https://islamicstudies.info', bg: 'rgba(100,50,0,0.32)' },
    { id: 'qi4', name: 'Daily Azkaar', ur: 'روزانہ اذکار', icon: 'heart', iconLib: 'ion', url: 'https://duas.org', bg: 'rgba(200,50,50,0.32)' },
    { id: 'qi5', name: 'Prayer Times', ur: 'نماز اوقات', icon: 'time', iconLib: 'ion', url: 'https://www.islamicfinder.org/prayer-times/', bg: 'rgba(50,50,200,0.32)' },
    { id: 'qi6', name: 'Qibla Finder', ur: 'قبلہ نما', icon: 'compass', iconLib: 'ion', url: 'https://qiblafinder.withgoogle.com', bg: 'rgba(0,150,150,0.32)' },
    { id: 'qi7', name: 'Islamic Calendar', ur: 'اسلامی تقویم', icon: 'calendar', iconLib: 'ion', url: 'https://www.islamicfinder.org/islamic-calendar/', bg: 'rgba(150,0,150,0.32)' },
    { id: 'qi8', name: 'Tafseer Library', ur: 'تفسیر لائبریری', icon: 'layers', iconLib: 'ion', url: 'https://quranx.com/tafsir', bg: 'rgba(0,100,50,0.32)' },
    { id: 'qi9', name: 'Surah Recitation', ur: 'سورہ تلاوت', icon: 'musical-notes', iconLib: 'ion', url: 'https://quran.com', bg: 'rgba(100,150,0,0.32)' },
    { id: 'qi10', name: 'Dua Collection', ur: 'دعاؤں کا مجموعہ', icon: 'hand-left', iconLib: 'ion', url: 'https://duas.org', bg: 'rgba(200,100,0,0.32)' },
    { id: 'qi11', name: 'Zakat Calculator', ur: 'زکوٰۃ کیلکولیٹر', icon: 'calculator', iconLib: 'ion', url: 'https://www.islamicfinder.org/zakat-calculator/', bg: 'rgba(0,150,200,0.32)' },
    { id: 'qi12', name: 'Halal Finder', ur: 'حلال تلاش', icon: 'search', iconLib: 'ion', url: 'https://zabihah.com', bg: 'rgba(50,150,50,0.32)' },
    { id: 'qi13', name: 'Islamic Stories', ur: 'اسلامی کہانیاں', icon: 'chatbubbles', iconLib: 'ion', url: 'https://islamicstories.net', bg: 'rgba(150,100,50,0.32)' },
    { id: 'qi14', name: 'Seedlings Kids', ur: 'بچوں کے لیے', icon: 'flower-outline', iconLib: 'ion', url: 'https://muslimkids.tv', bg: 'rgba(100,200,50,0.32)' },
    { id: 'qi15', name: 'Islamic Wallpapers', ur: 'اسلامی وال پیپرز', icon: 'image', iconLib: 'ion', url: 'https://islamicwallpapers.com', bg: 'rgba(150,0,200,0.32)' },
    { id: 'qi16', name: 'Islamic Radio', ur: 'اسلامی ریڈیو', icon: 'radio', iconLib: 'ion', url: 'https://radioislam.org', bg: 'rgba(200,150,0,0.32)' },
    { id: 'qi17', name: 'Hajj & Umrah', ur: 'حج و عمرہ رہنما', icon: 'navigate', iconLib: 'ion', url: 'https://www.hajj.com', bg: 'rgba(0,100,100,0.32)' },
    { id: 'qi18', name: 'Islamic Courses', ur: 'اسلامی کورسز', icon: 'school', iconLib: 'ion', url: 'https://www.al-ilm.com', bg: 'rgba(100,50,150,0.32)' },
    { id: 'qi19', name: 'Muslim Pro', ur: 'مسلم پرو', icon: 'star', iconLib: 'ion', url: 'https://www.muslimpro.com', bg: 'rgba(200,100,50,0.32)' },
    { id: 'qi20', name: 'Al-Quran 3D', ur: 'القرآن تھری ڈی', icon: 'cube', iconLib: 'ion', url: 'https://quran.com', bg: 'rgba(0,50,200,0.32)' },
  ],
  news: [
    { id: 'n1', name: 'Geo News', ur: 'جیو نیوز', icon: 'tv', iconLib: 'ion', url: 'https://www.geo.tv', bg: 'rgba(200,30,30,0.32)' },
    { id: 'n2', name: 'ARY News', ur: 'اے آر وائی نیوز', icon: 'radio', iconLib: 'ion', url: 'https://arynews.tv', bg: 'rgba(30,100,200,0.32)' },
    { id: 'n3', name: 'Dawn News', ur: 'ڈان نیوز', icon: 'newspaper', iconLib: 'ion', url: 'https://www.dawn.com', bg: 'rgba(0,80,150,0.32)' },
    { id: 'n4', name: 'BBC Urdu', ur: 'بی بی سی اردو', icon: 'globe', iconLib: 'ion', url: 'https://www.bbc.com/urdu', bg: 'rgba(180,0,0,0.32)' },
    { id: 'n5', name: 'VOA Urdu', ur: 'وائس آف امریکہ', icon: 'megaphone', iconLib: 'ion', url: 'https://www.urduvoa.com', bg: 'rgba(0,60,150,0.32)' },
    { id: 'n6', name: 'Daily Pakistan', ur: 'روزنامہ پاکستان', icon: 'document-text', iconLib: 'ion', url: 'https://en.dailypakistan.com.pk', bg: 'rgba(0,130,50,0.32)' },
    { id: 'n7', name: 'Jang News', ur: 'روزنامہ جنگ', icon: 'newspaper', iconLib: 'ion', url: 'https://jang.com.pk', bg: 'rgba(200,150,0,0.32)' },
    { id: 'n8', name: 'Express Tribune', ur: 'ایکسپریس ٹریبیون', icon: 'browsers', iconLib: 'ion', url: 'https://tribune.com.pk', bg: 'rgba(150,0,200,0.32)' },
    { id: 'n9', name: 'The News', ur: 'دی نیوز', icon: 'reader', iconLib: 'ion', url: 'https://www.thenews.com.pk', bg: 'rgba(50,100,150,0.32)' },
    { id: 'n10', name: 'Samaa TV', ur: 'سما ٹی وی', icon: 'videocam', iconLib: 'ion', url: 'https://www.samaaenglish.tv', bg: 'rgba(200,100,0,0.32)' },
    { id: 'n11', name: 'Hum News', ur: 'ہم نیوز', icon: 'tv', iconLib: 'ion', url: 'https://humnews.pk', bg: 'rgba(100,0,200,0.32)' },
    { id: 'n12', name: 'Capital TV', ur: 'کیپیٹل ٹی وی', icon: 'recording', iconLib: 'ion', url: 'https://www.capitaltvnews.pk', bg: 'rgba(0,100,200,0.32)' },
    { id: 'n13', name: '92 News', ur: '۹۲ نیوز', icon: 'radio', iconLib: 'ion', url: 'https://92newshd.tv', bg: 'rgba(150,50,0,0.32)' },
    { id: 'n14', name: 'Aaj News', ur: 'آج نیوز', icon: 'today', iconLib: 'ion', url: 'https://www.aaj.tv', bg: 'rgba(30,150,30,0.32)' },
    { id: 'n15', name: 'PTV News', ur: 'پی ٹی وی نیوز', icon: 'logo-youtube', iconLib: 'ion', url: 'https://www.ptv.com.pk', bg: 'rgba(0,100,0,0.32)' },
    { id: 'n16', name: 'Reuters', ur: 'رائٹرز', icon: 'globe', iconLib: 'ion', url: 'https://www.reuters.com', bg: 'rgba(200,150,50,0.32)' },
    { id: 'n17', name: 'Al Jazeera', ur: 'الجزیرہ', icon: 'earth', iconLib: 'ion', url: 'https://www.aljazeera.com', bg: 'rgba(0,100,180,0.32)' },
    { id: 'n18', name: 'Sky News', ur: 'اسکائی نیوز', icon: 'cloudy', iconLib: 'ion', url: 'https://news.sky.com', bg: 'rgba(0,150,220,0.32)' },
    { id: 'n19', name: 'CNN', ur: 'سی این این', icon: 'tv-outline', iconLib: 'ion', url: 'https://edition.cnn.com', bg: 'rgba(200,0,0,0.32)' },
    { id: 'n20', name: 'Google News', ur: 'گوگل نیوز', icon: 'logo-google', iconLib: 'ion', url: 'https://news.google.com', bg: 'rgba(50,150,250,0.32)' },
  ],
  ai: [
    { id: 'ai1', name: 'ChatGPT', ur: 'چیٹ جی پی ٹی', icon: 'chatbubble-ellipses', iconLib: 'ion', url: 'https://chat.openai.com', bg: 'rgba(16,163,127,0.32)' },
    { id: 'ai2', name: 'Google Gemini', ur: 'گوگل جیمنی', icon: 'sparkles', iconLib: 'ion', url: 'https://gemini.google.com', bg: 'rgba(66,133,244,0.32)' },
    { id: 'ai3', name: 'Claude AI', ur: 'کلاڈ اے آئی', icon: 'hardware-chip', iconLib: 'ion', url: 'https://claude.ai', bg: 'rgba(210,161,101,0.32)' },
    { id: 'ai4', name: 'MS Copilot', ur: 'مائیکروسافٹ کوپائلٹ', icon: 'logo-microsoft', iconLib: 'ion', url: 'https://copilot.microsoft.com', bg: 'rgba(0,120,215,0.32)' },
    { id: 'ai5', name: 'Midjourney', ur: 'مڈجرنی', icon: 'color-palette', iconLib: 'ion', url: 'https://www.midjourney.com', bg: 'rgba(100,50,200,0.32)' },
    { id: 'ai6', name: 'DALL-E', ur: 'ڈال ای', icon: 'image', iconLib: 'ion', url: 'https://openai.com/dall-e-3', bg: 'rgba(0,100,200,0.32)' },
    { id: 'ai7', name: 'Perplexity AI', ur: 'پرپلیکسٹی اے آئی', icon: 'search', iconLib: 'ion', url: 'https://www.perplexity.ai', bg: 'rgba(20,100,150,0.32)' },
    { id: 'ai8', name: 'Character.AI', ur: 'کریکٹر اے آئی', icon: 'people', iconLib: 'ion', url: 'https://character.ai', bg: 'rgba(150,0,200,0.32)' },
    { id: 'ai9', name: 'DeepSeek', ur: 'ڈیپ سیک', icon: 'fish', iconLib: 'ion', url: 'https://chat.deepseek.com', bg: 'rgba(0,150,200,0.32)' },
    { id: 'ai10', name: 'Grok AI', ur: 'گروک اے آئی', icon: 'logo-twitter', iconLib: 'ion', url: 'https://grok.x.ai', bg: 'rgba(30,30,30,0.32)' },
    { id: 'ai11', name: 'Meta AI', ur: 'میٹا اے آئی', icon: 'logo-facebook', iconLib: 'ion', url: 'https://www.meta.ai', bg: 'rgba(0,100,240,0.32)' },
    { id: 'ai12', name: 'Stable Diffusion', ur: 'اسٹیبل ڈفیوژن', icon: 'aperture', iconLib: 'ion', url: 'https://stablediffusionweb.com', bg: 'rgba(200,100,50,0.32)' },
    { id: 'ai13', name: 'AI Music Gen', ur: 'اے آئی میوزک', icon: 'musical-notes', iconLib: 'ion', url: 'https://suno.com', bg: 'rgba(150,0,100,0.32)' },
    { id: 'ai14', name: 'AI Translator', ur: 'اے آئی ترجمہ', icon: 'language', iconLib: 'mat', url: 'https://translate.google.com', bg: 'rgba(50,150,0,0.32)' },
    { id: 'ai15', name: 'AI Summarizer', ur: 'اے آئی خلاصہ', icon: 'compress', iconLib: 'mat', url: 'https://www.summarize.tech', bg: 'rgba(100,100,0,0.32)' },
    { id: 'ai16', name: 'AI Writing', ur: 'اے آئی رائٹنگ', icon: 'create', iconLib: 'ion', url: 'https://www.jasper.ai', bg: 'rgba(0,150,100,0.32)' },
    { id: 'ai17', name: 'AI Code Helper', ur: 'اے آئی کوڈ', icon: 'code-slash', iconLib: 'ion', url: 'https://github.com/features/copilot', bg: 'rgba(50,50,50,0.32)' },
    { id: 'ai18', name: 'AI Image Enhance', ur: 'اے آئی تصویر', icon: 'contrast', iconLib: 'ion', url: 'https://www.topazlabs.com', bg: 'rgba(100,50,150,0.32)' },
    { id: 'ai19', name: 'AI Voice Clone', ur: 'اے آئی آواز', icon: 'mic', iconLib: 'ion', url: 'https://elevenlabs.io', bg: 'rgba(200,50,100,0.32)' },
    { id: 'ai20', name: 'AI Video Gen', ur: 'اے آئی ویڈیو', icon: 'videocam', iconLib: 'ion', url: 'https://runwayml.com', bg: 'rgba(0,50,200,0.32)' },
  ],
  social: [
    { id: 's1', name: 'Facebook', ur: 'فیس بک', icon: 'logo-facebook', iconLib: 'ion', url: 'https://m.facebook.com', bg: 'rgba(66,103,178,0.32)' },
    { id: 's2', name: 'Instagram', ur: 'انسٹاگرام', icon: 'logo-instagram', iconLib: 'ion', url: 'https://www.instagram.com', bg: 'rgba(200,50,120,0.32)' },
    { id: 's3', name: 'Twitter / X', ur: 'ٹوئٹر', icon: 'logo-twitter', iconLib: 'ion', url: 'https://x.com', bg: 'rgba(20,20,20,0.32)' },
    { id: 's4', name: 'TikTok', ur: 'ٹک ٹاک', icon: 'logo-tiktok', iconLib: 'ion', url: 'https://www.tiktok.com', bg: 'rgba(0,0,0,0.32)' },
    { id: 's5', name: 'YouTube', ur: 'یوٹیوب', icon: 'logo-youtube', iconLib: 'ion', url: 'https://m.youtube.com', bg: 'rgba(255,0,0,0.32)' },
    { id: 's6', name: 'WhatsApp', ur: 'واٹس ایپ', icon: 'logo-whatsapp', iconLib: 'ion', url: 'https://web.whatsapp.com', bg: 'rgba(37,211,102,0.32)' },
    { id: 's7', name: 'Telegram', ur: 'ٹیلیگرام', icon: 'paper-plane', iconLib: 'ion', url: 'https://web.telegram.org', bg: 'rgba(0,120,255,0.32)' },
    { id: 's8', name: 'Snapchat', ur: 'اسنیپ چیٹ', icon: 'logo-snapchat', iconLib: 'ion', url: 'https://www.snapchat.com', bg: 'rgba(255,220,0,0.32)' },
    { id: 's9', name: 'LinkedIn', ur: 'لنکڈاِن', icon: 'logo-linkedin', iconLib: 'ion', url: 'https://www.linkedin.com', bg: 'rgba(0,120,200,0.32)' },
    { id: 's10', name: 'Pinterest', ur: 'پنٹرسٹ', icon: 'logo-pinterest', iconLib: 'ion', url: 'https://www.pinterest.com', bg: 'rgba(230,0,35,0.32)' },
    { id: 's11', name: 'Reddit', ur: 'ریڈٹ', icon: 'logo-reddit', iconLib: 'ion', url: 'https://www.reddit.com', bg: 'rgba(255,70,0,0.32)' },
    { id: 's12', name: 'Discord', ur: 'ڈسکورڈ', icon: 'logo-discord', iconLib: 'ion', url: 'https://discord.com/app', bg: 'rgba(88,101,242,0.32)' },
    { id: 's13', name: 'Tumblr', ur: 'ٹمبلر', icon: 'logo-tumblr', iconLib: 'ion', url: 'https://www.tumblr.com', bg: 'rgba(50,80,120,0.32)' },
    { id: 's14', name: 'Quora', ur: 'کورا', icon: 'chatbubble', iconLib: 'ion', url: 'https://www.quora.com', bg: 'rgba(180,0,0,0.32)' },
    { id: 's15', name: 'Medium', ur: 'میڈیم', icon: 'logo-medium', iconLib: 'ion', url: 'https://medium.com', bg: 'rgba(0,0,0,0.32)' },
    { id: 's16', name: 'Threads', ur: 'تھریڈز', icon: 'at', iconLib: 'ion', url: 'https://www.threads.net', bg: 'rgba(30,30,30,0.32)' },
    { id: 's17', name: 'BeReal', ur: 'بی ریئل', icon: 'camera', iconLib: 'ion', url: 'https://bere.al', bg: 'rgba(0,0,0,0.32)' },
    { id: 's18', name: 'Clubhouse', ur: 'کلب ہاؤس', icon: 'mic', iconLib: 'ion', url: 'https://www.clubhouse.com', bg: 'rgba(240,200,100,0.32)' },
    { id: 's19', name: 'Mastodon', ur: 'ماسٹوڈن', icon: 'logo-mastodon', iconLib: 'ion', url: 'https://mastodon.social', bg: 'rgba(100,50,200,0.32)' },
    { id: 's20', name: 'VKontakte', ur: 'وی کے', icon: 'people', iconLib: 'ion', url: 'https://vk.com', bg: 'rgba(0,120,200,0.32)' },
  ],
  general: [
    { id: 'g1', name: 'VPN Shield', ur: 'وی پی این', icon: 'shield-checkmark', iconLib: 'ion', url: 'https://protonvpn.com', bg: 'rgba(0,150,100,0.32)' },
    { id: 'g2', name: 'Ads Blocker Pro', ur: 'ایڈز بلاکر', icon: 'ban', iconLib: 'ion', url: 'https://adblockplus.org', bg: 'rgba(200,50,50,0.32)' },
    { id: 'g3', name: 'Gallery', ur: 'گیلری', icon: 'images', iconLib: 'ion', url: 'https://photos.google.com', bg: 'rgba(100,100,200,0.32)' },
    { id: 'g4', name: 'Clock & Timer', ur: 'گھڑی اور ٹائمر', icon: 'time', iconLib: 'ion', url: 'https://www.timeanddate.com', bg: 'rgba(0,100,200,0.32)' },
    { id: 'g5', name: 'Calculator', ur: 'کیلکولیٹر', icon: 'calculator', iconLib: 'ion', url: 'https://www.desmos.com/scientific', bg: 'rgba(50,150,50,0.32)' },
    { id: 'g6', name: 'Smart Office', ur: 'آفس سوٹ', icon: 'document', iconLib: 'ion', url: 'https://docs.google.com', bg: 'rgba(0,100,150,0.32)' },
    { id: 'g7', name: 'File Manager', ur: 'فائل مینیجر', icon: 'folder', iconLib: 'ion', url: 'https://drive.google.com', bg: 'rgba(200,150,0,0.32)' },
    { id: 'g8', name: 'PDF Reader', ur: 'پی ڈی ایف', icon: 'document-text', iconLib: 'ion', url: 'https://www.ilovepdf.com', bg: 'rgba(200,50,0,0.32)' },
    { id: 'g9', name: 'Password Mgr', ur: 'پاسورڈ مینیجر', icon: 'lock-closed', iconLib: 'ion', url: 'https://bitwarden.com', bg: 'rgba(50,0,200,0.32)' },
    { id: 'g10', name: 'QR Scanner', ur: 'کیو آر اسکینر', icon: 'qr-code', iconLib: 'ion', url: 'https://www.qrcode-monkey.com', bg: 'rgba(0,0,0,0.32)' },
    { id: 'g11', name: 'Translator', ur: 'ترجمہ', icon: 'language', iconLib: 'mat', url: 'https://translate.google.com', bg: 'rgba(50,150,250,0.32)' },
    { id: 'g12', name: 'Weather Pro', ur: 'موسم', icon: 'partly-sunny', iconLib: 'ion', url: 'https://weather.com', bg: 'rgba(0,150,200,0.32)' },
    { id: 'g13', name: 'Maps Navigator', ur: 'نقشہ', icon: 'map', iconLib: 'ion', url: 'https://maps.google.com', bg: 'rgba(0,200,100,0.32)' },
    { id: 'g14', name: 'Task Manager', ur: 'ٹاسک مینیجر', icon: 'checkmark-done', iconLib: 'ion', url: 'https://tasks.google.com', bg: 'rgba(200,100,0,0.32)' },
    { id: 'g15', name: 'Notes Pro', ur: 'نوٹس', icon: 'create', iconLib: 'ion', url: 'https://keep.google.com', bg: 'rgba(255,200,0,0.32)' },
    { id: 'g16', name: 'Calendar', ur: 'کیلنڈر', icon: 'calendar', iconLib: 'ion', url: 'https://calendar.google.com', bg: 'rgba(0,100,200,0.32)' },
    { id: 'g17', name: 'Contacts Backup', ur: 'رابطے بیک اپ', icon: 'people', iconLib: 'ion', url: 'https://contacts.google.com', bg: 'rgba(50,150,50,0.32)' },
    { id: 'g18', name: 'Screen Recorder', ur: 'اسکرین ریکارڈر', icon: 'phone-portrait', iconLib: 'ion', url: 'https://screencast-o-matic.com', bg: 'rgba(150,0,200,0.32)' },
    { id: 'g19', name: 'Clipboard Mgr', ur: 'کلپ بورڈ', icon: 'clipboard', iconLib: 'ion', url: 'https://clipboardmanager.app', bg: 'rgba(0,100,100,0.32)' },
    { id: 'g20', name: 'System Tools', ur: 'سسٹم ٹولز', icon: 'settings', iconLib: 'ion', url: 'https://www.cleanmaster.com', bg: 'rgba(100,100,100,0.32)' },
  ],
};

export const HUB_META: Record<string, { name: string; ur: string; icon: string; desc: string; descUr: string; color: string; }> = {
  islamic: { name: 'Islamic Hub', ur: 'اسلامی مرکز', icon: '🕌', desc: 'Quran, Hadith, Prayer Times & More', descUr: 'قرآن، احادیث، نماز اوقات اور مزید', color: 'rgba(0,160,80,0.35)' },
  news:    { name: 'News Hub', ur: 'خبروں کا مرکز', icon: '📰', desc: 'Pakistan & World News Live', descUr: 'پاکستان اور عالمی خبریں', color: 'rgba(30,80,200,0.35)' },
  ai:      { name: 'A.I Hub', ur: 'مصنوعی ذہانت', icon: '🤖', desc: 'ChatGPT, Gemini, Claude & More', descUr: 'جدید مصنوعی ذہانت کے ٹولز', color: 'rgba(130,0,200,0.35)' },
  social:  { name: 'Social Hub', ur: 'سوشل میڈیا', icon: '🌐', desc: 'All Social Platforms', descUr: 'تمام سوشل میڈیا پلیٹ فارمز', color: 'rgba(200,80,0,0.35)' },
  general: { name: 'General Hub', ur: 'عمومی مرکز', icon: '⚙️', desc: 'Tools, VPN, Office & Utilities', descUr: 'ٹولز، وی پی این، آفس اور یوٹیلیٹیز', color: 'rgba(80,80,80,0.35)' },
};

export const TICKER_DEFAULTS = [
  '✨ EvEr SmArT BrOwSeR ✨ — Your Gateway to the Digital World — ہر ضرورت کا ایک حل',
  'بسم اللہ الرحمٰن الرحیم ✦ Welcome to the Future of Browsing ✦ خوش آمدید',
  '🌟 Breaking News: Stay Connected with World Events — دنیا کی تازہ ترین خبریں',
  '🤖 AI Hub: ChatGPT | Gemini | Claude | Copilot | Grok — جدید ٹیکنالوجی آپ کے قدموں میں',
  '🕌 Islamic Hub: Digital Quran | Prayer Times | Qibla — اسلامی خدمات آپ کی انگلیوں پر',
  '🔐 VPN & Ad Blocker Active — Secure & Fast Browsing — محفوظ اور تیز براؤزنگ',
  '📱 EvEr SmArT BrOwSeR — Pakistan\'s Smartest Digital Browser — پاکستان کا بہترین براؤزر',
];

export const PERSONALITIES: Personality[] = [
  { id: 'jinnah', name: 'Quaid-e-Azam', ur: 'قائد اعظم', title: 'Founder of Pakistan', titleUr: 'بانی پاکستان', image: require('@/assets/images/personality-jinnah.png') },
  { id: 'iqbal', name: 'Dr Allama Iqbal', ur: 'علامہ اقبال', title: 'National Poet', titleUr: 'قومی شاعر', image: require('@/assets/images/personality-iqbal.png') },
  { id: 'aqkhan', name: 'Dr AQ Khan', ur: 'ڈاکٹر عبد القدیر', title: 'Nuclear Pioneer', titleUr: 'ایٹمی علوم کے بانی', image: require('@/assets/images/personality-aqkhan.png') },
];
