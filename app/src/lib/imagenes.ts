import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';
import type { Foto } from './tipos';

const LADO_MAX = 1600;
const CALIDAD = 0.82;

/** Redimensiona y comprime en canvas antes de subir: las fotos salen del celular a 4 MB. */
export async function comprimir(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const escala = Math.min(1, LADO_MAX / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * escala);
  const h = Math.round(bitmap.height * escala);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('No se pudo procesar la imagen'))),
      'image/webp',
      CALIDAD,
    );
  });
}

export async function subirFoto(
  vehiculoId: string,
  file: File,
  orden: number,
): Promise<Foto> {
  const blob = await comprimir(file);
  const path = `vehiculos/${vehiculoId}/${Date.now()}-${orden}.webp`;
  const r = ref(storage, path);
  await uploadBytes(r, blob, { contentType: 'image/webp', cacheControl: 'public,max-age=31536000' });
  return { url: await getDownloadURL(r), path, orden };
}

/** Imagen del carrusel del home. Vive fuera de vehiculos/: no pertenece a ninguna ficha. */
export async function subirImagenCarrusel(file: File): Promise<{ url: string; path: string }> {
  const blob = await comprimir(file);
  const path = `carrusel/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`;
  const r = ref(storage, path);
  await uploadBytes(r, blob, { contentType: 'image/webp', cacheControl: 'public,max-age=31536000' });
  return { url: await getDownloadURL(r), path };
}

export async function borrarArchivo(path: string) {
  try {
    await deleteObject(ref(storage, path));
  } catch {
    // Si el objeto ya no existe, seguimos: lo importante es sacarlo del documento.
  }
}

export async function borrarFoto(foto: Foto) {
  await borrarArchivo(foto.path);
}
