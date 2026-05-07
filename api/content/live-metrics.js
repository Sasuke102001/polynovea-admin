const { supabase, authenticate, response } = require('../middleware');

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('live_metrics')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;
      return res.status(200).json(response(true, data));
    } catch (err) {
      return res.status(500).json(response(false, null, err.message));
    }
  }

  if (!authenticate(req)) {
    return res.status(401).json(response(false, null, 'Unauthorized'));
  }

  if (req.method === 'PUT') {
    try {
      const metrics = Array.isArray(req.body) ? req.body : [req.body];

      const { data, error } = await supabase
        .from('live_metrics')
        .upsert(metrics)
        .select();

      if (error) throw error;
      return res.status(200).json(response(true, data));
    } catch (err) {
      return res.status(400).json(response(false, null, err.message));
    }
  }

  return res.status(405).json(response(false, null, 'Method not allowed'));
}
