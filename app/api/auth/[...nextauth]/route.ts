
/**
 * NextAuth API Route Handler
 * Handles authentication for RE:Commerce Enterprise
 */

import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth-config';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
export { authOptions };
