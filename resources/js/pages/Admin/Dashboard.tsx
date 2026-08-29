import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Tag, Hash, Users, UserRound, FileStack, Eye } from 'lucide-react';

interface Stats {
    articles: number;
    published: number;
    pending: number;
    drafts: number;
    categories: number;
    topics: number;
    authors: number;
    pages: number;
    users: number;
}

interface Article {
    id: number;
    title: string;
    slug: string;
    status: string;
    created_at: string;
    category?: { name: string } | null;
    author?: { name: string } | null;
}

export default function AdminDashboard({ stats, recentArticles }: { stats: Stats; recentArticles: Article[] }) {
    return (
        <>
            <Head title="Admin Dashboard" />
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
                        <p className="text-sm text-muted-foreground">Manage all website content — everything here is dynamic and appears instantly on the public site.</p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/articles/create">New Article</Link>
                    </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
                    <Card><CardHeader className="pb-2"><CardDescription className="flex items-center gap-2"><FileText className="h-4 w-4" /> Articles</CardDescription><CardTitle className="text-2xl">{stats.articles}</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground">{stats.published} published · {stats.pending} pending · {stats.drafts} drafts</CardContent></Card>
                    <Card><CardHeader className="pb-2"><CardDescription className="flex items-center gap-2"><Tag className="h-4 w-4" /> Categories</CardDescription><CardTitle className="text-2xl">{stats.categories}</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground">Organization</CardContent></Card>
                    <Card><CardHeader className="pb-2"><CardDescription className="flex items-center gap-2"><Hash className="h-4 w-4" /> Topics</CardDescription><CardTitle className="text-2xl">{stats.topics}</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground">Trending tags</CardContent></Card>
                    <Card><CardHeader className="pb-2"><CardDescription className="flex items-center gap-2"><UserRound className="h-4 w-4" /> Authors</CardDescription><CardTitle className="text-2xl">{stats.authors}</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground">Writers & editors</CardContent></Card>
                    <Card><CardHeader className="pb-2"><CardDescription className="flex items-center gap-2"><Users className="h-4 w-4" /> Users</CardDescription><CardTitle className="text-2xl">{stats.users}</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground">Registered users</CardContent></Card>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <Card className="lg:col-span-2">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div><CardTitle>Recent Articles</CardTitle><CardDescription>Latest 5 articles</CardDescription></div>
                            <Button variant="outline" size="sm" asChild><Link href="/admin/articles">View all</Link></Button>
                        </CardHeader>
                        <CardContent>
                            {recentArticles.length === 0 ? <p className="text-sm text-muted-foreground py-8 text-center">No articles yet</p> : (
                                <div className="divide-y">
                                    {recentArticles.map(a => (
                                        <div key={a.id} className="flex items-center justify-between py-3 gap-4">
                                            <div className="min-w-0">
                                                <div className="text-sm font-medium truncate">{a.title}</div>
                                                <div className="text-xs text-muted-foreground">{a.category?.name} · {a.author?.name} · {a.status}</div>
                                            </div>
                                            <Button variant="ghost" size="sm" asChild><Link href={`/admin/articles/${a.id}/edit`}>Edit</Link></Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Quick Manage</CardTitle><CardDescription>All site data is dynamic</CardDescription></CardHeader>
                        <CardContent className="grid grid-cols-2 gap-2">
                            <Button variant="secondary" asChild><Link href="/admin/articles"><FileText className="mr-2 h-4 w-4" /> Articles</Link></Button>
                            <Button variant="secondary" asChild><Link href="/admin/categories"><Tag className="mr-2 h-4 w-4" /> Categories</Link></Button>
                            <Button variant="secondary" asChild><Link href="/admin/topics"><Hash className="mr-2 h-4 w-4" /> Topics</Link></Button>
                            <Button variant="secondary" asChild><Link href="/admin/authors"><UserRound className="mr-2 h-4 w-4" /> Authors</Link></Button>
                            <Button variant="secondary" asChild><Link href="/admin/pages"><FileStack className="mr-2 h-4 w-4" /> Pages</Link></Button>
                            <Button variant="secondary" asChild><Link href="/admin/settings"><Users className="mr-2 h-4 w-4" /> Settings</Link></Button>
                            <Button variant="outline" asChild className="col-span-2"><Link href="/"><Eye className="mr-2 h-4 w-4" /> View Public Site</Link></Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

AdminDashboard.layout = undefined;
