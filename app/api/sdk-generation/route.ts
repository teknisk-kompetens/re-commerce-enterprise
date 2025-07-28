
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Get available SDKs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language');
    const isOfficial = searchParams.get('isOfficial') === 'true';
    const status = searchParams.get('status') || 'generated';

    const whereClause = {
      ...(language && { language }),
      ...(isOfficial !== undefined && { isOfficial }),
      status
    };

    const [sdks, languages] = await Promise.all([
      prisma.sDKGeneration.findMany({
        where: whereClause,
        orderBy: [
          { isOfficial: 'desc' },
          { language: 'asc' },
          { lastGenerated: 'desc' }
        ]
      }),
      prisma.sDKGeneration.groupBy({
        by: ['language'],
        where: { status: 'generated' },
        _count: true,
        orderBy: { language: 'asc' }
      })
    ]);

    // Group SDKs by language
    const sdksByLanguage = sdks.reduce((acc, sdk) => {
      if (!acc[sdk.language]) acc[sdk.language] = [];
      acc[sdk.language].push(sdk);
      return acc;
    }, {} as Record<string, typeof sdks>);

    return NextResponse.json({
      sdks,
      sdksByLanguage,
      languages
    });

  } catch (error) {
    console.error('Error fetching SDKs:', error);
    return NextResponse.json({ error: 'Failed to fetch SDKs' }, { status: 500 });
  }
}

// Generate new SDK
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      language, 
      version, 
      specVersion, 
      packageName, 
      packageVersion,
      generationConfig
    } = body;

    if (!language || !version || !specVersion || !packageName || !packageVersion) {
      return NextResponse.json({ 
        error: 'Missing required fields: language, version, specVersion, packageName, packageVersion' 
      }, { status: 400 });
    }

    // Check if SDK already exists
    const existingSdk = await prisma.sDKGeneration.findUnique({
      where: { 
        language_version: {
          language,
          version
        }
      }
    });

    if (existingSdk) {
      return NextResponse.json({ error: 'SDK version already exists' }, { status: 400 });
    }

    // Start SDK generation process
    const sdk = await prisma.sDKGeneration.create({
      data: {
        language,
        version,
        specVersion,
        packageName,
        packageVersion,
        downloadUrl: '', // Will be updated after generation
        documentation: generateSDKDocumentation(language, packageName),
        examples: generateSDKExamples(language),
        generationConfig: generationConfig || getDefaultGenerationConfig(language),
        status: 'generating'
      }
    });

    // Simulate SDK generation process (in production, this would be a background job)
    setTimeout(async () => {
      try {
        const downloadUrl = await generateSDKPackage(sdk);
        
        await prisma.sDKGeneration.update({
          where: { id: sdk.id },
          data: {
            downloadUrl,
            status: 'generated',
            lastGenerated: new Date()
          }
        });
      } catch (error) {
        console.error('SDK generation failed:', error);
        await prisma.sDKGeneration.update({
          where: { id: sdk.id },
          data: {
            status: 'failed',
            lastGenerated: new Date()
          }
        });
      }
    }, 5000); // 5 second delay to simulate generation

    return NextResponse.json({ sdk }, { status: 201 });

  } catch (error) {
    console.error('Error creating SDK generation:', error);
    return NextResponse.json({ error: 'Failed to create SDK generation' }, { status: 500 });
  }
}

// Update SDK
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, documentation, examples, status } = body;

    if (!id) {
      return NextResponse.json({ error: 'SDK ID required' }, { status: 400 });
    }

    const sdk = await prisma.sDKGeneration.update({
      where: { id },
      data: {
        ...(documentation && { documentation }),
        ...(examples && { examples }),
        ...(status && { status })
      }
    });

    return NextResponse.json({ sdk });

  } catch (error) {
    console.error('Error updating SDK:', error);
    return NextResponse.json({ error: 'Failed to update SDK' }, { status: 500 });
  }
}

// Helper functions
function generateSDKDocumentation(language: string, packageName: string): string {
  const templates: Record<string, string> = {
    javascript: `
# ${packageName} - JavaScript SDK

## Installation
\`\`\`bash
npm install ${packageName}
\`\`\`

## Quick Start
\`\`\`javascript
const ReCommerce = require('${packageName}');

const client = new ReCommerce({
  apiKey: 'your-api-key-here',
  baseURL: 'https://api.re-commerce.se/v1'
});

// Get users
const users = await client.users.list();
console.log(users);
\`\`\`
`,
    python: `
# ${packageName} - Python SDK

## Installation
\`\`\`bash
pip install ${packageName}
\`\`\`

## Quick Start
\`\`\`python
from ${packageName.replace('-', '_')} import ReCommerce

client = ReCommerce(
    api_key='your-api-key-here',
    base_url='https://api.re-commerce.se/v1'
)

# Get users
users = client.users.list()
print(users)
\`\`\`
`,
    php: `
# ${packageName} - PHP SDK

## Installation
\`\`\`bash
composer require ${packageName}
\`\`\`

## Quick Start
\`\`\`php
<?php
use ReCommerce\\Client;

$client = new Client([
    'api_key' => 'your-api-key-here',
    'base_url' => 'https://api.re-commerce.se/v1'
]);

// Get users
$users = $client->users()->list();
var_dump($users);
?>
\`\`\`
`
  };

  return templates[language] || `# ${packageName} SDK Documentation\n\nDocumentation for ${language} SDK.`;
}

function generateSDKExamples(language: string): any[] {
  const examples = [
    {
      title: 'Authentication',
      description: 'How to authenticate with the API',
      code: getAuthExample(language)
    },
    {
      title: 'List Users',
      description: 'Retrieve a list of users',
      code: getListUsersExample(language)
    },
    {
      title: 'Create Webhook',
      description: 'Create a new webhook endpoint',
      code: getCreateWebhookExample(language)
    },
    {
      title: 'Error Handling',
      description: 'Handle API errors gracefully',
      code: getErrorHandlingExample(language)
    }
  ];

  return examples;
}

function getAuthExample(language: string): string {
  const examples: Record<string, string> = {
    javascript: `
const client = new ReCommerce({
  apiKey: process.env.RECOMMERCE_API_KEY
});
`,
    python: `
client = ReCommerce(
    api_key=os.getenv('RECOMMERCE_API_KEY')
)
`,
    php: `
$client = new Client([
    'api_key' => $_ENV['RECOMMERCE_API_KEY']
]);
`
  };

  return examples[language] || 'Authentication example';
}

function getListUsersExample(language: string): string {
  const examples: Record<string, string> = {
    javascript: `
try {
  const users = await client.users.list({
    page: 1,
    limit: 10
  });
  console.log(users);
} catch (error) {
  console.error('Error:', error.message);
}
`,
    python: `
try:
    users = client.users.list(page=1, limit=10)
    print(users)
except Exception as e:
    print(f"Error: {e}")
`,
    php: `
try {
    $users = $client->users()->list(['page' => 1, 'limit' => 10]);
    print_r($users);
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
`
  };

  return examples[language] || 'List users example';
}

function getCreateWebhookExample(language: string): string {
  const examples: Record<string, string> = {
    javascript: `
const webhook = await client.webhooks.create({
  name: 'Order Updates',
  url: 'https://yourapp.com/webhooks/orders',
  events: ['order.created', 'order.updated']
});
`,
    python: `
webhook = client.webhooks.create(
    name='Order Updates',
    url='https://yourapp.com/webhooks/orders',
    events=['order.created', 'order.updated']
)
`,
    php: `
$webhook = $client->webhooks()->create([
    'name' => 'Order Updates',
    'url' => 'https://yourapp.com/webhooks/orders',
    'events' => ['order.created', 'order.updated']
]);
`
  };

  return examples[language] || 'Create webhook example';
}

function getErrorHandlingExample(language: string): string {
  const examples: Record<string, string> = {
    javascript: `
try {
  const result = await client.users.get('user_id');
} catch (error) {
  if (error.status === 404) {
    console.log('User not found');
  } else if (error.status === 401) {
    console.log('Unauthorized - check your API key');
  } else {
    console.log('An error occurred:', error.message);
  }
}
`,
    python: `
try:
    result = client.users.get('user_id')
except APIError as e:
    if e.status_code == 404:
        print('User not found')
    elif e.status_code == 401:
        print('Unauthorized - check your API key')
    else:
        print(f'An error occurred: {e}')
`,
    php: `
try {
    $result = $client->users()->get('user_id');
} catch (APIException $e) {
    if ($e->getCode() === 404) {
        echo 'User not found';
    } elseif ($e->getCode() === 401) {
        echo 'Unauthorized - check your API key';
    } else {
        echo 'An error occurred: ' . $e->getMessage();
    }
}
`
  };

  return examples[language] || 'Error handling example';
}

function getDefaultGenerationConfig(language: string): any {
  const configs: Record<string, any> = {
    javascript: {
      packageManager: 'npm',
      moduleType: 'commonjs',
      typescript: true,
      includeTests: true
    },
    python: {
      pythonVersion: '3.8+',
      packageFormat: 'wheel',
      includeTests: true,
      includeTypes: true
    },
    php: {
      phpVersion: '7.4+',
      namespace: 'ReCommerce',
      includeTests: true,
      psr4: true
    },
    java: {
      javaVersion: '8+',
      buildTool: 'gradle',
      includeTests: true,
      packageName: 'com.recommerce.sdk'
    },
    csharp: {
      targetFramework: 'netstandard2.0',
      includeTests: true,
      namespace: 'ReCommerce.SDK'
    },
    go: {
      goVersion: '1.18+',
      moduleName: 'github.com/re-commerce/go-sdk',
      includeTests: true
    },
    ruby: {
      rubyVersion: '2.7+',
      gemName: 'recommerce-sdk',
      includeTests: true
    }
  };

  return configs[language] || { includeTests: true };
}

async function generateSDKPackage(sdk: any): Promise<string> {
  // Simulate SDK package generation
  // In production, this would involve actual code generation, compilation, and packaging
  
  const baseUrl = 'https://cdn.re-commerce.se/sdks';
  const filename = `${sdk.packageName}-${sdk.packageVersion}-${sdk.language}`;
  
  const extensions: Record<string, string> = {
    javascript: 'tar.gz',
    python: 'whl',
    php: 'zip',
    java: 'jar',
    csharp: 'nupkg',
    go: 'tar.gz',
    ruby: 'gem'
  };

  const extension = extensions[sdk.language] || 'zip';
  return `${baseUrl}/${filename}.${extension}`;
}
