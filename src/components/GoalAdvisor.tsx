import { getObjectiveSet } from '@/data/objectives'
import { getFlowchartsByPosition } from '@/data/flowcharts'
import Link from 'next/link'

interface GoalAdvisorProps {
    focus: string
    partnerName?: string
    partnerSize?: string | null
    partnerStyle?: string | null
    partnerGuardRetention?: string | null
    partnerBelt?: string | null
    compact?: boolean
}

const SIZE_LABELS: Record<string, string> = {
    lighter: 'Lighter than you',
    similar: 'Similar size',
    heavier: 'Heavier than you',
}

const STYLE_LABELS: Record<string, string> = {
    flexible: 'Flexible',
    strong: 'Strong',
    explosive: 'Explosive',
    defensive: 'Defensive',
}

const RETENTION_LABELS: Record<string, string> = {
    weak: 'Weak guard retention',
    moderate: 'Moderate guard retention',
    strong: 'Strong guard retention',
}

const BELT_COLORS: Record<string, string> = {
    White: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300',
    Blue: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
    Purple: 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300',
    Brown: 'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300',
    Black: 'bg-zinc-800 dark:bg-zinc-950 text-zinc-100',
}

export function GoalAdvisor({
    focus,
    partnerName,
    partnerSize,
    partnerStyle,
    partnerGuardRetention,
    partnerBelt,
    compact = false,
}: GoalAdvisorProps) {
    const result = getObjectiveSet(focus, partnerSize, partnerStyle, partnerGuardRetention)
    const relatedCharts = getFlowchartsByPosition(focus)

    const profileTags = [
        partnerBelt
            ? { label: partnerBelt, className: BELT_COLORS[partnerBelt] ?? BELT_COLORS['White'] }
            : null,
        partnerSize
            ? { label: SIZE_LABELS[partnerSize], className: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400' }
            : null,
        partnerStyle
            ? { label: STYLE_LABELS[partnerStyle], className: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400' }
            : null,
        partnerGuardRetention
            ? { label: RETENTION_LABELS[partnerGuardRetention], className: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400' }
            : null,
    ].filter(Boolean) as { label: string; className: string }[]

    return (
        <div className="space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
                <div>
                    <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                        Focus: {focus}
                        {partnerName && (
                            <span className="font-normal text-zinc-500 dark:text-zinc-400">
                                {' '}vs {partnerName}
                            </span>
                        )}
                    </div>
                    {profileTags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                            {profileTags.map((tag) => (
                                <span
                                    key={tag.label}
                                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${tag.className}`}
                                >
                                    {tag.label}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Principle */}
            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg px-4 py-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400 mb-1">
                    Key Principle
                </div>
                <p className="text-sm text-blue-900 dark:text-blue-100 font-medium leading-snug">
                    {result.principle}
                </p>
            </div>

            {/* Objectives */}
            <div className="space-y-2">
                <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                    Session Objectives
                </div>
                {result.objectives.map((obj, i) => (
                    <div
                        key={i}
                        className="flex gap-3 bg-white dark:bg-zinc-900 rounded-lg px-4 py-3 border border-zinc-200 dark:border-zinc-800"
                    >
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center mt-0.5">
                            {i + 1}
                        </span>
                        <p className="text-sm text-zinc-800 dark:text-zinc-200 leading-snug">{obj}</p>
                    </div>
                ))}
            </div>

            {/* Watch Out */}
            {result.watchOut && (
                <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg px-4 py-3">
                    <div className="text-xs font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400 mb-1">
                        Watch Out
                    </div>
                    <p className="text-sm text-amber-900 dark:text-amber-100 leading-snug">
                        {result.watchOut}
                    </p>
                </div>
            )}

            {/* Related Flowcharts */}
            {!compact && relatedCharts.length > 0 && (
                <div className="space-y-2">
                    <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                        Reference Flowcharts
                    </div>
                    {relatedCharts.map((chart) => (
                        <Link
                            key={chart.slug}
                            href={`/flowcharts/${chart.slug}`}
                            className="flex items-center justify-between bg-white dark:bg-zinc-900 rounded-lg px-4 py-3 border border-zinc-200 dark:border-zinc-800 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
                        >
                            <div>
                                <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                                    {chart.title}
                                </div>
                                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                                    {chart.instructor}
                                </div>
                            </div>
                            <svg
                                className="w-4 h-4 text-zinc-400 flex-shrink-0"
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
            )}
        </div>
    )
}
