const ENTER_MS = 400;
const STAGGER_MS = 100;

function isHomePath(pathname: string) {
	return pathname === '/' || pathname === '';
}

function playHomeArticlesStagger() {
	if (!isHomePath(window.location.pathname)) return;
	if (window.__motionPreference?.prefersReduced()) return;

	const root = document.querySelector('#articles');
	if (!(root instanceof HTMLElement)) return;

	const items = root.querySelectorAll('.article-item');
	if (items.length === 0) return;

	root.classList.remove('is-home-stagger', 'is-home-stagger-active');
	root.classList.add('is-home-stagger');

	requestAnimationFrame(() => {
		requestAnimationFrame(() => {
			root.classList.add('is-home-stagger-active');
		});
	});

	const totalMs = (items.length - 1) * STAGGER_MS + ENTER_MS + 50;
	window.setTimeout(() => {
		root.classList.remove('is-home-stagger', 'is-home-stagger-active');
	}, totalMs);
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

function bindHomeArticlesStagger(swup: NonNullable<Window['swup']>) {
	swup.hooks.on('page:view', (visit) => {
		// Fragment visits already animate #articles via swup classes
		if (visit.fragmentVisit) return;
		playHomeArticlesStagger();
	});
}

if (!window.__homeArticlesStaggerBound) {
	window.__homeArticlesStaggerBound = true;
	whenSwupReady(bindHomeArticlesStagger);
}
