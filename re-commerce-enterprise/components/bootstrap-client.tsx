
'use client';

import { useEffect } from 'react';

export function BootstrapClient() {
  useEffect(() => {
    // Dynamically import Bootstrap JS
    import('bootstrap/dist/js/bootstrap.bundle.min.js').then((bootstrap) => {
      // Initialize Bootstrap components
      const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
      const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
      
      const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
      const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));
    });
  }, []);

  return null;
}
