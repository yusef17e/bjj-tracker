'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

interface RoundData {
    partnerId: string
    result: 'Win' | 'Loss' | 'Draw'
    submissionFor?: string
    submissionAgainst?: string
    duration?: number
    positionPinned?: string
    positionBeforeSubbed?: string[]
    passesTop?: string[]
    guardsPassedBottom?: string[]
    sweepsList?: string[]
}

interface SessionData {
    date: Date
    classType: 'Gi' | 'No-Gi' | 'Open Mat'
    trainingFocus?: string
    rounds: RoundData[]
    notes?: string
}

export async function createSession(data: SessionData) {
    await prisma.session.create({
        data: {
            date: data.date,
            classType: data.classType,
            trainingFocus: data.trainingFocus || null,
            notes: data.notes,
            rounds: {
                create: data.rounds.map((round) => {
                    const passesTop = round.passesTop ?? []
                    const guardsPassedBottom = round.guardsPassedBottom ?? []
                    const sweepsList = round.sweepsList ?? []
                    const posBeforeSubbed = round.positionBeforeSubbed ?? []

                    return {
                        partnerId: round.partnerId,
                        result: round.result,
                        submissionFor: round.submissionFor || null,
                        submissionAgainst: round.submissionAgainst || null,
                        duration: round.duration ?? null,
                        positionPinned: round.positionPinned?.trim() || null,
                        positionBeforeSubbed: posBeforeSubbed.length ? JSON.stringify(posBeforeSubbed) : null,
                        guardPasses: passesTop.length || null,
                        timesPassed: guardsPassedBottom.length || null,
                        sweeps: sweepsList.length || null,
                        passFromTop: passesTop.length ? JSON.stringify(passesTop) : null,
                        guardPassedBottom: guardsPassedBottom.length ? JSON.stringify(guardsPassedBottom) : null,
                        sweepMain: sweepsList.length ? JSON.stringify(sweepsList) : null,
                    }
                }),
            },
        },
    })

    revalidatePath('/dashboard')
    revalidatePath('/partners')
    data.rounds.forEach((r) => revalidatePath(`/partners/${r.partnerId}`))
}

export async function getSessions() {
    const sessions = await prisma.session.findMany({
        include: {
            rounds: {
                include: { partner: true },
            },
        },
        orderBy: { date: 'desc' },
    })

    return sessions.map((s) => ({
        id: s.id,
        date: s.date,
        classType: s.classType,
        trainingFocus: s.trainingFocus,
        notes: s.notes,
        roundCount: s.rounds.length,
        wins: s.rounds.filter((r) => r.result === 'Win').length,
        losses: s.rounds.filter((r) => r.result === 'Loss').length,
        draws: s.rounds.filter((r) => r.result === 'Draw').length,
        partners: [...new Set(s.rounds.map((r) => r.partner.name))],
    }))
}

export async function getSession(id: string) {
    return prisma.session.findUnique({
        where: { id },
        include: {
            rounds: {
                include: { partner: true },
                orderBy: { id: 'asc' },
            },
        },
    })
}
