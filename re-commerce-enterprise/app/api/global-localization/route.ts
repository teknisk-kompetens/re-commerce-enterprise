
/**
 * GLOBAL LOCALIZATION API
 * API endpoints for international localization and translation services
 */

import { NextRequest, NextResponse } from 'next/server';
import { internationalLocalizationEngine } from '@/lib/international-localization-engine';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const configId = searchParams.get('configId');

    switch (action) {
      case 'configurations':
        const configurations = await internationalLocalizationEngine.listLocalizationConfigs();
        return NextResponse.json({ success: true, data: configurations });

      case 'configuration':
        if (!configId) {
          return NextResponse.json({ success: false, error: 'Config ID required' }, { status: 400 });
        }
        const configuration = await internationalLocalizationEngine.getLocalizationConfig(configId);
        return NextResponse.json({ success: true, data: configuration });

      case 'translations':
        if (!configId) {
          return NextResponse.json({ success: false, error: 'Config ID required' }, { status: 400 });
        }
        const translations = await internationalLocalizationEngine.getTranslations(configId);
        return NextResponse.json({ success: true, data: translations });

      case 'global-metrics':
        const globalMetrics = await internationalLocalizationEngine.getGlobalLocalizationMetrics();
        return NextResponse.json({ success: true, data: globalMetrics });

      case 'translate':
        const text = searchParams.get('text');
        const fromLanguage = searchParams.get('fromLanguage');
        const toLanguage = searchParams.get('toLanguage');
        const context = searchParams.get('context');
        const namespace = searchParams.get('namespace');

        if (!text || !fromLanguage || !toLanguage) {
          return NextResponse.json({ success: false, error: 'Text, from language, and to language required' }, { status: 400 });
        }

        const translatedText = await internationalLocalizationEngine.translateText(
          text, fromLanguage, toLanguage, context ?? undefined, namespace ?? undefined
        );
        return NextResponse.json({ success: true, data: { translatedText } });

      case 'format-number':
        const value = parseFloat(searchParams.get('value') || '0');
        const language = searchParams.get('language');
        const style = searchParams.get('style') as 'decimal' | 'currency' | 'percent' | undefined;
        const currency = searchParams.get('currency');

        if (!language) {
          return NextResponse.json({ success: false, error: 'Language required' }, { status: 400 });
        }

        const formattedNumber = await internationalLocalizationEngine.formatNumber(
          value, language, { style, currency: currency ?? undefined }
        );
        return NextResponse.json({ success: true, data: { formattedNumber } });

      case 'format-date':
        const dateStr = searchParams.get('date');
        const lang = searchParams.get('language');
        const dateStyle = searchParams.get('style') as 'short' | 'medium' | 'long' | 'full' | undefined;

        if (!dateStr || !lang) {
          return NextResponse.json({ success: false, error: 'Date and language required' }, { status: 400 });
        }

        const date = new Date(dateStr);
        const formattedDate = await internationalLocalizationEngine.formatDate(date, lang, dateStyle);
        return NextResponse.json({ success: true, data: { formattedDate } });

      case 'format-time':
        const timeStr = searchParams.get('time');
        const timeLang = searchParams.get('language');
        const timeStyle = searchParams.get('style') as 'short' | 'medium' | 'long' | 'full' | undefined;

        if (!timeStr || !timeLang) {
          return NextResponse.json({ success: false, error: 'Time and language required' }, { status: 400 });
        }

        const time = new Date(timeStr);
        const formattedTime = await internationalLocalizationEngine.formatTime(time, timeLang, timeStyle);
        return NextResponse.json({ success: true, data: { formattedTime } });

      default:
        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Global localization API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    switch (action) {
      case 'create-configuration':
        const configId = await internationalLocalizationEngine.createLocalizationConfig(data);
        return NextResponse.json({ success: true, data: { configId } });

      case 'translate-batch':
        const { texts, fromLanguage, toLanguage, context, namespace } = data;
        if (!texts || !Array.isArray(texts) || !fromLanguage || !toLanguage) {
          return NextResponse.json({ success: false, error: 'Texts array, from language, and to language required' }, { status: 400 });
        }

        const translations = await Promise.all(
          texts.map(text => 
            internationalLocalizationEngine.translateText(text, fromLanguage, toLanguage, context, namespace)
          )
        );
        return NextResponse.json({ success: true, data: { translations } });

      case 'batch-format-numbers':
        const { values, language, options } = data;
        if (!values || !Array.isArray(values) || !language) {
          return NextResponse.json({ success: false, error: 'Values array and language required' }, { status: 400 });
        }

        const formattedNumbers = await Promise.all(
          values.map(value => 
            internationalLocalizationEngine.formatNumber(value, language, options)
          )
        );
        return NextResponse.json({ success: true, data: { formattedNumbers } });

      case 'batch-format-dates':
        const { dates, language: dateLanguage, style } = data;
        if (!dates || !Array.isArray(dates) || !dateLanguage) {
          return NextResponse.json({ success: false, error: 'Dates array and language required' }, { status: 400 });
        }

        const formattedDates = await Promise.all(
          dates.map(dateStr => {
            const date = new Date(dateStr);
            return internationalLocalizationEngine.formatDate(date, dateLanguage, style);
          })
        );
        return NextResponse.json({ success: true, data: { formattedDates } });

      default:
        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Global localization API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    switch (action) {
      case 'update-configuration':
        const { configId, updates } = data;
        if (!configId || !updates) {
          return NextResponse.json({ success: false, error: 'Config ID and updates required' }, { status: 400 });
        }
        await internationalLocalizationEngine.updateLocalizationConfig(configId, updates);
        return NextResponse.json({ success: true, data: { message: 'Configuration updated' } });

      default:
        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Global localization API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const configId = searchParams.get('configId');

    if (!configId) {
      return NextResponse.json({ success: false, error: 'Config ID required' }, { status: 400 });
    }

    await internationalLocalizationEngine.deleteLocalizationConfig(configId);
    return NextResponse.json({ success: true, data: { message: 'Configuration deleted' } });
  } catch (error) {
    console.error('Global localization API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

