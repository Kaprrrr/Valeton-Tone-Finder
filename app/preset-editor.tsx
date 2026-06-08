import React, { useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert, BackHandler } from 'react-native';
import { Text, Card, Button, useTheme, Divider, ActivityIndicator, Chip } from 'react-native-paper';
import { useLocalSearchParams, router } from 'expo-router';
import { usePresetEditor } from '../src/hooks/usePresetEditor';
import { ParameterSlider } from '../src/components/editor/ParameterSlider';
import { ModuleToggle } from '../src/components/editor/ModuleToggle';
import { AmpSection } from '../src/components/editor/AmpSection';
import { EffectSection } from '../src/components/editor/EffectSection';
import { exportPreset } from '../src/services/presetExport';
import { useTranslation } from '../src/hooks/useTranslation';
import type { EffectCategory, GP200Preset } from '../src/types';

export default function PresetEditorScreen() {
  const theme = useTheme();
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ presetId?: string; preset?: string }>();

  const {
    preset,
    loading,
    error,
    hasUnsavedChanges,
    volume,
    updateAmpModel,
    updateAmpParam,
    updateBlockParam,
    toggleModuleMidi,
    setVolume,
    save,
    reset,
    setPreset,
  } = usePresetEditor(params.presetId);

  // Handle preset passed via params (for unsaved search results)
  useEffect(() => {
    if (params.preset && !params.presetId) {
      try {
        const parsed = JSON.parse(params.preset) as GP200Preset;
        setPreset(parsed);
      } catch (e) {
        console.error('Failed to parse preset from params:', e);
      }
    }
  }, [params.preset, params.presetId, setPreset]);

  // Handle back button with unsaved changes warning
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (hasUnsavedChanges) {
        Alert.alert(
          t('presetEditor.unsavedChanges'),
          t('presetEditor.unsavedChangesMsg'),
          [
            { text: t('presetEditor.stay'), style: 'cancel' },
            { text: t('presetEditor.discard'), style: 'destructive', onPress: () => router.back() },
          ]
        );
        return true;
      }
      return false;
    });
    return () => backHandler.remove();
  }, [hasUnsavedChanges, t]);

  const handleSave = async () => {
    try {
      await save();
      Alert.alert(t('presetEditor.success'), t('presetEditor.savedToSetList'));
    } catch (e) {
      Alert.alert(t('presetEditor.error'), t('presetEditor.failedToSave'));
    }
  };

  const handleExport = async () => {
    if (!preset) return;
    try {
      await exportPreset(preset);
    } catch (e) {
      Alert.alert(t('presetEditor.error'), t('presetEditor.failedToExport'));
    }
  };

  if (loading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ color: theme.colors.onSurface, marginTop: 16 }}>{t('presetEditor.loading')}</Text>
      </View>
    );
  }

  if (error || !preset) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.error }}>{error || t('presetEditor.notFound')}</Text>
        <Button mode="contained" onPress={() => router.back()} style={{ marginTop: 16 }}>
          {t('presetEditor.goBack')}
        </Button>
      </View>
    );
  }

  const { blocks } = preset;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header Info */}
      <Card style={[styles.headerCard, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <View style={styles.headerRow}>
            <View style={styles.headerInfo}>
              <Text style={[styles.songName, { color: theme.colors.onSurface }]}>
                {preset.songName}
              </Text>
              <Text style={[styles.artistName, { color: theme.colors.onSurfaceVariant }]}>
                {preset.artistName}
              </Text>
            </View>
            <View style={styles.headerBadges}>
              {hasUnsavedChanges && (
                <Chip
                  mode="outlined"
                  textStyle={{ fontSize: 11, color: theme.colors.error }}
                  style={{ borderColor: theme.colors.error }}
                >
                  {t('presetEditor.edited')}
                </Chip>
              )}
            </View>
          </View>
        </Card.Content>
      </Card>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* MIDI Controls Section */}
        <Card style={[styles.sectionCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              {t('presetEditor.midiControls')}
            </Text>

            {/* Patch Volume */}
            <ParameterSlider
              label="Patch Volume"
              value={volume}
              midiEnabled={false}
              onChange={setVolume}
            />

            <Divider style={{ marginVertical: 12 }} />

            {/* Module Toggles */}
            <Text style={[styles.subsectionTitle, { color: theme.colors.onSurfaceVariant }]}>
              {t('presetEditor.effectModules')}
            </Text>

            {blocks.pre && (
              <ModuleToggle
                label={t('presetEditor.preEffect')}
                category="PRE"
                enabled={blocks.pre.enabled}
                midiConnected={false}
                onToggle={(enabled) => toggleModuleMidi('PRE', enabled)}
              />
            )}
            {blocks.wah && (
              <ModuleToggle
                label={t('presetEditor.wah')}
                category="WAH"
                enabled={blocks.wah.enabled}
                midiConnected={false}
                onToggle={(enabled) => toggleModuleMidi('WAH', enabled)}
              />
            )}
            {blocks.dst && (
              <ModuleToggle
                label={t('presetEditor.drive')}
                category="DST"
                enabled={blocks.dst.enabled}
                midiConnected={false}
                onToggle={(enabled) => toggleModuleMidi('DST', enabled)}
              />
            )}
            <ModuleToggle
              label={t('presetEditor.amp')}
              category="AMP"
              enabled={blocks.amp.enabled}
              midiConnected={false}
              onToggle={(enabled) => toggleModuleMidi('AMP', enabled)}
            />
            <ModuleToggle
              label={t('presetEditor.cabinet')}
              category="CAB"
              enabled={blocks.cab.enabled}
              midiConnected={false}
              onToggle={(enabled) => toggleModuleMidi('CAB', enabled)}
            />
            {blocks.nr && (
              <ModuleToggle
                label={t('presetEditor.noiseGate')}
                category="NR"
                enabled={blocks.nr.enabled}
                midiConnected={false}
                onToggle={(enabled) => toggleModuleMidi('NR', enabled)}
              />
            )}
            {blocks.eq && (
              <ModuleToggle
                label={t('presetEditor.eq')}
                category="EQ"
                enabled={blocks.eq.enabled}
                midiConnected={false}
                onToggle={(enabled) => toggleModuleMidi('EQ', enabled)}
              />
            )}
            {blocks.mod && (
              <ModuleToggle
                label={t('presetEditor.modulation')}
                category="MOD"
                enabled={blocks.mod.enabled}
                midiConnected={false}
                onToggle={(enabled) => toggleModuleMidi('MOD', enabled)}
              />
            )}
            {blocks.dly && (
              <ModuleToggle
                label={t('presetEditor.delay')}
                category="DLY"
                enabled={blocks.dly.enabled}
                midiConnected={false}
                onToggle={(enabled) => toggleModuleMidi('DLY', enabled)}
              />
            )}
            {blocks.rev && (
              <ModuleToggle
                label={t('presetEditor.reverb')}
                category="REV"
                enabled={blocks.rev.enabled}
                midiConnected={false}
                onToggle={(enabled) => toggleModuleMidi('REV', enabled)}
              />
            )}
          </Card.Content>
        </Card>

        {/* Amp Section */}
        <AmpSection
          amp={blocks.amp}
          onModelChange={updateAmpModel}
          onParamChange={updateAmpParam}
        />

        {/* Effect Sections */}
        {blocks.dst && blocks.dst.enabled && (
          <EffectSection
            category="DST"
            title="Drive"
            block={blocks.dst}
            onParamChange={(param, value) => updateBlockParam('dst', param, value)}
          />
        )}

        {blocks.mod && blocks.mod.enabled && (
          <EffectSection
            category="MOD"
            title="Modulation"
            block={blocks.mod}
            onParamChange={(param, value) => updateBlockParam('mod', param, value)}
          />
        )}

        {blocks.dly && blocks.dly.enabled && (
          <EffectSection
            category="DLY"
            title="Delay"
            block={blocks.dly}
            onParamChange={(param, value) => updateBlockParam('dly', param, value)}
          />
        )}

        {blocks.rev && blocks.rev.enabled && (
          <EffectSection
            category="REV"
            title="Reverb"
            block={blocks.rev}
            onParamChange={(param, value) => updateBlockParam('rev', param, value)}
          />
        )}

        {/* Spacer for bottom buttons */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={[styles.bottomBar, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.outline }]}>
        <Button
          mode="outlined"
          icon="content-save"
          onPress={handleSave}
          style={styles.actionButton}
        >
          {t('presetEditor.save')}
        </Button>
        <Button
          mode="outlined"
          icon="export"
          onPress={handleExport}
          style={styles.actionButton}
        >
          {t('presetEditor.export')}
        </Button>
        {hasUnsavedChanges && (
          <Button
            mode="text"
            icon="undo"
            onPress={reset}
            textColor={theme.colors.error}
          >
            {t('presetEditor.reset')}
          </Button>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  headerCard: {
    margin: 12,
    marginBottom: 0,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerInfo: {
    flex: 1,
  },
  headerBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  songName: {
    fontSize: 18,
    fontWeight: '700',
  },
  artistName: {
    fontSize: 14,
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 12,
  },
  sectionCard: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  subsectionTitle: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 8,
    marginTop: 4,
  },
  bottomBar: {
    flexDirection: 'row',
    padding: 12,
    paddingBottom: 24,
    borderTopWidth: 1,
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
});
