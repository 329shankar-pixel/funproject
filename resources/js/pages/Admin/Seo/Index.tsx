import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

type Tab = 'general' | 'social' | 'verification' | 'analytics' | 'monetization' | 'advanced';

const tabs: { id: Tab; label: string; desc: string }[] = [
    { id: 'general', label: 'General SEO', desc: 'Meta, robots & indexing' },
    { id: 'social', label: 'Social / OG', desc: 'Open Graph & Twitter' },
    { id: 'verification', label: 'Verification', desc: 'Google, Bing, Yandex' },
    { id: 'analytics', label: 'Analytics', desc: 'GA4, GTM, Plausible' },
    { id: 'monetization', label: 'Monetization', desc: 'AdSense & other ads' },
    { id: 'advanced', label: 'Advanced', desc: 'Sitemap, custom code' },
];

export default function SeoIndex({ formData }: { formData: any }) {
    const pageUrl = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('tab') : null;
    const initialTab: Tab = (pageUrl as Tab) && tabs.some(t => t.id === pageUrl) ? (pageUrl as Tab) : 'general';
    const [activeTab, setActiveTab] = useState<Tab>(initialTab);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            if (params.get('tab') !== activeTab) {
                const url = new URL(window.location.href);
                url.searchParams.set('tab', activeTab);
                window.history.replaceState({}, '', url.toString());
            }
        }
    }, [activeTab]);

    const { data, setData, put, processing, errors, recentlySuccessful } = useForm({
        // General
        meta_title_template: formData.meta_title_template ?? '{title} | {site_name}',
        meta_description: formData.meta_description ?? '',
        meta_keywords: formData.meta_keywords ?? '',
        robots: formData.robots ?? 'index, follow',
        robots_txt_override: formData.robots_txt_override ?? '',
        robots_custom: formData.robots_custom ?? '',
        canonical_enabled: !!formData.canonical_enabled,
        breadcrumbs_enabled: !!formData.breadcrumbs_enabled,
        sitemap_enabled: !!formData.sitemap_enabled,
        rss_enabled: !!formData.rss_enabled,
        hreflang_enabled: !!formData.hreflang_enabled,
        hreflang_default: formData.hreflang_default ?? 'en',
        // Social
        og_site_name: formData.og_site_name ?? '',
        og_image: formData.og_image ?? '',
        og_type: formData.og_type ?? 'website',
        twitter_card: formData.twitter_card ?? 'summary_large_image',
        twitter_site: formData.twitter_site ?? '',
        twitter_creator: formData.twitter_creator ?? '',
        json_ld_enabled: !!formData.json_ld_enabled,
        json_ld_organization_name: formData.json_ld_organization_name ?? '',
        json_ld_organization_logo: formData.json_ld_organization_logo ?? '',
        json_ld_type: formData.json_ld_type ?? 'NewsArticle',
        // Verification
        google_site_verification: formData.google_site_verification ?? '',
        bing_site_verification: formData.bing_site_verification ?? '',
        yandex_verification: formData.yandex_verification ?? '',
        pinterest_verification: formData.pinterest_verification ?? '',
        facebook_domain_verification: formData.facebook_domain_verification ?? '',
        // Analytics
        google_analytics_id: formData.google_analytics_id ?? '',
        google_tag_manager_id: formData.google_tag_manager_id ?? '',
        bing_clarity_id: formData.bing_clarity_id ?? '',
        facebook_pixel_id: formData.facebook_pixel_id ?? '',
        plausible_domain: formData.plausible_domain ?? '',
        plausible_script: formData.plausible_script ?? '',
        umami_website_id: formData.umami_website_id ?? '',
        umami_script_url: formData.umami_script_url ?? '',
        hotjar_id: formData.hotjar_id ?? '',
        custom_head_code: formData.custom_head_code ?? '',
        custom_body_start_code: formData.custom_body_start_code ?? '',
        custom_body_end_code: formData.custom_body_end_code ?? '',
        // Monetization
        adsense_enabled: !!formData.adsense_enabled,
        adsense_publisher_id: formData.adsense_publisher_id ?? '',
        adsense_auto_ads_enabled: !!formData.adsense_auto_ads_enabled,
        adsense_script: formData.adsense_script ?? '',
        ads_txt_content: formData.ads_txt_content ?? '',
        ad_header_code: formData.ad_header_code ?? '',
        ad_footer_code: formData.ad_footer_code ?? '',
        ad_sidebar_code: formData.ad_sidebar_code ?? '',
        ad_in_article_code: formData.ad_in_article_code ?? '',
        ad_between_articles_code: formData.ad_between_articles_code ?? '',
        ad_in_feed_code: formData.ad_in_feed_code ?? '',
        ad_anchor_code: formData.ad_anchor_code ?? '',
        ad_vignette_enabled: !!formData.ad_vignette_enabled,
        carbon_ads_code: formData.carbon_ads_code ?? '',
        buysellads_code: formData.buysellads_code ?? '',
        amazon_associates_id: formData.amazon_associates_id ?? '',
        ezoic_enabled: !!formData.ezoic_enabled,
        mediavine_enabled: !!formData.mediavine_enabled,
        affiliate_disclosure_enabled: !!formData.affiliate_disclosure_enabled,
        affiliate_disclosure_text: formData.affiliate_disclosure_text ?? '',
        consent_mode_enabled: !!formData.consent_mode_enabled,
        consent_banner_code: formData.consent_banner_code ?? '',
        sponsorship_code: formData.sponsorship_code ?? '',
        custom_monetization_head: formData.custom_monetization_head ?? '',
        custom_monetization_body: formData.custom_monetization_body ?? '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/admin/seo');
    };

    return (
        <>
            <Head title="SEO & Monetization" />
            <div className="mx-auto max-w-6xl flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">SEO & Monetization</h1>
                        <p className="text-sm text-muted-foreground">Fully dynamic — powers Google, Bing, social previews, sitemap, analytics and all ad slots. No code deploy needed.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild><Link href="/admin">Back</Link></Button>
                        <Button variant="outline" asChild><a href="/sitemap.xml" target="_blank" rel="noreferrer">View sitemap.xml</a></Button>
                        <Button variant="outline" asChild><a href="/robots.txt" target="_blank" rel="noreferrer">robots.txt</a></Button>
                        <Button variant="outline" asChild><a href="/ads.txt" target="_blank" rel="noreferrer">ads.txt</a></Button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap gap-2 border-b border-border pb-3">
                    {tabs.map(t => (
                        <button
                            key={t.id}
                            onClick={() => setActiveTab(t.id)}
                            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors border ${activeTab === t.id ? 'bg-foreground text-background border-foreground' : 'bg-muted hover:bg-muted/80 text-muted-foreground border-transparent'}`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                <form onSubmit={submit} className="space-y-6">
                    {activeTab === 'general' && (
                        <>
                            <Card>
                                <CardHeader><CardTitle>General Meta</CardTitle><CardDescription>Shown when no page-specific SEO is set. Use {'{title}'}, {'{site_name}'}, {'{tagline}'} in template.</CardDescription></CardHeader>
                                <CardContent className="grid gap-4">
                                    <div><Label>Meta Title Template *</Label><Input value={data.meta_title_template} onChange={e => setData('meta_title_template', e.target.value)} placeholder="{title} | {site_name}" />{errors.meta_title_template && <p className="text-sm text-red-500">{errors.meta_title_template}</p>}<p className="text-xs text-muted-foreground mt-1">Example: {'{title} | Editorial — {tagline}'}</p></div>
                                    <div><Label>Default Meta Description *</Label><Textarea value={data.meta_description} onChange={e => setData('meta_description', e.target.value)} rows={3} maxLength={500} />{errors.meta_description && <p className="text-sm text-red-500">{errors.meta_description}</p>}<p className="text-xs text-muted-foreground">{data.meta_description.length}/160 recommended</p></div>
                                    <div><Label>Default Meta Keywords *</Label><Input value={data.meta_keywords} onChange={e => setData('meta_keywords', e.target.value)} placeholder="news, politics, technology" />{errors.meta_keywords && <p className="text-sm text-red-500">{errors.meta_keywords}</p>}</div>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div><Label>Robots Default *</Label><Input value={data.robots} onChange={e => setData('robots', e.target.value)} placeholder="index, follow, max-image-preview:large" />{errors.robots && <p className="text-sm text-red-500">{errors.robots}</p>}</div>
                                        <div><Label>Hreflang Default</Label><Input value={data.hreflang_default} onChange={e => setData('hreflang_default', e.target.value)} placeholder="en" />{errors.hreflang_default && <p className="text-sm text-red-500">{errors.hreflang_default}</p>}</div>
                                    </div>
                                    <div className="flex flex-wrap gap-4 pt-2">
                                        <label className="flex items-center gap-2 text-sm"><Checkbox checked={data.canonical_enabled} onCheckedChange={c => setData('canonical_enabled', !!c)} /> Canonical URL per page</label>
                                        <label className="flex items-center gap-2 text-sm"><Checkbox checked={data.breadcrumbs_enabled} onCheckedChange={c => setData('breadcrumbs_enabled', !!c)} /> Breadcrumb structured data</label>
                                        <label className="flex items-center gap-2 text-sm"><Checkbox checked={data.hreflang_enabled} onCheckedChange={c => setData('hreflang_enabled', !!c)} /> Enable hreflang tag</label>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader><CardTitle>Indexing & Crawling</CardTitle><CardDescription>Controls sitemap.xml, robots.txt and RSS</CardDescription></CardHeader>
                                <CardContent className="grid gap-4 md:grid-cols-3">
                                    <label className="flex items-center gap-2 text-sm border rounded p-3"><Checkbox checked={data.sitemap_enabled} onCheckedChange={c => setData('sitemap_enabled', !!c)} /> Sitemap enabled (/sitemap.xml)</label>
                                    <label className="flex items-center gap-2 text-sm border rounded p-3"><Checkbox checked={data.rss_enabled} onCheckedChange={c => setData('rss_enabled', !!c)} /> RSS enabled</label>
                                    <div className="text-xs text-muted-foreground flex items-center">Sitemap is auto-generated from Articles, Categories, Topics, Pages (cached 1h).</div>
                                    <div className="md:col-span-3"><Label>Custom robots extra rules (appended)</Label><Textarea value={data.robots_custom} onChange={e => setData('robots_custom', e.target.value)} rows={2} placeholder="Disallow: /private/&#10;Allow: /public/" className="font-mono text-xs" /></div>
                                    <div className="md:col-span-3"><Label>Full robots.txt override (leave empty to auto-generate)</Label><Textarea value={data.robots_txt_override} onChange={e => setData('robots_txt_override', e.target.value)} rows={4} placeholder="User-agent: *&#10;Disallow: /admin/&#10;Sitemap: https://example.com/sitemap.xml" className="font-mono text-xs" /></div>
                                </CardContent>
                            </Card>
                        </>
                    )}

                    {activeTab === 'social' && (
                        <>
                            <Card>
                                <CardHeader><CardTitle>Open Graph & Twitter</CardTitle><CardDescription>Powers link previews on Facebook, X, LinkedIn, Slack, WhatsApp, Telegram</CardDescription></CardHeader>
                                <CardContent className="grid gap-4 md:grid-cols-2">
                                    <div><Label>OG Site Name *</Label><Input value={data.og_site_name} onChange={e => setData('og_site_name', e.target.value)} /></div>
                                    <div><Label>OG Type *</Label><Input value={data.og_type} onChange={e => setData('og_type', e.target.value)} placeholder="website" /></div>
                                    <div className="md:col-span-2"><Label>Default OG Image (absolute URL or /storage path)</Label><Input value={data.og_image} onChange={e => setData('og_image', e.target.value)} placeholder="https://example.com/og-default.jpg" /></div>
                                    <div><Label>Twitter Card *</Label><Input value={data.twitter_card} onChange={e => setData('twitter_card', e.target.value)} placeholder="summary_large_image" /></div>
                                    <div><Label>Twitter Site @handle</Label><Input value={data.twitter_site} onChange={e => setData('twitter_site', e.target.value)} placeholder="@editorial" /></div>
                                    <div><Label>Twitter Creator @handle</Label><Input value={data.twitter_creator} onChange={e => setData('twitter_creator', e.target.value)} placeholder="@author" /></div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader><CardTitle>JSON-LD Structured Data</CardTitle><CardDescription>For Google rich results (Article, BreadcrumbList, Organization)</CardDescription></CardHeader>
                                <CardContent className="grid gap-4 md:grid-cols-2">
                                    <label className="flex items-center gap-2 text-sm md:col-span-2"><Checkbox checked={data.json_ld_enabled} onCheckedChange={c => setData('json_ld_enabled', !!c)} /> Enable JSON-LD structured data site-wide</label>
                                    <div><Label>Organization Name *</Label><Input value={data.json_ld_organization_name} onChange={e => setData('json_ld_organization_name', e.target.value)} /></div>
                                    <div><Label>Organization Logo URL</Label><Input value={data.json_ld_organization_logo} onChange={e => setData('json_ld_organization_logo', e.target.value)} placeholder="https://example.com/logo.png" /></div>
                                    <div><Label>Article @type *</Label><Input value={data.json_ld_type} onChange={e => setData('json_ld_type', e.target.value)} placeholder="NewsArticle" /></div>
                                    <div className="text-xs text-muted-foreground flex items-end">Used for all article pages. Supports NewsArticle, BlogPosting, Article.</div>
                                </CardContent>
                            </Card>
                        </>
                    )}

                    {activeTab === 'verification' && (
                        <Card>
                            <CardHeader><CardTitle>Search Console Verification</CardTitle><CardDescription>Meta tags added to &lt;head&gt; automatically. Leave blank to skip. Same values power Google & Bing indexing.</CardDescription></CardHeader>
                            <CardContent className="grid gap-4 md:grid-cols-2">
                                <div><Label>Google Search Console (google-site-verification)</Label><Input value={data.google_site_verification} onChange={e => setData('google_site_verification', e.target.value)} placeholder="abc123..." />{errors.google_site_verification && <p className="text-sm text-red-500">{errors.google_site_verification}</p>}<p className="text-xs text-muted-foreground">From Google Search Console → HTML tag</p></div>
                                <div><Label>Bing Webmaster (msvalidate.01)</Label><Input value={data.bing_site_verification} onChange={e => setData('bing_site_verification', e.target.value)} placeholder="ABC123..." /><p className="text-xs text-muted-foreground">Also powers Bing + DuckDuckGo + Yahoo via Bing index</p></div>
                                <div><Label>Yandex Verification</Label><Input value={data.yandex_verification} onChange={e => setData('yandex_verification', e.target.value)} /></div>
                                <div><Label>Pinterest Verification</Label><Input value={data.pinterest_verification} onChange={e => setData('pinterest_verification', e.target.value)} placeholder="p:domain_verify" /></div>
                                <div className="md:col-span-2"><Label>Facebook Domain Verification</Label><Input value={data.facebook_domain_verification} onChange={e => setData('facebook_domain_verification', e.target.value)} /></div>
                                <div className="md:col-span-2 rounded bg-muted p-3 text-xs text-muted-foreground">
                                    Tip: After saving, view page source and search for &quot;google-site-verification&quot; to confirm. Re-submit sitemap in Search Console &amp; Bing Webmaster Tools → Sitemaps → https://yourdomain.com/sitemap.xml
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === 'analytics' && (
                        <>
                            <Card>
                                <CardHeader><CardTitle>Analytics & Tracking</CardTitle><CardDescription>All scripts injected dynamically into &lt;head&gt; / &lt;body&gt;. Leave blank to disable.</CardDescription></CardHeader>
                                <CardContent className="grid gap-4 md:grid-cols-2">
                                    <div><Label>Google Analytics 4 (G-XXXXXXX)</Label><Input value={data.google_analytics_id} onChange={e => setData('google_analytics_id', e.target.value)} placeholder="G-ABC1234567" /></div>
                                    <div><Label>Google Tag Manager (GTM-XXXXXX)</Label><Input value={data.google_tag_manager_id} onChange={e => setData('google_tag_manager_id', e.target.value)} placeholder="GTM-ABC123" /></div>
                                    <div><Label>Bing Clarity ID</Label><Input value={data.bing_clarity_id} onChange={e => setData('bing_clarity_id', e.target.value)} placeholder="abcdef123" /></div>
                                    <div><Label>Facebook Pixel ID</Label><Input value={data.facebook_pixel_id} onChange={e => setData('facebook_pixel_id', e.target.value)} placeholder="1234567890" /></div>
                                    <div><Label>Plausible Domain</Label><Input value={data.plausible_domain} onChange={e => setData('plausible_domain', e.target.value)} placeholder="example.com" /></div>
                                    <div><Label>Plausible Script URL (optional)</Label><Input value={data.plausible_script} onChange={e => setData('plausible_script', e.target.value)} placeholder="https://plausible.io/js/script.js" /></div>
                                    <div><Label>Umami Website ID</Label><Input value={data.umami_website_id} onChange={e => setData('umami_website_id', e.target.value)} /></div>
                                    <div><Label>Umami Script URL</Label><Input value={data.umami_script_url} onChange={e => setData('umami_script_url', e.target.value)} placeholder="https://analytics.example.com/script.js" /></div>
                                    <div><Label>Hotjar ID</Label><Input value={data.hotjar_id} onChange={e => setData('hotjar_id', e.target.value)} /></div>
                                    <div className="text-xs text-muted-foreground flex items-center">Add more via Custom Code below.</div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader><CardTitle>Custom Code Injection</CardTitle><CardDescription>Raw HTML/JS injected site-wide. Perfect for additional pixels, chat widgets, etc.</CardDescription></CardHeader>
                                <CardContent className="grid gap-4">
                                    <div><Label>Custom &lt;head&gt; Code (before &lt;/head&gt;)</Label><Textarea value={data.custom_head_code} onChange={e => setData('custom_head_code', e.target.value)} rows={4} placeholder="<script>...</script>" className="font-mono text-xs" /></div>
                                    <div><Label>Custom &lt;body&gt; Start (after &lt;body&gt;)</Label><Textarea value={data.custom_body_start_code} onChange={e => setData('custom_body_start_code', e.target.value)} rows={3} placeholder="<noscript>...</noscript>" className="font-mono text-xs" /></div>
                                    <div><Label>Custom &lt;body&gt; End (before &lt;/body&gt;)</Label><Textarea value={data.custom_body_end_code} onChange={e => setData('custom_body_end_code', e.target.value)} rows={3} placeholder="<script>...</script>" className="font-mono text-xs" /></div>
                                </CardContent>
                            </Card>
                        </>
                    )}

                    {activeTab === 'monetization' && (
                        <>
                            <Card>
                                <CardHeader><CardTitle>Google AdSense</CardTitle><CardDescription>Primary monetization. Auto Ads + manual slots. Fully dynamic — toggle without code changes.</CardDescription></CardHeader>
                                <CardContent className="grid gap-4">
                                    <label className="flex items-center gap-2 text-sm"><Checkbox checked={data.adsense_enabled} onCheckedChange={c => setData('adsense_enabled', !!c)} /> Enable AdSense site-wide</label>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div><Label>Publisher ID (ca-pub-XXXXXXXXXXXXXXXX)</Label><Input value={data.adsense_publisher_id} onChange={e => setData('adsense_publisher_id', e.target.value)} placeholder="ca-pub-1234567890123456" /></div>
                                        <label className="flex items-center gap-2 text-sm border rounded p-3 mt-6"><Checkbox checked={data.adsense_auto_ads_enabled} onCheckedChange={c => setData('adsense_auto_ads_enabled', !!c)} /> Auto Ads enabled</label>
                                    </div>
                                    <div><Label>Custom AdSense Script Override (leave blank for default)</Label><Textarea value={data.adsense_script} onChange={e => setData('adsense_script', e.target.value)} rows={3} placeholder='<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-..." crossorigin="anonymous"></script>' className="font-mono text-xs" /></div>
                                    <div><Label>ads.txt Content (served at /ads.txt)</Label><Textarea value={data.ads_txt_content} onChange={e => setData('ads_txt_content', e.target.value)} rows={3} placeholder="google.com, pub-1234567890, DIRECT, f08c47fec0942fa0" className="font-mono text-xs" /><p className="text-xs text-muted-foreground">If empty and Publisher ID is set, a default google.com line is generated automatically.</p></div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader><CardTitle>Ad Placements (Dynamic Slots)</CardTitle><CardDescription>Paste any ad network code — AdSense slot, Ezoic, Mediavine, Carbon, custom HTML. Rendered via &lt;AdSlot&gt; components.</CardDescription></CardHeader>
                                <CardContent className="grid gap-4">
                                    <div><Label>Header Ad (below navigation)</Label><Textarea value={data.ad_header_code} onChange={e => setData('ad_header_code', e.target.value)} rows={3} placeholder='<ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-..." data-ad-slot="1234567890"></ins>' className="font-mono text-xs" /></div>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div><Label>Sidebar Ad</Label><Textarea value={data.ad_sidebar_code} onChange={e => setData('ad_sidebar_code', e.target.value)} rows={3} className="font-mono text-xs" /></div>
                                        <div><Label>Footer Ad</Label><Textarea value={data.ad_footer_code} onChange={e => setData('ad_footer_code', e.target.value)} rows={3} className="font-mono text-xs" /></div>
                                    </div>
                                    <div><Label>In-Article Ad (injected mid-content)</Label><Textarea value={data.ad_in_article_code} onChange={e => setData('ad_in_article_code', e.target.value)} rows={3} className="font-mono text-xs" /></div>
                                    <div><Label>Between Articles (feed)</Label><Textarea value={data.ad_between_articles_code} onChange={e => setData('ad_between_articles_code', e.target.value)} rows={3} className="font-mono text-xs" /></div>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div><Label>In-Feed Ad</Label><Textarea value={data.ad_in_feed_code} onChange={e => setData('ad_in_feed_code', e.target.value)} rows={3} className="font-mono text-xs" /></div>
                                        <div><Label>Anchor / Sticky Ad</Label><Textarea value={data.ad_anchor_code} onChange={e => setData('ad_anchor_code', e.target.value)} rows={3} className="font-mono text-xs" /></div>
                                    </div>
                                    <label className="flex items-center gap-2 text-sm"><Checkbox checked={data.ad_vignette_enabled} onCheckedChange={c => setData('ad_vignette_enabled', !!c)} /> Enable Vignette/Interstitial (if supported by network)</label>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader><CardTitle>Other Networks & Affiliate</CardTitle></CardHeader>
                                <CardContent className="grid gap-4 md:grid-cols-2">
                                    <div className="md:col-span-2"><Label>Carbon Ads Code</Label><Textarea value={data.carbon_ads_code} onChange={e => setData('carbon_ads_code', e.target.value)} rows={2} className="font-mono text-xs" /></div>
                                    <div className="md:col-span-2"><Label>BuySellAds Code</Label><Textarea value={data.buysellads_code} onChange={e => setData('buysellads_code', e.target.value)} rows={2} className="font-mono text-xs" /></div>
                                    <div><Label>Amazon Associates ID</Label><Input value={data.amazon_associates_id} onChange={e => setData('amazon_associates_id', e.target.value)} placeholder="editorial-20" /></div>
                                    <div><Label>Sponsorship / Direct Deal Code</Label><Textarea value={data.sponsorship_code} onChange={e => setData('sponsorship_code', e.target.value)} rows={2} className="font-mono text-xs" /></div>
                                    <label className="flex items-center gap-2 text-sm"><Checkbox checked={data.ezoic_enabled} onCheckedChange={c => setData('ezoic_enabled', !!c)} /> Ezoic enabled</label>
                                    <label className="flex items-center gap-2 text-sm"><Checkbox checked={data.mediavine_enabled} onCheckedChange={c => setData('mediavine_enabled', !!c)} /> Mediavine enabled</label>
                                    <div className="md:col-span-2 border rounded p-3 space-y-2">
                                        <label className="flex items-center gap-2 text-sm"><Checkbox checked={data.affiliate_disclosure_enabled} onCheckedChange={c => setData('affiliate_disclosure_enabled', !!c)} /> Show affiliate disclosure</label>
                                        {data.affiliate_disclosure_enabled && <Textarea value={data.affiliate_disclosure_text} onChange={e => setData('affiliate_disclosure_text', e.target.value)} rows={2} />}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader><CardTitle>Consent & Custom Monetization</CardTitle></CardHeader>
                                <CardContent className="grid gap-4">
                                    <label className="flex items-center gap-2 text-sm"><Checkbox checked={data.consent_mode_enabled} onCheckedChange={c => setData('consent_mode_enabled', !!c)} /> Google Consent Mode v2 / GDPR banner</label>
                                    <div><Label>Consent Banner Code</Label><Textarea value={data.consent_banner_code} onChange={e => setData('consent_banner_code', e.target.value)} rows={3} className="font-mono text-xs" /></div>
                                    <div><Label>Custom Monetization Head (injected with ads)</Label><Textarea value={data.custom_monetization_head} onChange={e => setData('custom_monetization_head', e.target.value)} rows={3} className="font-mono text-xs" /></div>
                                    <div><Label>Custom Monetization Body End</Label><Textarea value={data.custom_monetization_body} onChange={e => setData('custom_monetization_body', e.target.value)} rows={3} className="font-mono text-xs" /></div>
                                </CardContent>
                            </Card>
                        </>
                    )}

                    {activeTab === 'advanced' && (
                        <>
                            <Card>
                                <CardHeader><CardTitle>Advanced SEO</CardTitle><CardDescription>Sitemap & crawl controls already covered. These affect structured data and indexing.</CardDescription></CardHeader>
                                <CardContent className="space-y-3 text-sm text-muted-foreground">
                                    <p>• Sitemap: <code className="bg-muted px-1 rounded">/sitemap.xml</code> auto-updated hourly, includes lastmod, changefreq, priority. Submit to Google Search Console & Bing Webmaster Tools.</p>
                                    <p>• Robots: <code className="bg-muted px-1 rounded">/robots.txt</code> auto-generated. Override via General tab if you need custom directives.</p>
                                    <p>• Ads.txt: <code className="bg-muted px-1 rounded">/ads.txt</code> auto-generated from Publisher ID if not manually set.</p>
                                    <p>• All meta tags are dynamic and per-page: override via Article → SEO fields (see Articles edit) or via global defaults here.</p>
                                    <p>• Verification, Analytics and Monetization scripts are injected via HandleInertiaRequests shared props + blade layout — no rebuild required.</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader><CardTitle>Per-Page SEO</CardTitle><CardDescription>Articles, Categories, Topics and Pages each support custom SEO via the seo_metadata table + Article.s eo_* columns.</CardDescription></CardHeader>
                                <CardContent className="text-sm text-muted-foreground space-y-2">
                                    <p>Edit any article to set: Meta Title, Meta Description, Keywords, Canonical URL, OG Image, Robots, Structured Data.</p>
                                    <p>Fallback chain: Per-page SEO → Global SEO → hardcoded sensible defaults. All pages emit: title, description, keywords, canonical, og:*, twitter:*, json-ld, hreflang.</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader><CardTitle>Checklist for Google & Bing</CardTitle></CardHeader>
                                <CardContent className="text-sm space-y-1">
                                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                                        <li>Fill Verification tab → save → verify in Google Search Console & Bing Webmaster Tools.</li>
                                        <li>Ensure sitemap_enabled = on → submit <code className="bg-muted px-1 rounded">https://yourdomain.com/sitemap.xml</code> to both consoles.</li>
                                        <li>Add GA4 / GTM → check real-time in Google Analytics.</li>
                                        <li>Enable AdSense → add Publisher ID → wait for approval → ads appear via placement slots.</li>
                                        <li>Use “View sitemap.xml / robots.txt / ads.txt” buttons above to verify live output.</li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </>
                    )}

                    <div className="flex justify-end gap-2">
                        {recentlySuccessful && <span className="text-sm text-green-600 self-center">Saved!</span>}
                        <Button type="submit" disabled={processing}>Save SEO & Monetization</Button>
                    </div>
                </form>
            </div>
        </>
    );
}

// helper to style monospaced textarea
declare module '@/components/ui/textarea' {}
