import { Head, Link, useForm, router } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RichEditor } from '@/components/ui/rich-editor';

export default function SettingsIndex({ formData }: { formData: any }) {
    const { data, setData, post, processing, errors } = useForm({
        site_name: formData.site_name ?? '',
        site_tagline: formData.site_tagline ?? '',
        site_logo: null as File | null,
        site_favicon: null as File | null,
        remove_logo: false as boolean,
        remove_favicon: false as boolean,
        footer_description: formData.footer_description ?? '',
        footer_copyright: formData.footer_copyright ?? '',
        trending_terms: formData.trending_terms ?? '',
        header_latest_label: formData.header_latest_label ?? '',
        header_trending_label: formData.header_trending_label ?? '',
        header_explore_label: formData.header_explore_label ?? '',
        home_top_stories_title: formData.home_top_stories_title ?? '',
        home_trending_title: formData.home_trending_title ?? '',
        home_latest_title: formData.home_latest_title ?? '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const fd = new FormData();
        fd.append('site_name', data.site_name);
        fd.append('site_tagline', data.site_tagline);
        fd.append('footer_description', data.footer_description);
        fd.append('footer_copyright', data.footer_copyright);
        fd.append('trending_terms', data.trending_terms);
        fd.append('header_latest_label', data.header_latest_label);
        fd.append('header_trending_label', data.header_trending_label);
        fd.append('header_explore_label', data.header_explore_label);
        fd.append('home_top_stories_title', data.home_top_stories_title);
        fd.append('home_trending_title', data.home_trending_title);
        fd.append('home_latest_title', data.home_latest_title);
        if (data.site_logo) fd.append('site_logo', data.site_logo);
        if (data.site_favicon) fd.append('site_favicon', data.site_favicon);
        if (data.remove_logo) fd.append('remove_logo', '1');
        if (data.remove_favicon) fd.append('remove_favicon', '1');
        fd.append('_method', 'PUT');
        router.post('/admin/settings', fd, {
            forceFormData: false,
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Site Settings" />
            <div className="max-w-4xl mx-auto flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Site Settings</h1>
                        <p className="text-sm text-muted-foreground">All public site strings are managed here. Changes appear instantly.</p>
                    </div>
                    <Button variant="outline" asChild><Link href="/admin">Back to Dashboard</Link></Button>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Branding</CardTitle><CardDescription>Header, logo and titles — logo replaces default everywhere (tab, login, errors)</CardDescription></CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-2">
                            <div><Label>Site Name *</Label><Input value={data.site_name} onChange={e => setData('site_name', e.target.value)} />{errors.site_name && <p className="text-sm text-red-500">{errors.site_name}</p>}</div>
                            <div><Label>Site Tagline *</Label><Input value={data.site_tagline} onChange={e => setData('site_tagline', e.target.value)} /></div>
                            <div className="md:col-span-2 grid gap-4 md:grid-cols-2">
                                <div>
                                    <Label>Site Logo (png/svg/webp, max 2MB)</Label>
                                    {formData.site_logo_url && !data.remove_logo && !data.site_logo && (
                                        <div className="mb-2 flex items-center gap-3 rounded border p-2">
                                            <img src={formData.site_logo_url} alt="Current logo" className="h-10 w-auto object-contain" />
                                            <span className="text-xs text-muted-foreground truncate">{formData.site_logo}</span>
                                        </div>
                                    )}
                                    <Input type="file" accept="image/*" onChange={(e) => setData('site_logo', e.target.files?.[0] ?? null)} />
                                    {errors.site_logo && <p className="text-sm text-red-500">{errors.site_logo}</p>}
                                    {formData.site_logo_url && (
                                        <label className="mt-2 flex items-center gap-2 text-xs">
                                            <input type="checkbox" checked={data.remove_logo} onChange={(e) => setData('remove_logo', e.target.checked)} /> Remove current logo
                                        </label>
                                    )}
                                    <p className="mt-1 text-xs text-muted-foreground">Used in header, auth pages, app sidebar and error pages. Recommended: 200×48 PNG/SVG with transparent background.</p>
                                </div>
                                <div>
                                    <Label>Favicon (ico/png/svg, max 1MB)</Label>
                                    {formData.site_favicon_url && !data.remove_favicon && !data.site_favicon && (
                                        <div className="mb-2 flex items-center gap-3 rounded border p-2">
                                            <img src={formData.site_favicon_url} alt="Current favicon" className="h-8 w-8 object-contain" />
                                            <span className="text-xs text-muted-foreground truncate">{formData.site_favicon}</span>
                                        </div>
                                    )}
                                    <Input type="file" accept=".ico,image/*" onChange={(e) => setData('site_favicon', e.target.files?.[0] ?? null)} />
                                    {errors.site_favicon && <p className="text-sm text-red-500">{errors.site_favicon}</p>}
                                    {formData.site_favicon_url && (
                                        <label className="mt-2 flex items-center gap-2 text-xs">
                                            <input type="checkbox" checked={data.remove_favicon} onChange={(e) => setData('remove_favicon', e.target.checked)} /> Remove current favicon
                                        </label>
                                    )}
                                    <p className="mt-1 text-xs text-muted-foreground">Browser tab icon. Shows on every page including login/signup.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Footer</CardTitle></CardHeader>
                        <CardContent className="grid gap-4">
                            <div><Label>Footer Description *</Label><RichEditor value={data.footer_description} onChange={(v) => setData('footer_description', v)} placeholder="Footer description..." /></div>
                            <div><Label>Copyright Suffix *</Label><Input value={data.footer_copyright} onChange={e => setData('footer_copyright', e.target.value)} /></div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Navigation Labels</CardTitle></CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-3">
                            <div><Label>Latest Label</Label><Input value={data.header_latest_label} onChange={e => setData('header_latest_label', e.target.value)} /></div>
                            <div><Label>Trending Label</Label><Input value={data.header_trending_label} onChange={e => setData('header_trending_label', e.target.value)} /></div>
                            <div><Label>Explore Label</Label><Input value={data.header_explore_label} onChange={e => setData('header_explore_label', e.target.value)} /></div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Search</CardTitle><CardDescription>Comma separated trending search terms</CardDescription></CardHeader>
                        <CardContent>
                            <Label>Trending Terms *</Label>
                            <Input value={data.trending_terms} onChange={e => setData('trending_terms', e.target.value)} placeholder="AI, Climate, Politics, ..." />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Home Page Sections</CardTitle></CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-3">
                            <div><Label>Top Stories Title</Label><Input value={data.home_top_stories_title} onChange={e => setData('home_top_stories_title', e.target.value)} /></div>
                            <div><Label>Trending Title</Label><Input value={data.home_trending_title} onChange={e => setData('home_trending_title', e.target.value)} /></div>
                            <div><Label>Latest Title</Label><Input value={data.home_latest_title} onChange={e => setData('home_latest_title', e.target.value)} /></div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end"><Button type="submit" disabled={processing}>Save Settings</Button></div>
                </form>
            </div>
        </>
    );
}
