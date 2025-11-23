# 🌐 Internationalization (i18n) Setup

This project uses **next-intl** for multi-language support with automatic country detection.

## 📋 Supported Languages

| Language | Code | Flag | Auto-detect Countries |
|----------|------|------|----------------------|
| English | `en` | 🇬🇧 | USA, UK, Canada, Australia, etc. (default) |
| Indonesian | `id` | 🇮🇩 | Indonesia |
| Chinese | `zh` | 🇨🇳 | China, Taiwan, Hong Kong |
| Japanese | `ja` | 🇯🇵 | Japan |
| Korean | `ko` | 🇰🇷 | South Korea |
| Russian | `ru` | 🇷🇺 | Russia, Kazakhstan, etc. |

## 🚀 Quick Start

### 1. Using Existing Translations

All translations are already included in `src/i18n/messages/`. No setup required!

```bash
# Just run the app
npm run dev
```

### 2. Auto-Translation with DeepL (Optional)

To add more languages or update translations automatically:

#### Step 1: Get Free DeepL API Key
1. Sign up at: https://www.deepl.com/pro-api
2. Choose the **Free plan** (500,000 characters/month)
3. Copy your API key

#### Step 2: Add API Key to Environment
```bash
# .env.local
DEEPL_API_KEY=your-deepl-api-key-here
```

#### Step 3: Run Auto-Translation
```bash
npm run translate
```

This will automatically translate `en.json` to all other languages!

## 📁 File Structure

```
src/
├── i18n/
│   ├── request.ts          # i18n configuration
│   └── messages/           # Translation files
│       ├── en.json         # English (source)
│       ├── id.json         # Indonesian
│       ├── zh.json         # Chinese
│       ├── ja.json         # Japanese
│       ├── ko.json         # Korean
│       └── ru.json         # Russian
└── middleware.ts           # Auto-detect country & redirect
```

## 🔧 Adding New Languages

### Option 1: Manual Translation
1. Copy `src/i18n/messages/en.json`
2. Rename to new language code (e.g., `de.json` for German)
3. Translate all values (keep keys in English)
4. Add language to `src/i18n/request.ts`:
   ```ts
   export const locales = ["en", "id", "zh", "ja", "ko", "ru", "de"] as const;
   export const localeLabels: Record<Locale, string> = {
     // ... existing
     de: "Deutsch",
   };
   ```

### Option 2: Auto-Translation with DeepL
1. Add language code to `scripts/translate-deepl.js`:
   ```js
   const languageMap = {
     // ... existing
     de: 'DE',    // German
     fr: 'FR',    // French
     es: 'ES',    // Spanish
   };
   ```
2. Run `npm run translate`

## 🌍 Auto Country Detection

The middleware automatically detects user's country from:
1. **IP Geolocation** (Vercel Edge, CloudFlare headers)
2. **Accept-Language header** (browser preference)
3. **Cookie** (user manual selection - persists)

### Country → Language Mapping

```ts
// middleware.ts
const countryToLocale: Record<string, Locale> = {
  US: 'en', GB: 'en', CA: 'en', AU: 'en',  // English
  ID: 'id',                                  // Indonesian
  CN: 'zh', TW: 'zh', HK: 'zh',             // Chinese
  JP: 'ja',                                  // Japanese
  KR: 'ko',                                  // Korean
  RU: 'ru', KZ: 'ru', BY: 'ru',             // Russian
};
```

## 🔄 How It Works

1. User visits website
2. Middleware detects country from IP/headers
3. Auto-redirect to correct language URL:
   - `okabalitravel.com` → `okabalitravel.com/en` (from USA)
   - `okabalitravel.com` → `okabalitravel.com/id` (from Indonesia)
   - `okabalitravel.com` → `okabalitravel.com/ja` (from Japan)
4. User can manually switch language via language switcher
5. Choice saved in cookie for future visits

## 📝 Using Translations in Code

```tsx
import { useTranslations } from 'next-intl';

export function MyComponent() {
  const t = useTranslations();

  return (
    <div>
      <h1>{t('hero.title')}</h1>
      <p>{t('hero.subtitle')}</p>
      <button>{t('common.search')}</button>
    </div>
  );
}
```

## 🎨 Translation Keys Structure

```json
{
  "common": { ... },      // Common UI elements
  "nav": { ... },         // Navigation menu
  "hero": { ... },        // Homepage hero section
  "featured": { ... },    // Featured destinations
  "destinations": { ... },// Destinations page
  "tours": { ... },       // Tours page
  "footer": { ... },      // Footer
  "auth": { ... },        // Authentication
  "booking": { ... },     // Booking flow
  "meta": { ... }         // SEO metadata
}
```

## 🆘 Troubleshooting

### Translations not updating?
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

### Want to test specific language locally?
Navigate to: `http://localhost:3000/ja` (for Japanese)

### DeepL API errors?
- Check API key is correct in `.env.local`
- Verify you haven't exceeded free tier (500k chars/month)
- Check your internet connection

## 📊 DeepL Translation Limits

**Free Plan:**
- 500,000 characters/month
- Perfect for ~50-100 translation updates
- Our current translation files: ~15,000 characters per language

**Pro Plan ($5.49/month):**
- Unlimited characters
- Faster API
- Priority support

## 🚀 Production Deployment

DeepL API key is only needed for **development** (updating translations).

For **production**, just deploy the generated JSON files:
```bash
# Include these in your deployment
src/i18n/messages/*.json
```

No API key needed in production! 🎉

## 📚 Resources

- next-intl docs: https://next-intl.dev/
- DeepL API: https://www.deepl.com/pro-api
- Supported languages: https://www.deepl.com/docs-api/translate-text/

---

**Questions?** Check the [next-intl documentation](https://next-intl.dev/) or contact the dev team!
