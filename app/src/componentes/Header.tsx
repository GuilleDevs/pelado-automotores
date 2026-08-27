import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { whatsappUrl } from '../lib/formato';
import { WHATSAPP_PRINCIPAL } from '../lib/constantes';

const items = [
  { to: '/', label: 'Inicio' },
  { to: '/catalogo', label: 'Catálogo' },
  { to: '/nosotros', label: 'Nosotros' },
  { to: '/sucursales', label: 'Sucursales' },
];

export default function Header() {
  const [abierto, setAbierto] = useState(false);
  const { pathname } = useLocation();

  // Navegar sin cerrar deja el panel tapando la página nueva.
  useEffect(() => { setAbierto(false); }, [pathname]);

  // Sin esto el panel solo se cierra volviendo a tocar el botón.
  useEffect(() => {
    if (!abierto) return;
    const alTeclear = (e: KeyboardEvent) => { if (e.key === 'Escape') setAbierto(false); };
    window.addEventListener('keydown', alTeclear);
    return () => window.removeEventListener('keydown', alTeclear);
  }, [abierto]);

  return (
    <header className="sticky top-0 z-50 bg-negro border-b-2 border-verde">
      <div className="max-w-[1200px] mx-auto px-5 py-3.5 flex items-center gap-4">
        <Link to="/" className="mr-auto flex flex-col leading-[0.92] no-underline">
          <span className="font-display font-bold italic text-2xl tracking-[-0.01em] text-verde">
            PELADO
          </span>
          <span className="font-sans font-medium text-[11px] tracking-[0.32em] text-blanco">
            AUTOMOTORES
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
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
          className="btn-verde no-underline hidden md:inline-flex"
        >
          WhatsApp
        </a>

        {/* Las tres barras se cruzan en X al abrir, así el botón indica su propio estado. */}
        <button
          type="button"
          onClick={() => setAbierto((v) => !v)}
          aria-label={abierto ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={abierto}
          aria-controls="menu-mobile"
          className="md:hidden flex flex-col justify-center gap-[5px] w-11 h-11 px-2 -mr-2 shrink-0"
        >
          <span
            className={`block h-0.5 w-full bg-blanco transition-transform duration-200 ${
              abierto ? 'translate-y-[7px] rotate-45' : ''
            }`}
          />
          <span
            className={`block h-0.5 w-full bg-blanco transition-opacity duration-200 ${
              abierto ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block h-0.5 w-full bg-blanco transition-transform duration-200 ${
              abierto ? '-translate-y-[7px] -rotate-45' : ''
            }`}
          />
        </button>
      </div>

      {abierto && (
        <nav id="menu-mobile" className="md:hidden border-t border-borde">
          <div className="max-w-[1200px] mx-auto px-5 pt-1 pb-5 flex flex-col">
            {items.map((i) => (
              <NavLink
                key={i.to}
                to={i.to}
                end={i.to === '/'}
                className={({ isActive }) =>
                  `py-3.5 text-sm font-semibold uppercase tracking-[0.14em] no-underline border-b border-borde-suave ${
                    isActive ? 'text-verde' : 'text-blanco'
                  }`
                }
              >
                {i.label}
              </NavLink>
            ))}
            <a
              href={whatsappUrl(WHATSAPP_PRINCIPAL)}
              target="_blank"
              rel="noreferrer"
              className="btn-verde no-underline justify-center mt-5"
            >
              WhatsApp
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
