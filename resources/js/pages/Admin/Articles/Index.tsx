import { Head, Link, router, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
    const [selected, setSelected] = useState<number[]>([]);
    const [bulkAction, setBulkAction] = useState<string>('');
    const page = usePage();
    const allSelected = articles.data.length > 0 && selected.length === articles.data.length;
    const toggleAll = (c: boolean) => setSelected(c ? articles.data.map(a => a.id) : []);
    const toggleOne = (id: number, c: boolean) => setSelected(prev => c ? [...prev, id] : prev.filter(x => x !== id));
    const handleBulk = () => {
        if (!bulkAction || selected.length === 0) return;
        if (bulkAction === 'delete' && !confirm(`Delete ${selected.length} articles? This cannot be undone.`)) return;
        router.post('/admin/articles/bulk', { ids: selected, action: bulkAction }, { preserveScroll: true, onSuccess: () => setSelected([]) });
    };

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
                        {selected.length > 0 && (
                            <div className="mt-4 flex flex-wrap items-center gap-2 rounded-md border bg-muted/50 p-3">
                                <span className="text-sm font-medium">{selected.length} selected</span>
                                <Select value={bulkAction} onValueChange={setBulkAction}>
                                    <SelectTrigger className="w-[160px]"><SelectValue placeholder="Bulk action" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="publish">Publish</SelectItem>
                                        <SelectItem value="draft">Move to Draft</SelectItem>
                                        <SelectItem value="archive">Archive</SelectItem>
                                        <SelectItem value="delete">Delete</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button size="sm" disabled={!bulkAction} onClick={handleBulk}>Apply</Button>
                                <Button size="sm" variant="ghost" onClick={() => setSelected([])}>Clear</Button>
                            </div>
                        )}
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="text-muted-foreground border-b">
                                    <tr>
                                        <th className="py-2 px-2"><Checkbox checked={allSelected} onCheckedChange={toggleAll} aria-label="Select all" /></th>
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
                                            <td className="py-3 px-2"><Checkbox checked={selected.includes(a.id)} onCheckedChange={(c) => toggleOne(a.id, !!c)} /></td>
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
