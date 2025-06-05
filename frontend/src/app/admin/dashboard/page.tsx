'use client';
import { useEffect, useState } from 'react';
import PageHeader from './components/PageHeader';
import Datatable from './components/Datatable';

export const dynamic = 'force-dynamic';

enum TalkshowType {
  TALKSHOW_1 = "TALKSHOW_1",
  TALKSHOW_2 = "TALKSHOW_2",
  WEBINAR = "WEBINAR"
}

const TalkshowPage = () => {
    const [dataPetra, setDataPetra] = useState<any[]>([]);
    const [dataUmum, setDataUmum] = useState<any[]>([]);
    const [loadingPetra, setLoadingPetra] = useState(true);
    const [loadingUmum, setLoadingUmum] = useState(true);
    const [selectedType, setSelectedType] = useState<TalkshowType>(TalkshowType.TALKSHOW_1);

    useEffect(() => {
        async function fetchData() {
            if (dataPetra.length === 0) {
                setLoadingPetra(true);
                try {
                    const resPetra = await fetch('/api/talkshow_admin/petra', {
                        credentials: 'include'
                    })
                    const rawDataPetra = await resPetra.json();

                    const modifiedDataPetra = rawDataPetra.map((item: any) => ({
                        Nama: item.user.name,
                        Email: item.user.email,
                        NRP: item.nrp,
                        Jurusan: item.jurusan,
                        Whatsapp: item.wa,
                        IDLine: item.idline,
                        type: item.type,
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
                    const resUmum = await fetch('/api/talkshow_admin/umum', {
                        credentials: 'include'
                    })
                    const rawDataUmum = await resUmum.json();

                    const modifiedDataUmum = rawDataUmum.map((item: any) => ({
                        Nama: item.user.name,
                        Email: item.user.email,
                        Whatsapp: item.wa,
                        IDLine: item.idline,
                        type: item.type,
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

    const filteredDataPetra = dataPetra.filter((item: any) => item.type === selectedType);
    const filteredDataUmum = dataUmum.filter((item: any) => item.type === selectedType);

    return (
        <div className="min-h-screen p-6">
            <PageHeader title="Admin Innofashion Dashboard" />

            <div className="mt-8 md:ms-60">
              {/* Dropdown Filter */}
                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                        Filter berdasarkan tipe:
                    </label>
                    <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value as TalkshowType)}
                        className="block w-full md:w-64 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                    >
                        <option value={TalkshowType.TALKSHOW_1}>Talkshow 1</option>
                        <option value={TalkshowType.TALKSHOW_2}>Talkshow 2</option>
                        <option value={TalkshowType.WEBINAR}>Webinar</option>
                    </select>
                </div>
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
                            Petra
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
                            Umum
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
                            data={filteredDataPetra}
                            loading={loadingPetra}
                            hideColumns={['type']}
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
                            data={filteredDataUmum}
                            loading={loadingUmum}
                            hideColumns={['type']}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}

export default TalkshowPage;