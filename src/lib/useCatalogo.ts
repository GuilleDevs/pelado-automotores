import { useEffect, useState } from 'react';
import { listarPublicos, marcasDe } from './vehiculos';
import { listarSucursales } from './sucursales';
import type { Sucursal, Vehiculo } from './tipos';

/** Una sola lectura de vehículos publicados + sucursales, reutilizada por home, catálogo y ficha. */
export function useCatalogo() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let vivo = true;
    Promise.all([listarPublicos(), listarSucursales()])
      .then(([v, s]) => { if (vivo) { setVehiculos(v); setSucursales(s); } })
      .catch(() => vivo && setError('No pudimos cargar el catálogo. Recargá la página.'))
      .finally(() => vivo && setCargando(false));
    return () => { vivo = false; };
  }, []);

  return { vehiculos, sucursales, marcas: marcasDe(vehiculos), cargando, error };
}
