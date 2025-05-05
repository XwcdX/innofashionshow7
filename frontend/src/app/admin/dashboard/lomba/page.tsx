'use client';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import PageHeader from '../components/PageHeader';

const Datatable = dynamic(
    () => import('../components/Datatable'),
    { ssr: false }
    );

const AdminHomePage = () => {
    const [dataPetra, setDataPetra] = useState<any[]>([]);
    const [dataUmum, setDataUmum] = useState<any[]>([]);
    const [loadingPetra, setLoadingPetra] = useState(true);
    const [loadingUmum, setLoadingUmum] = useState(true);

    useEffect(() => {
        async function fetchData() {
        if (dataPetra.length === 0) {
            setLoadingPetra(true);
            try {
            const resPetra = await fetch('/api/lomba/internal', {
                credentials: 'include'
            })
            const rawDataPetra = await resPetra.json();

            const modifiedDataPetra = rawDataPetra.map((item: any) => ({
                Nama: item.user.name,
                Email: item.user.email,
                NRP: item.nrp,
                Angkatan: item.batch,
                Jurusan: item.major,
                Whatsapp: item.whatsapp,
                Category: item.category,
                KTM:`<a href="${item.ktmPath}" class="text-blue-600 hover:underline">View</a>`,
                BuktiPembayaran:`<a href="${item.proofOfPayment}" class="text-blue-600 hover:underline">View</a>`,
                Pembayaran: item.valid === false
                ? `<button class="btn-pay bg-blue-500 text-white px-4 py-2 rounded" data-href="lomba" data-id="${item.id}">Validasi</button>`
                : '<span class="text-green-500">Validated</span>',
            }));

            setDataPetra(modifiedDataPetra);
            } catch (error) {
            console.error('Failed fetching Petra:', error);
            }
            setLoadingPetra(false);
        }

        if (dataUmum.length === 0) {
            setLoadingUmum(true);
            try {
            const resUmum = await fetch('/api/lomba/external', {
                credentials: 'include'
            })
            const rawDataUmum = await resUmum.json();

            const modifiedDataUmum = rawDataUmum.map((item: any) => ({
                Nama: item.user.name,
                Email: item.user.email,
                Instance: item.instance,
                IDCard:`<a href="${item.idCard}" class="text-blue-600 hover:underline">View</a>`,
                Whatsapp: item.whatsapp,
                Category: item.category,
                BuktiPembayaran:`<a href="${item.proofOfPayment}" class="text-blue-600 hover:underline">View</a>`,
                Pembayaran: item.valid === false
                ? `<button class="btn-pay bg-blue-500 text-white px-4 py-2 rounded" data-href="lomba" data-id="${item.id}">Validasi</button>`
                : '<span class="text-green-500">Validated</span>',
            }));

            setDataUmum(modifiedDataUmum);
            } catch (error) {
            console.error('Failed fetching Umum:', error);
            }
            setLoadingUmum(false);
        }
        }

        fetchData();
    }, [dataPetra.length, dataUmum.length]);
    // Re-run only if data is empty

    return (
        <div className="min-h-screen p-6">
        <PageHeader title="Admin Innofashion Dashboard" />

        <div className="mt-8 md:ms-60">
            {/* Tabs navigation */}
            <ul
            className="mb-5 flex list-none flex-row flex-wrap border-b-0 pl-0"
            role="tablist"
            data-te-nav-ref
            >
            <li role="presentation" className="flex-auto text-center">
                <a
                href="#tabs-petra"
                className="my-2 block border-x-0 border-b-2 border-t-0 border-transparent px-7 pb-3.5 pt-4 text-xs font-medium uppercase leading-tight text-neutral-500 hover:isolate hover:border-transparent hover:bg-neutral-100 focus:isolate focus:border-transparent data-[te-nav-active]:border-primary data-[te-nav-active]:text-primary dark:text-neutral-400 dark:hover:bg-transparent dark:data-[te-nav-active]:border-primary-400 dark:data-[te-nav-active]:text-primary-400"
                data-te-toggle="pill"
                data-te-target="#tabs-petra"
                data-te-nav-active
                role="tab"
                aria-controls="tabs-petra"
                aria-selected="true"
                >
                Internal
                </a>
            </li>
            <li role="presentation" className="flex-auto text-center">
                <a
                href="#tabs-umum"
                className="my-2 block border-x-0 border-b-2 border-t-0 border-transparent px-7 pb-3.5 pt-4 text-xs font-medium uppercase leading-tight text-neutral-500 hover:isolate hover:border-transparent hover:bg-neutral-100 focus:isolate focus:border-transparent data-[te-nav-active]:border-primary data-[te-nav-active]:text-primary dark:text-neutral-400 dark:hover:bg-transparent dark:data-[te-nav-active]:border-primary-400 dark:data-[te-nav-active]:text-primary-400"
                data-te-toggle="pill"
                data-te-target="#tabs-umum"
                role="tab"
                aria-controls="tabs-umum"
                aria-selected="false"
                >
                External
                </a>
            </li>
            </ul>

            {/* Tabs content */}
            <div className="mb-6">
            <div
                className="hidden opacity-100 transition-opacity duration-150 ease-linear data-[te-tab-active]:block"
                id="tabs-petra"
                role="tabpanel"
                aria-labelledby="tabs-home-tab"
                data-te-tab-active
            >
                <Datatable
                id="dataTablePetra"
                data={dataPetra}
                loading={loadingPetra}
                renderColumns={['KTM','BuktiPembayaran', 'Pembayaran']} // render kolom HTML
                hideColumns={['status_pembayaran']} // hide kolom yang tidak mau ditampilkan
                />
            </div>
            <div
                className="hidden opacity-0 transition-opacity duration-150 ease-linear data-[te-tab-active]:block"
                id="tabs-umum"
                role="tabpanel"
                aria-labelledby="tabs-profile-tab"
            >
                <Datatable
                id="dataTableUmum"
                data={dataUmum}
                loading={loadingUmum}
                renderColumns={['Pembayaran']} // render kolom HTML
                // hide kolom yang tidak mau ditampilkan
                />
            </div>
            </div>

        </div>
        </div>
    );
}

export default AdminHomePage;