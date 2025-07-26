import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

export default defineConfig({
  plugins: [svelte()],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['tests/**/*.test.ts'],
    setupFiles: ['./vitest-setup.js'],
    alias: [
      { find: /^svelte$/, replacement: 'svelte/internal' },
      { find: 'obsidian', replacement: path.resolve(__dirname, './tests/obsidian-mocks.ts') },
    ],
  },
});
