import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { svelteTesting } from '@testing-library/svelte/vite';
import path from 'path';

export default defineConfig({
  plugins: [],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['tests/**/*.test.ts'],
    alias: {
      'obsidian': path.resolve(__dirname, './tests/obsidian-mocks.ts'),
    },
    setupFiles: ['./vitest-setup.js'],
  },
});
