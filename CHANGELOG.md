
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


## [1.1.5] - 2026-01-02

### Changed
- **Performance & Best Practices:** Migrated CSS framework from Tailwind CDN to a build-time compilation using **Tailwind CSS v4** and **PostCSS**. This eliminates the "should not be used in production" warning and improves load performance.

## [1.1.4] - 2026-01-02

### Added
- **New Languages:** Added full support for French (Français), Italian (Italiano), and Russian (Русский).
- **UI Update:** Added flag icons for France, Italy, and Russia to the language switcher.

## [1.1.3] - 2026-01-02

### Fixed
- **Debug Console Visibility:** Fixed an issue where the "Show Debug" button was visible in the production environment. It is now correctly restricted to development builds only.

## [1.1.2] - 2026-01-02

### Added
- **Local Release Automation:** Implemented a `npm run release` script to automate testing, version bumping, changelog updates, and git pushing.
- **Unit Tests:** Added Vitest framework and unit tests for core utilities (`debounce`, `mmToPx`, `calculateGridDimensions`).

### Changed
- **Refactoring:** Extracted core logic from `App.tsx` to `utils.ts` to improve code maintainability and testability.

## [1.1.1] - 2025-12-27

### Fixed
- **Critical Image Upload Fix:** Resolved a persistent "silent error" on mobile devices by reverting to a robust, native file input structure.
- **Input Reliability:** Restored the "Red Box" input style (now verified as the most reliable method across browsers) while maintaining a clean user interface text.

### Added
- **Multilingual Upload UI:** Added complete translation support for the upload buttons and prompts across all languages (English, Portuguese, Spanish, German, Japanese, Chinese).
- **Upload Race Protection:** Implemented unique ID tracking for upload attempts to prevent race conditions when selecting images rapidly.

## [1.1.0] - 2024-07-27

### Added
- **Performance (Lazy Loading):** Significantly improved initial page load speed by implementing Lazy Loading for heavy components (Preview, Instructions, 3D Background).
- **UI Animations:** Added smooth `fade-in` and `slide-up` animations for the settings panel and preview area to improve the user experience.
- **Progressive Interface:** Configuration steps (2-5) are now hidden until an image is successfully uploaded, reducing cognitive load for new users.
- **Smart Sticky Buttons:** Implemented responsive floating buttons. Mobile users get navigation arrows (Up/Down) to navigate the long scroll, while Desktop users get a persistent "Download" button for quick access.

### Changed
- **UX Polish:** Enforced a minimum loading state of 3 seconds during image processing to prevent UI flickering and provide better feedback.
- **Visuals:** Updated the sticky action button to use a specific Download icon instead of a generic arrow.

## [1.0.3] - 2024-07-27

### Added
- Added a "Recommended Materials" section to the installation instructions, featuring useful tools like a Tape Runner and high-quality Photo Paper to help users get the best results.
- Updated translations for all supported languages (English, Portuguese, Spanish, German, Chinese, Japanese) to include descriptions for the recommended products.

## [1.0.2] - 2024-07-27

### Changed
- Default crop mark style is now set to "Full Lines (dashed)" instead of "Corners" to make cutting easier for new users.
- Optimized SEO keywords to better target specific printing terms (e.g., "imprimir imagem duplicada", "papel de parede") and improve multilingual reach.

### Fixed
- Added robust `try-catch` error handling across all core image processing functions (`generatePages`, `handleImageUpload`) to prevent application crashes during deep processing errors.

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
