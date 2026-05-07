import { supabase, authenticate, response } from '../../middleware.js';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return res.status(200).json(response(true, data));
    } catch (err) {
      return res.status(404).json(response(false, null, 'Post not found'));
    }
  }

  if (!authenticate(req)) {
    return res.status(401).json(response(false, null, 'Unauthorized'));
  }

  if (req.method === 'PUT') {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
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
      const { error } = await supabase
        .from('blog_posts')
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
