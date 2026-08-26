import Meta from '../componentes/Meta';

const DATOS = [
  { valor: '2', label: 'Sucursales' },
  { valor: 'DNI', label: 'Único requisito para financiar' },
  { valor: '$', label: 'Cuotas fijas en pesos' },
];

export default function Nosotros() {
  return (
    <div className="max-w-[1000px] mx-auto px-5 pt-12 pb-16 flex flex-col gap-9">
      <Meta
        titulo="Nosotros — Pelado Automotores"
        descripcion="Quiénes somos: una concesionaria de usados del Valle de Uco, con sucursales en La Consulta y Guaymallén."
        ruta="/nosotros"
      />
      <header className="flex flex-col gap-3 divisor pb-4.5">
        <span className="kicker">Nosotros</span>
        <h1 className="titulo text-[clamp(34px,6vw,62px)] leading-[0.98] m-0">
          Del Valle de Uco,<br />para todo Mendoza
        </h1>
      </header>

      <div className="grid gap-7 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
        <div className="flex flex-col gap-4">
          <p className="m-0 text-base leading-[1.65] text-[#D5D5D5]">
            Pelado Automotores nació en La Consulta como Naza Automotores, vendiendo usados de la
            zona a gente de la zona. Hoy tenemos dos sucursales, una en el Valle de Uco y otra en
            Guaymallén, y el mismo modo de trabajar: te mostramos el auto como está, te decimos qué
            se le hizo y te armamos la financiación con lo que tenés a mano.
          </p>
          <p className="m-0 text-base leading-[1.65] text-[#D5D5D5]">
            Financiamos solo con DNI, con cuotas fijas en pesos, y recibimos tu auto en parte de
            pago. La entrega se hace en la sucursal, y sí, la foto con el auto nuevo va a Instagram.
          </p>
        </div>
        <div className="relative aspect-[3/4] bg-surface border border-borde min-h-[280px]">
          <img
            src="/local.jpg"
            alt="Sucursal de Pelado Automotores en La Consulta"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </div>

      <div className="grid gap-0.5 bg-borde border border-borde [grid-template-columns:repeat(auto-fit,minmax(180px,1fr))]">
        {DATOS.map((d) => (
          <div key={d.label} className="bg-negro-2 p-6 flex flex-col gap-1.5">
            <span className="font-display font-bold text-[44px] leading-none text-verde">{d.valor}</span>
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-txt-3">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
