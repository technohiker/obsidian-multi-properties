// i18n 入口文件
import en from './en';
import zh from './zh';

type Translations = typeof en;

export const translations: Record<string, Translations> = {
  'en': en,
  'zh': zh,
  'en-US': en,
  'en-GB': en,
  'en-CA': en,
  'en-AU': en,
  'zh-CN': zh,
  'zh-TW': zh,
  'zh-HK': zh,
  'zh-SG': zh
};

export function getTranslation(locale: string): Translations {
  return translations[locale] || translations['en'];
}

export function detectLocale(): string {
  // 首先尝试从 Obsidian 获取语言设置
  try {
    // @ts-ignore - Obsidian 内部 API
    const obsidianLocale = window.localStorage?.getItem('language');
    if (obsidianLocale && translations[obsidianLocale]) {
      return obsidianLocale;
    }
    if (obsidianLocale) {
      const shortLang = obsidianLocale.split('-')[0];
      if (translations[shortLang]) {
        return shortLang;
      }
    }
  } catch (e) {
    // 忽略错误，继续使用 navigator.language
  }

  // 然后使用 navigator.language
  const navLang = navigator.language;

  if (translations[navLang]) {
    return navLang;
  }

  const shortLang = navLang.split('-')[0];
  if (translations[shortLang]) {
    return shortLang;
  }

  return 'en';
}

export function setLocale(locale: string) {
  localStorage.setItem('multi-properties-locale', locale);
}

export function getStoredLocale(): string | null {
  return localStorage.getItem('multi-properties-locale');
}

// 辅助函数：替换翻译字符串中的占位符
export function format(template: string, params: Record<string, string | number>): string {
  return template.replace(/{([^}]+)}/g, (_, key) => String(params[key] ?? ''));
}
