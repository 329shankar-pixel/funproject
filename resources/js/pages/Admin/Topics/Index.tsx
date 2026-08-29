import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

export default function TopicsIndex({ topics, filters }: { topics: { data: any[]; links: any[] }; filters: { search?: string } }) {
    const [search, setSearch] = useState(filters.search ?? '');
    return (
        <>
            <Head title="Topics" />
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between"><h1 className="text-2xl font-bold">Topics</h1><Button asChild><Link href="/admin/topics/create">Create Topic</Link></Button></div>
                <Card>
                    <CardHeader><CardTitle>All Topics</CardTitle>
                        <form onSubmit={e => { e.preventDefault(); router.get('/admin/topics', { search }, { preserveState: true }) }} className="flex gap-2 mt-2">
                            <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="max-w-sm" />
                            <Button type="submit" variant="secondary">Search</Button>
                        </form>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="border-b text-muted-foreground"><tr><th className="text-left py-2 px-2">Name</th><th className="text-left py-2 px-2">Slug</th><th className="text-left py-2 px-2">Featured</th><th className="text-left py-2 px-2">Active</th><th className="text-right py-2 px-2">Actions</th></tr></thead>
                                <tbody>
                                    {topics.data.map((t: any) => (
                                        <tr key={t.id} className="border-b hover:bg-muted/30">
                                            <td className="py-3 px-2 flex items-center gap-2"><span className="h-3 w-3 rounded-full" style={{ backgroundColor: t.color ?? '#ccc' }} />{t.name}</td>
                                            <td className="py-3 px-2">{t.slug}</td>
                                            <td className="py-3 px-2">{t.is_featured ? <Badge>Featured</Badge> : <Badge variant="secondary">—</Badge>}</td>
                                            <td className="py-3 px-2"><Badge variant={t.is_active ? 'default' : 'secondary'}>{t.is_active ? 'Active' : 'Inactive'}</Badge></td>
                                            <td className="py-3 px-2 text-right flex justify-end gap-2"><Button variant="outline" size="sm" asChild><Link href={`/admin/topics/${t.id}/edit`}>Edit</Link></Button><Button variant="destructive" size="sm" onClick={() => confirm('Delete?') && router.delete(`/admin/topics/${t.id}`)}>Delete</Button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {topics.data.length === 0 && <p className="text-center py-8 text-muted-foreground">No topics</p>}
                        </div>
                        <div className="flex gap-2 mt-4 flex-wrap">{topics.links.map((l: any, i: number) => <Button key={i} variant={l.active ? 'default' : 'outline'} size="sm" disabled={!l.url} onClick={() => l.url && router.get(l.url)} dangerouslySetInnerHTML={{ __html: l.label }} />)}</div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
