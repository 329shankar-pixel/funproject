import { Head, Link, usePage } from "@inertiajs/react";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { Bookmark, Share2, MessageCircle, Heart } from "lucide-react";
import { ArticleCard } from "@/components/articles/article-card";
import { PublicFooter } from "@/components/navigation/public-footer";
import { PublicHeader } from "@/components/navigation/public-header";
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
}: ArticlePageProps) {
    const page = usePage();
    const siteSettings = (page.props as unknown as { siteSettings?: SiteSettings }).siteSettings ?? { site_name: "Editorial" } as SiteSettings;
    const imageUrl = article.featured_image ?? `https://picsum.photos/seed/${article.id}/1200/675`;
    const authorImage = article.author?.profile_image ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(article.author?.name ?? "A")}&background=171717&color=fff`;
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [liked, setLiked] = useState(false);
    const [showShare, setShowShare] = useState(false);
    const [scrollVisible, setScrollVisible] = useState(false);
    const articleRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            setScrollVisible(window.scrollY > 400);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <Head title={`${article.title} - ${siteSettings.site_name}`} />
            <ReadingProgress />

            <div className="min-h-screen bg-background">
                <PublicHeader categories={categories} siteSettings={siteSettings} />

                {/* Floating share bar on scroll */}
                <div
                    className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transform transition-all duration-500 ${
                        scrollVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
                    }`}
                >
                    <div className="flex items-center gap-1 rounded-full border border-border bg-background/95 px-4 py-2 shadow-lg backdrop-blur">
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
                        <button className="rounded-full p-2 text-muted-foreground hover:text-foreground transition-colors">
                            <MessageCircle className="h-4 w-4" />
                        </button>
                        <div className="relative">
                            <button
                                onClick={() => setShowShare(!showShare)}
                                className="rounded-full p-2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <Share2 className="h-4 w-4" />
                            </button>
                            {showShare && (
                                <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded-lg border border-border bg-background p-2 shadow-lg">
                                    <div className="flex flex-col gap-1 whitespace-nowrap">
                                        <button className="rounded px-3 py-1.5 text-xs hover:bg-muted text-left">Copy link</button>
                                        <button className="rounded px-3 py-1.5 text-xs hover:bg-muted text-left">Share on X</button>
                                        <button className="rounded px-3 py-1.5 text-xs hover:bg-muted text-left">Share on Facebook</button>
                                    </div>
                                </div>
                            )}
                        </div>
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
                                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                                            {article.author.bio}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </article>

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
