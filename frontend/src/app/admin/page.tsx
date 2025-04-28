'use client';
import { useEffect, useState } from 'react';
import PageHeader from './components/PageHeader';
import Datatable from './components/Datatable';

const AdminHomePage = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data only if data is not already fetched
  useEffect(() => {
    async function fetchData() {
      if (data.length === 0) { // check if data is already loaded
        setLoading(true);
        console.log('API URL:', `${process.env.NEXT_PUBLIC_API_URL}/talkshows/petra`);

        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/talkshows/petra`;
        const res = await fetch(apiUrl);
        const rawData = await res.json();

        // Manipulasi data
        const modifiedData = rawData.map((item: any) => ({
          Nama: item.nama,
          NRP: item.nrp,
          Jurusan: item.jurusan,
          Whatsapp: item.wa,
          IDLine: item.idline,
          Pembayaran: item.status_pembayaran === 0
            ? '<button class="btn-pay bg-blue-500 text-white px-4 py-2 rounded">Validasi</button>'
            : '<span class="text-green-500">Validated</span>',
        }));

        setData(modifiedData);
        setLoading(false);
      }
    }

    fetchData();
  }, [data]); // Re-run only if data is empty

  return (
    <div className="min-h-screen p-6">
      <PageHeader title="Admin Innofashion Dashboard" />

      <div className="mt-8 md:ms-60">
        <Datatable
          data={data}
          loading={loading}
          renderColumns={['action']} // render kolom HTML
          hideColumns={['status_pembayaran']} // hide kolom yang tidak mau ditampilkan
        />
      </div>
    </div>
  );
}

export default AdminHomePage;
