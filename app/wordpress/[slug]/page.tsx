import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CTA } from "@/components/features/home/cta";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { requestGraphQL } from "@/lib/cms/graphql";

export const dynamic = "force-dynamic";

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

const sanitizeContent = (html: string) => {
  // Strip script/style, HTML comments, and any sourceMappingURL directives to avoid Turbopack parsing errors.
  let sanitized = html.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");
  sanitized = sanitized.replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "");
  sanitized = sanitized.replace(/<!--[\s\S]*?-->/g, "");
  sanitized = sanitized.replace(/\/\*[#@]\s*sourceMappingURL[\s\S]*?\*\//gi, "");
  sanitized = sanitized.replace(/\/\/[#@]\s*sourceMappingURL[^\n\r]*/gi, "");
  sanitized = sanitized.replace(/sourceMappingURL[^\s"'<>]*/gi, "");
  return sanitized;
};

async function getPost(slug: string) {
  const { data, errors } = await requestGraphQL<WordPressPostResponse>({
    endpoint: WORDPRESS_GRAPHQL_URL,
    query: POST_QUERY,
    variables: { slug },
    token: WORDPRESS_GRAPHQL_TOKEN,
    timeoutMs: 8000,
    cache: "no-store",
  });

  const post = data?.post;
  if (!post || errors?.length) return null;

  return {
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
    title: post.title ?? "Untitled post",
    excerpt: post.excerpt,
    content: sanitizeContent(post.content ?? "<p>No content available.</p>"),
    date: post.date,
    authorName: post.author?.node?.name ?? null,
    featuredImage: post.featuredImage?.node
      ? {
          url: post.featuredImage.node.sourceUrl ?? null,
          alt: post.featuredImage.node.altText ?? null,
        }
      : null,
  };
}

function formatDate(date?: string) {
  if (!date) return "Unknown date";
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? "Unknown date" : parsed.toLocaleDateString();
}

export default async function WordPressPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-500">
      <Navbar />

      <main className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <section className="container mx-auto max-w-5xl">
          <div className="space-y-3 text-center">
            <Badge className="bg-blue-100/80 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200 border border-blue-200/70 dark:border-blue-800/70">
              WordPress Post
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-bold">{post.title}</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {formatDate(post.date)}
              {post.authorName ? ` · By ${post.authorName}` : ""}
            </p>
            <div className="flex justify-center gap-2">
              <Button asChild size="sm" variant="outline">
                <Link href="/wordpress">Back to posts</Link>
              </Button>
              {post.postUrl && (
                <Button asChild size="sm">
                  <Link href={post.postUrl}>View live</Link>
                </Button>
              )}
            </div>
          </div>
        </section>

        {post.featuredImage?.url && (
          <section className="container mx-auto max-w-5xl mt-8">
            <div className="relative h-80 w-full overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <Image
                src={post.featuredImage.url}
                alt={post.featuredImage.alt ?? post.title}
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
            </div>
          </section>
        )}

        <section className="container mx-auto max-w-4xl mt-10">
          <article className="prose prose-slate max-w-none dark:prose-invert prose-headings:scroll-mt-24 prose-img:rounded-xl prose-a:text-blue-600 dark:prose-a:text-blue-300">
            <div
              dangerouslySetInnerHTML={{
                __html: post.content ?? "",
              }}
            />
          </article>
        </section>
      </main>

      <CTA />
      <Footer />
    </div>
  );
}
