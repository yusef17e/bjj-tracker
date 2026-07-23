import { getSession } from '@/actions/sessions'
import { GoalAdvisor } from '@/components/GoalAdvisor'
import { formatTechniqueList, formatPositionSequence } from '@/lib/utils'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function SessionDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const session = await getSession(id)
    if (!session) notFound()

    const wins = session.rounds.filter((r) => r.result === 'Win').length
    const losses = session.rounds.filter((r) => r.result === 'Loss').length
    const draws = session.rounds.filter((r) => r.result === 'Draw').length

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4 pb-24">
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <Link
                        href="/dashboard"
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                        ← Dashboard
                    </Link>
                </div>

                {/* Session header */}
                <div className="bg-white dark:bg-zinc-900 rounded-xl p-5 shadow-sm border border-zinc-200 dark:border-zinc-800 mb-4">
                    <div className="flex items-start justify-between mb-3">
                        <div>
                            <div className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                                {new Date(session.date).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric',
                                })}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                                    {session.classType}
                                </span>
                                {session.trainingFocus && (
                                    <>
                                        <span className="text-zinc-300 dark:text-zinc-700">·</span>
                                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                            {session.trainingFocus}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Round summary */}
                    <div className="grid grid-cols-4 gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                        <div className="text-center">
                            <div className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                                {session.rounds.length}
                            </div>
                            <div className="text-xs text-zinc-500 dark:text-zinc-400">Rounds</div>
                        </div>
                        <div className="text-center">
                            <div className="text-xl font-bold text-green-600 dark:text-green-400">
                                {wins}
                            </div>
                            <div className="text-xs text-zinc-500 dark:text-zinc-400">Wins</div>
                        </div>
                        <div className="text-center">
                            <div className="text-xl font-bold text-red-600 dark:text-red-400">
                                {losses}
                            </div>
                            <div className="text-xs text-zinc-500 dark:text-zinc-400">Losses</div>
                        </div>
                        <div className="text-center">
                            <div className="text-xl font-bold text-zinc-600 dark:text-zinc-400">
                                {draws}
                            </div>
                            <div className="text-xs text-zinc-500 dark:text-zinc-400">Draws</div>
                        </div>
                    </div>

                    {session.notes && (
                        <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                            <p className="text-sm text-zinc-600 dark:text-zinc-400 italic">
                                {session.notes}
                            </p>
                        </div>
                    )}
                </div>

                {/* Goal review */}
                {session.trainingFocus && session.rounds.length > 0 && (
                    <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-sm border border-zinc-200 dark:border-zinc-800 mb-4">
                        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
                            Session Goals — {session.trainingFocus}
                        </h2>
                        <GoalAdvisor
                            focus={session.trainingFocus}
                            compact={true}
                        />
                    </div>
                )}

                {/* Rounds */}
                <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
                    Rounds ({session.rounds.length})
                </h2>
                <div className="space-y-3">
                    {session.rounds.map((round, index) => (
                        <div
                            key={round.id}
                            className="bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-sm border border-zinc-200 dark:border-zinc-800"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500">
                                        Round {index + 1}
                                    </span>
                                    <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                                        {round.partner.name}
                                    </span>
                                    {round.partner.belt && (
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                                            {round.partner.belt}
                                        </span>
                                    )}
                                </div>
                                <span
                                    className={`text-sm font-semibold px-2 py-1 rounded ${
                                        round.result === 'Win'
                                            ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                                            : round.result === 'Loss'
                                              ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                                              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                                    }`}
                                >
                                    {round.result}
                                </span>
                            </div>

                            <div className="space-y-1">
                                {round.duration != null && round.duration > 0 && (
                                    <div className="text-sm text-zinc-500 dark:text-zinc-400">
                                        {round.duration} min
                                    </div>
                                )}
                                {round.submissionFor && (
                                    <div className="text-sm text-green-700 dark:text-green-400">
                                        ✓ {round.submissionFor}
                                    </div>
                                )}
                                {round.submissionAgainst && (
                                    <div className="text-sm text-red-700 dark:text-red-400">
                                        ✗ {round.submissionAgainst}
                                    </div>
                                )}
                                {round.positionPinned && (
                                    <div className="text-sm text-zinc-600 dark:text-zinc-400">
                                        Pinned in: {round.positionPinned}
                                    </div>
                                )}
                                {round.positionBeforeSubbed && (
                                    <div className="text-sm text-zinc-600 dark:text-zinc-400">
                                        Before sub: {formatPositionSequence(round.positionBeforeSubbed)}
                                    </div>
                                )}
                                {round.passFromTop && (
                                    <div className="text-sm text-zinc-600 dark:text-zinc-400">
                                        Passes: {formatTechniqueList(round.passFromTop)}
                                    </div>
                                )}
                                {round.guardPassedBottom && (
                                    <div className="text-sm text-zinc-600 dark:text-zinc-400">
                                        Guard passed: {formatTechniqueList(round.guardPassedBottom)}
                                    </div>
                                )}
                                {round.sweepMain && (
                                    <div className="text-sm text-zinc-600 dark:text-zinc-400">
                                        Sweeps: {formatTechniqueList(round.sweepMain)}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
