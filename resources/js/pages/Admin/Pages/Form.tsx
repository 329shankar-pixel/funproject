import { Head, Link, useForm, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RichEditor } from '@/components/ui/rich-editor';

export default function PageForm({ page }: { page: any }) {
    const isEdit = !!page;
    const { data, setData, post, processing, errors } = useForm({
        title: page?.title ?? '',
        slug: page?.slug ?? '',
        excerpt: page?.excerpt ?? '',
        body: page?.body ?? '',
        status: page?.status ?? 'draft',
        show_in_footer: page?.show_in_footer ?? true,
        show_in_header: page?.show_in_header ?? false,
        sort_order: page?.sort_order ?? 0,
        featured_image: null as File | null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const fd = new FormData();
        Object.entries(data).forEach(([k, v]) => {
            if (k === 'featured_image' && v) fd.append('featured_image', v as File);
            else if (k !== 'featured_image') fd.append(k, String(v ?? ''));
        });
        fd.set('show_in_footer', data.show_in_footer ? '1' : '0');
        fd.set('show_in_header', data.show_in_header ? '1' : '0');
        if (isEdit) {
            fd.append('_method', 'PUT');
            router.post(`/admin/pages/${page.id}`, fd);
        } else {
            router.post('/admin/pages', fd);
        }
    };

    return (
        <>
            <Head title={isEdit ? 'Edit Page' : 'Create Page'} />
            <div className="max-w-3xl mx-auto flex flex-col gap-4">
                <div className="flex items-center justify-between"><h1 className="text-2xl font-bold">{isEdit ? 'Edit Page' : 'Create Page'}</h1><Button variant="outline" asChild><Link href="/admin/pages">Back</Link></Button></div>
                <form onSubmit={submit} className="space-y-6">
                    <Card><CardHeader><CardTitle>Page Details</CardTitle></CardHeader>
                        <CardContent className="grid gap-4">
                            <div><Label>Title *</Label><Input value={data.title} onChange={e => setData('title', e.target.value)} />{errors.title && <p className="text-sm text-red-500">{errors.title}</p>}</div>
                            <div><Label>Slug</Label><Input value={data.slug} onChange={e => setData('slug', e.target.value)} placeholder="auto" /></div>
                            <div><Label>Excerpt</Label><RichEditor value={data.excerpt} onChange={(v) => setData('excerpt', v)} placeholder="Short excerpt..." /></div>
                            <div><Label>Body *</Label><RichEditor value={data.body} onChange={(v) => setData('body', v)} placeholder="Page content..." />{errors.body && <p className="text-sm text-red-500">{errors.body}</p>}</div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div><Label>Status</Label><Select value={data.status} onValueChange={v => setData('status', v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="draft">Draft</SelectItem><SelectItem value="published">Published</SelectItem><SelectItem value="archived">Archived</SelectItem></SelectContent></Select></div>
                                <div><Label>Sort Order</Label><Input type="number" value={String(data.sort_order)} onChange={e => setData('sort_order', Number(e.target.value))} /></div>
                            </div>
                            <div><Label>Featured Image</Label><Input type="file" accept="image/*" onChange={e => setData('featured_image', e.target.files?.[0] ?? null)} /></div>
                            <div className="flex gap-6">
                                <label className="flex items-center gap-2 text-sm"><Checkbox checked={data.show_in_footer} onCheckedChange={c => setData('show_in_footer', !!c)} /> Show in footer</label>
                                <label className="flex items-center gap-2 text-sm"><Checkbox checked={data.show_in_header} onCheckedChange={c => setData('show_in_header', !!c)} /> Show in header</label>
                            </div>
                        </CardContent>
                    </Card>
                    <div className="flex justify-end gap-2"><Button variant="outline" asChild><Link href="/admin/pages">Cancel</Link></Button><Button type="submit" disabled={processing}>{isEdit ? 'Update' : 'Create'}</Button></div>
                </form>
            </div>
        </>
    );
}
