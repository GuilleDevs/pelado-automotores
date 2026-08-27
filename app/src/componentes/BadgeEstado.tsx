import { COLOR_ESTADO, ETIQUETA_ESTADO } from '../lib/formato';
import type { EstadoVehiculo } from '../lib/tipos';

export default function BadgeEstado({ estado }: { estado: EstadoVehiculo }) {
  const c = COLOR_ESTADO[estado];
  return (
    <span
      className="inline-block rounded-full text-[10px] font-bold uppercase tracking-[0.14em] px-3 py-2 leading-none"
      style={{ background: c.bg, color: c.fg }}
    >
      {ETIQUETA_ESTADO[estado]}
    </span>
  );
}
