import { PrismaClient } from '@prisma/client'

console.log('DATABASE_URL:', process.env.DATABASE_URL)

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
})

async function main() {
    const partners = [
        { name: 'John Doe', belt: 'Blue' },
        { name: 'Jane Smith', belt: 'Purple' },
        { name: 'Mike Johnson', belt: 'White' },
        { name: 'Sarah Connor', belt: 'Brown' },
        { name: 'Tom Hardy', belt: 'Black' },
    ]

    for (const p of partners) {
        try {
            await prisma.partner.create({ data: p })
        } catch (e) {
            console.log(`Error creating partner ${p.name}: ${e.message}`)
        }
    }
    console.log('Seeded partners')
}

main()
    .catch(async (e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
