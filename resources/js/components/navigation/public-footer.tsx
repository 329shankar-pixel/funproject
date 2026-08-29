import { Link, usePage } from "@inertiajs/react";
import type { FooterPage, SiteSettings } from "@/types/global";

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface PublicFooterProps {
    categories?: Category[];
    siteSettings?: SiteSettings;
    footerPages?: FooterPage[];
}

export function PublicFooter({ categories: propCategories = [], siteSettings: propSettings, footerPages: propFooterPages }: PublicFooterProps) {
    const page = usePage();
    const sharedSettings = (page.props as unknown as { siteSettings?: SiteSettings }).siteSettings;
    const sharedFooterPages = (page.props as unknown as { sharedFooterPages?: FooterPage[] }).sharedFooterPages;
    const sharedCategories = (page.props as unknown as { sharedCategories?: Category[] }).sharedCategories ?? [];
    const categories = propCategories.length > 0 ? propCategories : sharedCategories;
    const siteSettings: SiteSettings = propSettings ?? sharedSettings ?? {
        site_name: "Editorial",
        site_tagline: "Premium News & Analysis",
        footer_description: "A premium digital publication delivering insightful analysis, breaking news, and in-depth reporting across technology, politics, business, and culture.",
        footer_copyright: "All rights reserved.",
        trending_terms: ["AI", "Climate", "Politics", "Technology", "Economy"],
        header_latest_label: "Latest",
        header_trending_label: "Trending",
        header_explore_label: "Explore",
        home_top_stories_title: "Top Stories",
        home_trending_title: "Trending Now",
        home_latest_title: "Latest Stories",
    };
    const footerPages: FooterPage[] = propFooterPages ?? sharedFooterPages ?? [];
    const defaultAboutLinks = [
        { label: "About Us", href: "/about" },
        { label: "Contact", href: "/contact" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
    ];

    const aboutLinks = footerPages.length > 0
        ? footerPages.map((p) => ({ label: p.title, href: `/page/${p.slug}` }))
        : defaultAboutLinks;

    return (
        <footer className="border-t border-border bg-background">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    <div className="md:col-span-1">
                        <Link href="/" className="text-xl font-bold tracking-tight text-foreground">
                            {siteSettings.site_name}
                        </Link>
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                            {siteSettings.footer_description}
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">Explore</h3>
                        <ul className="mt-4 space-y-2">
                            <li><Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{siteSettings.header_latest_label}</Link></li>
                            <li><Link href="/trending" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{siteSettings.header_trending_label}</Link></li>
                            <li><Link href="/explore" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{siteSettings.header_explore_label}</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">Topics</h3>
                        <ul className="mt-4 space-y-2">
                            {categories.slice(0, 6).map((category) => (
                                <li key={category.id}>
                                    <Link
                                        href={`/category/${category.slug}`}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {category.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">About</h3>
                        <ul className="mt-4 space-y-2">
                            {aboutLinks.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-12 border-t border-border pt-8">
                    <p className="text-center text-xs text-muted-foreground">
                        &copy; {new Date().getFullYear()} {siteSettings.site_name}. {siteSettings.footer_copyright}
                    </p>
                </div>
            </div>
        </footer>
    );
}
