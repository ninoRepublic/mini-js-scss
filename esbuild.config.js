const esbuild = require('esbuild');
const path = require('path');

const production = process.argv.includes('--production');

esbuild.build({
  entryPoints: ['src/extension.js'],
  bundle: true,
  platform: 'node',
  target: 'node16',
  outfile: 'dist/extension.js',
  external: ['vscode', 'fs', 'path'],
  minify: production,
  sourcemap: !production,
  treeShaking: true,
}).catch(() => process.exit(1));