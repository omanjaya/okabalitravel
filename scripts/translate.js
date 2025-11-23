const fs = require('fs');
const path = require('path');
const translate = require('@vitalets/google-translate-api').default;

// Language codes
const languages = {
  ja: 'Japanese',
  ko: 'Korean',
  ru: 'Russian',
  // Add more as needed
};

// Sleep function to avoid rate limiting
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Translate text with retry logic
async function translateText(text, targetLang, retries = 3) {
  try {
    const result = await translate(text, { to: targetLang });
    return result.text;
  } catch (error) {
    if (retries > 0) {
      console.log(`  Retrying... (${retries} attempts left)`);
      await sleep(2000);
      return translateText(text, targetLang, retries - 1);
    }
    console.error(`  Failed to translate: ${text.substring(0, 50)}...`);
    return text; // Return original if translation fails
  }
}

// Recursively translate object
async function translateObject(obj, targetLang) {
  const translated = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      console.log(`  Translating: ${key}`);
      translated[key] = await translateText(value, targetLang);
      await sleep(100); // Small delay to avoid rate limiting
    } else if (typeof value === 'object' && value !== null) {
      translated[key] = await translateObject(value, targetLang);
    } else {
      translated[key] = value;
    }
  }

  return translated;
}

async function main() {
  // Read source file (English)
  const sourcePath = path.join(__dirname, '../src/i18n/messages/en.json');
  const sourceData = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));

  console.log('🌐 Auto-Translation Tool\n');
  console.log(`Source: en.json (English)`);
  console.log(`Target languages: ${Object.values(languages).join(', ')}\n`);

  // Translate to each language
  for (const [langCode, langName] of Object.entries(languages)) {
    console.log(`\n📝 Translating to ${langName} (${langCode})...`);

    try {
      const translated = await translateObject(sourceData, langCode);

      // Save translated file
      const targetPath = path.join(__dirname, `../src/i18n/messages/${langCode}.json`);
      fs.writeFileSync(targetPath, JSON.stringify(translated, null, 2), 'utf8');

      console.log(`✅ ${langName} translation completed: ${langCode}.json`);
    } catch (error) {
      console.error(`❌ Failed to translate ${langName}:`, error.message);
    }

    // Wait between languages to avoid rate limiting
    await sleep(1000);
  }

  console.log('\n\n🎉 All translations completed!');
  console.log('\nGenerated files:');
  Object.keys(languages).forEach(lang => {
    console.log(`  - src/i18n/messages/${lang}.json`);
  });
}

main().catch(console.error);
