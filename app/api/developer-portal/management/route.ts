
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Get developer portal information
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const developerId = searchParams.get('developerId');
    const status = searchParams.get('status');
    const verificationLevel = searchParams.get('verificationLevel');

    if (!developerId) {
      // Get all developer portals (admin view)
      const whereClause = {
        ...(status && { status }),
        ...(verificationLevel && { verificationLevel })
      };

      const [portals, total] = await Promise.all([
        prisma.developerPortal.findMany({
          where: whereClause,
          include: {
            apps: {
              select: {
                id: true,
                name: true,
                status: true,
                downloads: true,
                rating: true
              }
            },
            apiKeys: {
              where: { isActive: true },
              select: {
                id: true,
                name: true,
                environment: true,
                quotaUsed: true,
                quotaLimit: true
              }
            },
            _count: {
              select: {
                apps: true,
                apiKeys: true
              }
            }
          },
          orderBy: { joinedAt: 'desc' }
        }),
        prisma.developerPortal.count({ where: whereClause })
      ]);

      return NextResponse.json({ portals, total });
    }

    // Get specific developer portal
    const portal = await prisma.developerPortal.findUnique({
      where: { developerId },
      include: {
        apps: {
          include: {
            installations: {
              select: {
                status: true,
                installedAt: true
              }
            },
            reviewRecords: {
              select: {
                rating: true,
                verified: true
              }
            },
            revenues: {
              where: {
                period: {
                  gte: new Date(new Date().getFullYear(), new Date().getMonth() - 11, 1).toISOString().substring(0, 7)
                }
              },
              orderBy: { period: 'desc' }
            }
          }
        },
        apiKeys: {
          where: { isActive: true }
        }
      }
    });

    if (!portal) {
      return NextResponse.json({ error: 'Developer portal not found' }, { status: 404 });
    }

    // Calculate developer metrics
    const totalDownloads = portal.apps.reduce((sum, app) => sum + app.downloads, 0);
    const totalRevenue = portal.apps.reduce((sum, app) => 
      sum + app.revenues.reduce((appSum, rev) => appSum + Number(rev.developerShare), 0), 0
    );
    const activeInstalls = portal.apps.reduce((sum, app) => 
      sum + app.installations.filter(i => i.status === 'installed').length, 0
    );
    const avgRating = portal.apps.length > 0 
      ? portal.apps.reduce((sum, app) => sum + app.rating, 0) / portal.apps.length 
      : 0;

    const portalWithMetrics = {
      ...portal,
      metrics: {
        totalDownloads,
        totalRevenue: totalRevenue / 100, // Convert from cents
        activeInstalls,
        avgRating: Math.round(avgRating * 100) / 100,
        totalApps: portal.apps.length,
        publishedApps: portal.apps.filter(app => app.status === 'published').length
      }
    };

    return NextResponse.json({ portal: portalWithMetrics });

  } catch (error) {
    console.error('Error fetching developer portal:', error);
    return NextResponse.json({ error: 'Failed to fetch developer portal' }, { status: 500 });
  }
}

// Create developer portal
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      developerId, 
      companyName, 
      website, 
      description, 
      logo, 
      contactEmail,
      payoutMethod,
      bankDetails
    } = body;

    if (!developerId || !contactEmail) {
      return NextResponse.json({ 
        error: 'Missing required fields: developerId, contactEmail' 
      }, { status: 400 });
    }

    // Check if developer portal already exists
    const existingPortal = await prisma.developerPortal.findUnique({
      where: { developerId }
    });

    if (existingPortal) {
      return NextResponse.json({ error: 'Developer portal already exists' }, { status: 400 });
    }

    const portal = await prisma.developerPortal.create({
      data: {
        developerId,
        companyName,
        website,
        description,
        logo,
        contactEmail,
        payoutMethod: payoutMethod || {},
        bankDetails: bankDetails || {},
        settings: {
          emailNotifications: true,
          webhookNotifications: false,
          analyticsSharing: true
        }
      }
    });

    // Create default API key
    await prisma.developerAPIKey.create({
      data: {
        portalId: portal.id,
        keyId: `dev_${generateApiKeyId()}`,
        name: 'Default API Key',
        key: generateApiKey(),
        scopes: ['read', 'write'],
        environment: 'sandbox',
        quotaResetAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    });

    return NextResponse.json({ portal }, { status: 201 });

  } catch (error) {
    console.error('Error creating developer portal:', error);
    return NextResponse.json({ error: 'Failed to create developer portal' }, { status: 500 });
  }
}

// Update developer portal
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      developerId,
      companyName, 
      website, 
      description, 
      logo, 
      contactEmail,
      verificationLevel,
      revenueShare,
      payoutMethod,
      bankDetails,
      status,
      settings
    } = body;

    if (!developerId) {
      return NextResponse.json({ error: 'Developer ID required' }, { status: 400 });
    }

    const portal = await prisma.developerPortal.update({
      where: { developerId },
      data: {
        ...(companyName && { companyName }),
        ...(website && { website }),
        ...(description && { description }),
        ...(logo && { logo }),
        ...(contactEmail && { contactEmail }),
        ...(verificationLevel && { verificationLevel }),
        ...(revenueShare && { revenueShare }),
        ...(payoutMethod && { payoutMethod }),
        ...(bankDetails && { bankDetails }),
        ...(status && { status }),
        ...(settings && { settings }),
        lastActiveAt: new Date()
      },
      include: {
        apps: true,
        apiKeys: {
          where: { isActive: true }
        }
      }
    });

    return NextResponse.json({ portal });

  } catch (error) {
    console.error('Error updating developer portal:', error);
    return NextResponse.json({ error: 'Failed to update developer portal' }, { status: 500 });
  }
}

// Helper functions
function generateApiKeyId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function generateApiKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
