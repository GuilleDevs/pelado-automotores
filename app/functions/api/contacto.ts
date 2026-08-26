/**
 * POST /api/contacto
 * Valida el token de Turnstile y escribe el lead en Firestore con una service account.
 * El cliente NO puede crear leads directo (ver firestore.rules): si pudiera, cualquiera
 * inundaría la colección aunque el widget estuviera en la página.
 */

interface Env {
  TURNSTILE_SECRET_KEY: string;
  FIREBASE_SERVICE_ACCOUNT: string; // JSON de la service account, en una línea
  FIREBASE_PROJECT_ID: string;
}

interface Cuerpo {
  nombre?: string;
  telefono?: string;
  mensaje?: string;
  vehiculoId?: string | null;
  vehiculoTitulo?: string | null;
  origen?: 'ficha' | 'contacto';
  turnstileToken?: string;
}

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

async function verificarTurnstile(token: string, secret: string, ip: string) {
  const body = new FormData();
  body.append('secret', secret);
  body.append('response', token);
  body.append('remoteip', ip);
  const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body,
  });
  const data = (await r.json()) as { success: boolean };
  return data.success;
}

/** Firma un JWT RS256 con WebCrypto para pedir un access token a Google. */
async function accessToken(sa: { client_email: string; private_key: string }) {
  const ahora = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const claim = {
    iss: sa.client_email,
    scope: 'https://www.googleapis.com/auth/datastore',
    aud: 'https://oauth2.googleapis.com/token',
    exp: ahora + 3600,
    iat: ahora,
  };
  const b64 = (o: unknown) =>
    btoa(JSON.stringify(o)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const sinFirma = `${b64(header)}.${b64(claim)}`;

  const pem = sa.private_key.replace(/\\n/g, '\n');
  const der = Uint8Array.from(
    atob(pem.replace(/-----(BEGIN|END) PRIVATE KEY-----/g, '').replace(/\s/g, '')),
    (c) => c.charCodeAt(0),
  );
  const key = await crypto.subtle.importKey(
    'pkcs8', der, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign'],
  );
  const firma = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(sinFirma),
  );
  const firmaB64 = btoa(String.fromCharCode(...new Uint8Array(firma)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  const r = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${sinFirma}.${firmaB64}`,
    }),
  });
  const data = (await r.json()) as { access_token?: string };
  if (!data.access_token) throw new Error('No pudimos autenticar contra Firestore');
  return data.access_token;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let cuerpo: Cuerpo;
  try {
    cuerpo = await request.json();
  } catch {
    return json({ error: 'Cuerpo inválido' }, 400);
  }

  const nombre = (cuerpo.nombre ?? '').trim();
  const telefono = (cuerpo.telefono ?? '').trim();
  const mensaje = (cuerpo.mensaje ?? '').trim();

  if (!nombre || !telefono || !mensaje) return json({ error: 'Faltan datos obligatorios' }, 400);
  if (nombre.length > 120 || telefono.length > 40 || mensaje.length > 2000) {
    return json({ error: 'El mensaje es demasiado largo' }, 400);
  }

  const ip = request.headers.get('CF-Connecting-IP') ?? '';
  const ok = await verificarTurnstile(cuerpo.turnstileToken ?? '', env.TURNSTILE_SECRET_KEY, ip);
  if (!ok) return json({ error: 'No pudimos verificar que no seas un robot. Probá de nuevo.' }, 403);

  const sa = JSON.parse(env.FIREBASE_SERVICE_ACCOUNT);
  const token = await accessToken(sa);
  const proyecto = env.FIREBASE_PROJECT_ID || sa.project_id;

  const doc = {
    fields: {
      nombre: { stringValue: nombre },
      telefono: { stringValue: telefono },
      mensaje: { stringValue: mensaje },
      vehiculoId: cuerpo.vehiculoId ? { stringValue: cuerpo.vehiculoId } : { nullValue: null },
      vehiculoTitulo: cuerpo.vehiculoTitulo ? { stringValue: cuerpo.vehiculoTitulo } : { nullValue: null },
      origen: { stringValue: cuerpo.origen === 'ficha' ? 'ficha' : 'contacto' },
      leido: { booleanValue: false },
      creadoEn: { timestampValue: new Date().toISOString() },
    },
  };

  const r = await fetch(
    `https://firestore.googleapis.com/v1/projects/${proyecto}/databases/(default)/documents/leads`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(doc),
    },
  );

  if (!r.ok) return json({ error: 'No pudimos guardar la consulta. Escribinos por WhatsApp.' }, 502);
  return json({ ok: true }, 201);
};
