import { getPartner } from '@/actions/partners'
import { EditPartnerProfile } from './EditPartnerProfile'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { formatTechniqueList, formatPositionSequence } from '@/lib/utils'

const SIZE_LABELS: Record<string, string> = {
    lighter: 'Lighter',
    similar: 'Similar size',
    heavier: 'Heavier',
}

const STYLE_LABELS: Record<string, string> = {
    flexible: 'Flexible',
    strong: 'Strong',
    explosive: 'Explosive',
    defensive: 'Defensive',
}

const RETENTION_LABELS: Record<string, string> = {
    weak: 'Weak guard retention',
    moderate: 'Moderate retention',
    strong: 'Strong guard retention',
}

export default async function PartnerDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const partner = await getPartner(id)

    if (!partner) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4 pb-24">
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <Link
                        href="/partners"
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                        ← Partners
                    </Link>
                </div>

                {/* Stats card */}
                <div className="bg-white dark:bg-zinc-900 rounded-xl p-5 shadow-sm border border-zinc-200 dark:border-zinc-800 mb-4">
                    <div className="flex items-start gap-3 mb-4">
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                                {partner.name}
                            </h1>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                                {partner.belt && (
                                    <span className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-sm font-medium">
                                        {partner.belt}
                                    </span>
                                )}
                                {partner.size && (
                                    <span className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs">
                                        {SIZE_LABELS[partner.size]}
                                    </span>
                                )}
                                {partner.physicalStyle && (
                                    <span className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs">
                                        {STYLE_LABELS[partner.physicalStyle]}
                                    </span>
                                )}
                                {partner.guardRetention && (
                                    <span className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs">
                                        {RETENTION_LABELS[partner.guardRetention]}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4">
                            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                                {partner.totalRounds}
                            </div>
                            <div className="text-sm text-zinc-600 dark:text-zinc-400">
                                Total Rounds
                            </div>
                        </div>
                        <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4">
                            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                                {partner.winRate}%
                            </div>
                            <div className="text-sm text-zinc-600 dark:text-zinc-400">Win Rate</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center">
                            <div className="text-xl font-semibold text-green-600 dark:text-green-400">
                                {partner.wins}
                            </div>
                            <div className="text-xs text-zinc-600 dark:text-zinc-400">Wins</div>
                        </div>
                        <div className="text-center">
                            <div className="text-xl font-semibold text-red-600 dark:text-red-400">
                                {partner.losses}
                            </div>
                            <div className="text-xs text-zinc-600 dark:text-zinc-400">Losses</div>
                        </div>
                        <div className="text-center">
                            <div className="text-xl font-semibold text-zinc-600 dark:text-zinc-400">
                                {partner.draws}
                            </div>
                            <div className="text-xs text-zinc-600 dark:text-zinc-400">Draws</div>
                        </div>
                    </div>

                    {partner.lastRolled && (
                        <div className="text-sm text-zinc-500 dark:text-zinc-400">
                            Last rolled:{' '}
                            {new Date(partner.lastRolled).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                            })}
                        </div>
                    )}
                </div>

                {/* Edit profile */}
                <EditPartnerProfile
                    partnerId={partner.id}
                    currentBelt={partner.belt}
                    currentSize={partner.size}
                    currentStyle={partner.physicalStyle}
                    currentRetention={partner.guardRetention}
                />

                {/* Round history */}
                <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
                    Round History
                </h2>
                <div className="space-y-2">
                    {partner.rounds.length === 0 ? (
                        <div className="text-center py-8 text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                            <p>No rounds recorded yet</p>
                        </div>
                    ) : (
                        partner.rounds.map((round) => (
                            <div
                                key={round.id}
                                className="bg-white dark:bg-zinc-900 rounded-lg p-4 shadow-sm border border-zinc-200 dark:border-zinc-800"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-zinc-600 dark:text-zinc-400">
                                        {new Date(round.session.date).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                        })}
                                    </span>
                                    <span
                                        className={`text-sm font-semibold px-2 py-1 rounded ${
                                            round.result === 'Win'
                                                ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                                                : round.result === 'Loss'
                                                  ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                                                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                                        }`}
                                    >
                                        {round.result}
                                    </span>
                                </div>
                                {round.submissionFor && (
                                    <div className="text-sm text-zinc-600 dark:text-zinc-400">
                                        ✓ Submitted with: {round.submissionFor}
                                    </div>
                                )}
                                {round.submissionAgainst && (
                                    <div className="text-sm text-zinc-600 dark:text-zinc-400">
                                        ✗ Submitted by: {round.submissionAgainst}
                                    </div>
                                )}
                                {round.duration != null && round.duration > 0 && (
                                    <div className="text-sm text-zinc-600 dark:text-zinc-400">
                                        Duration: {round.duration} min
                                    </div>
                                )}
                                {round.positionPinned && (
                                    <div className="text-sm text-zinc-600 dark:text-zinc-400">
                                        Pinned in: {round.positionPinned}
                                    </div>
                                )}
                                {round.positionBeforeSubbed && (
                                    <div className="text-sm text-zinc-600 dark:text-zinc-400">
                                        Position sequence:{' '}
                                        {formatPositionSequence(round.positionBeforeSubbed)}
                                    </div>
                                )}
                                {round.passFromTop && (
                                    <div className="text-sm text-zinc-600 dark:text-zinc-400">
                                        Pass from top: {formatTechniqueList(round.passFromTop)}
                                    </div>
                                )}
                                {round.guardPassedBottom && (
                                    <div className="text-sm text-zinc-600 dark:text-zinc-400">
                                        Guard passed: {formatTechniqueList(round.guardPassedBottom)}
                                    </div>
                                )}
                                {round.sweepMain && (
                                    <div className="text-sm text-zinc-600 dark:text-zinc-400">
                                        Sweep: {formatTechniqueList(round.sweepMain)}
                                    </div>
                                )}
                                {((round.guardPasses ?? 0) > 0 ||
                                    (round.timesPassed ?? 0) > 0 ||
                                    (round.sweeps ?? 0) > 0) && (
                                    <div className="flex flex-wrap gap-x-4 gap-y-0 text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                                        {(round.guardPasses ?? 0) > 0 && (
                                            <span>Passes: {round.guardPasses}</span>
                                        )}
                                        {(round.timesPassed ?? 0) > 0 && (
                                            <span>Times passed: {round.timesPassed}</span>
                                        )}
                                        {(round.sweeps ?? 0) > 0 && (
                                            <span>Sweeps: {round.sweeps}</span>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
