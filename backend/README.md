# GP Patch Lab Backend

Vercel serverless backend for the GP Patch Lab app with Supabase caching.

## Features

- AI-powered tone recommendations using Google Gemini
- Response caching with Supabase (reduces API costs)
- User preset storage
- Search analytics tracking
- Automatic cache cleanup via cron job

## Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once created, go to **Project Settings > API**
3. Copy the **Project URL** and **service_role key** (not the anon key)

### 3. Set Up Database

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `supabase/migrations/001_initial_schema.sql`
3. Paste and run it in the SQL Editor

### 4. Configure Environment Variables

Create a `.env` file:

```bash
cp .env.example .env
```

Add your credentials:

```env
GEMINI_API_KEY=your_gemini_api_key
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key
```

## Local Development

Run the development server:

```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## API Endpoints

### POST /api/search-tones

Search for presets. Results are cached for 1 week.

**Request:**
```json
{
  "query": "Sweet Child O' Mine by Guns N Roses"
}
```

**Response:**
```json
[
  {
    "preset": {
      "id": "unique-id",
      "name": "GNR Lead Tone",
      "description": "Classic 80s hard rock lead tone",
      "genre": "Hard Rock",
      "settings": { ... }
    },
    "confidence": 0.92,
    "reasoning": "The Marshall Plexi tone is essential for Slash's sound..."
  }
]
```

### GET /api/health

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-27T00:00:00.000Z",
  "version": "1.0.0",
  "apiKeyConfigured": true,
  "cacheEnabled": true
}
```

### GET/POST/PUT/DELETE /api/presets

Manage user-saved presets (requires authentication).

**Headers:**
```
Authorization: Bearer <supabase_jwt_token>
```

**GET** - List all presets for the user
**POST** - Create a new preset
**PUT** - Update an existing preset
**DELETE** - Delete a preset (pass `?id=preset_id`)

### GET /api/cache-cleanup

Manually trigger cache cleanup (also runs daily via cron).

## Deployment to Vercel

### 1. Install Vercel CLI

```bash
npm i -g vercel
```

### 2. Login and Deploy

```bash
vercel login
vercel --prod
```

### 3. Add Environment Variables

In Vercel Dashboard:
1. Go to your project **Settings > Environment Variables**
2. Add the following:
   - `GEMINI_API_KEY` - Your Gemini API key
   - `SUPABASE_URL` - Your Supabase project URL
   - `SUPABASE_SERVICE_KEY` - Your Supabase service role key

### 4. Update Mobile App

In `src/services/toneApi.ts`, replace the API URL:

```typescript
const API_BASE_URL = __DEV__
  ? 'http://localhost:3000'
  : 'https://your-app-name.vercel.app'; // Your Vercel URL
```

## Database Schema

### Tables

| Table | Description |
|-------|-------------|
| `tone_cache` | Cached AI responses (expires after 1 week) |
| `user_presets` | User-saved presets |
| `search_analytics` | Search tracking for analytics |

### Cache Benefits

- Repeated searches return instantly from cache
- Reduces Gemini API costs significantly
- Popular searches stay cached longer (based on hit count)
- Automatic cleanup of expired entries

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key | Yes |
| `SUPABASE_URL` | Supabase project URL | For caching |
| `SUPABASE_SERVICE_KEY` | Supabase service role key | For caching |
| `CRON_SECRET` | Secret for cron job auth | Optional |

## Architecture

```
Mobile App
    │
    ▼
Vercel Serverless Functions
    │
    ├──► Supabase (check cache)
    │         │
    │         ├── Cache hit → Return cached results
    │         │
    │         └── Cache miss → Continue to Gemini
    │
    └──► Google Gemini API
              │
              └── Store results in cache
```
