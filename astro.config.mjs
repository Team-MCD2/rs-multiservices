import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://rsmultiservices.fr', // Remplacez par votre domaine final si différent
  integrations: [sitemap()],
});
