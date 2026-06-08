# GP Patch Lab

A cross-platform mobile app for finding, editing, and managing tones/patches for the **Valeton GP-200** guitar multi-effects processor. Search for AI-recommended tones by song or artist, fine-tune them in a full preset editor, and push patches straight to the pedal over USB MIDI.

> Expo / React Native app · slug `gp-patch-lab` · package `com.gppatchlab.app`

## Features

- **AI tone search** — describe a song, artist, or sound and get recommended GP-200 presets with confidence scores and reasoning (Google Gemini, served via the backend).
- **Preset editor** — edit amps, cabs, and the effect chain with per-parameter controls (`app/preset-editor.tsx`, `src/components/editor/`).
- **USB MIDI control** — connect the GP-200 over USB and send patches directly to the pedal via the custom native module `expo-usb-midi` (`app/pedal-remote.tsx`, `src/services/midiService.ts`).
- **Preset storage & export** — save presets locally and to the cloud, and export/share them (`src/services/presetStorage.ts`, `presetExport.ts`).
- **Setlists** — organize presets for performances (`app/setlist.tsx`).
- **Tab lookup** — Songsterr integration for song tabs (`src/services/songsterrApi.ts`).
- **GP-200 knowledge base** — built-in amp/cab/effect catalogs and official device data (`src/data/`).

## Tech Stack

| Layer | Tech |
|-------|------|
| App | Expo SDK 54, React Native 0.81, React 19, expo-router, React Native Paper |
| Native module | `expo-usb-midi` (Kotlin/Android + Swift/iOS) for USB MIDI to the pedal |
| Backend | Vercel serverless functions, Supabase (caching + preset storage), Google Gemini |
| Storage | `expo-secure-store`, `async-storage` |

## Project Structure

```
app/                     Expo Router screens (index, preset-editor, pedal-remote, setlist, settings, tabs)
src/
  components/            UI components, incl. editor/ (amp, effect, parameter controls)
  services/              toneApi, midiService, presetStorage, presetExport, songsterrApi
  data/                  GP-200 amps, cabs, effects catalogs + official device data
  hooks/                 useMidi, usePresetEditor, useToneSearch
  theme/  types/         Shared theme + TypeScript types
modules/expo-usb-midi/   Custom Expo native module for USB MIDI
backend/                 Vercel + Supabase + Gemini backend (see backend/README.md)
assets/                  Icons, splash
```

## Getting Started

```bash
npm install
npm start          # Expo dev server (then press a / i, or scan the QR)
npm run android    # build & run on Android (dev client)
npm run web        # run in the browser
```

USB MIDI requires a development build (not Expo Go) since it uses a custom native module:

```bash
npm run prebuild:android
npm run android
```

### Backend

The AI tone search and cloud preset storage are powered by the backend in [`backend/`](backend/). It needs `GEMINI_API_KEY`, `SUPABASE_URL`, and `SUPABASE_SERVICE_KEY` — see [`backend/README.md`](backend/README.md) for setup and deployment.

## Building an APK

```bash
build-apk.bat        # or: eas build -p android
```

## Notes

- Secrets are read from environment variables only — no keys are committed. `.env` files, `node_modules`, build output, the Android keystore, and `*.apk` are gitignored.
- Reference material for the GP-200 (manuals, effects list, cab responses) lives separately in the `Valeton-App` repo and is not required to build or run this app.
