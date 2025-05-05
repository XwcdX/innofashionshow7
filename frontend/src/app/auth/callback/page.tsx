import { Suspense } from 'react';
import AuthCallbackClient from './callback-client';


export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<p>Loading callback data...</p>}>
      <AuthCallbackClient />
    </Suspense>
  );
}