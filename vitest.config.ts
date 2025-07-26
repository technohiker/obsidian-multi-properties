import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

export default defineConfig({
  plugins: [svelte()],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['tests/**/*.test.ts'],
    setupFiles: ['./tests/test-setup.js'],
  },
  resolve: {
    alias: {
      obsidian: path.resolve(__dirname, 'tests/obsidian.mock.ts'),
    },
  },
});

