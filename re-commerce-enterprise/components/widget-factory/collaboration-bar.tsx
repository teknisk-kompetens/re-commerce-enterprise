
/**
 * CHUNK 1: OPTIMIZED COLLABORATION BAR
 * Memoized collaboration component
 */

'use client';

import React from 'react';
import { Users } from 'lucide-react';

interface Collaborator {
  id: string;
  name: string;
  avatar: string;
  status: 'active' | 'idle';
}

const collaborators: Collaborator[] = [
  { id: '1', name: 'John Doe', avatar: 'JD', status: 'active' },
  { id: '2', name: 'Jane Smith', avatar: 'JS', status: 'active' },
  { id: '3', name: 'Mike Johnson', avatar: 'MJ', status: 'idle' }
];

const CollaborationBar = React.memo(() => {
  return (
    <div className="flex items-center gap-2 mr-4">
      <Users className="h-4 w-4 text-gray-500 dark:text-gray-400" />
      <div className="flex -space-x-1">
        {collaborators.map((collaborator) => (
          <div
            key={collaborator.id}
            className={`w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-medium border-2 border-white dark:border-gray-900 ${
              collaborator.status === 'active' ? 'ring-2 ring-green-400' : ''
            }`}
            title={`${collaborator.name} (${collaborator.status})`}
          >
            {collaborator.avatar}
          </div>
        ))}
      </div>
    </div>
  );
});

CollaborationBar.displayName = 'CollaborationBar';

export default CollaborationBar;
