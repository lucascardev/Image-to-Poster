# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2024-07-27

### Added
- PWA Web Manifest (`manifest.json`) to support installation on mobile devices as a native-like app.
- Structured Data (Schema.org) for `WebApplication` and `Organization` to improve Google search rich snippets.
- `theme-color` meta tag for better visual integration on mobile browsers.
- Explicit `robots` meta tag to ensure proper indexing.

### Removed
- Removed `@vercel/speed-insights` integration to reduce bundle size.

## [1.0.0] - 2024-07-26

### Added
- Initial release of the Print My Poster application.
- Core functionality: Image upload, grid configuration, margin settings, crop marks, and overlap aid.
- PDF generation for multi-page posters.
- Fullscreen preview of the assembled poster.
- Internationalization support for English, Portuguese, Spanish, German, Japanese, and Chinese.
- Responsive UI/UX for desktop and mobile devices.
- How-to-assemble instructions.
- Low-resolution image warning to ensure print quality.
- PayPal donation link to support the project.
- PWA installation instructions for offline use.
- Ad-based download unlocking mechanism.
- Versioning system with a visible version number in the footer and a documented CHANGELOG.md.