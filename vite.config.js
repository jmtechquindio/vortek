import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base is required so that the app can be served from a subpath
// (github.io/<repo-name>/). It also ensures assets are referenced
// correctly in the generated `index.html`.
export default defineConfig({
  base: '/vortek/',
  plugins: [react()],
});
