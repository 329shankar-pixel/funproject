import { Head, Link, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

export default function SocialIndex({ formData }: { formData: any }) {
    const { data, setData, put, processing, errors, recentlySuccessful } = useForm({
        facebook_url: formData.facebook_url ?? '',
        twitter_url: formData.twitter_url ?? '',
        x_url: formData.x_url ?? '',
        instagram_url: formData.instagram_url ?? '',
        linkedin_url: formData.linkedin_url ?? '',
        youtube_url: formData.youtube_url ?? '',
        tiktok_url: formData.tiktok_url ?? '',
        whatsapp_url: formData.whatsapp_url ?? '',
        telegram_url: formData.telegram_url ?? '',
        threads_url: formData.threads_url ?? '',
        pinterest_url: formData.pinterest_url ?? '',
        reddit_url: formData.reddit_url ?? '',
        email_contact: formData.email_contact ?? '',
        phone_contact: formData.phone_contact ?? '',
        share_platforms: formData.share_platforms ?? 'facebook, twitter, linkedin, whatsapp, telegram, email, copy',
        share_enabled: !!formData.share_enabled,
        social_enabled: !!formData.social_enabled,
        social_header_enabled: !!formData.social_header_enabled,
        social_footer_enabled: !!formData.social_footer_enabled,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/admin/social');
    };

    const platforms = ['facebook', 'twitter', 'x', 'linkedin', 'whatsapp', 'telegram', 'reddit', 'pinterest', 'email', 'copy'];

    return (
        <>
            <Head title="Social Media — Every Link Dynamic" />
            <div className="mx-auto max-w-4xl flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Social Media & Sharing</h1>
                        <p className="text-sm text-muted-foreground">Every social profile and share button is dynamic — edit here, appears instantly. Also manage via <Link href="/admin/navigation" className="underline">Navigation → Social</Link>.</p>
                    </div>
                    <Button variant="outline" asChild><Link href="/admin">Back</Link></Button>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Social Profiles (Header / Footer / Contact)</CardTitle>
                            <CardDescription>Leave blank to hide that icon. Supports Facebook, X/Twitter, Instagram, LinkedIn, YouTube, TikTok, WhatsApp, Telegram, Threads, Pinterest, Reddit.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-2">
                            <div><Label>Facebook URL</Label><Input value={data.facebook_url} onChange={e => setData('facebook_url', e.target.value)} placeholder="https://facebook.com/yourpage" /></div>
                            <div><Label>X / Twitter URL</Label><Input value={data.twitter_url} onChange={e => setData('twitter_url', e.target.value)} placeholder="https://x.com/yourhandle" /></div>
                            <div><Label>Instagram URL</Label><Input value={data.instagram_url} onChange={e => setData('instagram_url', e.target.value)} placeholder="https://instagram.com/..." /></div>
                            <div><Label>LinkedIn URL</Label><Input value={data.linkedin_url} onChange={e => setData('linkedin_url', e.target.value)} placeholder="https://linkedin.com/company/..." /></div>
                            <div><Label>YouTube URL</Label><Input value={data.youtube_url} onChange={e => setData('youtube_url', e.target.value)} placeholder="https://youtube.com/@" /></div>
                            <div><Label>TikTok URL</Label><Input value={data.tiktok_url} onChange={e => setData('tiktok_url', e.target.value)} placeholder="https://tiktok.com/@" /></div>
                            <div><Label>WhatsApp URL / Number</Label><Input value={data.whatsapp_url} onChange={e => setData('whatsapp_url', e.target.value)} placeholder="https://wa.me/123456" /></div>
                            <div><Label>Telegram URL</Label><Input value={data.telegram_url} onChange={e => setData('telegram_url', e.target.value)} placeholder="https://t.me/..." /></div>
                            <div><Label>Threads URL</Label><Input value={data.threads_url} onChange={e => setData('threads_url', e.target.value)} placeholder="https://threads.net/@" /></div>
                            <div><Label>Pinterest URL</Label><Input value={data.pinterest_url} onChange={e => setData('pinterest_url', e.target.value)} placeholder="https://pinterest.com/..." /></div>
                            <div><Label>Reddit URL</Label><Input value={data.reddit_url} onChange={e => setData('reddit_url', e.target.value)} placeholder="https://reddit.com/r/..." /></div>
                            <div><Label>YouTube (alt) — X extra field</Label><Input value={data.x_url} onChange={e => setData('x_url', e.target.value)} placeholder="Alias for Twitter" /></div>
                            <div><Label>Contact Email</Label><Input value={data.email_contact} onChange={e => setData('email_contact', e.target.value)} placeholder="hello@example.com" /></div>
                            <div><Label>Contact Phone</Label><Input value={data.phone_contact} onChange={e => setData('phone_contact', e.target.value)} placeholder="+1 555..." /></div>
                            <div className="md:col-span-2 flex flex-wrap gap-4 pt-2 border-t">
                                <label className="flex items-center gap-2 text-sm"><Checkbox checked={data.social_enabled} onCheckedChange={c => setData('social_enabled', !!c)} /> Enable social icons site-wide</label>
                                <label className="flex items-center gap-2 text-sm"><Checkbox checked={data.social_header_enabled} onCheckedChange={c => setData('social_header_enabled', !!c)} /> Show in header (top bar)</label>
                                <label className="flex items-center gap-2 text-sm"><Checkbox checked={data.social_footer_enabled} onCheckedChange={c => setData('social_footer_enabled', !!c)} /> Show in footer</label>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Article Share Platforms</CardTitle>
                            <CardDescription>Choose which share buttons appear on article pages. Readers can share via these mediums. Order is as written.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div>
                                <Label>Share Platforms (comma separated)</Label>
                                <Input value={data.share_platforms} onChange={e => setData('share_platforms', e.target.value)} placeholder="facebook, twitter, linkedin, whatsapp, telegram, email, copy" />
                                <p className="text-xs text-muted-foreground mt-1">Available: <code>{platforms.join(', ')}</code></p>
                                {errors.share_platforms && <p className="text-sm text-red-500">{errors.share_platforms}</p>}
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {platforms.map(p => {
                                    const active = data.share_platforms.split(',').map((s: string) => s.trim().toLowerCase()).includes(p);
                                    return (
                                        <button
                                            key={p}
                                            type="button"
                                            onClick={() => {
                                                const cur = data.share_platforms.split(',').map((s: string) => s.trim()).filter(Boolean);
                                                const lower = cur.map((s: string) => s.toLowerCase());
                                                if (lower.includes(p)) {
                                                    setData('share_platforms', cur.filter((s: string) => s.toLowerCase() !== p).join(', '));
                                                } else {
                                                    setData('share_platforms', [...cur, p].join(', '));
                                                }
                                            }}
                                            className={`rounded-full px-3 py-1 text-xs font-semibold border ${active ? 'bg-black text-white border-black dark:bg-white dark:text-black' : 'bg-muted border-transparent'}`}
                                        >
                                            {p}
                                        </button>
                                    );
                                })}
                            </div>
                            <label className="flex items-center gap-2 text-sm">
                                <Checkbox checked={data.share_enabled} onCheckedChange={c => setData('share_enabled', !!c)} /> Enable share bar on articles (floating + inline)
                            </label>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-2">
                        {recentlySuccessful && <span className="text-sm text-green-600 self-center">Saved — live instantly!</span>}
                        <Button type="submit" disabled={processing}>Save Social & Sharing</Button>
                    </div>
                </form>

                <Card className="border-dashed">
                    <CardHeader><CardTitle className="text-sm">How “Every Link Dynamic” works</CardTitle></CardHeader>
                    <CardContent className="text-sm text-muted-foreground space-y-2">
                        <p>• <b>Pages:</b> Admin → Pages → toggle <code>Show in header</code> / <code>Show in footer</code> → appears in header primary / footer automatically (ordered by Sort Order).</p>
                        <p>• <b>Categories:</b> Admin → Categories → toggle <code>Show in menu</code> → appears in header primary.</p>
                        <p>• <b>Custom Links:</b> Admin → Navigation → Add Link → choose location <code>header_top</code> (Newsletter, Live), <code>header_primary</code> (Video, Audio), <code>footer_explore/about</code>, <code>social</code> (profile icons).</p>
                        <p>• <b>Social Profiles:</b> here or via Navigation (<code>social</code>) — both feed header top bar + footer + share.</p>
                        <p>• All menus are cached for 1h and auto-invalidate on save.</p>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
