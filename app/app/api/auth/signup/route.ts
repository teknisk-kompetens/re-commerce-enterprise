
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, companyName, companyDomain } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create company if provided
    let company = null;
    if (companyName && companyDomain) {
      // Check if company already exists
      const existingCompany = await prisma.company.findUnique({
        where: { domain: companyDomain }
      });

      if (existingCompany) {
        company = existingCompany;
      } else {
        company = await prisma.company.create({
          data: {
            name: companyName,
            domain: companyDomain,
            plan: 'BASIC'
          }
        });
      }
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        companyId: company?.id,
        role: company ? 'ENTERPRISE' : 'USER'
      },
      include: {
        company: true
      }
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      message: 'User created successfully',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
