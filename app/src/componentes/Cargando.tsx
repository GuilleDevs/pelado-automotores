export default function Cargando({ texto = 'Cargando…' }: { texto?: string }) {
  return (
    <div className="py-16 text-center text-txt-3 text-xs uppercase tracking-[0.18em]">{texto}</div>
  );
}
