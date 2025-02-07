// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Allow connections from any IP
    port: 5173,
   
  },
  base: '/',
  build: {
    rollupOptions: {
      input: {
        app: './index.html',
        'firebase-messaging-sw': './public/firebase-messaging-sw.js',
      },
    },
  },
});