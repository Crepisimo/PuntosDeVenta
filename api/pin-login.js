// Función de Vercel: únicamente aquí existe la llave privada de Supabase.
// NO incluir SUPABASE_SERVICE_ROLE_KEY en variables VITE_* ni subir .env a GitHub.
import { createHmac } from 'node:crypto';

const GENERIC_ERROR = 'Código o PIN incorrectos, o acceso temporalmente bloqueado. Intenta más tarde.';
const supabaseUrl = process.env.SUPABASE_URL || 'https://ctsijalwjuzmingdxozi.supabase.co';
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function sb(path, body, signal) {
  const r = await fetch(`${supabaseUrl}${path}`, {
    method: 'POST',
    headers: { 'apikey': serviceKey, 'Authorization': `Bearer ${serviceKey}`, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    body: JSON.stringify(body),
    cache:'no-store', signal
  });
  let payload;
  try { payload = await r.json(); } catch { payload = {}; }
  if (!r.ok) throw new Error(`Supabase ${path} HTTP ${r.status}`);
  return payload;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, private, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  if (req.method !== 'POST') return res.status(405).json({error:'Método no permitido'});
  if (!serviceKey || !/^https:\/\//.test(supabaseUrl)) {
    return res.status(503).json({error:'Acceso PIN todavía no configurado en Vercel.'});
  }
  try {
    const raw = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const codigo = String(raw?.codigo ?? '').trim().toLowerCase();
    const pin = String(raw?.pin ?? '');
    if (!/^[a-z0-9][a-z0-9_-]{1,23}$/.test(codigo) || !/^\d{4}$/.test(pin)) {
      return res.status(401).json({error:GENERIC_ERROR});
    }
    // El identificador se guarda con HMAC; nunca se almacena la IP real.
    // x-vercel-forwarded-for es provisto por infraestructura de Vercel.
    const trustedIp = String(req.headers['x-vercel-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
    const origen = createHmac('sha256', serviceKey).update(trustedIp).digest('hex');
    const controller = new AbortController();
    const timer = setTimeout(()=>controller.abort(), 12000);
    try {
      // La validación y los contadores se hacen de forma atómica en PostgreSQL.
      const verify = await sb('/rest/v1/rpc/app_pin_verificar', {p_codigo:codigo,p_pin:pin,p_origen:origen}, controller.signal);
      const result = Array.isArray(verify) ? verify[0] : verify;
      if (result?.ok !== true || !result.correo) return res.status(401).json({error:GENERIC_ERROR});
      // Genera un token temporal para la cuenta del empleado SIN enviar correo.
      const generated = await sb('/auth/v1/admin/generate_link', {type:'magiclink',email:result.correo}, controller.signal);
      const tokenHash = generated?.properties?.hashed_token || generated?.hashed_token;
      if (!tokenHash) throw new Error('No se recibió el token de acceso de Supabase');
      // Canjea el token en el servidor: ningún token de servicio llega al navegador.
      const session = await sb('/auth/v1/verify', {type:'magiclink',token_hash:tokenHash}, controller.signal);
      if (!session?.access_token || !session?.refresh_token) throw new Error('Supabase no devolvió sesión');
      return res.status(200).json({access_token:session.access_token,refresh_token:session.refresh_token,expires_in:session.expires_in,token_type:session.token_type||'bearer'});
    } finally {clearTimeout(timer);}
  } catch (err) {
    console.error('PIN auth failed:', err?.message || 'unknown');
    return res.status(503).json({error:'No se pudo iniciar sesión por PIN. Si continúa, avisa al administrador.'});
  }
}
