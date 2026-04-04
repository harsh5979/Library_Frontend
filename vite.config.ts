import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  build: {
    rolldownOptions: {
      output: {
        advancedChunks: {
          groups: [
            { name: 'vendor-react',  test: /node_modules\/(react|react-dom|react-router)/ },
            { name: 'vendor-query',  test: /node_modules\/@tanstack/ },
            { name: 'vendor-ui',     test: /node_modules\/(framer-motion|lucide-react|sonner)/ },
            { name: 'vendor-radix',  test: /node_modules\/@radix-ui/ },
            { name: 'vendor-form',   test: /node_modules\/(react-hook-form|@hookform|zod)/ },
            { name: 'vendor-utils',  test: /node_modules\/(axios|zustand|clsx|tailwind-merge|class-variance-authority)/ },
          ],
        },
      },
    },
  },
})
