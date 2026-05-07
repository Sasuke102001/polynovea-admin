import { supabase, authenticate, response } from '../middleware.js';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('venue_partnerships')
        .select('*')
        .order('city', { ascending: true });

      if (error) throw error;
      return res.status(200).json(response(true, data));
    } catch (err) {
      return res.status(500).json(response(false, null, err.message));
    }
  }

  if (!authenticate(req)) {
    return res.status(401).json(response(false, null, 'Unauthorized'));
  }

  if (req.method === 'POST') {
    try {
      const { data, error } = await supabase
        .from('venue_partnerships')
        .insert([req.body])
        .select();

      if (error) throw error;
      return res.status(201).json(response(true, data[0]));
    } catch (err) {
      return res.status(400).json(response(false, null, err.message));
    }
  }

  if (req.method === 'PUT') {
    try {
      const { id } = req.query;
      const { data, error } = await supabase
        .from('venue_partnerships')
        .update(req.body)
        .eq('id', id)
        .select();

      if (error) throw error;
      return res.status(200).json(response(true, data[0]));
    } catch (err) {
      return res.status(400).json(response(false, null, err.message));
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      const { error } = await supabase
        .from('venue_partnerships')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return res.status(200).json(response(true, { id }));
    } catch (err) {
      return res.status(400).json(response(false, null, err.message));
    }
  }

  return res.status(405).json(response(false, null, 'Method not allowed'));
}
