import { useEffect, useState } from 'react';
import LayoutAdmin from '../../componentes/admin/LayoutAdmin';
import Cargando from '../../componentes/Cargando';
import { Campo } from '../../componentes/Campo';
import { actualizarSucursal, listarSucursales } from '../../lib/sucursales';
import type { Sucursal } from '../../lib/tipos';

export default function SucursalesAdmin() {
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [cargando, setCargando] = useState(true);
  const [guardada, setGuardada] = useState('');

  useEffect(() => {
    listarSucursales().then(setSucursales).finally(() => setCargando(false));
  }, []);

  const set = (id: string, k: keyof Sucursal, v: string) =>
    setSucursales((prev) => prev.map((s) => (s.id === id ? { ...s, [k]: v } : s)));

  const guardar = async (s: Sucursal) => {
    const { id, ...datos } = s;
    await actualizarSucursal(id, datos);
    setGuardada(id);
    setTimeout(() => setGuardada(''), 2500);
  };

  if (cargando) return <Cargando />;

  return (
    <LayoutAdmin titulo="Sucursales" kicker="Datos del negocio">
      <p className="m-0 text-sm text-txt-3">
        Lo que cambies acá se actualiza en el sitio, en los mapas y en el botón de WhatsApp de cada ficha.
      </p>
      <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]">
        {sucursales.map((s) => (
          <div key={s.id} className="border border-borde bg-negro-2 p-5 flex flex-col gap-3.5">
            <h2 className="titulo text-2xl m-0">{s.nombre}</h2>
            <Campo label="Dirección">
              <input className="input" value={s.direccion} onChange={(e) => set(s.id, 'direccion', e.target.value)} />
            </Campo>
            <Campo label="Teléfono">
              <input className="input" value={s.telefono} onChange={(e) => set(s.id, 'telefono', e.target.value)} />
            </Campo>
            <Campo label="WhatsApp (formato wa.me, sin +)">
              <input className="input" value={s.whatsapp} onChange={(e) => set(s.id, 'whatsapp', e.target.value)} />
            </Campo>
            <Campo label="Horarios">
              <input className="input" value={s.horarios} onChange={(e) => set(s.id, 'horarios', e.target.value)} />
            </Campo>
            <Campo label="Búsqueda del mapa">
              <input className="input" value={s.mapaQuery} onChange={(e) => set(s.id, 'mapaQuery', e.target.value)} />
            </Campo>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => guardar(s)} className="btn-verde border-0 cursor-pointer">
                Guardar
              </button>
              {guardada === s.id && <span className="text-verde text-sm">Guardado.</span>}
            </div>
          </div>
        ))}
      </div>
    </LayoutAdmin>
  );
}
