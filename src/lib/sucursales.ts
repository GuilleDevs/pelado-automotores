import { collection, doc, getDocs, orderBy, query, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { Sucursal } from './tipos';

export async function listarSucursales(): Promise<Sucursal[]> {
  const snap = await getDocs(query(collection(db, 'sucursales'), orderBy('orden')));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Sucursal);
}

export async function actualizarSucursal(id: string, datos: Partial<Sucursal>) {
  await updateDoc(doc(db, 'sucursales', id), datos);
}

export const buscarSucursal = (lista: Sucursal[], id: string) =>
  lista.find((s) => s.id === id);
