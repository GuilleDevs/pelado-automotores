import { Link } from 'react-router-dom';
import { ficha, km, pesos, portada, titulo } from '../lib/formato';
import BadgeEstado from './BadgeEstado';
import type { Sucursal, Vehiculo } from '../lib/tipos';

interface Props {
  vehiculo: Vehiculo;
  sucursal?: Sucursal;
  prioridad?: boolean;
}

export default function VehiculoCard({ vehiculo: v, sucursal, prioridad }: Props) {
  const foto = portada(v);
  return (
    <Link
      to={`/vehiculo/${v.slug}`}
      className="group bg-carta border border-borde flex flex-col no-underline transition-[border-color,transform] duration-150 hover:border-verde hover:-translate-y-0.5"
    >
      <div className="relative aspect-[4/3] bg-surface overflow-hidden">
        {foto ? (
          <img
            src={foto}
            alt={`${titulo(v)} ${v.anio} — foto de portada`}
            width={800}
            height={600}
            loading={prioridad ? 'eager' : 'lazy'}
            className={`w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100 ${v.estado === 'vendido' ? 'opacity-50' : ''}`}
          />
        ) : (
          <div className="w-full h-full grid place-items-center text-txt-5 text-xs uppercase tracking-[0.14em]">
            Sin foto
          </div>
        )}
        <div className="absolute top-0 left-0 pointer-events-none">
          <BadgeEstado estado={v.estado} />
        </div>
      </div>
      <div className="p-4 pb-4.5 flex flex-col gap-3 flex-1">
        <div className="flex flex-col gap-1.5">
          <h3 className={`titulo text-[22px] leading-[1.05] m-0 text-pretty ${v.estado === 'vendido' ? 'line-through decoration-2' : ''}`}>
            {titulo(v)}
          </h3>
          <span className="text-xs uppercase tracking-[0.06em] text-txt-3">
            {ficha(v.anio, km(v.kilometraje), v.combustible)}
          </span>
        </div>
        <div className="mt-auto flex flex-col gap-2.5">
          <div className="bg-blanco text-negro px-3 py-2.5 font-display font-bold text-2xl leading-none">
            {pesos(v.precio, v.moneda)}
          </div>
          <div className="flex items-center justify-between gap-2.5">
            <span className="text-[11px] uppercase tracking-[0.1em] text-txt-3">
              {sucursal?.nombre ?? ''}
            </span>
            <span className="bg-verde text-negro font-bold text-[11px] uppercase tracking-[0.12em] px-3.5 py-2.5 group-hover:bg-verde-hover">
              Contactar
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
