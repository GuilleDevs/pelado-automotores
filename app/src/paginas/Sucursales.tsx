import { useState } from 'react';
import Meta from '../componentes/Meta';
import MapaSucursal from '../componentes/MapaSucursal';
import { Campo } from '../componentes/Campo';
import { useCatalogo } from '../lib/useCatalogo';
import { enviarConsulta } from '../lib/leads';
import { whatsappUrl } from '../lib/formato';
import Turnstile from '../componentes/Turnstile';

export default function Sucursales() {
  const { sucursales } = useCatalogo();
  const [form, setForm] = useState({ nombre: '', telefono: '', vehiculo: '', mensaje: '' });
  const [token, setToken] = useState('');
  const [estado, setEstado] = useState<'idle' | 'enviando' | 'ok' | 'error'>('idle');
  const [error, setError] = useState('');

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setEstado('enviando');
    setError('');
    try {
      await enviarConsulta({
        nombre: form.nombre,
        telefono: form.telefono,
        mensaje: form.vehiculo ? `[${form.vehiculo}] ${form.mensaje}` : form.mensaje,
        vehiculoTitulo: form.vehiculo || null,
        origen: 'contacto',
        turnstileToken: token,
      });
      setEstado('ok');
      setForm({ nombre: '', telefono: '', vehiculo: '', mensaje: '' });
    } catch (err) {
      setEstado('error');
      setError(err instanceof Error ? err.message : 'No pudimos enviar la consulta.');
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto px-5 pt-12 pb-16 flex flex-col gap-8">
      <Meta
        titulo="Sucursales y contacto — Pelado Automotores"
        descripcion="Sargento Baigorria 555, La Consulta y Avellaneda 1681, Guaymallén. Teléfonos, horarios y formulario de contacto."
        ruta="/sucursales"
      />
      <header className="flex flex-col gap-3 divisor pb-4.5">
        <span className="kicker">Sucursales y contacto</span>
        <h1 className="titulo text-[clamp(34px,6vw,62px)] m-0">Venite a verlo</h1>
      </header>

      <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
        {sucursales.map((s) => (
          <div
            key={s.id}
            className="border border-borde bg-carta rounded-2xl shadow-carta overflow-hidden flex flex-col"
          >
            <MapaSucursal sucursal={s} />
            <div className="p-5.5 flex flex-col gap-2.5">
              <span className="titulo text-[26px]">{s.nombre}</span>
              <span className="text-sm text-txt-2">{s.direccion}</span>
              <span className="text-[13px] text-txt-4">{s.horarios}</span>
              <a
                href={whatsappUrl(s.whatsapp)}
                target="_blank"
                rel="noreferrer"
                className="btn-verde no-underline"
              >
                Escribir por WhatsApp
              </a>
            </div>
          </div>
        ))}
      </div>

      <form
        onSubmit={enviar}
        className="border border-borde bg-negro-2 rounded-2xl shadow-carta p-7 flex flex-col gap-4.5"
      >
        <h2 className="titulo text-[26px] m-0">Dejanos tu consulta</h2>
        <div className="grid gap-3.5 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
          <Campo label="Nombre">
            <input className="input" required value={form.nombre} onChange={set('nombre')} placeholder="Tu nombre" />
          </Campo>
          <Campo label="Teléfono">
            <input className="input" required type="tel" value={form.telefono} onChange={set('telefono')} placeholder="Tu WhatsApp" />
          </Campo>
          <Campo label="Auto de interés">
            <input className="input" value={form.vehiculo} onChange={set('vehiculo')} placeholder="Modelo y año" />
          </Campo>
        </div>
        <Campo label="Mensaje">
          <textarea
            className="input resize-y"
            rows={4}
            required
            value={form.mensaje}
            onChange={set('mensaje')}
            placeholder="Contanos qué buscás, si tenés auto para permutar, etc."
          />
        </Campo>

        <Turnstile onToken={setToken} />

        <div className="flex items-center gap-4 flex-wrap">
          <button
            type="submit"
            disabled={estado === 'enviando' || !token}
            className="btn-blanco border-0 cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed"
          >
            {estado === 'enviando' ? 'Enviando…' : 'Enviar consulta'}
          </button>
          {estado === 'ok' && <span className="text-verde text-sm">Recibimos tu consulta. Te escribimos a la brevedad.</span>}
          {estado === 'error' && <span className="text-reservado text-sm">{error}</span>}
          {estado === 'idle' && <span className="text-xs text-txt-5">Las consultas llegan al panel de administración.</span>}
        </div>
      </form>
    </div>
  );
}
