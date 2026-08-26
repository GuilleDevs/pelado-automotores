import { whatsappUrl } from '../lib/formato';
import { WHATSAPP_PRINCIPAL } from '../lib/constantes';

/** Flotante solo en mobile: es de donde llega casi todo el tráfico. */
export default function BotonWhatsApp() {
  return (
    <a
      href={whatsappUrl(WHATSAPP_PRINCIPAL)}
      target="_blank"
      rel="noreferrer"
      aria-label="Escribinos por WhatsApp"
      className="md:hidden fixed bottom-4 right-4 z-50 bg-verde text-negro font-bold text-xs uppercase tracking-[0.12em] px-5 py-4 no-underline hover:bg-verde-hover"
    >
      WhatsApp
    </a>
  );
}
