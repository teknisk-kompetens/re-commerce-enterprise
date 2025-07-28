
'use client';

import { SceneContainer } from '@/components/scene-container';

export default function DashboardPage() {
  return (
    <SceneContainer 
      initialScene="overview"
      autoPlay={false}
      autoPlayInterval={12000}
    />
  );
}
