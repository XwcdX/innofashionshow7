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
        { email: 'c14230074@john.petra.ac.id', name: 'Terry Clement', divisionSlug: 'it' },
        { email: 'd12230126@john.petra.ac.id', name: 'Amanda Adelia Ivanka', divisionSlug: 'it' },
        { email: 'h14230108@john.petra.ac.id', name: 'Jennifer Alicia Limbono', divisionSlug: 'it' },
        { email: 'c14240033@john.petra.ac.id', name: 'Joselin Julian Koenadi', divisionSlug: 'it' },
        { email: 'h13230036@john.petra.ac.id', name: 'Sonia Bernita Susetyo', divisionSlug: 'it' },
        { email: 'e12220221@john.petra.ac.id', name: 'Loveina', divisionSlug: 'it' },
        { email: 'c14240030@john.petra.ac.id', name: 'Clara Nadia Adigunawan', divisionSlug: 'it' },
        { email: 'd11240306@john.petra.ac.id', name: 'Joses Alver Agape', divisionSlug: 'it' },
        { email: 'h14230219@john.petra.ac.id', name: 'Jecelyn Gozal', divisionSlug: 'bph' },
        { email: 'e12220094@john.petra.ac.id', name: 'Sthefanie Natajaya', divisionSlug: 'bph' },
        { email: 'h14230144@john.petra.ac.id', name: 'Sharone Hendrata', divisionSlug: 'bph' },
        { email: 'h14230029@john.petra.ac.id', name: 'Evelyn Joyrich Gunawan', divisionSlug: 'bph' },
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
