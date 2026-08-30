import { Head, Link, usePage, Deferred } from "@inertiajs/react";
import { SeoHead } from "@/components/seo/seo-head";
import { AnalyticsScripts } from "@/components/seo/analytics-scripts";
import { AdSlot } from "@/components/ads/ad-slot";
import { ArticleCard } from "@/components/articles/article-card";
import { PublicFooter } from "@/components/navigation/public-footer";
import { PublicHeader } from "@/components/navigation/public-header";
import { Skeleton } from "@/components/ui/skeleton";
import type { SiteSettings } from "@/types/global";

interface Article {
    id: number;
    slug: string;
    title: string;
    subtitle: string | null;
    excerpt: string | null;
    featured_image: string | null;
    published_at: string;
    reading_time: number;
    view_count: number;
    category: { name: string; slug: string; color: string | null } | null;
    author: { name: string; username: string } | null;
}
interface Category { id: number; name: string; slug: string; articles_count?: number; }
interface Topic { id: number; name: string; slug: string; articles_count?: number; }
interface Author { id: number; name: string; username: string; articles_count?: number; avatar?: string | null; }
interface ExploreData {
    categories: Category[];
    topics: Topic[];
    trendingArticles: Article[];
    latestArticles: Article[];
    featuredAuthors: Author[];
}
interface PageProps {
    exploreData: ExploreData;
    categories: Category[];
    seo?: any;
    verificationMeta?: { name: string; content: string }[];
}

function ExploreFallback() {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[1,2,3,4,5,6,7,8].map(i=> <Skeleton key={i} className="h-20 w-full" />)}
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[1,2,3,4,5,6].map(i=> (
                    <div key={i} className="space-y-3">
                        <Skeleton className="aspect-[16/10] w-full" />
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-5 w-full" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function Explore({ exploreData, categories, seo, verificationMeta }: PageProps) {
    const page = usePage();
    const siteSettings = (page.props as unknown as { siteSettings?: SiteSettings }).siteSettings ?? { site_name: "Public Center" } as SiteSettings;
    const sharedSeo = (page.props as unknown as { seo?: any }).seo;
    const sharedVerification = (page.props as unknown as { verificationMeta?: { name: string; content: string }[] }).verificationMeta;
    const finalSeo = seo ?? sharedSeo;
    const finalVerification = verificationMeta ?? sharedVerification;

    return (
        <>
            {finalSeo ? <SeoHead seo={finalSeo} verification={finalVerification} /> : <Head title={`Explore - ${siteSettings.site_name}`} />}
            <AnalyticsScripts />
            <div className="min-h-screen bg-background">
                <PublicHeader categories={categories} siteSettings={siteSettings} />
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4"><AdSlot position="header" /></div>
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
                        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
                        <span>/</span>
                        <span className="text-foreground">Explore</span>
                    </nav>
                    <div className="mb-10 border-b border-border pb-8">
                        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Explore</h1>
                        <p className="mt-3 max-w-2xl text-base text-muted-foreground">Browse categories, topics, authors and discover stories.</p>
                        <div className="mt-6 flex flex-wrap gap-2">
                            <Link href="/latest" className="rounded-sm bg-black px-4 py-2 text-sm font-bold uppercase tracking-wide text-white hover:bg-zinc-800 dark:bg-white dark:text-black">Latest →</Link>
                            <Link href="/trending" className="rounded-sm border border-zinc-200 px-4 py-2 text-sm font-bold uppercase tracking-wide hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900">Trending →</Link>
                        </div>
                    </div>

                    <Deferred data="exploreData" fallback={<ExploreFallback />}>
                        {exploreData ? (
                            <div className="space-y-12">
                                {exploreData.categories?.length > 0 && (
                                    <section>
                                        <h2 className="mb-4 text-xs font-black uppercase tracking-[0.14em] text-foreground">Categories</h2>
                                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                                            {exploreData.categories.map((cat) => (
                                                <Link key={cat.id} href={`/category/${cat.slug}`} className="rounded-sm border border-border bg-card p-4 hover:bg-accent transition-colors">
                                                    <p className="text-sm font-bold uppercase tracking-wide">{cat.name}</p>
                                                    {typeof cat.articles_count !== 'undefined' && <p className="mt-1 text-xs text-muted-foreground">{cat.articles_count} articles</p>}
                                                </Link>
                                            ))}
                                        </div>
                                    </section>
                                )}
                                {exploreData.topics?.length > 0 && (
                                    <section>
                                        <div className="mb-4 flex items-center justify-between">
                                            <h2 className="text-xs font-black uppercase tracking-[0.14em] text-foreground">Topics</h2>
                                            <Link href="/topics" className="text-xs font-bold uppercase tracking-widest text-[#cc0000] hover:underline">View all →</Link>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {exploreData.topics.map((topic) => (
                                                <Link key={topic.id} href={`/topic/${topic.slug}`} className="rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm font-semibold hover:bg-black hover:text-white dark:border-zinc-800 dark:bg-zinc-900 transition-colors">
                                                    {topic.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </section>
                                )}
                                {exploreData.trendingArticles?.length > 0 && (
                                    <section>
                                        <div className="mb-4 flex items-center justify-between">
                                            <h2 className="text-lg font-bold">Trending Now</h2>
                                            <Link href="/trending" className="text-sm font-medium text-muted-foreground hover:text-foreground">View all →</Link>
                                        </div>
                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                            {exploreData.trendingArticles.map((article) => (
                                                <ArticleCard key={article.id} article={article} />
                                            ))}
                                        </div>
                                    </section>
                                )}
                                {exploreData.latestArticles?.length > 0 && (
                                    <section>
                                        <div className="mb-4 flex items-center justify-between">
                                            <h2 className="text-lg font-bold">Latest Stories</h2>
                                            <Link href="/latest" className="text-sm font-medium text-muted-foreground hover:text-foreground">View all →</Link>
                                        </div>
                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                            {exploreData.latestArticles.map((article) => (
                                                <ArticleCard key={article.id} article={article} />
                                            ))}
                                        </div>
                                    </section>
                                )}
                                {exploreData.featuredAuthors?.length > 0 && (
                                    <section>
                                        <h2 className="mb-4 text-xs font-black uppercase tracking-[0.14em] text-foreground">Featured Authors</h2>
                                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                                            {exploreData.featuredAuthors.map((author) => (
                                                <Link key={author.id} href={`/author/${author.username}`} className="flex flex-col items-center rounded-sm border border-border p-4 hover:bg-accent transition-colors text-center">
                                                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 text-white font-bold dark:bg-zinc-800">{author.name[0]?.toUpperCase()}</span>
                                                    <span className="mt-2 text-sm font-semibold">{author.name}</span>
                                                    <span className="text-xs text-muted-foreground">@{author.username}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    </section>
                                )}
                                <div className="pt-4"><AdSlot position="in_feed" /></div>
                            </div>
                        ) : (
                            <ExploreFallback />
                        )}
                    </Deferred>
                </div>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-6"><AdSlot position="footer" /></div>
                <AdSlot position="anchor" />
                <PublicFooter categories={categories} siteSettings={siteSettings} />
            </div>
        </>
    );
}
