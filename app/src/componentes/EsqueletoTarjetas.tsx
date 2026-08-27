/**
 * Ocupa el lugar exacto de las tarjetas mientras llegan los datos. Con el texto
 * "Cargando…" la página medía casi nada y después saltaba de golpe al aparecer la
 * grilla; así el alto ya está reservado y no se mueve nada al llegar.
 */
export default function EsqueletoTarjetas({ cantidad = 4 }: { cantidad?: number }) {
  return (
    <>
      <span className="sr-only" role="status">Cargando vehículos…</span>
      <div
        aria-hidden="true"
        className="grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(250px,1fr))]"
      >
        {Array.from({ length: cantidad }).map((_, i) => (
          <div key={i} className="bg-carta border border-borde flex flex-col animate-pulse">
            <div className="aspect-[4/3] bg-surface" />
            <div className="p-4 pb-4.5 flex flex-col gap-3 flex-1">
              <div className="h-[22px] bg-surface w-4/5" />
              <div className="h-3 bg-surface w-3/5" />
              <div className="mt-auto flex flex-col gap-2.5">
                <div className="h-10 bg-surface" />
                <div className="h-4 bg-surface w-2/5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
