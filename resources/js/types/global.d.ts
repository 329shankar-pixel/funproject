import type { Auth } from '@/types/auth';

declare module 'react' {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface InputHTMLAttributes<T> {
        passwordrules?: string;
    }
}

export interface SiteSettings {
    site_name: string;
    site_tagline: string;
    site_logo?: string | null;
    site_logo_url?: string | null;
    site_favicon?: string | null;
    site_favicon_url?: string | null;
    site_url?: string | null;
    footer_description: string;
    footer_copyright: string;
    trending_terms: string[];
    header_latest_label: string;
    header_trending_label: string;
    header_explore_label: string;
    home_top_stories_title: string;
    home_trending_title: string;
    home_latest_title: string;
}

export interface FooterPage {
    id: number;
    title: string;
    slug: string;
}

export interface SharedCategory {
    id: number;
    name: string;
    slug: string;
}

export interface SeoMeta {
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

export interface NavigationLinkItem {
    id: number;
    label: string;
    url: string;
    target: string;
    icon?: string | null;
    is_external?: boolean;
    sort_order?: number;
}

export interface NavigationMenus {
    categories: SharedCategory[];
    headerPages: FooterPage[];
    footerPages: FooterPage[];
    custom: Record<string, NavigationLinkItem[]>;
    social: { platform: string; url: string; label: string }[];
    sharePlatforms: string[];
    headerTop: NavigationLinkItem[];
    headerPrimary: NavigationLinkItem[];
    headerMore: NavigationLinkItem[];
    footerExplore: NavigationLinkItem[];
    footerAbout: NavigationLinkItem[];
    footerLegal: NavigationLinkItem[];
}

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            auth: Auth;
            sidebarOpen: boolean;
            siteSettings: SiteSettings;
            sharedCategories: SharedCategory[];
            sharedFooterPages: FooterPage[];
            seo?: SeoMeta | null;
            seoSettings?: Record<string, unknown>;
            verificationMeta?: { name: string; content: string }[];
            monetization?: Record<string, unknown>;
            navigation?: NavigationMenus;
            socialLinks?: { platform: string; url: string; label: string }[];
            sharePlatforms?: string[];
            [key: string]: unknown;
        };
    }
}
