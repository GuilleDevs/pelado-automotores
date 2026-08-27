import type { EstadoVehiculo, Vehiculo } from './tipos';

export const pesos = (n: number, moneda: 'ARS' | 'USD' = 'ARS') =>
  (moneda === 'USD' ? 'U\$S ' : '$ ') + Math.round(n).toLocaleString('es-AR');

export const km = (n: number | null | undefined) =>
  n == null ? null : n.toLocaleString('es-AR') + ' km';

/**
 * Une con · solo los datos que existen. Sin esto, un vehículo sin kilometraje
 * se lee "2012 ·  · Nafta", con el separador colgando.
 */
export const ficha = (...partes: Array<string | number | null | undefined>) =>
  partes.filter((p) => p !== null && p !== undefined && p !== '').join(' · ');

export const titulo = (v: Pick<Vehiculo, 'marca' | 'modelo'>) => `${v.marca} ${v.modelo}`;

export const tituloCompleto = (v: Pick<Vehiculo, 'marca' | 'modelo' | 'anio'>) =>
  `${v.marca} ${v.modelo} ${v.anio}`;

export const slugify = (s: string) =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** El slug se genera al crear y no se recalcula al editar: los links ya compartidos siguen sirviendo. */
/** Marcas que van enteras en mayúsculas: el title case las dejaría como "Bmw". */
const SIGLAS = new Set(['BMW', 'VW', 'MG', 'DS', 'JAC', 'GMC', 'RAM', 'BYD']);

/**
 * La marca se agrupa por texto exacto en el filtro, así que "Volkswagen" y
 * "VOLKSWAGEN" aparecían como dos opciones distintas y cada una escondía los autos
 * de la otra. Se normaliza al guardar: sin esto, alcanza con que alguien escriba
 * con otra caja para partir el filtro en dos.
 */
export const normalizarMarca = (s: string) =>
  s.trim().replace(/\s+/g, ' ').split(' ')
    .map((p) => (SIGLAS.has(p.toUpperCase())
      ? p.toUpperCase()
      : p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()))
    .join(' ');

/** El modelo conserva su caja (GL, SRV, XEI son legítimos), pero no espacios de más. */
export const normalizarTexto = (s: string) => s.trim().replace(/\s+/g, ' ');

export const armarSlug = (v: Pick<Vehiculo, 'marca' | 'modelo' | 'anio'>, id: string) =>
  `${slugify(v.marca)}-${slugify(v.modelo)}-${v.anio}-${id.slice(0, 4).toLowerCase()}`;

export const whatsappUrl = (numero: string, texto?: string) =>
  `https://wa.me/${numero}` + (texto ? `?text=${encodeURIComponent(texto)}` : '');

export const mensajeConsulta = (v: Pick<Vehiculo, 'marca' | 'modelo' | 'anio'>) =>
  `Hola, me interesa el ${tituloCompleto(v)}, ¿sigue disponible?`;

export const ETIQUETA_ESTADO: Record<EstadoVehiculo, string> = {
  disponible: 'Disponible', reservado: 'Reservado', vendido: 'Vendido',
};

export const COLOR_ESTADO: Record<EstadoVehiculo, { bg: string; fg: string }> = {
  disponible: { bg: '#46E02D', fg: '#0A0A0A' },
  reservado: { bg: '#FFB01F', fg: '#0A0A0A' },
  vendido: { bg: '#3A3A3A', fg: '#C9C9C9' },
};

export const portada = (v: Vehiculo) =>
  [...(v.fotos ?? [])].sort((a, b) => a.orden - b.orden)[0]?.url ?? '';
