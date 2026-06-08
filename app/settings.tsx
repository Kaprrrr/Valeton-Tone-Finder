import React, { useState } from 'react';
import { View, StyleSheet, Linking, Share, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { Button, Text, useTheme, Card, List, Divider, Portal, Dialog, Modal, RadioButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from '../src/hooks/useTranslation';

export default function SettingsScreen() {
  const theme = useTheme();
  const { t, locale, setLanguage, languages } = useTranslation();
  const [clearSetListDialog, setClearSetListDialog] = useState(false);
  const [clearCacheDialog, setClearCacheDialog] = useState(false);
  const [languageDialog, setLanguageDialog] = useState(false);
  const [clearing, setClearing] = useState(false);

  const handleClearSetList = async () => {
    setClearing(true);
    try {
      await AsyncStorage.removeItem('saved_presets');
      setClearSetListDialog(false);
    } catch (error) {
      console.error('Failed to clear set list:', error);
    } finally {
      setClearing(false);
    }
  };

  const handleClearCache = async () => {
    setClearing(true);
    try {
      // Clear any local cache (searches are cached on backend, but clear local storage)
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(k => k.startsWith('cache_'));
      if (cacheKeys.length > 0) {
        await AsyncStorage.multiRemove(cacheKeys);
      }
      setClearCacheDialog(false);
    } catch (error) {
      console.error('Failed to clear cache:', error);
    } finally {
      setClearing(false);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: 'Check out GP Patch Lab - an AI-powered app that helps you recreate any guitar tone on your multi-effects pedal!',
        // url: 'https://apps.apple.com/app/your-app-id', // Add when published
      });
    } catch (error) {
      console.error('Failed to share:', error);
    }
  };

  const handleRateApp = () => {
    // Update these URLs when your app is published
    const iosUrl = 'https://apps.apple.com/app/your-app-id';
    const androidUrl = 'https://play.google.com/store/apps/details?id=com.gppatchlab.app';

    if (Platform.OS === 'ios') {
      Linking.openURL(iosUrl);
    } else if (Platform.OS === 'android') {
      Linking.openURL(androidUrl);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['bottom']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text variant="headlineSmall" style={styles.title}>
          {t('settings.title')}
        </Text>

        {/* Language Selection */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.cardTitle}>
              {t('settings.language')}
            </Text>

            <List.Item
              title={t('settings.selectLanguage')}
              description={languages.find(l => l.code === locale)?.nativeName || 'English'}
              left={props => <List.Icon {...props} icon="translate" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => setLanguageDialog(true)}
              style={styles.listItem}
            />
          </Card.Content>
        </Card>

        {/* Data Management */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.cardTitle}>
              {t('settings.data')}
            </Text>

            <List.Item
              title={t('settings.clearSetList')}
              description={t('settings.clearSetListDesc')}
              left={props => <List.Icon {...props} icon="playlist-remove" />}
              onPress={() => setClearSetListDialog(true)}
              style={styles.listItem}
            />
            <Divider />
            <List.Item
              title={t('settings.clearCache')}
              description={t('settings.clearCacheDesc')}
              left={props => <List.Icon {...props} icon="cached" />}
              onPress={() => setClearCacheDialog(true)}
              style={styles.listItem}
            />
          </Card.Content>
        </Card>

        {/* About Section */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.cardTitle}>
              {t('settings.about')}
            </Text>

            <List.Item
              title={t('settings.version')}
              description="1.0.0"
              left={props => <List.Icon {...props} icon="information" />}
              style={styles.listItem}
            />
            <Divider />
            <List.Item
              title={t('settings.effectsDatabase')}
              description={t('settings.effectsDatabaseDesc')}
              left={props => <List.Icon {...props} icon="database" />}
              style={styles.listItem}
            />
            <Divider />
            <List.Item
              title={t('settings.aiPowered')}
              description={t('settings.aiPoweredDesc')}
              left={props => <List.Icon {...props} icon="robot" />}
              style={styles.listItem}
            />
          </Card.Content>
        </Card>

        {/* Support & Share */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.cardTitle}>
              {t('settings.support')}
            </Text>

            <List.Item
              title={t('settings.rateApp')}
              description={t('settings.rateAppDesc')}
              left={props => <List.Icon {...props} icon="star" />}
              onPress={handleRateApp}
              style={styles.listItem}
            />
            <Divider />
            <List.Item
              title={t('settings.shareWithFriends')}
              description={t('settings.shareWithFriendsDesc')}
              left={props => <List.Icon {...props} icon="share-variant" />}
              onPress={handleShare}
              style={styles.listItem}
            />
            <Divider />
            <List.Item
              title={t('settings.contactSupport')}
              description={t('settings.contactSupportDesc')}
              left={props => <List.Icon {...props} icon="email" />}
              onPress={() => Linking.openURL('mailto:support@yourapp.com')}
              style={styles.listItem}
            />
          </Card.Content>
        </Card>

        {/* Resources */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.cardTitle}>
              {t('settings.resources')}
            </Text>

            <List.Item
              title={t('settings.songsterrTabs')}
              left={props => <List.Icon {...props} icon="open-in-new" />}
              onPress={() => Linking.openURL('https://www.songsterr.com/')}
              style={styles.listItem}
            />
            <Divider />
            <List.Item
              title={t('settings.privacyPolicy')}
              left={props => <List.Icon {...props} icon="shield-account" />}
              onPress={() => Linking.openURL('https://yourapp.com/privacy')}
              style={styles.listItem}
            />
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Clear Set List Dialog */}
      <Portal>
        <Dialog visible={clearSetListDialog} onDismiss={() => setClearSetListDialog(false)}>
          <Dialog.Title>{t('settings.clearSetList')}</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              {t('settings.clearSetListConfirm')}
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setClearSetListDialog(false)}>{t('common.cancel')}</Button>
            <Button
              onPress={handleClearSetList}
              textColor={theme.colors.error}
              loading={clearing}
              disabled={clearing}
            >
              {t('settings.clearAll')}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Clear Cache Dialog */}
      <Portal>
        <Dialog visible={clearCacheDialog} onDismiss={() => setClearCacheDialog(false)}>
          <Dialog.Title>{t('settings.clearCache')}</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              {t('settings.clearCacheConfirm')}
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setClearCacheDialog(false)}>{t('common.cancel')}</Button>
            <Button
              onPress={handleClearCache}
              loading={clearing}
              disabled={clearing}
            >
              {t('settings.clearCache')}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Language Selection Dialog */}
      <Portal>
        <Modal
          visible={languageDialog}
          onDismiss={() => setLanguageDialog(false)}
          contentContainerStyle={[styles.languageModal, { backgroundColor: theme.colors.surface }]}
        >
          <Text variant="titleLarge" style={styles.languageModalTitle}>
            {t('settings.selectLanguage')}
          </Text>
          <ScrollView style={styles.languageList}>
            {languages.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.languageItem,
                  locale === lang.code && { backgroundColor: theme.colors.primaryContainer },
                ]}
                onPress={() => {
                  setLanguage(lang.code);
                  setLanguageDialog(false);
                }}
              >
                <View style={styles.languageItemContent}>
                  <Text style={[
                    styles.languageNative,
                    locale === lang.code && { color: theme.colors.primary, fontWeight: 'bold' },
                  ]}>
                    {lang.nativeName}
                  </Text>
                  <Text style={styles.languageName}>{lang.name}</Text>
                </View>
                {locale === lang.code && (
                  <List.Icon icon="check" color={theme.colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
          <Button onPress={() => setLanguageDialog(false)} style={styles.languageCloseButton}>
            {t('common.cancel')}
          </Button>
        </Modal>
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
  },
  cardTitle: {
    fontWeight: '600',
    marginBottom: 8,
  },
  listItem: {
    paddingVertical: 4,
  },
  languageModal: {
    margin: 20,
    padding: 20,
    borderRadius: 12,
    maxHeight: '70%',
  },
  languageModalTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  languageList: {
    maxHeight: 350,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 8,
    marginBottom: 4,
  },
  languageItemContent: {
    flex: 1,
  },
  languageNative: {
    fontSize: 16,
    marginBottom: 2,
  },
  languageName: {
    fontSize: 13,
    color: '#888',
  },
  languageCloseButton: {
    marginTop: 16,
  },
});
