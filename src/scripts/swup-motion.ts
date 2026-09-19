function disableMotionForVisit(visit: SwupVisit) {
	if (!window.__motionPreference?.prefersReduced()) return;
	// Match a11y plugin's OS reduced-motion path: skip both page fade and scroll tween
	visit.animation.animate = false;
	if (visit.scroll) visit.scroll.animate = false;
}

function bindSwupMotion(swup: NonNullable<Window['swup']>) {
	// before: so scroll.animate is cleared before Scroll Plugin scrolls
	for (const hook of ['visit:start', 'link:self', 'link:anchor'] as const) {
		swup.hooks.before(hook, disableMotionForVisit);
	}
}

function whenSwupReady(callback: (swup: NonNullable<Window['swup']>) => void) {
	if (window.swup) {
		callback(window.swup);
		return;
	}

	const tryBind = () => {
		if (!window.swup) return false;
		observer.disconnect();
		clearInterval(pollId);
		callback(window.swup);
		return true;
	};

	const observer = new MutationObserver(() => {
		tryBind();
	});
	observer.observe(document.documentElement, {
		attributes: true,
		attributeFilter: ['class'],
	});

	const pollId = window.setInterval(() => {
		tryBind();
	}, 50);
}

whenSwupReady(bindSwupMotion);
