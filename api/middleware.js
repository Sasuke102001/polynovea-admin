import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || 'https://psgxfdzjfcgqvgebpmyl.supabase.co',
  process.env.SUPABASE_API_KEY || 'sb_publishable_aI-mbysg53VphoIILstmVg_Cmtkyv4e'
);

const adminKey = process.env.ADMIN_API_KEY || 'sb_publishable_aI-mbysg53VphoIILstmVg_Cmtkyv4e';

export function authenticate(req) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');
  return token === adminKey;
}

export function response(success, data = null, error = null) {
  return { success, data, error };
}

export { supabase };
