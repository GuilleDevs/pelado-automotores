/** Tokens tomados del diseño de referencia. No agregar colores fuera de esta lista. */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        negro: '#0A0A0A',
        'negro-2': '#111111',
        carta: '#141414',
        surface: '#161616',
        borde: '#2B2B2B',
        'borde-suave': '#1F1F1F',
        verde: '#46E02D',
        'verde-hover': '#7BF25F',
        blanco: '#FFFFFF',
        'txt-2': '#B5B5B5',
        'txt-3': '#9A9A9A',
        'txt-4': '#8A8A8A',
        'txt-5': '#6E6E6E',
        reservado: '#FFB01F',
        vendido: '#3A3A3A',
        'vendido-txt': '#C9C9C9',
      },
      fontFamily: {
        display: ['"Archivo Narrow"', 'sans-serif'],
        sans: ['Archivo', 'sans-serif'],
      },
      // Medios pasos usados en el layout (p-4.5, py-5.5): Tailwind no los trae por defecto.
      spacing: { 4.5: '1.125rem', 5.5: '1.375rem' },
      borderRadius: { none: '0px', DEFAULT: '0px', md: '0px', lg: '0px', full: '0px' },
    },
  },
  plugins: [],
};
