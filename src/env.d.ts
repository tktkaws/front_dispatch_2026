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

interface SwupVisit {
	fragmentVisit?: unknown;
	animation: { animate: boolean };
	scroll?: { animate?: boolean; reset?: boolean; target?: string };
	to?: { url?: string };
}

interface Window {
	__colorScheme?: ColorSchemeController;
	__motionPreference?: MotionPreferenceController;
	__homeArticlesStaggerBound?: boolean;
	swup?: {
		visit?: SwupVisit;
		hooks: {
			on: (hook: string, handler: (visit: SwupVisit) => void) => void;
			before: (hook: string, handler: (visit: SwupVisit) => void) => void;
		};
	};
}
