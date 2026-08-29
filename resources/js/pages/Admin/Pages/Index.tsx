import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

export default function PagesIndex({ pages, filters }: { pages: { data: any[]; links: any[] }; filters: { search?: string } }) {
    const [search, setSearch] = useState(filters.search ?? '');
    return (
        <>
            <Head title="Pages" />
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between"><h1 className="text-2xl font-bold">Pages</h1><Button asChild><Link href="/admin/pages/create">Create Page</Link></Button></div>
                <Card>
                    <CardHeader><CardTitle>All Pages</CardTitle>
                        <form onSubmit={e => { e.preventDefault(); router.get('/admin/pages', { search }, { preserveState: true }) }} className="flex gap-2 mt-2">
                            <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="max-w-sm" />
                            <Button type="submit" variant="secondary">Search</Button>
                        </form>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="border-b text-muted-foreground"><tr><th className="text-left py-2 px-2">Title</th><th className="text-left py-2 px-2">Slug</th><th className="text-left py-2 px-2">Status</th><th className="text-left py-2 px-2">Footer</th><th className="text-right py-2 px-2">Actions</th></tr></thead>
                                <tbody>
                                    {pages.data.map((p: any) => (
                                        <tr key={p.id} className="border-b hover:bg-muted/30">
                                            <td className="py-3 px-2 font-medium">{p.title}</td>
                                            <td className="py-3 px-2">{p.slug}</td>
                                            <td className="py-3 px-2"><Badge variant={p.status === 'published' ? 'default' : 'secondary'} className="capitalize">{p.status}</Badge></td>
                                            <td className="py-3 px-2">{p.show_in_footer ? 'Yes' : '—'}</td>
                                            <td className="py-3 px-2 text-right flex justify-end gap-2"><Button variant="outline" size="sm" asChild><Link href={`/admin/pages/${p.id}/edit`}>Edit</Link></Button><Button variant="destructive" size="sm" onClick={() => confirm('Delete?') && router.delete(`/admin/pages/${p.id}`)}>Delete</Button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {pages.data.length === 0 && <p className="text-center py-8 text-muted-foreground">No pages</p>}
                        </div>
                        <div className="flex gap-2 mt-4 flex-wrap">{pages.links.map((l: any, i: number) => <Button key={i} variant={l.active ? 'default' : 'outline'} size="sm" disabled={!l.url} onClick={() => l.url && router.get(l.url)} dangerouslySetInnerHTML={{ __html: l.label }} />)}</div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
