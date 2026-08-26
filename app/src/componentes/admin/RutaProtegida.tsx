import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdmin } from '../../lib/useAdmin';
import Cargando from '../Cargando';

export default function RutaProtegida({ children }: { children: ReactNode }) {
  const { cargando, esAdmin } = useAdmin();
  const { pathname } = useLocation();

  if (cargando) return <Cargando texto="Verificando acceso…" />;
  if (!esAdmin) return <Navigate to="/admin/login" replace state={{ desde: pathname }} />;
  return <>{children}</>;
}
