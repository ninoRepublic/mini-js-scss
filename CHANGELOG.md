# Change Log

All notable changes to the "mini-js-scss" extension will be documented in this file.

## [3.96.33] - 2026-09-21

- Added "🍑JS加密-中" context menu option with stronger obfuscation than the default setting and a smaller output size than high protection
- Added "🍑JS加密-高" context menu option with the highest complexity obfuscation settings
- High protection enables dead code injection, self-defending, debug protection, split strings, base64 string array encoding, number-to-expressions, object key transformation, and more

## [0.1.0] - 2026-05-15

- Initial release
- SCSS compilation with source maps
- JS minification (via terser) with `console.log` / `cm.log` stripping
- JS obfuscation (via javascript-obfuscator)
- Configurable via VS Code settings
- `node_modules` exclusion
