// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import swup from '@swup/astro';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

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
			themes: {
				light: 'github-light',
				dark: 'github-dark',
			},
		},
	},
	vite: {
		plugins: [tailwindcss()],
	},
});
