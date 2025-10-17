import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
  },
  // Añade esta configuración para el build
  build: {
    outDir: 'dist',
    sourcemap: false
  },
  // Importante para las rutas en producción
  base: './'
})