import { Head, Link, usePage } from "@inertiajs/react";
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

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface Topic {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    followers_count: number;
    articles_count: number;
}

interface TopicPageProps {
    topic: Topic;
    articles: { data: Article[] };
    categories: Category[];
}

export default function TopicPage({ topic, articles, categories }: TopicPageProps) {
    const page = usePage();
    const siteSettings = (page.props as unknown as { siteSettings?: SiteSettings }).siteSettings ?? { site_name: "Editorial" } as SiteSettings;
    return (
        <>
            <Head title={`${topic.name} - ${siteSettings.site_name}`} />

            <div className="min-h-screen bg-background">
                <PublicHeader categories={categories} siteSettings={siteSettings} />

                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
                        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
                        <span>/</span>
                        <span className="text-foreground">{topic.name}</span>
                    </nav>

                    {/* Header */}
                    <div className="mb-10 border-b border-border pb-8">
                        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">{topic.name}</h1>
                        {topic.description && (
                            <p className="mt-3 max-w-2xl text-base text-muted-foreground">{topic.description}</p>
                        )}
                        <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{topic.articles_count.toLocaleString()} articles</span>
                            <span>·</span>
                            <span>{topic.followers_count.toLocaleString()} followers</span>
                        </div>
                    </div>

                    {/* Articles */}
                    {articles?.data && articles.data.length > 0 ? (
                        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
                            {articles.data.map((article) => (
                                <ArticleCard key={article.id} article={article} />
                            ))}
                        </div>
                    ) : (
                        <div className="py-20 text-center">
                            <p className="text-muted-foreground">No articles found for this topic.</p>
                        </div>
                    )}
                </div>

                <PublicFooter categories={categories} siteSettings={siteSettings} />
            </div>
        </>
    );
}
