
'use client';

import { SceneContainer } from '@/components/scene-container';
import { NewEnterpriseLayout } from '@/components/new-enterprise-layout';

export default function SceneDashboardPage() {
  return (
    <NewEnterpriseLayout useSceneNavigation={true}>
      <SceneContainer 
        initialScene="overview"
        autoPlay={false}
        autoPlayInterval={10000}
      />
    </NewEnterpriseLayout>
  );
}
