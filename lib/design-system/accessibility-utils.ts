
/**
 * Accessibility Utilities for WCAG 2.1 AA Compliance
 */

// Color contrast calculation utilities
export function luminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

export function contrastRatio(color1: [number, number, number], color2: [number, number, number]): number {
  const lum1 = luminance(...color1);
  const lum2 = luminance(...color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

export function hexToRgb(hex: string): [number, number, number] | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : null;
}

export function isAccessibleContrast(
  foregroundColor: string, 
  backgroundColor: string, 
  level: 'AA' | 'AAA' = 'AA'
): boolean {
  const fg = hexToRgb(foregroundColor);
  const bg = hexToRgb(backgroundColor);
  
  if (!fg || !bg) return false;
  
  const ratio = contrastRatio(fg, bg);
  const threshold = level === 'AAA' ? 7 : 4.5;
  
  return ratio >= threshold;
}

// Focus management utilities
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]'
  ].join(', ');
  
  return Array.from(container.querySelectorAll(focusableSelectors)) as HTMLElement[];
}

export function trapFocus(container: HTMLElement) {
  const focusableElements = getFocusableElements(container);
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleTabKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Tab') return;

    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    }
  };

  container.addEventListener('keydown', handleTabKeyDown);
  
  // Return cleanup function
  return () => {
    container.removeEventListener('keydown', handleTabKeyDown);
  };
}

// Screen reader utilities
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

// Keyboard navigation utilities
export const KeyboardKeys = {
  ENTER: 'Enter',
  SPACE: ' ',
  TAB: 'Tab',
  ESCAPE: 'Escape',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  HOME: 'Home',
  END: 'End',
  PAGE_UP: 'PageUp',
  PAGE_DOWN: 'PageDown'
} as const;

export function handleArrowKeyNavigation(
  event: KeyboardEvent,
  items: HTMLElement[],
  currentIndex: number,
  options?: {
    loop?: boolean;
    orientation?: 'horizontal' | 'vertical';
  }
): number {
  const { loop = true, orientation = 'vertical' } = options || {};
  
  let nextIndex = currentIndex;
  
  switch (event.key) {
    case KeyboardKeys.ARROW_UP:
      if (orientation === 'vertical') {
        event.preventDefault();
        nextIndex = currentIndex > 0 ? currentIndex - 1 : (loop ? items.length - 1 : 0);
      }
      break;
      
    case KeyboardKeys.ARROW_DOWN:
      if (orientation === 'vertical') {
        event.preventDefault();
        nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : (loop ? 0 : items.length - 1);
      }
      break;
      
    case KeyboardKeys.ARROW_LEFT:
      if (orientation === 'horizontal') {
        event.preventDefault();
        nextIndex = currentIndex > 0 ? currentIndex - 1 : (loop ? items.length - 1 : 0);
      }
      break;
      
    case KeyboardKeys.ARROW_RIGHT:
      if (orientation === 'horizontal') {
        event.preventDefault();
        nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : (loop ? 0 : items.length - 1);
      }
      break;
      
    case KeyboardKeys.HOME:
      event.preventDefault();
      nextIndex = 0;
      break;
      
    case KeyboardKeys.END:
      event.preventDefault();
      nextIndex = items.length - 1;
      break;
  }
  
  if (nextIndex !== currentIndex && items[nextIndex]) {
    items[nextIndex].focus();
  }
  
  return nextIndex;
}

// Touch target utilities
export function isValidTouchTarget(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  const minSize = 44; // WCAG 2.1 minimum touch target size in pixels
  
  return rect.width >= minSize && rect.height >= minSize;
}

// ARIA utilities
export function generateId(prefix: string = 'component'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

export function setAriaExpanded(element: HTMLElement, expanded: boolean) {
  element.setAttribute('aria-expanded', expanded.toString());
}

export function setAriaSelected(element: HTMLElement, selected: boolean) {
  element.setAttribute('aria-selected', selected.toString());
}

export function setAriaChecked(element: HTMLElement, checked: boolean | 'mixed') {
  element.setAttribute('aria-checked', checked.toString());
}

// Motion preference utilities
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function getAccessibleTransition(
  duration: number = 300,
  easing: string = 'ease-out'
): string {
  if (prefersReducedMotion()) {
    return 'none';
  }
  return `all ${duration}ms ${easing}`;
}

// Form accessibility utilities
export function associateLabel(input: HTMLElement, label: HTMLElement): void {
  const inputId = input.id || generateId('input');
  input.id = inputId;
  label.setAttribute('for', inputId);
}

export function setFieldError(input: HTMLElement, errorMessage: string): void {
  const errorId = generateId('error');
  
  // Create or update error element
  let errorElement = document.getElementById(errorId);
  if (!errorElement) {
    errorElement = document.createElement('div');
    errorElement.id = errorId;
    errorElement.className = 'text-error-600 text-sm mt-1';
    errorElement.setAttribute('role', 'alert');
    input.parentNode?.insertBefore(errorElement, input.nextSibling);
  }
  
  errorElement.textContent = errorMessage;
  input.setAttribute('aria-describedby', errorId);
  input.setAttribute('aria-invalid', 'true');
}

export function clearFieldError(input: HTMLElement): void {
  const errorId = input.getAttribute('aria-describedby');
  if (errorId) {
    const errorElement = document.getElementById(errorId);
    errorElement?.remove();
    input.removeAttribute('aria-describedby');
    input.removeAttribute('aria-invalid');
  }
}

// Export commonly used ARIA roles and properties
export const AriaRoles = {
  BUTTON: 'button',
  LINK: 'link',
  MENU: 'menu',
  MENUITEM: 'menuitem',
  TAB: 'tab',
  TABPANEL: 'tabpanel',
  DIALOG: 'dialog',
  ALERT: 'alert',
  STATUS: 'status',
  REGION: 'region',
  NAVIGATION: 'navigation',
  MAIN: 'main',
  COMPLEMENTARY: 'complementary',
  BANNER: 'banner',
  CONTENTINFO: 'contentinfo',
  SEARCH: 'search'
} as const;

export const AriaProperties = {
  EXPANDED: 'aria-expanded',
  SELECTED: 'aria-selected',
  CHECKED: 'aria-checked',
  DISABLED: 'aria-disabled',
  HIDDEN: 'aria-hidden',
  LABEL: 'aria-label',
  LABELLEDBY: 'aria-labelledby',
  DESCRIBEDBY: 'aria-describedby',
  CONTROLS: 'aria-controls',
  OWNS: 'aria-owns',
  HASPOPUP: 'aria-haspopup',
  LIVE: 'aria-live',
  ATOMIC: 'aria-atomic',
  RELEVANT: 'aria-relevant'
} as const;
