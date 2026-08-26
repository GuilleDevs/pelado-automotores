import { useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

export interface EstadoAdmin {
  cargando: boolean;
  user: User | null;
  esAdmin: boolean;
}

/**
 * Autenticar no alcanza: se verifica que exista admins/{uid}. Si no existe se cierra
 * la sesión, para que un usuario creado por error no quede con una sesión a medias.
 */
export function useAdmin(): EstadoAdmin {
  const [estado, setEstado] = useState<EstadoAdmin>({ cargando: true, user: null, esAdmin: false });

  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      if (!user) return setEstado({ cargando: false, user: null, esAdmin: false });
      const snap = await getDoc(doc(db, 'admins', user.uid));
      if (!snap.exists()) {
        await signOut(auth);
        return setEstado({ cargando: false, user: null, esAdmin: false });
      }
      setEstado({ cargando: false, user, esAdmin: true });
    });
  }, []);

  return estado;
}

export async function ingresar(email: string, password: string) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const snap = await getDoc(doc(db, 'admins', cred.user.uid));
  if (!snap.exists()) {
    await signOut(auth);
    throw new Error('Este usuario no tiene acceso al panel.');
  }
}

export const salir = () => signOut(auth);
