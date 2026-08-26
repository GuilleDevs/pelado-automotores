import { useEffect, useState } from 'react';
import LayoutAdmin from '../../componentes/admin/LayoutAdmin';
import Cargando from '../../componentes/Cargando';
import { listarLeads, marcarLeido } from '../../lib/leads';
import { whatsappUrl } from '../../lib/formato';
import type { Lead } from '../../lib/tipos';

const fecha = (l: Lead) =>
  l.creadoEn?.toDate?.().toLocaleString('es-AR', {
    day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit',
  }) ?? '';

/** El teléfono se guarda como lo escribió la persona; para wa.me hay que normalizarlo. */
const paraWhatsapp = (tel: string) => {
  const d = tel.replace(/\D/g, '');
  if (d.startsWith('54')) return d;
  if (d.startsWith('0')) return '549' + d.slice(1);
  return '549' + d;
};

export default function Consultas() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    listarLeads().then(setLeads).finally(() => setCargando(false));
  }, []);

  const leer = async (l: Lead) => {
    if (l.leido) return;
    setLeads((prev) => prev.map((x) => (x.id === l.id ? { ...x, leido: true } : x)));
    await marcarLeido(l.id);
  };

  if (cargando) return <Cargando />;

  return (
    <LayoutAdmin titulo="Consultas" kicker="Bandeja">
      {leads.length === 0 && (
        <p className="border border-borde bg-negro-2 p-10 text-center text-txt-3 text-[15px] m-0">
          Todavía no llegaron consultas por el formulario del sitio.
        </p>
      )}
      <div className="flex flex-col gap-3">
        {leads.map((l) => (
          <article
            key={l.id}
            onMouseEnter={() => leer(l)}
            className={`border p-4.5 flex flex-col gap-2.5 ${
              l.leido ? 'border-borde bg-negro-2' : 'border-verde bg-carta'
            }`}
          >
            <div className="flex justify-between gap-3 flex-wrap items-baseline">
              <span className="titulo text-xl">{l.nombre}</span>
              <span className="text-xs text-txt-4">{fecha(l)}</span>
            </div>
            {l.vehiculoTitulo && (
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-verde">
                Interesado en: {l.vehiculoTitulo}
              </span>
            )}
            <p className="m-0 text-[15px] leading-relaxed text-txt-2">{l.mensaje}</p>
            <div className="flex gap-2.5 flex-wrap items-center">
              <a
                href={whatsappUrl(paraWhatsapp(l.telefono), `Hola ${l.nombre}, te escribo de Pelado Automotores por tu consulta.`)}
                target="_blank"
                rel="noreferrer"
                className="btn-verde no-underline"
              >
                Responder por WhatsApp
              </a>
              <span className="text-sm text-txt-3">{l.telefono}</span>
            </div>
          </article>
        ))}
      </div>
    </LayoutAdmin>
  );
}
