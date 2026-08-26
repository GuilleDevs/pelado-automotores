import type { ReactNode } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { salir } from '../../lib/useAdmin';

const items = [
  { to: '/admin', label: 'Vehículos' },
  { to: '/admin/consultas', label: 'Consultas' },
  { to: '/admin/sucursales', label: 'Sucursales' },
];

interface Props {
  titulo: string;
  kicker?: string;
  acciones?: ReactNode;
  children: ReactNode;
}

export default function LayoutAdmin({ titulo, kicker = 'Panel', acciones, children }: Props) {
  const navegar = useNavigate();

  return (
    <div className="max-w-[1200px] mx-auto px-5 pt-9 pb-16 flex flex-col gap-6">
      <div className="flex items-end justify-between gap-4 flex-wrap divisor pb-4">
        <div className="flex flex-col gap-2">
          <span className="kicker">{kicker}</span>
          <h1 className="titulo text-[clamp(30px,5vw,44px)] m-0">{titulo}</h1>
        </div>
        <div className="flex gap-2.5 flex-wrap items-center">
          {acciones}
          <button
            type="button"
            onClick={async () => { await salir(); navegar('/'); }}
            className="btn border-2 border-borde text-txt-3 bg-transparent cursor-pointer hover:border-verde hover:text-verde"
          >
            Salir
          </button>
        </div>
      </div>

      <nav className="flex gap-1 flex-wrap border-b border-borde-suave pb-2">
        {items.map((i) => (
          <NavLink
            key={i.to}
            to={i.to}
            end
            className={({ isActive }) =>
              `px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] no-underline ${
                isActive ? 'text-verde' : 'text-txt-3 hover:text-blanco'
              }`
            }
          >
            {i.label}
          </NavLink>
        ))}
        <Link
          to="/"
          className="ml-auto px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-txt-5 no-underline hover:text-verde"
        >
          Ver el sitio →
        </Link>
      </nav>

      {children}
    </div>
  );
}
