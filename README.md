# Mini JS SCSS

[![Version](https://img.shields.io/badge/version-1.96.33-blue)](https://github.com/ninoRepublic/mini-js-scss)
[![VS Code Engine](https://img.shields.io/badge/vscode-%5E1.80.0-007ACC)](https://code.visualstudio.com)
[![License](https://img.shields.io/badge/license-MIT-green)](https://github.com/ninoRepublic/mini-js-scss/blob/main/LICENSE)

**[中文文档](README.zh-CN.md)**

Auto compile SCSS to CSS and minify/obfuscate JavaScript on save, with source map support.

## Features

- **SCSS → CSS** — Compiles `.scss` to `.min.css` with source map on save
- **JS Minify** — Compresses JavaScript, strips `console.log` / `cm.log`, outputs `.min.js` with source map
- **JS Obfuscate** — Right-click menu to encrypt JS files with control flow flattening and string array transformation
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

Right-click a `.js` file in the explorer and select **🍑JS加密** to compress and obfuscate it:

1. Terser compresses the code and strips debug statements
2. javascript-obfuscator applies control flow flattening and string array transformation
3. Output is saved as `.min.js` in the same directory

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

### 1.0.1

- Optimized activation events for better VS Code startup performance
- Changed from `"*"` activation to specific events: `onCommand`, `onLanguage:scss`, `onLanguage:javascript`
- Extension now only activates when needed (opening SCSS/JS files or using context menu commands)

### 1.0.0

- SCSS compilation with source maps
- JS minification (via terser) with `console.log` / `cm.log` stripping
- JS obfuscation (via javascript-obfuscator)
- Right-click menu 🍑JS加密 command
- Right-click menu 🍑CSS压缩 command
- Configurable via VS Code settings
- `node_modules` exclusion

## Known Issues

- Obfuscation is CPU-intensive; very large JS files may cause a brief pause during save.
- The obfuscator runs synchronously after terser completes. This may be made async in a future release.

## License

[MIT](https://github.com/ninoRepublic/mini-js-scss/blob/main/LICENSE)
