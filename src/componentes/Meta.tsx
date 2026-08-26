import { Helmet } from 'react-helmet-async';
import { SITIO } from '../lib/constantes';

interface Props {
  titulo: string;
  descripcion: string;
  imagen?: string;
  ruta?: string;
  jsonLd?: object;
}

export default function Meta({ titulo, descripcion, imagen, ruta, jsonLd }: Props) {
  const url = SITIO + (ruta ?? '');
  const og = imagen || `${SITIO}/og-default.jpg`;
  return (
    <Helmet>
      <title>{titulo}</title>
      <meta name="description" content={descripcion} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={titulo} />
      <meta property="og:description" content={descripcion} />
      <meta property="og:image" content={og} />
      <meta property="og:url" content={url} />
      <meta name="twitter:card" content="summary_large_image" />
      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </Helmet>
  );
}
