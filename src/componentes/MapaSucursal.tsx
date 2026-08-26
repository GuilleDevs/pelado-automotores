import type { Sucursal } from '../lib/tipos';

export default function MapaSucursal({ sucursal, alto = 260 }: { sucursal: Sucursal; alto?: number }) {
  return (
    <iframe
      title={`Mapa de la sucursal ${sucursal.nombre}`}
      src={`https://www.google.com/maps?q=${encodeURIComponent(sucursal.mapaQuery)}&output=embed`}
      loading="lazy"
      className="w-full border-0 mapa-oscuro"
      style={{ height: alto }}
    />
  );
}
