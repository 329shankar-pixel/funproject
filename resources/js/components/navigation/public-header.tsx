import { Link, usePage } from "@inertiajs/react";
import { Search, Menu, X, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import type { SiteSettings } from "@/types/global";

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface PublicHeaderProps {
    categories?: Category[];
    siteSettings?: SiteSettings;
}

export function PublicHeader({ categories: propCategories, siteSettings: propSettings }: PublicHeaderProps) {
    const page = usePage();
    const sharedSettings = (page.props as unknown as { siteSettings?: SiteSettings }).siteSettings;
    const sharedCategories = (page.props as unknown as { sharedCategories?: Category[] }).sharedCategories ?? [];
    const categories = propCategories && propCategories.length > 0 ? propCategories : sharedCategories;
    const siteSettings: SiteSettings = propSettings ?? sharedSettings ?? {
        site_name: "Editorial",
        site_tagline: "Premium News & Analysis",
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
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [darkMode]);

    return (
        <>
            <header
                className={`sticky top-0 z-50 border-b border-border transition-all duration-300 ${
                    scrolled
                        ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-sm"
                        : "bg-background"
                }`}
            >
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-14 items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 group">
                            <span className="text-xl font-bold tracking-tight text-foreground transition-transform duration-300 group-hover:scale-[1.02]">
                                {siteSettings.site_name}
                            </span>
                        </Link>

                        {/* Desktop Nav */}
                        <nav className="hidden md:flex items-center gap-6">
                            <Link
                                href="/"
                                className="relative text-sm font-medium text-foreground hover:text-muted-foreground transition-colors group"
                            >
                                {siteSettings.header_latest_label}
                                <span className="absolute -bottom-1 left-0 h-px w-0 bg-foreground transition-all duration-300 group-hover:w-full" />
                            </Link>
                            <Link
                                href="/trending"
                                className="relative text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
                            >
                                {siteSettings.header_trending_label}
                                <span className="absolute -bottom-1 left-0 h-px w-0 bg-foreground transition-all duration-300 group-hover:w-full" />
                            </Link>
                            <Link
                                href="/explore"
                                className="relative text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
                            >
                                {siteSettings.header_explore_label}
                                <span className="absolute -bottom-1 left-0 h-px w-0 bg-foreground transition-all duration-300 group-hover:w-full" />
                            </Link>
                        </nav>

                        {/* Right side */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setSearchOpen(true)}
                                className="rounded-full p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                                aria-label="Search"
                            >
                                <Search className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className="rounded-full p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                                aria-label="Toggle theme"
                            >
                                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                            </button>
                            <Link
                                href="/login"
                                className="hidden md:inline-flex items-center rounded-full border border-border px-4 py-1.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                            >
                                Sign In
                            </Link>
                            <button
                                className="md:hidden rounded-full p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                aria-label="Menu"
                            >
                                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div
                    className={`md:hidden border-t border-border bg-background overflow-hidden transition-all duration-300 ${
                        mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
                >
                    <div className="space-y-1 px-4 py-3">
                        <Link href="/" className="block py-2 text-sm font-medium text-foreground">
                            {siteSettings.header_latest_label}
                        </Link>
                        <Link href="/trending" className="block py-2 text-sm font-medium text-muted-foreground">
                            {siteSettings.header_trending_label}
                        </Link>
                        <Link href="/explore" className="block py-2 text-sm font-medium text-muted-foreground">
                            {siteSettings.header_explore_label}
                        </Link>
                        <div className="border-t border-border pt-3 mt-3">
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                                Topics
                            </p>
                            {categories.slice(0, 8).map((category) => (
                                <Link
                                    key={category.id}
                                    href={`/category/${category.slug}`}
                                    className="block py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {category.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </header>

            {/* Search Overlay */}
            {searchOpen && (
                <div
                    className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={() => setSearchOpen(false)}
                >
                    <div
                        className="mx-auto mt-20 max-w-2xl px-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="rounded-xl border border-border bg-background p-4 shadow-2xl animate-in zoom-in-95 duration-200">
                            <div className="flex items-center gap-3">
                                <Search className="h-5 w-5 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Search articles, topics, authors..."
                                    className="flex-1 bg-transparent text-lg outline-none placeholder:text-muted-foreground"
                                    autoFocus
                                />
                                <button
                                    onClick={() => setSearchOpen(false)}
                                    className="rounded-lg bg-muted px-2 py-1 text-xs font-medium text-muted-foreground"
                                >
                                    ESC
                                </button>
                            </div>
                            <div className="mt-4 border-t border-border pt-4">
                                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                                    Trending Searches
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {siteSettings.trending_terms.map((term) => (
                                        <button
                                            key={term}
                                            className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground hover:bg-muted/80 transition-colors"
                                        >
                                            {term}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
