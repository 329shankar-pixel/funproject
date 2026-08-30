import { useEffect, useRef } from 'react';
import { usePage } from '@inertiajs/react';

interface AdSlotProps {
    position: 'header' | 'footer' | 'sidebar' | 'in_article' | 'between_articles' | 'in_feed' | 'anchor';
    className?: string;
    fallback?: React.ReactNode;
}

/**
 * Fully dynamic ad slot — renders HTML/JS from monetization settings.
 * Supports AdSense, Carbon, BuySellAds, custom HTML, Ezoic, Mediavine etc.
 * Content is stored in `monetization.ad_*_code` settings and injected via HandleInertiaRequests shared props.
 */
export function AdSlot({ position, className = '', fallback = null }: AdSlotProps) {
    const { monetization } = usePage().props as unknown as { monetization?: Record<string, string> };
    const ref = useRef<HTMLDivElement>(null);

    const keyMap: Record<AdSlotProps['position'], string> = {
        header: 'ad_header_code',
        footer: 'ad_footer_code',
        sidebar: 'ad_sidebar_code',
        in_article: 'ad_in_article_code',
        between_articles: 'ad_between_articles_code',
        in_feed: 'ad_in_feed_code',
        anchor: 'ad_anchor_code',
    };

    const code = monetization?.[keyMap[position]] as string | undefined;
    const enabled = monetization?.adsense_enabled || !!code;

    useEffect(() => {
        if (!code || !ref.current) return;
        // Re-execute scripts inside the injected HTML (adsbygoogle etc.)
        const scripts = ref.current.querySelectorAll('script');
        scripts.forEach((oldScript) => {
            const newScript = document.createElement('script');
            Array.from(oldScript.attributes).forEach((attr) => newScript.setAttribute(attr.name, attr.value));
            if (oldScript.src) {
                newScript.src = oldScript.src;
            } else {
                newScript.textContent = oldScript.textContent;
            }
            oldScript.parentNode?.replaceChild(newScript, oldScript);
        });
        // Trigger adsbygoogle if present
        try {
            // @ts-ignore
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch {}
    }, [code]);

    if (!code || !code.trim()) {
        return fallback ? <>{fallback}</> : null;
    }

    if (!enabled) return null;

    return (
        <div
            ref={ref}
            className={`ad-slot ad-slot-${position} overflow-hidden ${className}`}
            dangerouslySetInnerHTML={{ __html: code }}
            aria-label={`Advertisement ${position}`}
        />
    );
}

/**
 * Inline affiliate disclosure banner — reads from monetization settings.
 */
export function AffiliateDisclosure() {
    const { monetization } = usePage().props as unknown as { monetization?: Record<string, unknown> };
    if (!monetization?.affiliate_disclosure_enabled) return null;
    const text = (monetization?.affiliate_disclosure_text as string) || '';
    if (!text.trim()) return null;
    return (
        <div className="rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
            {text}
        </div>
    );
}
