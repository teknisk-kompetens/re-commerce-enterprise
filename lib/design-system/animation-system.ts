
/**
 * Animation System with Framer Motion Integration
 * Respects user motion preferences and provides consistent animations
 */

import { Variants, Transition } from 'framer-motion';

// Motion configuration based on user preferences
export const getMotionConfig = (reducedMotion: boolean = false) => ({
  duration: reducedMotion ? 0.01 : 0.3,
  ease: reducedMotion ? 'linear' : [0.4, 0.0, 0.2, 1],
  damping: reducedMotion ? 100 : 20,
  stiffness: reducedMotion ? 1000 : 300
});

// Common animation variants
export const fadeInVariants: Variants = {
  hidden: { 
    opacity: 0,
    transition: { duration: 0.01 }
  },
  visible: { 
    opacity: 1,
    transition: { duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }
  }
};

export const slideUpVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 24,
    transition: { duration: 0.01 }
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.4, 
      ease: [0.4, 0.0, 0.2, 1],
      opacity: { duration: 0.25 }
    }
  }
};

export const slideDownVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: -24,
    transition: { duration: 0.01 }
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.4, 
      ease: [0.4, 0.0, 0.2, 1],
      opacity: { duration: 0.25 }
    }
  }
};

export const slideInFromLeftVariants: Variants = {
  hidden: { 
    opacity: 0, 
    x: -24,
    transition: { duration: 0.01 }
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.4, 
      ease: [0.4, 0.0, 0.2, 1],
      opacity: { duration: 0.25 }
    }
  }
};

export const slideInFromRightVariants: Variants = {
  hidden: { 
    opacity: 0, 
    x: 24,
    transition: { duration: 0.01 }
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.4, 
      ease: [0.4, 0.0, 0.2, 1],
      opacity: { duration: 0.25 }
    }
  }
};

export const scaleInVariants: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.95,
    transition: { duration: 0.01 }
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.3, 
      ease: [0.4, 0.0, 0.2, 1],
      scale: { 
        type: 'spring', 
        damping: 20, 
        stiffness: 300 
      }
    }
  }
};

export const staggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

export const staggerItemVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 16,
    transition: { duration: 0.01 }
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.4, 
      ease: [0.4, 0.0, 0.2, 1]
    }
  }
};

// Button interaction variants
export const buttonHoverVariants: Variants = {
  idle: { 
    scale: 1,
    transition: { duration: 0.15, ease: [0.4, 0.0, 0.2, 1] }
  },
  hover: { 
    scale: 1.02,
    transition: { duration: 0.15, ease: [0.4, 0.0, 0.2, 1] }
  },
  tap: { 
    scale: 0.98,
    transition: { duration: 0.1, ease: [0.4, 0.0, 0.2, 1] }
  }
};

export const cardHoverVariants: Variants = {
  idle: { 
    y: 0,
    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    transition: { duration: 0.2, ease: [0.4, 0.0, 0.2, 1] }
  },
  hover: { 
    y: -2,
    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    transition: { duration: 0.2, ease: [0.4, 0.0, 0.2, 1] }
  }
};

// Modal and overlay variants
export const modalBackdropVariants: Variants = {
  hidden: { 
    opacity: 0,
    transition: { duration: 0.15 }
  },
  visible: { 
    opacity: 1,
    transition: { duration: 0.2, ease: [0.4, 0.0, 0.2, 1] }
  }
};

export const modalContentVariants: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.95,
    y: 8,
    transition: { duration: 0.15 }
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: { 
      duration: 0.25, 
      ease: [0.4, 0.0, 0.2, 1],
      scale: { 
        type: 'spring', 
        damping: 25, 
        stiffness: 400 
      }
    }
  }
};

// Navigation variants
export const navigationVariants: Variants = {
  closed: {
    x: '-100%',
    transition: { duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }
  },
  open: {
    x: 0,
    transition: { duration: 0.4, ease: [0.4, 0.0, 0.2, 1] }
  }
};

// Loading spinner variants
export const spinnerVariants: Variants = {
  rotate: {
    rotate: 360,
    transition: { 
      duration: 1, 
      ease: 'linear', 
      repeat: Infinity 
    }
  }
};

// Progress bar variants
export const progressBarVariants: Variants = {
  initial: { width: '0%' },
  animate: (progress: number) => ({
    width: `${progress}%`,
    transition: { duration: 0.5, ease: [0.4, 0.0, 0.2, 1] }
  })
};

// Toast notification variants
export const toastVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: -50, 
    scale: 0.95,
    transition: { duration: 0.15 }
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      duration: 0.35, 
      ease: [0.4, 0.0, 0.2, 1],
      scale: { 
        type: 'spring', 
        damping: 20, 
        stiffness: 400 
      }
    }
  },
  exit: { 
    opacity: 0, 
    y: -50, 
    scale: 0.95,
    transition: { duration: 0.2, ease: [0.4, 0.0, 1, 1] }
  }
};

// Accordion variants
export const accordionVariants: Variants = {
  collapsed: { 
    height: 0, 
    opacity: 0,
    transition: { duration: 0.25, ease: [0.4, 0.0, 0.2, 1] }
  },
  expanded: { 
    height: 'auto', 
    opacity: 1,
    transition: { 
      duration: 0.35, 
      ease: [0.4, 0.0, 0.2, 1],
      height: { duration: 0.3 },
      opacity: { duration: 0.25, delay: 0.05 }
    }
  }
};

// Page transition variants
export const pageTransitionVariants: Variants = {
  initial: { 
    opacity: 0, 
    x: 8,
    transition: { duration: 0.01 }
  },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.4, 
      ease: [0.4, 0.0, 0.2, 1],
      opacity: { duration: 0.3 }
    }
  },
  exit: { 
    opacity: 0, 
    x: -8,
    transition: { duration: 0.25, ease: [0.4, 0.0, 1, 1] }
  }
};

// Utility functions for motion
export function getStaggerDelay(index: number, baseDelay: number = 0.05): number {
  return baseDelay * index;
}

export function createStaggerTransition(childrenCount: number, staggerDelay: number = 0.05): Transition {
  return {
    staggerChildren: staggerDelay,
    delayChildren: 0.1,
    when: 'beforeChildren'
  };
}

// Responsive motion preferences
export function useReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Motion-safe wrapper function
export function motionSafe<T>(motionVariants: T, staticVariants?: Partial<T>): T | Partial<T> {
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return staticVariants || {};
  }
  return motionVariants;
}

// Default transitions
export const defaultTransition: Transition = {
  duration: 0.3,
  ease: [0.4, 0.0, 0.2, 1]
};

export const springTransition: Transition = {
  type: 'spring',
  damping: 20,
  stiffness: 300
};

export const fastTransition: Transition = {
  duration: 0.15,
  ease: [0.4, 0.0, 0.2, 1]
};

export const slowTransition: Transition = {
  duration: 0.5,
  ease: [0.4, 0.0, 0.2, 1]
};
