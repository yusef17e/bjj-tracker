'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
    {
        href: '/dashboard',
        label: 'Home',
        icon: (
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
        ),
    },
    {
        href: '/sessions/plan',
        label: 'Plan',
        icon: (
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
            />
        ),
    },
    {
        href: '/sessions/new',
        label: 'Log',
        icon: (
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
            />
        ),
    },
    {
        href: '/goals',
        label: 'Goals',
        icon: (
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
            />
        ),
    },
    {
        href: '/partners',
        label: 'Partners',
        icon: (
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
            />
        ),
    },
]

function isActive(href: string, pathname: string): boolean {
    if (href === '/dashboard') return pathname === '/dashboard' || pathname === '/'
    if (href === '/sessions/plan') return pathname === '/sessions/plan'
    if (href === '/goals') return pathname === '/goals'
    if (href === '/sessions/new') return pathname === '/sessions/new'
    return pathname === href || pathname.startsWith(href + '/')
}

export function BottomNav() {
    const pathname = usePathname()

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 safe-area-pb">
            <div className="flex items-center justify-around max-w-2xl mx-auto h-16">
                {NAV_ITEMS.map((item) => {
                    const active = isActive(item.href, pathname)
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors"
                        >
                            <svg
                                className={`w-6 h-6 ${active ? 'text-blue-500' : 'text-zinc-400 dark:text-zinc-500'}`}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={active ? 2.5 : 2}
                                viewBox="0 0 24 24"
                            >
                                {item.icon}
                            </svg>
                            <span
                                className={`text-xs font-medium ${
                                    active
                                        ? 'text-blue-500'
                                        : 'text-zinc-500 dark:text-zinc-400'
                                }`}
                            >
                                {item.label}
                            </span>
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}
