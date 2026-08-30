import { Head, Link, usePage, router } from "@inertiajs/react";
import { SeoHead } from "@/components/seo/seo-head";
import { AnalyticsScripts } from "@/components/seo/analytics-scripts";
import { AdSlot } from "@/components/ads/ad-slot";
import { ArticleCard } from "@/components/articles/article-card";
import { PublicFooter } from "@/components/navigation/public-footer";
import { PublicHeader } from "@/components/navigation/public-header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon } from "lucide-react";
import { useState } from "react";
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
interface Category { id: number; name: string; slug: string; }
interface PageProps {
    q: string;
    articles: { data: Article[]; links: any[] } | null;
    categories: Category[];
    seo?: any;
    verificationMeta?: { name: string; content: string }[];
}

export default function Search({ q, articles, categories, seo, verificationMeta }: PageProps) {
    const page = usePage();
    const siteSettings = (page.props as unknown as { siteSettings?: SiteSettings }).siteSettings ?? { site_name: "Public Center" } as SiteSettings;
    const sharedSeo = (page.props as unknown as { seo?: any }).seo;
    const sharedVerification = (page.props as unknown as { verificationMeta?: { name: string; content: string }[] }).verificationMeta;
    const finalSeo = seo ?? sharedSeo;
    const finalVerification = verificationMeta ?? sharedVerification;
    const [search, setSearch] = useState(q ?? "");

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const term = search.trim();
        if (!term) return;
        router.get("/search", { q: term }, { preserveState: false });
    };

    return (
        <>
            {finalSeo ? <SeoHead seo={finalSeo} verification={finalVerification} /> : <Head title={`Search${q ? `: ${q}` : ""} - ${siteSettings.site_name}`} />}
            <AnalyticsScripts />
            <div className="min-h-screen bg-background">
                <PublicHeader categories={categories} siteSettings={siteSettings} />
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4"><AdSlot position="header" /></div>
                <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
                    <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
                        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
                        <span>/</span>
                        <span className="text-foreground">Search</span>
                    </nav>
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Search</h1>
                        {q && <p className="mt-2 text-sm text-muted-foreground">Results for <span className="font-semibold text-foreground">&quot;{q}&quot;</span></p>}
                    </div>
                    <form onSubmit={submit} className="relative mb-8">
                        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
                        <Input
                            type="text"
                            placeholder="Search news, topics, authors..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-14 w-full rounded-sm border border-zinc-300 bg-white pl-12 pr-24 text-lg outline-none placeholder:text-zinc-400 focus:border-black focus:ring-1 focus:ring-black dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-white"
                            autoFocus
                        />
                        <Button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2">Search</Button>
                    </form>

                    {!q && (
                        <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
                            Type a keyword and press Enter to search articles.
                        </div>
                    )}

                    {q && articles && (
                        <>
                            {articles.data.length > 0 ? (
                                <>
                                    <p className="mb-4 text-sm text-muted-foreground">{articles.data.length} results on this page</p>
                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                        {articles.data.map((article) => (
                                            <ArticleCard key={article.id} article={article} />
                                        ))}
                                    </div>
                                    <div className="mt-8 flex flex-wrap gap-2">
                                        {articles.links.map((l: any, i: number) => (
                                            <Button
                                                key={i}
                                                variant={l.active ? "default" : "outline"}
                                                size="sm"
                                                disabled={!l.url}
                                                onClick={() => l.url && router.get(l.url)}
                                                dangerouslySetInnerHTML={{ __html: l.label }}
                                            />
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="py-16 text-center">
                                    <p className="text-lg font-medium text-foreground">No results found for &quot;{q}&quot;</p>
                                    <p className="mt-2 text-sm text-muted-foreground">Try different keywords or check spelling.</p>
                                    <div className="mt-6 flex justify-center gap-2">
                                        <Button variant="outline" asChild><Link href="/">Back to Home</Link></Button>
                                        <Button asChild><Link href="/explore">Explore</Link></Button>
                                    </div>
                                </div>
                            )}
                        </>
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
