import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';
import { plainTextExcerpt } from '../lib/microcms';

export async function GET(context) {
	const posts = await getCollection('blogs');
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: posts.map((post) => ({
			title: post.data.title,
			description: plainTextExcerpt(post.data.body),
			pubDate: new Date(post.data.publishedAt),
			link: `/blog/${post.id}/`,
		})),
	});
}
