'use client'

import { createSession } from '@/actions/sessions'
import { getPartners } from '@/actions/partners'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { TechniqueMultiEntry } from '@/components/TechniqueMultiEntry'
import { TRAINING_FOCUSES } from '@/data/objectives'

interface Partner {
    id: string
    name: string
    belt: string | null
}

const POSITION_OPTIONS = ['Guard', 'Half Guard', 'Side Control', 'Mount', 'Back', 'North South', 'Knee on Belly'] as const
const PASS_TOP_OPTIONS = ['Knee Cut', 'Toreando', 'Over-Under', 'Body Lock', 'Leg Drag', 'Stack Pass'] as const
const GUARD_PASSED_OPTIONS = ['Closed Guard', 'Half Guard', 'De La Riva', 'Spider', 'Butterfly', 'Lasso'] as const
const SWEEP_OPTIONS = ['Hip Bump', 'Scissor Sweep', 'Flower Sweep', 'Tripod / Tomoe', 'Single Leg X', 'Technical Standup'] as const

interface Round {
    id: string
    partnerId: string
    result: 'Win' | 'Loss' | 'Draw'
    submissionFor: string
    submissionAgainst: string
    duration: string
    positionPinned: string
    positionBeforeSubbed: string[] // Changed to array
    passesTop: string[]
    guardsPassedBottom: string[]
    sweepsList: string[]
}

function NewSessionInner() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [partners, setPartners] = useState<Partner[]>([])
    const [date, setDate] = useState(new Date().toISOString().split('T')[0])
    const [classType, setClassType] = useState<'Gi' | 'No-Gi' | 'Open Mat'>('Gi')
    const [trainingFocus, setTrainingFocus] = useState(searchParams.get('focus') ?? '')
    const [notes, setNotes] = useState('')
    const [rounds, setRounds] = useState<Round[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showFocusPicker, setShowFocusPicker] = useState(false)

    useEffect(() => {
        getPartners().then((data) => {
            setPartners(data as any)
        })
    }, [])

    function addRound() {
        setRounds([
            ...rounds,
            {
                id: crypto.randomUUID(),
                partnerId: '',
                result: 'Win',
                submissionFor: '',
                submissionAgainst: '',
                duration: '6', // Default to 6 minutes
                positionPinned: '',
                positionBeforeSubbed: [], // Default to empty array
                passesTop: [],
                guardsPassedBottom: [],
                sweepsList: [],
            },
        ])
    }

    function updateRound(id: string, field: keyof Round, value: any) {
        setRounds(
            rounds.map((r) => (r.id === id ? { ...r, [field]: value } : r))
        )
    }

    function removeRound(id: string) {
        setRounds(rounds.filter((r) => r.id !== id))
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (rounds.length === 0) {
            alert('Please add at least one round')
            return
        }
        const invalid = rounds.some((r) => !r.partnerId?.trim())
        if (invalid) {
            alert('Please select a partner for every round')
            return
        }

        setIsSubmitting(true)

        try {
            await createSession({
                date: new Date(date),
                classType,
                trainingFocus: trainingFocus.trim() || undefined,
                notes: notes.trim() || undefined,
                rounds: rounds.map((r) => ({
                    partnerId: r.partnerId,
                    result: r.result,
                    submissionFor: r.submissionFor || undefined,
                    submissionAgainst: r.submissionAgainst || undefined,
                    duration: r.duration ? parseInt(r.duration, 10) : undefined,
                    positionPinned: r.positionPinned || undefined,
                    positionBeforeSubbed: r.positionBeforeSubbed, // Now an array
                    passesTop: r.passesTop,
                    guardsPassedBottom: r.guardsPassedBottom,
                    sweepsList: r.sweepsList,
                })),
            })

            router.push('/dashboard')
        } catch (error) {
            console.error(error)
            alert('Error creating session')
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4 pb-20">
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                        Log Session
                    </h1>
                    <Link
                        href="/dashboard"
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                        ← Dashboard
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-sm border border-zinc-200 dark:border-zinc-800">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                    Date
                                </label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                    Notes (optional)
                                </label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="How did the session go?"
                                    rows={2}
                                    className="w-full p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                    Class Type
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {(['Gi', 'No-Gi', 'Open Mat'] as const).map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setClassType(type)}
                                            className={`py-3 px-4 rounded-lg font-semibold transition-colors ${classType === type
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50'
                                                }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                    Training Focus{' '}
                                    <span className="font-normal text-zinc-400">(optional)</span>
                                </label>
                                {trainingFocus && !showFocusPicker ? (
                                    <div className="flex items-center gap-2">
                                        <span className="flex-1 py-2.5 px-3 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 text-sm font-medium text-blue-700 dark:text-blue-300">
                                            {trainingFocus}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => setShowFocusPicker(true)}
                                            className="text-xs text-zinc-500 dark:text-zinc-400 hover:underline"
                                        >
                                            Change
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setTrainingFocus('')}
                                            className="text-xs text-red-500 hover:underline"
                                        >
                                            Clear
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        {!showFocusPicker ? (
                                            <button
                                                type="button"
                                                onClick={() => setShowFocusPicker(true)}
                                                className="w-full py-2.5 px-3 rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 text-sm text-zinc-500 dark:text-zinc-400 text-left"
                                            >
                                                + Set a training focus…
                                            </button>
                                        ) : (
                                            <div>
                                                <div className="grid grid-cols-2 gap-1.5 mb-2">
                                                    {TRAINING_FOCUSES.map((f) => (
                                                        <button
                                                            key={f}
                                                            type="button"
                                                            onClick={() => {
                                                                setTrainingFocus(f)
                                                                setShowFocusPicker(false)
                                                            }}
                                                            className={`py-2 px-3 rounded-lg text-xs font-medium text-left transition-colors ${
                                                                trainingFocus === f
                                                                    ? 'bg-blue-600 text-white'
                                                                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                                                            }`}
                                                        >
                                                            {f}
                                                        </button>
                                                    ))}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowFocusPicker(false)}
                                                    className="text-xs text-zinc-500 hover:underline"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                            Rounds ({rounds.length})
                        </h2>
                        <button
                            type="button"
                            onClick={addRound}
                            className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg active:scale-95 transition-transform text-sm"
                        >
                            + Add Round
                        </button>
                    </div>

                    {rounds.length === 0 ? (
                        <div className="text-center py-12 text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                            <p>No rounds added yet. Click "Add Round" to start.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {rounds.map((round, index) => (
                                <div
                                    key={round.id}
                                    className="bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-sm border border-zinc-200 dark:border-zinc-800"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                                            Round {index + 1}
                                        </h3>
                                        <button
                                            type="button"
                                            onClick={() => removeRound(round.id)}
                                            className="text-red-600 dark:text-red-400 text-sm hover:underline"
                                        >
                                            Remove
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                                Partner *
                                            </label>
                                            <select
                                                value={round.partnerId}
                                                onChange={(e) =>
                                                    updateRound(round.id, 'partnerId', e.target.value)
                                                }
                                                required
                                                className="w-full p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="">Select partner...</option>
                                                {partners.map((p) => (
                                                    <option key={p.id} value={p.id}>
                                                        {p.name} {p.belt ? `(${p.belt})` : ''}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                                Result *
                                            </label>
                                            <div className="grid grid-cols-3 gap-2">
                                                {(['Win', 'Loss', 'Draw'] as const).map((result) => (
                                                    <button
                                                        key={result}
                                                        type="button"
                                                        onClick={() =>
                                                            updateRound(round.id, 'result', result)
                                                        }
                                                        className={`py-3 px-4 rounded-lg font-semibold transition-colors ${round.result === result
                                                            ? result === 'Win'
                                                                ? 'bg-green-600 text-white'
                                                                : result === 'Loss'
                                                                    ? 'bg-red-600 text-white'
                                                                    : 'bg-zinc-600 text-white'
                                                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50'
                                                            }`}
                                                    >
                                                        {result}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-4 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                                            <div>
                                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                                    Duration (minutes)
                                                </label>
                                                <input
                                                    type="number"
                                                    value={round.duration}
                                                    onChange={(e) =>
                                                        updateRound(round.id, 'duration', e.target.value)
                                                    }
                                                    placeholder="6"
                                                    min="1"
                                                    className="w-full p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 gap-4">
                                                <TechniqueMultiEntry
                                                    label="Passes (Top)"
                                                    options={PASS_TOP_OPTIONS}
                                                    value={round.passesTop}
                                                    onChange={(val) => updateRound(round.id, 'passesTop', val)}
                                                />
                                                <TechniqueMultiEntry
                                                    label="Guard Passed (Bottom)"
                                                    options={GUARD_PASSED_OPTIONS}
                                                    value={round.guardsPassedBottom}
                                                    onChange={(val) => updateRound(round.id, 'guardsPassedBottom', val)}
                                                />
                                                <TechniqueMultiEntry
                                                    label="Sweeps"
                                                    options={SWEEP_OPTIONS}
                                                    value={round.sweepsList}
                                                    onChange={(val) => updateRound(round.id, 'sweepsList', val)}
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                                    Position pinned in most (optional)
                                                </label>
                                                <select
                                                    value={round.positionPinned}
                                                    onChange={(e) =>
                                                        updateRound(round.id, 'positionPinned', e.target.value)
                                                    }
                                                    className="w-full p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="">—</option>
                                                    {POSITION_OPTIONS.map((pos) => (
                                                        <option key={pos} value={pos}>{pos}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <TechniqueMultiEntry
                                                label="Position before getting subbed"
                                                options={POSITION_OPTIONS}
                                                value={round.positionBeforeSubbed}
                                                onChange={(val) => updateRound(round.id, 'positionBeforeSubbed', val)}
                                            />

                                            {(round.result === 'Win' || round.result === 'Loss') && (
                                                <div className="grid grid-cols-1 gap-4 bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700">
                                                    {round.result === 'Win' && (
                                                        <div>
                                                            <label className="block text-sm font-semibold text-green-700 dark:text-green-400 mb-1">
                                                                Submission For
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={round.submissionFor}
                                                                onChange={(e) =>
                                                                    updateRound(
                                                                        round.id,
                                                                        'submissionFor',
                                                                        e.target.value
                                                                    )
                                                                }
                                                                placeholder="e.g., Armbar, Triangle"
                                                                className="w-full p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            />
                                                        </div>
                                                    )}
                                                    {round.result === 'Loss' && (
                                                        <div>
                                                            <label className="block text-sm font-semibold text-red-700 dark:text-red-400 mb-1">
                                                                Submission Against
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={round.submissionAgainst}
                                                                onChange={(e) =>
                                                                    updateRound(
                                                                        round.id,
                                                                        'submissionAgainst',
                                                                        e.target.value
                                                                    )
                                                                }
                                                                placeholder="e.g., Rear Naked Choke"
                                                                className="w-full p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting || rounds.length === 0}
                        className="w-full bg-blue-600 text-white font-bold py-4 px-6 rounded-lg active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed shadow-xl mt-4"
                    >
                        {isSubmitting ? 'Saving...' : 'Save Session'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default function NewSessionPage() {
    return (
        <Suspense>
            <NewSessionInner />
        </Suspense>
    )
}
