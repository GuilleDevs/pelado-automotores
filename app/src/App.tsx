import { Routes, Route, useLocation } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import Header from './componentes/Header';
import Footer from './componentes/Footer';
import BotonWhatsApp from './componentes/BotonWhatsApp';
import Cargando from './componentes/Cargando';
import Home from './paginas/Home';
import Catalogo from './paginas/Catalogo';
import Vehiculo from './paginas/Vehiculo';
import Nosotros from './paginas/Nosotros';
import Sucursales from './paginas/Sucursales';
import NoEncontrado from './paginas/NoEncontrado';
import RutaProtegida from './componentes/admin/RutaProtegida';

/**
 * El panel lo usan dos personas, pero viajaba en el mismo archivo que el sitio
 * público: cada visitante descargaba el alta de vehículos, el dropzone y la
 * administración de sucursales sin poder abrirlos nunca. En diferido, ese código
 * solo baja cuando alguien entra a /admin.
 */
const Login = lazy(() => import('./paginas/admin/Login'));
const Dashboard = lazy(() => import('./paginas/admin/Dashboard'));
const VehiculoEditar = lazy(() => import('./paginas/admin/VehiculoEditar'));
const SucursalesAdmin = lazy(() => import('./paginas/admin/SucursalesAdmin'));
const Consultas = lazy(() => import('./paginas/admin/Consultas'));
const CarruselAdmin = lazy(() => import('./paginas/admin/CarruselAdmin'));

export default function App() {
  const { pathname } = useLocation();
  const esAdmin = pathname.startsWith('/admin');

  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-negro">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<Cargando />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/vehiculo/:slug" element={<Vehiculo />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/sucursales" element={<Sucursales />} />
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={<RutaProtegida><Dashboard /></RutaProtegida>} />
          <Route path="/admin/vehiculo/nuevo" element={<RutaProtegida><VehiculoEditar /></RutaProtegida>} />
          <Route path="/admin/vehiculo/:id" element={<RutaProtegida><VehiculoEditar /></RutaProtegida>} />
          <Route path="/admin/sucursales" element={<RutaProtegida><SucursalesAdmin /></RutaProtegida>} />
          <Route path="/admin/carrusel" element={<RutaProtegida><CarruselAdmin /></RutaProtegida>} />
          <Route path="/admin/consultas" element={<RutaProtegida><Consultas /></RutaProtegida>} />
          <Route path="*" element={<NoEncontrado />} />
        </Routes>
        </Suspense>
      </main>
      <Footer />
      {!esAdmin && <BotonWhatsApp />}
    </div>
  );
}
