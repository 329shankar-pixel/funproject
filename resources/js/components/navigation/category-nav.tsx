import { Link } from "@inertiajs/react";

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface CategoryNavProps {
    categories: Category[];
}

export function CategoryNav({ categories }: CategoryNavProps) {
    return (
        <nav className="border-b border-border bg-background">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-6 overflow-x-auto py-3 scrollbar-hide">
                    <Link
                        href="/"
                        className="flex-shrink-0 text-sm font-semibold text-foreground hover:text-muted-foreground transition-colors"
                    >
                        Home
                    </Link>
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            href={`/category/${category.slug}`}
                            className="flex-shrink-0 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {category.name}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
}
