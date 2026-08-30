import { usePage } from "@inertiajs/react";
import { Facebook, Linkedin, Send, MessageCircle, Mail, Link2, Pin, Hash, AtSign } from "lucide-react";

function XIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.244 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    );
}
import { useState } from "react";
import { useClipboard } from "@/hooks/use-clipboard";

function getShareUrls(url: string, title: string, description?: string | null) {
    const u = encodeURIComponent(url);
    const t = encodeURIComponent(title);
    const d = encodeURIComponent(description ?? title);
    return {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
        twitter: `https://x.com/intent/post?url=${u}&text=${t}`,
        x: `https://x.com/intent/post?url=${u}&text=${t}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
        whatsapp: `https://wa.me/?text=${t}%20${u}`,
        telegram: `https://t.me/share/url?url=${u}&text=${t}`,
        reddit: `https://www.reddit.com/submit?url=${u}&title=${t}`,
        pinterest: `https://pinterest.com/pin/create/button/?url=${u}&description=${d}`,
        email: `mailto:?subject=${t}&body=${d}%0A%0A${u}`,
        threads: `https://www.threads.net/intent/post?text=${t}%20${u}`,
    } as const;
}

function PlatformIcon({ platform }: { platform: string }) {
    const p = platform.toLowerCase();
    if (p === "facebook") return <Facebook className="h-4 w-4" />;
    if (p === "twitter" || p === "x") return <XIcon className="h-4 w-4" />;
    if (p === "linkedin") return <Linkedin className="h-4 w-4" />;
    if (p === "whatsapp") return <MessageCircle className="h-4 w-4" />;
    if (p === "telegram") return <Send className="h-4 w-4" />;
    if (p === "reddit") return <Hash className="h-4 w-4" />;
    if (p === "pinterest") return <Pin className="h-4 w-4" />;
    if (p === "email") return <Mail className="h-4 w-4" />;
    if (p === "copy") return <Link2 className="h-4 w-4" />;
    if (p === "threads") return <AtSign className="h-4 w-4" />;
    return <Hash className="h-4 w-4" />;
}

interface SocialShareProps {
    title: string;
    url?: string;
    description?: string | null;
    variant?: "inline" | "floating";
    className?: string;
}

export function SocialShare({ title, url, description, variant = "inline", className = "" }: SocialShareProps) {
    const page = usePage();
    const sharePlatforms = (page.props as unknown as { sharePlatforms?: string[] }).sharePlatforms ?? (page.props as unknown as { navigation?: { sharePlatforms: string[] } }).navigation?.sharePlatforms ?? ["facebook", "twitter", "linkedin", "whatsapp", "email", "copy"];
    const navigation = (page.props as unknown as { navigation?: any }).navigation;
    const enabled = (() => {
        // Check Setting share_enabled via navigation? Fallback to true if no setting says disabled
        const fromShare = navigation?.sharePlatforms ? true : true;
        return fromShare;
    })();

    const currentUrl = url ?? (typeof window !== "undefined" ? window.location.href : "");
    const urls = getShareUrls(currentUrl, title, description ?? title);
    const [copied, setCopied] = useState(false);
    const [, copy] = useClipboard();

    if (!enabled || sharePlatforms.length === 0) return null;

    const handleCopy = async () => {
        const ok = await copy(currentUrl);
        if (ok) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleShare = (platform: string) => {
        if (platform === "copy") {
            handleCopy();
            return;
        }
        const shareUrl = (urls as any)[platform] as string | undefined;
        if (!shareUrl) return;
        window.open(shareUrl, "_blank", "noopener,noreferrer,width=600,height=400");
    };

    if (variant === "floating") {
        return (
            <div className={`flex items-center gap-1 rounded-full border border-zinc-200 bg-white/95 px-2 py-1.5 shadow-lg backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/95 ${className}`}>
                {sharePlatforms.map((p) => (
                    <button
                        key={p}
                        onClick={() => handleShare(p)}
                        aria-label={`Share on ${p}`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-zinc-600 hover:bg-zinc-100 hover:text-black dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white transition-colors"
                        title={p === "copy" ? (copied ? "Copied!" : "Copy link") : `Share on ${p}`}
                    >
                        <PlatformIcon platform={p} />
                    </button>
                ))}
                {copied && <span className="px-2 text-xs font-semibold text-green-600">Copied!</span>}
            </div>
        );
    }

    return (
        <div className={`flex flex-wrap items-center gap-2 ${className}`}>
            <span className="mr-1 text-xs font-black uppercase tracking-widest text-zinc-500">Share</span>
            {sharePlatforms.map((p) => (
                <button
                    key={p}
                    onClick={() => handleShare(p)}
                    aria-label={`Share on ${p}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold capitalize text-zinc-700 hover:bg-black hover:text-white hover:border-black dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-white dark:hover:text-black transition-colors"
                >
                    <PlatformIcon platform={p} />
                    {p === "copy" ? (copied ? "Copied" : "Copy") : p}
                </button>
            ))}
        </div>
    );
}

export function SocialFollow({ className = "" }: { className?: string }) {
    const page = usePage();
    const social = (page.props as unknown as { socialLinks?: { platform: string; url: string; label: string }[] }).socialLinks ?? (page.props as unknown as { navigation?: { social: any[] } }).navigation?.social ?? [];
    if (social.length === 0) return null;
    return (
        <div className={`flex flex-wrap gap-2 ${className}`}>
            {social.map((s) => (
                <a
                    key={s.platform}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 hover:bg-black hover:text-white dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 transition-colors"
                >
                    <PlatformIcon platform={s.platform} />
                </a>
            ))}
        </div>
    );
}
