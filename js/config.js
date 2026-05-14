
// Configuração central do Supabase
const SUPABASE_URL = 'https://xebpigaoslbzrsdxxyfk.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_ldT1fii5dzt2NZAc3qxYZg_mqw4y4mh';

// Inicializa o cliente Supabase globalmente
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Exporta para uso em outros scripts
window.supabaseClient = _supabase;
