// app/admin/page.tsx

import PageHeader from './components/PageHeader';
import Datatable from './components/Datatable';

// This is a server component because it's inside the `app/` folder
const AdminHomePage = async () => {
  // Use the environment variable to get the API URL
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/talkshows`;

  // Fetch data from the API using the URL from the environment variable
  const res = await fetch(apiUrl);
  const data = await res.json();

  return (
    <div className="min-h-screen p-6">
      {/* Dynamic title header */}
      <PageHeader title="Admin Innofashion Dashboard" />

      {/* Main content */}
      <div className="mt-8 md:ms-60">
        {/*Datatable */}
        <Datatable data={data} />
      </div>
    </div>
  );
}

export default AdminHomePage;