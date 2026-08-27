import {
  addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc, writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';
import { borrarArchivo } from './imagenes';
import type { SlideCarrusel } from './tipos';

const col = collection(db, 'carrusel');

/**
 * A diferencia de vehiculos, acá no hay filtro de publicado: la colección entera es
 * el carrusel. Lo que no se quiere mostrar se borra desde el panel.
 */
export async function listarSlides(): Promise<SlideCarrusel[]> {
  const snap = await getDocs(query(col, orderBy('orden')));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as SlideCarrusel);
}

export async function crearSlide(datos: Omit<SlideCarrusel, 'id'>): Promise<string> {
  const ref = await addDoc(col, datos);
  return ref.id;
}

export async function actualizarSlide(id: string, datos: Partial<SlideCarrusel>) {
  await updateDoc(doc(db, 'carrusel', id), datos);
}

/** Borra el documento y también la imagen: si no, el archivo queda huérfano en Storage. */
export async function borrarSlide(slide: SlideCarrusel) {
  await borrarArchivo(slide.path);
  await deleteDoc(doc(db, 'carrusel', slide.id));
}

/** Reordenar toca todos los slides a la vez; en un batch no queda un orden a medio guardar. */
export async function guardarOrden(slides: SlideCarrusel[]) {
  const batch = writeBatch(db);
  slides.forEach((s, i) => batch.update(doc(db, 'carrusel', s.id), { orden: i }));
  await batch.commit();
}
