import { usePage } from '@inertiajs/react';

import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    const page = usePage();
    const { name } = page.props;
    const siteSettings = (page.props as unknown as { siteSettings?: Record<string, unknown> }).siteSettings as unknown as { site_logo_url?: string; site_name?: string } | undefined;
    const logoUrl = siteSettings?.site_logo_url;

    if (logoUrl) {
        return (
            <>
                <div className="flex aspect-square size-8 items-center justify-center overflow-hidden rounded-md bg-white">
                    <img src={logoUrl} alt={siteSettings?.site_name ?? (name as string)} className="h-8 w-auto object-contain" />
                </div>
                <div className="ml-1 grid flex-1 text-left text-sm">
                    <span className="mb-0.5 truncate leading-tight font-semibold">{(siteSettings?.site_name as string) ?? (name as string)}</span>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <AppLogoIcon className="size-5 fill-current text-white dark:text-black" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    {name}
                </span>
            </div>
        </>
    );
}
