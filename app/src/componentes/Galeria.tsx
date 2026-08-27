import { useEffect, useState } from 'react';
import type { Foto } from '../lib/tipos';

export default function Galeria({ fotos, alt }: { fotos: Foto[]; alt: string }) {
  const ordenadas = [...(fotos ?? [])].sort((a, b) => a.orden - b.orden);
  const [activa, setActiva] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(false);
      if (e.key === 'ArrowRight') setActiva((i) => (i + 1) % ordenadas.length);
      if (e.key === 'ArrowLeft') setActiva((i) => (i - 1 + ordenadas.length) % ordenadas.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, ordenadas.length]);

  if (!ordenadas.length) {
    return (
      <div className="aspect-[4/3] bg-surface border border-borde rounded-2xl grid place-items-center text-txt-5 text-xs uppercase tracking-[0.14em]">
        Sin fotos
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2.5">
      <button
        type="button"
        onClick={() => setLightbox(true)}
        className="relative aspect-[4/3] bg-surface border border-borde rounded-2xl overflow-hidden shadow-carta p-0 cursor-zoom-in block w-full"
        aria-label="Ampliar foto"
      >
        <img
          src={ordenadas[activa].url}
          alt={`${alt} — foto ${activa + 1}`}
          width={1600}
          height={1200}
          className="w-full h-full object-cover"
        />
      </button>
      {ordenadas.length > 1 && (
        <div className="grid grid-cols-4 gap-2.5">
          {ordenadas.map((f, i) => (
            <button
              key={f.path}
              type="button"
              onClick={() => setActiva(i)}
              aria-label={`Ver foto ${i + 1}`}
              aria-current={i === activa}
              className={`aspect-[4/3] bg-surface border rounded-xl overflow-hidden p-0 cursor-pointer transition-colors ${
                i === activa ? 'border-verde' : 'border-borde hover:border-txt-5'
              }`}
            >
              <img
                src={f.url}
                alt={`${alt} — miniatura ${i + 1}`}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Galería ampliada"
          onClick={() => setLightbox(false)}
          className="fixed inset-0 z-[100] bg-negro/95 grid place-items-center p-5 cursor-zoom-out"
        >
          <img
            src={ordenadas[activa].url}
            alt={`${alt} — foto ${activa + 1} ampliada`}
            className="max-w-full max-h-[90vh] object-contain rounded-2xl"
          />
          <button
            type="button"
            onClick={() => setLightbox(false)}
            className="absolute top-4 right-4 btn-verde"
          >
            Cerrar
          </button>
        </div>
      )}
    </div>
  );
}
