import { Link } from "@inertiajs/react";
import { formatDistanceToNow } from "date-fns";

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
    } | null;
    author: {
        name: string;
        username: string;
    } | null;
}

interface HeroStoryProps {
    article: Article;
}

export function HeroStory({ article }: HeroStoryProps) {
    const imageUrl = article.featured_image ?? `https://picsum.photos/seed/${article.id}/1400/700`;

    return (
        <article className="group relative overflow-hidden">
            <Link href={`/article/${article.slug}`} className="block">
                <div className="relative aspect-[21/9] overflow-hidden bg-muted">
                    <img
                        src={imageUrl}
                        alt={article.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 lg:p-12">
                    <div className="mx-auto max-w-4xl">
                        {article.category && (
                            <span className="inline-block rounded-sm bg-white/95 px-3 py-1 text-xs font-bold uppercase tracking-wider text-black backdrop-blur-sm transition-transform duration-300 group-hover:translate-y-0">
                                {article.category.name}
                            </span>
                        )}
                        <h1 className="mt-4 text-3xl font-bold leading-tight text-white md:text-5xl lg:text-6xl transition-all duration-500 group-hover:translate-y-[-2px]">
                            {article.title}
                        </h1>
                        {article.excerpt && (
                            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg line-clamp-2">
                                {article.excerpt}
                            </p>
                        )}
                        <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-white/70">
                            {article.author && (
                                <span className="font-medium text-white">{article.author.name}</span>
                            )}
                            <span className="hidden sm:inline">·</span>
                            <span className="hidden sm:inline">
                                {formatDistanceToNow(new Date(article.published_at), { addSuffix: true })}
                            </span>
                            <span>·</span>
                            <span>{article.reading_time} min read</span>
                        </div>
                    </div>
                </div>
            </Link>
        </article>
    );
}
