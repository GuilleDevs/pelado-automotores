import { collection, doc, getDocs, orderBy, query, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { Lead } from './tipos';

export interface NuevoLead {
  nombre: string;
  telefono: string;
  mensaje: string;
  vehiculoId?: string | null;
  vehiculoTitulo?: string | null;
  origen: 'ficha' | 'contacto';
  turnstileToken: string;
}

/**
 * El alta no escribe en Firestore desde el cliente: postea a la Pages Function,
 * que valida el token de Turnstile antes de escribir. Si el cliente pudiera crear
 * leads directo, cualquiera inundaría la colección.
 */
export async function enviarConsulta(datos: NuevoLead): Promise<void> {
  const res = await fetch('/api/contacto', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  });
  if (!res.ok) {
    const { error } = await res.json().catch(() => ({ error: '' }));
    throw new Error(error || 'No pudimos enviar la consulta. Probá por WhatsApp.');
  }
}

export async function listarLeads(): Promise<Lead[]> {
  const snap = await getDocs(query(collection(db, 'leads'), orderBy('creadoEn', 'desc')));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Lead);
}

export async function marcarLeido(id: string) {
  await updateDoc(doc(db, 'leads', id), { leido: true });
}
