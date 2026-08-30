import { Head, Link, useForm, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RichEditor } from '@/components/ui/rich-editor';

export default function CategoryForm({ category }: { category: any }) {
    const isEdit = !!category;
    const { data, setData, post, put, processing, errors } = useForm({
        name: category?.name ?? '',
        slug: category?.slug ?? '',
        description: category?.description ?? '',
        color: category?.color ?? '#6366f1',
        sort_order: category?.sort_order ?? 0,
        is_active: category?.is_active ?? true,
        show_in_menu: category?.show_in_menu ?? true,
        meta_title: category?.meta_title ?? '',
        meta_description: category?.meta_description ?? '',
        image: null as File | null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const fd = new FormData();
        Object.entries(data).forEach(([k, v]) => {
            if (k === 'image' && v) fd.append('image', v as File);
            else if (k !== 'image') fd.append(k, String(v ?? ''));
        });
        fd.set('is_active', data.is_active ? '1' : '0');
        fd.set('show_in_menu', data.show_in_menu ? '1' : '0');
        if (isEdit) {
            fd.append('_method', 'PUT');
            router.post(`/admin/categories/${category.id}`, fd);
        } else {
            router.post('/admin/categories', fd);
        }
    };

    return (
        <>
            <Head title={isEdit ? 'Edit Category' : 'Create Category'} />
            <div className="max-w-3xl mx-auto flex flex-col gap-4">
                <div className="flex items-center justify-between"><h1 className="text-2xl font-bold">{isEdit ? 'Edit Category' : 'Create Category'}</h1><Button variant="outline" asChild><Link href="/admin/categories">Back</Link></Button></div>
                <form onSubmit={submit} className="space-y-6">
                    <Card><CardHeader><CardTitle>Category Details</CardTitle></CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-2">
                            <div><Label>Name *</Label><Input value={data.name} onChange={e => setData('name', e.target.value)} />{errors.name && <p className="text-sm text-red-500">{errors.name}</p>}</div>
                            <div><Label>Slug</Label><Input value={data.slug} onChange={e => setData('slug', e.target.value)} placeholder="auto" /></div>
                            <div className="md:col-span-2"><Label>Description</Label><RichEditor value={data.description} onChange={(v) => setData('description', v)} placeholder="Category description..." /></div>
                            <div><Label>Color</Label><Input type="color" value={data.color} onChange={e => setData('color', e.target.value)} className="h-10 p-1" /></div>
                            <div><Label>Sort Order</Label><Input type="number" value={String(data.sort_order)} onChange={e => setData('sort_order', Number(e.target.value))} /></div>
                            <div><Label>Image</Label><Input type="file" accept="image/*" onChange={e => setData('image', e.target.files?.[0] ?? null)} /></div>
                            <div className="flex gap-6 md:col-span-2 mt-2">
                                <label className="flex items-center gap-2 text-sm"><Checkbox checked={data.is_active} onCheckedChange={c => setData('is_active', !!c)} /> Active</label>
                                <label className="flex items-center gap-2 text-sm"><Checkbox checked={data.show_in_menu} onCheckedChange={c => setData('show_in_menu', !!c)} /> Show in menu</label>
                            </div>
                        </CardContent>
                    </Card>
                    <Card><CardHeader><CardTitle>SEO</CardTitle></CardHeader>
                        <CardContent className="grid gap-4">
                            <div><Label>Meta Title</Label><Input value={data.meta_title} onChange={e => setData('meta_title', e.target.value)} /></div>
                            <div><Label>Meta Description</Label><Textarea value={data.meta_description} onChange={e => setData('meta_description', e.target.value)} rows={2} /></div>
                        </CardContent>
                    </Card>
                    <div className="flex justify-end gap-2"><Button variant="outline" asChild><Link href="/admin/categories">Cancel</Link></Button><Button type="submit" disabled={processing}>{isEdit ? 'Update' : 'Create'}</Button></div>
                </form>
            </div>
        </>
    );
}
