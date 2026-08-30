import { Head, Link, usePage } from "@inertiajs/react";
import { SeoHead } from "@/components/seo/seo-head";
import { AnalyticsScripts } from "@/components/seo/analytics-scripts";
import { AdSlot } from "@/components/ads/ad-slot";
import { PublicFooter } from "@/components/navigation/public-footer";
import { PublicHeader } from "@/components/navigation/public-header";
import type { SiteSettings } from "@/types/global";

interface Topic {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    color: string | null;
    followers_count: number;
    articles_count: number;
}
interface Category { id: number; name: string; slug: string; }
interface PageProps {
    topics: Topic[];
    categories: Category[];
    seo?: any;
    verificationMeta?: { name: string; content: string }[];
}

export default function Topics({ topics, categories, seo, verificationMeta }: PageProps) {
    const page = usePage();
    const siteSettings = (page.props as unknown as { siteSettings?: SiteSettings }).siteSettings ?? { site_name: "Public Center" } as SiteSettings;
    const sharedSeo = (page.props as unknown as { seo?: any }).seo;
    const sharedVerification = (page.props as unknown as { verificationMeta?: { name: string; content: string }[] }).verificationMeta;
    const finalSeo = seo ?? sharedSeo;
    const finalVerification = verificationMeta ?? sharedVerification;

    return (
        <>
            {finalSeo ? <SeoHead seo={finalSeo} verification={finalVerification} /> : <Head title={`All Topics - ${siteSettings.site_name}`} />}
            <AnalyticsScripts />
            <div className="min-h-screen bg-background">
                <PublicHeader categories={categories} siteSettings={siteSettings} />
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4"><AdSlot position="header" /></div>
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
                        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
                        <span>/</span>
                        <span className="text-foreground">Topics</span>
                    </nav>
                    <div className="mb-10 border-b border-border pb-8">
                        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">All Topics</h1>
                        <p className="mt-3 max-w-2xl text-base text-muted-foreground">Browse every topic we cover — from trending tags to niche interests.</p>
                        <div className="mt-6 flex flex-wrap gap-2">
                            <Link href="/explore" className="rounded-sm border border-zinc-200 px-4 py-2 text-sm font-bold uppercase tracking-wide hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900">Explore →</Link>
                            <Link href="/trending" className="rounded-sm border border-zinc-200 px-4 py-2 text-sm font-bold uppercase tracking-wide hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900">Trending →</Link>
                        </div>
                    </div>

                    {topics && topics.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {topics.map((topic) => (
                                <Link
                                    key={topic.id}
                                    href={`/topic/${topic.slug}`}
                                    className="group rounded-sm border border-border bg-card p-5 hover:bg-accent transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: topic.color ?? '#cc0000' }} />
                                        <h3 className="text-sm font-bold uppercase tracking-wide group-hover:text-foreground">{topic.name}</h3>
                                    </div>
                                    {topic.description && <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{topic.description}</p>}
                                    <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                                        <span>{topic.articles_count.toLocaleString()} articles</span>
                                        <span>·</span>
                                        <span>{topic.followers_count.toLocaleString()} followers</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="py-20 text-center">
                            <p className="text-muted-foreground">No topics found.</p>
                            <Link href="/" className="mt-4 inline-flex text-sm font-medium text-foreground hover:underline">Back to Home →</Link>
                        </div>
                    )}
                    <div className="mt-8"><AdSlot position="in_feed" /></div>
                </div>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-6"><AdSlot position="footer" /></div>
                <AdSlot position="anchor" />
                <PublicFooter categories={categories} siteSettings={siteSettings} />
            </div>
        </>
    );
}
