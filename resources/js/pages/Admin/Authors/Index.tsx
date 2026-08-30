import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

export default function AuthorsIndex({ authors, filters }: { authors: { data: any[]; links: any[] }; filters: { search?: string } }) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [selected, setSelected] = useState<number[]>([]);
    const [bulkAction, setBulkAction] = useState<string>('');
    const allSelected = authors.data.length > 0 && selected.length === authors.data.length;
    const toggleAll = (c: boolean) => setSelected(c ? authors.data.map((x: any) => x.id) : []);
    const toggleOne = (id: number, c: boolean) => setSelected(prev => c ? [...prev, id] : prev.filter(x => x !== id));
    const handleBulk = () => {
        if (!bulkAction || selected.length === 0) return;
        if (bulkAction === 'delete' && !confirm(`Delete ${selected.length} authors?`)) return;
        router.post('/admin/authors/bulk', { ids: selected, action: bulkAction }, { preserveScroll: true, onSuccess: () => setSelected([]) });
    };
    return (
        <>
            <Head title="Authors" />
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between"><h1 className="text-2xl font-bold">Authors</h1><Button asChild><Link href="/admin/authors/create">Create Author</Link></Button></div>
                <Card>
                    <CardHeader><CardTitle>All Authors</CardTitle>
                        <form onSubmit={e => { e.preventDefault(); router.get('/admin/authors', { search }, { preserveState: true }) }} className="flex gap-2 mt-2">
                            <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="max-w-sm" />
                            <Button type="submit" variant="secondary">Search</Button>
                        </form>
                        {selected.length > 0 && (
                            <div className="mt-4 flex flex-wrap items-center gap-2 rounded-md border bg-muted/50 p-3">
                                <span className="text-sm font-medium">{selected.length} selected</span>
                                <Select value={bulkAction} onValueChange={setBulkAction}>
                                    <SelectTrigger className="w-[160px]"><SelectValue placeholder="Bulk action" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="activate">Activate</SelectItem>
                                        <SelectItem value="deactivate">Deactivate</SelectItem>
                                        <SelectItem value="verify">Verify</SelectItem>
                                        <SelectItem value="unverify">Unverify</SelectItem>
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
                                <thead className="border-b text-muted-foreground"><tr><th className="py-2 px-2"><Checkbox checked={allSelected} onCheckedChange={toggleAll} aria-label="Select all" /></th><th className="text-left py-2 px-2">Name</th><th className="text-left py-2 px-2">Username</th><th className="text-left py-2 px-2">Type</th><th className="text-left py-2 px-2">Verified</th><th className="text-right py-2 px-2">Actions</th></tr></thead>
                                <tbody>
                                    {authors.data.map((a: any) => (
                                        <tr key={a.id} className="border-b hover:bg-muted/30">
                                            <td className="py-3 px-2"><Checkbox checked={selected.includes(a.id)} onCheckedChange={(cc) => toggleOne(a.id, !!cc)} /></td>
                                            <td className="py-3 px-2 font-medium">{a.name}</td>
                                            <td className="py-3 px-2">{a.username}</td>
                                            <td className="py-3 px-2"><Badge variant="secondary" className="capitalize">{a.type}</Badge></td>
                                            <td className="py-3 px-2">{a.is_verified ? <Badge>Verified</Badge> : <Badge variant="outline">—</Badge>}</td>
                                            <td className="py-3 px-2 text-right flex justify-end gap-2"><Button variant="outline" size="sm" asChild><Link href={`/admin/authors/${a.id}/edit`}>Edit</Link></Button><Button variant="destructive" size="sm" onClick={() => confirm('Delete?') && router.delete(`/admin/authors/${a.id}`)}>Delete</Button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {authors.data.length === 0 && <p className="text-center py-8 text-muted-foreground">No authors</p>}
                        </div>
                        <div className="flex gap-2 mt-4 flex-wrap">{authors.links.map((l: any, i: number) => <Button key={i} variant={l.active ? 'default' : 'outline'} size="sm" disabled={!l.url} onClick={() => l.url && router.get(l.url)} dangerouslySetInnerHTML={{ __html: l.label }} />)}</div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
