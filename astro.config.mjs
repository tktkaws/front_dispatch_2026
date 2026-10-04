// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import swup from '@swup/astro';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import { shikiThemes } from './src/lib/shiki-theme.ts';

// https://astro.build/config
export default defineConfig({
	site: 'https://example.com',
	redirects: {
		'/blog': '/',
		'/blog/': '/',
	},
	integrations: [
		mdx(),
		sitemap(),
		swup({
			containers: ['main', 'header'],
			globalInstance: true,
			theme: 'fade',
			// Shared scripts already re-init via astro:page-load / page:view.
			// Re-running inline modules stacks document listeners and breaks toggles.
			reloadScripts: false,
			fragments: [
				{
					from: ['/', '/tags/:slug', '/tags/:slug/'],
					to: ['/', '/tags/:slug', '/tags/:slug/'],
					containers: ['#articles'],
					name: 'tag-filter',
					// Keep focus on the activated tag link (a11y plugin would otherwise move it to body)
					focus: false,
				},
			],
		}),
	],
	markdown: {
		shikiConfig: {
			themes: shikiThemes,
		},
	},
	vite: {
		plugins: [tailwindcss()],
	},
});
