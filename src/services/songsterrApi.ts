// Songsterr API service for fetching guitar tabs
import { Platform } from 'react-native';

export interface SongsterrTrack {
  instrumentId: number;
  instrument: string;
  views: number;
  name: string;
  tuning?: number[];
  difficulty?: number;
  hash: string;
}

export interface SongsterrSong {
  songId: number;
  artistId: number;
  artist: string;
  title: string;
  hasChords: boolean;
  hasPlayer: boolean;
  tracks: SongsterrTrack[];
  defaultTrack: number;
  popularTrack: number;
  popularTrackGuitar?: number;
  popularTrackBass?: number;
  popularTrackDrum?: number;
}

const SONGSTERR_API_BASE = 'https://www.songsterr.com/api';

// CORS proxy for web development (not needed on native)
function getApiUrl(endpoint: string): string {
  if (Platform.OS === 'web') {
    // Use corsproxy.io for web - it works for browser requests
    return `https://corsproxy.io/?${encodeURIComponent(endpoint)}`;
  }
  return endpoint;
}

/**
 * Fetch with timeout to prevent hanging
 */
async function fetchWithTimeout(url: string, timeoutMs: number = 10000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

/**
 * Search for songs on Songsterr by pattern (song name, artist, etc.)
 */
export async function searchSongsterrTabs(query: string): Promise<SongsterrSong[]> {
  const encodedQuery = encodeURIComponent(query);
  const endpoint = `${SONGSTERR_API_BASE}/songs?pattern=${encodedQuery}&size=20`;
  const url = getApiUrl(endpoint);

  try {
    const response = await fetchWithTimeout(url, 15000);

    if (!response.ok) {
      throw new Error(`Songsterr API error: ${response.status}`);
    }

    const data = await response.json();
    return data as SongsterrSong[];
  } catch (error: any) {
    console.error('Songsterr search error:', error);
    if (error.name === 'AbortError') {
      throw new Error('Search timed out. Please try again.');
    }
    throw new Error('Failed to search Songsterr. Please try again.');
  }
}

/**
 * Get the Songsterr URL for a specific song
 */
export function getSongsterrUrl(song: SongsterrSong): string {
  // Songsterr URL format: /a/wsa/{artist}-{title}-tab-s{songId}
  const artistSlug = slugify(song.artist);
  const titleSlug = slugify(song.title);
  return `https://www.songsterr.com/a/wsa/${artistSlug}-${titleSlug}-tab-s${song.songId}`;
}

/**
 * Get the Songsterr URL for guitar specifically
 */
export function getSongsterrGuitarUrl(song: SongsterrSong): string {
  return `${getSongsterrUrl(song)}?inst=guitar`;
}

/**
 * Convert a string to URL-friendly slug
 */
function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Get available instruments for a song based on tracks
 */
export function getAvailableInstruments(song: SongsterrSong): string[] {
  const instruments: Set<string> = new Set();

  for (const track of song.tracks) {
    const inst = track.instrument.toLowerCase();
    if (inst.includes('guitar')) {
      instruments.add('Guitar');
    } else if (inst.includes('bass')) {
      instruments.add('Bass');
    } else if (inst.includes('drum')) {
      instruments.add('Drums');
    }
  }

  if (song.hasChords) {
    instruments.add('Chords');
  }

  return Array.from(instruments);
}
