const { PrismaClient } = require('@prisma/client')
console.log('DATABASE_URL:', process.env.DATABASE_URL)

const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL
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
        await prisma.partner.create({ data: p })
    }
    console.log('Seeded partners')
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
