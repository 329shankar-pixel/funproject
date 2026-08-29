import { Link } from "@inertiajs/react";
import { formatDistanceToNow } from "date-fns";

interface Article {
    id: number;
    slug: string;
    title: string;
    featured_image: string | null;
    published_at: string;
    reading_time: number;
    category: {
        name: string;
        slug: string;
    } | null;
    author: {
        name: string;
    } | null;
}

interface SecondaryStoryProps {
    article: Article;
    index: number;
}

export function SecondaryStory({ article, index }: SecondaryStoryProps) {
    const imageUrl = article.featured_image ?? `https://picsum.photos/seed/${article.id}/400/300`;

    return (
        <article className="group relative overflow-hidden">
            <Link href={`/article/${article.slug}`} className="block">
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    <img
                        src={imageUrl}
                        alt={article.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-xs font-bold text-black backdrop-blur-sm">
                            {index + 1}
                        </span>
                    </div>
                </div>
                <div className="p-3">
                    {article.category && (
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                            {article.category.name}
                        </span>
                    )}
                    <h3 className="mt-1 text-sm font-semibold leading-snug text-foreground group-hover:text-muted-foreground transition-colors line-clamp-2">
                        {article.title}
                    </h3>
                    <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
                        {article.author && <span>{article.author.name}</span>}
                        <span>·</span>
                        <span>{article.reading_time} min</span>
                    </div>
                </div>
            </Link>
        </article>
    );
}
