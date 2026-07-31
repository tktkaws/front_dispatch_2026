let abortController: AbortController | null = null;

function initArticleMenu() {
	abortController?.abort();
	abortController = new AbortController();
	const { signal } = abortController;

	const article = document.querySelector('[data-article]');
	const menu = document.querySelector('[data-article-menu]');
	const panel = document.querySelector('#article-menu-panel');
	const header = document.querySelector('.article-header');
	const trigger = document.querySelector('[data-article-menu-trigger]');

	if (
		!(article instanceof HTMLElement) ||
		!(menu instanceof HTMLElement) ||
		!(panel instanceof HTMLElement) ||
		!(header instanceof HTMLElement) ||
		!(trigger instanceof HTMLElement)
	) {
		return;
	}

	const getInset = () => {
		const rem =
			parseFloat(getComputedStyle(menu).getPropertyValue('--article-menu-inset')) || 1.5;
		return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
	};
	let headerGone = false;

	const setExpanded = () => {
		trigger.setAttribute('aria-expanded', String(menu.classList.contains('is-open')));
	};

	const openMenu = () => {
		menu.classList.add('is-open');
		setExpanded();
	};

	const closeMenu = () => {
		menu.classList.remove('is-open');
		setExpanded();
	};

	const toggleMenu = () => {
		if (menu.classList.contains('is-open')) {
			closeMenu();
		} else {
			openMenu();
		}
	};

	const syncMenu = () => {
		const articleBottom = article.getBoundingClientRect().bottom;
		const docked = articleBottom <= window.innerHeight - getInset();
		menu.classList.toggle('is-docked', docked);
		menu.classList.toggle('is-visible', headerGone);
		if (!headerGone) {
			closeMenu();
		}
		setExpanded();
	};

	const headerObserver = new IntersectionObserver(
		([entry]) => {
			headerGone = !entry.isIntersecting;
			syncMenu();
		},
		{ threshold: 0 },
	);

	headerObserver.observe(header);
	signal.addEventListener('abort', () => headerObserver.disconnect());

	window.addEventListener('scroll', syncMenu, { passive: true, signal });
	window.addEventListener('resize', syncMenu, { signal });
	syncMenu();

	trigger.addEventListener('click', () => {
		toggleMenu();
	}, { signal });

	/* コンテンツボタン・パネル以外のクリック／タッチで閉じる */
	document.addEventListener(
		'pointerdown',
		(event) => {
			if (!(event.target instanceof Node)) return;
			if (trigger.contains(event.target) || panel.contains(event.target)) return;
			closeMenu();
		},
		{ signal },
	);

	menu.addEventListener(
		'click',
		(event) => {
			if (!(event.target instanceof Element)) return;
			if (event.target.closest('a[href^="#"]')) {
				closeMenu();
			}
		},
		{ signal },
	);
}

initArticleMenu();
document.addEventListener('astro:page-load', initArticleMenu);
