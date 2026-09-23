# Mini JS SCSS

[![Version](https://img.shields.io/badge/version-3.96.33-blue)](https://github.com/ninoRepublic/mini-js-scss)
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

在文件资源管理器中右键点击 `.js` 文件，可选择以下加密强度：

- **🍑JS加密**：默认强度，适合追求较小文件体积的场景。
- **🍑JS加密-中**：加强控制流、字符串编码和对象键转换，兼顾防护能力与文件体积。
- **🍑JS加密-高**：最高强度，适合对防护要求极高的场景，生成文件会更大。

三种方式都会进行压缩 + 混淆处理：

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

### 3.96.33

- 迁移至 **esbuild** 打包工具 — VSIX 包从 13.39 MB（6177 个文件）缩减到 **1.33 MB**（7 个文件）
- 代码打包为单一 `dist/extension.js`，不再随扩展分发完整的 `node_modules`
- 修复 `.vscodeignore`，正确排除开发依赖和系统文件

### 2.96.33

- 新增三档 JS 加密强度：普通 / 中 / 高
- 优化激活事件 — 按需加载，提升 VS Code 启动性能

### 1.0.0

- 首次发布：SCSS 编译、JS 压缩、JS 混淆、CSS 压缩
- CSS 和 JS 均支持 Source Map
- 构建工具自动检测（Webpack、Vite、Rollup 等）
- 可通过 VS Code 设置灵活配置

## ⚠️ 已知问题

- 混淆操作是 CPU 密集型任务，处理大型 JS 文件时可能会有短暂卡顿
- 混淆器在 Terser 完成后同步执行，未来版本可能会改为异步处理

## 📄 许可证

[MIT](https://github.com/ninoRepublic/mini-js-scss/blob/main/LICENSE)
