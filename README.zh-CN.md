# Mini JS SCSS

[![Version](https://img.shields.io/badge/version-0.9.6-blue)](https://github.com/ninoRepublic/mini-js-scss)
[![VS Code Engine](https://img.shields.io/badge/vscode-%5E1.80.0-007ACC)](https://code.visualstudio.com)
[![License](https://img.shields.io/badge/license-MIT-green)](https://github.com/ninoRepublic/mini-js-scss/blob/main/LICENSE)

**[English](README.md)**

VS Code 扩展：保存时自动编译 SCSS 为 CSS、压缩并混淆 JavaScript，支持 Source Map 调试。

## ✨ 功能特性

- **SCSS → CSS** — 保存 `.scss` 文件时自动编译为 `.min.css`，并生成 Source Map
- **JS 压缩** — 保存 `.js` 文件时自动压缩为 `.min.js`，移除 `console.log` / `cm.log` 等调试语句
- **JS 混淆** — 右键菜单一键加密 JS 文件，支持控制流扁平化和字符串数组化
- **CSS 压缩** — 右键菜单压缩 CSS 文件，生成 `.min.css` 和 Source Map
- **Source Map** — CSS 和 JS 均生成 `.map` 文件，方便浏览器调试定位源码
- **零配置** — 安装即用，所有功能均可通过设置开关控制

## 🚀 工作方式

保存 `.scss` 或 `.js` 文件时，扩展会自动处理：

```
styles/
  ├── main.scss          ← 保存此文件
  ├── main.min.css       ← 自动生成（压缩后的 CSS）
  └── main.min.css.map   ← 自动生成（Source Map）

scripts/
  ├── app.js             ← 保存此文件
  ├── app.min.js         ← 自动生成（压缩后的 JS）
  └── app.min.js.map     ← 自动生成（Source Map）
```

> `.min.js` 文件会被自动跳过，避免重复处理已压缩的文件。`node_modules` 目录下的文件始终被排除。

### 构建工具检测

扩展会自动检测项目是否使用了其他构建工具。如果项目根目录存在以下构建工具配置文件，自动 SCSS/JS 处理将被跳过：

- **Webpack**: `webpack.config.js`, `webpack.config.ts`
- **Vite**: `vite.config.js`, `vite.config.ts`, `vite.config.mjs`
- **Rollup**: `rollup.config.js`, `rollup.config.ts`
- **Parcel**: `.parcelrc`
- **Gulp**: `gulpfile.js`, `gulpfile.ts`
- **Grunt**: `Gruntfile.js`, `Gruntfile.ts`
- **Snowpack**: `snowpack.config.js`, `snowpack.config.mjs`
- **ESBuild**: `esbuild.config.js`, `esbuild.config.ts`

这可以避免与项目现有的构建流程冲突。

### 右键菜单加密 JS

在文件资源管理器中右键点击 `.js` 文件，选择 **🍑JS加密**，即可对文件进行压缩 + 混淆处理：

1. 先通过 Terser 压缩代码并移除调试语句
2. 再通过 javascript-obfuscator 进行控制流扁平化和字符串数组化混淆
3. 输出为同目录下的 `.min.js` 文件

### 右键菜单压缩 CSS

在文件资源管理器中右键点击 `.css` 文件，选择 **🍑CSS压缩**，即可对文件进行压缩处理：

1. 通过 Terser 压缩 CSS 代码
2. 生成 `.min.css` 文件和对应的 `.min.css.map` Source Map
3. 输出为同目录下的 `.min.css` 文件

## ⚙️ 扩展设置

| 设置项 | 默认值 | 说明 |
|--------|--------|------|
| `mini-js-scss.enabled` | `true` | 全局启用/禁用扩展 |
| `mini-js-scss.scss.enabled` | `true` | 启用/禁用 SCSS 编译 |
| `mini-js-scss.js.enabled` | `true` | 启用/禁用 JS 处理 |
| `mini-js-scss.logFunctions` | `["console.log", "cm.log"]` | JS 压缩时需要移除的函数调用列表 |

### 配置示例

添加自定义需要移除的日志函数：

```json
"mini-js-scss.logFunctions": ["console.log", "console.warn", "cm.log", "debug.log"]
```

## 📋 环境要求

- VS Code 1.80 及以上版本
- 无需额外安装依赖 — `sass`、`terser`、`javascript-obfuscator` 均随扩展打包

## 📦 技术依赖

| 依赖 | 用途 |
|------|------|
| [sass](https://github.com/sass/dart-sass) | SCSS 编译为 CSS |
| [terser](https://github.com/terser/terser) | JavaScript 压缩，移除调试语句 |
| [javascript-obfuscator](https://github.com/javascript-obfuscator/javascript-obfuscator) | JavaScript 混淆加密 |

## 📝 更新日志

### 1.0.1

- 优化激活事件，提升 VS Code 启动性能
- 将激活事件从 `"*"` 改为特定事件：`onCommand`、`onLanguage:scss`、`onLanguage:javascript`
- 扩展现在仅在需要时激活（打开 SCSS/JS 文件或使用右键菜单命令）

### 1.0.0

- SCSS 编译，支持 Source Map
- JS 压缩（通过 Terser），支持移除 `console.log` / `cm.log`
- JS 混淆（通过 javascript-obfuscator）
- 右键菜单 🍑JS加密 功能
- 右键菜单 🍑CSS压缩 功能
- 可通过 VS Code 设置灵活配置
- 自动排除 `node_modules` 目录

## ⚠️ 已知问题

- 混淆操作是 CPU 密集型任务，处理大型 JS 文件时可能会有短暂卡顿
- 混淆器在 Terser 完成后同步执行，未来版本可能会改为异步处理

## 📄 许可证

[MIT](https://github.com/ninoRepublic/mini-js-scss/blob/main/LICENSE)
