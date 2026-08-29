import { Head, Link, useForm } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function SettingsIndex({ formData }: { formData: any }) {
    const { data, setData, put, processing, errors } = useForm({
        site_name: formData.site_name ?? '',
        site_tagline: formData.site_tagline ?? '',
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
        put('/admin/settings');
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
                        <CardHeader><CardTitle>Branding</CardTitle><CardDescription>Header and titles</CardDescription></CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-2">
                            <div><Label>Site Name *</Label><Input value={data.site_name} onChange={e => setData('site_name', e.target.value)} />{errors.site_name && <p className="text-sm text-red-500">{errors.site_name}</p>}</div>
                            <div><Label>Site Tagline *</Label><Input value={data.site_tagline} onChange={e => setData('site_tagline', e.target.value)} /></div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Footer</CardTitle></CardHeader>
                        <CardContent className="grid gap-4">
                            <div><Label>Footer Description *</Label><Textarea value={data.footer_description} onChange={e => setData('footer_description', e.target.value)} rows={3} /></div>
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
