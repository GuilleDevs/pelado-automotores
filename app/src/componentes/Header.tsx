import { Link, NavLink } from 'react-router-dom';
import { whatsappUrl } from '../lib/formato';
import { WHATSAPP_PRINCIPAL } from '../lib/constantes';

const items = [
  { to: '/', label: 'Inicio' },
  { to: '/catalogo', label: 'Catálogo' },
  { to: '/nosotros', label: 'Nosotros' },
  { to: '/sucursales', label: 'Sucursales' },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-negro border-b-2 border-verde">
      <div className="max-w-[1200px] mx-auto px-5 py-3.5 flex items-center gap-4 flex-wrap">
        <Link to="/" className="mr-auto flex flex-col leading-[0.92] no-underline">
          <span className="font-display font-bold italic text-2xl tracking-[-0.01em] text-verde">
            PELADO
          </span>
          <span className="font-sans font-medium text-[11px] tracking-[0.32em] text-blanco">
            AUTOMOTORES
          </span>
        </Link>
        <nav className="flex items-center gap-1 flex-wrap">
          {items.map((i) => (
            <NavLink
              key={i.to}
              to={i.to}
              end={i.to === '/'}
              className={({ isActive }) =>
                `px-3 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] no-underline hover:text-verde ${
                  isActive ? 'text-verde' : 'text-blanco'
                }`
              }
            >
              {i.label}
            </NavLink>
          ))}
        </nav>
        <a
          href={whatsappUrl(WHATSAPP_PRINCIPAL)}
          target="_blank"
          rel="noreferrer"
          className="btn-verde no-underline"
        >
          WhatsApp
        </a>
      </div>
    </header>
  );
}
