import { getDashboardStats } from '@/actions/dashboard'
import { getSessions } from '@/actions/sessions'
import { getGoalData } from '@/actions/goals'
import { GoalProgress } from '@/components/GoalProgress'
import Link from 'next/link'

export default async function DashboardPage() {
    const [stats, recentSessions, goalData] = await Promise.all([
        getDashboardStats(),
        getSessions(),
        getGoalData(),
    ])

    const latest = recentSessions.slice(0, 4)

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4 pb-24">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">
                    BJJ Tracker
                </h1>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <Link
                        href="/sessions/plan"
                        className="bg-blue-600 text-white font-bold py-4 px-4 rounded-xl shadow-lg active:scale-95 transition-transform text-center"
                    >
                        Plan Session
                    </Link>
                    <Link
                        href="/sessions/new"
                        className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 font-bold py-4 px-4 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 active:scale-95 transition-transform text-center"
                    >
                        + Log Session
                    </Link>
                </div>

                {/* Goal progress */}
                {goalData && <GoalProgress goal={goalData} />}
                {!goalData && (
                    <Link
                        href="/goals"
                        className="block bg-blue-50 dark:bg-blue-950 rounded-xl p-4 border border-blue-200 dark:border-blue-800 mb-4 hover:border-blue-400 transition-colors"
                    >
                        <div className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                            Set a long-term goal →
                        </div>
                        <div className="text-xs text-blue-500 dark:text-blue-400 mt-0.5">
                            Use Danaher's framework: identify problems, set KPIs, track progress
                        </div>
                    </Link>
                )}

                {/* This Week */}
                <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800 mb-4">
                    <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
                        This Week
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                                {stats.thisWeek.sessions}
                            </div>
                            <div className="text-sm text-zinc-600 dark:text-zinc-400">Sessions</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                                {stats.thisWeek.rounds}
                            </div>
                            <div className="text-sm text-zinc-600 dark:text-zinc-400">Rounds</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                {stats.thisWeek.wins}W
                            </div>
                            <div className="text-sm text-zinc-600 dark:text-zinc-400">Wins</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                                {stats.thisWeek.losses}L
                            </div>
                            <div className="text-sm text-zinc-600 dark:text-zinc-400">Losses</div>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-zinc-600 dark:text-zinc-400">Win Rate</span>
                            <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                                {stats.thisWeek.winRate}%
                            </span>
                        </div>
                    </div>
                </div>

                {/* Recent Sessions */}
                {latest.length > 0 && (
                    <div className="bg-white dark:bg-zinc-900 rounded-xl p-5 shadow-sm border border-zinc-200 dark:border-zinc-800 mb-4">
                        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
                            Recent Sessions
                        </h2>
                        <div className="space-y-2">
                            {latest.map((s) => (
                                <Link
                                    key={s.id}
                                    href={`/sessions/${s.id}`}
                                    className="flex items-center justify-between py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 -mx-1 px-1 rounded-lg transition-colors"
                                >
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                                                {new Date(s.date).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                })}
                                            </span>
                                            <span className="text-xs text-zinc-400 dark:text-zinc-500">
                                                {s.classType}
                                            </span>
                                            {s.trainingFocus && (
                                                <span className="text-xs px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium">
                                                    {s.trainingFocus}
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                                            {s.roundCount} rounds · {s.wins}W {s.losses}L
                                            {s.partners.length > 0 &&
                                                ` · ${s.partners.slice(0, 2).join(', ')}${s.partners.length > 2 ? '…' : ''}`}
                                        </div>
                                    </div>
                                    <svg
                                        className="w-4 h-4 text-zinc-300 dark:text-zinc-600"
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
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Overall Stats */}
                <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800 mb-4">
                    <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
                        Overall
                    </h2>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-zinc-600 dark:text-zinc-400">Total Rounds</span>
                            <span className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                                {stats.overall.totalRounds}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-zinc-600 dark:text-zinc-400">Win Rate</span>
                            <span className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                                {stats.overall.winRate}%
                            </span>
                        </div>
                        {stats.overall.topSubFor && (
                            <div className="flex items-center justify-between">
                                <span className="text-zinc-600 dark:text-zinc-400">Top Submission</span>
                                <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                                    {stats.overall.topSubFor.name} ({stats.overall.topSubFor.count}x)
                                </span>
                            </div>
                        )}
                        {stats.overall.topSubAgainst && (
                            <div className="flex items-center justify-between">
                                <span className="text-zinc-600 dark:text-zinc-400">
                                    Most Submitted By
                                </span>
                                <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                                    {stats.overall.topSubAgainst.name} (
                                    {stats.overall.topSubAgainst.count}x)
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Position & Grappling Stats */}
                <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800 mb-4">
                    <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
                        Position & Grappling
                    </h2>
                    <div className="space-y-3">
                        {stats.overall.positionPinnedMost && (
                            <div className="flex items-center justify-between">
                                <span className="text-zinc-600 dark:text-zinc-400">Pinned in most</span>
                                <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                                    {stats.overall.positionPinnedMost.name} (
                                    {stats.overall.positionPinnedMost.count}x)
                                </span>
                            </div>
                        )}
                        {stats.overall.positionBeforeSubbedMost && (
                            <div className="flex items-center justify-between">
                                <span className="text-zinc-600 dark:text-zinc-400">
                                    Position before subbed (most)
                                </span>
                                <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                                    {stats.overall.positionBeforeSubbedMost.name} (
                                    {stats.overall.positionBeforeSubbedMost.count}x)
                                </span>
                            </div>
                        )}
                        <div className="flex items-center justify-between">
                            <span className="text-zinc-600 dark:text-zinc-400">Passes (from top)</span>
                            <span className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                                {stats.overall.guardPasses}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-zinc-600 dark:text-zinc-400">
                                Times passed (from bottom)
                            </span>
                            <span className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                                {stats.overall.timesPassed}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-zinc-600 dark:text-zinc-400">Sweeps</span>
                            <span className="text-xl font-bold text-green-600 dark:text-green-400">
                                {stats.overall.sweeps}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Toughest Partner */}
                {stats.toughestPartner && (
                    <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800">
                        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
                            Toughest Partner
                        </h2>
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-semibold text-zinc-900 dark:text-zinc-50">
                                    {stats.toughestPartner.name}
                                </div>
                                <div className="text-sm text-zinc-600 dark:text-zinc-400">
                                    {stats.toughestPartner.totalRounds} rounds
                                </div>
                            </div>
                            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                                {stats.toughestPartner.winRate}%
                            </div>
                        </div>
                    </div>
                )}

                {stats.overall.totalRounds === 0 && (
                    <div className="text-center py-12 text-zinc-500 dark:text-zinc-400">
                        <p className="mb-4">No sessions logged yet!</p>
                        <p className="text-sm">
                            Click "Plan Session" above to set your goals, or "Log Session" to record
                            your first training session.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
