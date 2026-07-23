'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

// ─── Return types ────────────────────────────────────────────────────────────

export interface ComputedKPI {
    id: string
    label: string
    metric: string
    target: number
    period: string
    actual: number
    customActual: number | null
    progressPct: number // 0-100, capped
}

export interface ComputedProblem {
    id: string
    description: string
    trainingFocus: string | null
    priority: number
    recentSessionCount: number // sessions in last 14 days on this focus
    kpis: ComputedKPI[]
    overallProgress: number // 0-100 average across KPIs
}

export interface GoalData {
    id: string
    title: string
    targetDate: Date | null
    daysRemaining: number | null
    problems: ComputedProblem[]
}

// ─── Main fetch + compute ────────────────────────────────────────────────────

export async function getGoalData(): Promise<GoalData | null> {
    const goal = await prisma.goal.findFirst({
        where: { isActive: true },
        include: {
            problems: {
                include: { kpis: true },
                orderBy: { priority: 'asc' },
            },
        },
        orderBy: { createdAt: 'desc' },
    })

    if (!goal) return null

    const now = new Date()
    const monthAgo = new Date(now)
    monthAgo.setDate(monthAgo.getDate() - 30)
    const twoWeeksAgo = new Date(now)
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)

    // Fetch data once, compute everything from it
    const [last30Rounds, lastMonthRounds, lastMonthSessions, recentSessions] =
        await Promise.all([
            prisma.round.findMany({
                take: 30,
                orderBy: { session: { date: 'desc' } },
                select: {
                    result: true,
                    guardPasses: true,
                    sweeps: true,
                    submissionFor: true,
                    submissionAgainst: true,
                    session: { select: { trainingFocus: true } },
                },
            }),
            prisma.round.findMany({
                where: { session: { date: { gte: monthAgo } } },
                select: {
                    result: true,
                    submissionFor: true,
                    submissionAgainst: true,
                    session: { select: { trainingFocus: true } },
                },
            }),
            prisma.session.findMany({
                where: { date: { gte: monthAgo } },
                select: { trainingFocus: true },
            }),
            prisma.session.findMany({
                where: { date: { gte: twoWeeksAgo } },
                select: { trainingFocus: true },
            }),
        ])

    const focusCounts = recentSessions.reduce(
        (acc, s) => {
            if (s.trainingFocus) acc[s.trainingFocus] = (acc[s.trainingFocus] || 0) + 1
            return acc
        },
        {} as Record<string, number>,
    )

    const daysRemaining = goal.targetDate
        ? Math.max(0, Math.ceil((goal.targetDate.getTime() - now.getTime()) / 86400000))
        : null

    const problems: ComputedProblem[] = goal.problems.map((problem) => {
        const computedKPIs: ComputedKPI[] = problem.kpis.map((kpi) => {
            const actual =
                kpi.metric === 'custom'
                    ? (kpi.customActual ?? 0)
                    : computeActual(
                          kpi.metric,
                          problem.trainingFocus,
                          last30Rounds,
                          lastMonthRounds,
                          lastMonthSessions,
                      )

            const rounded = Math.round(actual * 10) / 10
            const isLowerBetter = kpi.metric === 'submissions_against'
            const progressPct = isLowerBetter
                ? kpi.target === 0
                    ? 100
                    : Math.round(Math.min(100, (kpi.target / Math.max(rounded, 0.1)) * 100))
                : kpi.target === 0
                  ? 0
                  : Math.round(Math.min(100, (rounded / kpi.target) * 100))

            return {
                id: kpi.id,
                label: kpi.label,
                metric: kpi.metric,
                target: kpi.target,
                period: kpi.period,
                actual: rounded,
                customActual: kpi.customActual,
                progressPct,
            }
        })

        const overallProgress =
            computedKPIs.length > 0
                ? Math.round(
                      computedKPIs.reduce((s, k) => s + k.progressPct, 0) / computedKPIs.length,
                  )
                : 0

        return {
            id: problem.id,
            description: problem.description,
            trainingFocus: problem.trainingFocus,
            priority: problem.priority,
            recentSessionCount: problem.trainingFocus
                ? (focusCounts[problem.trainingFocus] ?? 0)
                : 0,
            kpis: computedKPIs,
            overallProgress,
        }
    })

    return { id: goal.id, title: goal.title, targetDate: goal.targetDate, daysRemaining, problems }
}

type RoundLite = {
    result: string
    guardPasses: number | null
    sweeps: number | null
    submissionFor: string | null
    submissionAgainst: string | null
    session: { trainingFocus: string | null }
}

type RoundMonth = {
    result: string
    submissionFor: string | null
    submissionAgainst: string | null
    session: { trainingFocus: string | null }
}

type SessionMonth = { trainingFocus: string | null }

function computeActual(
    metric: string,
    focus: string | null,
    r30: RoundLite[],
    rMonth: RoundMonth[],
    sMonth: SessionMonth[],
): number {
    switch (metric) {
        case 'guard_passes': {
            const sum = r30.reduce((s, r) => s + (r.guardPasses ?? 0), 0)
            return r30.length > 0 ? (sum / r30.length) * 10 : 0
        }
        case 'sweeps': {
            const sum = r30.reduce((s, r) => s + (r.sweeps ?? 0), 0)
            return r30.length > 0 ? (sum / r30.length) * 10 : 0
        }
        case 'win_rate': {
            const wins = rMonth.filter((r) => r.result === 'Win').length
            return rMonth.length > 0 ? (wins / rMonth.length) * 100 : 0
        }
        case 'win_rate_on_focus': {
            const fr = rMonth.filter((r) => r.session.trainingFocus === focus)
            const wins = fr.filter((r) => r.result === 'Win').length
            return fr.length > 0 ? (wins / fr.length) * 100 : 0
        }
        case 'submissions_for': {
            const count = r30.filter((r) => r.submissionFor).length
            return r30.length > 0 ? (count / r30.length) * 10 : 0
        }
        case 'submissions_against': {
            const count = r30.filter((r) => r.submissionAgainst).length
            return r30.length > 0 ? (count / r30.length) * 10 : 0
        }
        case 'sessions_on_focus': {
            if (!focus) return 0
            return sMonth.filter((s) => s.trainingFocus === focus).length
        }
        default:
            return 0
    }
}

// ─── Mutations ───────────────────────────────────────────────────────────────

export async function upsertGoal(title: string, targetDate: string | null) {
    const existing = await prisma.goal.findFirst({ where: { isActive: true } })
    const date = targetDate ? new Date(targetDate) : null

    if (existing) {
        await prisma.goal.update({ where: { id: existing.id }, data: { title, targetDate: date } })
    } else {
        await prisma.goal.create({ data: { title, targetDate: date, isActive: true } })
    }

    revalidatePath('/goals')
    revalidatePath('/dashboard')
    revalidatePath('/sessions/plan')
}

export async function addProblem(
    goalId: string,
    description: string,
    trainingFocus: string | null,
    priority: number,
) {
    await prisma.problem.create({ data: { goalId, description, trainingFocus, priority } })
    revalidatePath('/goals')
    revalidatePath('/sessions/plan')
}

export async function updateProblem(
    id: string,
    description: string,
    trainingFocus: string | null,
    priority: number,
) {
    await prisma.problem.update({ where: { id }, data: { description, trainingFocus, priority } })
    revalidatePath('/goals')
    revalidatePath('/sessions/plan')
}

export async function deleteProblem(id: string) {
    await prisma.problem.delete({ where: { id } })
    revalidatePath('/goals')
    revalidatePath('/sessions/plan')
}

export async function addKPI(
    problemId: string,
    label: string,
    metric: string,
    target: number,
    period: string,
) {
    await prisma.kpi.create({ data: { problemId, label, metric, target, period } })
    revalidatePath('/goals')
    revalidatePath('/dashboard')
}

export async function deleteKPI(id: string) {
    await prisma.kpi.delete({ where: { id } })
    revalidatePath('/goals')
    revalidatePath('/dashboard')
}

export async function updateCustomKPI(id: string, actual: number) {
    await prisma.kpi.update({ where: { id }, data: { customActual: actual } })
    revalidatePath('/goals')
    revalidatePath('/dashboard')
}
