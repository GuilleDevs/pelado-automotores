import { useEffect, useRef, useState } from 'react';
import LayoutAdmin from '../../componentes/admin/LayoutAdmin';
import Cargando from '../../componentes/Cargando';
import { borrarSlide, crearSlide, guardarOrden, listarSlides, actualizarSlide } from '../../lib/carrusel';
import { subirImagenCarrusel } from '../../lib/imagenes';
import type { SlideCarrusel } from '../../lib/tipos';

export default function CarruselAdmin() {
  const [slides, setSlides] = useState<SlideCarrusel[]>([]);
  const [cargando, setCargando] = useState(true);
  const [subiendo, setSubiendo] = useState(0);
  const [sobre, setSobre] = useState(false);
  const [error, setError] = useState('');
  const input = useRef<HTMLInputElement>(null);
  const arrastrado = useRef<number | null>(null);

  useEffect(() => {
    listarSlides()
      .then(setSlides)
      .catch(() => setError('No pudimos cargar el carrusel.'))
      .finally(() => setCargando(false));
  }, []);

  const agregar = async (files: FileList | null) => {
    if (!files?.length) return;
    const lista = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (!lista.length) return;
    setError('');
    setSubiendo(lista.length);
    try {
      const nuevos: SlideCarrusel[] = [];
      for (let n = 0; n < lista.length; n++) {
        const { url, path } = await subirImagenCarrusel(lista[n]);
        const datos = { url, path, titulo: '', orden: slides.length + n };
        const id = await crearSlide(datos);
        nuevos.push({ id, ...datos });
        setSubiendo(lista.length - n - 1);
      }
      setSlides((s) => [...s, ...nuevos]);
    } catch (e) {
      // Sin el código real, cualquier fallo parecía de tamaño y mandaba a probar
      // con un archivo más chico aunque el problema fueran los permisos.
      const codigo = (e as { code?: string })?.code ?? '';
      const detalle = codigo || (e as Error)?.message || 'error desconocido';
      console.error('[carrusel] falló la subida:', e);
      setError(
        codigo === 'storage/unauthorized'
          ? 'Storage rechazó la subida: el usuario no tiene permiso de escritura sobre carrusel/.'
          : codigo === 'storage/unauthenticated'
            ? 'Se cerró la sesión. Volvé a entrar al panel y probá de nuevo.'
            : codigo === 'storage/retry-limit-exceeded'
              ? 'La subida tardó demasiado. Revisá la conexión y probá de nuevo.'
              : `No pudimos subir la imagen (${detalle}).`,
      );
    } finally {
      setSubiendo(0);
    }
  };

  const quitar = async (slide: SlideCarrusel) => {
    const resto = slides.filter((s) => s.id !== slide.id);
    setSlides(resto);
    await borrarSlide(slide);
    await guardarOrden(resto);
  };

  const soltarEn = async (destino: number) => {
    const origen = arrastrado.current;
    arrastrado.current = null;
    if (origen === null || origen === destino) return;
    const copia = [...slides];
    const [movido] = copia.splice(origen, 1);
    copia.splice(destino, 0, movido);
    setSlides(copia);
    await guardarOrden(copia);
  };

  // El título se guarda al salir del campo: guardar en cada tecla escribe una vez por letra.
  const guardarTitulo = async (slide: SlideCarrusel, titulo: string) => {
    if (titulo === slide.titulo) return;
    setSlides((s) => s.map((x) => (x.id === slide.id ? { ...x, titulo } : x)));
    await actualizarSlide(slide.id, { titulo });
  };

  return (
    <LayoutAdmin
      titulo="Carrusel"
      acciones={
        <button
          type="button"
          onClick={() => input.current?.click()}
          className="btn-verde border-0 cursor-pointer"
        >
          + Agregar imagen
        </button>
      }
    >
      <input
        ref={input}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => { agregar(e.target.files); e.target.value = ''; }}
      />

      <p className="text-sm text-txt-3 m-0 max-w-[70ch] leading-relaxed">
        Estas imágenes son las del carrusel de la página de inicio, y no salen del catálogo:
        subí fotos ya recortadas, apaisadas y con el auto centrado. El texto de cada una es
        lo que se lee debajo de la foto. Se ordenan arrastrando.
      </p>

      {error && (
        <p className="text-sm border border-borde bg-carta px-4 py-3 m-0 text-reservado">{error}</p>
      )}

      <div
        onDragOver={(e) => { e.preventDefault(); setSobre(true); }}
        onDragLeave={() => setSobre(false)}
        onDrop={(e) => { e.preventDefault(); setSobre(false); agregar(e.dataTransfer.files); }}
        className={`border-2 border-dashed px-5 py-8 text-center ${
          sobre ? 'border-verde bg-carta' : 'border-borde'
        }`}
      >
        <span className="text-sm text-txt-3">
          {subiendo
            ? `Subiendo… quedan ${subiendo}`
            : 'Arrastrá las imágenes acá, o usá “Agregar imagen”.'}
        </span>
      </div>

      {cargando ? (
        <Cargando />
      ) : slides.length === 0 ? (
        <p className="text-sm text-txt-3 m-0">
          Todavía no hay imágenes. Mientras el carrusel esté vacío, la página de inicio se ve
          como antes, sin ese bloque.
        </p>
      ) : (
        <div className="flex flex-col gap-0.5 bg-borde border border-borde">
          {slides.map((s, n) => (
            <div
              key={s.id}
              draggable
              onDragStart={() => { arrastrado.current = n; }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => soltarEn(n)}
              className="bg-negro-2 p-3 flex items-center gap-4 cursor-move"
            >
              <span className="text-txt-5 text-xs font-bold w-6 shrink-0 text-center" aria-hidden="true">
                ⠿
              </span>
              <img
                src={s.url}
                alt=""
                className="w-28 h-20 object-contain bg-surface border border-borde shrink-0"
              />
              <label className="flex-1 min-w-0 flex flex-col gap-1.5">
                <span className="label-campo">Texto debajo de la foto</span>
                <input
                  className="input"
                  defaultValue={s.titulo}
                  placeholder="Ford Fiesta Kinetic 2012"
                  onBlur={(e) => guardarTitulo(s, e.target.value.trim())}
                />
              </label>
              <button
                type="button"
                onClick={() => quitar(s)}
                className="btn border-2 border-borde text-txt-3 bg-transparent cursor-pointer hover:border-reservado hover:text-reservado shrink-0"
              >
                Borrar
              </button>
            </div>
          ))}
        </div>
      )}
    </LayoutAdmin>
  );
}
