import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, StyleSheet, FlatList, Keyboard } from 'react-native';
import { Searchbar, Text, ActivityIndicator, Button, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { useToneSearch } from '../src/hooks/useToneSearch';
import { PresetCard } from '../src/components/PresetCard';
import { useTranslation } from '../src/hooks/useTranslation';
import type { ToneAnalysisResponse } from '../src/types';

export default function ToneSearchScreen() {
  const theme = useTheme();
  const { t } = useTranslation();
  const [refreshKey, setRefreshKey] = useState(0);
  const searchInputRef = useRef<any>(null);

  // Blur searchbar when keyboard hides so it can be refocused
  useEffect(() => {
    const keyboardHideListener = Keyboard.addListener('keyboardDidHide', () => {
      searchInputRef.current?.blur();
    });
    return () => keyboardHideListener.remove();
  }, []);

  // Refresh saved status when screen gains focus (e.g., returning from Set List)
  useFocusEffect(
    useCallback(() => {
      setRefreshKey(prev => prev + 1);
    }, [])
  );

  const {
    query,
    setQuery,
    results,
    isLoading,
    error,
    hasSearched,
    search,
    clearResults,
  } = useToneSearch();

  const handleSearch = () => {
    Keyboard.dismiss();
    search();
  };

  const renderEmptyState = () => (
    <View style={styles.centerContainer}>
      {/* App Logo */}
      <View style={styles.logoContainer}>
        <Text style={[styles.logoText, { color: theme.colors.primary }]}>GP</Text>
        <Text style={[styles.logoSubtext, { color: theme.colors.onSurfaceVariant }]}>PATCH LAB</Text>
      </View>

      <View style={styles.divider} />

      <Text variant="headlineSmall" style={styles.emptyTitle}>
        {t('toneSearch.searchAnySong')}
      </Text>
      <Text
        variant="bodyMedium"
        style={[styles.emptySubtitle, { color: theme.colors.onSurfaceVariant }]}
      >
        {t('toneSearch.emptyHint')}
      </Text>

      <View style={styles.examplesContainer}>
        <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 8 }}>
          {t('toneSearch.trySearchingFor')}
        </Text>
        <Text variant="bodySmall" style={{ color: theme.colors.primary }}>
          "Sweet Child O' Mine" • "Hotel California" • "Metallica"
        </Text>
      </View>
    </View>
  );

  const renderLoadingState = () => (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text variant="bodyLarge" style={styles.loadingText}>
        {t('toneSearch.searching')} "{query}"
      </Text>
      <Text
        variant="bodySmall"
        style={{ color: theme.colors.onSurfaceVariant }}
      >
        {t('toneSearch.searchingAnalysis')}
      </Text>
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.centerContainer}>
      <Text variant="displaySmall" style={styles.errorIcon}>
        ⚠️
      </Text>
      <Text variant="bodyLarge" style={styles.errorText}>
        {error}
      </Text>
      <Button mode="contained" onPress={search} style={styles.retryButton}>
        {t('toneSearch.tryAgain')}
      </Button>
    </View>
  );

  const renderNoResults = () => (
    <View style={styles.centerContainer}>
      <Text variant="displaySmall" style={styles.emptyIcon}>
        🔍
      </Text>
      <Text variant="bodyLarge" style={styles.emptyTitle}>
        {t('toneSearch.noResults')}
      </Text>
      <Text
        variant="bodyMedium"
        style={[styles.emptySubtitle, { color: theme.colors.onSurfaceVariant }]}
      >
        {t('toneSearch.noResultsHint')}
      </Text>
      <Button mode="outlined" onPress={clearResults} style={styles.retryButton}>
        {t('toneSearch.clearSearch')}
      </Button>
    </View>
  );

  const renderItem = ({ item }: { item: ToneAnalysisResponse }) => (
    <PresetCard
      preset={item.preset}
      confidence={item.confidence}
      refreshSavedStatus={refreshKey}
    />
  );

  const renderContent = () => {
    if (isLoading) {
      return renderLoadingState();
    }

    if (error) {
      return renderErrorState();
    }

    if (!hasSearched) {
      return renderEmptyState();
    }

    if (results.length === 0) {
      return renderNoResults();
    }

    return (
      <>
        <View style={styles.resultsHeader}>
          <Text variant="titleMedium" style={styles.resultsCount}>
            {results.length} {results.length === 1 ? t('toneSearch.resultFound') : t('toneSearch.resultsFound')}
          </Text>
          <Button
            mode="outlined"
            icon="close"
            onPress={clearResults}
            compact
          >
            {t('toneSearch.clear')}
          </Button>
        </View>
        <FlatList
          data={results}
          keyExtractor={(item) => item.preset.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['bottom']}>
      <View style={styles.searchContainer}>
        <View style={styles.searchRow}>
          <Searchbar
            ref={searchInputRef}
            placeholder={t('toneSearch.searchPlaceholder')}
            onChangeText={setQuery}
            value={query}
            onSubmitEditing={handleSearch}
            loading={isLoading}
            style={styles.searchbar}
            inputStyle={styles.searchInput}
          />
          <Button
            mode="contained"
            onPress={handleSearch}
            disabled={isLoading || !query.trim()}
            style={styles.searchButton}
            labelStyle={styles.searchButtonLabel}
          >
            {t('toneSearch.search')}
          </Button>
        </View>
      </View>
      <View style={styles.content}>
        {renderContent()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchbar: {
    flex: 1,
    elevation: 2,
  },
  searchInput: {
    minHeight: 0,
  },
  searchButton: {
    borderRadius: 8,
    backgroundColor: '#FF6B00',
  },
  searchButtonLabel: {
    fontSize: 14,
  },
  content: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoText: {
    fontSize: 42,
    fontWeight: 'bold',
    letterSpacing: 8,
  },
  logoSubtext: {
    fontSize: 12,
    letterSpacing: 4,
    marginTop: 4,
  },
  divider: {
    width: 60,
    height: 2,
    backgroundColor: '#FF6B00',
    marginBottom: 24,
  },
  emptyTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    textAlign: 'center',
    lineHeight: 22,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  examplesContainer: {
    marginTop: 32,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  loadingText: {
    marginTop: 16,
    marginBottom: 4,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorText: {
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    marginTop: 16,
  },
  listContent: {
    paddingBottom: 16,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  resultsCount: {
    color: '#888',
    flex: 1,
  },
  newSearchButton: {
    borderColor: '#FF6B00',
  },
});
