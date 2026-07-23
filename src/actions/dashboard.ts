'use server'

import { prisma } from '@/lib/prisma'

export async function getDashboardStats() {
    // Get date for "this week" (last 7 days)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)

    // This week stats
    const weekSessions = await prisma.session.findMany({
        where: {
            date: {
                gte: weekAgo,
            },
        },
        include: {
            rounds: true,
        },
    })

    const weekRounds = weekSessions.flatMap((s) => s.rounds)
    const weekWins = weekRounds.filter((r) => r.result === 'Win').length
    const weekLosses = weekRounds.filter((r) => r.result === 'Loss').length
    const weekWinRate =
        weekRounds.length > 0 ? (weekWins / weekRounds.length) * 100 : 0

    // Overall stats
    const allRounds = await prisma.round.findMany()
    const totalWins = allRounds.filter((r) => r.result === 'Win').length
    const totalLosses = allRounds.filter((r) => r.result === 'Loss').length
    const overallWinRate =
        allRounds.length > 0 ? (totalWins / allRounds.length) * 100 : 0

    // Top submissions for
    const subsFor = allRounds
        .filter((r) => r.submissionFor)
        .map((r) => r.submissionFor as string)
    const subsForCounts = subsFor.reduce((acc, sub) => {
        acc[sub] = (acc[sub] || 0) + 1
        return acc
    }, {} as Record<string, number>)
    const topSubFor = Object.entries(subsForCounts).sort(
        ([, a], [, b]) => b - a
    )[0]

    // Top submissions against
    const subsAgainst = allRounds
        .filter((r) => r.submissionAgainst)
        .map((r) => r.submissionAgainst as string)
    const subsAgainstCounts = subsAgainst.reduce((acc, sub) => {
        acc[sub] = (acc[sub] || 0) + 1
        return acc
    }, {} as Record<string, number>)
    const topSubAgainst = Object.entries(subsAgainstCounts).sort(
        ([, a], [, b]) => b - a
    )[0]

    // Toughest partner (lowest win rate, min 5 rounds)
    const partners = await prisma.partner.findMany({
        include: {
            rounds: true,
        },
    })

    const partnersWithStats = partners
        .map((p) => {
            const rounds = p.rounds
            const wins = rounds.filter((r) => r.result === 'Win').length
            const winRate = rounds.length > 0 ? (wins / rounds.length) * 100 : 0
            return {
                id: p.id,
                name: p.name,
                totalRounds: rounds.length,
                winRate,
            }
        })
        .filter((p) => p.totalRounds >= 5)
        .sort((a, b) => a.winRate - b.winRate)

    const toughestPartner = partnersWithStats[0] || null

    // Position pinned in the most (aggregate counts)
    const positionPinnedCounts = allRounds
        .filter((r) => r.positionPinned?.trim())
        .reduce((acc, r) => {
            const p = r.positionPinned as string
            acc[p] = (acc[p] || 0) + 1
            return acc
        }, {} as Record<string, number>)
    const positionPinnedMost = Object.entries(positionPinnedCounts).sort(
        ([, a], [, b]) => b - a
    )[0]

    // Position before getting subbed (when lost by sub)
    const positionBeforeSubbedCounts = allRounds
        .filter((r) => r.positionBeforeSubbed?.trim())
        .reduce((acc, r) => {
            const val = r.positionBeforeSubbed as string
            try {
                const parsed = JSON.parse(val)
                if (Array.isArray(parsed)) {
                    parsed.forEach((p) => {
                        acc[p] = (acc[p] || 0) + 1
                    })
                } else {
                    acc[val] = (acc[val] || 0) + 1
                }
            } catch (e) {
                acc[val] = (acc[val] || 0) + 1
            }
            return acc
        }, {} as Record<string, number>)
    const positionBeforeSubbedMost = Object.entries(positionBeforeSubbedCounts).sort(
        ([, a], [, b]) => b - a
    )[0]

    // Passing & sweeps totals
    const totalGuardPasses = allRounds.reduce((s, r) => s + (r.guardPasses ?? 0), 0)
    const totalTimesPassed = allRounds.reduce((s, r) => s + (r.timesPassed ?? 0), 0)
    const totalSweeps = allRounds.reduce((s, r) => s + (r.sweeps ?? 0), 0)

    return {
        thisWeek: {
            sessions: weekSessions.length,
            rounds: weekRounds.length,
            wins: weekWins,
            losses: weekLosses,
            winRate: Math.round(weekWinRate),
        },
        overall: {
            totalRounds: allRounds.length,
            winRate: Math.round(overallWinRate),
            topSubFor: topSubFor ? { name: topSubFor[0], count: topSubFor[1] } : null,
            topSubAgainst: topSubAgainst
                ? { name: topSubAgainst[0], count: topSubAgainst[1] }
                : null,
            positionPinnedMost: positionPinnedMost
                ? { name: positionPinnedMost[0], count: positionPinnedMost[1] }
                : null,
            positionBeforeSubbedMost: positionBeforeSubbedMost
                ? { name: positionBeforeSubbedMost[0], count: positionBeforeSubbedMost[1] }
                : null,
            guardPasses: totalGuardPasses,
            timesPassed: totalTimesPassed,
            sweeps: totalSweeps,
        },
        toughestPartner: toughestPartner
            ? {
                name: toughestPartner.name,
                winRate: Math.round(toughestPartner.winRate),
                totalRounds: toughestPartner.totalRounds,
            }
            : null,
    }
}
