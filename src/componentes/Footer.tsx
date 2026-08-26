import { Link } from 'react-router-dom';
import { whatsappUrl } from '../lib/formato';
import { INSTAGRAM, INSTAGRAM_USUARIO, TELEFONO_VISIBLE, WHATSAPP_PRINCIPAL } from '../lib/constantes';

export default function Footer() {
  return (
    <footer className="mt-auto border-t-2 border-verde bg-negro">
      <div className="max-w-[1200px] mx-auto px-5 py-10 grid gap-7 [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))]">
        <div className="flex flex-col gap-2">
          <span className="font-display font-bold italic text-2xl text-verde leading-none">PELADO</span>
          <span className="text-[11px] tracking-[0.3em] text-blanco">AUTOMOTORES</span>
          <span className="text-xs text-txt-5 mt-1.5">Valle de Uco · Mendoza · Argentina</span>
        </div>
        <div className="flex flex-col gap-2">
          <span className="label-campo">Sitio</span>
          <Link to="/catalogo" className="text-sm text-txt-2 no-underline hover:text-verde">Catálogo</Link>
          <Link to="/nosotros" className="text-sm text-txt-2 no-underline hover:text-verde">Nosotros</Link>
          <Link to="/sucursales" className="text-sm text-txt-2 no-underline hover:text-verde">Sucursales</Link>
          <Link to="/admin/login" className="text-sm text-txt-5 no-underline hover:text-verde">
            Panel de administración
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          <span className="label-campo">Contacto</span>
          <a href={whatsappUrl(WHATSAPP_PRINCIPAL)} target="_blank" rel="noreferrer" className="text-sm">
            WhatsApp {TELEFONO_VISIBLE}
          </a>
          <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="text-sm">{INSTAGRAM_USUARIO}</a>
        </div>
        <div className="flex flex-col gap-2">
          <span className="label-campo">Legales</span>
          <span className="text-xs text-txt-5 leading-relaxed">
            Precios sujetos a modificación sin previo aviso. Las imágenes son ilustrativas.
            Financiación sujeta a aprobación crediticia.
          </span>
        </div>
      </div>
    </footer>
  );
}
