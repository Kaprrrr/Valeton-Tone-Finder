import { useState, useCallback, useRef } from 'react';
import type { ToneAnalysisResponse } from '../types';
import { searchTones } from '../services/toneApi';

interface UseToneSearchResult {
  query: string;
  setQuery: (query: string) => void;
  results: ToneAnalysisResponse[];
  isLoading: boolean;
  error: string | null;
  hasSearched: boolean;
  search: () => Promise<void>;
  clearResults: () => void;
}

export function useToneSearch(): UseToneSearchResult {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ToneAnalysisResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const isSearchingRef = useRef(false);

  const search = useCallback(async () => {
    console.log('Search called, query:', query, 'isSearching:', isSearchingRef.current);

    if (!query.trim() || isSearchingRef.current) {
      console.log('Search blocked - empty query or already searching');
      return;
    }

    isSearchingRef.current = true;
    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    console.log('Making API request for:', query);

    try {
      const response = await searchTones(query);
      console.log('API response received:', response.length, 'results');
      setResults(response);
    } catch (err) {
      console.error('Search error:', err);
      setError(err instanceof Error ? err.message : 'Search failed. Please try again.');
      setResults([]);
    } finally {
      setIsLoading(false);
      isSearchingRef.current = false;
    }
  }, [query]);

  const clearResults = useCallback(() => {
    setResults([]);
    setQuery('');
    setError(null);
    setHasSearched(false);
  }, []);

  return {
    query,
    setQuery,
    results,
    isLoading,
    error,
    hasSearched,
    search,
    clearResults,
  };
}
