import { Head, Link, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

export default function AuthorForm({ author, users }: { author: any; users: { id: number; name: string }[] }) {
    const isEdit = !!author;
    const { data, setData, post, processing, errors } = useForm({
        name: author?.name ?? '',
        username: author?.username ?? '',
        bio: author?.bio ?? '',
        email: author?.email ?? '',
        website: author?.website ?? '',
        type: author?.type ?? 'contributor',
        is_verified: author?.is_verified ?? false,
        is_active: author?.is_active ?? true,
        user_id: author?.user_id ? String(author.user_id) : '',
        profile_image: null as File | null,
        cover_image: null as File | null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const fd = new FormData();
        Object.entries(data).forEach(([k, v]) => {
            if ((k === 'profile_image' || k === 'cover_image') && v) fd.append(k, v as File);
            else if (k !== 'profile_image' && k !== 'cover_image') fd.append(k, String(v ?? ''));
        });
        fd.set('is_verified', data.is_verified ? '1' : '0');
        fd.set('is_active', data.is_active ? '1' : '0');
        if (isEdit) { fd.append('_method', 'put'); post(`/admin/authors/${author.id}`, { forceFormData: true }); }
        else post('/admin/authors', { forceFormData: true });
    };

    return (
        <>
            <Head title={isEdit ? 'Edit Author' : 'Create Author'} />
            <div className="max-w-3xl mx-auto flex flex-col gap-4">
                <div className="flex items-center justify-between"><h1 className="text-2xl font-bold">{isEdit ? 'Edit Author' : 'Create Author'}</h1><Button variant="outline" asChild><Link href="/admin/authors">Back</Link></Button></div>
                <form onSubmit={submit} className="space-y-6">
                    <Card><CardHeader><CardTitle>Profile</CardTitle></CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-2">
                            <div><Label>Name *</Label><Input value={data.name} onChange={e => setData('name', e.target.value)} />{errors.name && <p className="text-sm text-red-500">{errors.name}</p>}</div>
                            <div><Label>Username</Label><Input value={data.username} onChange={e => setData('username', e.target.value)} placeholder="auto slug" /></div>
                            <div className="md:col-span-2"><Label>Bio</Label><Textarea value={data.bio} onChange={e => setData('bio', e.target.value)} rows={3} /></div>
                            <div><Label>Linked User</Label>
                                <Select value={data.user_id} onValueChange={v => setData('user_id', v)}>
                                    <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
                                    <SelectContent>{users.map(u => <SelectItem key={u.id} value={String(u.id)}>{u.name}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                            <div><Label>Type</Label>
                                <Select value={data.type} onValueChange={v => setData('type', v)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="staff">Staff</SelectItem><SelectItem value="editor">Editor</SelectItem><SelectItem value="contributor">Contributor</SelectItem><SelectItem value="guest">Guest</SelectItem><SelectItem value="researcher">Researcher</SelectItem><SelectItem value="columnist">Columnist</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div><Label>Profile Image</Label><Input type="file" accept="image/*" onChange={e => setData('profile_image', e.target.files?.[0] ?? null)} /></div>
                            <div><Label>Cover Image</Label><Input type="file" accept="image/*" onChange={e => setData('cover_image', e.target.files?.[0] ?? null)} /></div>
                            <div><Label>Email</Label><Input value={data.email} onChange={e => setData('email', e.target.value)} /></div>
                            <div><Label>Website</Label><Input value={data.website} onChange={e => setData('website', e.target.value)} /></div>
                            <div className="flex gap-6 md:col-span-2 mt-2">
                                <label className="flex items-center gap-2 text-sm"><Checkbox checked={data.is_verified} onCheckedChange={c => setData('is_verified', !!c)} /> Verified</label>
                                <label className="flex items-center gap-2 text-sm"><Checkbox checked={data.is_active} onCheckedChange={c => setData('is_active', !!c)} /> Active</label>
                            </div>
                        </CardContent>
                    </Card>
                    <div className="flex justify-end gap-2"><Button variant="outline" asChild><Link href="/admin/authors">Cancel</Link></Button><Button type="submit" disabled={processing}>{isEdit ? 'Update' : 'Create'}</Button></div>
                </form>
            </div>
        </>
    );
}
