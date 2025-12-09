import { NextResponse, type NextRequest } from "next/server";

import { requestGraphQL } from "@/lib/cms/graphql";

const DEFAULT_WORDPRESS_GRAPHQL_URL =
  "https://dev-wp-nextjs-starter-be.pantheonsite.io/graphql";

const WORDPRESS_GRAPHQL_URL =
  process.env.WORDPRESS_GRAPHQL_URL || DEFAULT_WORDPRESS_GRAPHQL_URL;
const WORDPRESS_GRAPHQL_TOKEN = process.env.WORDPRESS_GRAPHQL_TOKEN;
const WORDPRESS_BASE_ORIGIN = (() => {
  try {
    return new URL(WORDPRESS_GRAPHQL_URL).origin;
  } catch {
    return null;
  }
})();

const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 50;

type WordPressPostNode = {
  id: string;
  databaseId: number;
  slug: string;
  uri?: string;
  title?: string;
  excerpt?: string;
  date?: string;
  featuredImage?: {
    node?: {
      sourceUrl?: string;
      altText?: string | null;
    } | null;
  } | null;
  author?: {
    node?: {
      name?: string | null;
    } | null;
  } | null;
};

type WordPressPostsResponse = {
  posts: {
    nodes: WordPressPostNode[];
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor?: string | null;
      endCursor?: string | null;
    };
  };
};

const POSTS_QUERY = `
  query WordPressPosts($first: Int!, $after: String, $search: String) {
    posts(
      first: $first
      after: $after
      where: {
        search: $search
        orderby: { field: DATE, order: DESC }
        status: PUBLISH
      }
    ) {
      nodes {
        id
        databaseId
        slug
        uri
        title
        excerpt
        date
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        author {
          node {
            name
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

function parsePageSize(raw: string | null): number {
  if (!raw) return DEFAULT_PAGE_SIZE;

  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return DEFAULT_PAGE_SIZE;
  }

  return Math.min(parsed, MAX_PAGE_SIZE);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const first = parsePageSize(searchParams.get("first"));
  const after = searchParams.get("after") || undefined;
  const search = searchParams.get("search")?.trim() || undefined;

  const { data, errors, status } = await requestGraphQL<WordPressPostsResponse>({
    endpoint: WORDPRESS_GRAPHQL_URL,
    query: POSTS_QUERY,
    variables: { first, after, search },
    token: WORDPRESS_GRAPHQL_TOKEN,
    timeoutMs: 8000,
    cache: "no-store",
  });

  if (!data || errors?.length) {
    return NextResponse.json(
      {
        error: "Failed to fetch posts from WordPress.",
        details: errors?.map((err) => err.message),
      },
      { status: status >= 400 ? status : 502 },
    );
  }

  const posts = data.posts.nodes.map((post) => ({
    id: post.id,
    databaseId: post.databaseId,
    slug: post.slug,
    uri: post.uri,
    title: post.title,
    excerpt: post.excerpt,
    date: post.date,
    authorName: post.author?.node?.name ?? null,
    featuredImage: post.featuredImage?.node
      ? {
          url: post.featuredImage.node.sourceUrl ?? null,
          alt: post.featuredImage.node.altText ?? null,
        }
      : null,
    postUrl: (() => {
      if (!post.uri) return null;
      if (post.uri.startsWith("http")) return post.uri;
      return WORDPRESS_BASE_ORIGIN
        ? new URL(post.uri, WORDPRESS_BASE_ORIGIN).toString()
        : post.uri;
    })(),
  }));

  return NextResponse.json(
    {
      posts,
      pageInfo: data.posts.pageInfo,
    },
    { status: 200 },
  );
}
