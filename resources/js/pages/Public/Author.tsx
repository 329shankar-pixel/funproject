import { Head, Link, usePage } from "@inertiajs/react";
import { SeoHead } from "@/components/seo/seo-head";
import { AnalyticsScripts } from "@/components/seo/analytics-scripts";
import { AdSlot } from "@/components/ads/ad-slot";
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

interface Author {
    id: number;
    name: string;
    username: string;
    bio: string | null;
    profile_image: string | null;
    cover_image: string | null;
    website: string | null;
    social_links: Record<string, string> | null;
    expertise: string[] | null;
    type: string;
    is_verified: boolean;
    articles_count: number;
    followers_count: number;
}

interface AuthorPageProps {
    author: Author;
    articles: { data: Article[] };
    categories: Category[];
    seo?: any;
    verificationMeta?: { name: string; content: string }[];
}

export default function AuthorPage({ author, articles, categories, seo, verificationMeta }: AuthorPageProps) {
    const profileImage = author.profile_image ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(author.name)}&background=171717&color=fff&size=200`;
    const page = usePage();
    const siteSettings = (page.props as unknown as { siteSettings?: SiteSettings }).siteSettings ?? { site_name: "Editorial" } as SiteSettings;
    const sharedSeo = (page.props as unknown as { seo?: any }).seo;
    const sharedVerification = (page.props as unknown as { verificationMeta?: { name: string; content: string }[] }).verificationMeta;
    const finalSeo = seo ?? sharedSeo;
    const finalVerification = verificationMeta ?? sharedVerification;

    return (
        <>
            {finalSeo ? <SeoHead seo={finalSeo} verification={finalVerification} /> : <Head title={`${author.name} - ${siteSettings.site_name}`} />}
            <AnalyticsScripts />

            <div className="min-h-screen bg-background">
                <PublicHeader categories={categories} siteSettings={siteSettings} />
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4"><AdSlot position="header" /></div>

                {/* Author Header */}
                <div className="border-b border-border bg-muted/30">
                    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
                            <img
                                src={profileImage}
                                alt={author.name}
                                className="h-24 w-24 rounded-full object-cover ring-2 ring-border"
                            />
                            <div>
                                <div className="flex items-center justify-center gap-2 sm:justify-start">
                                    <h1 className="text-2xl font-bold text-foreground">{author.name}</h1>
                                    {author.is_verified && (
                                        <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                                            Verified
                                        </span>
                                    )}
                                </div>
                                <p className="mt-1 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                                    {author.type}
                                </p>
                                {author.bio && (
                                    <div className="prose prose-sm mt-3 max-w-xl text-muted-foreground prose-p:leading-relaxed prose-a:underline" dangerouslySetInnerHTML={{ __html: author.bio }} />
                                )}
                                <div className="mt-4 flex items-center justify-center gap-4 text-sm text-muted-foreground sm:justify-start">
                                    <span>{author.articles_count.toLocaleString()} articles</span>
                                    <span>·</span>
                                    <span>{author.followers_count.toLocaleString()} followers</span>
                                </div>
                                {author.website && (
                                    <a
                                        href={author.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-2 inline-block text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {author.website}
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Articles */}
                <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                    <h2 className="mb-6 text-lg font-bold text-foreground">Articles</h2>
                    {articles?.data && articles.data.length > 0 ? (
                        <>
                        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
                            {articles.data.map((article) => (
                                <ArticleCard key={article.id} article={article} />
                            ))}
                        </div>
                        <div className="mt-8"><AdSlot position="between_articles" /></div>
                        </>
                    ) : (
                        <div className="py-20 text-center">
                            <p className="text-muted-foreground">No articles published yet.</p>
                        </div>
                    )}
                </div>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-6"><AdSlot position="footer" /></div>
                <AdSlot position="anchor" />

                <PublicFooter categories={categories} siteSettings={siteSettings} />
            </div>
        </>
    );
}
