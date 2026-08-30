import { Link, usePage } from "@inertiajs/react";
import { Search, Menu, X, User, Bell, ChevronDown, Radio, Facebook, Instagram, Linkedin, Youtube, Send, MessageCircle, AtSign, Pin, Hash, Music2 } from "lucide-react";

function XIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.244 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    );
}
import { useState, useEffect, useMemo, useRef } from "react";
import { format } from "date-fns";
import type { SiteSettings } from "@/types/global";

interface Category {
    id: number;
    name: string;
    slug: string;
}
interface Topic {
    id: number;
    name: string;
    slug: string;
}
interface NavLink {
    id: number;
    label: string;
    url: string;
    target: string;
    icon?: string | null;
    is_external?: boolean;
}
interface NavigationMenus {
    categories: Category[];
    headerPages: { id: number; title: string; slug: string }[];
    footerPages: { id: number; title: string; slug: string }[];
    custom: Record<string, NavLink[]>;
    social: { platform: string; url: string; label: string }[];
    sharePlatforms: string[];
    headerTop: NavLink[];
    headerPrimary: NavLink[];
    headerMore: NavLink[];
    footerExplore: NavLink[];
    footerAbout: NavLink[];
    footerLegal: NavLink[];
}
interface PublicHeaderProps {
    categories?: Category[];
    trendingTopics?: Topic[];
    siteSettings?: SiteSettings;
}

function DynamicLink({ link, className, children, onClick }: { link: NavLink; className?: string; children: React.ReactNode; onClick?: () => void }) {
    const isExternal = link.is_external || link.url.startsWith("http");
    const target = link.target === "_blank" || isExternal ? "_blank" : undefined;
    const rel = isExternal ? "noopener noreferrer" : undefined;
    if (isExternal) {
        return (
            <a href={link.url} target={target} rel={rel} className={className} onClick={onClick}>
                {children}
            </a>
        );
    }
    return (
        <Link href={link.url as any} className={className} onClick={onClick}>
            {children}
        </Link>
    );
}

function SocialIcon({ platform }: { platform: string }) {
    const p = platform.toLowerCase();
    if (p === "facebook") return <Facebook className="h-3.5 w-3.5" />;
    if (p === "twitter" || p === "x") return <XIcon className="h-3.5 w-3.5" />;
    if (p === "instagram") return <Instagram className="h-3.5 w-3.5" />;
    if (p === "linkedin") return <Linkedin className="h-3.5 w-3.5" />;
    if (p === "youtube") return <Youtube className="h-3.5 w-3.5" />;
    if (p === "tiktok") return <Music2 className="h-3.5 w-3.5" />;
    if (p === "whatsapp") return <MessageCircle className="h-3.5 w-3.5" />;
    if (p === "telegram") return <Send className="h-3.5 w-3.5" />;
    if (p === "threads") return <AtSign className="h-3.5 w-3.5" />;
    if (p === "pinterest") return <Pin className="h-3.5 w-3.5" />;
    if (p === "reddit") return <Hash className="h-3.5 w-3.5" />;
    return <Hash className="h-3.5 w-3.5" />;
}

export function PublicHeader({ categories: propCategories, trendingTopics: propTrending, siteSettings: propSettings }: PublicHeaderProps) {
    const page = usePage();
    const sharedSettings = (page.props as unknown as { siteSettings?: SiteSettings }).siteSettings;
    const sharedCategories = (page.props as unknown as { sharedCategories?: Category[] }).sharedCategories ?? [];
    const navigation = (page.props as unknown as { navigation?: NavigationMenus }).navigation;
    const socialLinksShared = (page.props as unknown as { socialLinks?: { platform: string; url: string; label: string }[] }).socialLinks ?? navigation?.social ?? [];

    const categories = propCategories && propCategories.length > 0 ? propCategories : navigation?.categories ?? sharedCategories;
    const sharedTrendingTopics = (page.props as unknown as { trendingTopics?: Topic[] }).trendingTopics ?? [];
    const trendingTopics: Topic[] = propTrending && propTrending.length > 0 ? propTrending : sharedTrendingTopics;

    // Dynamic menus from admin
    const headerPages = navigation?.headerPages ?? [];
    const headerTopLinks: NavLink[] = navigation?.headerTop ?? navigation?.custom?.header_top ?? [];
    const headerPrimaryLinks: NavLink[] = navigation?.headerPrimary ?? navigation?.custom?.header_primary ?? [];
    const headerMoreLinks: NavLink[] = navigation?.headerMore ?? navigation?.custom?.header_more ?? [];
    const socialProfiles = socialLinksShared;

    const siteSettings: SiteSettings = propSettings ?? sharedSettings ?? {
        site_name: "Public Center",
        site_tagline: "Nepal's Trusted News & Public Affairs",
        footer_description: "",
        footer_copyright: "All rights reserved.",
        trending_terms: ["AI", "Climate", "Politics", "Technology", "Economy"],
        header_latest_label: "Latest",
        header_trending_label: "Trending",
        header_explore_label: "Explore",
        home_top_stories_title: "Top Stories",
        home_trending_title: "Trending Now",
        home_latest_title: "Latest Stories",
    };

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [moreOpen, setMoreOpen] = useState(false);
    const moreRef = useRef<HTMLDivElement>(null);
    const auth = (page.props as unknown as { auth?: { user?: { name: string } } }).auth;

    const todayLabel = useMemo(() => {
        try {
            return format(new Date(), "EEEE, MMMM d, yyyy");
        } catch {
            return "";
        }
    }, []);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 8);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    useEffect(() => setMobileMenuOpen(false), [page.url]);
    useEffect(() => setMoreOpen(false), [page.url]);
    useEffect(() => {
        if (mobileMenuOpen || searchOpen) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "";
        return () => { document.body.style.overflow = ""; };
    }, [mobileMenuOpen, searchOpen]);
    useEffect(() => {
        if (!moreOpen) return;
        const handleClickOutside = (e: MouseEvent) => {
            if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
                setMoreOpen(false);
            }
        };
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") setMoreOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEsc);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEsc);
        };
    }, [moreOpen]);

    const currentPath = useMemo(() => {
        try {
            return new URL(page.url, typeof window !== "undefined" ? window.location.origin : "http://localhost").pathname;
        } catch {
            return page.url;
        }
    }, [page.url]);

    const isActive = (href: string) => {
        if (href === "/") return currentPath === "/";
        return currentPath.startsWith(href);
    };

    return (
        <>
            {/* Top utility bar — every link + social icon is dynamic via Admin → Navigation (header_top) + Social Media */}
            <div className="hidden border-b border-zinc-800 bg-zinc-950 text-zinc-300 md:block">
                <div className="mx-auto flex h-8 max-w-7xl items-center justify-between px-4 text-xs sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3">
                        <span className="hidden items-center gap-2 font-medium tracking-wide text-zinc-100 sm:flex">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-600" />
                            LIVE
                        </span>
                        <span className="hidden text-zinc-600 lg:inline">•</span>
                        <span className="hidden lg:inline">{todayLabel}</span>
                        <span className="hidden text-zinc-600 lg:inline">•</span>
                        <span className="hidden lg:inline">
                            <span className="text-zinc-400">Edition:</span> <span className="font-semibold text-zinc-100">Global</span>
                        </span>
                        {/* Dynamic header_top links */}
                        {headerTopLinks.length > 0 && (
                            <>
                                <span className="hidden h-3 w-px bg-zinc-800 lg:block" />
                                <div className="hidden items-center gap-3 lg:flex">
                                    {headerTopLinks.map((l) => (
                                        <DynamicLink key={l.id} link={l} className="hover:text-white transition-colors">
                                            {l.label}
                                        </DynamicLink>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Dynamic social profiles in top bar */}
                        {socialProfiles.length > 0 && (
                            <div className="hidden items-center gap-2 lg:flex">
                                {socialProfiles.slice(0, 5).map((s) => (
                                    <a key={s.platform} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="p-1 hover:text-white transition-colors">
                                        <SocialIcon platform={s.platform} />
                                    </a>
                                ))}
                                <span className="h-3 w-px bg-zinc-800" />
                            </div>
                        )}
                        <a href="#" aria-label="Notifications" className="hidden p-1 hover:text-white lg:block">
                            <Bell className="h-3.5 w-3.5" />
                        </a>
                        {auth?.user ? (
                            <Link href="/admin" className="flex items-center gap-1.5 font-medium text-white hover:text-zinc-300">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-800 text-xs font-bold">{auth.user.name?.[0]?.toUpperCase()}</span>
                                Account
                            </Link>
                        ) : (
                            <Link href="/login" className="font-semibold text-white hover:text-zinc-300">
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Masthead + Primary Nav */}
            <header
                className={`sticky top-0 z-50 border-b bg-white dark:bg-zinc-950 dark:border-zinc-900 transition-shadow duration-300 ${scrolled ? "shadow-[0_2px_10px_rgba(0,0,0,0.08)]" : "shadow-none"} border-zinc-200 dark:border-zinc-900`}
            >
                {/* Masthead */}
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-[64px] items-center justify-between gap-4 md:h-[72px]">
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setMobileMenuOpen(true)}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 hover:text-black dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 md:h-10 md:w-10"
                                aria-label="Open menu"
                            >
                                <Menu className="h-5 w-5" />
                            </button>
                            <button
                                onClick={() => setSearchOpen(true)}
                                className="hidden h-10 w-10 items-center justify-center rounded-sm text-zinc-600 hover:bg-zinc-50 hover:text-black dark:text-zinc-400 dark:hover:bg-zinc-900 md:inline-flex"
                                aria-label="Search"
                            >
                                <Search className="h-[18px] w-[18px]" />
                            </button>
                        </div>

                        <div className="absolute left-1/2 flex -translate-x-1/2 flex-col items-center">
                            <Link href="/" className="group flex flex-col items-center">
                                {siteSettings.site_logo_url ? (
                                    <img src={siteSettings.site_logo_url} alt={siteSettings.site_name} className="h-8 w-auto max-w-[180px] object-contain md:h-9 lg:h-10" />
                                ) : (
                                    <span className="font-serif text-[28px] font-black tracking-tighter text-black dark:text-white md:text-[34px] lg:text-[38px] leading-none">
                                        {siteSettings.site_name.toUpperCase()}
                                        <span className="text-[#cc0000]">.</span>
                                    </span>
                                )}
                                <span className="hidden text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400 md:block">
                                    {siteSettings.site_tagline}
                                </span>
                            </Link>
                        </div>

                        <div className="flex items-center gap-1 sm:gap-2">
                            <Link
                                href="/login"
                                className="hidden items-center gap-1.5 rounded-sm px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-900 md:inline-flex"
                            >
                                <User className="h-4 w-4" />
                                <span className="hidden lg:inline">Sign In</span>
                            </Link>
                            <button
                                onClick={() => setSearchOpen(true)}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 md:hidden dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
                                aria-label="Search"
                            >
                                <Search className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Primary navigation — categories + pages(show_in_header) + custom header_primary — all dynamic */}
                <div className="border-t border-zinc-200 bg-white dark:border-zinc-900 dark:bg-zinc-950">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="relative flex items-center">
                            <div className="flex min-w-0 flex-1 items-center gap-1">
                                <nav className="flex flex-1 items-center gap-1 overflow-x-auto py-2.5 scrollbar-hide md:gap-0" aria-label="Primary">
                                    <Link
                                        href="/"
                                        className={`whitespace-nowrap px-3 py-1.5 text-xs font-bold uppercase tracking-widest rounded-sm transition-colors ${isActive("/") ? "bg-black text-white dark:bg-white dark:text-black" : "text-zinc-700 hover:bg-zinc-100 hover:text-black dark:text-zinc-300 dark:hover:bg-zinc-900"}`}
                                    >
                                        Home
                                    </Link>
                                    <span className="mx-1 hidden h-4 w-px bg-zinc-200 dark:bg-zinc-800 md:block" />
                                    {categories.slice(0, 8).map((cat) => (
                                        <Link
                                            key={cat.id}
                                            href={`/category/${cat.slug}`}
                                            className={`whitespace-nowrap px-3 py-1.5 text-xs font-bold uppercase tracking-widest rounded-sm transition-colors ${isActive(`/category/${cat.slug}`) ? "bg-black text-white dark:bg-white dark:text-black" : "text-zinc-700 hover:bg-zinc-100 hover:text-black dark:text-zinc-300 dark:hover:bg-zinc-900"}`}
                                        >
                                            {cat.name}
                                        </Link>
                                    ))}
                                    {/* Pages where show_in_header */}
                                    {headerPages.slice(0, 4).map((p) => (
                                        <Link
                                            key={p.id}
                                            href={`/page/${p.slug}`}
                                            className={`whitespace-nowrap px-3 py-1.5 text-xs font-bold uppercase tracking-widest rounded-sm transition-colors ${isActive(`/page/${p.slug}`) ? "bg-black text-white dark:bg-white dark:text-black" : "text-zinc-700 hover:bg-zinc-100 hover:text-black dark:text-zinc-300 dark:hover:bg-zinc-900"}`}
                                        >
                                            {p.title}
                                        </Link>
                                    ))}
                                    {/* Custom admin primary links */}
                                    {headerPrimaryLinks.map((l) => (
                                        <DynamicLink
                                            key={l.id}
                                            link={l}
                                            className={`whitespace-nowrap px-3 py-1.5 text-xs font-bold uppercase tracking-widest rounded-sm transition-colors flex items-center gap-1.5 ${isActive(l.url) ? "bg-black text-white dark:bg-white dark:text-black" : "text-zinc-700 hover:bg-zinc-100 hover:text-black dark:text-zinc-300 dark:hover:bg-zinc-900"}`}
                                        >
                                            {l.icon === "radio" && <Radio className="h-3 w-3 text-red-600" />}
                                            {l.label}
                                        </DynamicLink>
                                    ))}
                                </nav>
                                {/* More dropdown: extracted outside overflow container so it is not clipped */}
                                {(categories.length > 8 || headerPages.length > 4 || headerMoreLinks.length > 0) && (
                                    <div ref={moreRef} className="relative ml-1 shrink-0">
                                        <button
                                            onClick={() => setMoreOpen((v) => !v)}
                                            aria-expanded={moreOpen}
                                            aria-haspopup="menu"
                                            className="flex items-center gap-1 whitespace-nowrap rounded-sm px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-zinc-700 hover:bg-zinc-100 hover:text-black dark:text-zinc-300"
                                        >
                                            More <ChevronDown className={`h-3 w-3 transition-transform ${moreOpen ? "rotate-180" : ""}`} />
                                        </button>
                                        {moreOpen && (
                                            <div className="absolute right-0 top-full z-50 mt-2 min-w-[220px] border border-zinc-200 bg-white py-2 shadow-xl dark:border-zinc-800 dark:bg-zinc-900" role="menu">
                                                {categories.slice(8, 16).map((cat) => (
                                                    <Link key={cat.id} href={`/category/${cat.slug}`} onClick={() => setMoreOpen(false)} className="block px-4 py-2 text-xs font-bold uppercase tracking-widest text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300" role="menuitem">
                                                        {cat.name}
                                                    </Link>
                                                ))}
                                                {headerPages.slice(4, 8).map((p) => (
                                                    <Link key={p.id} href={`/page/${p.slug}`} onClick={() => setMoreOpen(false)} className="block px-4 py-2 text-xs font-bold uppercase tracking-widest text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300" role="menuitem">
                                                        {p.title}
                                                    </Link>
                                                ))}
                                                {headerMoreLinks.map((l) => (
                                                    <DynamicLink key={l.id} link={l} className="block px-4 py-2 text-xs font-bold uppercase tracking-widest text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300" onClick={() => setMoreOpen(false)}>
                                                        {l.label}
                                                    </DynamicLink>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="hidden items-center gap-2 border-l border-zinc-200 pl-3 dark:border-zinc-800 md:flex">
                                <button
                                    onClick={() => setSearchOpen(true)}
                                    className="inline-flex items-center gap-2 rounded-sm border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-zinc-600 hover:bg-white dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400"
                                >
                                    <Search className="h-3.5 w-3.5" /> Search
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Trending strip — uses trendingTopics prop passed from Home */}
                {trendingTopics.length > 0 && (
                    <div className="border-t border-zinc-200 bg-[#f8f8f8] dark:bg-zinc-900 dark:border-zinc-800">
                        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2 sm:px-6 lg:px-8">
                            <span className="inline-flex shrink-0 items-center gap-1.5 bg-[#cc0000] px-2 py-1 text-xs font-black uppercase tracking-widest text-white">
                                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" /> Trending
                            </span>
                            <div className="flex flex-1 items-center gap-3 overflow-x-auto scrollbar-hide">
                                {trendingTopics.slice(0, 8).map((topic, idx) => (
                                    <span key={topic.id} className="flex items-center gap-3 shrink-0">
                                        <Link href={`/topic/${topic.slug}`} className="whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-zinc-700 hover:text-black dark:text-zinc-300 dark:hover:text-white">
                                            {topic.name}
                                        </Link>
                                        {idx < Math.min(trendingTopics.length, 8) - 1 && <span className="text-zinc-300 dark:text-zinc-700">•</span>}
                                    </span>
                                ))}
                                <Link href="/explore" className="ml-2 hidden whitespace-nowrap text-xs font-bold uppercase tracking-widest text-[#cc0000] hover:underline sm:inline">
                                    View all →
                                </Link>
                            </div>
                            <span className="hidden text-xs text-zinc-500 dark:text-zinc-500 lg:block">{todayLabel}</span>
                        </div>
                    </div>
                )}
            </header>

            {/* Mobile off-canvas — every section is dynamic from admin */}
            <div className={`fixed inset-0 z-[70] ${mobileMenuOpen ? "visible" : "invisible"}`} aria-hidden={!mobileMenuOpen}>
                <div className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity ${mobileMenuOpen ? "opacity-100" : "opacity-0"}`} onClick={() => setMobileMenuOpen(false)} />
                <div className={`absolute left-0 top-0 flex h-full w-[340px] max-w-[85vw] flex-col bg-white shadow-2xl transition-transform duration-300 dark:bg-zinc-950 ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
                    <div className="flex h-[64px] items-center justify-between border-b border-zinc-200 px-4 dark:border-zinc-800">
                        {siteSettings.site_logo_url ? (
                            <img src={siteSettings.site_logo_url} alt={siteSettings.site_name} className="h-7 w-auto max-w-[160px] object-contain" />
                        ) : (
                            <span className="font-serif text-xl font-black tracking-tighter">
                                {siteSettings.site_name.toUpperCase()}
                                <span className="text-[#cc0000]">.</span>
                            </span>
                        )}
                        <button onClick={() => setMobileMenuOpen(false)} className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-zinc-200 bg-white hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        <div className="p-4">
                            <div className="mb-6">
                                <Link href="/login" className="flex rounded-sm border border-zinc-200 py-2.5 text-center text-sm font-bold uppercase tracking-wide dark:border-zinc-800 justify-center">
                                    Sign In
                                </Link>
                            </div>

                            <nav className="space-y-6">
                                <div>
                                    <p className="mb-3 text-xs font-black uppercase tracking-[0.14em] text-zinc-900 dark:text-white">Sections</p>
                                    <div className="grid gap-1">
                                        <Link href="/" onClick={() => setMobileMenuOpen(false)} className={`flex items-center justify-between rounded-sm px-3 py-2.5 text-sm font-bold uppercase tracking-wide ${isActive("/") ? "bg-black text-white dark:bg-white dark:text-black" : "bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900"}`}>
                                            Home
                                        </Link>
                                        {categories.map((cat) => (
                                            <Link
                                                key={cat.id}
                                                href={`/category/${cat.slug}`}
                                                onClick={() => setMobileMenuOpen(false)}
                                                className={`flex items-center justify-between rounded-sm px-3 py-2.5 text-sm font-semibold uppercase tracking-wide hover:bg-zinc-50 dark:hover:bg-zinc-900 ${isActive(`/category/${cat.slug}`) ? "bg-black text-white dark:bg-white dark:text-black" : "text-zinc-700 dark:text-zinc-300"}`}
                                            >
                                                {cat.name}
                                            </Link>
                                        ))}
                                        {headerPages.map((p) => (
                                            <Link
                                                key={p.id}
                                                href={`/page/${p.slug}`}
                                                onClick={() => setMobileMenuOpen(false)}
                                                className={`rounded-sm px-3 py-2.5 text-sm font-semibold uppercase tracking-wide hover:bg-zinc-50 dark:hover:bg-zinc-900 ${isActive(`/page/${p.slug}`) ? "bg-black text-white dark:bg-white dark:text-black" : "text-zinc-700 dark:text-zinc-300"}`}
                                            >
                                                {p.title}
                                            </Link>
                                        ))}
                                        {headerPrimaryLinks.map((l) => (
                                            <DynamicLink key={l.id} link={l} className="rounded-sm px-3 py-2.5 text-sm font-semibold uppercase tracking-wide text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300" onClick={() => setMobileMenuOpen(false)}>
                                                {l.label}
                                            </DynamicLink>
                                        ))}
                                    </div>
                                </div>

                                {/* Dynamic social in mobile */}
                                {socialProfiles.length > 0 && (
                                    <div className="border-t border-zinc-200 pt-6 dark:border-zinc-800">
                                        <p className="mb-3 text-xs font-black uppercase tracking-[0.14em] text-zinc-900 dark:text-white">Follow Us</p>
                                        <div className="flex flex-wrap gap-2">
                                            {socialProfiles.map((s) => (
                                                <a key={s.platform} href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-semibold capitalize hover:bg-black hover:text-white dark:border-zinc-800 dark:bg-zinc-900">
                                                    <SocialIcon platform={s.platform} /> {s.platform}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="border-t border-zinc-200 pt-6 dark:border-zinc-800">
                                    <p className="mb-3 text-xs font-black uppercase tracking-[0.14em] text-zinc-900 dark:text-white">Trending Tonight</p>
                                    <div className="flex flex-wrap gap-2">
                                        {trendingTopics.length > 0 ? (
                                            trendingTopics.slice(0, 8).map((topic) => (
                                                <Link
                                                    key={topic.id}
                                                    href={`/topic/${topic.slug}`}
                                                    onClick={() => setMobileMenuOpen(false)}
                                                    className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide hover:bg-black hover:text-white dark:border-zinc-800 dark:bg-zinc-900"
                                                >
                                                    {topic.name}
                                                </Link>
                                            ))
                                        ) : (
                                            siteSettings.trending_terms.slice(0, 8).map((term) => (
                                                <Link
                                                    key={term}
                                                    href="/topics"
                                                    onClick={() => setMobileMenuOpen(false)}
                                                    className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide hover:bg-black hover:text-white dark:border-zinc-800 dark:bg-zinc-900"
                                                >
                                                    {term}
                                                </Link>
                                            ))
                                        )}
                                    </div>
                                </div>

                                <div className="border-t border-zinc-200 pt-6 dark:border-zinc-800">
                                    <p className="mb-3 text-xs font-black uppercase tracking-[0.14em] text-zinc-900 dark:text-white">Quick Links</p>
                                    <div className="space-y-1 text-sm">
                                        {headerTopLinks.map((l) => (
                                            <DynamicLink key={l.id} link={l} className="flex py-2 text-zinc-600 hover:text-black dark:text-zinc-400" onClick={() => setMobileMenuOpen(false)}>
                                                {l.label}
                                            </DynamicLink>
                                        ))}
                                        {headerMoreLinks.map((l) => (
                                            <DynamicLink key={l.id} link={l} className="flex py-2 text-zinc-600 hover:text-black dark:text-zinc-400" onClick={() => setMobileMenuOpen(false)}>
                                                {l.label}
                                            </DynamicLink>
                                        ))}
                                    </div>
                                </div>
                            </nav>
                        </div>
                    </div>

                    <div className="border-t border-zinc-200 bg-zinc-50 p-4 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900">
                        <p className="mt-2 text-[11px] uppercase tracking-wide">
                            © {new Date().getFullYear()} {siteSettings.site_name}. {siteSettings.footer_copyright}
                        </p>
                    </div>
                </div>
            </div>

            {/* Search overlay */}
            {searchOpen && (
                <div className="fixed inset-0 z-[80] bg-white dark:bg-zinc-950" onClick={() => setSearchOpen(false)}>
                    <div className="mx-auto max-w-3xl px-4 pt-12 sm:px-6 sm:pt-20" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between border-b border-zinc-200 pb-4 dark:border-zinc-800">
                            <p className="font-serif text-lg font-bold tracking-tight">Search {siteSettings.site_name}</p>
                            <button onClick={() => setSearchOpen(false)} className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900">
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="relative mt-6">
                            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
                            <input
                                type="text"
                                placeholder="Search news, topics, authors..."
                                className="h-14 w-full rounded-sm border border-zinc-300 bg-white pl-12 pr-4 text-lg outline-none placeholder:text-zinc-400 focus:border-black focus:ring-1 focus:ring-black dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-white"
                                autoFocus
                            />
                            <span className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 sm:block">
                                Press Enter
                            </span>
                        </div>
                        <div className="mt-8">
                            <p className="text-xs font-black uppercase tracking-[0.14em] text-zinc-900 dark:text-white">Trending searches</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                                {siteSettings.trending_terms.map((term) => (
                                    <button key={term} className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black dark:bg-zinc-800">
                                        {term}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="mt-8 grid gap-6 border-t border-zinc-200 pt-6 dark:border-zinc-800 sm:grid-cols-2">
                            <div>
                                <p className="text-xs font-black uppercase tracking-[0.14em] text-zinc-900 dark:text-white">Sections</p>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {categories.slice(0, 6).map((cat) => (
                                        <Link key={cat.id} href={`/category/${cat.slug}`} onClick={() => setSearchOpen(false)} className="rounded-sm border border-zinc-200 px-3 py-1.5 text-xs font-bold uppercase tracking-wide hover:bg-black hover:text-white dark:border-zinc-700">
                                            {cat.name}
                                        </Link>
                                    ))}
                                    {headerPages.slice(0, 3).map((p) => (
                                        <Link key={p.id} href={`/page/${p.slug}`} onClick={() => setSearchOpen(false)} className="rounded-sm border border-zinc-200 px-3 py-1.5 text-xs font-bold uppercase tracking-wide hover:bg-black hover:text-white dark:border-zinc-700">
                                            {p.title}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                            <div className="hidden sm:block">
                                <p className="text-xs font-black uppercase tracking-[0.14em] text-zinc-900 dark:text-white">Quick Links</p>
                                <ul className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                                    {headerTopLinks.slice(0, 3).map((l) => (
                                        <li key={l.id}>
                                            <DynamicLink link={l} className="hover:text-black dark:hover:text-white">
                                                {l.label}
                                            </DynamicLink>
                                        </li>
                                    ))}
                                    {headerPrimaryLinks.slice(0, 2).map((l) => (
                                        <li key={l.id}>
                                            <DynamicLink link={l} className="hover:text-black dark:hover:text-white">
                                                {l.label}
                                            </DynamicLink>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
