'use client';

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";

import { CTA } from "@/components/features/home/cta";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Post = {
  id: string;
  databaseId: number;
  slug: string;
  uri?: string;
  postUrl?: string | null;
  title?: string;
  excerpt?: string;
  date?: string;
  authorName?: string | null;
  featuredImage?: {
    url: string | null;
    alt: string | null;
  } | null;
};

type PageInfo = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string | null;
  endCursor?: string | null;
};

type ApiResponse = {
  posts: Post[];
  pageInfo: PageInfo;
  error?: string;
  details?: string[];
};

const PAGE_SIZE = 6;

export default function WordPressDemoPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  const buildUrl = useCallback(
    (search?: string, after?: string) => {
      const params = new URLSearchParams();
      params.set("first", String(PAGE_SIZE));
      if (search) params.set("search", search);
      if (after) params.set("after", after);
      return `/api/wordpress/posts?${params.toString()}`;
    },
    [],
  );

  const fetchPosts = useCallback(
    async ({
      search,
      after,
      append = false,
    }: {
      search?: string;
      after?: string;
      append?: boolean;
    }) => {
      append ? setLoadingMore(true) : setLoading(true);
      setError(null);

      try {
        const res = await fetch(buildUrl(search, after));
        const json = (await res.json()) as ApiResponse;

        if (!res.ok || json.error) {
          setError(json.error ?? "Failed to load posts.");
          if (!append) {
            setPosts([]);
            setPageInfo(null);
          }
          return;
        }

        setPosts((prev) => (append ? [...prev, ...json.posts] : json.posts));
        setPageInfo(json.pageInfo);
        setActiveSearch(search ?? "");
      } catch (err) {
        setError("Unable to reach the WordPress API route.");
        if (!append) {
          setPosts([]);
          setPageInfo(null);
        }
      } finally {
        append ? setLoadingMore(false) : setLoading(false);
      }
    },
    [buildUrl],
  );

  useEffect(() => {
    fetchPosts({});
  }, [fetchPosts]);

  const title = useMemo(
    () => (posts.length ? "Latest posts" : "WordPress posts"),
    [posts.length],
  );

  const heroCopy = useMemo(
    () =>
      posts.length
        ? "Fetched via the local Next.js API route backed by WordPress GraphQL."
        : "Search and browse posts pulled live from WordPress GraphQL.",
    [posts.length],
  );

  const parseExcerpt = (excerpt?: string) =>
    excerpt ? excerpt.replace(/<[^>]*>/g, "").slice(0, 260) : "No excerpt provided.";

  const formatDate = (date?: string) => {
    if (!date) return "Unknown date";
    const parsed = new Date(date);
    return Number.isNaN(parsed.getTime()) ? "Unknown date" : parsed.toLocaleDateString();
  };

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const term = searchInput.trim();
    fetchPosts({ search: term || undefined, append: false });
  };

  const handleLoadMore = () => {
    if (!pageInfo?.hasNextPage || !pageInfo.endCursor) return;
    fetchPosts({ search: activeSearch || undefined, after: pageInfo.endCursor, append: true });
  };

  const isEmpty = !loading && !error && posts.length === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-500">
      <Navbar />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <section className="container mx-auto max-w-6xl">
          <div className="space-y-4 text-center">
            <Badge className="bg-blue-100/80 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200 border border-blue-200/70 dark:border-blue-800/70">
              WordPress GraphQL Demo
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-bold">{title}</h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              {heroCopy}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild>
                <Link href="/docs">Setup instructions</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="container mx-auto max-w-6xl mt-10">
          <Card className="bg-white/80 dark:bg-zinc-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
            <CardHeader className="space-y-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle className="text-2xl">Posts</CardTitle>
                  <CardDescription>
                    Search, paginate, and click through to single posts pulled from WordPress.
                  </CardDescription>
                </div>
                <form className="w-full md:w-96" onSubmit={handleSearch}>
                  <div className="flex items-center gap-2">
                    <input
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      placeholder="Search posts..."
                      className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-blue-500"
                    />
                    <Button type="submit" size="sm">
                      Search
                    </Button>
                  </div>
                  {activeSearch && (
                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                      Showing results for "{activeSearch}"
                    </p>
                  )}
                </form>
              </div>
            </CardHeader>
            <CardContent>
              {loading && <p className="text-slate-600 dark:text-slate-300">Loading posts...</p>}
              {error && (
                <div className="text-red-600 dark:text-red-300">
                  <p className="font-semibold">Error: {error}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Uses the configured <code>WORDPRESS_GRAPHQL_URL</code> or the built-in demo
                    endpoint.
                  </p>
                </div>
              )}

              {isEmpty && (
                <p className="text-slate-600 dark:text-slate-400">
                  No posts returned. Add published posts to WordPress or adjust permissions.
                </p>
              )}

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => {
                  const imageUrl = post.featuredImage?.url ?? null;
                  const alt = post.featuredImage?.alt ?? post.title ?? "Featured image";

                  return (
                    <article
                      key={post.id}
                      className="group overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-zinc-900/80 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                    >
                      <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={alt}
                            fill
                            className="object-cover transition duration-500 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            priority
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-sm text-slate-500 dark:text-slate-400">
                            No featured image
                          </div>
                        )}
                      </div>

                      <div className="p-5 space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 line-clamp-2">
                            {post.title ?? "Untitled"}
                          </h3>
                          <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                            {formatDate(post.date)}
                          </span>
                        </div>
                        {post.authorName && (
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            By {post.authorName}
                          </p>
                        )}
                        <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-3">
                          {parseExcerpt(post.excerpt)}
                        </p>
                        <div className="flex items-center gap-2">
                          <Button asChild size="sm" className="w-full">
                            <Link href={`/wordpress/${post.slug}`}>Read post</Link>
                          </Button>
                          {post.postUrl && (
                            <Button asChild size="sm" variant="outline" className="w-full">
                              <Link href={post.postUrl}>View live</Link>
                            </Button>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              {pageInfo?.hasNextPage && (
                <div className="mt-8 flex justify-center">
                  <Button onClick={handleLoadMore} disabled={loadingMore}>
                    {loadingMore ? "Loading..." : "Load more"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </main>

      <CTA />
      <Footer />
    </div>
  );
}
