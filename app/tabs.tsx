import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Keyboard,
  Linking,
  TouchableOpacity,
} from 'react-native';
import {
  Searchbar,
  Text,
  ActivityIndicator,
  Button,
  useTheme,
  Card,
  Chip,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  searchSongsterrTabs,
  getSongsterrGuitarUrl,
  getAvailableInstruments,
  type SongsterrSong,
} from '../src/services/songsterrApi';
import { useTranslation } from '../src/hooks/useTranslation';

export default function TabsScreen() {
  const theme = useTheme();
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SongsterrSong[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    Keyboard.dismiss();
    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const songs = await searchSongsterrTabs(query);
      setResults(songs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const openTab = (song: SongsterrSong) => {
    const url = getSongsterrGuitarUrl(song);
    Linking.openURL(url);
  };

  const renderEmptyState = () => (
    <View style={styles.centerContainer}>
      <Text style={[styles.emptyIcon, { fontSize: 64 }]}>🎸</Text>
      <Text variant="headlineSmall" style={styles.emptyTitle}>
        {t('tabs.findTabs')}
      </Text>
      <Text
        variant="bodyMedium"
        style={[styles.emptySubtitle, { color: theme.colors.onSurfaceVariant }]}
      >
        {t('tabs.emptyHint')}
      </Text>
      <View style={styles.examplesContainer}>
        <Text
          variant="labelMedium"
          style={{ color: theme.colors.onSurfaceVariant, marginBottom: 8 }}
        >
          {t('tabs.trySearchingFor')}
        </Text>
        <Text variant="bodySmall" style={{ color: theme.colors.primary }}>
          "Stairway to Heaven" • "Smells Like Teen Spirit"
        </Text>
      </View>
    </View>
  );

  const renderLoadingState = () => (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text variant="bodyLarge" style={styles.loadingText}>
        {t('tabs.searching')}
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
      <Button mode="contained" onPress={handleSearch} style={styles.retryButton}>
        {t('tabs.tryAgain')}
      </Button>
    </View>
  );

  const renderNoResults = () => (
    <View style={styles.centerContainer}>
      <Text variant="displaySmall" style={styles.emptyIcon}>
        🔍
      </Text>
      <Text variant="bodyLarge" style={styles.emptyTitle}>
        {t('tabs.noResults')}
      </Text>
      <Text
        variant="bodyMedium"
        style={[styles.emptySubtitle, { color: theme.colors.onSurfaceVariant }]}
      >
        {t('tabs.noResultsHint')}
      </Text>
    </View>
  );

  const renderItem = ({ item }: { item: SongsterrSong }) => {
    const instruments = getAvailableInstruments(item);

    return (
      <TouchableOpacity onPress={() => openTab(item)} activeOpacity={0.7}>
        <Card style={styles.card} mode="outlined">
          <Card.Content>
            <Text variant="titleMedium" style={styles.songTitle}>
              {item.title}
            </Text>
            <Text
              variant="bodyMedium"
              style={{ color: theme.colors.onSurfaceVariant }}
            >
              {item.artist}
            </Text>
            <View style={styles.chipContainer}>
              {instruments.map((instrument) => (
                <Chip
                  key={instrument}
                  compact
                  style={styles.chip}
                  textStyle={styles.chipText}
                >
                  {instrument}
                </Chip>
              ))}
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

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
      <FlatList
        data={results}
        keyExtractor={(item) => item.songId.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['bottom']}
    >
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder={t('tabs.searchPlaceholder')}
          onChangeText={setQuery}
          value={query}
          onSubmitEditing={handleSearch}
          loading={isLoading}
          style={styles.searchbar}
          inputStyle={styles.searchInput}
        />
      </View>
      <View style={styles.content}>{renderContent()}</View>
      <View style={styles.attribution}>
        <Text
          variant="bodySmall"
          style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center' }}
        >
          {t('tabs.attribution')}
        </Text>
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
  searchbar: {
    elevation: 2,
  },
  searchInput: {
    minHeight: 0,
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
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
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
  examplesContainer: {
    marginTop: 32,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  loadingText: {
    marginTop: 16,
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
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  card: {
    marginBottom: 12,
  },
  songTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 6,
  },
  chip: {
    height: 24,
  },
  chipText: {
    fontSize: 11,
  },
  attribution: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});
