'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getPartners } from '@/actions/partners'
import { getGoalData, type GoalData } from '@/actions/goals'
import { GoalAdvisor } from '@/components/GoalAdvisor'
import { TRAINING_FOCUSES, type TrainingFocus } from '@/data/objectives'

interface Partner {
    id: string
    name: string
    belt: string | null
    size: string | null
    physicalStyle: string | null
    guardRetention: string | null
}

export default function PlanSessionPage() {
    const router = useRouter()
    const [partners, setPartners] = useState<Partner[]>([])
    const [goalData, setGoalData] = useState<GoalData | null>(null)
    const [focus, setFocus] = useState<string>('')
    const [partnerId, setPartnerId] = useState<string>('')

    useEffect(() => {
        getPartners().then((data) => setPartners(data as Partner[]))
        getGoalData().then(setGoalData)
    }, [])

    // Recommend the most neglected problem's focus
    const neglectedProblems = (goalData?.problems ?? [])
        .filter((p) => p.trainingFocus)
        .sort((a, b) => {
            if (a.recentSessionCount !== b.recentSessionCount) return a.recentSessionCount - b.recentSessionCount
            return a.priority - b.priority
        })

    const selectedPartner = partners.find((p) => p.id === partnerId) ?? null

    function handleStartSession() {
        const params = new URLSearchParams()
        if (focus) params.set('focus', focus)
        router.push(`/sessions/new?${params.toString()}`)
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4 pb-24">
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                        Plan Session
                    </h1>
                    <Link
                        href="/dashboard"
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                        ← Dashboard
                    </Link>
                </div>

                {/* Neglected problems from goal */}
                {neglectedProblems.length > 0 && (
                    <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-sm border border-zinc-200 dark:border-zinc-800 mb-4">
                        <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400 mb-2">
                            Needs work (from your goal)
                        </div>
                        <div className="space-y-2">
                            {neglectedProblems.slice(0, 3).map((p) => (
                                <button
                                    key={p.id}
                                    type="button"
                                    onClick={() => setFocus(p.trainingFocus!)}
                                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-colors ${
                                        focus === p.trainingFocus
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-700'
                                    }`}
                                >
                                    <div>
                                        <div className="text-sm font-medium">{p.trainingFocus}</div>
                                        <div className={`text-xs mt-0.5 ${focus === p.trainingFocus ? 'text-blue-200' : 'text-zinc-500 dark:text-zinc-400'}`}>
                                            {p.recentSessionCount === 0
                                                ? '⚠ No sessions in 14 days'
                                                : `${p.recentSessionCount} session${p.recentSessionCount !== 1 ? 's' : ''} in 14 days`}
                                            {' · '}
                                            {p.kpis.length > 0 ? `${p.overallProgress}% toward KPI targets` : p.description.slice(0, 40)}
                                        </div>
                                    </div>
                                    {focus === p.trainingFocus && (
                                        <svg className="w-4 h-4 text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Training Focus */}
                <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-sm border border-zinc-200 dark:border-zinc-800 mb-4">
                    <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
                        What are you working on today?
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        {TRAINING_FOCUSES.map((f) => (
                            <button
                                key={f}
                                type="button"
                                onClick={() => setFocus(focus === f ? '' : f)}
                                className={`py-2 px-3 rounded-lg text-sm font-medium text-left transition-colors ${
                                    focus === f
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                                }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Partner selector (optional) */}
                {focus && (
                    <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-sm border border-zinc-200 dark:border-zinc-800 mb-4">
                        <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                            Training partner{' '}
                            <span className="font-normal text-zinc-400">(optional — for tailored advice)</span>
                        </label>
                        <select
                            value={partnerId}
                            onChange={(e) => setPartnerId(e.target.value)}
                            className="w-full p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">General objectives (no partner)</option>
                            {partners.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name}
                                    {p.belt ? ` (${p.belt})` : ''}
                                </option>
                            ))}
                        </select>
                        {selectedPartner && !selectedPartner.size && !selectedPartner.physicalStyle && (
                            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                                Add size and style to{' '}
                                <Link
                                    href={`/partners/${selectedPartner.id}`}
                                    className="text-blue-600 dark:text-blue-400 underline"
                                >
                                    {selectedPartner.name}'s profile
                                </Link>{' '}
                                for more specific objectives.
                            </p>
                        )}
                    </div>
                )}

                {/* Goal Advisor */}
                {focus && (
                    <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-sm border border-zinc-200 dark:border-zinc-800 mb-6">
                        <GoalAdvisor
                            focus={focus}
                            partnerName={selectedPartner?.name}
                            partnerSize={selectedPartner?.size}
                            partnerStyle={selectedPartner?.physicalStyle}
                            partnerGuardRetention={selectedPartner?.guardRetention}
                            partnerBelt={selectedPartner?.belt}
                        />
                    </div>
                )}

                {/* CTA */}
                <button
                    type="button"
                    onClick={handleStartSession}
                    disabled={!focus}
                    className="w-full bg-blue-600 text-white font-bold py-4 px-6 rounded-xl active:scale-95 transition-transform disabled:opacity-40 disabled:cursor-not-allowed shadow-lg"
                >
                    {focus ? `Start Session — ${focus}` : 'Select a focus to continue'}
                </button>
            </div>
        </div>
    )
}
