import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

export default function UsersIndex({ users, filters }: { users: { data: any[]; links: any[] }; filters: { search?: string } }) {
    const [search, setSearch] = useState(filters.search ?? '');
    return (
        <>
            <Head title="Users" />
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between"><h1 className="text-2xl font-bold">Users</h1><Badge variant="secondary">{users.data.length} shown</Badge></div>
                <Card>
                    <CardHeader><CardTitle>All Users</CardTitle>
                        <form onSubmit={e => { e.preventDefault(); router.get('/admin/users', { search }, { preserveState: true }) }} className="flex gap-2 mt-2">
                            <Input placeholder="Search name or email..." value={search} onChange={e => setSearch(e.target.value)} className="max-w-sm" />
                            <Button type="submit" variant="secondary">Search</Button>
                        </form>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="border-b text-muted-foreground"><tr><th className="text-left py-2 px-2">Name</th><th className="text-left py-2 px-2">Email</th><th className="text-left py-2 px-2">Status</th><th className="text-left py-2 px-2">Created</th></tr></thead>
                                <tbody>
                                    {users.data.map((u: any) => (
                                        <tr key={u.id} className="border-b hover:bg-muted/30">
                                            <td className="py-3 px-2 font-medium">{u.name}</td>
                                            <td className="py-3 px-2">{u.email}</td>
                                            <td className="py-3 px-2"><Badge variant={u.status === 'active' ? 'default' : 'secondary'} className="capitalize">{u.status}</Badge></td>
                                            <td className="py-3 px-2">{new Date(u.created_at).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {users.data.length === 0 && <p className="text-center py-8 text-muted-foreground">No users</p>}
                        </div>
                        <div className="flex gap-2 mt-4 flex-wrap">{users.links.map((l: any, i: number) => <Button key={i} variant={l.active ? 'default' : 'outline'} size="sm" disabled={!l.url} onClick={() => l.url && router.get(l.url)} dangerouslySetInnerHTML={{ __html: l.label }} />)}</div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
