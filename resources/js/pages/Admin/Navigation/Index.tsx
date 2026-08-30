import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

export default function NavigationIndex({ links, filters, locations }: { links: { data: any[]; links: any[] }; filters: { search?: string; location?: string }; locations: Record<string, string> }) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [location, setLocation] = useState(filters.location ?? '');
    const [selected, setSelected] = useState<number[]>([]);
    const [bulkAction, setBulkAction] = useState<string>('');
    const allSelected = links.data.length > 0 && selected.length === links.data.length;
    const toggleAll = (c: boolean) => setSelected(c ? links.data.map((x: any) => x.id) : []);
    const toggleOne = (id: number, c: boolean) => setSelected(prev => c ? [...prev, id] : prev.filter(x => x !== id));
    const handleBulk = () => {
        if (!bulkAction || selected.length === 0) return;
        if (bulkAction === 'delete' && !confirm(`Delete ${selected.length} links?`)) return;
        router.post('/admin/navigation/bulk', { ids: selected, action: bulkAction }, { preserveScroll: true, onSuccess: () => setSelected([]) });
    };

    const apply = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/navigation', { search, location: location || undefined }, { preserveState: true });
    };

    return (
        <>
            <Head title="Navigation Links" />
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Navigation — Every Link is Dynamic</h1>
                        <p className="text-sm text-muted-foreground">Manage header, footer, top bar, mobile and social links. No code deploy needed — changes appear instantly site-wide.</p>
                    </div>
                    <Button asChild><Link href="/admin/navigation/create">Add Link</Link></Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>All Navigation Links</CardTitle>
                        <CardDescription>
                            Locations: <span className="font-mono text-xs">{Object.keys(locations).join(', ')}</span>
                        </CardDescription>
                        <form onSubmit={apply} className="flex flex-wrap gap-2 mt-3">
                            <Input placeholder="Search label or URL..." value={search} onChange={e => setSearch(e.target.value)} className="max-w-sm" />
                            <Select value={location} onValueChange={setLocation}>
                                <SelectTrigger className="w-[220px]"><SelectValue placeholder="All locations" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All locations</SelectItem>
                                    {Object.entries(locations).map(([k, v]) => (
                                        <SelectItem key={k} value={k}>{v} ({k})</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button type="submit" variant="secondary">Filter</Button>
                            <Button type="button" variant="outline" onClick={() => router.get('/admin/navigation')}>Reset</Button>
                        </form>
                        {selected.length > 0 && (
                            <div className="mt-4 flex flex-wrap items-center gap-2 rounded-md border bg-muted/50 p-3">
                                <span className="text-sm font-medium">{selected.length} selected</span>
                                <Select value={bulkAction} onValueChange={setBulkAction}>
                                    <SelectTrigger className="w-[160px]"><SelectValue placeholder="Bulk action" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="activate">Activate</SelectItem>
                                        <SelectItem value="deactivate">Deactivate</SelectItem>
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
                                <thead className="border-b text-muted-foreground">
                                    <tr>
                                        <th className="py-2 px-2"><Checkbox checked={allSelected} onCheckedChange={toggleAll} aria-label="Select all" /></th>
                                        <th className="text-left py-2 px-2">Label</th>
                                        <th className="text-left py-2 px-2">URL</th>
                                        <th className="text-left py-2 px-2">Location</th>
                                        <th className="text-left py-2 px-2">Order</th>
                                        <th className="text-left py-2 px-2">Active</th>
                                        <th className="text-right py-2 px-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {links.data.map((l: any) => (
                                        <tr key={l.id} className="border-b hover:bg-muted/30">
                                            <td className="py-3 px-2"><Checkbox checked={selected.includes(l.id)} onCheckedChange={(cc) => toggleOne(l.id, !!cc)} /></td>
                                            <td className="py-3 px-2 font-medium flex items-center gap-2">
                                                {l.icon && <span className="text-xs text-muted-foreground">[{l.icon}]</span>}
                                                {l.label}
                                                {l.is_external && <Badge variant="outline" className="ml-1 text-[10px]">external</Badge>}
                                            </td>
                                            <td className="py-3 px-2 font-mono text-xs max-w-[260px] truncate" title={l.url}>{l.url}</td>
                                            <td className="py-3 px-2"><Badge variant="secondary" className="text-xs">{l.location}</Badge></td>
                                            <td className="py-3 px-2">{l.sort_order}</td>
                                            <td className="py-3 px-2"><Badge variant={l.is_active ? 'default' : 'secondary'}>{l.is_active ? 'Active' : 'Off'}</Badge></td>
                                            <td className="py-3 px-2">
                                                <div className="flex justify-end gap-1">
                                                    <Button variant="outline" size="sm" asChild><Link href={`/admin/navigation/${l.id}/edit`}>Edit</Link></Button>
                                                    <Button variant="destructive" size="sm" onClick={() => confirm(`Delete "${l.label}"?`) && router.delete(`/admin/navigation/${l.id}`)}>Delete</Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {links.data.length === 0 && <p className="text-center py-8 text-muted-foreground">No links — add your first navigation item. Every header/footer link is controlled here.</p>}
                        </div>
                        <div className="flex gap-2 mt-4 flex-wrap">
                            {links.links.map((lp: any, i: number) => (
                                <Button key={i} variant={lp.active ? 'default' : 'outline'} size="sm" disabled={!lp.url} onClick={() => lp.url && router.get(lp.url)} dangerouslySetInnerHTML={{ __html: lp.label }} />
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-dashed">
                    <CardHeader><CardTitle className="text-base">How Dynamic Links Work</CardTitle></CardHeader>
                    <CardContent className="text-sm text-muted-foreground space-y-2">
                        <p><b>Header Top:</b> small black bar (Live, date, Newsletter etc.) — location <code>header_top</code></p>
                        <p><b>Header Primary:</b> main white nav (Home + categories) — location <code>header_primary</code>. Extra links added here appear next to categories.</p>
                        <p><b>Header More Dropdown:</b> overflow under “More” — location <code>header_more</code></p>
                        <p><b>Footer:</b> Explore / About columns — locations <code>footer_explore</code>, <code>footer_about</code>, <code>footer_legal</code></p>
                        <p><b>Social:</b> profile icons header/footer — location <code>social</code> + Settings → Social Media</p>
                        <p>Categories and Pages still auto-inject if <code>show_in_menu</code> / <code>show_in_header</code> / <code>show_in_footer</code> is on — you get both auto + custom links.</p>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
