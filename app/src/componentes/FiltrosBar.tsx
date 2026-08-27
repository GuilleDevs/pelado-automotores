import { Campo, Select } from './Campo';
import { ANIOS_DESDE, COMBUSTIBLES, ESTADOS, TRAMOS_PRECIO } from '../lib/constantes';
import type { Filtros, Sucursal } from '../lib/tipos';

interface Props {
  filtros: Filtros;
  onChange: (f: Filtros) => void;
  marcas: string[];
  sucursales: Sucursal[];
  onLimpiar: () => void;
  conteo: string;
}

export default function FiltrosBar({ filtros, onChange, marcas, sucursales, onLimpiar, conteo }: Props) {
  const set = <K extends keyof Filtros>(k: K) => (v: string) =>
    onChange({ ...filtros, [k]: v as Filtros[K] });

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-3.5 bg-negro-2 border border-borde rounded-2xl shadow-carta p-5 [grid-template-columns:repeat(auto-fit,minmax(150px,1fr))]">
        <Campo label="Marca">
          <Select value={filtros.marca} onChange={set('marca')}>
            <option value="">Todas</option>
            {marcas.map((m) => <option key={m} value={m}>{m}</option>)}
          </Select>
        </Campo>
        <Campo label="Precio hasta">
          <Select value={filtros.precioMax} onChange={set('precioMax')}>
            <option value="">Cualquiera</option>
            {TRAMOS_PRECIO.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </Select>
        </Campo>
        <Campo label="Año desde">
          <Select value={filtros.anioDesde} onChange={set('anioDesde')}>
            <option value="">Cualquiera</option>
            {ANIOS_DESDE.map((a) => <option key={a} value={a}>{a}</option>)}
          </Select>
        </Campo>
        <Campo label="Combustible">
          <Select value={filtros.combustible} onChange={set('combustible')}>
            <option value="">Todos</option>
            {COMBUSTIBLES.map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>
        </Campo>
        <Campo label="Sucursal">
          <Select value={filtros.sucursalId} onChange={set('sucursalId')}>
            <option value="">Las dos</option>
            {sucursales.map((s) => <option key={s.id} value={s.id}>{s.nombre}</option>)}
          </Select>
        </Campo>
        <Campo label="Estado">
          <Select value={filtros.estado} onChange={set('estado')}>
            <option value="">Todos</option>
            {ESTADOS.map((e) => <option key={e.value} value={e.value}>{e.label}</option>)}
          </Select>
        </Campo>
        <Campo label="Ordenar por">
          <Select value={filtros.orden} onChange={set('orden')}>
            <option value="nuevos">Más nuevos</option>
            <option value="asc">Menor precio</option>
            <option value="desc">Mayor precio</option>
          </Select>
        </Campo>
      </div>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-txt-3">{conteo}</span>
        <button
          type="button"
          onClick={onLimpiar}
          className="bg-transparent border-0 cursor-pointer text-xs font-bold uppercase tracking-[0.14em] text-verde p-0"
        >
          Limpiar filtros
        </button>
      </div>
    </div>
  );
}
