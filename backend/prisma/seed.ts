import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const divisions = [
        { name: 'Information Technology', slug: 'it' },
        { name: 'Badan Pengurus Harian', slug: 'bph' },
        { name: 'Acara', slug: 'acara' },
        { name: 'Creative', slug: 'creative' },
        { name: 'Lomba', slug: 'lomba' },
    ];

    for (const div of divisions) {
        await prisma.division.upsert({
            where: { slug: div.slug },
            update: {},
            create: { name: div.name, slug: div.slug },
        });
    }

    const admins = [
        { email: 'c14230074@john.petra.ac.id', name: 'Terry Clement', divisionSlug: 'it' }
    ];

    for (const admin of admins) {
        const division = await prisma.division.findUnique({ where: { slug: admin.divisionSlug } });
        if (!division) {
            console.warn(`⚠ Division not found for slug ${admin.divisionSlug}, skipping admin ${admin.email}`);
            continue;
        }
        await prisma.admin.upsert({
            where: { email: admin.email },
            update: {
                name: admin.name,
                divisionId: division.id,
            },
            create: {
                email: admin.email,
                name: admin.name,
                divisionId: division.id,
            },
        });
    }
}

main()
    .catch(e => { console.error(e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });
