function bindSwupMotion(swup: NonNullable<Window['swup']>) {
	swup.hooks.on('visit:start', (visit) => {
		if (window.__motionPreference?.prefersReduced()) {
			visit.animation.animate = false;
		}
	});
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
