
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingStates } from '@/components/loading-states';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to Command Center as the default enterprise view
    router.push('/command-center');
  }, [router]);

  return (
    <LoadingStates.PageLoading message="Loading Enterprise Command Center..." />
  );
}
