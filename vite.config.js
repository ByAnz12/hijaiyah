import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // build bisa dibuka dari sub-folder mana pun
  build: {
    chunkSizeWarningLimit: 1500,
  },
});
