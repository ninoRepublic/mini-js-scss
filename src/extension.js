const vscode = require('vscode');
const { compileScss, minifyCss } = require('./scss-processor');
const { processJs, obfuscateJs } = require('./js-processor');
const fs = require('fs');
const path = require('path');

const EXTENSION_NAME = 'mini-js-scss';

const BUILD_TOOL_CONFIGS = [
  'webpack.config.js',
  'webpack.config.ts',
  'vite.config.js',
  'vite.config.ts',
  'vite.config.mjs',
  'rollup.config.js',
  'rollup.config.ts',
  '.parcelrc',
  'gulpfile.js',
  'gulpfile.ts',
  'Gruntfile.js',
  'Gruntfile.ts',
  'snowpack.config.js',
  'snowpack.config.mjs',
  'esbuild.config.js',
  'esbuild.config.ts',
];

function hasBuildTool(rootPath) {
  if (!rootPath) return false;
  
  for (const configFile of BUILD_TOOL_CONFIGS) {
    const configPath = path.join(rootPath, configFile);
    if (fs.existsSync(configPath)) {
      return true;
    }
  }
  
  return false;
}

function activate(context) {
  console.log(`[${EXTENSION_NAME}] ========== Extension ACTIVATING ==========`);
  
  const saveDisposable = vscode.workspace.onDidSaveTextDocument(async (document) => {
    const filePath = document.fileName;
    console.log(`[${EXTENSION_NAME}] File saved: ${filePath}`);

    if (filePath.includes('node_modules')) {
      console.log(`[${EXTENSION_NAME}] Skipping node_modules file`);
      return;
    }

    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders && workspaceFolders.length > 0) {
      const rootPath = workspaceFolders[0].uri.fsPath;
      if (hasBuildTool(rootPath)) {
        console.log(`[${EXTENSION_NAME}] Skipping because other build tool is detected`);
        return;
      }
    }

    const config = vscode.workspace.getConfiguration(EXTENSION_NAME);
    const enabled = config.get('enabled', true);
    console.log(`[${EXTENSION_NAME}] Extension enabled: ${enabled}`);
    
    if (!enabled) {
      return;
    }

    try {
      if (filePath.endsWith('.scss')) {
        console.log(`[${EXTENSION_NAME}] Processing SCSS file`);
        const scssEnabled = config.get('scss.enabled', true);
        if (!scssEnabled) {
          console.log(`[${EXTENSION_NAME}] SCSS processing disabled`);
          return;
        }
        const { outputPath } = compileScss(filePath);
        console.log(`[${EXTENSION_NAME}] SCSS compiled: ${outputPath}`);
      } else if (filePath.endsWith('.js') && !filePath.endsWith('.min.js')) {
        console.log(`[${EXTENSION_NAME}] Processing JS file`);
        const jsEnabled = config.get('js.enabled', true);
        if (!jsEnabled) {
          console.log(`[${EXTENSION_NAME}] JS processing disabled`);
          return;
        }
        const { outputPath } = await processJs(filePath);
        console.log(`[${EXTENSION_NAME}] JS processed: ${outputPath}`);
      } else {
        console.log(`[${EXTENSION_NAME}] Not a SCSS/JS file, skipping`);
      }
    } catch (err) {
      console.error(`[${EXTENSION_NAME}] Error:`, err);
      console.error(`[${EXTENSION_NAME}] Error stack:`, err.stack);
      vscode.window.showErrorMessage(`${EXTENSION_NAME} error: ${err.message}`);
    }
  });

  // 右键菜单：🍑JS加密
  const obfuscateDisposable = vscode.commands.registerCommand('mini-js-scss.obfuscateJs', async (uri) => {
    if (!uri || !uri.fsPath) {
      return;
    }

    const filePath = uri.fsPath;

    if (!filePath.endsWith('.js') || filePath.endsWith('.min.js')) {
      return;
    }

    try {
      const config = vscode.workspace.getConfiguration(EXTENSION_NAME);
      const pureFuncs = config.get('logFunctions', ['console.log', 'cm.log']);
      await obfuscateJs(filePath, { pureFuncs });
    } catch (err) {
      vscode.window.showErrorMessage(`JS加密失败: ${err.message}`);
    }
  });

  // 右键菜单：🍑CSS压缩
  const minifyCssDisposable = vscode.commands.registerCommand('mini-js-scss.minifyCss', async (uri) => {
    if (!uri || !uri.fsPath) {
      return;
    }

    const filePath = uri.fsPath;

    if (!filePath.endsWith('.css') || filePath.endsWith('.min.css')) {
      return;
    }

    try {
      await minifyCss(filePath);
      vscode.window.showInformationMessage('CSS压缩成功');
    } catch (err) {
      vscode.window.showErrorMessage(`CSS压缩失败: ${err.message}`);
    }
  });

  context.subscriptions.push(saveDisposable, obfuscateDisposable, minifyCssDisposable);
  console.log(`[${EXTENSION_NAME}] ========== Extension ACTIVATED ==========`);
}

function deactivate() {
  console.log(`[${EXTENSION_NAME}] Extension deactivated`);
}

module.exports = { activate, deactivate };
