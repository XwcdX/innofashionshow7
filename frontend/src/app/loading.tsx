'use client';

import BrandedLoader from './components/BrandedLoader';

export default function Loading() {
  return <BrandedLoader isLoading={true} message="Loading page..." />;
}