
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Get API documentation
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');
    const version = searchParams.get('version');
    const published = searchParams.get('published') === 'true';

    const whereClause = {
      ...(name && { name }),
      ...(version && { version }),
      ...(published !== undefined && { isPublished: published })
    };

    const [documentations, total] = await Promise.all([
      prisma.aPIDocumentation.findMany({
        where: whereClause,
        include: {
          schemas: {
            orderBy: { schemaName: 'asc' }
          },
          examples: {
            orderBy: [{ endpointPath: 'asc' }, { method: 'asc' }, { order: 'asc' }]
          }
        },
        orderBy: [{ name: 'asc' }, { version: 'desc' }]
      }),
      prisma.aPIDocumentation.count({ where: whereClause })
    ]);

    // Group examples by endpoint and method
    const docsWithGroupedExamples = documentations.map(doc => {
      const examplesByEndpoint = doc.examples.reduce((acc, example) => {
        const key = `${example.method} ${example.endpointPath}`;
        if (!acc[key]) acc[key] = [];
        acc[key].push(example);
        return acc;
      }, {} as Record<string, typeof doc.examples>);

      return {
        ...doc,
        groupedExamples: examplesByEndpoint
      };
    });

    return NextResponse.json({
      documentations: docsWithGroupedExamples,
      total
    });

  } catch (error) {
    console.error('Error fetching API documentation:', error);
    return NextResponse.json({ error: 'Failed to fetch API documentation' }, { status: 500 });
  }
}

// Create API documentation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      gatewayId,
      name, 
      version, 
      title, 
      description, 
      basePath,
      schemes,
      consumes,
      produces,
      openAPISpec,
      authTypes,
      tags,
      contact,
      license
    } = body;

    if (!name || !version || !title || !description) {
      return NextResponse.json({ 
        error: 'Missing required fields: name, version, title, description' 
      }, { status: 400 });
    }

    const documentation = await prisma.aPIDocumentation.create({
      data: {
        gatewayId,
        name,
        version,
        title,
        description,
        basePath,
        schemes: schemes || ['https'],
        consumes: consumes || ['application/json'],
        produces: produces || ['application/json'],
        openAPISpec: openAPISpec || generateBasicOpenAPISpec(title, description, version),
        authTypes: authTypes || ['apiKey'],
        tags: tags || [],
        contact: contact || {},
        license: license || {}
      },
      include: {
        schemas: true,
        examples: true
      }
    });

    return NextResponse.json({ documentation }, { status: 201 });

  } catch (error) {
    console.error('Error creating API documentation:', error);
    return NextResponse.json({ error: 'Failed to create API documentation' }, { status: 500 });
  }
}

// Update API documentation
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      id,
      title, 
      description, 
      basePath,
      openAPISpec,
      isPublished,
      authTypes,
      tags,
      contact,
      license
    } = body;

    if (!id) {
      return NextResponse.json({ error: 'Documentation ID required' }, { status: 400 });
    }

    const documentation = await prisma.aPIDocumentation.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(basePath && { basePath }),
        ...(openAPISpec && { openAPISpec }),
        ...(isPublished !== undefined && { isPublished }),
        ...(authTypes && { authTypes }),
        ...(tags && { tags }),
        ...(contact && { contact }),
        ...(license && { license })
      },
      include: {
        schemas: true,
        examples: true
      }
    });

    return NextResponse.json({ documentation });

  } catch (error) {
    console.error('Error updating API documentation:', error);
    return NextResponse.json({ error: 'Failed to update API documentation' }, { status: 500 });
  }
}

// Generate OpenAPI specification
function generateBasicOpenAPISpec(title: string, description: string, version: string) {
  return {
    openapi: '3.0.0',
    info: {
      title,
      description,
      version,
      contact: {
        name: 'API Support',
        email: 'api-support@re-commerce.se'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'https://api.re-commerce.se/v1',
        description: 'Production server'
      },
      {
        url: 'https://staging-api.re-commerce.se/v1',
        description: 'Staging server'
      }
    ],
    paths: {},
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'X-API-Key'
        },
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {},
      responses: {
        UnauthorizedError: {
          description: 'API key is missing or invalid',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: { type: 'string' },
                  message: { type: 'string' }
                }
              }
            }
          }
        },
        NotFoundError: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: { type: 'string' },
                  message: { type: 'string' }
                }
              }
            }
          }
        }
      }
    },
    security: [
      { ApiKeyAuth: [] },
      { BearerAuth: [] }
    ]
  };
}
