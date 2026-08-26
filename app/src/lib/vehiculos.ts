import {
  collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc,
  query, where, orderBy, limit, serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { armarSlug } from './formato';
import type { Filtros, Vehiculo } from './tipos';

const col = collection(db, 'vehiculos');

const mapear = (d: { id: string; data: () => any }): Vehiculo =>
  ({ id: d.id, ...d.data() }) as Vehiculo;

/**
 * Las reglas de Firestore no filtran queries: una lectura pública que no incluya
 * where('publicado','==',true) falla entera. Ese filtro va siempre.
 */
export async function listarPublicos(): Promise<Vehiculo[]> {
  const snap = await getDocs(query(col, where('publicado', '==', true), orderBy('anio', 'desc')));
  return snap.docs.map(mapear);
}

export async function listarTodos(): Promise<Vehiculo[]> {
  const snap = await getDocs(query(col, orderBy('creadoEn', 'desc')));
  return snap.docs.map(mapear);
}

export async function porSlug(slug: string): Promise<Vehiculo | null> {
  const snap = await getDocs(query(col, where('slug', '==', slug), limit(1)));
  return snap.empty ? null : mapear(snap.docs[0]);
}

export async function porId(id: string): Promise<Vehiculo | null> {
  const d = await getDoc(doc(db, 'vehiculos', id));
  return d.exists() ? mapear(d as any) : null;
}

export async function crear(datos: Omit<Vehiculo, 'id' | 'slug'>): Promise<string> {
  const ref = await addDoc(col, {
    ...datos, slug: 'pendiente',
    creadoEn: serverTimestamp(), actualizadoEn: serverTimestamp(),
  });
  await updateDoc(ref, { slug: armarSlug(datos, ref.id) });
  return ref.id;
}

export async function actualizar(id: string, datos: Partial<Vehiculo>) {
  await updateDoc(doc(db, 'vehiculos', id), { ...datos, actualizadoEn: serverTimestamp() });
}

export async function eliminar(id: string) {
  await deleteDoc(doc(db, 'vehiculos', id));
}

const TRAMOS: Record<string, (p: number) => boolean> = {
  '13000000': (p) => p <= 13_000_000,
  '18000000': (p) => p <= 18_000_000,
  '25000000': (p) => p <= 25_000_000,
  '99000000': (p) => p > 25_000_000,
};

/**
 * Los filtros de baja cardinalidad se aplican en cliente para no multiplicar índices
 * compuestos. Con un inventario de decenas de vehículos es lo correcto; si crece a
 * cientos, mover a índices por filtro.
 */
export function filtrar(lista: Vehiculo[], f: Filtros, mostrarVendidos = false): Vehiculo[] {
  let out = lista.filter((v) => {
    if (!f.estado && v.estado === 'vendido' && !mostrarVendidos) return false;
    if (f.marca && v.marca !== f.marca) return false;
    if (f.sucursalId && v.sucursalId !== f.sucursalId) return false;
    if (f.combustible && v.combustible !== f.combustible) return false;
    if (f.estado && v.estado !== f.estado) return false;
    if (f.anioDesde && v.anio < Number(f.anioDesde)) return false;
    if (f.precioMax && !TRAMOS[f.precioMax]?.(v.precio)) return false;
    return true;
  });
  if (f.orden === 'asc') out = [...out].sort((a, b) => a.precio - b.precio);
  else if (f.orden === 'desc') out = [...out].sort((a, b) => b.precio - a.precio);
  else out = [...out].sort((a, b) => b.anio - a.anio);
  return out;
}

export function relacionados(lista: Vehiculo[], v: Vehiculo, n = 3): Vehiculo[] {
  return lista
    .filter((x) => x.id !== v.id && x.estado !== 'vendido')
    .sort((a, b) => Math.abs(a.precio - v.precio) - Math.abs(b.precio - v.precio))
    .slice(0, n);
}

export const marcasDe = (lista: Vehiculo[]) =>
  [...new Set(lista.map((v) => v.marca))].sort((a, b) => a.localeCompare(b, 'es'));
