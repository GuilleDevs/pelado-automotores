import { Link } from 'react-router-dom';
import Meta from '../componentes/Meta';

export default function NoEncontrado() {
  return (
    <div className="max-w-[700px] mx-auto px-5 py-24 flex flex-col gap-5">
      <Meta titulo="No encontramos esa página — Pelado Automotores" descripcion="La página que buscás no existe o el vehículo ya no está publicado." />
      <span className="kicker">Error 404</span>
      <h1 className="titulo text-[clamp(34px,7vw,64px)] m-0">No encontramos<br />esa página</h1>
      <p className="m-0 text-base text-txt-2 leading-relaxed">
        Puede que el auto ya se haya vendido. Mirá el catálogo, seguro hay algo que te sirve.
      </p>
      <Link to="/catalogo" className="btn-verde self-start no-underline">Ver catálogo</Link>
    </div>
  );
}
