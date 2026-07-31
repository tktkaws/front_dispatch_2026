/// <reference types="astro/client" />

type ColorScheme = 'light' | 'dark';
type MotionPreference = 'motion' | 'reduce';

interface ColorSchemeController {
	STORAGE_KEY: string;
	resolve: () => ColorScheme;
	apply: (scheme: ColorScheme) => void;
	toggle: () => void;
}

interface MotionPreferenceController {
	STORAGE_KEY: string;
	resolve: () => MotionPreference;
	apply: (preference: MotionPreference) => void;
	toggle: () => void;
	prefersReduced: () => boolean;
}

interface Window {
	__colorScheme?: ColorSchemeController;
	__motionPreference?: MotionPreferenceController;
	swup?: {
		hooks: {
			on: (hook: string, handler: (visit: { animation: { animate: boolean } }) => void) => void;
		};
	};
}
