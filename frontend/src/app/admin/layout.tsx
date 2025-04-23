import { Metadata } from 'next';
import Navbar from './components/Navbar';
import './admin.css';  // Admin-specific styles (optional)

// Metadata for the admin section
export const metadata: Metadata = {
  title: 'Admin Panel',  // Title for the admin section
  description: 'Admin dashboard for managing the app.', // Description specific to the admin section
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Admin-specific metadata */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="UTF-8" />
        <meta name="description" content="Admin dashboard for managing the app." />
        <meta name="keywords" content="admin, dashboard, nextjs, react" />
        <title>Admin Innofashion 7</title>
      </head>
      <body className="antialiased">
            <Navbar></Navbar>
            {children}{/* Render child components (pages) */}
      </body>
    </html>
  );
}