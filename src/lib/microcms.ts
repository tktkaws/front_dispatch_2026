import { bundledLanguages, codeToHtml } from 'shiki';

/** Strip HTML tags and collapse whitespace for meta descriptions. */
export function plainTextExcerpt(html: string, maxLength = 120): string {
	const text = html
		.replace(/<[^>]*>/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();

	if (text.length <= maxLength) {
		return text;
	}

	return `${text.slice(0, maxLength).trimEnd()}…`;
}

export type Heading = {
	depth: 2 | 3;
	slug: string;
	text: string;
};

/** Extract h2/h3 headings and ensure each has an id for in-page links. */
export function withHeadingIds(html: string): { html: string; headings: Heading[] } {
	const headings: Heading[] = [];
	let counter = 0;

	const htmlWithIds = html.replace(
		/<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi,
		(_full, level: string, attrs: string, inner: string) => {
			const depth = Number(level) as 2 | 3;
			const text = inner.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
			const idMatch = attrs.match(/\bid=["']([^"']+)["']/i);
			let slug = idMatch?.[1];
			let nextAttrs = attrs;

			if (!slug) {
				counter += 1;
				slug = `heading-${counter}`;
				nextAttrs = attrs.trim() ? `${attrs} id="${slug}"` : ` id="${slug}"`;
			}

			if (text) {
				headings.push({ depth, slug, text });
			}

			return `<h${level}${nextAttrs}>${inner}</h${level}>`;
		},
	);

	return { html: htmlWithIds, headings };
}

function decodeHtmlEntities(text: string): string {
	return text
		.replace(/&nbsp;/g, ' ')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/&amp;/g, '&');
}

function resolveLanguage(...attrs: string[]): string {
	const joined = attrs.join(' ');
	const match = joined.match(/language-([\w+#.-]+)/i);
	const lang = match?.[1]?.toLowerCase();

	if (lang && lang in bundledLanguages) {
		return lang;
	}

	return 'plaintext';
}

/** Highlight microCMS `<pre><code>` blocks with Shiki. */
export async function highlightCodeBlocks(html: string): Promise<string> {
	const codeBlockPattern = /<pre([^>]*)>\s*<code([^>]*)>([\s\S]*?)<\/code>\s*<\/pre>/gi;
	const matches = [...html.matchAll(codeBlockPattern)];

	if (matches.length === 0) {
		return html;
	}

	const replacements = await Promise.all(
		matches.map(async (match) => {
			const [full, preAttrs = '', codeAttrs = '', rawCode = ''] = match;
			const lang = resolveLanguage(preAttrs, codeAttrs);
			const code = decodeHtmlEntities(rawCode);

			const themes = {
				light: 'github-light',
				dark: 'github-dark',
			} as const;

			try {
				const highlighted = await codeToHtml(code, {
					lang,
					themes,
				});
				return { full, highlighted };
			} catch {
				const highlighted = await codeToHtml(code, {
					lang: 'plaintext',
					themes,
				});
				return { full, highlighted };
			}
		}),
	);

	let result = html;
	for (const { full, highlighted } of replacements) {
		result = result.replace(full, () => highlighted);
	}

	return result;
}
