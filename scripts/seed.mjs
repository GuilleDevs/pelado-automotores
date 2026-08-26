/**
 * Carga inicial: las dos sucursales y la Ford Fiesta confirmada.
 *   GOOGLE_APPLICATION_CREDENTIALS=./service-account.json npm run seed
 * Es idempotente en sucursales (ids fijos) y no duplica el vehículo si ya existe el slug.
 */
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

initializeApp({ credential: applicationDefault() });
const db = getFirestore();

const SUCURSALES = [
  {
    id: 'la-consulta',
    nombre: 'La Consulta',
    direccion: 'Sargento Baigorria 555, La Consulta, Mendoza',
    telefono: '2622569535',
    whatsapp: '5492622569535',
    horarios: 'Lunes a viernes 9 a 13 y 17 a 20 · Sábados 9 a 13',
    mapaQuery: 'Sargento Baigorria 555, La Consulta, Mendoza',
    orden: 0,
  },
  {
    id: 'guaymallen',
    nombre: 'Guaymallén',
    direccion: 'Avellaneda 1681, Guaymallén, Mendoza',
    telefono: '2622569535',
    whatsapp: '5492622569535',
    horarios: 'Lunes a viernes 9 a 13 y 17 a 20 · Sábados 9 a 13',
    mapaQuery: 'Avellaneda 1681, Guaymallen, Mendoza',
    orden: 1,
  },
];

// Único vehículo confirmado por el cliente. El resto se carga desde el panel.
const VEHICULO = {
  marca: 'Ford',
  modelo: 'Fiesta Kinetic Titanium',
  anio: 2012,
  precio: 11900000,
  moneda: 'ARS',
  sucursalId: 'la-consulta',
  motor: '1.6',
  combustible: 'Nafta/GNC',
  transmision: 'Manual',
  kilometraje: 210000,
  color: 'Gris',
  descripcion:
    'Fiesta Kinetic Titanium con GNC de 5ta generación y cubiertas nuevas. Se recibe permuta.',
  condiciones: { financiacionDni: true, cuotasFijas: true, permuta: true },
  estado: 'disponible',
  publicado: true,
  fotos: [],
};

const slugify = (s) =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

for (const s of SUCURSALES) {
  const { id, ...datos } = s;
  await db.collection('sucursales').doc(id).set(datos, { merge: true });
  console.log('sucursal ok:', id);
}

const ref = db.collection('vehiculos').doc();
const slug = `${slugify(VEHICULO.marca)}-${slugify(VEHICULO.modelo)}-${VEHICULO.anio}-${ref.id.slice(0, 4).toLowerCase()}`;
const existe = await db.collection('vehiculos')
  .where('marca', '==', VEHICULO.marca)
  .where('modelo', '==', VEHICULO.modelo)
  .where('anio', '==', VEHICULO.anio)
  .limit(1).get();

if (existe.empty) {
  await ref.set({
    ...VEHICULO, slug,
    creadoEn: FieldValue.serverTimestamp(),
    actualizadoEn: FieldValue.serverTimestamp(),
  });
  console.log('vehículo cargado:', slug);
} else {
  console.log('el vehículo ya existe, no se duplica');
}

console.log('\nListo. Falta crear los usuarios admin:');
console.log('1. Firebase Console -> Authentication -> Add user (email + contraseña)');
console.log('2. Firestore -> colección "admins" -> doc con ID = uid del usuario');
console.log('   campos: email (string), nombre (string)');
process.exit(0);
