import { Head, Link, usePage } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";
import { ArticleCard } from "@/components/articles/article-card";
import { HeroStory } from "@/components/editorial/hero-story";
import { SecondaryStory } from "@/components/editorial/secondary-story";
import { PublicFooter } from "@/components/navigation/public-footer";
import { PublicHeader } from "@/components/navigation/public-header";
import { Skeleton } from "@/components/ui/skeleton";
import { SeoHead } from "@/components/seo/seo-head";
import { AnalyticsScripts } from "@/components/seo/analytics-scripts";
import { AdSlot } from "@/components/ads/ad-slot";
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
    category: {
        name: string;
        slug: string;
        color: string | null;
    } | null;
    author: {
        name: string;
        username: string;
    } | null;
}

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface Topic {
    id: number;
    name: string;
    slug: string;
}

interface HomeProps {
    heroArticle: Article | null;
    secondaryStories: Article[];
    trendingArticles: Article[];
    latestArticles: { data: Article[] };
    categories: Category[];
    trendingTopics: Topic[];
    siteSettings?: SiteSettings;
    seo?: any;
    verificationMeta?: { name: string; content: string }[];
}

function useScrollReveal() {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.05 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return { ref, visible };
}

function SectionReveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    const { ref, visible } = useScrollReveal();
    return (
        <div
            ref={ref}
            className={`transition-all duration-700 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            } ${className}`}
        >
            {children}
        </div>
    );
}

export default function Home({
    heroArticle,
    secondaryStories,
    trendingArticles,
    latestArticles,
    categories,
    trendingTopics,
    siteSettings: propSettings,
    seo,
    verificationMeta,
}: HomeProps) {
    const page = usePage();
    const sharedSettings = (page.props as unknown as { siteSettings?: SiteSettings }).siteSettings;
    const sharedSeo = (page.props as unknown as { seo?: any }).seo;
    const sharedVerification = (page.props as unknown as { verificationMeta?: { name: string; content: string }[] }).verificationMeta;
    const navigation = (page.props as unknown as { navigation?: any }).navigation;
    const finalSeo = seo ?? sharedSeo;
    const finalVerification = verificationMeta ?? sharedVerification;
    // Dynamic View-all destinations — every link is admin-editable via Navigation + Pages/Categories
    const trendingViewAllHref = (() => {
        const custom = navigation?.headerPrimary?.find((l: any) => /trending/i.test(l.label))?.url || (navigation?.custom as any)?.header_primary?.find((l: any) => /trending/i.test(l.label))?.url;
        if (custom) return custom;
        if (trendingTopics?.[0]) return `/topic/${trendingTopics[0].slug}`;
        if (categories?.[0]) return `/category/${categories[0].slug}`;
        return "/";
    })();
    const latestViewAllHref = (() => {
        const custom = navigation?.headerPrimary?.find((l: any) => /latest/i.test(l.label))?.url || ((navigation as any)?.custom?.header_primary?.find((l: any) => /latest/i.test(l.label))?.url) || (navigation?.headerPages?.[0] ? `/page/${navigation.headerPages[0].slug}` : null);
        if (custom) return custom;
        if (categories?.[0]) return `/category/${categories[0].slug}`;
        return "/";
    })();
    const siteSettings: SiteSettings = propSettings ?? sharedSettings ?? {
        site_name: "Public Center",
        site_tagline: "Nepal's Trusted News & Public Affairs",
        footer_description: "",
        footer_copyright: "All rights reserved.",
        trending_terms: ["AI", "Climate", "Politics", "Technology", "Economy"],
        header_latest_label: "Latest",
        header_trending_label: "Trending",
        header_explore_label: "Explore",
        home_top_stories_title: "Top Stories",
        home_trending_title: "Trending Now",
        home_latest_title: "Latest Stories",
    };

    return (
        <>
            {finalSeo ? <SeoHead seo={finalSeo} verification={finalVerification} /> : <Head title={`${siteSettings.site_name} - ${siteSettings.site_tagline}`} />}
            <AnalyticsScripts />

            <div className="min-h-screen bg-background">
                <PublicHeader categories={categories} trendingTopics={trendingTopics} siteSettings={siteSettings} />
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4">
                    <AdSlot position="header" />
                </div>

                <main>
                    {/* Hero Section - Full Width */}
                    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {heroArticle ? (
                            <HeroStory article={heroArticle} />
                        ) : (
                            <Skeleton className="aspect-[21/9] w-full" />
                        )}
                    </section>

                    {/* Secondary Stories - Horizontal Row */}
                    {secondaryStories && secondaryStories.length > 0 && (
                        <section className="border-t border-border">
                            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                                <SectionReveal>
                                    <div className="mb-5 flex items-center justify-between">
                                        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                            {siteSettings.home_top_stories_title}
                                        </h2>
                                    </div>
                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                        {secondaryStories.map((article, index) => (
                                            <SecondaryStory
                                                key={article.id}
                                                article={article}
                                                index={index}
                                            />
                                        ))}
                                    </div>
                                </SectionReveal>
                            </div>
                        </section>
                    )}

                    {/* Trending Section */}
                    <section className="border-t border-border bg-muted/30">
                        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                            <SectionReveal>
                                <div className="mb-6 flex items-center justify-between">
                                    <h2 className="text-lg font-bold text-foreground">{siteSettings.home_trending_title}</h2>
                                    <Link
                                        href={trendingViewAllHref as any}
                                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        View all →
                                    </Link>
                                </div>
                                {trendingArticles && trendingArticles.length > 0 ? (
                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                        {trendingArticles.map((article) => (
                                            <ArticleCard key={article.id} article={article} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                        {[1, 2, 3, 4, 5, 6].map((i) => (
                                            <div key={i} className="space-y-3">
                                                <Skeleton className="aspect-[16/10] w-full" />
                                                <Skeleton className="h-4 w-20" />
                                                <Skeleton className="h-5 w-full" />
                                                <Skeleton className="h-4 w-2/3" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div className="mt-8">
                                    <AdSlot position="between_articles" />
                                </div>
                            </SectionReveal>
                        </div>
                    </section>

                    {/* Latest Stories */}
                    <section className="border-t border-border">
                        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                            <SectionReveal>
                                <div className="mb-6 flex items-center justify-between">
                                    <h2 className="text-lg font-bold text-foreground">{siteSettings.home_latest_title}</h2>
                                    <Link
                                        href={latestViewAllHref as any}
                                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        View all →
                                    </Link>
                                </div>
                                {latestArticles?.data && latestArticles.data.length > 0 ? (
                                    <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                        {latestArticles.data.map((article) => (
                                            <ArticleCard key={article.id} article={article} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                            <div key={i} className="space-y-3">
                                                <Skeleton className="aspect-[16/10] w-full" />
                                                <Skeleton className="h-4 w-20" />
                                                <Skeleton className="h-5 w-full" />
                                                <Skeleton className="h-4 w-2/3" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div className="mt-8">
                                    <AdSlot position="in_feed" />
                                </div>
                            </SectionReveal>
                        </div>
                    </section>
                </main>

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-6">
                    <AdSlot position="footer" />
                </div>
                <AdSlot position="anchor" />

                <PublicFooter categories={categories} siteSettings={siteSettings} />
            </div>
        </>
    );
}
