/// <reference types="astro/client" />

type ColorScheme = 'light' | 'dark';

interface ColorSchemeController {
	STORAGE_KEY: string;
	resolve: () => ColorScheme;
	apply: (scheme: ColorScheme) => void;
	toggle: () => void;
}

interface Window {
	__colorScheme?: ColorSchemeController;
}
