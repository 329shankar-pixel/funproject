import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard } from '@/routes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { SiteSettings } from '@/types/global';
import {
    FileText,
    Eye,
    Users,
    Tag,
    LayoutGrid,
    Clock,
    TrendingUp,
    AlertCircle,
    BookOpen,
    File,
    ExternalLink,
    Settings,
    ArrowUpRight,
    Hash,
} from 'lucide-react';

interface Stats {
    totalArticles: number;
    publishedArticles: number;
    draftArticles: number;
    pendingArticles: number;
    totalCategories: number;
    activeCategories: number;
    totalTopics: number;
    totalAuthors: number;
    totalPages: number;
    publishedPages: number;
    totalUsers: number;
    activeUsers: number;
    pendingComments: number;
    totalViews: number;
}

interface Article {
    id: number;
    title: string;
    slug: string;
    status?: string;
    view_count?: number;
    published_at?: string | null;
    created_at?: string;
    category?: { id: number; name: string; slug: string } | null;
    author?: { id: number; name: string; username?: string } | null;
}

interface Category {
    id: number;
    name: string;
    slug: string;
    color?: string | null;
    is_active?: boolean;
    articles_count?: number;
    published_count?: number;
}

interface PageItem {
    id: number;
    title: string;
    slug: string;
    status: string;
    show_in_footer: boolean;
    updated_at: string;
}

interface DashboardProps {
    stats: Stats;
    recentArticles: Article[];
    trendingArticles: Article[];
    pendingReview: Article[];
    topCategories: Category[];
    recentPages: PageItem[];
    categoryBreakdown: Category[];
}

function StatCard({
    title,
    value,
    description,
    icon: Icon,
    trend,
}: {
    title: string;
    value: string | number;
    description: string;
    icon: React.ElementType;
    trend?: string;
}) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{typeof value === 'number' ? value.toLocaleString() : value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                    {trend && <span className="text-emerald-600 font-medium">{trend} </span>}
                    {description}
                </p>
            </CardContent>
        </Card>
    );
}

export default function Dashboard({
    stats,
    recentArticles,
    trendingArticles,
    pendingReview,
    topCategories,
    recentPages,
    categoryBreakdown,
}: DashboardProps) {
    const page = usePage();
    const siteSettings = (page.props as unknown as { siteSettings?: SiteSettings }).siteSettings;
    const siteName = siteSettings?.site_name ?? 'Editorial';
    const authUser = (page.props as unknown as { auth: { user: { name: string; email: string } } }).auth.user;

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 max-w-7xl mx-auto w-full">
                {/* Welcome Header */}
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Welcome back, {authUser?.name?.split(' ')[0] ?? 'Editor'}</h1>
                        <p className="text-sm text-muted-foreground">
                            Here is what is happening with <span className="font-medium text-foreground">{siteName}</span> today.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/" className="gap-2">
                                <ExternalLink className="h-4 w-4" /> View Site
                            </Link>
                        </Button>
                        <Button size="sm" asChild className="gap-2">
                            <Link href="/admin">
                                <Settings className="h-4 w-4" /> Admin Panel
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Primary Stats */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Total Articles"
                        value={stats.totalArticles}
                        description={`${stats.publishedArticles} published`}
                        icon={FileText}
                        trend={`${stats.publishedArticles} pub`}
                    />
                    <StatCard
                        title="Total Views"
                        value={stats.totalViews}
                        description="Across all articles"
                        icon={Eye}
                    />
                    <StatCard
                        title="Categories"
                        value={`${stats.activeCategories} / ${stats.totalCategories}`}
                        description={`${stats.totalTopics} topics`}
                        icon={LayoutGrid}
                    />
                    <StatCard
                        title="Users & Authors"
                        value={stats.totalUsers}
                        description={`${stats.activeUsers} active • ${stats.totalAuthors} authors`}
                        icon={Users}
                    />
                </div>

                {/* Secondary Stats */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-900">
                        <CardHeader className="pb-2">
                            <CardDescription className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                                <Clock className="h-4 w-4" /> Pending Review
                            </CardDescription>
                            <CardTitle className="text-2xl text-amber-700 dark:text-amber-300">{stats.pendingArticles}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-xs text-amber-700/80 dark:text-amber-400/80">Articles awaiting approval</CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription className="flex items-center gap-2">
                                <File className="h-4 w-4" /> Drafts
                            </CardDescription>
                            <CardTitle className="text-2xl">{stats.draftArticles}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-xs text-muted-foreground">Unpublished drafts</CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription className="flex items-center gap-2">
                                <BookOpen className="h-4 w-4" /> Pages
                            </CardDescription>
                            <CardTitle className="text-2xl">
                                {stats.publishedPages} / {stats.totalPages}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-xs text-muted-foreground">Published pages</CardContent>
                    </Card>
                    <Card className={stats.pendingComments > 0 ? 'border-red-200 bg-red-50/50 dark:bg-red-950/20 dark:border-red-900' : ''}>
                        <CardHeader className="pb-2">
                            <CardDescription className={`flex items-center gap-2 ${stats.pendingComments > 0 ? 'text-red-700 dark:text-red-400' : ''}`}>
                                <AlertCircle className="h-4 w-4" /> Comments
                            </CardDescription>
                            <CardTitle className={`text-2xl ${stats.pendingComments > 0 ? 'text-red-700 dark:text-red-300' : ''}`}>
                                {stats.pendingComments}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-xs text-muted-foreground">Pending moderation</CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Recent Articles */}
                    <Card className="lg:col-span-2">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" /> Recent Articles
                                </CardTitle>
                                <CardDescription>Latest content created</CardDescription>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/admin/articles">Manage</Link>
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-0">
                            {recentArticles.length === 0 ? (
                                <p className="text-sm text-muted-foreground py-8 text-center">No articles yet. Create your first article in admin.</p>
                            ) : (
                                <div className="divide-y">
                                    {recentArticles.map((article) => (
                                        <div key={article.id} className="flex items-center justify-between py-3 gap-4">
                                            <div className="min-w-0 flex-1">
                                                <Link
                                                    href={`/article/${article.slug}`}
                                                    className="text-sm font-medium hover:underline line-clamp-1"
                                                >
                                                    {article.title}
                                                </Link>
                                                <div className="flex items-center gap-2 mt-1">
                                                    {article.category && (
                                                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                                            {article.category.name}
                                                        </Badge>
                                                    )}
                                                    {article.status && (
                                                        <Badge
                                                            variant={
                                                                article.status === 'published'
                                                                    ? 'default'
                                                                    : article.status === 'draft'
                                                                      ? 'secondary'
                                                                      : 'outline'
                                                            }
                                                            className="text-[10px] capitalize"
                                                        >
                                                            {article.status}
                                                        </Badge>
                                                    )}
                                                    <span className="text-xs text-muted-foreground hidden sm:inline">
                                                        {article.author?.name}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <div className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                                                    <Eye className="h-3 w-3" /> {article.view_count ?? 0}
                                                </div>
                                                <div className="text-[11px] text-muted-foreground">
                                                    {article.created_at ? new Date(article.created_at).toLocaleDateString() : ''}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <Separator className="mt-4" />
                            <div className="pt-3 flex justify-between items-center">
                                <span className="text-xs text-muted-foreground">{stats.totalArticles} total articles</span>
                                <Link href="/admin/articles" className="text-xs font-medium hover:underline flex items-center gap-1">
                                    View all <ArrowUpRight className="h-3 w-3" />
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Trending & Pending */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <TrendingUp className="h-4 w-4 text-emerald-600" /> Trending Now
                                </CardTitle>
                                <CardDescription>Most viewed published articles</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {trendingArticles.length === 0 ? (
                                    <p className="text-sm text-muted-foreground py-4 text-center">No trending articles</p>
                                ) : (
                                    <div className="space-y-3">
                                        {trendingArticles.map((a, idx) => (
                                            <Link
                                                key={a.id}
                                                href={`/article/${a.slug}`}
                                                className="flex gap-3 group"
                                            >
                                                <span className="text-lg font-bold text-muted-foreground/40 group-hover:text-foreground">0{idx + 1}</span>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium line-clamp-2 group-hover:underline leading-tight">{a.title}</p>
                                                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                                                        {a.category?.name && <span>{a.category.name} ·</span>}
                                                        <span className="flex items-center gap-1">
                                                            <Eye className="h-3 w-3" /> {a.view_count?.toLocaleString()}
                                                        </span>
                                                    </p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="border-amber-100">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <Clock className="h-4 w-4 text-amber-600" /> Needs Review
                                </CardTitle>
                                <CardDescription>Pending approval</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {pendingReview.length === 0 ? (
                                    <p className="text-sm text-muted-foreground py-2">No pending articles 🎉</p>
                                ) : (
                                    <div className="space-y-2">
                                        {pendingReview.map((a) => (
                                            <Link
                                                key={a.id}
                                                href={`/admin/articles/${a.id}/edit`}
                                                className="block rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                                            >
                                                <p className="text-sm font-medium line-clamp-1">{a.title}</p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {a.category?.name} · {a.author?.name}
                                                </p>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                                {pendingReview.length > 0 && (
                                    <Button variant="outline" size="sm" className="w-full mt-3" asChild>
                                        <Link href="/admin/articles?tableFilters[status][value]=in_review">Review all</Link>
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Categories */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Tag className="h-5 w-5" /> Categories
                                </CardTitle>
                                <CardDescription>Content organization</CardDescription>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/admin/categories">Manage</Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {topCategories.map((cat) => (
                                    <div key={cat.id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span
                                                className="h-3 w-3 rounded-full shrink-0"
                                                style={{ backgroundColor: cat.color ?? '#6366f1' }}
                                            />
                                            <Link href={`/category/${cat.slug}`} className="text-sm font-medium hover:underline">
                                                {cat.name}
                                            </Link>
                                            {!cat.is_active && <Badge variant="outline" className="text-[10px]">Inactive</Badge>}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold">{cat.articles_count}</span>
                                            <span className="text-xs text-muted-foreground">articles</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Separator className="my-4" />
                            <div className="grid grid-cols-2 gap-2">
                                {categoryBreakdown.slice(0, 4).map((c) => (
                                    <div key={c.id} className="rounded-lg border p-3">
                                        <div className="text-xs text-muted-foreground">{c.name}</div>
                                        <div className="text-lg font-bold">{c.published_count}</div>
                                        <div className="text-[11px] text-muted-foreground">published</div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pages & Quick Links */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <BookOpen className="h-5 w-5" /> Pages (CMS)
                                </CardTitle>
                                <CardDescription>All site content is dynamic</CardDescription>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/admin/pages">Manage</Link>
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                {recentPages.map((p) => (
                                    <div key={p.id} className="flex items-center justify-between py-2 border-b last:border-0">
                                        <div>
                                            <Link href={`/page/${p.slug}`} className="text-sm font-medium hover:underline">
                                                {p.title}
                                            </Link>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge variant={p.status === 'published' ? 'default' : 'secondary'} className="text-[10px] capitalize">
                                                    {p.status}
                                                </Badge>
                                                {p.show_in_footer && <Badge variant="outline" className="text-[10px]">Footer</Badge>}
                                            </div>
                                        </div>
                                        <span className="text-xs text-muted-foreground">{new Date(p.updated_at).toLocaleDateString()}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="rounded-lg bg-muted p-4 space-y-3">
                                <h4 className="text-sm font-semibold flex items-center gap-2">
                                    <Hash className="h-4 w-4" /> Quick Actions
                                </h4>
                                <div className="grid grid-cols-2 gap-2">
                                    <Button variant="secondary" size="sm" asChild>
                                        <Link href="/admin/articles/create">New Article</Link>
                                    </Button>
                                    <Button variant="secondary" size="sm" asChild>
                                        <Link href="/admin/categories/create">New Category</Link>
                                    </Button>
                                    <Button variant="secondary" size="sm" asChild>
                                        <Link href="/admin/authors/create">New Author</Link>
                                    </Button>
                                    <Button variant="secondary" size="sm" asChild>
                                        <Link href="/admin/manage-site-settings">Site Settings</Link>
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Everything on the public site comes from the admin panel. Update <Link href="/admin/manage-site-settings" className="underline">Site Settings</Link> to change header, footer and search terms instantly.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="bg-primary text-primary-foreground">
                    <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <div>
                                <h3 className="font-semibold">All data is dynamic</h3>
                                <p className="text-sm opacity-80 mt-1">
                                    Articles, categories, topics, authors, pages and site settings are managed at <code className="bg-white/20 px-1 rounded">/admin</code>. Changes appear instantly on the public site via cached Inertia shared props.
                                </p>
                            </div>
                            <Button variant="secondary" size="sm" asChild className="shrink-0">
                                <Link href="/admin">Open Admin Panel →</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
