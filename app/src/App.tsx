import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './componentes/Header';
import Footer from './componentes/Footer';
import BotonWhatsApp from './componentes/BotonWhatsApp';
import Home from './paginas/Home';
import Catalogo from './paginas/Catalogo';
import Vehiculo from './paginas/Vehiculo';
import Nosotros from './paginas/Nosotros';
import Sucursales from './paginas/Sucursales';
import NoEncontrado from './paginas/NoEncontrado';
import Login from './paginas/admin/Login';
import Dashboard from './paginas/admin/Dashboard';
import VehiculoEditar from './paginas/admin/VehiculoEditar';
import SucursalesAdmin from './paginas/admin/SucursalesAdmin';
import Consultas from './paginas/admin/Consultas';
import CarruselAdmin from './paginas/admin/CarruselAdmin';
import RutaProtegida from './componentes/admin/RutaProtegida';

export default function App() {
  const { pathname } = useLocation();
  const esAdmin = pathname.startsWith('/admin');

  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-negro">
      <Header />
      <main className="flex-1">
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
      </main>
      <Footer />
      {!esAdmin && <BotonWhatsApp />}
    </div>
  );
}
