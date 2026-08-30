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

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface PageProps {
    articles: { data: Article[]; links?: any[]; meta?: any };
    categories: Category[];
    seo?: any;
    verificationMeta?: { name: string; content: string }[];
}

export default function Latest({ articles, categories, seo, verificationMeta }: PageProps) {
    const page = usePage();
    const siteSettings = (page.props as unknown as { siteSettings?: SiteSettings }).siteSettings ?? { site_name: "Public Center" } as SiteSettings;
    const sharedSeo = (page.props as unknown as { seo?: any }).seo;
    const sharedVerification = (page.props as unknown as { verificationMeta?: { name: string; content: string }[] }).verificationMeta;
    const finalSeo = seo ?? sharedSeo;
    const finalVerification = verificationMeta ?? sharedVerification;

    return (
        <>
            {finalSeo ? <SeoHead seo={finalSeo} verification={finalVerification} /> : <Head title={`Latest - ${siteSettings.site_name}`} />}
            <AnalyticsScripts />
            <div className="min-h-screen bg-background">
                <PublicHeader categories={categories} siteSettings={siteSettings} />
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4"><AdSlot position="header" /></div>
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
                        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
                        <span>/</span>
                        <span className="text-foreground">Latest</span>
                    </nav>
                    <div className="mb-10 border-b border-border pb-8">
                        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Latest Stories</h1>
                        <p className="mt-3 max-w-2xl text-base text-muted-foreground">The most recent stories from across all sections.</p>
                    </div>

                    <Deferred data="articles" fallback={
                        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {[1,2,3,4,5,6,7,8].map(i=> (
                                <div key={i} className="space-y-3">
                                    <Skeleton className="aspect-[16/10] w-full" />
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-5 w-full" />
                                    <Skeleton className="h-4 w-2/3" />
                                </div>
                            ))}
                        </div>
                    }>
                        {articles?.data && articles.data.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {articles.data.map((article) => (
                                        <ArticleCard key={article.id} article={article} />
                                    ))}
                                </div>
                                <div className="mt-8"><AdSlot position="in_feed" /></div>
                            </>
                        ) : (
                            <div className="py-20 text-center">
                                <p className="text-muted-foreground">No articles found.</p>
                                <Link href="/" className="mt-4 inline-flex text-sm font-medium text-foreground hover:underline">Back to Home →</Link>
                            </div>
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
