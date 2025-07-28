
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedInternationalData() {
  console.log('🌍 Starting international expansion seeding...');

  try {
    // 1. Create Languages
    console.log('📝 Creating languages...');
    const languages = await Promise.all([
      prisma.language.upsert({
        where: { code: 'en' },
        update: {},
        create: {
          code: 'en',
          name: 'English',
          nativeName: 'English',
          isRTL: false,
          isActive: true,
          priority: 100,
          region: 'Global',
          country: 'US',
          dateFormat: 'MM/dd/yyyy',
          timeFormat: 'HH:mm',
          numberFormat: { thousandsSeparator: ',', decimalSeparator: '.' },
          currencyPosition: 'before',
          completeness: 100.0
        }
      }),
      prisma.language.upsert({
        where: { code: 'sv' },
        update: {},
        create: {
          code: 'sv',
          name: 'Swedish',
          nativeName: 'Svenska',
          isRTL: false,
          isActive: true,
          priority: 90,
          region: 'Nordic',
          country: 'SE',
          dateFormat: 'yyyy-MM-dd',
          timeFormat: 'HH:mm',
          numberFormat: { thousandsSeparator: ' ', decimalSeparator: ',' },
          currencyPosition: 'after',
          completeness: 85.0
        }
      }),
      prisma.language.upsert({
        where: { code: 'de' },
        update: {},
        create: {
          code: 'de',
          name: 'German',
          nativeName: 'Deutsch',
          isRTL: false,
          isActive: true,
          priority: 80,
          region: 'Central Europe',
          country: 'DE',
          dateFormat: 'dd.MM.yyyy',
          timeFormat: 'HH:mm',
          numberFormat: { thousandsSeparator: '.', decimalSeparator: ',' },
          currencyPosition: 'after',
          completeness: 78.0
        }
      }),
      prisma.language.upsert({
        where: { code: 'fr' },
        update: {},
        create: {
          code: 'fr',
          name: 'French',
          nativeName: 'Français',
          isRTL: false,
          isActive: true,
          priority: 75,
          region: 'Western Europe',
          country: 'FR',
          dateFormat: 'dd/MM/yyyy',
          timeFormat: 'HH:mm',
          numberFormat: { thousandsSeparator: ' ', decimalSeparator: ',' },
          currencyPosition: 'after',
          completeness: 82.0
        }
      }),
      prisma.language.upsert({
        where: { code: 'es' },
        update: {},
        create: {
          code: 'es',
          name: 'Spanish',
          nativeName: 'Español',
          isRTL: false,
          isActive: true,
          priority: 70,
          region: 'Latin America',
          country: 'ES',
          dateFormat: 'dd/MM/yyyy',
          timeFormat: 'HH:mm',
          numberFormat: { thousandsSeparator: '.', decimalSeparator: ',' },
          currencyPosition: 'after',
          completeness: 65.0
        }
      }),
      prisma.language.upsert({
        where: { code: 'ja' },
        update: {},
        create: {
          code: 'ja',
          name: 'Japanese',
          nativeName: '日本語',
          isRTL: false,
          isActive: true,
          priority: 60,
          region: 'Asia Pacific',
          country: 'JP',
          dateFormat: 'yyyy年MM月dd日',
          timeFormat: 'HH:mm',
          numberFormat: { thousandsSeparator: ',', decimalSeparator: '.' },
          currencyPosition: 'before',
          completeness: 45.0
        }
      }),
      prisma.language.upsert({
        where: { code: 'ar' },
        update: {},
        create: {
          code: 'ar',
          name: 'Arabic',
          nativeName: 'العربية',
          isRTL: true,
          isActive: true,
          priority: 50,
          region: 'Middle East',
          country: 'SA',
          dateFormat: 'dd/MM/yyyy',
          timeFormat: 'HH:mm',
          numberFormat: { thousandsSeparator: ',', decimalSeparator: '.' },
          currencyPosition: 'before',
          completeness: 30.0
        }
      })
    ]);

    console.log(`✅ Created ${languages.length} languages`);

    // 2. Create Currencies
    console.log('💰 Creating currencies...');
    const currencies = await Promise.all([
      prisma.currency.upsert({
        where: { code: 'USD' },
        update: {},
        create: {
          code: 'USD',
          name: 'US Dollar',
          symbol: '$',
          symbolPosition: 'before',
          decimalPlaces: 2,
          decimalSeparator: '.',
          thousandsSeparator: ',',
          exchangeRate: 1.0,
          isBaseCurrency: true,
          isActive: true,
          isCrypto: false,
          lastUpdated: new Date()
        }
      }),
      prisma.currency.upsert({
        where: { code: 'EUR' },
        update: {},
        create: {
          code: 'EUR',
          name: 'Euro',
          symbol: '€',
          symbolPosition: 'after',
          decimalPlaces: 2,
          decimalSeparator: ',',
          thousandsSeparator: '.',
          exchangeRate: 0.85,
          isBaseCurrency: false,
          isActive: true,
          isCrypto: false,
          lastUpdated: new Date()
        }
      }),
      prisma.currency.upsert({
        where: { code: 'SEK' },
        update: {},
        create: {
          code: 'SEK',
          name: 'Swedish Krona',
          symbol: 'kr',
          symbolPosition: 'after',
          decimalPlaces: 2,
          decimalSeparator: ',',
          thousandsSeparator: ' ',
          exchangeRate: 10.45,
          isBaseCurrency: false,
          isActive: true,
          isCrypto: false,
          lastUpdated: new Date()
        }
      }),
      prisma.currency.upsert({
        where: { code: 'GBP' },
        update: {},
        create: {
          code: 'GBP',
          name: 'British Pound',
          symbol: '£',
          symbolPosition: 'before',
          decimalPlaces: 2,
          decimalSeparator: '.',
          thousandsSeparator: ',',
          exchangeRate: 0.73,
          isBaseCurrency: false,
          isActive: true,
          isCrypto: false,
          lastUpdated: new Date()
        }
      }),
      prisma.currency.upsert({
        where: { code: 'JPY' },
        update: {},
        create: {
          code: 'JPY',
          name: 'Japanese Yen',
          symbol: '¥',
          symbolPosition: 'before',
          decimalPlaces: 0,
          decimalSeparator: '.',
          thousandsSeparator: ',',
          exchangeRate: 110.25,
          isBaseCurrency: false,
          isActive: true,
          isCrypto: false,
          lastUpdated: new Date()
        }
      })
    ]);

    console.log(`✅ Created ${currencies.length} currencies`);

    // 3. Create Market Regions
    console.log('🗺️ Creating market regions...');
    const marketRegions = await Promise.all([
      prisma.marketRegion.upsert({
        where: { code: 'NA' },
        update: {},
        create: {
          code: 'NA',
          name: 'North America',
          description: 'United States, Canada, and Mexico',
          countries: ['US', 'CA', 'MX'],
          timezones: ['America/New_York', 'America/Los_Angeles', 'America/Chicago', 'America/Toronto'],
          languageId: languages.find(l => l.code === 'en')!.id,
          currencyId: currencies.find(c => c.code === 'USD')!.id,
          businessHours: { start: '09:00', end: '17:00', timezone: 'America/New_York' },
          holidays: ['2024-01-01', '2024-07-04', '2024-12-25'],
          workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
          culturalNorms: { communication: 'direct', meetings: 'punctual', business_cards: 'optional' },
          colorScheme: { primary: '#1f2937', secondary: '#3b82f6' },
          isActive: true,
          priority: 100
        }
      }),
      prisma.marketRegion.upsert({
        where: { code: 'EU' },
        update: {},
        create: {
          code: 'EU',
          name: 'Europe',
          description: 'European Union and associated countries',
          countries: ['DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'SE', 'DK', 'NO', 'FI'],
          timezones: ['Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Europe/Stockholm'],
          languageId: languages.find(l => l.code === 'en')!.id,
          currencyId: currencies.find(c => c.code === 'EUR')!.id,
          businessHours: { start: '09:00', end: '17:00', timezone: 'Europe/Paris' },
          holidays: ['2024-01-01', '2024-05-01', '2024-12-25'],
          workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
          culturalNorms: { communication: 'formal', meetings: 'structured', business_cards: 'essential' },
          colorScheme: { primary: '#1e40af', secondary: '#10b981' },
          isActive: true,
          priority: 90
        }
      }),
      prisma.marketRegion.upsert({
        where: { code: 'NORDICS' },
        update: {},
        create: {
          code: 'NORDICS',
          name: 'Nordic Countries',
          description: 'Sweden, Norway, Denmark, Finland, and Iceland',
          countries: ['SE', 'NO', 'DK', 'FI', 'IS'],
          timezones: ['Europe/Stockholm', 'Europe/Oslo', 'Europe/Copenhagen', 'Europe/Helsinki'],
          languageId: languages.find(l => l.code === 'sv')!.id,
          currencyId: currencies.find(c => c.code === 'SEK')!.id,
          businessHours: { start: '08:00', end: '16:00', timezone: 'Europe/Stockholm' },
          holidays: ['2024-01-01', '2024-06-23', '2024-12-25'],
          workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
          culturalNorms: { communication: 'egalitarian', meetings: 'consensus', business_cards: 'digital' },
          colorScheme: { primary: '#0ea5e9', secondary: '#8b5cf6' },
          isActive: true,
          priority: 85
        }
      }),
      prisma.marketRegion.upsert({
        where: { code: 'APAC' },
        update: {},
        create: {
          code: 'APAC',
          name: 'Asia Pacific',
          description: 'Asian and Pacific countries including Japan, Australia, Singapore',
          countries: ['JP', 'AU', 'SG', 'KR', 'TH', 'MY', 'PH', 'VN', 'IN'],
          timezones: ['Asia/Tokyo', 'Australia/Sydney', 'Asia/Singapore', 'Asia/Seoul'],
          languageId: languages.find(l => l.code === 'en')!.id,
          currencyId: currencies.find(c => c.code === 'JPY')!.id,
          businessHours: { start: '09:00', end: '18:00', timezone: 'Asia/Tokyo' },
          holidays: ['2024-01-01', '2024-05-03', '2024-12-31'],
          workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
          culturalNorms: { communication: 'hierarchical', meetings: 'respectful', business_cards: 'ceremonial' },
          colorScheme: { primary: '#dc2626', secondary: '#f59e0b' },
          isActive: true,
          priority: 80
        }
      })
    ]);

    console.log(`✅ Created ${marketRegions.length} market regions`);

    // 4. Create Payment Methods for each region
    console.log('💳 Creating payment methods...');
    const paymentMethods = [];

    // North America Payment Methods
    const naPaymentMethods = await Promise.all([
      prisma.paymentMethod.create({
        data: {
          name: 'Stripe',
          code: 'stripe_na',
          type: 'card',
          marketRegionId: marketRegions.find(r => r.code === 'NA')!.id,
          countries: ['US', 'CA'],
          currencyId: currencies.find(c => c.code === 'USD')!.id,
          supportedCurrencies: ['USD', 'CAD'],
          configuration: { public_key: 'pk_test_...', secret_key: 'sk_test_...' },
          apiCredentials: { encrypted: true },
          processingFee: 2.9,
          fixedFee: 0.30,
          minimumAmount: 0.50,
          supportRefunds: true,
          supportPartialRefunds: true,
          supportRecurring: true,
          support3DS: true,
          isActive: true,
          testMode: true
        }
      }),
      prisma.paymentMethod.create({
        data: {
          name: 'PayPal',
          code: 'paypal_na',
          type: 'digital_wallet',
          marketRegionId: marketRegions.find(r => r.code === 'NA')!.id,
          countries: ['US', 'CA', 'MX'],
          currencyId: currencies.find(c => c.code === 'USD')!.id,
          supportedCurrencies: ['USD', 'CAD', 'MXN'],
          configuration: { client_id: 'paypal_client_...', client_secret: 'paypal_secret_...' },
          processingFee: 2.9,
          fixedFee: 0.30,
          supportRefunds: true,
          supportPartialRefunds: true,
          supportRecurring: true,
          isActive: true,
          testMode: true
        }
      })
    ]);

    // Europe Payment Methods
    const euPaymentMethods = await Promise.all([
      prisma.paymentMethod.create({
        data: {
          name: 'Stripe Europe',
          code: 'stripe_eu',
          type: 'card',
          marketRegionId: marketRegions.find(r => r.code === 'EU')!.id,
          countries: ['DE', 'FR', 'IT', 'ES', 'NL'],
          currencyId: currencies.find(c => c.code === 'EUR')!.id,
          supportedCurrencies: ['EUR', 'GBP'],
          configuration: { public_key: 'pk_test_eu_...', secret_key: 'sk_test_eu_...' },
          processingFee: 1.4,
          fixedFee: 0.25,
          supportRefunds: true,
          supportPartialRefunds: true,
          supportRecurring: true,
          support3DS: true,
          isActive: true,
          testMode: true
        }
      }),
      prisma.paymentMethod.create({
        data: {
          name: 'SEPA Direct Debit',
          code: 'sepa_dd',
          type: 'bank_transfer',
          marketRegionId: marketRegions.find(r => r.code === 'EU')!.id,
          countries: ['DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT'],
          currencyId: currencies.find(c => c.code === 'EUR')!.id,
          supportedCurrencies: ['EUR'],
          configuration: { creditor_id: 'DE98ZZZ09999999999' },
          processingFee: 0.35,
          fixedFee: 0.00,
          supportRefunds: true,
          supportRecurring: true,
          isActive: true,
          testMode: true
        }
      }),
      prisma.paymentMethod.create({
        data: {
          name: 'Klarna',
          code: 'klarna_eu',
          type: 'bnpl',
          marketRegionId: marketRegions.find(r => r.code === 'EU')!.id,
          countries: ['SE', 'NO', 'DK', 'FI', 'DE', 'AT', 'NL'],
          currencyId: currencies.find(c => c.code === 'EUR')!.id,
          supportedCurrencies: ['EUR', 'SEK', 'NOK', 'DKK'],
          configuration: { merchant_id: 'klarna_merchant_...', secret: 'klarna_secret_...' },
          processingFee: 3.29,
          fixedFee: 0.00,
          minimumAmount: 1.00,
          maximumAmount: 10000.00,
          supportRefunds: true,
          supportPartialRefunds: true,
          isActive: true,
          testMode: true
        }
      })
    ]);

    paymentMethods.push(...naPaymentMethods, ...euPaymentMethods);
    console.log(`✅ Created ${paymentMethods.length} payment methods`);

    // 5. Create Cultural Customizations
    console.log('🎨 Creating cultural customizations...');
    const culturalCustomizations = await Promise.all([
      prisma.culturalCustomization.create({
        data: {
          marketRegionId: marketRegions.find(r => r.code === 'NA')!.id,
          colorScheme: {
            primary: '#1f2937',
            secondary: '#3b82f6',
            accent: '#10b981',
            background: '#ffffff',
            surface: '#f9fafb'
          },
          typography: {
            fontFamily: 'Inter, sans-serif',
            fontSize: { base: '16px', small: '14px', large: '18px' }
          },
          layoutDirection: 'ltr',
          iconSet: 'outline',
          communicationStyle: 'direct',
          decisionMaking: 'individual',
          timeOrientation: 'linear',
          businessEtiquette: {
            greetings: 'handshake',
            punctuality: 'strict',
            dress_code: 'business_casual'
          },
          meetingStyle: {
            duration: 'efficient',
            structure: 'agenda_based',
            participation: 'encouraged'
          },
          contentTone: 'professional',
          imagePreferences: {
            style: 'modern',
            diversity: 'inclusive',
            setting: 'office'
          },
          userFlow: {
            onboarding: 'guided',
            navigation: 'breadcrumb',
            help: 'contextual'
          },
          isActive: true
        }
      }),
      prisma.culturalCustomization.create({
        data: {
          marketRegionId: marketRegions.find(r => r.code === 'NORDICS')!.id,
          colorScheme: {
            primary: '#0ea5e9',
            secondary: '#8b5cf6',
            accent: '#06b6d4',
            background: '#ffffff',
            surface: '#f8fafc'
          },
          typography: {
            fontFamily: 'Inter, sans-serif',
            fontSize: { base: '16px', small: '14px', large: '18px' }
          },
          layoutDirection: 'ltr',
          iconSet: 'minimal',
          communicationStyle: 'egalitarian',
          decisionMaking: 'consensus',
          timeOrientation: 'flexible',
          businessEtiquette: {
            greetings: 'informal',
            punctuality: 'respectful',
            dress_code: 'smart_casual'
          },
          meetingStyle: {
            duration: 'flexible',
            structure: 'collaborative',
            participation: 'expected'
          },
          contentTone: 'friendly',
          imagePreferences: {
            style: 'clean',
            diversity: 'nordic',
            setting: 'modern_office'
          },
          userFlow: {
            onboarding: 'self_service',
            navigation: 'intuitive',
            help: 'minimal'
          },
          isActive: true
        }
      })
    ]);

    console.log(`✅ Created ${culturalCustomizations.length} cultural customizations`);

    // 6. Create Sample Tax Rules
    console.log('📊 Creating tax rules...');
    const taxRules = await Promise.all([
      prisma.taxRule.create({
        data: {
          name: 'US Sales Tax',
          description: 'Standard US sales tax',
          country: 'US',
          region: 'CA',
          taxType: 'sales_tax',
          rate: 8.75,
          isCompound: false,
          productTypes: ['software', 'service'],
          effectiveDate: new Date('2024-01-01'),
          isActive: true,
          taxAuthority: 'California State Board of Equalization',
          registrationId: 'CA-12345678'
        }
      }),
      prisma.taxRule.create({
        data: {
          name: 'EU VAT',
          description: 'European Union Value Added Tax',
          country: 'DE',
          taxType: 'vat',
          rate: 19.0,
          isCompound: false,
          productTypes: ['software', 'service', 'digital'],
          minimumAmount: 0.01,
          effectiveDate: new Date('2024-01-01'),
          isActive: true,
          taxAuthority: 'Bundeszentralamt für Steuern',
          registrationId: 'DE123456789'
        }
      }),
      prisma.taxRule.create({
        data: {
          name: 'Swedish VAT',
          description: 'Swedish Value Added Tax',
          country: 'SE',
          taxType: 'vat',
          rate: 25.0,
          isCompound: false,
          productTypes: ['software', 'service', 'digital'],
          effectiveDate: new Date('2024-01-01'),
          isActive: true,
          taxAuthority: 'Skatteverket',
          registrationId: 'SE556123456701'
        }
      })
    ]);

    console.log(`✅ Created ${taxRules.length} tax rules`);

    // 7. Create Demo Tenant Configuration
    console.log('🏢 Creating demo tenant configuration...');
    
    // Find or create a demo tenant
    const demoTenant = await prisma.tenant.upsert({
      where: { subdomain: 'demo' },
      update: {},
      create: {
        name: 'Demo Tenant',
        domain: 'demo.re-commerce.dev',
        subdomain: 'demo',
        plan: 'enterprise',
        isActive: true,
        settings: {}
      }
    });

    // Configure languages for demo tenant
    const tenantLanguages = await Promise.all([
      prisma.tenantLanguage.upsert({
        where: {
          tenantId_languageId: {
            tenantId: demoTenant.id,
            languageId: languages.find(l => l.code === 'en')!.id
          }
        },
        update: {},
        create: {
          tenantId: demoTenant.id,
          languageId: languages.find(l => l.code === 'en')!.id,
          isDefault: true,
          isActive: true,
          priority: 100,
          translationStatus: 'complete',
          completeness: 100.0
        }
      }),
      prisma.tenantLanguage.upsert({
        where: {
          tenantId_languageId: {
            tenantId: demoTenant.id,
            languageId: languages.find(l => l.code === 'sv')!.id
          }
        },
        update: {},
        create: {
          tenantId: demoTenant.id,
          languageId: languages.find(l => l.code === 'sv')!.id,
          isDefault: false,
          isActive: true,
          priority: 90,
          translationStatus: 'incomplete',
          completeness: 85.0
        }
      }),
      prisma.tenantLanguage.upsert({
        where: {
          tenantId_languageId: {
            tenantId: demoTenant.id,
            languageId: languages.find(l => l.code === 'de')!.id
          }
        },
        update: {},
        create: {
          tenantId: demoTenant.id,
          languageId: languages.find(l => l.code === 'de')!.id,
          isDefault: false,
          isActive: true,
          priority: 80,
          translationStatus: 'in_progress',
          completeness: 78.0
        }
      })
    ]);

    // Configure currencies for demo tenant
    const tenantCurrencies = await Promise.all([
      prisma.tenantCurrency.upsert({
        where: {
          tenantId_currencyId: {
            tenantId: demoTenant.id,
            currencyId: currencies.find(c => c.code === 'USD')!.id
          }
        },
        update: {},
        create: {
          tenantId: demoTenant.id,
          currencyId: currencies.find(c => c.code === 'USD')!.id,
          isDefault: true,
          isActive: true,
          markupPercentage: 0.0,
          roundingRule: 'nearest',
          processingFee: 0.0
        }
      }),
      prisma.tenantCurrency.upsert({
        where: {
          tenantId_currencyId: {
            tenantId: demoTenant.id,
            currencyId: currencies.find(c => c.code === 'EUR')!.id
          }
        },
        update: {},
        create: {
          tenantId: demoTenant.id,
          currencyId: currencies.find(c => c.code === 'EUR')!.id,
          isDefault: false,
          isActive: true,
          markupPercentage: 2.5,
          roundingRule: 'nearest',
          processingFee: 0.25
        }
      })
    ]);

    console.log(`✅ Configured ${tenantLanguages.length} languages and ${tenantCurrencies.length} currencies for demo tenant`);

    // 8. Create Sample Analytics Data
    console.log('📈 Creating sample analytics data...');
    const analyticsData = [];
    const metrics = ['user_acquisition', 'revenue', 'conversion', 'engagement'];
    const regions = marketRegions.slice(0, 3); // Use first 3 regions

    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      for (const region of regions) {
        for (const metric of metrics) {
          analyticsData.push({
            tenantId: demoTenant.id,
            marketRegionId: region.id,
            metric,
            value: Math.random() * 1000 + 100,
            previousValue: Math.random() * 1000 + 50,
            growthRate: (Math.random() - 0.5) * 20, // -10% to +10%
            marketAverage: Math.random() * 800 + 200,
            period: 'daily',
            timestamp: date
          });
        }
      }
    }

    await prisma.marketAnalytics.createMany({
      data: analyticsData,
      skipDuplicates: true
    });

    console.log(`✅ Created ${analyticsData.length} analytics data points`);

    console.log('🎉 International expansion seeding completed successfully!');
    
    return {
      languages: languages.length,
      currencies: currencies.length,
      marketRegions: marketRegions.length,
      paymentMethods: paymentMethods.length,
      culturalCustomizations: culturalCustomizations.length,
      taxRules: taxRules.length,
      tenantLanguages: tenantLanguages.length,
      tenantCurrencies: tenantCurrencies.length,
      analyticsPoints: analyticsData.length
    };

  } catch (error) {
    console.error('❌ Error seeding international data:', error);
    throw error;
  }
}

async function main() {
  try {
    const results = await seedInternationalData();
    console.log('\n📊 Seeding Summary:');
    console.log(`📝 Languages: ${results.languages}`);
    console.log(`💰 Currencies: ${results.currencies}`);
    console.log(`🗺️ Market Regions: ${results.marketRegions}`);
    console.log(`💳 Payment Methods: ${results.paymentMethods}`);
    console.log(`🎨 Cultural Customizations: ${results.culturalCustomizations}`);
    console.log(`📊 Tax Rules: ${results.taxRules}`);
    console.log(`🏢 Tenant Languages: ${results.tenantLanguages}`);
    console.log(`🏢 Tenant Currencies: ${results.tenantCurrencies}`);
    console.log(`📈 Analytics Points: ${results.analyticsPoints}`);
  } catch (error) {
    console.error('Failed to seed international data:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}

export default seedInternationalData;
