import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      }
    },
    lib: {
      entry: resolve(__dirname, 'src/commands/open-preview-ast/webview.js'),
      formats: ['es'],
      fileName: 'open-preview-webview-ast',
    },
  },
});