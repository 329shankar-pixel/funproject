import { Head, Link, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface Article {
    id: number;
    title: string;
    slug: string | null;
    subtitle: string | null;
    excerpt: string | null;
    body: string;
    category_id: number;
    author_id: number;
    status: string;
    visibility: string;
    is_featured: boolean;
    is_trending: boolean;
    is_breaking: boolean;
    is_opinion: boolean;
    is_analysis: boolean;
    topics?: { id: number }[];
}

export default function ArticleForm({ article, categories, authors, topics }: { article: Article | null; categories: { id: number; name: string }[]; authors: { id: number; name: string }[]; topics: { id: number; name: string }[] }) {
    const isEdit = !!article;
    const { data, setData, post, put, processing, errors } = useForm({
        title: article?.title ?? '',
        slug: article?.slug ?? '',
        subtitle: article?.subtitle ?? '',
        excerpt: article?.excerpt ?? '',
        body: article?.body ?? '',
        category_id: article?.category_id ? String(article.category_id) : '',
        author_id: article?.author_id ? String(article.author_id) : '',
        status: article?.status ?? 'draft',
        visibility: article?.visibility ?? 'public',
        is_featured: article?.is_featured ?? false,
        is_trending: article?.is_trending ?? false,
        is_breaking: article?.is_breaking ?? false,
        is_opinion: article?.is_opinion ?? false,
        is_analysis: article?.is_analysis ?? false,
        topics: article?.topics?.map(t => t.id) ?? [] as number[],
        featured_image: null as File | null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        Object.entries(data).forEach(([k, v]) => {
            if (k === 'topics') {
                (v as number[]).forEach(id => formData.append('topics[]', String(id)));
            } else if (k === 'featured_image' && v) {
                formData.append('featured_image', v as File);
            } else if (v !== null && v !== undefined) {
                formData.append(k, String(v));
            }
        });
        // booleans need 1/0
        formData.set('is_featured', data.is_featured ? '1' : '0');
        formData.set('is_trending', data.is_trending ? '1' : '0');
        formData.set('is_breaking', data.is_breaking ? '1' : '0');
        formData.set('is_opinion', data.is_opinion ? '1' : '0');
        formData.set('is_analysis', data.is_analysis ? '1' : '0');

        if (isEdit) {
            formData.append('_method', 'put');
            post(`/admin/articles/${article!.id}`, { forceFormData: true });
        } else {
            post('/admin/articles', { forceFormData: true });
        }
    };

    return (
        <>
            <Head title={isEdit ? 'Edit Article' : 'Create Article'} />
            <div className="max-w-4xl mx-auto flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">{isEdit ? 'Edit Article' : 'Create Article'}</h1>
                    <Button variant="outline" asChild><Link href="/admin/articles">Back</Link></Button>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-2">
                            <div className="md:col-span-2">
                                <Label>Title *</Label>
                                <Input value={data.title} onChange={e => setData('title', e.target.value)} />
                                {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                            </div>
                            <div>
                                <Label>Slug (auto if empty)</Label>
                                <Input value={data.slug} onChange={e => setData('slug', e.target.value)} placeholder="my-article-slug" />
                            </div>
                            <div>
                                <Label>Subtitle</Label>
                                <Input value={data.subtitle} onChange={e => setData('subtitle', e.target.value)} />
                            </div>
                            <div className="md:col-span-2">
                                <Label>Excerpt</Label>
                                <Textarea value={data.excerpt} onChange={e => setData('excerpt', e.target.value)} rows={2} />
                            </div>
                            <div className="md:col-span-2">
                                <Label>Body *</Label>
                                <Textarea value={data.body} onChange={e => setData('body', e.target.value)} rows={10} />
                                {errors.body && <p className="text-sm text-red-500">{errors.body}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Media & Organization</CardTitle></CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-3">
                            <div>
                                <Label>Category *</Label>
                                <Select value={data.category_id} onValueChange={v => setData('category_id', v)}>
                                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                                    <SelectContent>{categories.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Author *</Label>
                                <Select value={data.author_id} onValueChange={v => setData('author_id', v)}>
                                    <SelectTrigger><SelectValue placeholder="Select author" /></SelectTrigger>
                                    <SelectContent>{authors.map(a => <SelectItem key={a.id} value={String(a.id)}>{a.name}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Featured Image</Label>
                                <Input type="file" accept="image/*" onChange={e => setData('featured_image', e.target.files?.[0] ?? null)} />
                            </div>
                            <div className="md:col-span-3">
                                <Label>Topics</Label>
                                <div className="flex flex-wrap gap-3 mt-2 border rounded p-3">
                                    {topics.map(t => (
                                        <label key={t.id} className="flex items-center gap-2 text-sm">
                                            <Checkbox checked={data.topics.includes(t.id)} onCheckedChange={c => {
                                                setData('topics', c ? [...data.topics, t.id] : data.topics.filter(id => id !== t.id));
                                            }} />
                                            {t.name}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Publishing</CardTitle></CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-2">
                            <div>
                                <Label>Status</Label>
                                <Select value={data.status} onValueChange={v => setData('status', v)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="draft">Draft</SelectItem>
                                        <SelectItem value="in_review">In Review</SelectItem>
                                        <SelectItem value="published">Published</SelectItem>
                                        <SelectItem value="archived">Archived</SelectItem>
                                        <SelectItem value="rejected">Rejected</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Visibility</Label>
                                <Select value={data.visibility} onValueChange={v => setData('visibility', v)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="public">Public</SelectItem>
                                        <SelectItem value="private">Private</SelectItem>
                                        <SelectItem value="password_protected">Password Protected</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-5 gap-4 mt-2">
                                {(['is_featured', 'is_trending', 'is_breaking', 'is_opinion', 'is_analysis'] as const).map(k => (
                                    <label key={k} className="flex items-center gap-2 text-sm">
                                        <Checkbox checked={data[k]} onCheckedChange={c => setData(k, !!c)} /> {k.replace('is_', '')}
                                    </label>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" asChild><Link href="/admin/articles">Cancel</Link></Button>
                        <Button type="submit" disabled={processing}>{isEdit ? 'Update' : 'Create'}</Button>
                    </div>
                </form>
            </div>
        </>
    );
}
