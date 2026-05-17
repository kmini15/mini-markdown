import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    cssCodeSplit: false,
    rollupOptions: {
      external: ["vscode"],
      output: {
        inlineDynamicImports: true,
      }
    },
    lib: {
      entry: 'src/extension.js',
      formats: ['es'],
      fileName: 'extension',
    },
  },
});