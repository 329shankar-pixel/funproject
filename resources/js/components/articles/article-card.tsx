import { Link } from "@inertiajs/react";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { Bookmark, Share2, TrendingUp } from "lucide-react";

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
        color?: string | null;
    } | null;
    author: {
        name: string;
        username: string;
    } | null;
}

interface ArticleCardProps {
    article: Article;
    variant?: "default" | "compact" | "horizontal" | "featured";
    showExcerpt?: boolean;
    showImage?: boolean;
    className?: string;
}

export function ArticleCard({
    article,
    variant = "default",
    showExcerpt = true,
    showImage = true,
    className = "",
}: ArticleCardProps) {
    const imageUrl = article.featured_image ?? `https://picsum.photos/seed/${article.id}/800/500`;
    const [isHovered, setIsHovered] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [showShare, setShowShare] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );
        if (cardRef.current) observer.observe(cardRef.current);
        return () => observer.disconnect();
    }, []);

    if (variant === "compact") {
        return (
            <article ref={cardRef} className={`group ${className} ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"} transition-all duration-500`}>
                <Link href={`/article/${article.slug}`} className="block">
                    <div className="flex gap-4">
                        {showImage && (
                            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden bg-muted">
                                <img
                                    src={imageUrl}
                                    alt={article.title}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    loading="lazy"
                                />
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            {article.category && (
                                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                    {article.category.name}
                                </span>
                            )}
                            <h3 className="mt-0.5 text-sm font-medium leading-snug text-foreground group-hover:text-muted-foreground transition-colors line-clamp-2">
                                {article.title}
                            </h3>
                            <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                                {article.author && <span>{article.author.name}</span>}
                                <span>·</span>
                                <span>{article.reading_time} min read</span>
                            </div>
                        </div>
                    </div>
                </Link>
            </article>
        );
    }

    if (variant === "horizontal") {
        return (
            <article ref={cardRef} className={`group ${className} ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"} transition-all duration-500`}>
                <Link href={`/article/${article.slug}`} className="flex gap-5">
                    {showImage && (
                        <div className="relative h-32 w-48 flex-shrink-0 overflow-hidden bg-muted">
                            <img
                                src={imageUrl}
                                alt={article.title}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                loading="lazy"
                            />
                        </div>
                    )}
                    <div className="flex flex-1 flex-col justify-center">
                        {article.category && (
                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                {article.category.name}
                            </span>
                        )}
                        <h3 className="mt-1 text-lg font-semibold leading-snug text-foreground group-hover:text-muted-foreground transition-colors">
                            {article.title}
                        </h3>
                        {showExcerpt && article.excerpt && (
                            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                                {article.excerpt}
                            </p>
                        )}
                        <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                            {article.author && <span className="font-medium">{article.author.name}</span>}
                            <span>·</span>
                            <span>{formatDistanceToNow(new Date(article.published_at), { addSuffix: true })}</span>
                            <span>·</span>
                            <span>{article.reading_time} min read</span>
                        </div>
                    </div>
                </Link>
            </article>
        );
    }

    if (variant === "featured") {
        return (
            <article
                ref={cardRef}
                className={`group ${className} ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"} transition-all duration-500`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => { setIsHovered(false); setShowShare(false); }}
            >
                <Link href={`/article/${article.slug}`} className="block">
                    {showImage && (
                        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                            <img
                                src={imageUrl}
                                alt={article.title}
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className={`absolute inset-0 bg-black/0 transition-colors duration-300 ${isHovered ? "bg-black/10" : ""}`} />
                        </div>
                    )}
                    <div className="mt-4">
                        {article.category && (
                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                {article.category.name}
                            </span>
                        )}
                        <h3 className="mt-2 text-2xl font-bold leading-tight text-foreground group-hover:text-muted-foreground transition-colors">
                            {article.title}
                        </h3>
                        {showExcerpt && article.excerpt && (
                            <p className="mt-3 line-clamp-3 text-base leading-relaxed text-muted-foreground">
                                {article.excerpt}
                            </p>
                        )}
                        <div className="mt-4 flex items-center gap-3 text-sm text-muted-foreground">
                            {article.author && <span className="font-medium">{article.author.name}</span>}
                            <span>·</span>
                            <span>{formatDistanceToNow(new Date(article.published_at), { addSuffix: true })}</span>
                            <span>·</span>
                            <span>{article.reading_time} min read</span>
                        </div>
                    </div>
                </Link>
            </article>
        );
    }

    return (
        <article
            ref={cardRef}
            className={`group relative ${className} ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"} transition-all duration-500`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => { setIsHovered(false); setShowShare(false); }}
        >
            <Link href={`/article/${article.slug}`} className="block">
                {showImage && (
                    <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                        <img
                            src={imageUrl}
                            alt={article.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                        />
                        <div className={`absolute inset-0 bg-black/0 transition-colors duration-300 ${isHovered ? "bg-black/10" : ""}`} />
                        {article.view_count > 10000 && (
                            <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                                <TrendingUp className="h-3 w-3" />
                                <span>Trending</span>
                            </div>
                        )}
                    </div>
                )}
                <div className="mt-3">
                    {article.category && (
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            {article.category.name}
                        </span>
                    )}
                    <h3 className="mt-1.5 text-base font-semibold leading-snug text-foreground group-hover:text-muted-foreground transition-colors">
                        {article.title}
                    </h3>
                    {showExcerpt && article.excerpt && (
                        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                            {article.excerpt}
                        </p>
                    )}
                    <div className="mt-2.5 flex items-center gap-2 text-xs text-muted-foreground">
                        {article.author && <span>{article.author.name}</span>}
                        <span>·</span>
                        <span>{article.reading_time} min read</span>
                    </div>
                </div>
            </Link>
            {/* Action buttons on hover */}
            <div className={`absolute top-2 right-2 flex gap-1 transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}>
                <button
                    onClick={(e) => { e.preventDefault(); setIsBookmarked(!isBookmarked); }}
                    className={`rounded-full p-1.5 backdrop-blur-sm transition-colors ${isBookmarked ? "bg-primary text-primary-foreground" : "bg-black/50 text-white hover:bg-black/70"}`}
                    title="Bookmark"
                >
                    <Bookmark className={`h-3.5 w-3.5 ${isBookmarked ? "fill-current" : ""}`} />
                </button>
                <button
                    onClick={(e) => { e.preventDefault(); setShowShare(!showShare); }}
                    className="rounded-full bg-black/50 p-1.5 text-white backdrop-blur-sm hover:bg-black/70 transition-colors"
                    title="Share"
                >
                    <Share2 className="h-3.5 w-3.5" />
                </button>
            </div>
            {/* Share popup */}
            {showShare && (
                <div className="absolute top-10 right-2 z-10 rounded-lg border border-border bg-background p-2 shadow-lg">
                    <div className="flex flex-col gap-1">
                        <button className="rounded px-2 py-1 text-xs hover:bg-muted text-left">Copy link</button>
                        <button className="rounded px-2 py-1 text-xs hover:bg-muted text-left">Share on X</button>
                        <button className="rounded px-2 py-1 text-xs hover:bg-muted text-left">Share on Facebook</button>
                    </div>
                </div>
            )}
        </article>
    );
}
