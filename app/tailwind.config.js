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
      /* El proyecto nacía con radio 0 en todo. La escala vuelve a existir: superficies
         grandes con esquinas amplias, campos intermedios y botones en píldora. */
      borderRadius: {
        none: '0px',
        sm: '8px',
        DEFAULT: '12px',
        md: '14px',
        lg: '18px',
        xl: '22px',
        '2xl': '28px',
        '3xl': '34px',
        full: '9999px',
      },
      /* Profundidad sobre negro: una sombra amplia y muy difusa separa las superficies
         sin recurrir a bordes más claros, que sobre #0A0A0A se ven sucios. */
      boxShadow: {
        carta: '0 1px 2px rgba(0,0,0,.6), 0 18px 40px -20px rgba(0,0,0,.9)',
        alzada: '0 1px 2px rgba(0,0,0,.6), 0 26px 56px -22px rgba(0,0,0,.95)',
        verde: '0 10px 30px -12px rgba(70,224,45,.5)',
      },
    },
  },
  plugins: [],
};
