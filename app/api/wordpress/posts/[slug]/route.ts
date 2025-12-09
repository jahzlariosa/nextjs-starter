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

type WordPressPostDetail = {
  id: string;
  databaseId: number;
  slug: string;
  uri?: string;
  title?: string;
  excerpt?: string;
  content?: string;
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

type WordPressPostResponse = {
  post: WordPressPostDetail | null;
};

const POST_QUERY = `
  query WordPressPostBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      id
      databaseId
      slug
      uri
      title
      excerpt
      content
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
  }
`;

type RouteContext =
  | { params: { slug: string } }
  | { params: Promise<{ slug: string }> };

async function resolveSlug(context: RouteContext): Promise<string | undefined> {
  const params =
    "then" in context.params ? await context.params : context.params;
  return params?.slug;
}

export async function GET(request: NextRequest, context: RouteContext) {
  const slug = await resolveSlug(context);

  if (!slug) {
    return NextResponse.json(
      { error: "Slug is required." },
      { status: 400 },
    );
  }

  const { data, errors, status } = await requestGraphQL<WordPressPostResponse>({
    endpoint: WORDPRESS_GRAPHQL_URL,
    query: POST_QUERY,
    variables: { slug },
    token: WORDPRESS_GRAPHQL_TOKEN,
    timeoutMs: 8000,
    cache: "no-store",
  });

  const post = data?.post;

  if (!post || errors?.length) {
    return NextResponse.json(
      {
        error: "Post not found or failed to fetch from WordPress.",
        details: errors?.map((err) => err.message),
      },
      { status: post ? status : 404 },
    );
  }

  const responsePost = {
    id: post.id,
    databaseId: post.databaseId,
    slug: post.slug,
    uri: post.uri,
    postUrl: (() => {
      if (!post.uri) return null;
      if (post.uri.startsWith("http")) return post.uri;
      return WORDPRESS_BASE_ORIGIN
        ? new URL(post.uri, WORDPRESS_BASE_ORIGIN).toString()
        : post.uri;
    })(),
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    date: post.date,
    authorName: post.author?.node?.name ?? null,
    featuredImage: post.featuredImage?.node
      ? {
          url: post.featuredImage.node.sourceUrl ?? null,
          alt: post.featuredImage.node.altText ?? null,
        }
      : null,
  };

  return NextResponse.json({ post: responsePost }, { status: 200 });
}
