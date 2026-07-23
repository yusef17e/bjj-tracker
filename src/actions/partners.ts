'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getPartners() {
    const partners = await prisma.partner.findMany({
        include: { rounds: true },
        orderBy: { createdAt: 'desc' },
    })

    return partners.map((partner) => {
        const totalRounds = partner.rounds.length
        const wins = partner.rounds.filter((r) => r.result === 'Win').length
        const winRate = totalRounds > 0 ? (wins / totalRounds) * 100 : 0

        return {
            id: partner.id,
            name: partner.name,
            belt: partner.belt,
            size: partner.size,
            physicalStyle: partner.physicalStyle,
            guardRetention: partner.guardRetention,
            totalRounds,
            winRate: Math.round(winRate),
            createdAt: partner.createdAt,
        }
    })
}

export async function getPartner(id: string) {
    const partner = await prisma.partner.findUnique({
        where: { id },
        include: {
            rounds: {
                include: { session: true },
                orderBy: { session: { date: 'desc' } },
            },
        },
    })

    if (!partner) return null

    const totalRounds = partner.rounds.length
    const wins = partner.rounds.filter((r) => r.result === 'Win').length
    const losses = partner.rounds.filter((r) => r.result === 'Loss').length
    const draws = partner.rounds.filter((r) => r.result === 'Draw').length
    const winRate = totalRounds > 0 ? (wins / totalRounds) * 100 : 0
    const lastRolled = partner.rounds.length > 0 ? partner.rounds[0].session.date : null

    return {
        id: partner.id,
        name: partner.name,
        belt: partner.belt,
        size: partner.size,
        physicalStyle: partner.physicalStyle,
        guardRetention: partner.guardRetention,
        totalRounds,
        wins,
        losses,
        draws,
        winRate: Math.round(winRate),
        lastRolled,
        rounds: partner.rounds,
    }
}

export async function addPartner(formData: FormData) {
    const name = formData.get('name') as string
    const belt = formData.get('belt') as string | null
    const size = formData.get('size') as string | null
    const physicalStyle = formData.get('physicalStyle') as string | null
    const guardRetention = formData.get('guardRetention') as string | null

    if (!name || name.trim().length === 0) {
        throw new Error('Partner name is required')
    }

    await prisma.partner.create({
        data: {
            name: name.trim(),
            belt: belt?.trim() || null,
            size: size?.trim() || null,
            physicalStyle: physicalStyle?.trim() || null,
            guardRetention: guardRetention?.trim() || null,
        },
    })

    revalidatePath('/partners')
}

export async function updatePartnerProfile(
    id: string,
    data: {
        belt?: string | null
        size?: string | null
        physicalStyle?: string | null
        guardRetention?: string | null
    },
) {
    await prisma.partner.update({
        where: { id },
        data: {
            belt: data.belt ?? undefined,
            size: data.size ?? undefined,
            physicalStyle: data.physicalStyle ?? undefined,
            guardRetention: data.guardRetention ?? undefined,
        },
    })

    revalidatePath(`/partners/${id}`)
    revalidatePath('/partners')
}
