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

	const WIDE_MIN = 1280;

	const getInset = () => {
		const rem =
			parseFloat(getComputedStyle(menu).getPropertyValue('--article-menu-inset')) || 1.5;
		return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
	};
	const isWide = () => window.matchMedia(`(min-width: ${WIDE_MIN}px)`).matches;
	let headerGone = false;
	/** ワイド画面でメニュー出現時に自動で開くか（ユーザーが閉じたら false、非表示でリセット） */
	let preferOpenOnWide = true;

	const setExpanded = () => {
		const isOpen = menu.classList.contains('is-open');
		trigger.setAttribute('aria-expanded', String(isOpen));
		trigger.textContent = isOpen ? 'Close' : 'Contents';
	};

	const openMenu = () => {
		menu.classList.add('is-open');
		setExpanded();
	};

	const closeMenu = (fromUser = false) => {
		menu.classList.remove('is-open');
		if (fromUser) preferOpenOnWide = false;
		setExpanded();
	};

	const toggleMenu = () => {
		if (menu.classList.contains('is-open')) {
			closeMenu(true);
		} else {
			preferOpenOnWide = true;
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
			preferOpenOnWide = true;
		} else if (preferOpenOnWide && isWide()) {
			openMenu();
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

	/* 1280px 未満になったら開いているパネルを閉じる */
	const wideMq = window.matchMedia(`(min-width: ${WIDE_MIN}px)`);
	wideMq.addEventListener(
		'change',
		(event) => {
			if (!event.matches) closeMenu();
		},
		{ signal },
	);

	trigger.addEventListener('click', () => {
		toggleMenu();
	}, { signal });

	/* 1280px 未満のみ: コンテンツボタン・パネル以外のクリック／タッチで閉じる */
	document.addEventListener(
		'pointerdown',
		(event) => {
			if (isWide()) return;
			if (!(event.target instanceof Node)) return;
			if (trigger.contains(event.target) || panel.contains(event.target)) return;
			closeMenu(true);
		},
		{ signal },
	);

	/* 1280px 以上: Escape で閉じる */
	document.addEventListener(
		'keydown',
		(event) => {
			if (event.key !== 'Escape') return;
			if (!isWide() || !menu.classList.contains('is-open')) return;
			closeMenu(true);
		},
		{ signal },
	);

	menu.addEventListener(
		'click',
		(event) => {
			if (!(event.target instanceof Element)) return;
			if (event.target.closest('a[href^="#"]')) {
				closeMenu(true);
			}
		},
		{ signal },
	);
}

if (!window.__articleMenuBound) {
	window.__articleMenuBound = true;
	initArticleMenu();
	document.addEventListener('astro:page-load', initArticleMenu);
}
