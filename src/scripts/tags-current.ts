function syncCurrentTag() {
	const nav = document.querySelector('#tags nav[aria-label="Tags"]');
	if (!(nav instanceof HTMLElement)) return;

	const currentSlug = window.location.pathname.match(/^\/tags\/([^/]+)\/?$/)?.[1] ?? null;

	for (const link of nav.querySelectorAll<HTMLAnchorElement>('a.tag-link')) {
		const linkSlug = link.pathname.match(/^\/tags\/([^/]+)\/?$/)?.[1] ?? null;
		const isCurrent = currentSlug !== null && linkSlug === currentSlug;

		link.classList.toggle('current', isCurrent);
		if (isCurrent) {
			link.setAttribute('aria-current', 'page');
		} else {
			link.removeAttribute('aria-current');
		}
	}
}

syncCurrentTag();
document.addEventListener('astro:page-load', syncCurrentTag);
