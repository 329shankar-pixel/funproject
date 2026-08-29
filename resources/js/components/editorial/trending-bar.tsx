import { Link } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";

interface Topic {
    id: number;
    name: string;
    slug: string;
}

interface TrendingBarProps {
    topics: Topic[];
}

export function TrendingBar({ topics }: TrendingBarProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el || topics.length === 0) return;

        let animationId: number;
        let scrollPos = 0;
        const speed = 0.5;

        const animate = () => {
            if (!isPaused && el) {
                scrollPos += speed;
                if (scrollPos >= el.scrollWidth / 2) {
                    scrollPos = 0;
                }
                el.scrollLeft = scrollPos;
            }
            animationId = requestAnimationFrame(animate);
        };

        animationId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationId);
    }, [topics, isPaused]);

    if (!topics || topics.length === 0) return null;

    // Duplicate topics for seamless loop
    const displayTopics = [...topics, ...topics];

    return (
        <div
            className="border-b border-border bg-background overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5 sm:px-6 lg:px-8">
                <span className="flex-shrink-0 text-xs font-bold uppercase tracking-wider text-foreground">
                    Trending
                </span>
                <span className="text-muted-foreground">·</span>
                <div
                    ref={scrollRef}
                    className="flex flex-nowrap items-center gap-x-3 gap-y-1 overflow-hidden whitespace-nowrap"
                    style={{ scrollBehavior: "auto" }}
                >
                    {displayTopics.map((topic, index) => (
                        <span key={`${topic.id}-${index}`} className="flex items-center gap-3 flex-shrink-0">
                            <Link
                                href={`/topic/${topic.slug}`}
                                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {topic.name}
                            </Link>
                            <span className="text-muted-foreground">·</span>
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
