import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const localesDir = path.join(rootDir, 'hooks', 'locales');

const languages = ['en', 'pt-BR', 'es', 'fr', 'it', 'ru', 'de', 'ja', 'zh'];
const baseUrl = 'https://www.printmyposter.art';

// Helper to extract values from TS content
const extractValue = (content, key) => {
    const regex = new RegExp(`"${key}":\\s*"(.*?)"`, 's');
    const match = content.match(regex);
    return match ? match[1] : '';
};

async function generateStaticPages() {
    console.log('Starting deep static page generation...');

    if (!fs.existsSync(distDir)) {
        console.error('Dist directory not found. Run build first.');
        process.exit(1);
    }

    const indexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');
    const sitemapUrls = [];

    for (const lang of languages) {
        console.log(`Processing ${lang}...`);

        const localePath = path.join(localesDir, `${lang}.ts`);
        if (!fs.existsSync(localePath)) {
            console.warn(`Locale file not found for ${lang}`);
            continue;
        }
        const localeContent = fs.readFileSync(localePath, 'utf-8');

        // Extract all necessary keys
        const metaTitle = extractValue(localeContent, 'metaTitle');
        const metaDescription = extractValue(localeContent, 'metaDescription');
        const keywords = extractValue(localeContent, 'keywords');
        const ogTitle = extractValue(localeContent, 'ogTitle');
        const ogDescription = extractValue(localeContent, 'ogDescription');
        const appTitle = extractValue(localeContent, 'appTitle');

        // HowTo Keys
        const howToTitle = extractValue(localeContent, 'howItWorksTitle'); // "How It Works in 5 Easy Steps"
        const howToDesc = extractValue(localeContent, 'howItWorksSubtitle');
        const steps = [
            { name: extractValue(localeContent, 'tutorialStep1Title'), text: extractValue(localeContent, 'tutorialStep1Desc') },
            { name: extractValue(localeContent, 'tutorialStep2Title'), text: extractValue(localeContent, 'tutorialStep2Desc') },
            { name: extractValue(localeContent, 'tutorialStep3Title'), text: extractValue(localeContent, 'tutorialStep3Desc') },
            { name: extractValue(localeContent, 'tutorialStep4Title'), text: extractValue(localeContent, 'tutorialStep4Desc') },
            { name: extractValue(localeContent, 'tutorialStep5Title'), text: extractValue(localeContent, 'tutorialStep5Desc') },
        ];

        let localizedHtml = indexHtml;

        // --- Basic Metadata ---
        localizedHtml = localizedHtml.replace(/<title>.*?<\/title>/, `<title>${metaTitle}</title>`);
        localizedHtml = localizedHtml.replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${metaDescription}" />`);

        // Keywords (robust replacement)
        if (localizedHtml.includes('<meta name="keywords"')) {
            localizedHtml = localizedHtml.replace(/<meta name="keywords" content=".*?" \/>/, `<meta name="keywords" content="${keywords}" />`);
        } else {
            localizedHtml = localizedHtml.replace(/<meta name="description" content=".*?" \/>/, `$& \n    <meta name="keywords" content="${keywords}" />`);
        }

        // OG & Twitter Tags
        localizedHtml = localizedHtml.replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${ogTitle}" />`);
        localizedHtml = localizedHtml.replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${ogDescription}" />`);
        localizedHtml = localizedHtml.replace(/<meta name="twitter:title" content=".*?" \/>/, `<meta name="twitter:title" content="${ogTitle}" />`);
        localizedHtml = localizedHtml.replace(/<meta name="twitter:description" content=".*?" \/>/, `<meta name="twitter:description" content="${ogDescription}" />`);

        // --- JSON-LD Structured Data Reconstruction ---

        // 1. Organization
        localizedHtml = localizedHtml.replace(/<script type="application\/ld\+json">\s*\{\s*"@context": "https:\/\/schema.org",\s*"@type": "Organization".*?\n\s*\}\s*<\/script>/s,
            `<script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "url": "${baseUrl}/",
      "logo": "${baseUrl}/logo.png",
      "name": "${appTitle}"
    }
    </script>`);

        // 2. WebApplication
        localizedHtml = localizedHtml.replace(/<script type="application\/ld\+json">\s*\{\s*"@context": "https:\/\/schema.org",\s*"@type": "WebApplication".*?\n\s*\}\s*<\/script>/s,
            `<script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "${appTitle}",
      "url": "${baseUrl}/",
      "description": "${metaDescription}",
      "applicationCategory": "DesignApplication",
      "operatingSystem": "Any",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "featureList": "Split images, Generate PDF, Custom Grid, Margin Control"
    }
    </script>`);

        // 3. HowTo
        const howToStepsJson = steps.map(step => `
        {
          "@type": "HowToStep",
          "name": "${step.name}",
          "text": "${step.text}"
        }`).join(',');

        localizedHtml = localizedHtml.replace(/<script type="application\/ld\+json">\s*\{\s*"@context": "https:\/\/schema.org",\s*"@type": "HowTo".*?\n\s*\}\s*<\/script>/s,
            `<script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "${howToTitle}",
      "description": "${howToDesc}",
      "step": [${howToStepsJson}
      ]
    }
    </script>`);


        // --- URL Structure ---
        const urlPath = lang === 'en' ? '' : `/${lang}/`;
        const fullUrl = `${baseUrl}${urlPath}`;

        // Canonical
        const canonicalLink = `<link rel="canonical" href="${lang === 'en' ? `${baseUrl}/` : fullUrl}" />`;
        localizedHtml = localizedHtml.replace(/<link rel="canonical" href=".*?" \/>/, canonicalLink);

        // HTML Lang Attribute
        localizedHtml = localizedHtml.replace(/<html lang="en">/, `<html lang="${lang}">`);

        // Write File
        if (lang === 'en') {
            fs.writeFileSync(path.join(distDir, 'index.html'), localizedHtml);
            sitemapUrls.push({ url: `${baseUrl}/`, priority: 1.0 });
        } else {
            const langDir = path.join(distDir, lang);
            if (!fs.existsSync(langDir)) {
                fs.mkdirSync(langDir);
            }
            fs.writeFileSync(path.join(langDir, 'index.html'), localizedHtml);
            sitemapUrls.push({ url: `${fullUrl}`, priority: 0.8 });
        }
    }

    // --- Sitemap Generation ---
    console.log('Generating sitemap.xml...');
    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map(({ url, priority }) => `  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <priority>${priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapContent);
    console.log('Deep localization complete.');
}

generateStaticPages().catch(err => {
    console.error(err);
    process.exit(1);
});
