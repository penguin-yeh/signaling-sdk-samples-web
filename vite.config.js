import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    host: '0.0.0.0'
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        'src/authentication_workflow': resolve(__dirname, 'src/authentication_workflow/index.html'),
        'src/stream_channel': resolve(__dirname, 'src/stream_channel/index.html'),
        // 'src/storage': resolve(__dirname, 'src/storage/index.html'),
      },
    },
  },
})