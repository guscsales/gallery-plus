import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['server/main.ts'],
  outDir: 'server/dist',
  format: ['esm'],
  target: 'node18',
  clean: true,
  sourcemap: true,
  minify: true,
  bundle: true,
  splitting: false,
  treeshake: true,
  external: [
    // Keep external dependencies as external
    'fastify',
    '@fastify/multipart', 
    '@fastify/static',
    'zod'
  ],
  esbuildOptions(options) {
    // Preserve the folder structure
    options.outbase = 'server'
  },
  onSuccess: async () => {
    console.log('✅ Server build completed successfully!')
  }
}); 