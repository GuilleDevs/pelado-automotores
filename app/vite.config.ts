import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        // Firebase pesa más que la app entera y cambia mucho menos: en su propio
        // archivo, cada deploy solo invalida el código del sitio y el visitante
        // recurrente no vuelve a bajarlo.
        manualChunks: {
          firebase: ['firebase/app', 'firebase/firestore', 'firebase/auth', 'firebase/storage'],
          react: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
});
