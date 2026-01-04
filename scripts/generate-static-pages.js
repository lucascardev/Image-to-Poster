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

// Regex to extract values from TS files (simple and dependency-free)
const extractValue = (content, key) => {
    const regex = new RegExp(`"${key}":\\s*"(.*?)"`, 's');
    const match = content.match(regex);
    return match ? match[1] : '';
};

async function generateStaticPages() {
    console.log('Starting static page generation...');

    if (!fs.existsSync(distDir)) {
        console.error('Dist directory not found. Run build first.');
        process.exit(1);
    }

    const indexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');
    const sitemapUrls = [];

    for (const lang of languages) {
        console.log(`Processing ${lang}...`);

        // Read locale file
        const localePath = path.join(localesDir, `${lang}.ts`);
        if (!fs.existsSync(localePath)) {
            console.warn(`Locale file not found for ${lang}: ${localePath}`);
            continue;
        }
        const localeContent = fs.readFileSync(localePath, 'utf-8');

        // Extract metadata
        const metaTitle = extractValue(localeContent, 'metaTitle');
        const metaDescription = extractValue(localeContent, 'metaDescription');
        const keywords = extractValue(localeContent, 'keywords');
        const ogTitle = extractValue(localeContent, 'ogTitle');
        const ogDescription = extractValue(localeContent, 'ogDescription');

        // Prepare localized HTML
        let localizedHtml = indexHtml;

        // Replace Title
        localizedHtml = localizedHtml.replace(/<title>.*?<\/title>/, `<title>${metaTitle}</title>`);

        // Replace Meta Description
        localizedHtml = localizedHtml.replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${metaDescription}" />`);

        // Replace Keywords
        if (localizedHtml.includes('<meta name="keywords"')) {
            localizedHtml = localizedHtml.replace(/<meta name="keywords" content=".*?" \/>/, `<meta name="keywords" content="${keywords}" />`);
        } else {
            // Insert if missing
            localizedHtml = localizedHtml.replace(/<meta name="description" content=".*?" \/>/, `$& \n    <meta name="keywords" content="${keywords}" />`);
        }

        // Replace OG Tags
        localizedHtml = localizedHtml.replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${ogTitle}" />`);
        localizedHtml = localizedHtml.replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${ogDescription}" />`);
        localizedHtml = localizedHtml.replace(/<meta name="twitter:title" content=".*?" \/>/, `<meta name="twitter:title" content="${ogTitle}" />`);
        localizedHtml = localizedHtml.replace(/<meta name="twitter:description" content=".*?" \/>/, `<meta name="twitter:description" content="${ogDescription}" />`);

        // Update Canonical and Hreflang
        const urlPath = lang === 'en' ? '' : `/${lang}/`;
        const fullUrl = `${baseUrl}${urlPath}`; // Trailing slash important for standard

        // Update proper canonical for this page
        if (lang === 'en') {
            localizedHtml = localizedHtml.replace(/<link rel="canonical" href=".*?" \/>/, `<link rel="canonical" href="${baseUrl}/" />`);
        } else {
            localizedHtml = localizedHtml.replace(/<link rel="canonical" href=".*?" \/>/, `<link rel="canonical" href="${fullUrl}" />`);
        }

        // Ensure html lang attribute is correct
        localizedHtml = localizedHtml.replace(/<html lang="en">/, `<html lang="${lang}">`);


        // Generate Output
        if (lang === 'en') {
            // Just update existing index.html
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

    // Generate Sitemap
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
    console.log('Static page generation complete.');
}

generateStaticPages().catch(err => {
    console.error(err);
    process.exit(1);
});
