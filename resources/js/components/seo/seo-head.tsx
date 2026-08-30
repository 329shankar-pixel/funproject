import { Head } from '@inertiajs/react';

export interface SeoProps {
    title: string;
    description: string;
    keywords?: string | null;
    robots?: string | null;
    canonical?: string | null;
    og_title?: string | null;
    og_description?: string | null;
    og_image?: string | null;
    og_type?: string | null;
    og_url?: string | null;
    og_site_name?: string | null;
    twitter_card?: string | null;
    twitter_site?: string | null;
    twitter_creator?: string | null;
    twitter_title?: string | null;
    twitter_description?: string | null;
    twitter_image?: string | null;
    structured_data?: Record<string, unknown> | null;
    hreflang?: string | null;
}

export function SeoHead({ seo, verification }: { seo?: SeoProps | null; verification?: { name: string; content: string }[] }) {
    if (!seo) return null;

    return (
        <Head>
            <title>{seo.title}</title>
            {seo.description && <meta name="description" content={seo.description} />}
            {seo.keywords && <meta name="keywords" content={seo.keywords} />}
            {seo.robots && <meta name="robots" content={seo.robots} />}
            {seo.canonical && <link rel="canonical" href={seo.canonical} />}
            {seo.hreflang && seo.canonical && <link rel="alternate" href={seo.canonical} hrefLang={seo.hreflang} />}

            {/* Open Graph */}
            {seo.og_title && <meta property="og:title" content={seo.og_title} />}
            {seo.og_description && <meta property="og:description" content={seo.og_description} />}
            {seo.og_type && <meta property="og:type" content={seo.og_type} />}
            {seo.og_url && <meta property="og:url" content={seo.og_url} />}
            {seo.og_site_name && <meta property="og:site_name" content={seo.og_site_name} />}
            {seo.og_image && <meta property="og:image" content={seo.og_image} />}

            {/* Twitter */}
            {seo.twitter_card && <meta name="twitter:card" content={seo.twitter_card} />}
            {seo.twitter_site && <meta name="twitter:site" content={seo.twitter_site} />}
            {seo.twitter_creator && <meta name="twitter:creator" content={seo.twitter_creator} />}
            {seo.twitter_title && <meta name="twitter:title" content={seo.twitter_title} />}
            {seo.twitter_description && <meta name="twitter:description" content={seo.twitter_description} />}
            {seo.twitter_image && <meta name="twitter:image" content={seo.twitter_image} />}

            {/* Verification */}
            {verification?.map((tag) => (
                <meta key={tag.name} name={tag.name} content={tag.content} />
            ))}

            {/* Structured Data */}
            {seo.structured_data && (
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(seo.structured_data) }} />
            )}
        </Head>
    );
}
