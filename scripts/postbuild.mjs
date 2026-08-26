/**
 * Después del build: genera sitemap.xml y un HTML por vehículo con los meta tags ya
 * resueltos. Sin esto, los previews de WhatsApp e Instagram salen genéricos — y ahí
 * es exactamente donde se comparten los links.
 *
 * Si no hay credenciales de Firestore, emite solo el sitemap de las rutas estáticas
 * y no rompe el build.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const SITIO = process.env.SITIO_URL ?? 'https://peladoautomotores.com.ar';
const DIST = 'dist';
const ESTATICAS = ['/', '/catalogo', '/nosotros', '/sucursales'];

async function vehiculosPublicados() {
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS && !process.env.FIREBASE_SERVICE_ACCOUNT) {
    console.warn('[postbuild] sin credenciales: se omite el prerender por vehículo');
    return [];
  }
  const { initializeApp, applicationDefault, cert } = await import('firebase-admin/app');
  const { getFirestore } = await import('firebase-admin/firestore');
  initializeApp({
    credential: process.env.FIREBASE_SERVICE_ACCOUNT
      ? cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
      : applicationDefault(),
  });
  const snap = await getFirestore().collection('vehiculos').where('publicado', '==', true).get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

const pesos = (n, m = 'ARS') =>
  (m === 'USD' ? 'U$S ' : '$ ') + Math.round(n).toLocaleString('es-AR');

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const vehiculos = await vehiculosPublicados();
const plantilla = await readFile(join(DIST, 'index.html'), 'utf8');

for (const v of vehiculos) {
  const titulo = `${v.marca} ${v.modelo} ${v.anio} — Pelado Automotores`;
  const desc = `${v.marca} ${v.modelo} ${v.anio} · ${v.kilometraje.toLocaleString('es-AR')} km · ${v.combustible} · ${pesos(v.precio, v.moneda)}. Financiación solo con DNI y cuotas fijas en pesos.`;
  const img = [...(v.fotos ?? [])].sort((a, b) => a.orden - b.orden)[0]?.url ?? `${SITIO}/og-default.jpg`;
  const url = `${SITIO}/vehiculo/${v.slug}`;

  const html = plantilla
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(titulo)}</title>`)
    .replace(/<meta name="description"[\s\S]*?\/>/, `<meta name="description" content="${esc(desc)}" />`)
    .replace(
      '</head>',
      `  <meta property="og:title" content="${esc(titulo)}" />
    <meta property="og:description" content="${esc(desc)}" />
    <meta property="og:image" content="${esc(img)}" />
    <meta property="og:url" content="${esc(url)}" />
    <link rel="canonical" href="${esc(url)}" />
  </head>`,
    );

  const dir = join(DIST, 'vehiculo', v.slug);
  if (!existsSync(dir)) await mkdir(dir, { recursive: true });
  await writeFile(join(dir, 'index.html'), html);
}

const urls = [
  ...ESTATICAS.map((r) => ({ loc: SITIO + r, prio: r === '/' ? '1.0' : '0.8' })),
  ...vehiculos.map((v) => ({ loc: `${SITIO}/vehiculo/${v.slug}`, prio: '0.7' })),
];

await writeFile(
  join(DIST, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u.loc}</loc><priority>${u.prio}</priority></url>`).join('\n')}
</urlset>
`,
);

console.log(`[postbuild] ${vehiculos.length} fichas prerenderizadas, sitemap con ${urls.length} URLs`);
