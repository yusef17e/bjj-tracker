'use client'

import {
    upsertGoal,
    addProblem,
    updateProblem,
    deleteProblem,
    addKPI,
    deleteKPI,
    updateCustomKPI,
    type GoalData,
    type ComputedProblem,
    type ComputedKPI,
} from '@/actions/goals'
import { KPI_METRICS, PRIORITY_LABELS, PRIORITY_COLORS, getMetricDef } from '@/data/kpis'
import { TRAINING_FOCUSES } from '@/data/objectives'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

// ─── KPI progress bar ────────────────────────────────────────────────────────

function KPIBar({ kpi, onDelete, onUpdate }: {
    kpi: ComputedKPI
    onDelete: () => void
    onUpdate?: (actual: number) => void
}) {
    const [editing, setEditing] = useState(false)
    const [customVal, setCustomVal] = useState(String(kpi.customActual ?? ''))

    const pct = kpi.progressPct
    const barColor = pct >= 80 ? 'bg-green-500' : pct >= 50 ? 'bg-amber-500' : 'bg-red-500'
    const metricDef = getMetricDef(kpi.metric)
    const isCustom = kpi.metric === 'custom'
    const displayActual = isCustom ? (kpi.customActual ?? '—') : kpi.actual.toFixed(kpi.actual % 1 === 0 ? 0 : 1)
    const unit = metricDef?.unit ?? ''

    async function saveCustom() {
        const v = parseFloat(customVal)
        if (!isNaN(v) && onUpdate) {
            await onUpdate(v)
            setEditing(false)
        }
    }

    return (
        <div className="py-2 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
            <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-zinc-700 dark:text-zinc-300 font-medium">{kpi.label}</span>
                <div className="flex items-center gap-2">
                    {isCustom && (
                        editing ? (
                            <div className="flex items-center gap-1">
                                <input
                                    type="number"
                                    value={customVal}
                                    onChange={(e) => setCustomVal(e.target.value)}
                                    className="w-16 text-xs p-1 rounded border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-50"
                                    autoFocus
                                />
                                <button onClick={saveCustom} className="text-xs text-blue-600 dark:text-blue-400">Save</button>
                                <button onClick={() => setEditing(false)} className="text-xs text-zinc-400">✕</button>
                            </div>
                        ) : (
                            <button onClick={() => setEditing(true)} className="text-xs text-blue-600 dark:text-blue-400">Update</button>
                        )
                    )}
                    <button onClick={onDelete} className="text-xs text-zinc-400 hover:text-red-500">✕</button>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <div className="flex-1 bg-zinc-200 dark:bg-zinc-700 rounded-full h-2 overflow-hidden">
                    <div
                        className={`h-2 rounded-full transition-all ${barColor}`}
                        style={{ width: `${pct}%` }}
                    />
                </div>
                <span className="text-xs text-zinc-500 dark:text-zinc-400 w-20 text-right shrink-0">
                    {displayActual} / {kpi.target} {unit}
                </span>
            </div>
        </div>
    )
}

// ─── Add KPI form ────────────────────────────────────────────────────────────

function AddKPIForm({ problemId, focus, onDone }: { problemId: string; focus: string | null; onDone: () => void }) {
    const router = useRouter()
    const [metric, setMetric] = useState(KPI_METRICS[0].value)
    const [target, setTarget] = useState('')
    const [saving, setSaving] = useState(false)

    const metricDef = getMetricDef(metric)!
    const label = metricDef.label
    const period = metricDef.period

    const availableMetrics = KPI_METRICS.filter((m) => !m.needsFocus || focus)

    async function handleSave() {
        const t = parseFloat(target)
        if (isNaN(t) || t <= 0) return
        setSaving(true)
        await addKPI(problemId, label, metric, t, period)
        router.refresh()
        onDone()
    }

    return (
        <div className="mt-3 p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg space-y-3">
            <div>
                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">Metric</label>
                <select
                    value={metric}
                    onChange={(e) => setMetric(e.target.value)}
                    className="w-full p-2 text-sm rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
                >
                    {availableMetrics.map((m) => (
                        <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                </select>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{metricDef.description}</p>
            </div>
            <div>
                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                    Target ({metricDef.unit || 'number'})
                </label>
                <input
                    type="number"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    placeholder={metricDef.value.includes('win_rate') ? 'e.g. 60' : 'e.g. 3'}
                    className="w-full p-2 text-sm rounded border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-50"
                    min="0"
                    step="0.1"
                />
            </div>
            <div className="flex gap-2">
                <button
                    onClick={handleSave}
                    disabled={saving || !target}
                    className="flex-1 bg-blue-600 text-white text-sm font-semibold py-2 rounded-lg disabled:opacity-50"
                >
                    {saving ? 'Adding…' : 'Add KPI'}
                </button>
                <button onClick={onDone} className="flex-1 bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-sm font-semibold py-2 rounded-lg">
                    Cancel
                </button>
            </div>
        </div>
    )
}

// ─── Problem card ─────────────────────────────────────────────────────────────

function ProblemCard({ problem, onRefresh }: { problem: ComputedProblem; onRefresh: () => void }) {
    const router = useRouter()
    const [expanded, setExpanded] = useState(true)
    const [addingKPI, setAddingKPI] = useState(false)
    const [editing, setEditing] = useState(false)
    const [desc, setDesc] = useState(problem.description)
    const [focus, setFocus] = useState(problem.trainingFocus ?? '')
    const [priority, setPriority] = useState(problem.priority)
    const [saving, setSaving] = useState(false)

    const pct = problem.overallProgress
    const barColor = pct >= 80 ? 'bg-green-500' : pct >= 50 ? 'bg-amber-500' : 'bg-red-500'

    async function handleDelete() {
        if (!confirm(`Delete problem "${problem.description}"? This removes all KPIs.`)) return
        await deleteProblem(problem.id)
        router.refresh()
    }

    async function handleSaveEdit() {
        if (!desc.trim()) return
        setSaving(true)
        await updateProblem(problem.id, desc.trim(), focus || null, priority)
        router.refresh()
        setEditing(false)
        setSaving(false)
    }

    const neglected = problem.trainingFocus && problem.recentSessionCount === 0

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            {/* Header */}
            <div
                className="flex items-start gap-3 p-4 cursor-pointer"
                onClick={() => !editing && setExpanded((v) => !v)}
            >
                <div className="flex-1 min-w-0">
                    {editing ? (
                        <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                            <textarea
                                value={desc}
                                onChange={(e) => setDesc(e.target.value)}
                                className="w-full p-2 text-sm rounded border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-50 resize-none"
                                rows={2}
                            />
                            <div className="grid grid-cols-2 gap-2">
                                <select
                                    value={focus}
                                    onChange={(e) => setFocus(e.target.value)}
                                    className="p-2 text-xs rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
                                >
                                    <option value="">No focus</option>
                                    {TRAINING_FOCUSES.map((f) => <option key={f} value={f}>{f}</option>)}
                                </select>
                                <select
                                    value={priority}
                                    onChange={(e) => setPriority(Number(e.target.value))}
                                    className="p-2 text-xs rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
                                >
                                    <option value={1}>High priority</option>
                                    <option value={2}>Medium priority</option>
                                    <option value={3}>Low priority</option>
                                </select>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={handleSaveEdit} disabled={saving} className="flex-1 bg-blue-600 text-white text-xs font-semibold py-1.5 rounded disabled:opacity-50">
                                    {saving ? 'Saving…' : 'Save'}
                                </button>
                                <button onClick={() => setEditing(false)} className="flex-1 bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold py-1.5 rounded">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50 leading-snug">
                                {problem.description}
                            </p>
                            <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                                {problem.trainingFocus && (
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium">
                                        {problem.trainingFocus}
                                    </span>
                                )}
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PRIORITY_COLORS[problem.priority]}`}>
                                    {PRIORITY_LABELS[problem.priority]}
                                </span>
                                {neglected && (
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 font-medium">
                                        No sessions in 14 days
                                    </span>
                                )}
                                {!neglected && problem.trainingFocus && problem.recentSessionCount > 0 && (
                                    <span className="text-xs text-zinc-400 dark:text-zinc-500">
                                        {problem.recentSessionCount} session{problem.recentSessionCount !== 1 ? 's' : ''} recently
                                    </span>
                                )}
                            </div>
                            {/* Overall progress mini-bar */}
                            {problem.kpis.length > 0 && (
                                <div className="mt-2 flex items-center gap-2">
                                    <div className="flex-1 bg-zinc-200 dark:bg-zinc-700 rounded-full h-1.5 overflow-hidden">
                                        <div className={`h-1.5 rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
                                    </div>
                                    <span className="text-xs text-zinc-500 dark:text-zinc-400">{pct}%</span>
                                </div>
                            )}
                        </>
                    )}
                </div>
                {!editing && (
                    <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setEditing(true)} className="text-xs text-zinc-400 hover:text-zinc-600 p-1">Edit</button>
                        <button onClick={handleDelete} className="text-xs text-zinc-400 hover:text-red-500 p-1">✕</button>
                        <svg className={`w-4 h-4 text-zinc-400 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                )}
            </div>

            {/* KPI section */}
            {expanded && !editing && (
                <div className="px-4 pb-4 border-t border-zinc-100 dark:border-zinc-800">
                    {problem.kpis.length > 0 ? (
                        <div className="mt-3">
                            {problem.kpis.map((kpi) => (
                                <KPIBar
                                    key={kpi.id}
                                    kpi={kpi}
                                    onDelete={async () => {
                                        await deleteKPI(kpi.id)
                                        router.refresh()
                                    }}
                                    onUpdate={async (actual) => {
                                        await updateCustomKPI(kpi.id, actual)
                                        router.refresh()
                                    }}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-3">
                            No KPIs yet — add a measurable target to track progress.
                        </p>
                    )}

                    {addingKPI ? (
                        <AddKPIForm
                            problemId={problem.id}
                            focus={problem.trainingFocus}
                            onDone={() => setAddingKPI(false)}
                        />
                    ) : (
                        <button
                            onClick={() => setAddingKPI(true)}
                            className="mt-3 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
                        >
                            + Add KPI
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}

// ─── Add problem form ─────────────────────────────────────────────────────────

function AddProblemForm({ goalId, onDone }: { goalId: string; onDone: () => void }) {
    const router = useRouter()
    const [desc, setDesc] = useState('')
    const [focus, setFocus] = useState('')
    const [priority, setPriority] = useState(2)
    const [saving, setSaving] = useState(false)

    async function handleSave() {
        if (!desc.trim()) return
        setSaving(true)
        await addProblem(goalId, desc.trim(), focus || null, priority)
        router.refresh()
        onDone()
    }

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-sm border border-blue-200 dark:border-blue-800 space-y-3">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                Add a problem
            </h3>
            <div>
                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                    What's standing between you and your goal?
                </label>
                <textarea
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    placeholder="e.g. Guard passing fails against bigger, stronger opponents"
                    rows={2}
                    className="w-full p-3 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    autoFocus
                />
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                        Training focus
                    </label>
                    <select
                        value={focus}
                        onChange={(e) => setFocus(e.target.value)}
                        className="w-full p-2.5 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
                    >
                        <option value="">None</option>
                        {TRAINING_FOCUSES.map((f) => <option key={f} value={f}>{f}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                        Priority
                    </label>
                    <select
                        value={priority}
                        onChange={(e) => setPriority(Number(e.target.value))}
                        className="w-full p-2.5 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
                    >
                        <option value={1}>High</option>
                        <option value={2}>Medium</option>
                        <option value={3}>Low</option>
                    </select>
                </div>
            </div>
            <div className="flex gap-2">
                <button
                    onClick={handleSave}
                    disabled={saving || !desc.trim()}
                    className="flex-1 bg-blue-600 text-white font-semibold py-2.5 rounded-lg text-sm disabled:opacity-50 active:scale-95 transition-transform"
                >
                    {saving ? 'Adding…' : 'Add Problem'}
                </button>
                <button
                    onClick={onDone}
                    className="flex-1 bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold py-2.5 rounded-lg text-sm active:scale-95 transition-transform"
                >
                    Cancel
                </button>
            </div>
        </div>
    )
}

// ─── Goal setup form ──────────────────────────────────────────────────────────

function GoalForm({ current, onDone }: { current?: GoalData; onDone: () => void }) {
    const router = useRouter()
    const [title, setTitle] = useState(current?.title ?? '')
    const [date, setDate] = useState(
        current?.targetDate ? new Date(current.targetDate).toISOString().split('T')[0] : '',
    )
    const [saving, setSaving] = useState(false)

    async function handleSave() {
        if (!title.trim()) return
        setSaving(true)
        await upsertGoal(title.trim(), date || null)
        router.refresh()
        onDone()
    }

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-sm border border-zinc-200 dark:border-zinc-800 space-y-4">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                {current ? 'Edit goal' : 'Set your long-term goal'}
            </h3>
            <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    What are you working toward?
                </label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Win the blue belt division at regionals"
                    className="w-full p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Target date <span className="font-normal text-zinc-400">(optional)</span>
                </label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="flex gap-2">
                <button
                    onClick={handleSave}
                    disabled={saving || !title.trim()}
                    className="flex-1 bg-blue-600 text-white font-semibold py-3 rounded-lg disabled:opacity-50 active:scale-95 transition-transform"
                >
                    {saving ? 'Saving…' : current ? 'Save' : 'Set Goal'}
                </button>
                {current && (
                    <button
                        onClick={onDone}
                        className="flex-1 bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold py-3 rounded-lg active:scale-95 transition-transform"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </div>
    )
}

// ─── Main manager ─────────────────────────────────────────────────────────────

export function GoalManager({ initialGoal }: { initialGoal: GoalData | null }) {
    const [editingGoal, setEditingGoal] = useState(false)
    const [addingProblem, setAddingProblem] = useState(false)

    if (!initialGoal && !editingGoal) {
        return (
            <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4 pb-24">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">Goals</h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
                        Danaher's 4-stage framework — goal → problems → training → KPIs
                    </p>

                    <div className="bg-blue-50 dark:bg-blue-950 rounded-xl p-5 border border-blue-200 dark:border-blue-800 mb-6">
                        <h2 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">How it works</h2>
                        <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1.5 list-decimal list-inside">
                            <li><strong>Set your long-term goal</strong> — what are you working toward?</li>
                            <li><strong>Identify the problems</strong> — what's standing in the way?</li>
                            <li><strong>Set KPIs</strong> — measurable targets auto-computed from your session data</li>
                            <li><strong>Organise training</strong> — the Plan page surfaces your most neglected problems</li>
                        </ol>
                    </div>

                    <GoalForm onDone={() => {}} />
                </div>
            </div>
        )
    }

    if (!initialGoal || editingGoal) {
        return (
            <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4 pb-24">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">Goals</h1>
                    <GoalForm current={initialGoal ?? undefined} onDone={() => setEditingGoal(false)} />
                </div>
            </div>
        )
    }

    const goal = initialGoal
    const neglectedCount = goal.problems.filter(
        (p) => p.trainingFocus && p.recentSessionCount === 0,
    ).length

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4 pb-24">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">Goals</h1>

                {/* Goal card */}
                <div className="bg-white dark:bg-zinc-900 rounded-xl p-5 shadow-sm border border-zinc-200 dark:border-zinc-800 mb-6">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 leading-snug">
                                {goal.title}
                            </h2>
                            {goal.targetDate && (
                                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                                    {goal.daysRemaining === 0
                                        ? 'Today!'
                                        : goal.daysRemaining === null
                                          ? ''
                                          : `${goal.daysRemaining} days remaining`}{' '}
                                    ·{' '}
                                    {new Date(goal.targetDate).toLocaleDateString('en-US', {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric',
                                    })}
                                </p>
                            )}
                        </div>
                        <button
                            onClick={() => setEditingGoal(true)}
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline shrink-0"
                        >
                            Edit
                        </button>
                    </div>

                    {/* Summary strip */}
                    {goal.problems.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 grid grid-cols-3 gap-3 text-center">
                            <div>
                                <div className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{goal.problems.length}</div>
                                <div className="text-xs text-zinc-500">Problems</div>
                            </div>
                            <div>
                                <div className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                                    {goal.problems.reduce((s, p) => s + p.kpis.length, 0)}
                                </div>
                                <div className="text-xs text-zinc-500">KPIs</div>
                            </div>
                            <div>
                                <div className={`text-xl font-bold ${neglectedCount > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                                    {neglectedCount}
                                </div>
                                <div className="text-xs text-zinc-500">Neglected</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Explainer for the framework stages */}
                <div className="flex items-center gap-3 mb-4 overflow-x-auto pb-1">
                    {[
                        { n: '4', label: 'Long-term goal', done: true },
                        { n: '1', label: 'Identify problems', done: goal.problems.length > 0 },
                        { n: '3', label: 'Set KPIs', done: goal.problems.some((p) => p.kpis.length > 0) },
                        { n: '2', label: 'Train on problems', done: neglectedCount === 0 && goal.problems.length > 0 },
                    ].map((step) => (
                        <div key={step.n} className="flex items-center gap-1.5 shrink-0">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step.done ? 'bg-green-500 text-white' : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-500'}`}>
                                {step.done ? '✓' : step.n}
                            </div>
                            <span className={`text-xs ${step.done ? 'text-zinc-700 dark:text-zinc-300' : 'text-zinc-400'}`}>{step.label}</span>
                            <span className="text-zinc-300 dark:text-zinc-700 ml-1">›</span>
                        </div>
                    ))}
                </div>

                {/* Problems */}
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                        Problems ({goal.problems.length})
                    </h2>
                </div>

                <div className="space-y-3 mb-4">
                    {goal.problems.length === 0 ? (
                        <div className="text-center py-8 text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-900 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700">
                            <p className="text-sm">No problems identified yet</p>
                            <p className="text-xs mt-1">What's standing between you and your goal?</p>
                        </div>
                    ) : (
                        goal.problems.map((p) => <ProblemCard key={p.id} problem={p} onRefresh={() => {}} />)
                    )}
                </div>

                {addingProblem ? (
                    <AddProblemForm goalId={goal.id} onDone={() => setAddingProblem(false)} />
                ) : (
                    <button
                        onClick={() => setAddingProblem(true)}
                        className="w-full py-3 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-600 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:border-blue-500 hover:text-blue-600 transition-colors"
                    >
                        + Add Problem
                    </button>
                )}
            </div>
        </div>
    )
}
