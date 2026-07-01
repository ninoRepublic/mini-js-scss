const sass = require('sass');
const terser = require('terser');
const path = require('path');
const fs = require('fs');

function compileScss(inputPath) {
  const absoluteInputPath = path.resolve(inputPath);
  const dir = path.dirname(absoluteInputPath);
  const basename = path.basename(absoluteInputPath, '.scss');
  const outputPath = path.join(dir, `${basename}.min.css`);
  const mapPath = `${outputPath}.map`;

  const result = sass.compile(inputPath, {
    style: 'compressed',
    sourceMap: true,
    sourceMapIncludeSources: true,
  });

  let css = result.css;

  if (result.sourceMap) {
    const map = JSON.parse(JSON.stringify(result.sourceMap));

    if (map.mappings && map.sourcesContent && map.sourcesContent.length > 0) {
      const sourceContent = map.sourcesContent[0];
      const sourceLines = sourceContent.split('\n');

      let firstMapping = true;
      let needAdjust = false;
      let lineOffset = 0;

      const segments = map.mappings.split(';');
      for (const segment of segments) {
        if (!segment) continue;

        const parts = segment.split(',');
        if (parts.length === 0 || !parts[0]) continue;

        const vlqInfo = decodeVLQ(parts[0]);
        if (vlqInfo && vlqInfo.length >= 4) {
          const mapLine = vlqInfo[2];

          if (firstMapping) {
            firstMapping = false;

            let sourceFirstContentLine = -1;
            for (let i = 0; i < sourceLines.length; i++) {
              if (sourceLines[i].trim() !== '') {
                sourceFirstContentLine = i;
                break;
              }
            }

            if (sourceFirstContentLine === 0 && mapLine !== 0) {
              lineOffset = 0 - mapLine;
              needAdjust = true;
            }
          }
        }

        break;
      }

      if (needAdjust && lineOffset !== 0) {
        map.mappings = adjustAllMappingsLineNumbers(map.mappings, lineOffset);
      }
    }

    map.sources = map.sources.map((source) => {
      try {
        const url = new URL(source);
        if (url.protocol === 'file:') {
          source = url.pathname;
        }
      } catch (e) {
        // Ignore URL parsing errors
      }
      try {
        return path.relative(dir, source);
      } catch (e) {
        return source;
      }
    });

    map.file = `${basename}.min.css`;
    delete map.sourceRoot;

    fs.writeFileSync(mapPath, JSON.stringify(map));

    if (!css.endsWith('*/') && !css.includes('sourceMappingURL')) {
      css += `\n/*# sourceMappingURL=${basename}.min.css.map */`;
    }
  }

  fs.writeFileSync(outputPath, css);

  return { outputPath, mapPath };
}

function adjustAllMappingsLineNumbers(mappings, lineOffset) {
  if (!mappings || lineOffset === 0) {
    return mappings;
  }

  const lines = mappings.split(';');

  const adjusted = lines.map(line => {
    if (!line) {
      return line;
    }

    const parts = line.split(',');
    const adjustedParts = parts.map((part, idx) => {
      if (!part) {
        return part;
      }

      const vlqInfo = decodeVLQ(part);
      if (vlqInfo && vlqInfo.length >= 4) {
        const origLine = vlqInfo[2] || 0;
        if (idx === 0) {
          vlqInfo[2] = Math.max(0, origLine + lineOffset);
        }
        return encodeVLQ(vlqInfo);
      }
      return part;
    });

    return adjustedParts.join(',');
  });

  return adjusted.join(';');
}

const BASE64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

function decodeVLQ(str) {
  let result = 0;
  let shift = 0;
  const values = [];

  for (let i = 0; i < str.length; i++) {
    let digit = BASE64_CHARS.indexOf(str[i]);
    if (digit === -1) {
      digit = BASE64_CHARS.indexOf(str[i].toUpperCase());
    }

    if (digit === -1) {
      continue;
    }

    const hasContinuation = (digit & 32) !== 0;
    digit &= 31;

    result |= digit << shift;

    if (!hasContinuation) {
      const isNegative = (result & 1) !== 0;
      result >>= 1;
      values.push(isNegative ? -result : result);
      result = 0;
      shift = 0;
    } else {
      shift += 5;
    }
  }

  return values;
}

function encodeVLQ(values) {
  let result = '';

  for (let i = 0; i < values.length; i++) {
    let value = values[i];
    const isNegative = value < 0;
    value = Math.abs(value);
    value = (value << 1) | (isNegative ? 1 : 0);

    do {
      let digit = value & 31;
      value >>= 5;
      if (value > 0 || i < values.length - 1) {
        digit |= 32;
      }
      result += BASE64_CHARS[digit];
    } while (value > 0);
  }

  return result;
}

async function minifyCss(inputPath) {
  const absoluteInputPath = path.resolve(inputPath);
  const dir = path.dirname(absoluteInputPath);
  const basename = path.basename(absoluteInputPath, '.css');
  const outputPath = path.join(dir, `${basename}.min.css`);
  const mapPath = `${outputPath}.map`;

  const code = fs.readFileSync(inputPath, 'utf8');

  const terserResult = await terser.minify({ [basename + '.css']: code }, {
    compress: {},
    mangle: false,
    sourceMap: {
      filename: `${basename}.min.css`,
      url: `${basename}.min.css.map`,
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

module.exports = { compileScss, minifyCss };
