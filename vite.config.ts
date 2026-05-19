import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  preview: {
    allowedHosts: true,
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://api.library.iomd.site',
        changeOrigin: true,
        secure: false,
        headers: {
          Origin: 'https://library.iomd.site',
          Referer: 'https://library.iomd.site/'
        }
      }
    }
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('html2pdf.js')) return 'vendor-pdf';
            if (id.includes('react')) return 'vendor-react';
            if (id.includes('lucide-react')) return 'vendor-ui';
            if (id.includes('@radix-ui')) return 'vendor-radix';
            return 'vendor';
          }
        }
      }
    }
  },
})
