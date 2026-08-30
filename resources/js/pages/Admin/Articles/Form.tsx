import { Head, Link, useForm, router } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RichEditor } from '@/components/ui/rich-editor';

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
    seo_title?: string | null;
    seo_description?: string | null;
    canonical_url?: string | null;
    og_image?: string | null;
    seoMetadata?: { meta_keywords?: string | null; robots?: string | null; og_title?: string | null; og_description?: string | null; twitter_title?: string | null; twitter_description?: string | null; twitter_image?: string | null; meta_description?: string | null; meta_title?: string | null } | null;
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
        seo_title: (article as any)?.seo_title ?? (article as any)?.seoMetadata?.meta_title ?? '',
        seo_description: (article as any)?.seo_description ?? (article as any)?.seoMetadata?.meta_description ?? '',
        meta_keywords: (article as any)?.seoMetadata?.meta_keywords ?? '',
        canonical_url: (article as any)?.canonical_url ?? (article as any)?.seoMetadata?.canonical_url ?? '',
        og_title: (article as any)?.seoMetadata?.og_title ?? '',
        og_description: (article as any)?.seoMetadata?.og_description ?? '',
        og_image: (article as any)?.og_image ?? (article as any)?.seoMetadata?.og_image ?? '',
        twitter_title: (article as any)?.seoMetadata?.twitter_title ?? '',
        twitter_description: (article as any)?.seoMetadata?.twitter_description ?? '',
        twitter_image: (article as any)?.seoMetadata?.twitter_image ?? '',
        robots: (article as any)?.seoMetadata?.robots ?? '',
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
            formData.append('_method', 'PUT');
            router.post(`/admin/articles/${article!.id}`, formData);
        } else {
            router.post('/admin/articles', formData);
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
                                <RichEditor value={data.excerpt} onChange={(v) => setData('excerpt', v)} placeholder="Article excerpt..." />
                            </div>
                            <div className="md:col-span-2">
                                <Label>Body *</Label>
                                <RichEditor value={data.body} onChange={(v) => setData('body', v)} placeholder="Article body..." />
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

                    <Card>
                        <CardHeader><CardTitle>SEO (per-article, overrides global)</CardTitle><CardDescription>Leave blank to use global SEO defaults from Admin → SEO & Ads. These power Google, Bing, social previews, sitemap priority.</CardDescription></CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div><Label>SEO Title (meta_title, 60 chars)</Label><Input value={data.seo_title} onChange={e => setData('seo_title', e.target.value)} placeholder="Custom title for search" />{errors.seo_title && <p className="text-sm text-red-500">{errors.seo_title}</p>}</div>
                                <div><Label>Canonical URL</Label><Input value={data.canonical_url} onChange={e => setData('canonical_url', e.target.value)} placeholder="https://example.com/article/slug" /></div>
                            </div>
                            <div><Label>SEO Description (meta_description, 155 chars)</Label><Textarea value={data.seo_description} onChange={e => setData('seo_description', e.target.value)} rows={2} maxLength={500} /></div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div><Label>Meta Keywords</Label><Input value={data.meta_keywords} onChange={e => setData('meta_keywords', e.target.value)} placeholder="keyword1, keyword2" /></div>
                                <div><Label>Robots (index, follow / noindex)</Label><Input value={data.robots} onChange={e => setData('robots', e.target.value)} placeholder="index, follow" /></div>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div><Label>OG Title</Label><Input value={data.og_title} onChange={e => setData('og_title', e.target.value)} placeholder="Open Graph title" /></div>
                                <div><Label>OG Image URL or /storage path</Label><Input value={data.og_image} onChange={e => setData('og_image', e.target.value)} placeholder="https://example.com/image.jpg" /></div>
                            </div>
                            <div><Label>OG Description</Label><Textarea value={data.og_description} onChange={e => setData('og_description', e.target.value)} rows={2} /></div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div><Label>Twitter Title</Label><Input value={data.twitter_title} onChange={e => setData('twitter_title', e.target.value)} /></div>
                                <div><Label>Twitter Image</Label><Input value={data.twitter_image} onChange={e => setData('twitter_image', e.target.value)} /></div>
                            </div>
                            <div><Label>Twitter Description</Label><Textarea value={data.twitter_description} onChange={e => setData('twitter_description', e.target.value)} rows={2} /></div>
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
