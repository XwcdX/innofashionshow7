import PageHeader from './components/PageHeader';

export default function AdminHomePage() {
  return (
    <div className="min-h-screen p-6">
      {/* Dynamic title header */}
      <PageHeader title="Admin Innofashion Dashboard" />

      {/* Main content */}
      <div className="mt-8 md:ms-60">
        <p className="text-lg text-gray-700">
          Welcome to the admin panel. Here you can manage applicants and more.
        </p>
      </div>
    </div>
  );
}
