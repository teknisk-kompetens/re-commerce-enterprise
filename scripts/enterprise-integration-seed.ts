
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedEnterpriseIntegrations() {
  console.log('🚀 Starting Enterprise Integration seeding...');

  try {
    // 1. Seed ERP Integrations
    console.log('📊 Seeding ERP integrations...');
    const erpIntegrations = await Promise.all([
      prisma.eRPIntegration.create({
        data: {
          name: 'SAP S/4HANA Production',
          type: 'sap',
          version: '2023.1',
          endpoint: 'https://sap.company.com/sap/bc/rest/api',
          credentials: {
            username: 'sap_user',
            password: 'encrypted_password',
            client: '100'
          },
          config: {
            modules: ['FI', 'CO', 'SD', 'MM', 'HR'],
            language: 'EN',
            timezone: 'UTC'
          },
          syncSettings: {
            autoSync: true,
            batchSize: 1000,
            errorHandling: 'continue'
          },
          status: 'active',
          enabled: true,
          lastSync: new Date(Date.now() - 3600000), // 1 hour ago
          metadata: {
            environment: 'production',
            department: 'IT',
            owner: 'system'
          }
        }
      }),
      prisma.eRPIntegration.create({
        data: {
          name: 'Oracle EBS Finance',
          type: 'oracle',
          version: '12.2.9',
          endpoint: 'https://oracle.company.com/ords/apex/api',
          credentials: {
            username: 'oracle_user',
            password: 'encrypted_password',
            database: 'PROD'
          },
          config: {
            modules: ['GL', 'AP', 'AR', 'FA'],
            currency: 'USD',
            fiscalYear: '2024'
          },
          syncSettings: {
            autoSync: true,
            batchSize: 500,
            errorHandling: 'retry'
          },
          status: 'active',
          enabled: true,
          lastSync: new Date(Date.now() - 7200000), // 2 hours ago
          metadata: {
            environment: 'production',
            department: 'Finance',
            owner: 'system'
          }
        }
      }),
      prisma.eRPIntegration.create({
        data: {
          name: 'Microsoft Dynamics 365',
          type: 'microsoft_dynamics',
          version: '10.0.35',
          endpoint: 'https://dynamics.company.com/api/data/v9.2',
          credentials: {
            clientId: 'client_id',
            clientSecret: 'client_secret',
            tenantId: 'tenant_id'
          },
          config: {
            modules: ['Sales', 'Service', 'Marketing', 'Operations'],
            region: 'US',
            dataverse: true
          },
          syncSettings: {
            autoSync: true,
            batchSize: 2000,
            errorHandling: 'stop'
          },
          status: 'active',
          enabled: true,
          lastSync: new Date(Date.now() - 1800000), // 30 minutes ago
          metadata: {
            environment: 'production',
            department: 'Sales',
            owner: 'system'
          }
        }
      })
    ]);

    // Create ERP sync logs
    for (const erp of erpIntegrations) {
      await Promise.all([
        prisma.eRPSyncLog.create({
          data: {
            integrationId: erp.id,
            syncId: `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            operation: 'sync',
            status: 'completed',
            recordsProcessed: 1247,
            recordsSucceeded: 1235,
            recordsFailed: 12,
            errors: [
              { type: 'validation', message: 'Invalid customer ID format', count: 8 },
              { type: 'duplicate', message: 'Duplicate invoice number', count: 4 }
            ],
            startTime: new Date(Date.now() - 3600000),
            endTime: new Date(Date.now() - 3580000),
            metadata: {
              triggeredBy: 'system',
              duration: 20000
            }
          }
        }),
        prisma.eRPSyncLog.create({
          data: {
            integrationId: erp.id,
            syncId: `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            operation: 'import',
            status: 'completed',
            recordsProcessed: 856,
            recordsSucceeded: 856,
            recordsFailed: 0,
            errors: [],
            startTime: new Date(Date.now() - 7200000),
            endTime: new Date(Date.now() - 7185000),
            metadata: {
              triggeredBy: 'user',
              duration: 15000
            }
          }
        })
      ]);
    }

    // 2. Seed CRM Integrations
    console.log('👥 Seeding CRM integrations...');
    const crmIntegrations = await Promise.all([
      prisma.cRMIntegration.create({
        data: {
          name: 'Salesforce Production',
          type: 'salesforce',
          version: 'v58.0',
          endpoint: 'https://company.salesforce.com/services/data/v58.0',
          credentials: {
            username: 'sf_user@company.com',
            password: 'encrypted_password',
            securityToken: 'security_token',
            clientId: 'client_id',
            clientSecret: 'client_secret'
          },
          config: {
            sandbox: false,
            apiVersion: '58.0',
            bulkApi: true,
            objects: ['Account', 'Contact', 'Opportunity', 'Lead', 'Case']
          },
          syncSettings: {
            autoSync: true,
            batchSize: 200,
            errorHandling: 'continue'
          },
          status: 'active',
          enabled: true,
          lastSync: new Date(Date.now() - 1800000), // 30 minutes ago
          metadata: {
            environment: 'production',
            department: 'Sales',
            owner: 'system'
          }
        }
      }),
      prisma.cRMIntegration.create({
        data: {
          name: 'HubSpot Marketing',
          type: 'hubspot',
          version: 'v3',
          endpoint: 'https://api.hubapi.com',
          credentials: {
            accessToken: 'access_token',
            refreshToken: 'refresh_token',
            hubId: 'hub_id'
          },
          config: {
            portalId: 'portal_id',
            trackingCode: 'tracking_code',
            workflows: true,
            objects: ['contacts', 'companies', 'deals', 'tickets']
          },
          syncSettings: {
            autoSync: true,
            batchSize: 100,
            errorHandling: 'retry'
          },
          status: 'active',
          enabled: true,
          lastSync: new Date(Date.now() - 3600000), // 1 hour ago
          metadata: {
            environment: 'production',
            department: 'Marketing',
            owner: 'system'
          }
        }
      })
    ]);

    // Create CRM sync logs
    for (const crm of crmIntegrations) {
      await Promise.all([
        prisma.cRMSyncLog.create({
          data: {
            integrationId: crm.id,
            syncId: `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            operation: 'sync',
            status: 'completed',
            recordsProcessed: 523,
            recordsSucceeded: 520,
            recordsFailed: 3,
            errors: [
              { type: 'duplicate', message: 'Duplicate email address', count: 2 },
              { type: 'validation', message: 'Invalid phone number format', count: 1 }
            ],
            startTime: new Date(Date.now() - 1800000),
            endTime: new Date(Date.now() - 1785000),
            metadata: {
              triggeredBy: 'system',
              duration: 15000
            }
          }
        })
      ]);
    }

    // 3. Seed Cloud Integrations
    console.log('☁️ Seeding Cloud integrations...');
    const cloudIntegrations = await Promise.all([
      prisma.cloudIntegration.create({
        data: {
          name: 'AWS Production Environment',
          type: 'aws',
          region: 'us-east-1',
          credentials: {
            accessKeyId: 'access_key_id',
            secretAccessKey: 'secret_access_key',
            sessionToken: 'session_token'
          },
          config: {
            account: 'production',
            vpc: 'vpc-12345678',
            subnets: ['subnet-12345678', 'subnet-87654321'],
            securityGroups: ['sg-12345678']
          },
          services: ['compute', 'storage', 'database', 'ai', 'analytics'],
          status: 'active',
          enabled: true,
          lastSync: new Date(Date.now() - 900000), // 15 minutes ago
          metadata: {
            environment: 'production',
            department: 'IT',
            owner: 'system'
          }
        }
      }),
      prisma.cloudIntegration.create({
        data: {
          name: 'Azure Development Environment',
          type: 'azure',
          region: 'East US',
          credentials: {
            clientId: 'client_id',
            clientSecret: 'client_secret',
            tenantId: 'tenant_id',
            subscriptionId: 'subscription_id'
          },
          config: {
            resourceGroup: 'dev-resources',
            virtualNetwork: 'dev-vnet',
            storageAccount: 'devstorage'
          },
          services: ['compute', 'storage', 'database'],
          status: 'active',
          enabled: true,
          lastSync: new Date(Date.now() - 1800000), // 30 minutes ago
          metadata: {
            environment: 'development',
            department: 'IT',
            owner: 'system'
          }
        }
      }),
      prisma.cloudIntegration.create({
        data: {
          name: 'Google Cloud Analytics',
          type: 'gcp',
          region: 'us-central1',
          credentials: {
            projectId: 'project_id',
            keyFile: 'service_account_key.json'
          },
          config: {
            project: 'analytics-project',
            dataset: 'analytics_data',
            bucket: 'analytics-bucket'
          },
          services: ['analytics', 'ai', 'storage'],
          status: 'active',
          enabled: true,
          lastSync: new Date(Date.now() - 2700000), // 45 minutes ago
          metadata: {
            environment: 'production',
            department: 'Analytics',
            owner: 'system'
          }
        }
      })
    ]);

    // Create Cloud Resources
    for (const cloud of cloudIntegrations) {
      await Promise.all([
        prisma.cloudResource.create({
          data: {
            integrationId: cloud.id,
            resourceId: `resource_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: 'Web Server Instance',
            type: 'vm',
            status: 'running',
            region: cloud.region,
            config: {
              instanceType: 't3.medium',
              imageId: 'ami-12345678',
              keyName: 'prod-key'
            },
            metrics: {
              cpu: 45.2,
              memory: 62.8,
              disk: 78.5,
              network: 23.1
            },
            cost: 0.0464,
            metadata: {
              purpose: 'web-server',
              environment: 'production'
            }
          }
        }),
        prisma.cloudResource.create({
          data: {
            integrationId: cloud.id,
            resourceId: `resource_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: 'Database Instance',
            type: 'database',
            status: 'running',
            region: cloud.region,
            config: {
              engine: 'postgres',
              version: '13.7',
              instanceClass: 'db.t3.micro'
            },
            metrics: {
              cpu: 28.5,
              memory: 41.2,
              disk: 15.8,
              connections: 12
            },
            cost: 0.0348,
            metadata: {
              purpose: 'application-db',
              environment: 'production'
            }
          }
        })
      ]);
    }

    // 4. Seed API Gateways
    console.log('🔗 Seeding API gateways...');
    const apiGateways = await Promise.all([
      prisma.aPIGateway.create({
        data: {
          name: 'Enterprise API Gateway',
          description: 'Main API gateway for enterprise applications',
          baseUrl: 'https://api.company.com',
          version: '1.0',
          status: 'active',
          rateLimitConfig: {
            global: { limit: 10000, window: 3600 },
            authenticated: { limit: 50000, window: 3600 },
            anonymous: { limit: 1000, window: 3600 }
          },
          authentication: {
            type: 'api_key',
            required: true,
            header: 'X-API-Key'
          },
          middleware: ['cors', 'rate_limit', 'auth', 'analytics'],
          monitoring: true,
          analytics: true,
          metadata: {
            environment: 'production',
            department: 'IT',
            owner: 'system'
          }
        }
      }),
      prisma.aPIGateway.create({
        data: {
          name: 'Internal API Gateway',
          description: 'Internal API gateway for microservices',
          baseUrl: 'https://internal-api.company.com',
          version: '2.0',
          status: 'active',
          rateLimitConfig: {
            global: { limit: 50000, window: 3600 },
            authenticated: { limit: 100000, window: 3600 }
          },
          authentication: {
            type: 'jwt',
            required: true,
            header: 'Authorization'
          },
          middleware: ['auth', 'logging', 'monitoring'],
          monitoring: true,
          analytics: true,
          metadata: {
            environment: 'production',
            department: 'IT',
            owner: 'system'
          }
        }
      })
    ]);

    // Create API endpoints and keys
    for (const gateway of apiGateways) {
      const endpoints = await Promise.all([
        prisma.aPIEndpoint.create({
          data: {
            gatewayId: gateway.id,
            path: '/api/v1/users',
            method: 'GET',
            description: 'Get user information',
            handler: 'getUserHandler',
            middleware: ['auth', 'rate_limit'],
            rateLimits: { limit: 1000, window: 3600 },
            auth: { required: true, scopes: ['read:users'] },
            validation: { queryParams: ['limit', 'offset'] },
            enabled: true,
            metadata: {
              version: '1.0',
              deprecated: false
            }
          }
        }),
        prisma.aPIEndpoint.create({
          data: {
            gatewayId: gateway.id,
            path: '/api/v1/users',
            method: 'POST',
            description: 'Create new user',
            handler: 'createUserHandler',
            middleware: ['auth', 'rate_limit', 'validation'],
            rateLimits: { limit: 100, window: 3600 },
            auth: { required: true, scopes: ['write:users'] },
            validation: { bodySchema: 'userCreateSchema' },
            enabled: true,
            metadata: {
              version: '1.0',
              deprecated: false
            }
          }
        })
      ]);

      await Promise.all([
        prisma.aPIKey.create({
          data: {
            gatewayId: gateway.id,
            keyId: `key_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: 'Frontend Application Key',
            description: 'API key for frontend application',
            key: `sk_${Math.random().toString(36).substr(2, 32)}`,
            scopes: ['read:users', 'write:users', 'read:orders'],
            rateLimits: { limit: 5000, window: 3600 },
            active: true,
            metadata: {
              application: 'frontend',
              environment: 'production'
            }
          }
        }),
        prisma.aPIKey.create({
          data: {
            gatewayId: gateway.id,
            keyId: `key_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: 'Mobile App Key',
            description: 'API key for mobile application',
            key: `sk_${Math.random().toString(36).substr(2, 32)}`,
            scopes: ['read:users', 'read:orders', 'write:reviews'],
            rateLimits: { limit: 3000, window: 3600 },
            active: true,
            metadata: {
              application: 'mobile',
              environment: 'production'
            }
          }
        })
      ]);

      // Create API analytics
      for (const endpoint of endpoints) {
        await Promise.all([
          prisma.aPIAnalytics.create({
            data: {
              endpointId: endpoint.id,
              timestamp: new Date(Date.now() - 3600000),
              method: endpoint.method,
              path: endpoint.path,
              statusCode: 200,
              responseTime: 145,
              requestSize: 1024,
              responseSize: 2048,
              userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
              ipAddress: '192.168.1.100',
              apiKey: 'sk_test_key',
              metadata: {
                userId: 'user_123',
                country: 'US'
              }
            }
          }),
          prisma.aPIAnalytics.create({
            data: {
              endpointId: endpoint.id,
              timestamp: new Date(Date.now() - 1800000),
              method: endpoint.method,
              path: endpoint.path,
              statusCode: 201,
              responseTime: 89,
              requestSize: 512,
              responseSize: 1024,
              userAgent: 'MyApp/1.0',
              ipAddress: '10.0.0.50',
              apiKey: 'sk_prod_key',
              metadata: {
                userId: 'user_456',
                country: 'UK'
              }
            }
          })
        ]);
      }
    }

    // 5. Seed ETL Pipelines
    console.log('⚡ Seeding ETL pipelines...');
    const etlPipelines = await Promise.all([
      prisma.eTLPipeline.create({
        data: {
          name: 'Customer Data Pipeline',
          description: 'Extract and transform customer data from CRM to data warehouse',
          type: 'etl',
          source: {
            type: 'salesforce',
            connection: 'salesforce_prod',
            objects: ['Account', 'Contact', 'Opportunity']
          },
          destination: {
            type: 'snowflake',
            connection: 'snowflake_warehouse',
            schema: 'CUSTOMER_DATA'
          },
          transformation: {
            rules: [
              { field: 'email', action: 'lowercase' },
              { field: 'phone', action: 'format', format: 'E.164' },
              { field: 'created_date', action: 'convert', type: 'timestamp' }
            ]
          },
          schedule: '0 2 * * *', // Daily at 2 AM
          status: 'active',
          enabled: true,
          lastRun: new Date(Date.now() - 3600000),
          nextRun: new Date(Date.now() + 82800000), // Next 2 AM
          createdBy: 'system',
          metadata: {
            department: 'Analytics',
            priority: 'high'
          }
        }
      }),
      prisma.eTLPipeline.create({
        data: {
          name: 'Financial Reports Pipeline',
          description: 'Process financial data for reporting',
          type: 'elt',
          source: {
            type: 'oracle',
            connection: 'oracle_ebs',
            tables: ['GL_BALANCES', 'AP_INVOICES', 'AR_TRANSACTIONS']
          },
          destination: {
            type: 'bigquery',
            connection: 'bigquery_analytics',
            dataset: 'FINANCIAL_DATA'
          },
          transformation: {
            rules: [
              { field: 'amount', action: 'round', precision: 2 },
              { field: 'currency', action: 'standardize', format: 'ISO' }
            ]
          },
          schedule: '0 1 * * *', // Daily at 1 AM
          status: 'active',
          enabled: true,
          lastRun: new Date(Date.now() - 7200000),
          nextRun: new Date(Date.now() + 79200000), // Next 1 AM
          createdBy: 'system',
          metadata: {
            department: 'Finance',
            priority: 'critical'
          }
        }
      })
    ]);

    // Create ETL runs
    for (const pipeline of etlPipelines) {
      await Promise.all([
        prisma.eTLRun.create({
          data: {
            pipelineId: pipeline.id,
            runId: `run_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            startTime: new Date(Date.now() - 3600000),
            endTime: new Date(Date.now() - 3540000),
            status: 'completed',
            recordsProcessed: 15847,
            recordsSucceeded: 15836,
            recordsFailed: 11,
            errors: [
              { type: 'validation', message: 'Invalid email format', count: 7 },
              { type: 'constraint', message: 'Duplicate key violation', count: 4 }
            ],
            logs: [
              { timestamp: new Date(Date.now() - 3600000), level: 'info', message: 'Starting ETL process' },
              { timestamp: new Date(Date.now() - 3580000), level: 'info', message: 'Extraction completed' },
              { timestamp: new Date(Date.now() - 3560000), level: 'info', message: 'Transformation completed' },
              { timestamp: new Date(Date.now() - 3540000), level: 'info', message: 'Loading completed' }
            ],
            metrics: {
              extractionTime: 1200,
              transformationTime: 800,
              loadingTime: 400,
              throughput: 263.3
            },
            metadata: {
              triggeredBy: 'schedule',
              version: '1.0'
            }
          }
        })
      ]);
    }

    // 6. Seed Communication Integrations
    console.log('💬 Seeding communication integrations...');
    const communicationIntegrations = await Promise.all([
      prisma.communicationIntegration.create({
        data: {
          name: 'Slack Workspace',
          type: 'slack',
          version: '1.0',
          endpoint: 'https://slack.com/api',
          credentials: {
            botToken: 'xoxb-bot-token',
            appToken: 'xapp-app-token',
            signingSecret: 'signing-secret'
          },
          config: {
            workspace: 'company-workspace',
            features: ['channels', 'direct_messages', 'file_sharing']
          },
          status: 'active',
          enabled: true,
          lastSync: new Date(Date.now() - 900000),
          metadata: {
            department: 'IT',
            environment: 'production'
          }
        }
      }),
      prisma.communicationIntegration.create({
        data: {
          name: 'Microsoft Teams',
          type: 'teams',
          version: '1.0',
          endpoint: 'https://graph.microsoft.com/v1.0',
          credentials: {
            clientId: 'client-id',
            clientSecret: 'client-secret',
            tenantId: 'tenant-id'
          },
          config: {
            tenant: 'company.onmicrosoft.com',
            features: ['teams', 'channels', 'chat', 'meetings']
          },
          status: 'active',
          enabled: true,
          lastSync: new Date(Date.now() - 1800000),
          metadata: {
            department: 'IT',
            environment: 'production'
          }
        }
      })
    ]);

    // Create communication channels and messages
    for (const integration of communicationIntegrations) {
      const channels = await Promise.all([
        prisma.communicationChannel.create({
          data: {
            integrationId: integration.id,
            channelId: `channel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: 'general',
            type: 'public',
            description: 'General discussion channel',
            members: [
              { id: 'user_1', name: 'John Doe', role: 'admin' },
              { id: 'user_2', name: 'Jane Smith', role: 'member' },
              { id: 'user_3', name: 'Bob Johnson', role: 'member' }
            ],
            config: {
              notifications: true,
              archiving: false
            },
            active: true,
            metadata: {
              purpose: 'general-communication',
              created: new Date()
            }
          }
        }),
        prisma.communicationChannel.create({
          data: {
            integrationId: integration.id,
            channelId: `channel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: 'dev-team',
            type: 'private',
            description: 'Development team coordination',
            members: [
              { id: 'dev_1', name: 'Alice Dev', role: 'admin' },
              { id: 'dev_2', name: 'Charlie Code', role: 'member' }
            ],
            config: {
              notifications: true,
              archiving: true
            },
            active: true,
            metadata: {
              purpose: 'development',
              created: new Date()
            }
          }
        })
      ]);

      for (const channel of channels) {
        await Promise.all([
          prisma.communicationMessage.create({
            data: {
              integrationId: integration.id,
              messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              channelId: channel.channelId,
              senderId: 'user_1',
              content: 'Welcome to the team! 👋',
              type: 'text',
              timestamp: new Date(Date.now() - 3600000),
              metadata: {
                reactions: [
                  { emoji: '👋', count: 3 },
                  { emoji: '🎉', count: 1 }
                ]
              }
            }
          }),
          prisma.communicationMessage.create({
            data: {
              integrationId: integration.id,
              messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              channelId: channel.channelId,
              senderId: 'user_2',
              content: 'Thanks! Excited to be here!',
              type: 'text',
              timestamp: new Date(Date.now() - 3580000),
              metadata: {
                threadId: 'thread_123',
                edited: false
              }
            }
          })
        ]);
      }
    }

    // 7. Seed BI Integrations
    console.log('📊 Seeding BI integrations...');
    const biIntegrations = await Promise.all([
      prisma.bIIntegration.create({
        data: {
          name: 'Tableau Server',
          type: 'tableau',
          version: '2023.3',
          endpoint: 'https://tableau.company.com/api/3.19',
          credentials: {
            username: 'tableau_user',
            password: 'encrypted_password',
            site: 'company'
          },
          config: {
            server: 'tableau.company.com',
            site: 'company',
            ssl: true
          },
          status: 'active',
          enabled: true,
          lastSync: new Date(Date.now() - 1800000),
          metadata: {
            department: 'Analytics',
            environment: 'production'
          }
        }
      }),
      prisma.bIIntegration.create({
        data: {
          name: 'Power BI Service',
          type: 'powerbi',
          version: '1.0',
          endpoint: 'https://api.powerbi.com/v1.0',
          credentials: {
            clientId: 'client-id',
            clientSecret: 'client-secret',
            tenantId: 'tenant-id'
          },
          config: {
            workspace: 'company-workspace',
            dataflows: true,
            premiumCapacity: true
          },
          status: 'active',
          enabled: true,
          lastSync: new Date(Date.now() - 2700000),
          metadata: {
            department: 'Business Intelligence',
            environment: 'production'
          }
        }
      })
    ]);

    // Create BI dashboards and reports
    for (const integration of biIntegrations) {
      const dashboards = await Promise.all([
        prisma.bIDashboard.create({
          data: {
            integrationId: integration.id,
            dashboardId: `dash_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: 'Sales Performance Dashboard',
            description: 'Real-time sales metrics and KPIs',
            url: `https://${integration.type}.company.com/dashboards/sales-performance`,
            config: {
              refreshInterval: 300,
              autoRefresh: true,
              filters: ['date_range', 'region', 'product']
            },
            widgets: [
              { type: 'metric', title: 'Total Revenue', position: { x: 0, y: 0 } },
              { type: 'chart', title: 'Monthly Trends', position: { x: 1, y: 0 } },
              { type: 'table', title: 'Top Products', position: { x: 0, y: 1 } }
            ],
            permissions: {
              view: ['sales_team', 'managers', 'executives'],
              edit: ['bi_team', 'admins']
            },
            active: true,
            metadata: {
              department: 'Sales',
              priority: 'high'
            }
          }
        }),
        prisma.bIDashboard.create({
          data: {
            integrationId: integration.id,
            dashboardId: `dash_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: 'Financial Overview',
            description: 'Financial metrics and budget tracking',
            url: `https://${integration.type}.company.com/dashboards/financial-overview`,
            config: {
              refreshInterval: 600,
              autoRefresh: true,
              filters: ['fiscal_year', 'department', 'category']
            },
            widgets: [
              { type: 'metric', title: 'Budget vs Actual', position: { x: 0, y: 0 } },
              { type: 'chart', title: 'Expense Trends', position: { x: 1, y: 0 } }
            ],
            permissions: {
              view: ['finance_team', 'executives'],
              edit: ['finance_admins']
            },
            active: true,
            metadata: {
              department: 'Finance',
              priority: 'critical'
            }
          }
        })
      ]);

      await Promise.all([
        prisma.bIReport.create({
          data: {
            integrationId: integration.id,
            reportId: `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: 'Monthly Sales Report',
            description: 'Comprehensive monthly sales analysis',
            type: 'scheduled',
            config: {
              format: 'pdf',
              template: 'sales_template',
              parameters: ['month', 'region']
            },
            schedule: '0 9 1 * *', // First day of month at 9 AM
            recipients: [
              { email: 'sales@company.com', type: 'to' },
              { email: 'management@company.com', type: 'cc' }
            ],
            lastRun: new Date(Date.now() - 86400000),
            nextRun: new Date(Date.now() + 2592000000), // Next month
            active: true,
            metadata: {
              department: 'Sales',
              priority: 'high'
            }
          }
        }),
        prisma.bIReport.create({
          data: {
            integrationId: integration.id,
            reportId: `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: 'Real-time Inventory Report',
            description: 'Live inventory status and alerts',
            type: 'real_time',
            config: {
              format: 'json',
              endpoint: '/api/inventory/realtime',
              alerts: true
            },
            recipients: [
              { email: 'inventory@company.com', type: 'to' },
              { slack: '#inventory-alerts', type: 'notification' }
            ],
            active: true,
            metadata: {
              department: 'Operations',
              priority: 'medium'
            }
          }
        })
      ]);
    }

    // 8. Seed HR Integrations
    console.log('👥 Seeding HR integrations...');
    const hrIntegrations = await Promise.all([
      prisma.hRIntegration.create({
        data: {
          name: 'Workday HCM',
          type: 'workday',
          version: '2023R2',
          endpoint: 'https://workday.company.com/ccx/service/tenant/api/v1',
          credentials: {
            username: 'workday_user',
            password: 'encrypted_password',
            tenant: 'company'
          },
          config: {
            modules: ['HCM', 'Payroll', 'Benefits', 'Recruiting'],
            locale: 'en_US',
            timezone: 'America/New_York'
          },
          syncSettings: {
            autoSync: true,
            batchSize: 100,
            errorHandling: 'continue'
          },
          status: 'active',
          enabled: true,
          lastSync: new Date(Date.now() - 7200000),
          metadata: {
            department: 'HR',
            environment: 'production'
          }
        }
      }),
      prisma.hRIntegration.create({
        data: {
          name: 'BambooHR',
          type: 'bamboohr',
          version: '1.0',
          endpoint: 'https://api.bamboohr.com/api/gateway.php/company/v1',
          credentials: {
            apiKey: 'bamboo_api_key',
            subdomain: 'company'
          },
          config: {
            modules: ['Employee Management', 'Time Off', 'Performance'],
            features: ['custom_fields', 'reports', 'webhooks']
          },
          syncSettings: {
            autoSync: true,
            batchSize: 50,
            errorHandling: 'retry'
          },
          status: 'active',
          enabled: true,
          lastSync: new Date(Date.now() - 3600000),
          metadata: {
            department: 'HR',
            environment: 'production'
          }
        }
      })
    ]);

    // Create HR sync logs
    for (const hr of hrIntegrations) {
      await Promise.all([
        prisma.hRSyncLog.create({
          data: {
            integrationId: hr.id,
            syncId: `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            operation: 'sync',
            status: 'completed',
            recordsProcessed: 1847,
            recordsSucceeded: 1842,
            recordsFailed: 5,
            errors: [
              { type: 'validation', message: 'Invalid employee ID format', count: 3 },
              { type: 'missing', message: 'Missing required field: department', count: 2 }
            ],
            startTime: new Date(Date.now() - 3600000),
            endTime: new Date(Date.now() - 3570000),
            metadata: {
              triggeredBy: 'system',
              duration: 30000
            }
          }
        })
      ]);
    }

    // 9. Seed Financial Integrations
    console.log('💰 Seeding financial integrations...');
    const financialIntegrations = await Promise.all([
      prisma.financialIntegration.create({
        data: {
          name: 'QuickBooks Online',
          type: 'quickbooks',
          version: '3.0',
          endpoint: 'https://sandbox-quickbooks.api.intuit.com/v3/company',
          credentials: {
            clientId: 'qb_client_id',
            clientSecret: 'qb_client_secret',
            accessToken: 'qb_access_token',
            refreshToken: 'qb_refresh_token',
            companyId: 'qb_company_id'
          },
          config: {
            sandbox: false,
            currency: 'USD',
            features: ['invoices', 'payments', 'expenses', 'reports']
          },
          syncSettings: {
            autoSync: true,
            batchSize: 200,
            errorHandling: 'continue'
          },
          status: 'active',
          enabled: true,
          lastSync: new Date(Date.now() - 1800000),
          metadata: {
            department: 'Finance',
            environment: 'production'
          }
        }
      }),
      prisma.financialIntegration.create({
        data: {
          name: 'NetSuite ERP',
          type: 'netsuite',
          version: '2023.2',
          endpoint: 'https://company.suitetalk.api.netsuite.com/services/NetSuitePort_2023_2',
          credentials: {
            account: 'netsuite_account',
            consumerKey: 'consumer_key',
            consumerSecret: 'consumer_secret',
            tokenId: 'token_id',
            tokenSecret: 'token_secret'
          },
          config: {
            modules: ['Accounting', 'CRM', 'E-commerce', 'Inventory'],
            subsidiary: 'main',
            currency: 'USD'
          },
          syncSettings: {
            autoSync: true,
            batchSize: 100,
            errorHandling: 'stop'
          },
          status: 'active',
          enabled: true,
          lastSync: new Date(Date.now() - 3600000),
          metadata: {
            department: 'Finance',
            environment: 'production'
          }
        }
      })
    ]);

    // Create financial sync logs
    for (const financial of financialIntegrations) {
      await Promise.all([
        prisma.financialSyncLog.create({
          data: {
            integrationId: financial.id,
            syncId: `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            operation: 'sync',
            status: 'completed',
            recordsProcessed: 2156,
            recordsSucceeded: 2152,
            recordsFailed: 4,
            errors: [
              { type: 'validation', message: 'Invalid account code format', count: 3 },
              { type: 'currency', message: 'Currency conversion error', count: 1 }
            ],
            startTime: new Date(Date.now() - 1800000),
            endTime: new Date(Date.now() - 1770000),
            metadata: {
              triggeredBy: 'system',
              duration: 30000
            }
          }
        })
      ]);
    }

    // 10. Seed Marketplace Apps
    console.log('🏪 Seeding marketplace apps...');
    const marketplaceApps = await Promise.all([
      prisma.marketplaceApp.create({
        data: {
          name: 'Advanced Analytics Suite',
          description: 'Comprehensive business intelligence and analytics platform with AI-powered insights',
          category: 'analytics',
          publisher: 'Analytics Pro Inc.',
          version: '2.4.1',
          logo: 'https://images.ctfassets.net/dkgr2j75jrom/2iXQmYA2z3jvtJcabH6c4/413bd85d9231f4e61fee82f52e9488bf/fs-pillar-page-digital-analtyics-tools-google-analytics-min.jpg?w=1850&h=1005&fl=progressive&q=50&fm=jpg',
          screenshots: [
            'https://i.pinimg.com/originals/65/dd/2e/65dd2eb47b0426511c60f409b20ea43c.png',
            'https://i.pinimg.com/originals/88/75/28/887528f840d9027d43b4ce93f54bc1ef.png'
          ],
          pricing: {
            model: 'subscription',
            tiers: [
              { name: 'Basic', price: 29.99, period: 'monthly' },
              { name: 'Professional', price: 99.99, period: 'monthly' },
              { name: 'Enterprise', price: 299.99, period: 'monthly' }
            ]
          },
          features: [
            'Real-time dashboards',
            'Custom reports',
            'AI-powered insights',
            'Data visualization',
            'API integration'
          ],
          requirements: {
            memory: '4GB',
            disk: '1GB',
            cpu: '2 cores'
          },
          config: {
            defaultSettings: {
              theme: 'dark',
              refreshInterval: 300,
              notifications: true
            }
          },
          permissions: [
            'read:analytics',
            'write:reports',
            'access:dashboards'
          ],
          status: 'published',
          downloads: 1245,
          rating: 4.7,
          reviews: 89,
          metadata: {
            category: 'analytics',
            verified: true
          }
        }
      }),
      prisma.marketplaceApp.create({
        data: {
          name: 'Security Monitor Pro',
          description: 'Advanced security monitoring and threat detection for enterprise applications',
          category: 'security',
          publisher: 'SecureFlow Systems',
          version: '1.8.3',
          logo: 'https://www.innominds.com/hs-fs/hubfs/Innominds-201612/img/IM-Slider/Evolving-SIEM-workflow-for-advanced-Threat-detection.png?width=1245&name=Evolving-SIEM-workflow-for-advanced-Threat-detection.png',
          screenshots: [
            'https://d112y698adiu2z.cloudfront.net/photos/production/software_photos/002/364/487/datas/original.png',
            'https://cdn.lo4d.com/t/screenshot/800/burp-suite-7.png'
          ],
          pricing: {
            model: 'subscription',
            tiers: [
              { name: 'Standard', price: 49.99, period: 'monthly' },
              { name: 'Premium', price: 149.99, period: 'monthly' },
              { name: 'Enterprise', price: 399.99, period: 'monthly' }
            ]
          },
          features: [
            'Real-time threat detection',
            'Security analytics',
            'Incident response',
            'Compliance reporting',
            'SIEM integration'
          ],
          requirements: {
            memory: '8GB',
            disk: '2GB',
            cpu: '4 cores'
          },
          config: {
            defaultSettings: {
              alertLevel: 'medium',
              retention: 90,
              autoResponse: false
            }
          },
          permissions: [
            'read:security',
            'write:incidents',
            'access:logs'
          ],
          status: 'published',
          downloads: 892,
          rating: 4.9,
          reviews: 156,
          metadata: {
            category: 'security',
            verified: true
          }
        }
      }),
      prisma.marketplaceApp.create({
        data: {
          name: 'Workflow Builder',
          description: 'Drag-and-drop workflow automation tool for business processes',
          category: 'automation',
          publisher: 'FlowTech Solutions',
          version: '3.1.0',
          logo: 'https://lh7-rt.googleusercontent.com/docsz/AD_4nXfu0nvJRn5cRdNgD0NbnO38wOdf6S4M7mv9jHKv6PGXeCl8bdDJ17zEubsRg05_HAXmnuyqTItXZSw31zh6ly4kbnZXFpe9Vg5-A_dTM7tB63RozLqEMUEOGa3J879Po9iUls-irlYvWfm-CKip6JGefD7k?key=eBau62sCiQHzSqNOYhFb-A',
          screenshots: [
            'https://assets.website-files.com/5ef0a48c75d5b78296c95323/5f85a5e17cb1008446d65999_si8TP-xmu_Q5Q7izMoGqp_0zPhDUKx-UXC9O6Zvqz2qG0P3ISY53Hcqvm0f9hlDjiT0GJz8-KPehei1OGci8H1QPNV4vjVmS-Bmk4KFgoi7y1bPy33_avNAXPhnfWszGH6bgXoK0.png',
            'https://i.pinimg.com/originals/e2/ed/90/e2ed90d7d65d23ad74cf678de0b137b7.png'
          ],
          pricing: {
            model: 'freemium',
            tiers: [
              { name: 'Free', price: 0, period: 'monthly', limits: { workflows: 5, executions: 100 } },
              { name: 'Professional', price: 19.99, period: 'monthly' },
              { name: 'Enterprise', price: 79.99, period: 'monthly' }
            ]
          },
          features: [
            'Visual workflow builder',
            'Pre-built templates',
            'API integrations',
            'Conditional logic',
            'Schedule automation'
          ],
          requirements: {
            memory: '2GB',
            disk: '500MB',
            cpu: '1 core'
          },
          config: {
            defaultSettings: {
              autoSave: true,
              notifications: true,
              timeout: 300
            }
          },
          permissions: [
            'read:workflows',
            'write:workflows',
            'execute:workflows'
          ],
          status: 'published',
          downloads: 2156,
          rating: 4.5,
          reviews: 234,
          metadata: {
            category: 'automation',
            verified: true
          }
        }
      })
    ]);

    // Create marketplace installations
    const tenantId = 'tenant_123';
    const userId = 'user_456';

    await Promise.all([
      prisma.marketplaceInstallation.create({
        data: {
          appId: marketplaceApps[0].id,
          tenantId,
          userId,
          version: marketplaceApps[0].version,
          config: {
            theme: 'dark',
            refreshInterval: 300,
            notifications: true
          },
          status: 'installed',
          installedAt: new Date(Date.now() - 86400000),
          metadata: {
            installedBy: 'admin',
            reason: 'business_need'
          }
        }
      }),
      prisma.marketplaceInstallation.create({
        data: {
          appId: marketplaceApps[1].id,
          tenantId,
          userId,
          version: marketplaceApps[1].version,
          config: {
            alertLevel: 'high',
            retention: 180,
            autoResponse: true
          },
          status: 'installed',
          installedAt: new Date(Date.now() - 172800000),
          metadata: {
            installedBy: 'security_admin',
            reason: 'security_requirement'
          }
        }
      })
    ]);

    // 11. Seed Workflow Engines and Workflows
    console.log('⚙️ Seeding workflow engines and workflows...');
    const workflowEngines = await Promise.all([
      prisma.workflowEngine.create({
        data: {
          name: 'Business Process Engine',
          description: 'Main workflow engine for business processes',
          type: 'sequential',
          status: 'active',
          config: {
            maxConcurrency: 10,
            timeout: 3600,
            retryPolicy: 'exponential'
          },
          triggers: [
            { type: 'schedule', config: { cron: '0 9 * * *' } },
            { type: 'webhook', config: { url: '/webhook/process' } }
          ],
          actions: [
            { type: 'email', config: { smtp: 'smtp.company.com' } },
            { type: 'http', config: { timeout: 30 } }
          ],
          conditions: [
            { type: 'approval', config: { required: true } },
            { type: 'validation', config: { strict: true } }
          ],
          enabled: true,
          createdBy: 'system',
          metadata: {
            department: 'Operations',
            version: '1.0'
          }
        }
      }),
      prisma.workflowEngine.create({
        data: {
          name: 'Data Processing Engine',
          description: 'Workflow engine for data processing tasks',
          type: 'parallel',
          status: 'active',
          config: {
            maxConcurrency: 20,
            timeout: 7200,
            retryPolicy: 'linear'
          },
          triggers: [
            { type: 'file', config: { path: '/data/input' } },
            { type: 'api', config: { endpoint: '/api/process' } }
          ],
          actions: [
            { type: 'transform', config: { format: 'json' } },
            { type: 'validate', config: { schema: 'data_schema' } }
          ],
          conditions: [
            { type: 'size', config: { min: 1, max: 10000 } },
            { type: 'format', config: { allowed: ['json', 'csv'] } }
          ],
          enabled: true,
          createdBy: 'system',
          metadata: {
            department: 'Data',
            version: '1.0'
          }
        }
      })
    ]);

    // Create workflows
    for (const engine of workflowEngines) {
      const workflows = await Promise.all([
        prisma.workflow.create({
          data: {
            engineId: engine.id,
            name: 'Purchase Order Approval',
            description: 'Automated purchase order approval workflow',
            type: 'approval',
            definition: {
              steps: [
                { id: 'validate', name: 'Validate Order', type: 'validation' },
                { id: 'approve', name: 'Manager Approval', type: 'approval' },
                { id: 'process', name: 'Process Payment', type: 'action' },
                { id: 'notify', name: 'Send Notification', type: 'notification' }
              ],
              flow: [
                { from: 'validate', to: 'approve', condition: 'valid' },
                { from: 'approve', to: 'process', condition: 'approved' },
                { from: 'process', to: 'notify', condition: 'completed' }
              ]
            },
            config: {
              approvalThreshold: 1000,
              timeout: 86400,
              escalation: true
            },
            triggers: [
              { type: 'api', endpoint: '/api/purchase-orders' }
            ],
            steps: [
              { order: 1, name: 'Validate Order', config: { required: true } },
              { order: 2, name: 'Manager Approval', config: { timeout: 3600 } },
              { order: 3, name: 'Process Payment', config: { method: 'automated' } },
              { order: 4, name: 'Send Notification', config: { recipients: ['finance', 'requester'] } }
            ],
            conditions: [
              { field: 'amount', operator: 'lte', value: 10000 },
              { field: 'department', operator: 'in', value: ['IT', 'Marketing', 'Sales'] }
            ],
            version: '1.0',
            status: 'active',
            enabled: true,
            createdBy: 'system',
            metadata: {
              department: 'Finance',
              priority: 'high'
            }
          }
        }),
        prisma.workflow.create({
          data: {
            engineId: engine.id,
            name: 'Employee Onboarding',
            description: 'Automated employee onboarding process',
            type: 'automation',
            definition: {
              steps: [
                { id: 'create_accounts', name: 'Create Accounts', type: 'action' },
                { id: 'send_welcome', name: 'Send Welcome Email', type: 'notification' },
                { id: 'schedule_training', name: 'Schedule Training', type: 'integration' },
                { id: 'assign_equipment', name: 'Assign Equipment', type: 'action' }
              ],
              flow: [
                { from: 'create_accounts', to: 'send_welcome', condition: 'success' },
                { from: 'send_welcome', to: 'schedule_training', condition: 'sent' },
                { from: 'schedule_training', to: 'assign_equipment', condition: 'scheduled' }
              ]
            },
            config: {
              autoStart: true,
              timeout: 172800,
              notifications: true
            },
            triggers: [
              { type: 'webhook', endpoint: '/webhook/new-employee' }
            ],
            steps: [
              { order: 1, name: 'Create Accounts', config: { systems: ['AD', 'Email', 'CRM'] } },
              { order: 2, name: 'Send Welcome Email', config: { template: 'welcome_template' } },
              { order: 3, name: 'Schedule Training', config: { system: 'LMS' } },
              { order: 4, name: 'Assign Equipment', config: { system: 'Asset Management' } }
            ],
            conditions: [
              { field: 'department', operator: 'exists', value: true },
              { field: 'start_date', operator: 'gte', value: 'today' }
            ],
            version: '1.0',
            status: 'active',
            enabled: true,
            createdBy: 'system',
            metadata: {
              department: 'HR',
              priority: 'medium'
            }
          }
        })
      ]);

      // Create workflow executions
      for (const workflow of workflows) {
        await Promise.all([
          prisma.workflowExecution.create({
            data: {
              workflowId: workflow.id,
              engineId: engine.id,
              executionId: `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              triggeredBy: 'system',
              startTime: new Date(Date.now() - 3600000),
              endTime: new Date(Date.now() - 3540000),
              status: 'completed',
              currentStep: 4,
              steps: [
                { stepNumber: 1, name: 'Validate Order', status: 'completed', startTime: new Date(Date.now() - 3600000), endTime: new Date(Date.now() - 3595000) },
                { stepNumber: 2, name: 'Manager Approval', status: 'completed', startTime: new Date(Date.now() - 3595000), endTime: new Date(Date.now() - 3570000) },
                { stepNumber: 3, name: 'Process Payment', status: 'completed', startTime: new Date(Date.now() - 3570000), endTime: new Date(Date.now() - 3545000) },
                { stepNumber: 4, name: 'Send Notification', status: 'completed', startTime: new Date(Date.now() - 3545000), endTime: new Date(Date.now() - 3540000) }
              ],
              variables: {
                orderId: 'PO-2024-001',
                amount: 2500.00,
                department: 'IT',
                requester: 'john.doe@company.com'
              },
              results: {
                approved: true,
                paymentId: 'PAY-2024-001',
                notificationSent: true
              },
              errors: [],
              metadata: {
                triggeredBy: 'api',
                priority: 'normal'
              }
            }
          }),
          prisma.workflowExecution.create({
            data: {
              workflowId: workflow.id,
              engineId: engine.id,
              executionId: `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              triggeredBy: 'user',
              startTime: new Date(Date.now() - 1800000),
              endTime: new Date(Date.now() - 1740000),
              status: 'completed',
              currentStep: 4,
              steps: [
                { stepNumber: 1, name: 'Create Accounts', status: 'completed', startTime: new Date(Date.now() - 1800000), endTime: new Date(Date.now() - 1785000) },
                { stepNumber: 2, name: 'Send Welcome Email', status: 'completed', startTime: new Date(Date.now() - 1785000), endTime: new Date(Date.now() - 1770000) },
                { stepNumber: 3, name: 'Schedule Training', status: 'completed', startTime: new Date(Date.now() - 1770000), endTime: new Date(Date.now() - 1755000) },
                { stepNumber: 4, name: 'Assign Equipment', status: 'completed', startTime: new Date(Date.now() - 1755000), endTime: new Date(Date.now() - 1740000) }
              ],
              variables: {
                employeeId: 'EMP-2024-001',
                name: 'Jane Smith',
                department: 'Marketing',
                startDate: '2024-01-15'
              },
              results: {
                accountsCreated: true,
                emailSent: true,
                trainingScheduled: true,
                equipmentAssigned: true
              },
              errors: [],
              metadata: {
                triggeredBy: 'hr_system',
                priority: 'high'
              }
            }
          })
        ]);
      }
    }

    console.log('✅ Enterprise Integration seeding completed successfully!');
    console.log(`Created:
    - ${erpIntegrations.length} ERP integrations
    - ${crmIntegrations.length} CRM integrations  
    - ${cloudIntegrations.length} Cloud integrations
    - ${apiGateways.length} API gateways
    - ${etlPipelines.length} ETL pipelines
    - ${communicationIntegrations.length} Communication integrations
    - ${biIntegrations.length} BI integrations
    - ${hrIntegrations.length} HR integrations
    - ${financialIntegrations.length} Financial integrations
    - ${marketplaceApps.length} Marketplace apps
    - ${workflowEngines.length} Workflow engines
    - Multiple related records (sync logs, resources, channels, etc.)
    `);

  } catch (error) {
    console.error('❌ Error seeding enterprise integrations:', error);
    throw error;
  }
}

// Run the seeding function
async function main() {
  try {
    await seedEnterpriseIntegrations();
  } catch (error) {
    console.error('Failed to seed enterprise integrations:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
