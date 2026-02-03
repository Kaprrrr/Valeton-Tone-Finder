import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Linking } from 'react-native';
import { Card, Text, Chip, useTheme, Divider, IconButton, Button } from 'react-native-paper';
import { BlockChip } from './BlockChip';
import type { GP200Preset, EffectCategory } from '../types';
import { EFFECT_COLORS } from '../theme';
import { savePreset, isPresetSaved } from '../services/presetStorage';

interface PresetCardProps {
  preset: GP200Preset;
  confidence: number;
  onPress?: () => void;
  onSaved?: () => void;
  refreshSavedStatus?: number; // Changes trigger refresh of saved status
}

export function PresetCard({ preset, confidence, onPress, onSaved, refreshSavedStatus }: PresetCardProps) {
  const theme = useTheme();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(preset.isUserSaved || false);
  const confidencePercent = Math.round(confidence * 100);
  const { blocks } = preset;

  // Check if preset is still saved when component mounts or refreshSavedStatus changes
  useEffect(() => {
    const checkSavedStatus = async () => {
      const isSaved = await isPresetSaved(preset.id);
      setSaved(isSaved);
    };
    checkSavedStatus();
  }, [preset.id, refreshSavedStatus]);

  const handleViewTabs = () => {
    // Open Songsterr search directly in browser - more reliable than API
    const searchQuery = encodeURIComponent(`${preset.artistName} ${preset.songName}`);
    const url = `https://www.songsterr.com/?pattern=${searchQuery}`;
    Linking.openURL(url);
  };

  const handleSave = async () => {
    if (saved) return;

    setSaving(true);
    try {
      await savePreset(preset);
      setSaved(true);
      onSaved?.();
      Alert.alert('Added to Set List!', `"${preset.songName}" has been added to your Set List.`);
    } catch (error) {
      Alert.alert('Error', 'Failed to save preset. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const renderParamRow = (label: string, value: number | string, unit?: string) => (
    <View style={styles.paramItem}>
      <Text style={[styles.paramLabel, { color: theme.colors.onSurfaceVariant }]}>{label}</Text>
      <Text style={styles.paramValue}>{value}{unit || ''}</Text>
    </View>
  );

  const renderBlockSection = (
    category: EffectCategory,
    title: string,
    model: string,
    params: { label: string; value: number | string; unit?: string }[]
  ) => (
    <View style={styles.blockSection}>
      <View style={styles.blockHeader}>
        <View style={[styles.blockIndicator, { backgroundColor: EFFECT_COLORS[category] }]} />
        <Text style={styles.blockTitle}>{title}: </Text>
        <Text style={styles.blockModel}>{model}</Text>
      </View>
      <View style={styles.paramsRow}>
        {params.map((param, index) => (
          <React.Fragment key={param.label}>
            {renderParamRow(param.label, param.value, param.unit)}
          </React.Fragment>
        ))}
      </View>
    </View>
  );

  return (
    <Card mode="elevated" onPress={onPress} style={styles.card}>
      <Card.Content>
        {/* Header: Song/Artist + Confidence + Save */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text variant="titleMedium" style={styles.songName}>
              {preset.songName}
            </Text>
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.onSurfaceVariant }}
            >
              {preset.artistName}
            </Text>
          </View>
          <View style={styles.headerActions}>
            <Chip compact style={styles.confidenceChip} icon="check-circle">
              {confidencePercent}% Match
            </Chip>
            <IconButton
              icon={saved ? 'bookmark' : 'bookmark-outline'}
              iconColor={saved ? '#FF6B00' : theme.colors.onSurfaceVariant}
              size={24}
              onPress={handleSave}
              disabled={saving}
              loading={saving}
              style={styles.saveButton}
            />
          </View>
        </View>

        {/* Description */}
        <Text
          variant="bodySmall"
          numberOfLines={2}
          style={[styles.description, { color: theme.colors.onSurfaceVariant }]}
        >
          {preset.description}
        </Text>

        <Divider style={styles.divider} />

        {/* AMP Settings */}
        {renderBlockSection('AMP', 'AMP', blocks.amp.model, [
          { label: 'Gain', value: blocks.amp.gain },
          { label: 'Bass', value: blocks.amp.bass },
          { label: 'Mid', value: blocks.amp.mid },
          { label: 'Treble', value: blocks.amp.treble },
          { label: 'Pres', value: blocks.amp.presence },
          { label: 'Master', value: blocks.amp.master },
        ])}

        {/* CAB */}
        <View style={styles.blockSection}>
          <View style={styles.blockHeader}>
            <View style={[styles.blockIndicator, { backgroundColor: EFFECT_COLORS['CAB'] }]} />
            <Text style={styles.blockTitle}>CAB: </Text>
            <Text style={styles.blockModel}>{blocks.cab.model}</Text>
          </View>
        </View>

        {/* PRE Effects */}
        {blocks.pre?.enabled && renderBlockSection('PRE', 'PRE', blocks.pre.model, [
          { label: 'Level', value: blocks.pre.level },
        ])}

        {/* WAH */}
        {blocks.wah?.enabled && renderBlockSection('WAH', 'WAH', blocks.wah.model, [
          { label: 'Position', value: blocks.wah.position },
        ])}

        {/* DST (Distortion) */}
        {blocks.dst?.enabled && renderBlockSection('DST', 'DRIVE', blocks.dst.model, [
          { label: 'Gain', value: blocks.dst.gain },
          { label: 'Tone', value: blocks.dst.tone },
          { label: 'Level', value: blocks.dst.level },
        ])}

        {/* NR (Noise Reduction) */}
        {blocks.nr?.enabled && renderBlockSection('NR', 'GATE', blocks.nr.model, [
          { label: 'Thresh', value: blocks.nr.threshold },
        ])}

        {/* EQ */}
        {blocks.eq?.enabled && renderBlockSection('EQ', 'EQ', blocks.eq.model, [
          { label: 'Level', value: blocks.eq.level },
        ])}

        {/* MOD (Modulation) */}
        {blocks.mod?.enabled && renderBlockSection('MOD', 'MOD', blocks.mod.model, [
          { label: 'Rate', value: blocks.mod.rate },
          { label: 'Depth', value: blocks.mod.depth },
          { label: 'Mix', value: blocks.mod.mix },
        ])}

        {/* DLY (Delay) */}
        {blocks.dly?.enabled && renderBlockSection('DLY', 'DELAY', blocks.dly.model, [
          { label: 'Time', value: blocks.dly.time, unit: 'ms' },
          { label: 'Fdbk', value: blocks.dly.feedback },
          { label: 'Mix', value: blocks.dly.mix },
        ])}

        {/* REV (Reverb) */}
        {blocks.rev?.enabled && renderBlockSection('REV', 'REVERB', blocks.rev.model, [
          { label: 'Decay', value: blocks.rev.decay },
          { label: 'PreDly', value: blocks.rev.predelay },
          { label: 'Mix', value: blocks.rev.mix },
        ])}

        {/* Action Buttons */}
        <View style={styles.buttonRow}>
          <Button
            mode="outlined"
            icon="music-note"
            onPress={handleViewTabs}
            style={styles.actionButton}
            compact
          >
            View Tabs
          </Button>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
  },
  songName: {
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  confidenceChip: {
    backgroundColor: '#FF6B00',
  },
  saveButton: {
    margin: 0,
    marginLeft: 4,
  },
  description: {
    fontStyle: 'italic',
    marginBottom: 12,
  },
  divider: {
    marginBottom: 12,
  },
  blockSection: {
    marginBottom: 10,
  },
  blockHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  blockIndicator: {
    width: 4,
    height: 16,
    borderRadius: 2,
    marginRight: 8,
  },
  blockTitle: {
    fontWeight: 'bold',
    fontSize: 13,
    color: '#999',
  },
  blockModel: {
    fontWeight: 'bold',
    fontSize: 13,
    color: '#FFF',
  },
  paramsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 6,
    padding: 8,
  },
  paramItem: {
    marginRight: 16,
    marginBottom: 2,
    minWidth: 50,
  },
  paramLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
  },
  paramValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF6B00',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    borderColor: '#FF6B00',
  },
});
