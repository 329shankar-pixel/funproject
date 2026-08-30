import { Link, usePage } from "@inertiajs/react";
import { Facebook, Instagram, Linkedin, Youtube, Send, MessageCircle, AtSign, Pin, Hash, Music2, Mail, Phone } from "lucide-react";

function XIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.244 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    );
}
import type { FooterPage, SiteSettings } from "@/types/global";

interface Category {
    id: number;
    name: string;
    slug: string;
}
interface NavLink {
    id: number;
    label: string;
    url: string;
    target: string;
    is_external?: boolean;
}
interface NavigationMenus {
    categories: Category[];
    headerPages: { id: number; title: string; slug: string }[];
    footerPages: { id: number; title: string; slug: string }[];
    custom: Record<string, NavLink[]>;
    social: { platform: string; url: string; label: string }[];
    footerExplore: NavLink[];
    footerAbout: NavLink[];
    footerLegal: NavLink[];
}

interface PublicFooterProps {
    categories?: Category[];
    siteSettings?: SiteSettings;
    footerPages?: FooterPage[];
}

function DynamicLink({ link, className, children }: { link: NavLink; className?: string; children?: React.ReactNode }) {
    const isExternal = link.is_external || link.url.startsWith("http");
    const target = link.target === "_blank" || isExternal ? "_blank" : undefined;
    const rel = isExternal ? "noopener noreferrer" : undefined;
    const content = children ?? link.label;
    if (isExternal) {
        return (
            <a href={link.url} target={target} rel={rel} className={className}>
                {content}
            </a>
        );
    }
    return (
        <Link href={link.url as any} className={className}>
            {content}
        </Link>
    );
}

function SocialIcon({ platform }: { platform: string }) {
    const p = platform.toLowerCase();
    if (p === "facebook") return <Facebook className="h-4 w-4" />;
    if (p === "twitter" || p === "x") return <XIcon className="h-4 w-4" />;
    if (p === "instagram") return <Instagram className="h-4 w-4" />;
    if (p === "linkedin") return <Linkedin className="h-4 w-4" />;
    if (p === "youtube") return <Youtube className="h-4 w-4" />;
    if (p === "tiktok") return <Music2 className="h-4 w-4" />;
    if (p === "whatsapp") return <MessageCircle className="h-4 w-4" />;
    if (p === "telegram") return <Send className="h-4 w-4" />;
    if (p === "threads") return <AtSign className="h-4 w-4" />;
    if (p === "pinterest") return <Pin className="h-4 w-4" />;
    if (p === "reddit") return <Hash className="h-4 w-4" />;
    return <Hash className="h-4 w-4" />;
}

export function PublicFooter({ categories: propCategories = [], siteSettings: propSettings, footerPages: propFooterPages }: PublicFooterProps) {
    const page = usePage();
    const sharedSettings = (page.props as unknown as { siteSettings?: SiteSettings }).siteSettings;
    const sharedFooterPages = (page.props as unknown as { sharedFooterPages?: FooterPage[] }).sharedFooterPages;
    const sharedCategories = (page.props as unknown as { sharedCategories?: Category[] }).sharedCategories ?? [];
    const navigation = (page.props as unknown as { navigation?: NavigationMenus }).navigation;
    const socialLinksShared = (page.props as unknown as { socialLinks?: { platform: string; url: string; label: string }[] }).socialLinks ?? navigation?.social ?? [];

    const categories = propCategories.length > 0 ? propCategories : navigation?.categories ?? sharedCategories;
    const siteSettings: SiteSettings = propSettings ?? sharedSettings ?? {
        site_name: "Public Center",
        site_tagline: "Nepal's Trusted News & Public Affairs",
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
    const footerPages: FooterPage[] = propFooterPages ?? navigation?.footerPages?.map((p) => ({ id: p.id, title: p.title, slug: p.slug })) ?? sharedFooterPages ?? [];

    // Dynamic footer sections from Admin → Navigation (every link is editable)
    const footerExploreLinks: NavLink[] = navigation?.footerExplore ?? navigation?.custom?.footer_explore ?? [];
    const footerAboutLinks: NavLink[] = navigation?.footerAbout ?? navigation?.custom?.footer_about ?? [];
    const footerLegalLinks: NavLink[] = navigation?.footerLegal ?? navigation?.custom?.footer_legal ?? [];
    const socialProfiles = socialLinksShared;

    // Fallback Explore links if admin hasn't created any yet (still dynamic via categories/pages, but we show defaults as placeholder that admin can override)
    const fallbackExplore: NavLink[] = [
        { id: 9001, label: siteSettings.header_latest_label, url: "/", target: "_self" },
        { id: 9002, label: siteSettings.header_trending_label, url: "/#trending", target: "_self" },
        { id: 9003, label: siteSettings.header_explore_label, url: "/#latest", target: "_self" },
    ];

    const exploreLinks = footerExploreLinks.length > 0 ? footerExploreLinks : fallbackExplore;

    const aboutLinks: { label: string; href: string; external?: boolean; target?: string }[] =
        footerAboutLinks.length > 0
            ? footerAboutLinks.map((l) => ({ label: l.label, href: l.url, external: l.is_external, target: l.target }))
            : footerPages.length > 0
              ? footerPages.map((p) => ({ label: p.title, href: `/page/${p.slug}` }))
              : [
                    { label: "About Us", href: "/page/about" },
                    { label: "Contact", href: "/page/contact" },
                    { label: "Privacy Policy", href: "/page/privacy" },
                    { label: "Terms of Service", href: "/page/terms" },
                ];

    return (
        <footer className="border-t border-zinc-200 bg-zinc-50 dark:bg-zinc-950 dark:border-zinc-900">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
                    {/* Brand */}
                    <div className="md:col-span-4">
                        <Link href="/" className="flex items-center">
                            {siteSettings.site_logo_url ? (
                                <img src={siteSettings.site_logo_url} alt={siteSettings.site_name} className="h-8 w-auto max-w-[180px] object-contain" />
                            ) : (
                                <span className="font-serif text-xl font-black tracking-tighter text-zinc-900 dark:text-white">
                                    {siteSettings.site_name.toUpperCase()}
                                    <span className="text-[#cc0000]">.</span>
                                </span>
                            )}
                        </Link>
                        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">{siteSettings.site_tagline}</p>
                        <div className="prose prose-sm mt-4 max-w-sm text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 prose-p:leading-relaxed prose-a:underline" dangerouslySetInnerHTML={{ __html: siteSettings.footer_description }} />
                        {socialProfiles.length > 0 && (
                            <div className="mt-6 flex flex-wrap gap-2">
                                {socialProfiles.map((s) => (
                                    <a
                                        key={s.platform}
                                        href={s.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={s.label}
                                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 hover:bg-black hover:text-white hover:border-black dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-white dark:hover:text-black transition-colors"
                                    >
                                        <SocialIcon platform={s.platform} />
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Explore — dynamic */}
                    <div className="md:col-span-2">
                        <h3 className="text-xs font-black uppercase tracking-[0.14em] text-zinc-900 dark:text-white">Explore</h3>
                        <ul className="mt-4 space-y-2.5">
                            {exploreLinks.map((link) => (
                                <li key={link.id}>
                                    <DynamicLink link={link} className="text-sm text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors">
                                        {link.label}
                                    </DynamicLink>
                                </li>
                            ))}
                            {/* Also show headerPages that are marked show_in_header as explore */}
                            {navigation?.headerPages?.slice(0, 3).map((p) => (
                                <li key={`hp-${p.id}`}>
                                    <Link href={`/page/${p.slug}`} className="text-sm text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white">
                                        {p.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Topics — categories dynamic via Admin → Categories show_in_menu */}
                    <div className="md:col-span-3">
                        <h3 className="text-xs font-black uppercase tracking-[0.14em] text-zinc-900 dark:text-white">Topics</h3>
                        <ul className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:grid-cols-1">
                            {categories.slice(0, 8).map((category) => (
                                <li key={category.id}>
                                    <Link
                                        href={`/category/${category.slug}`}
                                        className="text-sm text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors"
                                    >
                                        {category.name}
                                    </Link>
                                </li>
                            ))}
                            {categories.length === 0 && <li className="text-sm text-zinc-400">No topics yet — add categories in admin.</li>}
                        </ul>
                    </div>

                    {/* About — dynamic via Pages show_in_footer + Admin → Navigation footer_about */}
                    <div className="md:col-span-3">
                        <h3 className="text-xs font-black uppercase tracking-[0.14em] text-zinc-900 dark:text-white">About</h3>
                        <ul className="mt-4 space-y-2.5">
                            {aboutLinks.map((link) => {
                                const isExt = (link as any).external || link.href.startsWith("http");
                                return (
                                    <li key={link.href}>
                                        {isExt ? (
                                            <a href={link.href} target={(link as any).target ?? "_blank"} rel="noopener noreferrer" className="text-sm text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors">
                                                {link.label}
                                            </a>
                                        ) : (
                                            <Link href={link.href as any} className="text-sm text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors">
                                                {link.label}
                                            </Link>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                        {footerLegalLinks.length > 0 && (
                            <>
                                <h4 className="mt-6 text-xs font-black uppercase tracking-[0.14em] text-zinc-900 dark:text-white">Legal</h4>
                                <ul className="mt-3 space-y-2">
                                    {footerLegalLinks.map((l) => (
                                        <li key={l.id}>
                                            <DynamicLink link={l} className="text-sm text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white">
                                                {l.label}
                                            </DynamicLink>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </div>
                </div>

                <div className="mt-12 flex flex-col gap-4 border-t border-zinc-200 pt-8 dark:border-zinc-800 md:flex-row md:items-center md:justify-between">
                    <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-500">
                        © {new Date().getFullYear()} {siteSettings.site_name}. {siteSettings.footer_copyright}
                    </p>
                    <div className="flex items-center gap-4 text-xs">
                        <span className="hidden items-center gap-1.5 text-zinc-500 sm:flex">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-600" /> All systems operational
                        </span>
                        <span className="hidden h-3 w-px bg-zinc-200 dark:bg-zinc-800 sm:block" />
                        <a href="mailto:hello@example.com" className="inline-flex items-center gap-1.5 text-zinc-600 hover:text-black dark:text-zinc-400">
                            <Mail className="h-3.5 w-3.5" /> Contact
                        </a>
                        <a href="tel:+1" className="inline-flex items-center gap-1.5 text-zinc-600 hover:text-black dark:text-zinc-400">
                            <Phone className="h-3.5 w-3.5" /> Support
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
