# Pelado Automotores

Sitio público + panel de administración para la concesionaria Pelado Automotores
(La Consulta y Guaymallén, Mendoza).

- **Frontend:** Vite + React 18 + TypeScript + Tailwind
- **Datos:** Firestore · **Fotos:** Firebase Storage · **Login:** Firebase Auth
- **Hosting:** Cloudflare Pages + Pages Functions
- **Anti-spam:** Cloudflare Turnstile

El diseño de referencia (paleta, tipografía, layout de cada pantalla) está documentado en
`prompt_pelado_automotores.md`, en la raíz del proyecto de diseño.

---

## 1. Arrancar en local

```bash
npm install
cp .env.example .env      # completar con los datos del proyecto de Firebase
npm run dev
```

Sin `VITE_TURNSTILE_SITE_KEY` el formulario de contacto no bloquea el envío, para poder
probar en desarrollo.

## 2. Crear el proyecto de Firebase

1. [console.firebase.google.com](https://console.firebase.google.com) → **Agregar proyecto**
   → nombre `pelado-automotores`.
2. **Firestore Database** → Crear base de datos → modo producción → región `southamerica-east1`.
3. **Storage** → Comenzar → misma región.
4. **Authentication** → Comenzar → habilitar **Correo electrónico/contraseña**.
   Dejar el registro deshabilitado: los usuarios se crean a mano.
5. **Configuración del proyecto** → Tus apps → Web → registrar app → copiar la config
   en las variables `VITE_FIREBASE_*` del `.env`.

### Desplegar reglas e índices

```bash
npm install -g firebase-tools
firebase login
firebase use --add            # elegir pelado-automotores
npm run deploy:rules
```

### Carga inicial y usuarios admin

```bash
# Configuración del proyecto -> Cuentas de servicio -> Generar nueva clave privada
# guardar como service-account.json (está en .gitignore)
GOOGLE_APPLICATION_CREDENTIALS=./service-account.json npm run seed
```

Después, para cada dueño:

1. **Authentication → Add user**: email y contraseña. Copiar el **UID**.
2. **Firestore → colección `admins`** → nuevo documento con **ID = ese UID**, campos
   `email` (string) y `nombre` (string).

Existir en `admins/{uid}` es lo único que habilita escribir. Si el usuario no está en
esa colección, el login lo rechaza y cierra la sesión.

## 3. Cloudflare Turnstile

1. Dashboard de Cloudflare → **Turnstile** → Add site → dominio del sitio.
2. La **Site key** va en `VITE_TURNSTILE_SITE_KEY`.
3. La **Secret key** va en las variables de Pages como `TURNSTILE_SECRET_KEY`
   (nunca en el repo).

## 4. Desplegar en Cloudflare Pages

1. Dashboard → **Workers & Pages** → Create → Pages → Connect to Git →
   repositorio `GuilleDevs/pelado-automotores`.
2. Build settings:
   - Framework preset: **None**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `app` (si el repo mantiene esta estructura)
   - Node version: `20`
3. **Settings → Environment variables**, en Production y Preview:

   | Variable | Tipo |
   | --- | --- |
   | `VITE_FIREBASE_*` (las 6) | texto |
   | `VITE_TURNSTILE_SITE_KEY` | texto |
   | `TURNSTILE_SECRET_KEY` | **secreto** |
   | `FIREBASE_SERVICE_ACCOUNT` | **secreto** — el JSON en una sola línea |
   | `FIREBASE_PROJECT_ID` | texto |
   | `SITIO_URL` | texto — `https://tudominio.com.ar` |

4. **Custom domains** → agregar el dominio propio.
5. En Firebase → **Authentication → Settings → Authorized domains**, agregar el dominio
   de producción y `*.pages.dev`.

`public/_redirects` ya resuelve el fallback de la SPA: sin ese archivo, entrar directo a
`/catalogo` devuelve 404.

## 5. Estructura

```
app/
├── functions/            Pages Functions (formulario de contacto, headers)
├── public/               estáticos, _redirects, robots.txt
├── scripts/
│   ├── seed.mjs          carga inicial de sucursales y el primer vehículo
│   └── postbuild.mjs     prerender de fichas + sitemap.xml
├── src/
│   ├── lib/              firebase, queries, formato, imágenes, auth
│   ├── componentes/      UI compartida (+ admin/)
│   └── paginas/          una por ruta (+ admin/)
├── firestore.rules       lectura pública solo de publicados; escritura solo admin
├── storage.rules         fotos públicas; subida solo admin, máx 2 MB, solo imágenes
└── firestore.indexes.json
```

## 6. Para el día a día (los dueños)

- Entrar a `/admin/login` con el email y la contraseña.
- **+ Nuevo vehículo** → arrastrar las fotos (la primera es la portada, se puede
  reordenar arrastrando) → completar los campos → **Publicar**.
- Cambiar el estado desde el listado: el select guarda solo, sin confirmar.
  Los vendidos desaparecen del catálogo público.
- **Guardar borrador** deja el vehículo cargado pero invisible en el sitio.
- **Consultas** muestra lo que llega del formulario, con un botón para responder
  por WhatsApp.
- **Sucursales** edita direcciones, teléfonos y horarios sin tocar código.

## 7. Decisiones que conviene conocer antes de cambiar algo

- **Los leads no se escriben desde el navegador.** El formulario postea a
  `/api/contacto`, que valida Turnstile y recién entonces escribe con service account.
  Permitir el alta desde el cliente hace que el widget sea decorativo.
- **Toda lectura pública de `vehiculos` lleva `where('publicado','==',true)`.** Las reglas
  de Firestore no filtran resultados: una query sin ese filtro falla completa.
- **El `slug` no se recalcula al editar.** Los links compartidos por WhatsApp siguen
  funcionando aunque cambie el precio o el modelo.
- **Los filtros de baja cardinalidad se aplican en el cliente** para no multiplicar
  índices compuestos. Con decenas de vehículos es lo correcto; a partir de varios
  cientos, mover a índices por filtro.
- **Radio 0 en todo y el verde solo como acento.** Es lo que hace que el sitio se lea
  como extensión del Instagram.

## 8. Pendientes de confirmar con el cliente

- Horarios exactos de cada sucursal (el seed usa un supuesto).
- Si Guaymallén tiene un WhatsApp propio distinto al de La Consulta.
- Razón social y CUIT para los legales del footer.
- Si los vendidos se ocultan o se muestran tachados como prueba social.
- Inventario real: solo está confirmada la Ford Fiesta Kinetic Titanium 2012.
