import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Meta from '../componentes/Meta';
import Galeria from '../componentes/Galeria';
import ChecksCondiciones from '../componentes/ChecksCondiciones';
import VehiculoCard from '../componentes/VehiculoCard';
import Cargando from '../componentes/Cargando';
import NoEncontrado from './NoEncontrado';
import { useCatalogo } from '../lib/useCatalogo';
import { porSlug, relacionados } from '../lib/vehiculos';
import { buscarSucursal } from '../lib/sucursales';
import {
  ETIQUETA_ESTADO, ficha, km, mensajeConsulta, pesos, portada, titulo, tituloCompleto, whatsappUrl,
} from '../lib/formato';
import { WHATSAPP_PRINCIPAL } from '../lib/constantes';
import type { Vehiculo as TVehiculo } from '../lib/tipos';

export default function Vehiculo() {
  const { slug = '' } = useParams();
  const { vehiculos, sucursales } = useCatalogo();
  const [v, setV] = useState<TVehiculo | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let vivo = true;
    setCargando(true);
    porSlug(slug)
      .then((r) => vivo && setV(r))
      .finally(() => vivo && setCargando(false));
    return () => { vivo = false; };
  }, [slug]);

  if (cargando) return <Cargando texto="Cargando vehículo…" />;
  if (!v) return <NoEncontrado />;

  const sucursal = buscarSucursal(sucursales, v.sucursalId);
  const numero = sucursal?.whatsapp || WHATSAPP_PRINCIPAL;
  // Sin kilometraje la fila entera se omite: mostrarla vacía deja la ficha con un hueco.
  const kms = km(v.kilometraje);
  const specs: Array<[string, string]> = [
    ['Marca', v.marca], ['Modelo', v.modelo], ['Año', String(v.anio)],
    ['Motor', v.motor], ['Combustible', v.combustible], ['Transmisión', v.transmision],
    ...(kms ? [['Kilometraje', kms] as [string, string]] : []),
    ['Color', v.color], ['Sucursal', sucursal?.nombre ?? '—'],
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-5 pt-7 pb-16 flex flex-col gap-7">
      <Meta
        titulo={`${tituloCompleto(v)} — Pelado Automotores`}
        descripcion={`${ficha(tituloCompleto(v), kms, v.combustible, pesos(v.precio, v.moneda))}. ${sucursal?.nombre ?? ''}. Financiación solo con DNI y cuotas fijas en pesos.`}
        imagen={portada(v)}
        ruta={`/vehiculo/${v.slug}`}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Vehicle',
          name: tituloCompleto(v),
          brand: { '@type': 'Brand', name: v.marca },
          model: v.modelo,
          vehicleModelDate: String(v.anio),
          // Declarar 0 km en un usado sería un dato falso para Google: mejor no declararlo.
          ...(v.kilometraje == null
            ? {}
            : { mileageFromOdometer: { '@type': 'QuantitativeValue', value: v.kilometraje, unitCode: 'KMT' } }),
          fuelType: v.combustible,
          vehicleTransmission: v.transmision,
          color: v.color,
          image: portada(v),
          offers: {
            '@type': 'Offer',
            price: v.precio,
            priceCurrency: v.moneda,
            availability: v.estado === 'disponible'
              ? 'https://schema.org/InStock'
              : 'https://schema.org/SoldOut',
          },
        }}
      />

      <Link to="/catalogo" className="text-xs font-bold uppercase tracking-[0.14em] text-txt-3 no-underline hover:text-verde">
        ← Volver al catálogo
      </Link>

      <div className="grid gap-7 [grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]">
        <Galeria fotos={v.fotos} alt={tituloCompleto(v)} />

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2.5">
            <span className="kicker">
              {ETIQUETA_ESTADO[v.estado]} · {sucursal?.nombre ?? ''}
            </span>
            <h1 className="titulo text-[clamp(32px,5.5vw,52px)] m-0 text-pretty">{titulo(v)}</h1>
            <span className="text-sm uppercase tracking-[0.08em] text-txt-3">
              {ficha(v.anio, kms, v.combustible, v.transmision)}
            </span>
          </div>

          <div className="bg-blanco text-negro px-4.5 py-3.5 self-start flex flex-col gap-0.5">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#5A5A5A]">Precio</span>
            <span className="font-display font-bold text-[clamp(32px,6vw,44px)] leading-none">
              {pesos(v.precio, v.moneda)}
            </span>
          </div>

          <ChecksCondiciones condiciones={v.condiciones} />

          <a
            href={whatsappUrl(numero, mensajeConsulta(v))}
            target="_blank"
            rel="noreferrer"
            className="btn-verde block no-underline"
          >
            Consultar por WhatsApp
          </a>

          <p className="m-0 text-[15px] leading-relaxed text-txt-2">{v.descripcion}</p>
        </div>
      </div>

      <section>
        <h2 className="titulo text-[28px] m-0 mb-3.5 divisor pb-3">Ficha técnica</h2>
        <dl className="m-0">
          {specs.map(([k, val]) => (
            <div key={k} className="flex justify-between gap-4 py-3.5 border-b border-borde-suave">
              <dt className="text-xs font-bold uppercase tracking-[0.14em] text-txt-4">{k}</dt>
              <dd className="m-0 text-[15px] text-blanco text-right">{val}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="flex flex-col gap-5">
        <h2 className="titulo text-[28px] m-0 divisor pb-3">Parecidos a este</h2>
        <div className="grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(250px,1fr))]">
          {relacionados(vehiculos, v).map((r) => (
            <VehiculoCard key={r.id} vehiculo={r} sucursal={buscarSucursal(sucursales, r.sucursalId)} />
          ))}
        </div>
      </section>
    </div>
  );
}
