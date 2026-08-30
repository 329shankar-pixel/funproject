import { Head, Link, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

export default function NavigationForm({ link, locations }: { link: any | null; locations: Record<string, string> }) {
    const isEdit = !!link;
    const { data, setData, post, put, processing, errors } = useForm({
        label: link?.label ?? '',
        url: link?.url ?? '',
        location: link?.location ?? 'header_primary',
        target: link?.target ?? '_self',
        icon: link?.icon ?? '',
        sort_order: link?.sort_order ?? 0,
        is_active: link?.is_active ?? true,
        is_external: link?.is_external ?? false,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) put(`/admin/navigation/${link.id}`);
        else post('/admin/navigation');
    };

    return (
        <>
            <Head title={isEdit ? 'Edit Link' : 'Create Navigation Link'} />
            <div className="max-w-3xl mx-auto flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">{isEdit ? 'Edit Navigation Link' : 'Create Navigation Link'}</h1>
                        <p className="text-sm text-muted-foreground">Appears instantly on the live site — no code change.</p>
                    </div>
                    <Button variant="outline" asChild><Link href="/admin/navigation">Back</Link></Button>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Link Details</CardTitle>
                            <CardDescription>
                                URL can be internal (<code>/page/about</code>, <code>/category/politics</code>, <code>/article/hello</code>) or external (<code>https://...</code>). For pages/categories you can also just manage via Pages/Categories “Show in header/footer” toggles.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <Label>Label *</Label>
                                    <Input value={data.label} onChange={e => setData('label', e.target.value)} placeholder="Video" />
                                    {errors.label && <p className="text-sm text-red-500">{errors.label}</p>}
                                </div>
                                <div>
                                    <Label>Sort Order *</Label>
                                    <Input type="number" value={String(data.sort_order)} onChange={e => setData('sort_order', Number(e.target.value))} />
                                </div>
                            </div>

                            <div>
                                <Label>URL *</Label>
                                <Input value={data.url} onChange={e => setData('url', e.target.value)} placeholder="/page/about or https://twitter.com/yourhandle" />
                                {errors.url && <p className="text-sm text-red-500">{errors.url}</p>}
                                <p className="text-xs text-muted-foreground mt-1">Internal = starts with <code>/</code>. External = full <code>https://</code></p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <Label>Location *</Label>
                                    <Select value={data.location} onValueChange={v => setData('location', v)}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(locations).map(([k, v]) => (
                                                <SelectItem key={k} value={k}>{v} — {k}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.location && <p className="text-sm text-red-500">{errors.location}</p>}
                                </div>
                                <div>
                                    <Label>Target *</Label>
                                    <Select value={data.target} onValueChange={v => setData('target', v)}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="_self">Same tab (_self)</SelectItem>
                                            <SelectItem value="_blank">New tab (_blank)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div>
                                <Label>Icon (lucide name, optional)</Label>
                                <Input value={data.icon} onChange={e => setData('icon', e.target.value)} placeholder="video, radio, share-2" />
                                <p className="text-xs text-muted-foreground">Use Lucide icon names: <code>video</code>, <code>radio</code>, <code>twitter</code>, etc. Leave blank for no icon.</p>
                            </div>

                            <div className="flex flex-wrap gap-6 pt-2">
                                <label className="flex items-center gap-2 text-sm">
                                    <Checkbox checked={data.is_active} onCheckedChange={c => setData('is_active', !!c)} /> Active (visible live)
                                </label>
                                <label className="flex items-center gap-2 text-sm">
                                    <Checkbox checked={data.is_external} onCheckedChange={c => setData('is_external', !!c)} /> Mark as external (adds rel noopener)
                                </label>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-muted/30">
                        <CardHeader><CardTitle className="text-sm">Quick Presets</CardTitle></CardHeader>
                        <CardContent className="flex flex-wrap gap-2 text-xs">
                            <Button type="button" variant="outline" size="sm" onClick={() => { setData('label', 'Newsletter'); setData('url', '/page/about'); setData('location', 'header_top'); }}>Top: Newsletter</Button>
                            <Button type="button" variant="outline" size="sm" onClick={() => { setData('label', 'Live'); setData('url', '/live'); setData('location', 'header_primary'); setData('icon', 'radio'); }}>Primary: Live</Button>
                            <Button type="button" variant="outline" size="sm" onClick={() => { setData('label', 'Twitter'); setData('url', 'https://twitter.com/'); setData('location', 'social'); setData('is_external', true); setData('target', '_blank'); }}>Social: Twitter</Button>
                            <Button type="button" variant="outline" size="sm" onClick={() => { setData('label', 'About Us'); setData('url', '/page/about'); setData('location', 'footer_about'); }}>Footer: About</Button>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" asChild><Link href="/admin/navigation">Cancel</Link></Button>
                        <Button type="submit" disabled={processing}>{isEdit ? 'Update Link' : 'Create Link'}</Button>
                    </div>
                </form>
            </div>
        </>
    );
}
