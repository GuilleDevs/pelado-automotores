import { useEffect, useState } from 'react';
import type { SlideCarrusel } from '../lib/tipos';

interface Props {
  slides: SlideCarrusel[];
}

/**
 * Carrusel del home: foto grande, el modelo debajo y puntos para saltar entre autos.
 * Las imágenes van con object-contain porque se cargan recortadas para este espacio:
 * recortarlas de nuevo con cover partiría autos que ya vienen encuadrados.
 */
export default function CarruselHero({ slides }: Props) {
  const [i, setI] = useState(0);
  const total = slides.length;

  // Borrar el último slide desde el panel deja el índice fuera de rango.
  useEffect(() => { setI((n) => (n >= total ? 0 : n)); }, [total]);

  if (!total) return null;

  const ir = (n: number) => setI(((n % total) + total) % total);
  const actual = slides[Math.min(i, total - 1)];

  return (
    <div
      className="flex flex-col"
      role="group"
      aria-roledescription="carrusel"
      aria-label="Autos destacados"
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') ir(i - 1);
        if (e.key === 'ArrowRight') ir(i + 1);
      }}
    >
      <div className="relative bg-surface border border-borde">
        <img
          key={actual.id}
          src={actual.url}
          alt={actual.titulo}
          width={1600}
          height={1000}
          fetchPriority="high"
          className="w-full aspect-[4/3] md:aspect-[16/9] max-h-[70vh] object-contain"
        />

        {total > 1 && (
          <>
            <button
              type="button"
              onClick={() => ir(i - 1)}
              aria-label="Auto anterior"
              className="absolute left-0 top-1/2 -translate-y-1/2 w-11 h-16 flex items-center justify-center bg-negro/70 text-blanco text-2xl leading-none hover:bg-verde hover:text-negro"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => ir(i + 1)}
              aria-label="Auto siguiente"
              className="absolute right-0 top-1/2 -translate-y-1/2 w-11 h-16 flex items-center justify-center bg-negro/70 text-blanco text-2xl leading-none hover:bg-verde hover:text-negro"
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* aria-live: sin esto, mover el carrusel no anuncia nada a un lector de pantalla. */}
      <p
        aria-live="polite"
        className="titulo text-center text-[clamp(26px,5vw,42px)] m-0 pt-5"
      >
        {actual.titulo}
      </p>

      {total > 1 && (
        <div className="flex justify-center gap-2 pt-4">
          {slides.map((s, n) => (
            <button
              key={s.id}
              type="button"
              onClick={() => ir(n)}
              aria-label={`Ver ${s.titulo}`}
              aria-current={n === i}
              className="w-11 h-11 flex items-center justify-center"
            >
              <span
                className={`block w-6 h-0.5 ${n === i ? 'bg-verde' : 'bg-borde'}`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
