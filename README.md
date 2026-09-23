# Mini JS SCSS

[![Version](https://img.shields.io/badge/version-3.96.33-blue)](https://github.com/ninoRepublic/mini-js-scss)
[![VS Code Engine](https://img.shields.io/badge/vscode-%5E1.80.0-007ACC)](https://code.visualstudio.com)
[![License](https://img.shields.io/badge/license-MIT-green)](https://github.com/ninoRepublic/mini-js-scss/blob/main/LICENSE)

**[中文文档](README.zh-CN.md)**

Auto compile SCSS to CSS and minify/obfuscate JavaScript on save, with source map support.

## Features

- **SCSS → CSS** — Compiles `.scss` to `.min.css` with source map on save
- **JS Minify** — Compresses JavaScript, strips `console.log` / `cm.log`, outputs `.min.js` with source map
- **JS Obfuscate** — Right-click menu to encrypt JS files with three intensity levels (Normal / Medium / High)
- **CSS Minify** — Right-click menu to compress CSS files, generating `.min.css` and source map
- **Source Maps** — Generates `.map` files for both CSS and JS debugging
- **Zero Config** — Works immediately after installation; all features are toggleable via settings

## How It Works

When you save a `.scss` or `.js` file, the extension automatically processes it:

```
styles/
  ├── main.scss          ← save this
  ├── main.min.css       ← generated
  └── main.min.css.map   ← generated

scripts/
  ├── app.js             ← save this
  ├── app.min.js         ← generated (minified)
  └── app.min.js.map     ← generated
```

Files ending in `.min.js` are skipped to avoid re-processing. Files inside `node_modules` are always excluded.

### Build Tool Detection

The extension automatically detects if your project uses other build tools. If any of the following build tool configuration files exist in your project root, the automatic SCSS/JS processing will be skipped:

- **Webpack**: `webpack.config.js`, `webpack.config.ts`
- **Vite**: `vite.config.js`, `vite.config.ts`, `vite.config.mjs`
- **Rollup**: `rollup.config.js`, `rollup.config.ts`
- **Parcel**: `.parcelrc`
- **Gulp**: `gulpfile.js`, `gulpfile.ts`
- **Grunt**: `Gruntfile.js`, `Gruntfile.ts`
- **Snowpack**: `snowpack.config.js`, `snowpack.config.mjs`
- **ESBuild**: `esbuild.config.js`, `esbuild.config.ts`

This prevents conflicts with your project's existing build pipeline.

### Right-click Menu: JS Obfuscation

Right-click a `.js` file in the explorer and choose from three intensity levels:

- **🍑JS加密 (Normal)** — Default level with control flow flattening and string array transformation. Best balance of protection and file size.
- **🍑JS加密-中 (Medium)** — Enhanced obfuscation with hex identifiers, base64 string encoding, object key transformation. Stronger protection with moderate size increase.
- **🍑JS加密-高 (High)** — Maximum protection including dead code injection, debug protection, self-defending, and full string array wrappers. Larger output size but strongest defense.

All three modes run Terser compression first, then apply javascript-obfuscator encryption. Output is saved as `.min.js` in the same directory.

### Right-click Menu: CSS Minification

Right-click a `.css` file in the explorer and select **🍑CSS压缩** to compress it:

1. Terser compresses the CSS code
2. Generates `.min.css` file and corresponding `.min.css.map` source map
3. Output is saved as `.min.css` in the same directory

## Extension Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `mini-js-scss.enabled` | `true` | Enable/disable the extension globally |
| `mini-js-scss.scss.enabled` | `true` | Enable/disable SCSS compilation |
| `mini-js-scss.js.enabled` | `true` | Enable/disable JS processing |
| `mini-js-scss.logFunctions` | `["console.log", "cm.log"]` | Function calls to strip during JS compression |

### Config Example

Add custom log functions for removal:

```json
"mini-js-scss.logFunctions": ["console.log", "console.warn", "cm.log", "debug.log"]
```

## Requirements

- VS Code 1.80+
- No external prerequisites — `sass`, `terser`, `javascript-obfuscator` are bundled with the extension.

## Dependencies

| Package | Purpose |
|---------|---------|
| [sass](https://github.com/sass/dart-sass) | SCSS to CSS compilation |
| [terser](https://github.com/terser/terser) | JavaScript minification and debug statement removal |
| [javascript-obfuscator](https://github.com/javascript-obfuscator/javascript-obfuscator) | JavaScript obfuscation |

## Release Notes

### 3.96.33

- Migrated to **esbuild** bundler — VSIX reduced from 13.39 MB (6177 files) to **1.33 MB** (7 files)
- Code bundled into single `dist/extension.js`, external `node_modules` no longer shipped
- Fixed `.vscodeignore` to properly exclude dev dependencies and system files

### 2.96.33

- Added three-tier JS obfuscation: Normal / Medium / High intensity
- Optimized activation events — extension only loads on demand

### 1.0.0

- Initial release: SCSS compilation, JS minification, JS obfuscation, CSS minification
- Source map support for both CSS and JS
- Build tool auto-detection (Webpack, Vite, Rollup, etc.)
- Configurable via VS Code settings

## Known Issues

- Obfuscation is CPU-intensive; very large JS files may cause a brief pause during save.
- The obfuscator runs synchronously after terser completes. This may be made async in a future release.

## License

[MIT](https://github.com/ninoRepublic/mini-js-scss/blob/main/LICENSE)
