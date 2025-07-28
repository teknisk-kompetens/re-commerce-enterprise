
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GraphQL endpoint handler
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, variables, operationName } = body;

    if (!query) {
      return NextResponse.json({ 
        errors: [{ message: 'Query is required' }] 
      }, { status: 400 });
    }

    // Get current schema version
    const schema = await prisma.graphQLSchema.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    });

    if (!schema) {
      return NextResponse.json({ 
        errors: [{ message: 'No active GraphQL schema found' }] 
      }, { status: 500 });
    }

    const startTime = Date.now();

    // Generate query hash for caching and analytics
    const crypto = require('crypto');
    const queryHash = crypto.createHash('sha256').update(query).digest('hex');

    // Log query for analytics
    const queryRecord = await prisma.graphQLQuery.create({
      data: {
        schemaId: schema.id,
        query,
        variables: variables || {},
        operationName,
        queryHash,
        complexity: calculateQueryComplexity(query),
        depth: calculateQueryDepth(query),
        executionTime: 0, // Will be updated after execution
        status: 'success', // Will be updated based on result
        userId: request.headers.get('x-user-id') || undefined,
        apiKey: request.headers.get('x-api-key') || undefined,
        userAgent: request.headers.get('user-agent') || undefined,
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined
      }
    });

    let result: any = {};
    let errors: any[] = [];

    try {
      // Execute GraphQL query
      result = await executeGraphQLQuery(query, variables, schema);
      
      if (result.errors) {
        errors = result.errors;
      }

    } catch (error: any) {
      errors = [{ message: error.message }];
    }

    const executionTime = Date.now() - startTime;

    // Update query record with results
    await prisma.graphQLQuery.update({
      where: { id: queryRecord.id },
      data: {
        executionTime,
        status: errors.length > 0 ? 'error' : 'success',
        result: result.data || null,
        errorMessage: errors.length > 0 ? JSON.stringify(errors) : undefined
      }
    });

    // Return GraphQL response
    const response: any = {};
    if (result.data) response.data = result.data;
    if (errors.length > 0) response.errors = errors;

    return NextResponse.json(response);

  } catch (error) {
    console.error('GraphQL execution error:', error);
    return NextResponse.json({ 
      errors: [{ message: 'Internal server error' }] 
    }, { status: 500 });
  }
}

// GET request for GraphQL schema introspection
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const introspection = searchParams.get('introspection') === 'true';

    if (introspection) {
      // Return GraphQL schema for introspection
      const schema = await prisma.graphQLSchema.findFirst({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' }
      });

      if (!schema) {
        return NextResponse.json({ 
          error: 'No active GraphQL schema found' 
        }, { status: 404 });
      }

      return NextResponse.json({
        schema: schema.schema,
        version: schema.version,
        description: schema.description
      });
    }

    // Return GraphQL playground/documentation
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>GraphQL Playground</title>
          <link rel="stylesheet" href="https://unpkg.com/graphql-playground-react/build/static/css/index.css" />
        </head>
        <body>
          <div id="root">
            <style>
              body { margin: 0; font-family: system-ui; }
              #root { height: 100vh; }
            </style>
            <div style="padding: 20px; text-align: center;">
              <h1>GraphQL API Endpoint</h1>
              <p>Send POST requests to this endpoint with GraphQL queries.</p>
              <p>Add <code>?introspection=true</code> to get the schema.</p>
              <div style="margin: 20px 0; padding: 20px; background: #f5f5f5; border-radius: 8px;">
                <h3>Example Query:</h3>
                <pre style="text-align: left; background: white; padding: 15px; border-radius: 4px;">
{
  "query": "{ users { id name email } }",
  "variables": {},
  "operationName": null
}</pre>
              </div>
              <div style="margin: 20px 0;">
                <h3>Available Operations:</h3>
                <ul style="text-align: left; max-width: 600px; margin: 0 auto;">
                  <li>Query users, tenants, integrations</li>
                  <li>Fetch analytics and monitoring data</li>
                  <li>Retrieve API documentation</li>
                  <li>Access marketplace information</li>
                </ul>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html' }
    });

  } catch (error) {
    console.error('GraphQL endpoint error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper functions
function calculateQueryComplexity(query: string): number {
  // Simple complexity calculation based on query structure
  const fieldCount = (query.match(/\w+\s*{/g) || []).length;
  const nestedLevel = Math.max(0, (query.match(/{/g) || []).length - 1);
  return fieldCount + (nestedLevel * 2);
}

function calculateQueryDepth(query: string): number {
  // Calculate maximum nesting depth
  let depth = 0;
  let maxDepth = 0;
  
  for (let char of query) {
    if (char === '{') {
      depth++;
      maxDepth = Math.max(maxDepth, depth);
    } else if (char === '}') {
      depth--;
    }
  }
  
  return maxDepth;
}

async function executeGraphQLQuery(query: string, variables: any, schema: any): Promise<any> {
  // Simplified GraphQL execution - in production, use a proper GraphQL library
  
  // Basic query parsing and execution
  const trimmedQuery = query.trim();
  
  // Handle basic queries
  if (trimmedQuery.includes('users')) {
    const users = await prisma.user.findMany({
      take: 10,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });
    
    return { data: { users } };
  }
  
  if (trimmedQuery.includes('tenants')) {
    const tenants = await prisma.tenant.findMany({
      take: 10,
      select: {
        id: true,
        name: true,
        domain: true,
        plan: true,
        isActive: true,
        createdAt: true
      }
    });
    
    return { data: { tenants } };
  }
  
  if (trimmedQuery.includes('webhooks')) {
    const webhooks = await prisma.webhookEndpoint.findMany({
      take: 10,
      select: {
        id: true,
        name: true,
        url: true,
        events: true,
        isActive: true,
        successCount: true,
        failureCount: true
      }
    });
    
    return { data: { webhooks } };
  }
  
  if (trimmedQuery.includes('integrations')) {
    // Get all integration types
    const [ecommerce, marketing, payment, social, analytics] = await Promise.all([
      prisma.ecommerceIntegration.findMany({ take: 5, select: { id: true, name: true, platform: true, status: true } }),
      prisma.marketingIntegration.findMany({ take: 5, select: { id: true, name: true, platform: true, status: true } }),
      prisma.paymentIntegration.findMany({ take: 5, select: { id: true, name: true, provider: true, status: true } }),
      prisma.socialIntegration.findMany({ take: 5, select: { id: true, name: true, platform: true, status: true } }),
      prisma.analyticsIntegration.findMany({ take: 5, select: { id: true, name: true, platform: true, status: true } })
    ]);
    
    return { 
      data: { 
        integrations: {
          ecommerce,
          marketing,
          payment,
          social,
          analytics
        }
      } 
    };
  }
  
  // Default response for unhandled queries
  return {
    data: null,
    errors: [{ message: 'Query not supported in this simplified implementation' }]
  };
}
