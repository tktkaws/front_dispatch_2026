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
