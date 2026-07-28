import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { createClient } from 'microcms-js-sdk';

const serviceDomain = import.meta.env.MICROCMS_SERVICE_DOMAIN;
const apiKey = import.meta.env.MICROCMS_API_KEY;

if (!serviceDomain || !apiKey) {
	throw new Error(
		'MICROCMS_SERVICE_DOMAIN and MICROCMS_API_KEY must be set in the environment.',
	);
}

const client = createClient({
	serviceDomain,
	apiKey,
});

const microCMSDateFields = {
	createdAt: z.string(),
	updatedAt: z.string(),
	publishedAt: z.string(),
	revisedAt: z.string(),
};

const tagSchema = z.object({
	id: z.string(),
	title: z.string(),
	slug: z.string(),
	...microCMSDateFields,
});

const microCMSLoader = (endpoint: string) => {
	return async () => {
		try {
			console.log(`Fetching ${endpoint} from microCMS...`);
			const contents = await client.getAllContents({ endpoint });
			console.log(`Fetched ${contents.length} ${endpoint} items`);
			return contents;
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			throw new Error(`Failed to fetch ${endpoint} from microCMS: ${message}`);
		}
	};
};

const blogs = defineCollection({
	loader: microCMSLoader('blogs'),
	schema: z.object({
		title: z.string(),
		body: z.string(),
		tags: z.array(tagSchema).optional().default([]),
		...microCMSDateFields,
	}),
});

const tags = defineCollection({
	loader: microCMSLoader('tags'),
	schema: tagSchema,
});

export const collections = { blogs, tags };
