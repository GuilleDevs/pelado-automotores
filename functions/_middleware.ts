/** Headers de seguridad para todo el sitio. */
export const onRequest: PagesFunction = async ({ next }) => {
  const res = await next();
  const h = new Headers(res.headers);
  h.set('X-Content-Type-Options', 'nosniff');
  h.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  h.set('X-Frame-Options', 'SAMEORIGIN');
  h.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  return new Response(res.body, { status: res.status, headers: h });
};
