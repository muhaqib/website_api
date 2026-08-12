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

const FALLBACK_BLOGS: BlogPost[] = [
	{
		id: 6,
		title: 'Cara Al-Qur’an Menguatkan Nabi Muhammad saat Dakwahnya Ditolak',
		slug: 'cara-al-quran-menguatkan-nabi-muhammad-saat-dakwahnya-ditolak',
		excerpt:
			'Allah mengingatkan bahwa hidayah ada dalam ketetapan-Nya. Nabi hanya bertugas menyampaikan, bukan memaksa hati manusia untuk beriman.',
		content:
			'{"type":"blocks","blocks":[{"type":"p","text":"Baginda Nabi Muhammad SAW pernah mengalami kesedihan yang sangat dalam ketika dakwahnya ditolak oleh kaum Quraisy. Bukan hanya ditolak, beliau juga dimusuhi, dihina, dan dituduh dengan berbagai tuduhan yang menyakitkan."},{"type":"quote","text":"Artinya: Tugasmu hanyalah menyampaikan; jangan biarkan kesedihan atas urusan mereka memalingkanmu dari Kami."}]}',
		thumbnail:
			'https://smart.mambaulhikmah.com/storage/blogs/thumbnails/2d1cb522-3f73-4ee6-b86a-d00c92320559.webp',
		category: 'Pendidikan',
		author: 'Ustadz Noval Ali, Lc',
		created_at: '2026-06-30T04:32:58.000000Z',
	},
	{
		id: 5,
		title: 'Mengenal Lingkungan Pembinaan Santri Mambaul Hikmah',
		slug: 'dalwa',
		excerpt:
			'Integrasi kurikulum Al-Qur’an, kitab salaf, dan pendidikan formal untuk mencetak generasi berilmu dan berakhlak.',
		content:
			'{"type":"blocks","blocks":[{"type":"p","text":"Pondok Pesantren Mambaul Hikmah terus berkomitmen menyelenggarakan pendidikan terpadu yang memadukan kedalaman ilmu agama dengan adab dan akhlakul karimah."}]}',
		thumbnail:
			'https://smart.mambaulhikmah.com/storage/blogs/thumbnails/e3d517c1-96b6-4cdb-984f-31d70e7df53a.webp',
		category: 'Keasramaan',
		author: 'Tim Media MH',
		created_at: '2026-06-25T23:51:27.000000Z',
	},
];

async function fetchJson<T>(path: string): Promise<T | null> {
	try {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 15000);
		const separator = path.includes('?') ? '&' : '?';
		const url = `${API_BASE}${path}${separator}_t=${Date.now()}`;
		const response = await fetch(url, {
			headers: {
				Accept: 'application/json',
				'Cache-Control': 'no-cache, no-store, must-revalidate',
				Pragma: 'no-cache',
			},
			cache: 'no-store',
			signal: controller.signal,
		});
		clearTimeout(timeoutId);

		if (!response.ok) return null;
		return (await response.json()) as T;
	} catch (error) {
		console.warn(`[blogApi] Fetch error for path ${path}:`, error);
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

	const res = await fetchJson<BlogPagination>(`/blog?${search.toString()}`);
	if (res && res.data && res.data.length > 0) {
		return res;
	}

	const page = params.page ?? 1;
	const perPage = params.perPage ?? 10;
	const start = (page - 1) * perPage;
	const paginatedData = FALLBACK_BLOGS.slice(start, start + perPage);

	return {
		data: paginatedData.length > 0 ? paginatedData : FALLBACK_BLOGS,
		current_page: page,
		last_page: Math.max(1, Math.ceil(FALLBACK_BLOGS.length / perPage)),
		per_page: perPage,
		total: FALLBACK_BLOGS.length,
	};
}

export async function getLatestBlogs(limit = 3) {
	const res = await fetchJson<BlogPost[]>(`/blog?limit=${limit}`);
	if (res && Array.isArray(res) && res.length > 0) {
		return res;
	}
	return FALLBACK_BLOGS.slice(0, limit);
}

export async function getAllBlogs() {
	const firstPage = await getBlogs({ page: 1, perPage: 100 });
	const blogs = [...firstPage.data];

	for (let page = 2; page <= firstPage.last_page; page += 1) {
		const nextPage = await getBlogs({ page, perPage: 100 });
		blogs.push(...nextPage.data);
	}

	if (blogs.length === 0) {
		return FALLBACK_BLOGS;
	}

	return blogs;
}

export async function getBlogBySlug(slug: string) {
	const res = await fetchJson<BlogPost>(`/blog/${encodeURIComponent(slug)}`);
	if (res) return res;
	return FALLBACK_BLOGS.find((b) => b.slug === slug) ?? FALLBACK_BLOGS[0];
}

