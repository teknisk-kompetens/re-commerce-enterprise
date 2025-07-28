/**
 * SIMPLIFIED INSTRUMENTATION FOR TESTING
 * Temporarily disabled complex monitoring
 */

export async function register() {
  // Simplified instrumentation - just log that it's running
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    console.log('Instrumentation initialized (simplified mode)');
  }
}
