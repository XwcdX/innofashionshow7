'use client';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import PageHeader from '../components/PageHeader';

const Datatable = dynamic(
    () => import('../components/Datatable'),
    { ssr: false }
    );

const AllCreation = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);


    useEffect(() => {
        async function fetchData() {
            if (data.length === 0) {
                setLoading(true);
                try {
                const res = await fetch('/api/creation/allCreation', {
                    credentials: 'include'
                })
                const rawData = await res.json();

                const modifiedData = rawData.map((item: any) => ({
                    Nama: item.contest.user.name,
                    Email: item.contest.user.email,
                    Type: item.contest.user.type,
                    Category: item.contest.category,
                    Creation:`<a href="${item.creationPath}" target="_blank" class='text-blue-600 hover:underline'>View</a>`,
                    Concept:`<a href="${item.conceptPath}" target="_blank" class='text-blue-600 hover:underline'>View</a>`,
                }));

                setData(modifiedData);
                } catch (error) {
                    console.error('Failed fetching All Creation:', error);
                }
                setLoading(false);
            }
        }

        fetchData();
    }, [data.length]);
    
    const dataExternal = data.filter(item => {
        const typeMatch = item.Type === 'EXTERNAL';
        return typeMatch;
    });

    console.log(dataExternal);

    const dataInternal = data.filter(item => {
        const typeMatch = item.Type === 'INTERNAL';
        return typeMatch;
    });

    console.log(dataInternal);

    return (
        <div className="min-h-screen p-6">
            <PageHeader title="All Submitted Creations" />
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
                        data={dataInternal}
                        loading={loading}
                        renderColumns={['Concept','Creation']} // render kolom HTML
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
                        data={dataExternal}
                        loading={loading}
                        renderColumns={['Creation', 'Concept']} // render kolom HTML
                        // hide kolom yang tidak mau ditampilkan
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}

export default AllCreation;