// Script to parse algorithm.xml and generate effectCatalog.json
const fs = require('fs');
const path = require('path');

const xmlPath = path.join(__dirname, '..', 'src', 'data', 'algorithm.xml');
const outputPath = path.join(__dirname, '..', 'src', 'data', 'effectCatalog.json');

const xml = fs.readFileSync(xmlPath, 'utf-8');

const catalog = {};

// Match each Catalog section
const catalogRegex = /<Catalog\s+Name\s*=\s*"([^"]+)">([\s\S]*?)(?=<Catalog|<\/GP-200>)/g;
let catalogMatch;

while ((catalogMatch = catalogRegex.exec(xml)) !== null) {
  const moduleName = catalogMatch[1];
  const catalogContent = catalogMatch[2];

  catalog[moduleName] = [];

  // Match each Alg (effect) within the catalog
  const algRegex = /<Alg\s+([^>]+)>([\s\S]*?)<\/Alg>/g;
  let algMatch;

  while ((algMatch = algRegex.exec(catalogContent)) !== null) {
    const algAttrs = algMatch[1];
    const algContent = algMatch[2];

    // Parse Alg attributes
    const nameMatch = algAttrs.match(/Name\s*=\s*"([^"]+)"/);
    const moduleMatch = algAttrs.match(/Module\s*=\s*"([^"]+)"/);
    const codeMatch = algAttrs.match(/Code\s*=\s*"([^"]+)"/);
    const indexMatch = algAttrs.match(/Index\s*=\s*"([^"]+)"/);
    const cabCodeMatch = algAttrs.match(/CABCode\s*=\s*"([^"]+)"/);

    if (!nameMatch) continue;

    const effect = {
      name: nameMatch[1],
      module: moduleMatch ? moduleMatch[1] : moduleName,
      code: codeMatch ? parseInt(codeMatch[1]) : 0,
      index: indexMatch ? parseInt(indexMatch[1]) : 0,
      params: [],
    };

    if (cabCodeMatch) {
      effect.cabCode = parseInt(cabCodeMatch[1]);
    }

    // Parse Knob parameters
    const knobRegex = /<Knob\s+([^/]+)\/>/g;
    let knobMatch;

    while ((knobMatch = knobRegex.exec(algContent)) !== null) {
      const attrs = knobMatch[1];

      const paramName = attrs.match(/Name\s*=\s*"([^"]+)"/);
      const idx = attrs.match(/idx\s*=\s*"([^"]+)"/);
      const defaultVal = attrs.match(/default\s*=\s*"([^"]+)"/);
      const dmin = attrs.match(/Dmin\s*=\s*"([^"]+)"/);
      const dmax = attrs.match(/Dmax\s*=\s*"([^"]+)"/);
      const step = attrs.match(/step\s*=\s*"([^"]+)"/);
      const suffix = attrs.match(/Suffix\s*=\s*"([^"]+)"/);

      if (paramName && idx) {
        effect.params.push({
          name: paramName[1],
          idx: parseInt(idx[1]),
          type: 'knob',
          default: defaultVal ? parseFloat(defaultVal[1]) : 50,
          min: dmin ? parseFloat(dmin[1]) : 0,
          max: dmax ? parseFloat(dmax[1]) : 100,
          step: step ? parseFloat(step[1]) : 1,
          suffix: suffix ? suffix[1] : undefined,
        });
      }
    }

    // Parse Switch parameters
    const switchRegex = /<Switch\s+([^>]+)>([\s\S]*?)<\/Switch>/g;
    let switchMatch;

    while ((switchMatch = switchRegex.exec(algContent)) !== null) {
      const attrs = switchMatch[1];
      const menuContent = switchMatch[2];

      const paramName = attrs.match(/Name\s*=\s*"([^"]+)"/);
      const idx = attrs.match(/idx\s*=\s*"([^"]+)"/);
      const defaultVal = attrs.match(/default\s*=\s*"([^"]+)"/);

      if (paramName && idx) {
        const options = [];
        const menuRegex = /<Menu\s+Name\s*=\s*"([^"]+)"\s+ID\s*=\s*"([^"]+)"/g;
        let menuMatch;

        while ((menuMatch = menuRegex.exec(menuContent)) !== null) {
          options.push({
            name: menuMatch[1],
            id: parseInt(menuMatch[2]),
          });
        }

        effect.params.push({
          name: paramName[1],
          idx: parseInt(idx[1]),
          type: 'switch',
          default: defaultVal ? parseInt(defaultVal[1]) : 0,
          min: 0,
          max: options.length - 1,
          step: 1,
          options,
        });
      }
    }

    // Parse Combox (combo box) parameters
    const comboxRegex = /<Combox\s+([^>]+)>([\s\S]*?)<\/Combox>/g;
    let comboxMatch;

    while ((comboxMatch = comboxRegex.exec(algContent)) !== null) {
      const attrs = comboxMatch[1];
      const menuContent = comboxMatch[2];

      const paramName = attrs.match(/Name\s*=\s*"([^"]+)"/);
      const idx = attrs.match(/idx\s*=\s*"([^"]+)"/);
      const defaultVal = attrs.match(/default\s*=\s*"([^"]+)"/);

      if (paramName && idx) {
        const options = [];
        const menuRegex = /<Menu\s+Name\s*=\s*"([^"]+)"\s+ID\s*=\s*"([^"]+)"/g;
        let menuMatch;

        while ((menuMatch = menuRegex.exec(menuContent)) !== null) {
          options.push({
            name: menuMatch[1],
            id: parseInt(menuMatch[2]),
          });
        }

        effect.params.push({
          name: paramName[1],
          idx: parseInt(idx[1]),
          type: 'combox',
          default: defaultVal ? parseInt(defaultVal[1]) : 0,
          min: 0,
          max: options.length - 1,
          step: 1,
          options,
        });
      }
    }

    // Sort params by idx
    effect.params.sort((a, b) => a.idx - b.idx);

    catalog[moduleName].push(effect);
  }

  console.log(`Parsed ${catalog[moduleName].length} effects for ${moduleName}`);
}

// Write output
fs.writeFileSync(outputPath, JSON.stringify(catalog, null, 2));
console.log(`\nWritten to ${outputPath}`);

// Print summary
let totalEffects = 0;
let totalParams = 0;
for (const [module, effects] of Object.entries(catalog)) {
  totalEffects += effects.length;
  for (const effect of effects) {
    totalParams += effect.params.length;
  }
}
console.log(`\nTotal: ${totalEffects} effects, ${totalParams} parameters`);
