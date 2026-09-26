import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://hmzuabxykevyvkhteprm.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_-J3z3unUy13XhqcZBUeecw_GH0yjk0h';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);