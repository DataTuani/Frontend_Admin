import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  },
  // Para producción - importante que sea './' para que funcione en subrutas
  base: './'
  // agregale conf de rutas que cominenzan  con /minsa para que se puedan ver
  
})