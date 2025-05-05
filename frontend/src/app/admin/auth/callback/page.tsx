import { Suspense } from 'react';
import AdminAuthCallbackClient from './callback-client';


export default function AdminAuthCallbackPage() {
  return (
    <Suspense fallback={<p>Loading callback data...</p>}>
      <AdminAuthCallbackClient />
    </Suspense>
  );
}