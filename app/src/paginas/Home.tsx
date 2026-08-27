import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Meta from '../componentes/Meta';
import VehiculoCard from '../componentes/VehiculoCard';
import MapaSucursal from '../componentes/MapaSucursal';
import EsqueletoTarjetas from '../componentes/EsqueletoTarjetas';
import CarruselHero from '../componentes/CarruselHero';
import { Campo, Select } from '../componentes/Campo';
import { useCatalogo } from '../lib/useCatalogo';
import { buscarSucursal } from '../lib/sucursales';
import { listarSlides } from '../lib/carrusel';
import { whatsappUrl } from '../lib/formato';
import { BENEFICIOS, TELEFONO_VISIBLE, TRAMOS_PRECIO, WHATSAPP_PRINCIPAL } from '../lib/constantes';
import type { SlideCarrusel } from '../lib/tipos';

export default function Home() {
  const { vehiculos, sucursales, marcas, cargando } = useCatalogo();
  const navegar = useNavigate();
  const [marca, setMarca] = useState('');
  const [precioMax, setPrecioMax] = useState('');
  const [sucursalId, setSucursalId] = useState('');

  const [slides, setSlides] = useState<SlideCarrusel[]>([]);

  useEffect(() => {
    // Si falla, el respaldo de abajo deja igual una foto en la portada.
    listarSlides().then(setSlides).catch(() => setSlides([]));
  }, []);

  const recientes = useMemo(
    () => vehiculos.filter((v) => v.estado !== 'vendido').slice(0, 4),
    [vehiculos],
  );

  /**
   * Mientras no carguen imágenes en el panel, el carrusel muestra el último auto del
   * catálogo: sin esto la portada quedaría sin foto, peor que antes de tener carrusel.
   */
  const slidesVisibles = useMemo<SlideCarrusel[]>(() => {
    if (slides.length) return slides;
    const v = recientes[0];
    const url = v?.fotos?.[0]?.url;
    if (!v || !url) return [];
    return [{ id: v.id, url, path: '', titulo: `${v.marca} ${v.modelo} ${v.anio}`, orden: 0 }];
  }, [slides, recientes]);

  const buscar = () => {
    const q = new URLSearchParams();
    if (marca) q.set('marca', marca);
    if (precioMax) q.set('precioMax', precioMax);
    if (sucursalId) q.set('sucursalId', sucursalId);
    navegar(`/catalogo?${q.toString()}`);
  };

  return (
    <>
      <Meta
        titulo="Pelado Automotores — Usados en el Valle de Uco, Mendoza"
        descripcion="Autos usados en La Consulta y Guaymallén. Financiación solo con DNI, cuotas fijas en pesos y recibimos tu auto en parte de pago."
        ruta="/"
      />

      <section className="divisor">
        <div className="max-w-[1200px] mx-auto px-5 pt-11 pb-11 flex flex-col gap-9">
          <div className="flex flex-col gap-5">
            <span className="kicker">Valle de Uco · Mendoza</span>
            <h1 className="titulo text-[clamp(46px,9vw,96px)] leading-[0.94] m-0">
              Tu próximo<br />auto está <span className="text-verde">acá</span>
            </h1>
            <p className="m-0 max-w-[34ch] text-base leading-relaxed text-txt-2">
              Usados seleccionados, financiación solo con DNI y cuotas fijas en pesos.
              Dos sucursales: La Consulta y Guaymallén.
            </p>
            <div className="flex flex-wrap gap-2.5">
              <a
                href={whatsappUrl(WHATSAPP_PRINCIPAL)}
                target="_blank"
                rel="noreferrer"
                className="btn-verde no-underline"
              >
                Consultar por WhatsApp
              </a>
              <Link to="/catalogo" className="btn-linea no-underline">Ver catálogo</Link>
            </div>
          </div>
          <CarruselHero slides={slidesVisibles} />
        </div>
      </section>

      {/* Panel flotante en vez de barra a todo el ancho: la franja llena de borde a
          borde era lo que más marcaba el bloque rectangular en la portada. */}
      <section className="divisor">
        <div className="max-w-[1200px] mx-auto px-5 py-8">
          <div className="bg-negro-2 border border-borde rounded-2xl shadow-carta p-5 flex flex-wrap gap-3.5 items-end">
          <div className="flex-1 min-w-[150px]">
            <Campo label="Marca">
              <Select value={marca} onChange={setMarca}>
                <option value="">Todas</option>
                {marcas.map((m) => <option key={m} value={m}>{m}</option>)}
              </Select>
            </Campo>
          </div>
          <div className="flex-1 min-w-[150px]">
            <Campo label="Hasta">
              <Select value={precioMax} onChange={setPrecioMax}>
                <option value="">Cualquier precio</option>
                {TRAMOS_PRECIO.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </Select>
            </Campo>
          </div>
          <div className="flex-1 min-w-[150px]">
            <Campo label="Sucursal">
              <Select value={sucursalId} onChange={setSucursalId}>
                <option value="">Las dos</option>
                {sucursales.map((s) => <option key={s.id} value={s.id}>{s.nombre}</option>)}
              </Select>
            </Campo>
          </div>
            <button type="button" onClick={buscar} className="btn-blanco border-0 cursor-pointer">
              Buscar
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-[1200px] mx-auto px-5 py-14 flex flex-col gap-6">
        <div className="flex items-end justify-between gap-4 flex-wrap divisor pb-3.5">
          <h2 className="titulo text-[clamp(30px,5vw,46px)] m-0">Recién ingresados</h2>
          <Link to="/catalogo" className="text-xs font-bold uppercase tracking-[0.14em] no-underline">
            Ver todo el catálogo →
          </Link>
        </div>
        {cargando ? (
          <EsqueletoTarjetas cantidad={4} />
        ) : (
          <div className="grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(250px,1fr))]">
            {recientes.map((v, i) => (
              <VehiculoCard
                key={v.id}
                vehiculo={v}
                sucursal={buscarSucursal(sucursales, v.sucursalId)}
                prioridad={i === 0}
              />
            ))}
          </div>
        )}
      </section>

      <section className="bg-negro-2 border-y-2 border-borde">
        <div className="max-w-[1200px] mx-auto px-5 py-12 grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(230px,1fr))]">
          {BENEFICIOS.map((b) => (
            <div
              key={b.titulo}
              className="bg-negro-2 border border-borde rounded-2xl px-6 py-6 flex flex-col gap-2.5"
            >
              <span className="text-verde text-2xl leading-none" aria-hidden="true">✓</span>
              <span className="titulo text-[22px] leading-[1.05] whitespace-pre-line">{b.titulo}</span>
              <span className="text-[13px] text-txt-3 leading-relaxed">{b.detalle}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-[1200px] mx-auto px-5 py-14 flex flex-col gap-6">
        <h2 className="titulo text-[clamp(30px,5vw,46px)] m-0 divisor pb-3.5">Nuestras sucursales</h2>
        <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
          {sucursales.map((s) => (
            <div
              key={s.id}
              className="border border-borde bg-carta rounded-2xl shadow-carta overflow-hidden flex flex-col"
            >
              <MapaSucursal sucursal={s} alto={220} />
              <div className="p-5 flex flex-col gap-2">
                <span className="titulo text-2xl">{s.nombre}</span>
                <span className="text-sm text-txt-2">{s.direccion}</span>
                <a href={`tel:+54${s.telefono}`} className="text-sm font-semibold">
                  {TELEFONO_VISIBLE}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
