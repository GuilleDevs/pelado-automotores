import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Meta from '../componentes/Meta';
import FiltrosBar from '../componentes/FiltrosBar';
import VehiculoCard from '../componentes/VehiculoCard';
import EsqueletoTarjetas from '../componentes/EsqueletoTarjetas';
import { useCatalogo } from '../lib/useCatalogo';
import { filtrar } from '../lib/vehiculos';
import { buscarSucursal } from '../lib/sucursales';
import { FILTROS_VACIOS, type Filtros } from '../lib/tipos';

export default function Catalogo() {
  const { vehiculos, sucursales, marcas, cargando, error } = useCatalogo();
  const [params, setParams] = useSearchParams();

  // Los filtros viven en la query string: el link filtrado se puede compartir por WhatsApp.
  const filtros: Filtros = useMemo(
    () => ({
      marca: params.get('marca') ?? '',
      precioMax: params.get('precioMax') ?? '',
      anioDesde: params.get('anioDesde') ?? '',
      combustible: params.get('combustible') ?? '',
      sucursalId: params.get('sucursalId') ?? '',
      estado: params.get('estado') ?? '',
      orden: (params.get('orden') as Filtros['orden']) ?? 'nuevos',
    }),
    [params],
  );

  const aplicar = (f: Filtros) => {
    const q = new URLSearchParams();
    Object.entries(f).forEach(([k, v]) => {
      if (v && !(k === 'orden' && v === 'nuevos')) q.set(k, String(v));
    });
    setParams(q, { replace: true });
  };

  const resultados = useMemo(() => filtrar(vehiculos, filtros), [vehiculos, filtros]);
  const conteo = resultados.length === 1 ? '1 auto encontrado' : `${resultados.length} autos encontrados`;

  return (
    <div className="max-w-[1200px] mx-auto px-5 pt-10 pb-16 flex flex-col gap-6">
      <Meta
        titulo="Catálogo de usados — Pelado Automotores"
        descripcion="Todos los autos disponibles en La Consulta y Guaymallén. Filtrá por marca, precio, año, combustible y sucursal."
        ruta="/catalogo"
      />
      <header className="flex flex-col gap-2.5 divisor pb-3.5">
        <span className="kicker">Catálogo</span>
        <h1 className="titulo text-[clamp(34px,6vw,58px)] m-0">Autos disponibles</h1>
      </header>

      <FiltrosBar
        filtros={filtros}
        onChange={aplicar}
        marcas={marcas}
        sucursales={sucursales}
        onLimpiar={() => aplicar(FILTROS_VACIOS)}
        conteo={conteo}
      />

      {cargando && <EsqueletoTarjetas cantidad={6} />}
      {error && <p className="text-txt-2 text-sm">{error}</p>}

      {!cargando && resultados.length > 0 && (
        <div className="grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(250px,1fr))]">
          {resultados.map((v, i) => (
            <VehiculoCard
              key={v.id}
              vehiculo={v}
              sucursal={buscarSucursal(sucursales, v.sucursalId)}
              prioridad={i < 2}
            />
          ))}
        </div>
      )}

      {!cargando && !error && resultados.length === 0 && (
        <p className="border border-borde bg-negro-2 rounded-2xl p-10 text-center text-txt-3 text-[15px] m-0">
          No hay autos con esos filtros. Escribinos por WhatsApp y lo buscamos para vos.
        </p>
      )}
    </div>
  );
}
