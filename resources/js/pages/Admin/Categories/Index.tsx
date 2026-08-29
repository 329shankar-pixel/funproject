import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

export default function CategoriesIndex({ categories, filters }: { categories: { data: any[]; links: any[] }; filters: { search?: string } }) {
    const [search, setSearch] = useState(filters.search ?? '');
    return (
        <>
            <Head title="Categories" />
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Categories</h1>
                    <Button asChild><Link href="/admin/categories/create">Create Category</Link></Button>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>All Categories</CardTitle>
                        <form onSubmit={e => { e.preventDefault(); router.get('/admin/categories', { search }, { preserveState: true }) }} className="flex gap-2 mt-2">
                            <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="max-w-sm" />
                            <Button type="submit" variant="secondary">Search</Button>
                        </form>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="border-b text-muted-foreground"><tr><th className="text-left py-2 px-2">Name</th><th className="text-left py-2 px-2">Slug</th><th className="text-left py-2 px-2">Sort</th><th className="text-left py-2 px-2">Active</th><th className="text-right py-2 px-2">Actions</th></tr></thead>
                                <tbody>
                                    {categories.data.map((c: any) => (
                                        <tr key={c.id} className="border-b hover:bg-muted/30">
                                            <td className="py-3 px-2 flex items-center gap-2"><span className="h-3 w-3 rounded-full" style={{ backgroundColor: c.color ?? '#ccc' }} />{c.name}</td>
                                            <td className="py-3 px-2">{c.slug}</td>
                                            <td className="py-3 px-2">{c.sort_order}</td>
                                            <td className="py-3 px-2"><Badge variant={c.is_active ? 'default' : 'secondary'}>{c.is_active ? 'Active' : 'Inactive'}</Badge></td>
                                            <td className="py-3 px-2 text-right flex justify-end gap-2">
                                                <Button variant="outline" size="sm" asChild><Link href={`/admin/categories/${c.id}/edit`}>Edit</Link></Button>
                                                <Button variant="destructive" size="sm" onClick={() => confirm('Delete?') && router.delete(`/admin/categories/${c.id}`)}>Delete</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {categories.data.length === 0 && <p className="text-center py-8 text-muted-foreground">No categories</p>}
                        </div>
                        <div className="flex gap-2 mt-4 flex-wrap">
                            {categories.links.map((l: any, i: number) => (
                                <Button key={i} variant={l.active ? 'default' : 'outline'} size="sm" disabled={!l.url} onClick={() => l.url && router.get(l.url)} dangerouslySetInnerHTML={{ __html: l.label }} />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
