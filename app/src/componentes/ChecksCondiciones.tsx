import type { Condiciones } from '../lib/tipos';

const TEXTOS: Array<[keyof Condiciones, string]> = [
  ['financiacionDni', 'Financiación solo con DNI'],
  ['cuotasFijas', 'Cuotas fijas y en pesos'],
  ['permuta', 'Recibimos tu auto en parte de pago'],
];

export default function ChecksCondiciones({ condiciones }: { condiciones: Condiciones }) {
  return (
    <ul className="flex flex-col gap-2 list-none p-0 m-0">
      {TEXTOS.filter(([k]) => condiciones?.[k]).map(([k, texto]) => (
        <li key={k} className="flex gap-2.5 items-baseline text-[15px] text-blanco">
          <span className="text-verde font-bold" aria-hidden="true">✓</span>
          {texto}
        </li>
      ))}
    </ul>
  );
}
