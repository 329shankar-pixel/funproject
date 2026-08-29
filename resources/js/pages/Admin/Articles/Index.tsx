import { Head, Link, router, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

interface Article {
    id: number;
    title: string;
    slug: string;
    status: string;
    view_count: number;
    created_at: string;
    category?: { name: string } | null;
    author?: { name: string } | null;
}

export default function ArticlesIndex({ articles, filters }: { articles: { data: Article[]; links: { url: string | null; label: string; active: boolean }[] }; filters: { search?: string; status?: string } }) {
    const [search, setSearch] = useState(filters.search ?? '');
    const page = usePage();

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/articles', { search }, { preserveState: true });
    };

    return (
        <>
            <Head title="Manage Articles" />
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Articles</h1>
                    <Button asChild><Link href="/admin/articles/create">Create Article</Link></Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>All Articles</CardTitle>
                        <form onSubmit={submit} className="flex gap-2 mt-2">
                            <Input placeholder="Search title..." value={search} onChange={e => setSearch(e.target.value)} className="max-w-sm" />
                            <Button type="submit" variant="secondary">Search</Button>
                            {filters.search && <Button variant="ghost" onClick={() => router.get('/admin/articles')}>Clear</Button>}
                        </form>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="text-muted-foreground border-b">
                                    <tr>
                                        <th className="text-left py-2 px-2">Title</th>
                                        <th className="text-left py-2 px-2">Category</th>
                                        <th className="text-left py-2 px-2">Author</th>
                                        <th className="text-left py-2 px-2">Status</th>
                                        <th className="text-left py-2 px-2">Views</th>
                                        <th className="text-right py-2 px-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {articles.data.map(a => (
                                        <tr key={a.id} className="border-b hover:bg-muted/30">
                                            <td className="py-3 px-2 font-medium max-w-[260px] truncate">{a.title}</td>
                                            <td className="py-3 px-2">{a.category?.name}</td>
                                            <td className="py-3 px-2">{a.author?.name}</td>
                                            <td className="py-3 px-2"><Badge variant={a.status === 'published' ? 'default' : 'secondary'} className="capitalize">{a.status}</Badge></td>
                                            <td className="py-3 px-2">{a.view_count}</td>
                                            <td className="py-3 px-2 text-right flex justify-end gap-2">
                                                <Button variant="outline" size="sm" asChild><Link href={`/admin/articles/${a.id}/edit`}>Edit</Link></Button>
                                                <Button variant="destructive" size="sm" onClick={() => { if (confirm('Delete?')) router.delete(`/admin/articles/${a.id}`) }}>Delete</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {articles.data.length === 0 && <p className="text-center py-8 text-muted-foreground">No articles found</p>}
                        </div>
                        <div className="flex gap-2 mt-4 flex-wrap">
                            {articles.links.map((l, i) => (
                                <Button key={i} variant={l.active ? 'default' : 'outline'} size="sm" disabled={!l.url} onClick={() => l.url && router.get(l.url)} dangerouslySetInnerHTML={{ __html: l.label }} />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
