const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPA_URL;
const supabaseKey = process.env.SUPA_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase