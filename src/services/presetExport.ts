// Preset Export Service for GP-200 Hardware
// Generates XML files compatible with Valeton GP-200 Editor

import { Platform } from 'react-native';
import type { GP200Preset, ExportablePreset, ExportModule, ExportParameter } from '../types';
import { getEffectCode } from '../data/effectLookup';

/**
 * Enrich a preset with hardware effect codes from the lookup table
 */
export function enrichPresetWithCodes(preset: GP200Preset): GP200Preset {
  const enrichedBlocks = { ...preset.blocks };

  // Add codes to each block
  if (enrichedBlocks.amp) {
    enrichedBlocks.amp = {
      ...enrichedBlocks.amp,
      code: getEffectCode('AMP', enrichedBlocks.amp.model),
    };
  }

  if (enrichedBlocks.cab) {
    enrichedBlocks.cab = {
      ...enrichedBlocks.cab,
      code: getEffectCode('CAB', enrichedBlocks.cab.model),
    };
  }

  if (enrichedBlocks.pre) {
    enrichedBlocks.pre = {
      ...enrichedBlocks.pre,
      code: getEffectCode('PRE', enrichedBlocks.pre.model),
    };
  }

  if (enrichedBlocks.wah) {
    enrichedBlocks.wah = {
      ...enrichedBlocks.wah,
      code: getEffectCode('WAH', enrichedBlocks.wah.model),
    };
  }

  if (enrichedBlocks.dst) {
    enrichedBlocks.dst = {
      ...enrichedBlocks.dst,
      code: getEffectCode('DST', enrichedBlocks.dst.model),
    };
  }

  if (enrichedBlocks.nr) {
    enrichedBlocks.nr = {
      ...enrichedBlocks.nr,
      code: getEffectCode('NR', enrichedBlocks.nr.model),
    };
  }

  if (enrichedBlocks.eq) {
    enrichedBlocks.eq = {
      ...enrichedBlocks.eq,
      code: getEffectCode('EQ', enrichedBlocks.eq.model),
    };
  }

  if (enrichedBlocks.mod) {
    enrichedBlocks.mod = {
      ...enrichedBlocks.mod,
      code: getEffectCode('MOD', enrichedBlocks.mod.model),
    };
  }

  if (enrichedBlocks.dly) {
    enrichedBlocks.dly = {
      ...enrichedBlocks.dly,
      code: getEffectCode('DLY', enrichedBlocks.dly.model),
    };
  }

  if (enrichedBlocks.rev) {
    enrichedBlocks.rev = {
      ...enrichedBlocks.rev,
      code: getEffectCode('REV', enrichedBlocks.rev.model),
    };
  }

  return {
    ...preset,
    blocks: enrichedBlocks,
  };
}

/**
 * Convert preset blocks to exportable module format
 */
function presetToExportModules(preset: GP200Preset): ExportModule[] {
  const modules: ExportModule[] = [];
  const { blocks } = preset;

  // PRE block
  if (blocks.pre) {
    const code = blocks.pre.code ?? getEffectCode('PRE', blocks.pre.model);
    if (code) {
      modules.push({
        module: 'PRE',
        name: blocks.pre.model,
        code,
        enabled: blocks.pre.enabled,
        parameters: [
          { id: 0, name: 'Level', value: blocks.pre.level },
          ...(blocks.pre.param1 !== undefined ? [{ id: 1, name: 'Param1', value: blocks.pre.param1 }] : []),
          ...(blocks.pre.param2 !== undefined ? [{ id: 2, name: 'Param2', value: blocks.pre.param2 }] : []),
          ...(blocks.pre.param3 !== undefined ? [{ id: 3, name: 'Param3', value: blocks.pre.param3 }] : []),
        ],
      });
    }
  }

  // WAH block
  if (blocks.wah) {
    const code = blocks.wah.code ?? getEffectCode('WAH', blocks.wah.model);
    if (code) {
      modules.push({
        module: 'WAH',
        name: blocks.wah.model,
        code,
        enabled: blocks.wah.enabled,
        parameters: [
          { id: 0, name: 'Position', value: blocks.wah.position },
          ...(blocks.wah.minFreq !== undefined ? [{ id: 1, name: 'Min', value: blocks.wah.minFreq }] : []),
          ...(blocks.wah.maxFreq !== undefined ? [{ id: 2, name: 'Max', value: blocks.wah.maxFreq }] : []),
        ],
      });
    }
  }

  // DST block
  if (blocks.dst) {
    const code = blocks.dst.code ?? getEffectCode('DST', blocks.dst.model);
    if (code) {
      modules.push({
        module: 'DST',
        name: blocks.dst.model,
        code,
        enabled: blocks.dst.enabled,
        parameters: [
          { id: 0, name: 'Level', value: blocks.dst.level },
          { id: 1, name: 'Gain', value: blocks.dst.gain },
          { id: 2, name: 'Tone', value: blocks.dst.tone },
          ...(blocks.dst.bass !== undefined ? [{ id: 3, name: 'Bass', value: blocks.dst.bass }] : []),
          ...(blocks.dst.treble !== undefined ? [{ id: 4, name: 'Treble', value: blocks.dst.treble }] : []),
        ],
      });
    }
  }

  // AMP block (required)
  const ampCode = blocks.amp.code ?? getEffectCode('AMP', blocks.amp.model);
  if (ampCode) {
    modules.push({
      module: 'AMP',
      name: blocks.amp.model,
      code: ampCode,
      enabled: blocks.amp.enabled,
      parameters: [
        { id: 0, name: 'Gain', value: blocks.amp.gain },
        { id: 1, name: 'Bass', value: blocks.amp.bass },
        { id: 2, name: 'Middle', value: blocks.amp.mid },
        { id: 3, name: 'Treble', value: blocks.amp.treble },
        { id: 4, name: 'Presence', value: blocks.amp.presence },
        { id: 5, name: 'Master', value: blocks.amp.master },
        ...(blocks.amp.bright !== undefined ? [{ id: 6, name: 'Bright', value: blocks.amp.bright ? 1 : 0 }] : []),
      ],
    });
  }

  // CAB block (required)
  const cabCode = blocks.cab.code ?? getEffectCode('CAB', blocks.cab.model);
  if (cabCode) {
    const cabParams: ExportParameter[] = [];
    if (blocks.cab.micType) cabParams.push({ id: 0, name: 'Mic', value: 0 }); // Would need mic type mapping
    if (blocks.cab.micPosition !== undefined) cabParams.push({ id: 1, name: 'Position', value: blocks.cab.micPosition });
    if (blocks.cab.lowCut !== undefined) cabParams.push({ id: 2, name: 'LowCut', value: blocks.cab.lowCut });
    if (blocks.cab.highCut !== undefined) cabParams.push({ id: 3, name: 'HighCut', value: blocks.cab.highCut });

    modules.push({
      module: 'CAB',
      name: blocks.cab.model,
      code: cabCode,
      enabled: blocks.cab.enabled,
      parameters: cabParams,
    });
  }

  // NR block
  if (blocks.nr) {
    const code = blocks.nr.code ?? getEffectCode('NR', blocks.nr.model);
    if (code) {
      modules.push({
        module: 'NR',
        name: blocks.nr.model,
        code,
        enabled: blocks.nr.enabled,
        parameters: [
          { id: 0, name: 'Threshold', value: blocks.nr.threshold },
          ...(blocks.nr.decay !== undefined ? [{ id: 1, name: 'Decay', value: blocks.nr.decay }] : []),
        ],
      });
    }
  }

  // EQ block
  if (blocks.eq) {
    const code = blocks.eq.code ?? getEffectCode('EQ', blocks.eq.model);
    if (code) {
      const eqParams: ExportParameter[] = [
        { id: 0, name: 'Level', value: blocks.eq.level },
      ];
      // Add band values
      blocks.eq.bands.forEach((band, index) => {
        eqParams.push({ id: index + 1, name: `Band${index + 1}`, value: band });
      });

      modules.push({
        module: 'EQ',
        name: blocks.eq.model,
        code,
        enabled: blocks.eq.enabled,
        parameters: eqParams,
      });
    }
  }

  // MOD block
  if (blocks.mod) {
    const code = blocks.mod.code ?? getEffectCode('MOD', blocks.mod.model);
    if (code) {
      modules.push({
        module: 'MOD',
        name: blocks.mod.model,
        code,
        enabled: blocks.mod.enabled,
        parameters: [
          { id: 0, name: 'Rate', value: blocks.mod.rate },
          { id: 1, name: 'Depth', value: blocks.mod.depth },
          { id: 2, name: 'Mix', value: blocks.mod.mix },
          ...(blocks.mod.tone !== undefined ? [{ id: 3, name: 'Tone', value: blocks.mod.tone }] : []),
          ...(blocks.mod.predelay !== undefined ? [{ id: 4, name: 'Predelay', value: blocks.mod.predelay }] : []),
        ],
      });
    }
  }

  // DLY block
  if (blocks.dly) {
    const code = blocks.dly.code ?? getEffectCode('DLY', blocks.dly.model);
    if (code) {
      modules.push({
        module: 'DLY',
        name: blocks.dly.model,
        code,
        enabled: blocks.dly.enabled,
        parameters: [
          { id: 0, name: 'Time', value: blocks.dly.time },
          { id: 1, name: 'Feedback', value: blocks.dly.feedback },
          { id: 2, name: 'Mix', value: blocks.dly.mix },
          ...(blocks.dly.tone !== undefined ? [{ id: 3, name: 'Tone', value: blocks.dly.tone }] : []),
          ...(blocks.dly.modRate !== undefined ? [{ id: 4, name: 'ModRate', value: blocks.dly.modRate }] : []),
          ...(blocks.dly.modDepth !== undefined ? [{ id: 5, name: 'ModDepth', value: blocks.dly.modDepth }] : []),
        ],
      });
    }
  }

  // REV block
  if (blocks.rev) {
    const code = blocks.rev.code ?? getEffectCode('REV', blocks.rev.model);
    if (code) {
      modules.push({
        module: 'RVB',
        name: blocks.rev.model,
        code,
        enabled: blocks.rev.enabled,
        parameters: [
          { id: 0, name: 'Decay', value: blocks.rev.decay },
          { id: 1, name: 'Predelay', value: blocks.rev.predelay },
          { id: 2, name: 'Mix', value: blocks.rev.mix },
          ...(blocks.rev.tone !== undefined ? [{ id: 3, name: 'Tone', value: blocks.rev.tone }] : []),
          ...(blocks.rev.damping !== undefined ? [{ id: 4, name: 'Damping', value: blocks.rev.damping }] : []),
        ],
      });
    }
  }

  return modules;
}

/**
 * Escape XML special characters
 */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Generate XML preset file content
 */
export function generatePresetXML(preset: GP200Preset, presetId: number = 0): string {
  const presetName = escapeXml(`${preset.songName} - ${preset.artistName}`);
  const modules = presetToExportModules(preset);

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<PluginProperties>\n';
  xml += '  <Presets>\n';
  xml += '    <Catalog TypeName="User Preset">\n';
  xml += `      <Preset Name="${presetName}" ID="${presetId}" volume="50">\n`;

  for (const module of modules) {
    const switchVal = module.enabled ? 1 : 0;
    xml += `        <Catalog Module="${module.module}" Name="${escapeXml(module.name)}" switch="${switchVal}" code="${module.code}">\n`;

    for (const param of module.parameters) {
      xml += `          <Knob Name="${escapeXml(param.name)}" ID="${param.id}" value="${param.value}"/>\n`;
    }

    xml += '        </Catalog>\n';
  }

  xml += '      </Preset>\n';
  xml += '    </Catalog>\n';
  xml += '  </Presets>\n';
  xml += '</PluginProperties>\n';

  return xml;
}

/**
 * Generate a safe filename for the preset
 */
export function generateFilename(preset: GP200Preset): string {
  const baseName = `${preset.songName} - ${preset.artistName}`
    .replace(/[<>:"/\\|?*]/g, '') // Remove invalid filename chars
    .replace(/\s+/g, ' ')          // Normalize whitespace
    .trim()
    .substring(0, 50);              // Limit length

  return `${baseName}.gp200preset`;
}

/**
 * Export preset to file (Web platform)
 */
async function exportPresetWeb(preset: GP200Preset, filename: string): Promise<void> {
  const xml = generatePresetXML(preset);
  const blob = new Blob([xml], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/**
 * Export preset to file (Mobile platforms)
 * Note: Requires expo-file-system and expo-sharing to be installed
 */
async function exportPresetMobile(preset: GP200Preset, filename: string): Promise<void> {
  // Dynamic imports to avoid errors on web
  try {
    const FileSystemModule = await import('expo-file-system') as any;
    const SharingModule = await import('expo-sharing') as any;

    const xml = generatePresetXML(preset);
    const documentDirectory = FileSystemModule.documentDirectory || FileSystemModule.default?.documentDirectory;
    const fileUri = `${documentDirectory}${filename}`;

    const writeAsStringAsync = FileSystemModule.writeAsStringAsync || FileSystemModule.default?.writeAsStringAsync;
    await writeAsStringAsync(fileUri, xml, {
      encoding: 'utf8',
    });

    const isAvailableAsync = SharingModule.isAvailableAsync || SharingModule.default?.isAvailableAsync;
    const shareAsync = SharingModule.shareAsync || SharingModule.default?.shareAsync;

    const canShare = await isAvailableAsync();
    if (canShare) {
      await shareAsync(fileUri, {
        mimeType: 'application/xml',
        dialogTitle: `Export ${preset.songName}`,
      });
    } else {
      throw new Error('Sharing is not available on this device');
    }
  } catch (error: any) {
    if (error.code === 'MODULE_NOT_FOUND') {
      throw new Error('expo-file-system and expo-sharing packages are required for mobile export');
    }
    throw error;
  }
}

/**
 * Export a preset to a file
 * Automatically chooses the correct method based on platform
 */
export async function exportPreset(preset: GP200Preset, customFilename?: string): Promise<void> {
  const enrichedPreset = enrichPresetWithCodes(preset);
  const filename = customFilename ?? generateFilename(preset);

  if (Platform.OS === 'web') {
    await exportPresetWeb(enrichedPreset, filename);
  } else {
    await exportPresetMobile(enrichedPreset, filename);
  }
}

/**
 * Export multiple presets as a single file or zip
 */
export async function exportMultiplePresets(presets: GP200Preset[]): Promise<void> {
  // For now, export each preset individually
  // Future enhancement: create a zip file or combined preset bank
  for (const preset of presets) {
    await exportPreset(preset);
  }
}

/**
 * Validate that a preset can be exported (has all required codes)
 */
export function canExportPreset(preset: GP200Preset): { valid: boolean; missingEffects: string[] } {
  const missing: string[] = [];
  const { blocks } = preset;

  // Check required blocks
  if (!getEffectCode('AMP', blocks.amp.model)) {
    missing.push(`AMP: ${blocks.amp.model}`);
  }
  if (!getEffectCode('CAB', blocks.cab.model)) {
    missing.push(`CAB: ${blocks.cab.model}`);
  }

  // Check optional blocks
  if (blocks.pre?.enabled && !getEffectCode('PRE', blocks.pre.model)) {
    missing.push(`PRE: ${blocks.pre.model}`);
  }
  if (blocks.wah?.enabled && !getEffectCode('WAH', blocks.wah.model)) {
    missing.push(`WAH: ${blocks.wah.model}`);
  }
  if (blocks.dst?.enabled && !getEffectCode('DST', blocks.dst.model)) {
    missing.push(`DST: ${blocks.dst.model}`);
  }
  if (blocks.nr?.enabled && !getEffectCode('NR', blocks.nr.model)) {
    missing.push(`NR: ${blocks.nr.model}`);
  }
  if (blocks.eq?.enabled && !getEffectCode('EQ', blocks.eq.model)) {
    missing.push(`EQ: ${blocks.eq.model}`);
  }
  if (blocks.mod?.enabled && !getEffectCode('MOD', blocks.mod.model)) {
    missing.push(`MOD: ${blocks.mod.model}`);
  }
  if (blocks.dly?.enabled && !getEffectCode('DLY', blocks.dly.model)) {
    missing.push(`DLY: ${blocks.dly.model}`);
  }
  if (blocks.rev?.enabled && !getEffectCode('REV', blocks.rev.model)) {
    missing.push(`REV: ${blocks.rev.model}`);
  }

  return {
    valid: missing.length === 0,
    missingEffects: missing,
  };
}
