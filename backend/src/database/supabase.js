const { createClient } = require('@supabase/supabase-js');
const config = require('../config/config');

if (!config.supabase.url || !config.supabase.key) {
  console.warn('Supabase URL or Key is missing. Check your .env file.');
}

const supabase = createClient(
  config.supabase.url || 'https://placeholder.supabase.co',
  config.supabase.key || 'placeholder-key'
);

module.exports = supabase;
