const terser = require('terser');
const JavaScriptObfuscator = require('javascript-obfuscator');
const path = require('path');
const fs = require('fs');

async function processJs(inputPath, options = {}) {
  const absoluteInputPath = path.resolve(inputPath);
  const dir = path.dirname(absoluteInputPath);
  const basename = path.basename(absoluteInputPath, '.js');
  const outputPath = path.join(dir, `${basename}.min.js`);
  const mapPath = `${outputPath}.map`;

  const code = fs.readFileSync(inputPath, 'utf8');

  const terserResult = await terser.minify({ [basename + '.js']: code }, {
    compress: {},
    mangle: true,
    sourceMap: {
      filename: `${basename}.min.js`,
      url: `${basename}.min.js.map`,
      includeSources: true,
    },
  });

  if (terserResult.error) {
    throw terserResult.error;
  }

  const finalCode = terserResult.code;

  if (terserResult.map) {
    fs.writeFileSync(mapPath, terserResult.map);
  }

  fs.writeFileSync(outputPath, finalCode);

  return { outputPath, mapPath: terserResult.map ? mapPath : null };
}

async function obfuscateJs(inputPath, options = {}) {
  const absoluteInputPath = path.resolve(inputPath);
  const dir = path.dirname(absoluteInputPath);
  const basename = path.basename(absoluteInputPath, '.js');
  const outputPath = path.join(dir, `${basename}.min.js`);

  const code = fs.readFileSync(inputPath, 'utf8');
  const pureFuncs = options.pureFuncs || ['console.log', 'cm.log'];

  const terserResult = await terser.minify({ [basename + '.js']: code }, {
    compress: { pure_funcs: pureFuncs },
    mangle: true,
    sourceMap: false,
  });

  if (terserResult.error) {
    throw terserResult.error;
  }

  const obfuscationOptions = {
    compact: true,
    controlFlowFlattening: true,
    stringArray: true,
    sourceMap: false,
  };

  const obfuscationResult = JavaScriptObfuscator.obfuscate(terserResult.code, obfuscationOptions);
  const finalCode = obfuscationResult.getObfuscatedCode();

  fs.writeFileSync(outputPath, finalCode);

  return { outputPath };
}

module.exports = { processJs, obfuscateJs };
