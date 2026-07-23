import { type GoalData } from '@/actions/goals'
import Link from 'next/link'

interface Props {
    goal: GoalData
}

export function GoalProgress({ goal }: Props) {
    const sorted = [...goal.problems].sort((a, b) => a.overallProgress - b.overallProgress)
    const shown = sorted.slice(0, 3)

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-5 shadow-sm border border-zinc-200 dark:border-zinc-800 mb-4">
            <div className="flex items-start justify-between mb-3">
                <div>
                    <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50 leading-tight">
                        {goal.title}
                    </h2>
                    {goal.daysRemaining !== null && (
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                            {goal.daysRemaining === 0 ? 'Today!' : `${goal.daysRemaining} days remaining`}
                        </p>
                    )}
                </div>
                <Link
                    href="/goals"
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline shrink-0"
                >
                    Manage →
                </Link>
            </div>

            {shown.length === 0 ? (
                <Link href="/goals" className="block text-sm text-zinc-500 dark:text-zinc-400 hover:underline">
                    Add problems and KPIs to track progress →
                </Link>
            ) : (
                <div className="space-y-3">
                    {shown.map((problem) => {
                        const pct = problem.overallProgress
                        const barColor =
                            pct >= 80
                                ? 'bg-green-500'
                                : pct >= 50
                                  ? 'bg-amber-500'
                                  : 'bg-red-500'
                        const neglected =
                            problem.trainingFocus && problem.recentSessionCount === 0

                        return (
                            <div key={problem.id}>
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm text-zinc-700 dark:text-zinc-300 leading-tight line-clamp-1">
                                        {problem.description}
                                    </span>
                                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                                        {neglected && (
                                            <span className="text-xs text-red-500">⚠</span>
                                        )}
                                        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                                            {pct}%
                                        </span>
                                    </div>
                                </div>
                                <div className="bg-zinc-200 dark:bg-zinc-700 rounded-full h-1.5 overflow-hidden">
                                    <div
                                        className={`h-1.5 rounded-full transition-all ${barColor}`}
                                        style={{ width: `${pct}%` }}
                                    />
                                </div>
                                {problem.kpis.length > 0 && (
                                    <div className="flex flex-wrap gap-x-3 mt-1">
                                        {problem.kpis.slice(0, 2).map((kpi) => (
                                            <span
                                                key={kpi.id}
                                                className="text-xs text-zinc-400 dark:text-zinc-500"
                                            >
                                                {kpi.label}: {kpi.actual.toFixed(kpi.actual % 1 === 0 ? 0 : 1)} / {kpi.target}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
