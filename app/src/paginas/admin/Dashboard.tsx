import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import LayoutAdmin from '../../componentes/admin/LayoutAdmin';
import Cargando from '../../componentes/Cargando';
import Meta from '../../componentes/Meta';
import { actualizar, eliminar, listarTodos } from '../../lib/vehiculos';
import { listarSucursales, buscarSucursal } from '../../lib/sucursales';
import { listarLeads } from '../../lib/leads';
import { pesos, titulo } from '../../lib/formato';
import { ESTADOS } from '../../lib/constantes';
import type { EstadoVehiculo, Sucursal, Vehiculo } from '../../lib/tipos';

export default function Dashboard() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [sinLeer, setSinLeer] = useState(0);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    Promise.all([listarTodos(), listarSucursales(), listarLeads()])
      .then(([v, s, l]) => {
        setVehiculos(v);
        setSucursales(s);
        setSinLeer(l.filter((x) => !x.leido).length);
      })
      .finally(() => setCargando(false));
  }, []);

  const stats = useMemo(() => ({
    publicados: vehiculos.filter((v) => v.publicado).length,
    disponibles: vehiculos.filter((v) => v.estado === 'disponible').length,
    reservados: vehiculos.filter((v) => v.estado === 'reservado').length,
  }), [vehiculos]);

  /** El select guarda al cambiar, sin confirmación: es la acción más frecuente del panel. */
  const cambiarEstado = async (v: Vehiculo, estado: EstadoVehiculo) => {
    setVehiculos((prev) => prev.map((x) => (x.id === v.id ? { ...x, estado } : x)));
    await actualizar(v.id, { estado });
  };

  const borrar = async (v: Vehiculo) => {
    if (!confirm(`¿Eliminar ${titulo(v)}? Esta acción no se puede deshacer.`)) return;
    await eliminar(v.id);
    setVehiculos((prev) => prev.filter((x) => x.id !== v.id));
  };

  return (
    <LayoutAdmin
      titulo="Mi catálogo"
      acciones={
        <Link to="/admin/vehiculo/nuevo" className="btn-verde no-underline">+ Nuevo vehículo</Link>
      }
    >
      <Meta titulo="Panel — Pelado Automotores" descripcion="Gestión del catálogo." />

      <div className="grid gap-0.5 bg-borde border border-borde [grid-template-columns:repeat(auto-fit,minmax(150px,1fr))]">
        {[
          { valor: stats.publicados, label: 'Publicados', color: '#FFFFFF' },
          { valor: stats.disponibles, label: 'Disponibles', color: '#46E02D' },
          { valor: stats.reservados, label: 'Reservados', color: '#FFB01F' },
          { valor: sinLeer, label: 'Consultas nuevas', color: '#FFFFFF' },
        ].map((s) => (
          <div key={s.label} className="bg-negro-2 p-5 flex flex-col gap-1">
            <span className="font-display font-bold text-4xl leading-none" style={{ color: s.color }}>
              {s.valor}
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-txt-4">
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {cargando ? (
        <Cargando />
      ) : (
        <>
          {/* Escritorio: tabla. Mobile: tarjetas apiladas, no scroll horizontal. */}
          <div className="hidden md:block border border-borde bg-negro-2">
            <div className="grid grid-cols-[2.2fr_1fr_1.1fr_1fr_0.9fr] gap-3 px-4.5 py-3.5 border-b-2 border-borde">
              {['Vehículo', 'Sucursal', 'Precio', 'Estado', 'Acciones'].map((h) => (
                <span key={h} className="label-campo">{h}</span>
              ))}
            </div>
            {vehiculos.map((v) => (
              <div
                key={v.id}
                className="grid grid-cols-[2.2fr_1fr_1.1fr_1fr_0.9fr] gap-3 px-4.5 py-3.5 border-b border-borde-suave items-center"
              >
                <span className="text-sm font-semibold text-blanco">
                  {titulo(v)} {!v.publicado && <em className="text-txt-5 not-italic text-xs">· borrador</em>}
                </span>
                <span className="text-[13px] text-txt-3">
                  {buscarSucursal(sucursales, v.sucursalId)?.nombre ?? '—'}
                </span>
                <span className="text-sm text-blanco">{pesos(v.precio, v.moneda)}</span>
                <select
                  className="bg-negro text-blanco border border-borde px-2 py-2 text-xs"
                  value={v.estado}
                  onChange={(e) => cambiarEstado(v, e.target.value as EstadoVehiculo)}
                  aria-label={`Estado de ${titulo(v)}`}
                >
                  {ESTADOS.map((e) => <option key={e.value} value={e.value}>{e.label}</option>)}
                </select>
                <span className="flex gap-3">
                  <Link
                    to={`/admin/vehiculo/${v.id}`}
                    className="text-xs font-bold uppercase tracking-[0.12em] no-underline"
                  >
                    Editar
                  </Link>
                  <button
                    type="button"
                    onClick={() => borrar(v)}
                    className="bg-transparent border-0 p-0 cursor-pointer text-xs font-bold uppercase tracking-[0.12em] text-txt-5 hover:text-reservado"
                  >
                    Borrar
                  </button>
                </span>
              </div>
            ))}
          </div>

          <div className="md:hidden flex flex-col gap-3">
            {vehiculos.map((v) => (
              <div key={v.id} className="border border-borde bg-negro-2 p-4 flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <span className="titulo text-lg">{titulo(v)}</span>
                  <span className="text-xs text-txt-3">
                    {buscarSucursal(sucursales, v.sucursalId)?.nombre ?? '—'} · {pesos(v.precio, v.moneda)}
                  </span>
                </div>
                <select
                  className="input"
                  value={v.estado}
                  onChange={(e) => cambiarEstado(v, e.target.value as EstadoVehiculo)}
                  aria-label={`Estado de ${titulo(v)}`}
                >
                  {ESTADOS.map((e) => <option key={e.value} value={e.value}>{e.label}</option>)}
                </select>
                <div className="flex gap-2.5">
                  <Link to={`/admin/vehiculo/${v.id}`} className="btn-verde flex-1 justify-center no-underline">
                    Editar
                  </Link>
                  <button
                    type="button"
                    onClick={() => borrar(v)}
                    className="btn border-2 border-borde text-txt-3 bg-transparent cursor-pointer"
                  >
                    Borrar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <span className="text-xs text-txt-5">
        Los vehículos marcados como vendidos se ocultan del catálogo público.
      </span>
    </LayoutAdmin>
  );
}
