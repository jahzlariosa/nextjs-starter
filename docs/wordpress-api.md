# WordPress GraphQL API

This project exposes WordPress GraphQL endpoints under `app/api/wordpress/posts` and a demo UI at `/wordpress` + `/wordpress/[slug]`. Use these endpoints directly or adapt the provided components.

## Configure

- `WORDPRESS_GRAPHQL_URL` (optional): Full GraphQL endpoint, e.g. `https://your-site.com/graphql`. If unset, the demo endpoint `https://dev-wp-nextjs-starter-be.pantheonsite.io/graphql` is used.
- `WORDPRESS_GRAPHQL_TOKEN` (optional): Bearer token if your endpoint requires auth.

Add these to `.env.local` and restart the dev server.

## List posts

- Path: `GET /api/wordpress/posts`
- Query params:
  - `first` (optional): Page size, default 10, max 50.
  - `after` (optional): Cursor for pagination.
  - `search` (optional): Text search term.
- Behavior:
  - Uses a fixed posts query (ordered by date desc, status `PUBLISH`).
  - `cache: "no-store"` and 8s timeout to keep responses fresh.
  - Returns remote status when WordPress errors.

### Example request

```
GET /api/wordpress/posts?first=5&search=headless
```

### Example response

```
{
  "posts": [
    {
      "id": "cG9zdDoz",
      "databaseId": 3,
      "slug": "hello-world",
      "uri": "/hello-world/",
      "postUrl": "https://your-site.com/hello-world/",
      "title": "Hello world",
      "excerpt": "<p>Excerpt from the post…</p>",
      "date": "2024-12-01T10:00:00",
      "authorName": "Admin",
      "featuredImage": {
        "url": "https://your-site.com/uploads/hello.jpg",
        "alt": "Hero image"
      }
    }
  ],
  "pageInfo": {
    "hasNextPage": true,
    "hasPreviousPage": false,
    "startCursor": "YXJyYXljb25uZWN0aW9uOjA=",
    "endCursor": "YXJyYXljb25uZWN0aW9uOjQ="
  }
}
```

## Single post

- Path: `GET /api/wordpress/posts/:slug`
- Returns one post with `content`, `excerpt`, `featuredImage`, `authorName`, `postUrl`, etc.
- 404 when the post cannot be found.

### Example

```
GET /api/wordpress/posts/hello-world
```

## What gets fetched

- List: `id`, `databaseId`, `slug`, `uri`, `postUrl`, `title`, `excerpt`, `date`, `featuredImage (sourceUrl, altText)`, `author (name)`, plus `pageInfo`.
- Single: includes all of the above plus `content`.
- GraphQL queries live in `app/api/wordpress/posts/route.ts` and `app/api/wordpress/posts/[slug]/route.ts`.

## Extend

- Add fields: extend `POSTS_QUERY` and map them into the response payload.
- Add new operations: create another handler under `app/api/wordpress` (e.g., `pages/route.ts`) and reuse `requestGraphQL` from `lib/cms/graphql`.
- Auth: if your WordPress install needs Basic or custom headers, pass them through `requestGraphQL` (headers/token) or update the route handler.

## Demo UI architecture

The `/wordpress` folder ships a full demo that consumes the API routes.

- `app/wordpress/page.tsx` (**List + Search**)
  - Client component that calls `/api/wordpress/posts` with `fetch`.
  - Features: search bar (submits `search` query param), cursor-based "Load more" pagination, cards with featured image, author, excerpt, and buttons to `/wordpress/[slug]` + live WordPress URL.
  - Config: adjusts `PAGE_SIZE` constant, default search text, or hero copy to fit your project.
- `app/wordpress/[slug]/page.tsx` (**Single post**)
  - Server component that awaits `params`, fetches `/api/wordpress/posts/:slug`, sanitizes HTML, and renders with Tailwind Typography (`prose prose-slate dark:prose-invert`).
  - Includes CTA buttons back to the list and to the live WordPress URL.
- UI building blocks: Navbar/Footer/CTA, `Badge`, `Button`, `Card` from `@/components/ui`.

### Reusing the components

1. Configure env vars (or rely on the default demo endpoint) and run `npm run dev`.
2. Hit `/wordpress` to see the list/search page. Copy the fetch logic from `fetchPosts` if you need client-side pagination elsewhere.
3. For server-side usage (SSR or static), call the same APIs with `fetch` or import `requestGraphQL` and queries directly.
4. Customize card layouts, typography, or pagination by editing `app/wordpress/page.tsx`; the grid already separates content fetching from presentation for easy tweaks.

With these docs + demo files, users can quickly wire the API routes into their own components, swap in different layouts, or extend queries without starting from scratch.

## Code walkthrough

Understand how the pieces fit together before adapting them.

### Shared GraphQL helper (`lib/cms/graphql.ts`)

```ts
export async function requestGraphQL<T>({
  endpoint,
  query,
  variables,
  token,
  timeoutMs = 8000,
}: GraphQLRequestOptions) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
    signal: controller.signal,
  });
  // Normalizes `{ data, errors, status }`
  return { data: json?.data, errors: json?.errors, status: response.status };
}
```

Use this anytime you need to call WordPress (or another GraphQL API) from a route handler or server component.

### List endpoint (`app/api/wordpress/posts/route.ts`)

```ts
const POSTS_QUERY = /* GraphQL */ `query ($first: Int!, $after: String, $search: String) { ... }`;

export async function GET(request: NextRequest) {
  const first = clamp(searchParams.get("first"), DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE);
  const { data, errors } = await requestGraphQL<WordPressPostsResponse>({
    endpoint: WORDPRESS_GRAPHQL_URL ?? DEMO_URL,
    query: POSTS_QUERY,
    variables: { first, after, search },
    token: WORDPRESS_GRAPHQL_TOKEN,
  });
  return NextResponse.json({
    posts: data.posts.nodes.map(mapWordPressNode),
    pageInfo: data.posts.pageInfo,
  });
}
```

- Supports `first`, `after`, and `search` query params.
- Adds `postUrl` by combining the configured endpoint origin with WordPress’s `uri`.
- Returns `502`/remote code when WordPress errors so clients can differentiate transient failures.

### Single endpoint (`app/api/wordpress/posts/[slug]/route.ts`)

```ts
export async function GET(_req: NextRequest, context: RouteContext) {
  const slug = await resolveSlug(context); // Works with sync or async params
  const { data } = await requestGraphQL<WordPressPostResponse>({ ... });
  return NextResponse.json({ post: mapWordPressPost(data.post) });
}
```

### Client list page (`app/wordpress/page.tsx`)

```tsx
const fetchPosts = useCallback(async ({ search, after, append }) => {
  const res = await fetch(`/api/wordpress/posts?${params}`);
  const json = (await res.json()) as ApiResponse;
  setPosts((prev) => (append ? [...prev, ...json.posts] : json.posts));
}, []);

// Search form
<form onSubmit={(e) => { e.preventDefault(); fetchPosts({ search: searchInput }); }}>
  <input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
  <Button type="submit">Search</Button>
</form>

// Load more
{pageInfo?.hasNextPage && (
  <Button onClick={() => fetchPosts({ after: pageInfo.endCursor, append: true })}>
    Load more
  </Button>
)}
```

Cards link to `/wordpress/[slug]` (local SSR) and `post.postUrl` (live WordPress URL).

### Single post page (`app/wordpress/[slug]/page.tsx`)

```tsx
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { post } = await fetch(`/api/wordpress/posts/${slug}`).then((res) => res.json());
  return (
    <article className="prose prose-slate dark:prose-invert">
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
```

- Server component renders WordPress HTML with Tailwind Typography.
- `sanitizeContent` removes `<script>`/`<style>` tags and `sourceMappingURL` comments to avoid console noise.

Use these snippets as references when copying the integration into other pages or building custom components.
