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

// Language display names for the static nav
const langNames = {
  en: 'English',
  'pt-BR': 'Português (BR)',
  es: 'Español',
  fr: 'Français',
  it: 'Italiano',
  ru: 'Русский',
  de: 'Deutsch',
  ja: '日本語',
  zh: '中文',
};

// Helper to extract values from TS content
const extractValue = (content, key) => {
  const regex = new RegExp(`"${key}":\\s*"(.*?)"`, 's');
  const match = content.match(regex);
  return match ? match[1] : '';
};

// Build language navigation HTML for static body content
function buildLangNav(currentLang) {
  const items = languages
    .map((l) => {
      const href = l === 'en' ? '/' : `/${l}/`;
      const active = l === currentLang ? ' aria-current="page"' : '';
      return `        <li><a href="${href}"${active}>${langNames[l]}</a></li>`;
    })
    .join('\n');
  return `      <ul style="list-style:none;padding:0;display:flex;flex-wrap:wrap;gap:.5rem">\n${items}\n        <li><a href="/languages/">All languages</a></li>\n      </ul>`;
}

// Build a small persistent footer injected OUTSIDE #root — survives React mount
function buildLangFooter(currentLang) {
  const links = languages
    .map((l) => {
      const href = l === 'en' ? '/' : `/${l}/`;
      const active = l === currentLang ? ' aria-current="page" style="font-weight:700;color:#4f46e5"' : '';
      return `<a href="${href}"${active}>${langNames[l]}</a>`;
    })
    .join(' &middot; ');
  return `<footer id="lang-nav-footer" style="text-align:center;padding:.75rem 1rem;font-size:.75rem;color:#94a3b8;font-family:system-ui,sans-serif;border-top:1px solid #e2e8f0;background:#f8fafc">
  <nav aria-label="Available languages">${links} &middot; <a href="/languages/">All languages</a></nav>
</footer>`;
}

// Build static body content injected inside #root — React replaces it on mount
function buildStaticBody(appTitle, metaDescription, blogSec1P2, currentLang) {
  const p2 = blogSec1P2
    ? `      <p style="color:#475569">${blogSec1P2.replace(/<[^>]+>/g, '')}</p>`
    : '';
  return `\n    <header style="padding:1rem;font-family:sans-serif;max-width:900px;margin:0 auto">
      <h1 style="font-size:1.5rem;font-weight:700;color:#1e293b">${appTitle}</h1>
      <p style="color:#475569">${metaDescription}</p>
${p2}
    </header>
    <nav aria-label="Language selection" style="padding:0 1rem;font-family:sans-serif;max-width:900px;margin:0 auto">
${buildLangNav(currentLang)}
    </nav>
    <section style="padding:1rem;font-family:sans-serif;max-width:900px;margin:0 auto">
      <p style="color:#475569">Learn more: <a href="https://en.wikipedia.org/wiki/ISO_216" rel="noopener noreferrer">A4 paper standard (ISO 216)</a> &middot; <a href="https://en.wikipedia.org/wiki/Poster" rel="noopener noreferrer">Poster printing</a></p>
    </section>\n  `;
}

// Generate the /languages/ index page
function generateLanguagesPage(sitemapUrls) {
  const langDir = path.join(distDir, 'languages');
  if (!fs.existsSync(langDir)) fs.mkdirSync(langDir);

  const langLinks = languages
    .map((l) => {
      const href = l === 'en' ? `${baseUrl}/` : `${baseUrl}/${l}/`;
      return `      <li><a href="${href}">${langNames[l]}</a></li>`;
    })
    .join('\n');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Print My Poster — Choose Your Language</title>
  <meta name="description" content="Select your preferred language to use Print My Poster, the free online tool to create giant wall posters from any image." />
  <link rel="canonical" href="${baseUrl}/languages/" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${baseUrl}/languages/" />
  <meta property="og:title" content="Print My Poster — Choose Your Language" />
  <meta property="og:description" content="Select your language to create giant wall posters for free." />
  <link rel="shortcut icon" href="/favicon.ico" />
  <style>
    body { font-family: system-ui, sans-serif; max-width: 700px; margin: 3rem auto; padding: 0 1rem; color: #1e293b; }
    h1 { font-size: 1.8rem; font-weight: 700; margin-bottom: .5rem; }
    p { color: #475569; margin-bottom: 1.5rem; }
    ul { list-style: none; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: .75rem; }
    li a { display: block; padding: .75rem 1rem; border: 1px solid #e2e8f0; border-radius: 8px; text-decoration: none; color: #4f46e5; font-weight: 600; transition: background .15s; }
    li a:hover { background: #eef2ff; }
    footer { margin-top: 2rem; font-size: .85rem; color: #94a3b8; }
    footer a { color: #64748b; }
  </style>
</head>
<body>
  <h1>Print My Poster — Choose Your Language</h1>
  <p>Select your preferred language to create giant wall posters from any image — free, online, no signup required.</p>
  <ul>
${langLinks}
  </ul>
  <footer>
    <p>Print My Poster processes your images directly in your browser. No files are uploaded to external servers.
    Learn more about <a href="https://en.wikipedia.org/wiki/ISO_216" rel="noopener noreferrer">A4 paper (ISO 216)</a> and
    <a href="https://en.wikipedia.org/wiki/Poster" rel="noopener noreferrer">poster printing</a>.</p>
  </footer>
</body>
</html>`;

  fs.writeFileSync(path.join(langDir, 'index.html'), html);
  sitemapUrls.push({ url: `${baseUrl}/languages/`, priority: 0.5 });
  console.log('Generated /languages/ page.');
}

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
    const blogSec1P2 = extractValue(localeContent, 'blogSec1P2');

    // HowTo Keys
    const howToTitle = extractValue(localeContent, 'howItWorksTitle');
    const howToDesc = extractValue(localeContent, 'howItWorksSubtitle');
    const steps = [
      { name: extractValue(localeContent, 'tutorialStep1Title'), text: extractValue(localeContent, 'tutorialStep1Desc') },
      { name: extractValue(localeContent, 'tutorialStep2Title'), text: extractValue(localeContent, 'tutorialStep2Desc') },
      { name: extractValue(localeContent, 'tutorialStep3Title'), text: extractValue(localeContent, 'tutorialStep3Desc') },
      { name: extractValue(localeContent, 'tutorialStep4Title'), text: extractValue(localeContent, 'tutorialStep4Desc') },
      { name: extractValue(localeContent, 'tutorialStep5Title'), text: extractValue(localeContent, 'tutorialStep5Desc') },
    ];

    // URL & canonical per language
    const urlPath = lang === 'en' ? '' : `/${lang}/`;
    const fullUrl = `${baseUrl}${urlPath || '/'}`;
    const canonicalHref = lang === 'en' ? `${baseUrl}/` : `${baseUrl}/${lang}/`;

    let localizedHtml = indexHtml;

    // --- Basic Metadata ---
    localizedHtml = localizedHtml.replace(/<title>.*?<\/title>/, `<title>${metaTitle}</title>`);

    // Fix: use /s flag-equivalent workaround for multiline meta description
    localizedHtml = localizedHtml.replace(
      /<meta name="description"[\s\S]*?\/>/,
      `<meta name="description" content="${metaDescription}" />`
    );

    // Keywords
    if (localizedHtml.includes('<meta name="keywords"')) {
      localizedHtml = localizedHtml.replace(
        /<meta name="keywords"[\s\S]*?\/>/,
        `<meta name="keywords" content="${keywords}" />`
      );
    }

    // OG & Twitter Tags
    localizedHtml = localizedHtml.replace(/(<meta property="og:url" content=").*?(" \/>)/, `$1${canonicalHref}$2`);
    localizedHtml = localizedHtml.replace(/(<meta property="og:title" content=").*?(" \/>)/, `$1${ogTitle}$2`);
    localizedHtml = localizedHtml.replace(/(<meta property="og:description"[\s\S]*?content=").*?(" \/>)/, `$1${ogDescription}$2`);
    localizedHtml = localizedHtml.replace(/(<meta name="twitter:title" content=").*?(" \/>)/, `$1${ogTitle}$2`);
    localizedHtml = localizedHtml.replace(/(<meta name="twitter:description"[\s\S]*?content=").*?(" \/>)/, `$1${ogDescription}$2`);

    // --- JSON-LD Structured Data ---

    // 1. Organization
    localizedHtml = localizedHtml.replace(
      /<script type="application\/ld\+json">\s*{\s*"@context": "https:\/\/schema.org",\s*"@type": "Organization"[\s\S]*?}\s*<\/script>/,
      `<script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "url": "${baseUrl}/",
      "logo": "${baseUrl}/logo.png",
      "name": "${appTitle}"
    }
    </script>`
    );

    // 2. WebApplication
    const featureList = extractValue(localeContent, 'featureList') || 'Split images, Generate PDF, Custom Grid, Margin Control';
    localizedHtml = localizedHtml.replace(
      /<script type="application\/ld\+json">\s*{\s*"@context": "https:\/\/schema.org",\s*"@type": "WebApplication"[\s\S]*?}\s*<\/script>/,
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
      "featureList": "${featureList}"
    }
    </script>`
    );

    // 3. HowTo
    const howToStepsJson = steps.map((step) => `
        {
          "@type": "HowToStep",
          "name": "${step.name}",
          "text": "${step.text}"
        }`).join(',');
    localizedHtml = localizedHtml.replace(
      /<script type="application\/ld\+json">\s*{\s*"@context": "https:\/\/schema.org",\s*"@type": "HowTo"[\s\S]*?}\s*<\/script>/,
      `<script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "${howToTitle}",
      "description": "${howToDesc}",
      "step": [${howToStepsJson}
      ]
    }
    </script>`
    );

    // --- Canonical & Hreflang ---
    const canonicalLink = `<link rel="canonical" href="${canonicalHref}" />`;
    localizedHtml = localizedHtml.replace(/<link rel="canonical" href=".*?" \/>/, canonicalLink);

    const hreflangTags = languages.map((l) => {
      const langUrl = l === 'en' ? `${baseUrl}/` : `${baseUrl}/${l}/`;
      return `<link rel="alternate" hreflang="${l}" href="${langUrl}" />`;
    }).join('\n    ');
    const xDefaultTag = `<link rel="alternate" hreflang="x-default" href="${baseUrl}/" />`;
    const hreflangBlockRegex = /(<link rel="alternate" hreflang=".*?" href=".*?" \/>\s*)+/g;
    localizedHtml = localizedHtml.replace(hreflangBlockRegex, `${hreflangTags}\n    ${xDefaultTag}\n    `);

    // HTML lang attribute
    localizedHtml = localizedHtml.replace(/<html lang=".*?">/, `<html lang="${lang}">`);

    // --- Inject static body content inside #root ---
    const staticBody = buildStaticBody(appTitle, metaDescription, blogSec1P2, lang);
    localizedHtml = localizedHtml.replace(
      /<div id="root">[\/\s\S]*?<\/div>/,
      `<div id="root">${staticBody}</div>\n  ${buildLangFooter(lang)}`
    );

    // Write File
    if (lang === 'en') {
      fs.writeFileSync(path.join(distDir, 'index.html'), localizedHtml);
      sitemapUrls.push({ url: `${baseUrl}/`, priority: 1.0 });
    } else {
      const langDir = path.join(distDir, lang);
      if (!fs.existsSync(langDir)) fs.mkdirSync(langDir);
      fs.writeFileSync(path.join(langDir, 'index.html'), localizedHtml);
      sitemapUrls.push({ url: `${canonicalHref}`, priority: 0.8 });
    }
  }

  // Generate /languages/ page
  generateLanguagesPage(sitemapUrls);

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

generateStaticPages().catch((err) => {
  console.error(err);
  process.exit(1);
});
