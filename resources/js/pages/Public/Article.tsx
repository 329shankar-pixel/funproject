import { Head, Link, usePage } from "@inertiajs/react";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { Bookmark, Heart } from "lucide-react";
import { ArticleCard } from "@/components/articles/article-card";
import { PublicFooter } from "@/components/navigation/public-footer";
import { PublicHeader } from "@/components/navigation/public-header";
import { SeoHead } from "@/components/seo/seo-head";
import { AnalyticsScripts } from "@/components/seo/analytics-scripts";
import { AdSlot, AffiliateDisclosure } from "@/components/ads/ad-slot";
import { SocialShare } from "@/components/social/social-share";
import type { SiteSettings } from "@/types/global";

interface Article {
    id: number;
    slug: string;
    title: string;
    subtitle: string | null;
    excerpt: string | null;
    body: string;
    featured_image: string | null;
    published_at: string;
    updated_at: string;
    reading_time: number;
    view_count: number;
    share_count: number;
    comment_count: number;
    is_opinion: boolean;
    is_analysis: boolean;
    allow_comments: boolean;
    category: {
        name: string;
        slug: string;
    } | null;
    author: {
        name: string;
        username: string;
        bio: string | null;
        profile_image: string | null;
    } | null;
    topics: {
        id: number;
        name: string;
        slug: string;
    }[];
}

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface ArticlePageProps {
    article: Article;
    relatedArticles: Article[];
    moreFromAuthor: { data: Article[] };
    categories: Category[];
    seo?: any;
    verificationMeta?: { name: string; content: string }[];
}

function ReadingProgress() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            setProgress(Math.min(100, Math.max(0, scrollPercent)));
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="fixed top-0 left-0 right-0 z-[55] h-0.5 bg-transparent">
            <div
                className="h-full bg-foreground transition-all duration-150"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
}

export default function ArticlePage({
    article,
    relatedArticles,
    moreFromAuthor,
    categories,
    seo,
    verificationMeta,
}: ArticlePageProps) {
    const page = usePage();
    const siteSettings = (page.props as unknown as { siteSettings?: SiteSettings }).siteSettings ?? { site_name: "Public Center" } as SiteSettings;
    const sharedSeo = (page.props as unknown as { seo?: any }).seo;
    const sharedVerification = (page.props as unknown as { verificationMeta?: { name: string; content: string }[] }).verificationMeta;
    const finalSeo = seo ?? sharedSeo;
    const finalVerification = verificationMeta ?? sharedVerification;
    const imageUrl = article.featured_image ?? `https://picsum.photos/seed/${article.id}/1200/675`;
    const authorImage = article.author?.profile_image ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(article.author?.name ?? "A")}&background=171717&color=fff`;
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [liked, setLiked] = useState(false);
    const [scrollVisible, setScrollVisible] = useState(false);
    const articleRef = useRef<HTMLDivElement>(null);
    const articleUrl = typeof window !== "undefined" ? window.location.href : `/article/${article.slug}`;

    useEffect(() => {
        const handleScroll = () => {
            setScrollVisible(window.scrollY > 400);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            {finalSeo ? <SeoHead seo={finalSeo} verification={finalVerification} /> : <Head title={`${article.title} - ${siteSettings.site_name}`} />}
            <AnalyticsScripts />
            <ReadingProgress />

            <div className="min-h-screen bg-background">
                <PublicHeader categories={categories} siteSettings={siteSettings} />
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-4">
                    <AdSlot position="header" />
                </div>

                {/* Floating dynamic share bar — platforms controlled via Admin → Social Media */}
                <div
                    className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transform transition-all duration-500 ${
                        scrollVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
                    }`}
                >
                    <div className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white/95 px-2 py-2 shadow-xl backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/95">
                        <button
                            onClick={() => setLiked(!liked)}
                            className={`inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors ${liked ? "bg-red-50 text-red-600 dark:bg-red-950" : "text-zinc-500 hover:bg-zinc-100 hover:text-black dark:text-zinc-400"}`}
                            aria-label="Like"
                        >
                            <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
                        </button>
                        <button
                            onClick={() => setIsBookmarked(!isBookmarked)}
                            className={`inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors ${isBookmarked ? "bg-zinc-900 text-white dark:bg-white dark:text-black" : "text-zinc-500 hover:bg-zinc-100 hover:text-black dark:text-zinc-400"}`}
                            aria-label="Bookmark"
                        >
                            <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
                        </button>
                        <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800" />
                        <SocialShare title={article.title} url={articleUrl} description={article.excerpt} variant="floating" />
                    </div>
                </div>

                <article ref={articleRef} className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
                        <span>/</span>
                        {article.category && (
                            <>
                                <Link href={`/category/${article.category.slug}`} className="hover:text-foreground transition-colors">
                                    {article.category.name}
                                </Link>
                                <span>/</span>
                            </>
                        )}
                        <span className="text-foreground truncate">{article.title}</span>
                    </nav>

                    {/* Category & Flags */}
                    <div className="mb-4 flex flex-wrap items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100">
                        {article.category && (
                            <Link
                                href={`/category/${article.category.slug}`}
                                className="text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {article.category.name}
                            </Link>
                        )}
                        {article.is_opinion && (
                            <span className="rounded-sm bg-secondary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
                                Opinion
                            </span>
                        )}
                        {article.is_analysis && (
                            <span className="rounded-sm bg-secondary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
                                Analysis
                            </span>
                        )}
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl animate-in fade-in slide-in-from-bottom-3 duration-500 delay-150">
                        {article.title}
                    </h1>

                    {article.subtitle && (
                        <p className="mt-4 text-lg leading-relaxed text-muted-foreground sm:text-xl animate-in fade-in slide-in-from-bottom-3 duration-500 delay-200">
                            {article.subtitle}
                        </p>
                    )}

                    {/* Author & Meta */}
                    <div className="mt-6 flex items-center gap-4 border-y border-border py-4 animate-in fade-in slide-in-from-bottom-3 duration-500 delay-300">
                        <img
                            src={authorImage}
                            alt={article.author?.name}
                            className="h-10 w-10 rounded-full object-cover ring-2 ring-border"
                        />
                        <div className="flex-1">
                            {article.author && (
                                <Link
                                    href={`/author/${article.author.username}`}
                                    className="text-sm font-semibold text-foreground hover:text-muted-foreground transition-colors"
                                >
                                    {article.author.name}
                                </Link>
                            )}
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>{formatDistanceToNow(new Date(article.published_at), { addSuffix: true })}</span>
                                <span>·</span>
                                <span>{article.reading_time} min read</span>
                                <span>·</span>
                                <span>{article.view_count.toLocaleString()} views</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setLiked(!liked)}
                                className={`rounded-full p-2 transition-colors ${liked ? "text-red-500" : "text-muted-foreground hover:text-foreground"}`}
                            >
                                <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
                            </button>
                            <button
                                onClick={() => setIsBookmarked(!isBookmarked)}
                                className={`rounded-full p-2 transition-colors ${isBookmarked ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
                            >
                                <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
                            </button>
                        </div>
                    </div>

                    {/* Hero Image */}
                    <div className="mt-8 animate-in fade-in zoom-in-95 duration-700">
                        <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                            <img
                                src={imageUrl}
                                alt={article.title}
                                className="h-full w-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Article Body */}
                    <div
                        className="prose prose-lg mt-8 max-w-none prose-headings:font-bold prose-headings:text-foreground prose-p:text-foreground/90 prose-a:text-foreground prose-a:underline prose-a:underline-offset-4 prose-blockquote:border-l-foreground prose-blockquote:text-muted-foreground prose-strong:text-foreground"
                        dangerouslySetInnerHTML={{ __html: article.body }}
                    />

                    <div className="mt-6 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                        <SocialShare title={article.title} url={articleUrl} description={article.excerpt} variant="inline" />
                    </div>

                    <div className="mt-8">
                        <AffiliateDisclosure />
                    </div>
                    <div className="mt-6">
                        <AdSlot position="in_article" />
                    </div>

                    {/* Topics */}
                    {article.topics && article.topics.length > 0 && (
                        <div className="mt-10 flex flex-wrap items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <span className="text-sm font-medium text-muted-foreground">Topics:</span>
                            {article.topics.map((topic) => (
                                <Link
                                    key={topic.id}
                                    href={`/topic/${topic.slug}`}
                                    className="rounded-sm bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors"
                                >
                                    {topic.name}
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Author Card */}
                    {article.author && (
                        <div className="mt-10 border-t border-border pt-8 animate-in fade-in slide-in-from-bottom-3 duration-500">
                            <div className="flex items-start gap-4">
                                <img
                                    src={authorImage}
                                    alt={article.author.name}
                                    className="h-14 w-14 rounded-full object-cover ring-2 ring-border"
                                />
                                <div>
                                    <Link
                                        href={`/author/${article.author.username}`}
                                        className="text-base font-bold text-foreground hover:text-muted-foreground transition-colors"
                                    >
                                        {article.author.name}
                                    </Link>
                                    {article.author.bio && (
                                        <div className="prose prose-sm mt-1 max-w-none text-sm leading-relaxed text-muted-foreground prose-p:leading-relaxed" dangerouslySetInnerHTML={{ __html: article.author.bio }} />
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="mt-8">
                        <AdSlot position="footer" />
                    </div>
                    <div className="mt-6 flex gap-6">
                        <div className="flex-1" />
                        <div className="hidden lg:block w-80">
                            <AdSlot position="sidebar" />
                        </div>
                    </div>
                </article>

                <AdSlot position="anchor" />

                {/* Related Articles */}
                {relatedArticles && relatedArticles.length > 0 && (
                    <section className="border-t border-border bg-muted/30">
                        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                            <h2 className="mb-6 text-lg font-bold text-foreground">Related Stories</h2>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {relatedArticles.map((related) => (
                                    <ArticleCard key={related.id} article={related} />
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* More from Author */}
                {moreFromAuthor?.data && moreFromAuthor.data.length > 0 && (
                    <section className="border-t border-border">
                        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                            <h2 className="mb-6 text-lg font-bold text-foreground">
                                More from {article.author?.name}
                            </h2>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                {moreFromAuthor.data.map((related) => (
                                    <ArticleCard key={related.id} article={related} />
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                <PublicFooter categories={categories} siteSettings={siteSettings} />
            </div>
        </>
    );
}
