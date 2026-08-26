import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LayoutAdmin from '../../componentes/admin/LayoutAdmin';
import DropzoneFotos from '../../componentes/admin/DropzoneFotos';
import Cargando from '../../componentes/Cargando';
import { Campo } from '../../componentes/Campo';
import ChecksCondiciones from '../../componentes/ChecksCondiciones';
import { actualizar, crear, porId } from '../../lib/vehiculos';
import { listarSucursales } from '../../lib/sucursales';
import { km, pesos, titulo } from '../../lib/formato';
import { COMBUSTIBLES, ESTADOS, TRANSMISIONES } from '../../lib/constantes';
import { VEHICULO_NUEVO, type Foto, type Sucursal, type Vehiculo } from '../../lib/tipos';

type Borrador = Omit<Vehiculo, 'id' | 'slug' | 'creadoEn' | 'actualizadoEn'>;

const CONDICIONES: Array<[keyof Borrador['condiciones'], string]> = [
  ['financiacionDni', 'Financiación solo con DNI'],
  ['cuotasFijas', 'Cuotas fijas y en pesos'],
  ['permuta', 'Recibimos permuta'],
];

export default function VehiculoEditar() {
  const { id } = useParams();
  const esNuevo = !id;
  const navegar = useNavigate();
  const [datos, setDatos] = useState<Borrador>(VEHICULO_NUEVO);
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [cargando, setCargando] = useState(!esNuevo);
  const [guardando, setGuardando] = useState(false);
  const [previa, setPrevia] = useState(false);
  const [idFotos, setIdFotos] = useState(id ?? `temp-${Date.now()}`);

  useEffect(() => {
    listarSucursales().then((s) => {
      setSucursales(s);
      setDatos((d) => (d.sucursalId ? d : { ...d, sucursalId: s[0]?.id ?? '' }));
    });
  }, []);

  useEffect(() => {
    if (!id) return;
    porId(id)
      .then((v) => { if (v) { const { id: _, slug: __, ...resto } = v; setDatos(resto as Borrador); setIdFotos(v.id); } })
      .finally(() => setCargando(false));
  }, [id]);

  // Borrador local: en el playón la conexión se corta y no queremos perder la carga.
  useEffect(() => {
    if (!esNuevo) return;
    const guardado = localStorage.getItem('pa:borrador');
    if (guardado) { try { setDatos(JSON.parse(guardado)); } catch { /* borrador ilegible */ } }
  }, [esNuevo]);

  useEffect(() => {
    if (esNuevo) localStorage.setItem('pa:borrador', JSON.stringify(datos));
  }, [datos, esNuevo]);

  const set = <K extends keyof Borrador>(k: K, v: Borrador[K]) => setDatos((d) => ({ ...d, [k]: v }));

  const guardar = async (publicado: boolean) => {
    setGuardando(true);
    try {
      if (esNuevo) {
        await crear({ ...datos, publicado } as Omit<Vehiculo, 'id' | 'slug'>);
        localStorage.removeItem('pa:borrador');
      } else {
        await actualizar(id!, { ...datos, publicado });
      }
      navegar('/admin');
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) return <Cargando texto="Cargando vehículo…" />;

  return (
    <LayoutAdmin
      kicker={esNuevo ? 'Alta' : 'Edición'}
      titulo={esNuevo ? 'Cargar vehículo' : titulo(datos)}
    >
      <DropzoneFotos
        vehiculoId={idFotos}
        fotos={datos.fotos}
        onChange={(fotos: Foto[]) => set('fotos', fotos)}
      />

      <div className="grid gap-3.5 [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))]">
        <Campo label="Marca">
          <input className="input" value={datos.marca} onChange={(e) => set('marca', e.target.value)} placeholder="Ford" />
        </Campo>
        <Campo label="Modelo">
          <input className="input" value={datos.modelo} onChange={(e) => set('modelo', e.target.value)} placeholder="Fiesta Kinetic Titanium" />
        </Campo>
        <Campo label="Año">
          <input className="input" type="number" value={datos.anio} onChange={(e) => set('anio', Number(e.target.value))} />
        </Campo>
        <Campo label="Precio">
          <input className="input" type="number" value={datos.precio} onChange={(e) => set('precio', Number(e.target.value))} />
        </Campo>
        <Campo label="Moneda">
          <select className="input" value={datos.moneda} onChange={(e) => set('moneda', e.target.value as Borrador['moneda'])}>
            <option value="ARS">Pesos (ARS)</option>
            <option value="USD">Dólares (USD)</option>
          </select>
        </Campo>
        <Campo label="Motor">
          <input className="input" value={datos.motor} onChange={(e) => set('motor', e.target.value)} placeholder="1.6" />
        </Campo>
        <Campo label="Kilometraje">
          <input className="input" type="number" value={datos.kilometraje} onChange={(e) => set('kilometraje', Number(e.target.value))} />
        </Campo>
        <Campo label="Combustible">
          <select className="input" value={datos.combustible} onChange={(e) => set('combustible', e.target.value as Borrador['combustible'])}>
            {COMBUSTIBLES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Campo>
        <Campo label="Transmisión">
          <select className="input" value={datos.transmision} onChange={(e) => set('transmision', e.target.value as Borrador['transmision'])}>
            {TRANSMISIONES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </Campo>
        <Campo label="Color">
          <input className="input" value={datos.color} onChange={(e) => set('color', e.target.value)} placeholder="Gris" />
        </Campo>
        <Campo label="Sucursal">
          <select className="input" value={datos.sucursalId} onChange={(e) => set('sucursalId', e.target.value)}>
            {sucursales.map((s) => <option key={s.id} value={s.id}>{s.nombre}</option>)}
          </select>
        </Campo>
        <Campo label="Estado">
          <select className="input" value={datos.estado} onChange={(e) => set('estado', e.target.value as Borrador['estado'])}>
            {ESTADOS.map((e) => <option key={e.value} value={e.value}>{e.label}</option>)}
          </select>
        </Campo>
      </div>

      <Campo label="Descripción">
        <textarea
          className="input resize-y"
          rows={4}
          value={datos.descripcion}
          onChange={(e) => set('descripcion', e.target.value)}
          placeholder="Cubiertas nuevas. GNC de 5ta generación. Service al día."
        />
      </Campo>

      <fieldset className="border border-borde bg-negro-2 p-5 flex flex-col gap-3 m-0">
        <legend className="label-campo px-1">Condiciones que se muestran en la ficha</legend>
        {CONDICIONES.map(([k, label]) => (
          <label key={k} className="flex gap-2.5 items-center text-[15px] cursor-pointer">
            <input
              type="checkbox"
              checked={datos.condiciones[k]}
              onChange={(e) => set('condiciones', { ...datos.condiciones, [k]: e.target.checked })}
              className="w-[18px] h-[18px] accent-verde"
            />
            {label}
          </label>
        ))}
      </fieldset>

      <div className="flex gap-2.5 flex-wrap items-center">
        <button
          type="button"
          onClick={() => guardar(true)}
          disabled={guardando}
          className="btn-verde border-0 cursor-pointer disabled:opacity-45"
        >
          {guardando ? 'Guardando…' : 'Publicar vehículo'}
        </button>
        <button
          type="button"
          onClick={() => guardar(false)}
          disabled={guardando}
          className="btn border-2 border-borde text-txt-3 bg-transparent cursor-pointer"
        >
          Guardar borrador
        </button>
        <button
          type="button"
          onClick={() => setPrevia((p) => !p)}
          className="btn-linea bg-transparent cursor-pointer"
        >
          {previa ? 'Cerrar vista previa' : 'Vista previa'}
        </button>
      </div>

      {previa && (
        <section className="border border-borde bg-carta p-6 flex flex-col gap-4">
          <span className="label-campo">Así se va a ver la ficha</span>
          <h2 className="titulo text-[clamp(28px,5vw,44px)] m-0">{titulo(datos) || 'Marca Modelo'}</h2>
          <span className="text-sm uppercase tracking-[0.08em] text-txt-3">
            {datos.anio} · {km(datos.kilometraje)} · {datos.combustible} · {datos.transmision}
          </span>
          <div className="bg-blanco text-negro px-4 py-3 self-start font-display font-bold text-4xl leading-none">
            {pesos(datos.precio, datos.moneda)}
          </div>
          <ChecksCondiciones condiciones={datos.condiciones} />
          <p className="m-0 text-[15px] leading-relaxed text-txt-2">{datos.descripcion}</p>
        </section>
      )}
    </LayoutAdmin>
  );
}
