import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

// Supported locales
export const locales = ["en", "id", "zh", "ja", "ko", "ru"] as const;
export type Locale = (typeof locales)[number];

// Default locale
export const defaultLocale: Locale = "en";

// Locale labels for display
export const localeLabels: Record<Locale, string> = {
  en: "English",
  id: "Bahasa Indonesia",
  zh: "中文",
  ja: "日本語",
  ko: "한국어",
  ru: "Русский",
};

// Locale flags (emoji)
export const localeFlags: Record<Locale, string> = {
  en: "🇬🇧",
  id: "🇮🇩",
  zh: "🇨🇳",
  ja: "🇯🇵",
  ko: "🇰🇷",
  ru: "🇷🇺",
};

export default getRequestConfig(async ({ requestLocale }) => {
  // Get locale from request or use default
  const locale = (await requestLocale) || defaultLocale;

  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
