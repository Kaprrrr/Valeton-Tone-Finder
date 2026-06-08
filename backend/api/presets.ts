import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { PresetData } from '../lib/database.types';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (!isSupabaseConfigured()) {
    return res.status(503).json({ error: 'Database not configured' });
  }

  // Get user from Authorization header (JWT token)
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization required' });
  }

  const token = authHeader.substring(7);

  // Verify the JWT and get user
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);

  if (authError || !user) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  const userId = user.id;

  switch (req.method) {
    case 'GET':
      return handleGetPresets(userId, res);
    case 'POST':
      return handleCreatePreset(userId, req.body, res);
    case 'PUT':
      return handleUpdatePreset(userId, req.body, res);
    case 'DELETE':
      return handleDeletePreset(userId, req.query, res);
    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}

// GET - List all user presets
async function handleGetPresets(userId: string, res: VercelResponse) {
  try {
    const { data, error } = await supabase
      .from('user_presets')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching presets:', error);
      return res.status(500).json({ error: 'Failed to fetch presets' });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// POST - Create a new preset
async function handleCreatePreset(
  userId: string,
  body: { preset_data: PresetData; name: string; notes?: string },
  res: VercelResponse
) {
  const { preset_data, name, notes } = body;

  if (!preset_data || !name) {
    return res.status(400).json({ error: 'preset_data and name are required' });
  }

  try {
    const { data, error } = await supabase
      .from('user_presets')
      .insert({
        user_id: userId,
        preset_data,
        name,
        notes: notes || null,
      } as any)
      .select()
      .single();

    if (error) {
      console.error('Error creating preset:', error);
      return res.status(500).json({ error: 'Failed to create preset' });
    }

    return res.status(201).json(data);
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// PUT - Update an existing preset
async function handleUpdatePreset(
  userId: string,
  body: { id: string; preset_data?: PresetData; name?: string; notes?: string },
  res: VercelResponse
) {
  const { id, preset_data, name, notes } = body;

  if (!id) {
    return res.status(400).json({ error: 'Preset ID is required' });
  }

  const updateData: Record<string, any> = {};
  if (preset_data !== undefined) updateData.preset_data = preset_data;
  if (name !== undefined) updateData.name = name;
  if (notes !== undefined) updateData.notes = notes;

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }

  try {
    const { data, error } = await supabase
      .from('user_presets')
      .update(updateData as any)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating preset:', error);
      return res.status(500).json({ error: 'Failed to update preset' });
    }

    if (!data) {
      return res.status(404).json({ error: 'Preset not found' });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// DELETE - Delete a preset
async function handleDeletePreset(
  userId: string,
  query: Partial<{ [key: string]: string | string[] }>,
  res: VercelResponse
) {
  const id = query.id as string;

  if (!id) {
    return res.status(400).json({ error: 'Preset ID is required' });
  }

  try {
    const { error } = await supabase
      .from('user_presets')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting preset:', error);
      return res.status(500).json({ error: 'Failed to delete preset' });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
