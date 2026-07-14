import { defineConfig } from 'vite';

// base:'./' → відносні шляхи в білді, щоб працювало на будь-якому статик-хостингу
// (у т.ч. у підпапці, напр. GitHub Pages) і при відкритті через локальний сервер.
export default defineConfig({
  base: './',
});
