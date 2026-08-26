import { useRef, useState } from 'react';
import { borrarFoto, subirFoto } from '../../lib/imagenes';
import type { Foto } from '../../lib/tipos';

interface Props {
  vehiculoId: string;
  fotos: Foto[];
  onChange: (fotos: Foto[]) => void;
}

/** Drag & drop, reordenamiento por arrastre y portada = orden 0. */
export default function DropzoneFotos({ vehiculoId, fotos, onChange }: Props) {
  const input = useRef<HTMLInputElement>(null);
  const [subiendo, setSubiendo] = useState(0);
  const [sobre, setSobre] = useState(false);
  const arrastrada = useRef<number | null>(null);

  const ordenadas = [...fotos].sort((a, b) => a.orden - b.orden);

  const agregar = async (files: FileList | null) => {
    if (!files?.length) return;
    const lista = Array.from(files).filter((f) => f.type.startsWith('image/'));
    setSubiendo(lista.length);
    const nuevas: Foto[] = [];
    for (let i = 0; i < lista.length; i++) {
      nuevas.push(await subirFoto(vehiculoId, lista[i], ordenadas.length + i));
      setSubiendo(lista.length - i - 1);
    }
    onChange([...ordenadas, ...nuevas]);
  };

  const quitar = async (foto: Foto) => {
    await borrarFoto(foto);
    onChange(ordenadas.filter((f) => f.path !== foto.path).map((f, i) => ({ ...f, orden: i })));
  };

  const soltarEn = (destino: number) => {
    const origen = arrastrada.current;
    arrastrada.current = null;
    if (origen === null || origen === destino) return;
    const copia = [...ordenadas];
    const [movida] = copia.splice(origen, 1);
    copia.splice(destino, 0, movida);
    onChange(copia.map((f, i) => ({ ...f, orden: i })));
  };

  return (
    <div className="flex flex-col gap-3">
      <span className="label-campo">
        Fotos · arrastrá y soltá, la primera es la portada
      </span>

      <div
        onDragOver={(e) => { e.preventDefault(); setSobre(true); }}
        onDragLeave={() => setSobre(false)}
        onDrop={(e) => { e.preventDefault(); setSobre(false); agregar(e.dataTransfer.files); }}
        className={`grid gap-2.5 p-2.5 border border-dashed [grid-template-columns:repeat(auto-fill,minmax(140px,1fr))] ${
          sobre ? 'border-verde bg-verde/5' : 'border-[#3A3A3A]'
        }`}
      >
        {ordenadas.map((f, i) => (
          <div
            key={f.path}
            draggable
            onDragStart={() => { arrastrada.current = i; }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.stopPropagation(); soltarEn(i); }}
            className="relative aspect-[4/3] bg-surface border border-borde cursor-grab"
          >
            <img src={f.url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
            {i === 0 && (
              <span className="absolute bottom-0 left-0 bg-verde text-negro text-[9px] font-bold uppercase tracking-[0.14em] px-2 py-1">
                Portada
              </span>
            )}
            <button
              type="button"
              onClick={() => quitar(f)}
              aria-label={`Quitar foto ${i + 1}`}
              className="absolute top-0 right-0 bg-negro/85 text-blanco border-0 w-9 h-9 cursor-pointer text-base leading-none"
            >
              ×
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => input.current?.click()}
          className="aspect-[4/3] bg-surface border border-dashed border-[#3A3A3A] text-txt-4 text-xs uppercase tracking-[0.14em] cursor-pointer hover:border-verde hover:text-verde"
        >
          {subiendo > 0 ? `Subiendo… (${subiendo})` : '+ Agregar fotos'}
        </button>
      </div>

      <input
        ref={input}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => agregar(e.target.files)}
      />
      <span className="text-xs text-txt-5">
        Las fotos se redimensionan y comprimen antes de subir. Arrastrá para reordenar.
      </span>
    </div>
  );
}
