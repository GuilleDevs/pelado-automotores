import type { Timestamp } from 'firebase/firestore';

export type Combustible = 'Nafta' | 'Nafta/GNC' | 'Diesel' | 'Eléctrico' | 'Híbrido';
export type Transmision = 'Manual' | 'Automática';
export type EstadoVehiculo = 'disponible' | 'reservado' | 'vendido';
export type Moneda = 'ARS' | 'USD';

export interface Foto {
  url: string;
  path: string;
  orden: number;
}

export interface Condiciones {
  financiacionDni: boolean;
  cuotasFijas: boolean;
  permuta: boolean;
}

export interface Vehiculo {
  id: string;
  marca: string;
  modelo: string;
  anio: number;
  precio: number;
  moneda: Moneda;
  sucursalId: string;
  motor: string;
  combustible: Combustible;
  transmision: Transmision;
  kilometraje: number;
  color: string;
  descripcion: string;
  condiciones: Condiciones;
  estado: EstadoVehiculo;
  publicado: boolean;
  fotos: Foto[];
  slug: string;
  creadoEn?: Timestamp;
  actualizadoEn?: Timestamp;
}

export interface Sucursal {
  id: string;
  nombre: string;
  direccion: string;
  telefono: string;
  whatsapp: string;
  horarios: string;
  mapaQuery: string;
  orden: number;
}

/**
 * Slide del carrusel del home. Es curado a mano y vive aparte del catálogo:
 * las fotos del hero se recortan para ese espacio y no son las del vehículo.
 */
export interface SlideCarrusel {
  id: string;
  url: string;
  path: string;
  titulo: string;
  orden: number;
}

export interface Lead {
  id: string;
  nombre: string;
  telefono: string;
  mensaje: string;
  vehiculoId: string | null;
  vehiculoTitulo: string | null;
  origen: 'ficha' | 'contacto';
  leido: boolean;
  creadoEn?: Timestamp;
}

export interface Filtros {
  marca: string;
  precioMax: string;
  anioDesde: string;
  combustible: string;
  sucursalId: string;
  estado: string;
  orden: 'nuevos' | 'asc' | 'desc';
}

export const FILTROS_VACIOS: Filtros = {
  marca: '', precioMax: '', anioDesde: '', combustible: '',
  sucursalId: '', estado: '', orden: 'nuevos',
};

export const VEHICULO_NUEVO = {
  marca: '', modelo: '', anio: new Date().getFullYear(), precio: 0,
  moneda: 'ARS' as Moneda, sucursalId: '', motor: '', combustible: 'Nafta' as Combustible,
  transmision: 'Manual' as Transmision, kilometraje: 0, color: '', descripcion: '',
  condiciones: { financiacionDni: true, cuotasFijas: true, permuta: true },
  estado: 'disponible' as EstadoVehiculo, publicado: false, fotos: [] as Foto[],
};
