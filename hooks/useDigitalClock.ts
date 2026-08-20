import { useState, useEffect } from 'react';

function pad(n: number) { return n.toString().padStart(2, '0'); }

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const MONTHS_UR = ['جنوری','فروری','مارچ','اپریل','مئی','جون','جولائی','اگست','ستمبر','اکتوبر','نومبر','دسمبر'];
const DAYS_UR = ['اتوار','سوموار','منگل','بدھ','جمعرات','جمعہ','ہفتہ'];

// ── Hijri Calendar (Umm al-Qura approximation) ─────────────────────────────
const HIJRI_MONTHS = [
  'محرم','صفر','ربیع الاول','ربیع الثانی','جمادی الاولی','جمادی الثانیہ',
  'رجب','شعبان','رمضان','شوال','ذوالقعدہ','ذوالحجہ',
];
function toHijri(date: Date): { day: number; month: number; year: number } {
  // Julian day number
  const y = date.getFullYear(), m = date.getMonth() + 1, d = date.getDate();
  const jdn =
    Math.floor((1461 * (y + 4800 + Math.floor((m - 14) / 12))) / 4) +
    Math.floor((367 * (m - 2 - 12 * Math.floor((m - 14) / 12))) / 12) -
    Math.floor((3 * Math.floor((y + 4900 + Math.floor((m - 14) / 12)) / 100)) / 4) + d - 32075;
  // Hijri
  let l = jdn - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  l = l - 10631 * n + 354;
  const j = Math.floor((10985 - l) / 5316) * Math.floor((50 * l) / 17719) +
    Math.floor(l / 5670) * Math.floor((43 * l) / 15238);
  l = l - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
    Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
  const month = Math.floor((24 * (l - 1)) / 709);
  const day = l - Math.floor((709 * month) / 24);
  const year = 30 * n + j - 30;
  return { day, month, year };
}

// ── Chinese Zodiac & Year ───────────────────────────────────────────────────
const CHINESE_ZODIAC = ['رات','بیل','شیر','خرگوش','اژدہا','سانپ','گھوڑا','بھیڑ','بندر','مرغ','کتا','سور'];
const CHINESE_ZODIAC_EN = ['Rat','Ox','Tiger','Rabbit','Dragon','Snake','Horse','Goat','Monkey','Rooster','Dog','Pig'];
function chineseYear(y: number) {
  const idx = (y - 4) % 12;
  return { en: CHINESE_ZODIAC_EN[idx >= 0 ? idx : idx + 12], ur: CHINESE_ZODIAC[idx >= 0 ? idx : idx + 12] };
}

export function useDigitalClock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const h = now.getHours(), m = now.getMinutes(), s = now.getSeconds();
  const isAm = h < 12;
  const h12 = h % 12 || 12;
  const y = now.getFullYear();
  const mo = now.getMonth();
  const d = now.getDate();

  const hijri = toHijri(now);
  const zodiac = chineseYear(y);

  // Gregorian short
  const gregorianStr = `${pad(d)} ${MONTHS[mo]} ${y}`;

  // Hijri short
  const hijriStr = `${hijri.day} ${HIJRI_MONTHS[hijri.month - 1]} ${hijri.year}ھ`;

  // Chinese year (approx — Chinese New Year ~Feb)
  const chYear = mo < 1 || (mo === 1 && d < 10) ? y - 1 : y;
  const chineseStr = `${chYear - 2697} 中 • ${zodiac.en} (${zodiac.ur})`;

  return {
    hours24: pad(h),
    minutes: pad(m),
    seconds: pad(s),
    hours12: pad(h12),
    ampm: isAm ? 'AM' : 'PM',
    ampmUr: isAm ? 'صبح' : 'شام',
    dateStr: `${DAYS_UR[now.getDay()]}، ${gregorianStr}`,
    gregorianStr,
    hijriStr,
    chineseStr,
    full: `${pad(h)}:${pad(m)}:${pad(s)}`,
  };
}
