
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://yourusername.github.io/your-repo-name', // Replace this
  base: '/your-repo-name/', // Replace this
  integrations: [tailwind(), sitemap()],
  output: 'static'
});
