const fs = require('fs');
const path = require('path');
const deepl = require('deepl-node');

// Get API key from environment
const DEEPL_API_KEY = process.env.DEEPL_API_KEY;

// Language mapping: our code -> DeepL code
const languageMap = {
  ja: 'JA',    // Japanese
  ko: 'KO',    // Korean
  ru: 'RU',    // Russian
  // DeepL supports many more languages - easy to add:
  // de: 'DE',    // German
  // fr: 'FR',    // French
  // es: 'ES',    // Spanish
  // pt: 'PT-BR', // Portuguese (Brazil)
  // it: 'IT',    // Italian
  // nl: 'NL',    // Dutch
  // pl: 'PL',    // Polish
  // ar: 'AR',    // Arabic (DeepL doesn't support yet)
  // th: 'TH',    // Thai (DeepL doesn't support yet)
};

// Sleep function
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Recursively translate object
async function translateObject(obj, translator, targetLang, path = '') {
  const translated = {};
  let count = 0;

  for (const [key, value] of Object.entries(obj)) {
    const currentPath = path ? `${path}.${key}` : key;

    if (typeof value === 'string') {
      try {
        count++;
        console.log(`  [${count}] ${currentPath}: "${value.substring(0, 50)}${value.length > 50 ? '...' : ''}"`);

        const result = await translator.translateText(value, null, targetLang);
        translated[key] = result.text;

        // Small delay to respect rate limits
        await sleep(100);
      } catch (error) {
        console.error(`    ⚠️  Failed: ${error.message}`);
        translated[key] = value; // Keep original on error
      }
    } else if (typeof value === 'object' && value !== null) {
      translated[key] = await translateObject(value, translator, targetLang, currentPath);
    } else {
      translated[key] = value;
    }
  }

  return translated;
}

async function main() {
  console.log('🌐 DeepL Auto-Translation Tool\n');

  // Check for API key
  if (!DEEPL_API_KEY) {
    console.error('❌ Error: DEEPL_API_KEY not found in environment variables!');
    console.log('\n📝 To use this tool:');
    console.log('   1. Sign up for DeepL API at: https://www.deepl.com/pro-api');
    console.log('   2. Get your free API key (500k chars/month free)');
    console.log('   3. Add to .env.local: DEEPL_API_KEY=your-key-here');
    console.log('   4. Run: node scripts/translate-deepl.js\n');
    process.exit(1);
  }

  // Initialize DeepL translator
  const translator = new deepl.Translator(DEEPL_API_KEY);

  // Check API usage
  try {
    const usage = await translator.getUsage();
    if (usage.character) {
      const used = usage.character.count;
      const limit = usage.character.limit;
      const remaining = limit - used;
      console.log(`📊 DeepL API Usage:`);
      console.log(`   Used: ${used.toLocaleString()} / ${limit.toLocaleString()} characters`);
      console.log(`   Remaining: ${remaining.toLocaleString()} characters (${((remaining/limit)*100).toFixed(1)}%)\n`);
    }
  } catch (error) {
    console.log('⚠️  Could not fetch usage info (continuing anyway...)\n');
  }

  // Read source file (English)
  const sourcePath = path.join(__dirname, '../src/i18n/messages/en.json');
  const sourceData = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));

  // Count total strings
  const countStrings = (obj) => {
    let count = 0;
    for (const value of Object.values(obj)) {
      if (typeof value === 'string') count++;
      else if (typeof value === 'object' && value !== null) count += countStrings(value);
    }
    return count;
  };
  const totalStrings = countStrings(sourceData);
  console.log(`Source: en.json (${totalStrings} strings)`);
  console.log(`Target languages: ${Object.keys(languageMap).join(', ')}\n`);

  // Translate to each language
  for (const [langCode, deeplCode] of Object.entries(languageMap)) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📝 Translating to ${langCode.toUpperCase()} (DeepL: ${deeplCode})...`);
    console.log(`${'='.repeat(60)}\n`);

    try {
      const translated = await translateObject(sourceData, translator, deeplCode);

      // Save translated file
      const targetPath = path.join(__dirname, `../src/i18n/messages/${langCode}.json`);
      fs.writeFileSync(targetPath, JSON.stringify(translated, null, 2), 'utf8');

      console.log(`\n✅ Translation completed: ${langCode}.json`);
    } catch (error) {
      console.error(`\n❌ Failed to translate ${langCode}:`, error.message);
    }

    // Wait between languages
    if (Object.keys(languageMap).indexOf(langCode) < Object.keys(languageMap).length - 1) {
      console.log('\n⏳ Waiting 2 seconds before next language...');
      await sleep(2000);
    }
  }

  console.log('\n\n' + '='.repeat(60));
  console.log('🎉 All translations completed!');
  console.log('='.repeat(60));
  console.log('\nGenerated files:');
  Object.keys(languageMap).forEach(lang => {
    const filePath = path.join(__dirname, `../src/i18n/messages/${lang}.json`);
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      console.log(`  ✓ ${lang}.json (${(stats.size / 1024).toFixed(1)} KB)`);
    }
  });
  console.log('');

  // Check final usage
  try {
    const finalUsage = await translator.getUsage();
    if (finalUsage.character) {
      const used = finalUsage.character.count;
      const limit = finalUsage.character.limit;
      const remaining = limit - used;
      console.log('📊 Final API Usage:');
      console.log(`   Used: ${used.toLocaleString()} / ${limit.toLocaleString()} characters`);
      console.log(`   Remaining: ${remaining.toLocaleString()} characters`);
    }
  } catch (error) {
    // Ignore
  }
}

main().catch(error => {
  console.error('\n❌ Fatal error:', error.message);
  process.exit(1);
});
