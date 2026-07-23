import { getPartners } from '@/actions/partners'
import Link from 'next/link'
import { AddPartnerForm } from '@/components/AddPartnerForm'

export default async function PartnersPage() {
    const partners = await getPartners()

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4 pb-20">
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                        Partners
                    </h1>
                    <Link
                        href="/dashboard"
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                        ← Dashboard
                    </Link>
                </div>

                <AddPartnerForm />

                <div className="mt-6 space-y-3">
                    {partners.length === 0 ? (
                        <div className="text-center py-12 text-zinc-500 dark:text-zinc-400">
                            <p>No partners yet. Add your first training partner above!</p>
                        </div>
                    ) : (
                        partners.map((partner) => (
                            <Link
                                key={partner.id}
                                href={`/partners/${partner.id}`}
                                className="block bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-sm border border-zinc-200 dark:border-zinc-800 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                                                {partner.name}
                                            </h3>
                                            {partner.belt && (
                                                <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                                                    {partner.belt}
                                                </span>
                                            )}
                                        </div>
                                        <div className="mt-1 flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                                            <span>{partner.totalRounds} rounds</span>
                                            <span>•</span>
                                            <span>{partner.winRate}% win rate</span>
                                        </div>
                                    </div>
                                    <svg
                                        className="w-5 h-5 text-zinc-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
