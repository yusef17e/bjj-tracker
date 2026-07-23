import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
})

async function main() {
    // Clear existing data
    await prisma.round.deleteMany()
    await prisma.session.deleteMany()
    await prisma.partner.deleteMany()

    console.log('Cleared existing data')

    // Create partners
    const partners = await Promise.all([
        prisma.partner.create({ data: { name: 'Marcus Silva', belt: 'Purple' } }),
        prisma.partner.create({ data: { name: 'Alex Chen', belt: 'Blue' } }),
        prisma.partner.create({ data: { name: 'Sarah Martinez', belt: 'Brown' } }),
        prisma.partner.create({ data: { name: 'Jake Thompson', belt: 'White' } }),
        prisma.partner.create({ data: { name: 'Emma Rodriguez', belt: 'Blue' } }),
        prisma.partner.create({ data: { name: 'David Kim', belt: 'Black' } }),
    ])

    console.log(`Created ${partners.length} partners`)

    // Helper to get random date in the past N days
    const getRandomDate = (daysAgo: number) => {
        const date = new Date()
        date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo))
        return date
    }

    // Helper to get random partner
    const getRandomPartner = () => partners[Math.floor(Math.random() * partners.length)]

    // Create sessions with rounds
    const submissions = [
        'Rear Naked Choke',
        'Armbar',
        'Triangle Choke',
        'Kimura',
        'Guillotine',
        'Americana',
        'Omoplata',
        'Ankle Lock',
    ]

    const sessions = []

    // Create 15 sessions over the past 30 days
    for (let i = 0; i < 15; i++) {
        const classTypes = ['Gi', 'No-Gi', 'Open Mat'] as const
        const results = ['Win', 'Loss', 'Draw'] as const

        const roundsCount = Math.floor(Math.random() * 4) + 2 // 2-5 rounds per session
        const rounds = []

        for (let j = 0; j < roundsCount; j++) {
            const partner = getRandomPartner()
            const result = results[Math.floor(Math.random() * results.length)]

            let submissionFor = null
            let submissionAgainst = null

            // 60% chance of submission on win/loss
            if (result === 'Win' && Math.random() > 0.4) {
                submissionFor = submissions[Math.floor(Math.random() * submissions.length)]
            } else if (result === 'Loss' && Math.random() > 0.4) {
                submissionAgainst = submissions[Math.floor(Math.random() * submissions.length)]
            }

            rounds.push({
                partnerId: partner.id,
                result,
                submissionFor,
                submissionAgainst,
                duration: Math.floor(Math.random() * 3) + 4, // 4-6 minutes
            })
        }

        const session = await prisma.session.create({
            data: {
                date: getRandomDate(30),
                classType: classTypes[Math.floor(Math.random() * classTypes.length)],
                notes: Math.random() > 0.7 ? 'Great session! Worked on guard passing.' : null,
                rounds: {
                    create: rounds,
                },
            },
        })

        sessions.push(session)
    }

    console.log(`Created ${sessions.length} sessions with rounds`)
    console.log('Seed completed successfully!')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
