const API_ORIGIN = 'https://smart.mambaulhikmah.com';
const API_BASE = `${API_ORIGIN}/api`;

export interface BlogPost {
	id: number;
	title: string;
	slug: string;
	excerpt: string | null;
	content?: string | null;
	thumbnail: string | null;
	category: string | null;
	author: string | null;
	created_at: string;
}

interface BlogContentBlock {
	type?: string;
	text?: string;
}

interface BlogBlocksContent {
	type?: string;
	blocks?: BlogContentBlock[];
}

export interface BlogPagination {
	data: BlogPost[];
	current_page: number;
	last_page: number;
	per_page: number;
	total: number;
}

interface BlogListParams {
	page?: number;
	perPage?: number;
	category?: string;
}

const emptyPagination = (params: BlogListParams = {}): BlogPagination => ({
	data: [],
	current_page: params.page ?? 1,
	last_page: 1,
	per_page: params.perPage ?? 10,
	total: 0,
});

export function getBlogImageUrl(thumbnail: string | null | undefined) {
	if (!thumbnail) return null;
	if (thumbnail.startsWith('http://') || thumbnail.startsWith('https://')) return thumbnail;
	return new URL(thumbnail, API_ORIGIN).toString();
}

export function formatBlogDate(value: string | null | undefined) {
	if (!value) return '';

	return new Intl.DateTimeFormat('id-ID', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	}).format(new Date(value));
}

function escapeHtml(value: string) {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#39;');
}

function isArabicText(value: string) {
	return /[\u0600-\u06ff]/.test(value);
}

function isCleanHeading(value: string) {
	const text = value.trim();
	return text.length > 0 && text.length <= 90 && !text.includes('\n');
}

function renderLines(text: string) {
	return text
		.split(/\n+/)
		.map((line) => line.trim())
		.filter(Boolean)
		.map((line) => {
			const escapedLine = escapeHtml(line);
			const isArabic = isArabicText(line);

			if (line.startsWith('(') && line.endsWith(')')) {
				return `<p class="article-citation">${escapedLine}</p>`;
			}

			return `<p${isArabic ? ' class="arabic-text" dir="rtl" lang="ar"' : ''}>${escapedLine}</p>`;
		})
		.join('');
}

function renderBlock(block: BlogContentBlock) {
	const type = block.type ?? 'p';
	const text = block.text?.trim() ?? '';

	if (!text) return '';

	if ((type === 'h2' || type === 'h3') && isCleanHeading(text)) {
		return `<${type}>${escapeHtml(text)}</${type}>`;
	}

	if (type === 'quote') {
		return `<blockquote>${renderLines(text)}</blockquote>`;
	}

	return renderLines(text);
}

export function renderBlogContent(content: string | null | undefined) {
	if (!content) return '';

	const trimmedContent = content.trim();

	try {
		const parsed = JSON.parse(trimmedContent) as BlogBlocksContent;

		if (parsed.type === 'blocks' && Array.isArray(parsed.blocks)) {
			return parsed.blocks.map(renderBlock).join('');
		}
	} catch {
		// Keep existing HTML content working when the API sends normal markup.
	}

	return content;
}

async function fetchJson<T>(path: string): Promise<T | null> {
	try {
		const response = await fetch(`${API_BASE}${path}`, {
			headers: {
				Accept: 'application/json',
			},
		});

		if (!response.ok) return null;
		return (await response.json()) as T;
	} catch {
		return null;
	}
}

export async function getBlogs(params: BlogListParams = {}) {
	const search = new URLSearchParams();
	search.set('page', String(params.page ?? 1));
	search.set('per_page', String(params.perPage ?? 10));

	if (params.category) {
		search.set('category', params.category);
	}

	return (await fetchJson<BlogPagination>(`/blog?${search.toString()}`)) ?? emptyPagination(params);
}

export async function getLatestBlogs(limit = 3) {
	return (await fetchJson<BlogPost[]>(`/blog?limit=${limit}`)) ?? [];
}

export async function getAllBlogs() {
	const firstPage = await getBlogs({ page: 1, perPage: 100 });
	const blogs = [...firstPage.data];

	for (let page = 2; page <= firstPage.last_page; page += 1) {
		const nextPage = await getBlogs({ page, perPage: 100 });
		blogs.push(...nextPage.data);
	}

	return blogs;
}

export async function getBlogBySlug(slug: string) {
	return await fetchJson<BlogPost>(`/blog/${encodeURIComponent(slug)}`);
}
