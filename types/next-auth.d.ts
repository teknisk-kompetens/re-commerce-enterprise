
import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT, DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      role: string;
      tenantId: string;
      tenant: {
        id: string;
        name: string;
        domain: string;
        plan: string;
        isActive: boolean;
      };
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    id: string;
    email: string;
    name?: string | null;
    role: string;
    tenantId: string;
    tenant: {
      id: string;
      name: string;
      domain: string;
      plan: string;
      isActive: boolean;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    role: string;
    tenantId: string;
    tenant: {
      id: string;
      name: string;
      domain: string;
      plan: string;
      isActive: boolean;
    };
  }
}
