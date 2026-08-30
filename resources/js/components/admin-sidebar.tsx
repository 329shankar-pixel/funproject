import { Link } from '@inertiajs/react';
import {
    LayoutDashboard,
    FileText,
    Tag,
    Hash,
    Users,
    UserRound,
    Settings,
    FileStack,
    Globe,
    Search,
    DollarSign,
    Link2,
    Share2,
    Navigation,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarGroup,
    SidebarGroupLabel,
} from '@/components/ui/sidebar';
import type { NavItem } from '@/types';
import { useCurrentUrl } from '@/hooks/use-current-url';

const adminNavGroups: { label: string; items: NavItem[] }[] = [
    {
        label: 'Overview',
        items: [{ title: 'Dashboard', href: '/admin', icon: LayoutDashboard }],
    },
    {
        label: 'Content',
        items: [
            { title: 'Articles', href: '/admin/articles', icon: FileText },
            { title: 'Pages', href: '/admin/pages', icon: FileStack },
        ],
    },
    {
        label: 'Organization',
        items: [
            { title: 'Categories', href: '/admin/categories', icon: Tag },
            { title: 'Topics', href: '/admin/topics', icon: Hash },
        ],
    },
    {
        label: 'Users & Roles',
        items: [
            { title: 'Authors', href: '/admin/authors', icon: UserRound },
            { title: 'Users', href: '/admin/users', icon: Users },
        ],
    },
    {
        label: 'SEO & Monetization',
        items: [
            { title: 'SEO & Ads', href: '/admin/seo', icon: Search },
            { title: 'Monetization', href: '/admin/seo?tab=monetization', icon: DollarSign },
            { title: 'Social Media', href: '/admin/social', icon: Share2 },
        ],
    },
    {
        label: 'Navigation',
        items: [
            { title: 'All Links', href: '/admin/navigation', icon: Navigation },
            { title: 'Add Link', href: '/admin/navigation/create', icon: Link2 },
        ],
    },
    {
        label: 'System',
        items: [
            { title: 'Site Settings', href: '/admin/settings', icon: Settings },
            { title: 'View Site', href: '/', icon: Globe },
        ],
    },
];

function AdminNavGroup({ label, items }: { label: string; items: NavItem[] }) {
    const { isCurrentUrl } = useCurrentUrl();
    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>{label}</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={isCurrentUrl(item.href as string)} tooltip={{ children: item.title }}>
                            <Link href={item.href as string} prefetch>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}

export function AdminSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/admin" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {adminNavGroups.map((group) => (
                    <AdminNavGroup key={group.label} label={group.label} items={group.items} />
                ))}
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
