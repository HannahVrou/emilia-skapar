import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
        // base: '/dold/dist/',
  plugins: [react()],
  server: {
    port: 5174,
//   cors: true,
  // build: {
  //   outDir: 'dist',
  //   copyPublicDir: true,
  // }
    hmr: {
      hmr: true,
      protocol: 'ws',
      host: 'localhost',
      port: 5174,
    }
  }
})

