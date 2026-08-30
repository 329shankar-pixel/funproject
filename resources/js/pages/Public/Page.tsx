import { Head, Link, usePage } from "@inertiajs/react";
import { SeoHead } from "@/components/seo/seo-head";
import { AnalyticsScripts } from "@/components/seo/analytics-scripts";
import { AdSlot } from "@/components/ads/ad-slot";
import { PublicFooter } from "@/components/navigation/public-footer";
import { PublicHeader } from "@/components/navigation/public-header";
import type { SiteSettings } from "@/types/global";

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface PageData {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    body: string;
    featured_image: string | null;
    meta_title: string | null;
    meta_description: string | null;
}

interface PageProps {
    page: PageData;
    categories: Category[];
    seo?: any;
    verificationMeta?: { name: string; content: string }[];
}

export default function PublicPage({ page, categories, seo, verificationMeta }: PageProps) {
    const inertiaPage = usePage();
    const siteSettings = (inertiaPage.props as unknown as { siteSettings?: SiteSettings }).siteSettings ?? { site_name: "Public Center" } as SiteSettings;
    const sharedSeo = (inertiaPage.props as unknown as { seo?: any }).seo;
    const sharedVerification = (inertiaPage.props as unknown as { verificationMeta?: { name: string; content: string }[] }).verificationMeta;
    const finalSeo = seo ?? sharedSeo;
    const finalVerification = verificationMeta ?? sharedVerification;

    return (
        <>
            {finalSeo ? <SeoHead seo={finalSeo} verification={finalVerification} /> : <Head title={`${page.meta_title ?? page.title} - ${siteSettings.site_name}`} />}
            <AnalyticsScripts />
            <div className="min-h-screen bg-background">
                <PublicHeader categories={categories} siteSettings={siteSettings} />
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-4"><AdSlot position="header" /></div>

                <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
                    <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
                        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
                        <span>/</span>
                        <span className="text-foreground">{page.title}</span>
                    </nav>

                    <h1 className="text-3xl font-bold text-foreground sm:text-4xl">{page.title}</h1>
                    {page.excerpt && (
                        <div className="prose prose-lg mt-3 max-w-none text-muted-foreground prose-p:leading-relaxed" dangerouslySetInnerHTML={{ __html: page.excerpt }} />
                    )}

                    {page.featured_image && (
                        <div className="mt-8 overflow-hidden rounded-lg bg-muted">
                            <img src={`/storage/${page.featured_image}`} alt={page.title} className="h-auto w-full object-cover" />
                        </div>
                    )}

                    <div
                        className="prose prose-lg mt-8 max-w-none prose-headings:font-bold prose-headings:text-foreground prose-p:text-foreground/90 prose-a:text-foreground prose-a:underline prose-a:underline-offset-4 prose-strong:text-foreground"
                        dangerouslySetInnerHTML={{ __html: page.body }}
                    />
                    <div className="mt-8"><AdSlot position="in_article" /></div>
                </div>
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pb-6"><AdSlot position="footer" /></div>
                <AdSlot position="anchor" />

                <PublicFooter categories={categories} siteSettings={siteSettings} />
            </div>
        </>
    );
}
