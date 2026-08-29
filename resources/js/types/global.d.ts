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

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            auth: Auth;
            sidebarOpen: boolean;
            siteSettings: SiteSettings;
            sharedCategories: SharedCategory[];
            sharedFooterPages: FooterPage[];
            [key: string]: unknown;
        };
    }
}
