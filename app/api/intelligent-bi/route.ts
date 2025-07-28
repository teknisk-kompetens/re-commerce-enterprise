
/**
 * INTELLIGENT BUSINESS INTELLIGENCE API
 * AI-powered business intelligence, automated reports, predictive metrics,
 * and intelligent data classification
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { enterpriseAI } from '@/lib/enterprise-ai-features';
import { mlSystems } from '@/lib/ml-systems';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const tenantId = searchParams.get('tenantId') || 'default';

    switch (action) {
      case 'dashboards':
        return await getBIDashboards(tenantId);
      case 'reports':
        return await getReports(tenantId);
      case 'insights':
        return await getInsights(tenantId);
      case 'predictions':
        return await getPredictions(tenantId);
      case 'recommendations':
        return await getRecommendations(tenantId);
      default:
        return await getBIOverview(tenantId);
    }
  } catch (error) {
    console.error('Intelligent BI API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'create_dashboard':
        return await createBIDashboard(data, session.user.id);
      case 'generate_report':
        return await generateReport(data, session.user.id);
      case 'create_automated_report':
        return await createAutomatedReport(data, session.user.id);
      case 'classify_data':
        return await classifyData(data, session.user.id);
      case 'generate_insights':
        return await generateInsights(data, session.user.id);
      case 'predict_metrics':
        return await predictMetrics(data, session.user.id);
      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Intelligent BI API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function getBIOverview(tenantId: string) {
  const [dashboards, reports, insights, predictions] = await Promise.all([
    getBIDashboards(tenantId),
    getReports(tenantId),
    getInsights(tenantId),
    getPredictions(tenantId)
  ]);

  const overview = {
    dashboards: await dashboards.json(),
    reports: await reports.json(),
    insights: await insights.json(),
    predictions: await predictions.json(),
    stats: {
      totalDashboards: 12,
      activeReports: 8,
      dailyInsights: 45,
      accuracyRate: 94.2,
      dataProcessed: 2.4, // TB
      predictionAccuracy: 91.7
    },
    keyMetrics: {
      revenue: {
        current: 1250000,
        predicted: 1380000,
        growth: 10.4,
        trend: 'up'
      },
      customers: {
        current: 15420,
        predicted: 16890,
        growth: 9.5,
        trend: 'up'
      },
      conversion: {
        current: 3.2,
        predicted: 3.8,
        growth: 18.7,
        trend: 'up'
      }
    }
  };

  return NextResponse.json(overview);
}

async function getBIDashboards(tenantId: string) {
  const businessIntelligence = await enterpriseAI.getAllBusinessIntelligence();
  
  const dashboards = businessIntelligence.map(bi => ({
    id: bi.id,
    name: bi.name,
    description: bi.description,
    dataSource: bi.dataSource,
    insights: bi.insights.length,
    predictions: bi.predictions.length,
    recommendations: bi.recommendations.length,
    visualizations: bi.visualizations.map(viz => ({
      type: viz.type,
      title: viz.title,
      config: viz.config
    })),
    refreshRate: bi.refreshRate,
    lastRefresh: bi.lastRefresh,
    createdAt: bi.createdAt
  }));

  return NextResponse.json(dashboards);
}

async function getReports(tenantId: string) {
  const automatedReports = await enterpriseAI.getAllAutomatedReports();
  
  const reports = automatedReports.map(report => ({
    id: report.id,
    name: report.name,
    type: report.type,
    schedule: report.schedule,
    recipients: report.recipients,
    lastGenerated: report.lastGenerated,
    isActive: report.isActive,
    parameters: report.parameters
  }));

  return NextResponse.json(reports);
}

async function getInsights(tenantId: string) {
  const businessIntelligence = await enterpriseAI.getAllBusinessIntelligence();
  
  const allInsights = businessIntelligence.flatMap(bi => 
    bi.insights.map(insight => ({
      id: `${bi.id}_${insight.type}`,
      biId: bi.id,
      biName: bi.name,
      type: insight.type,
      title: insight.title,
      description: insight.description,
      confidence: insight.confidence,
      impact: insight.impact,
      data: insight.data,
      timestamp: insight.timestamp
    }))
  );

  return NextResponse.json(allInsights);
}

async function getPredictions(tenantId: string) {
  const businessIntelligence = await enterpriseAI.getAllBusinessIntelligence();
  const predictiveAnalytics = await mlSystems.getAllPredictiveAnalytics();
  
  const biPredictions = businessIntelligence.flatMap(bi => 
    bi.predictions.map(pred => ({
      id: `${bi.id}_${pred.metric}`,
      source: 'business_intelligence',
      sourceId: bi.id,
      sourceName: bi.name,
      metric: pred.metric,
      currentValue: pred.currentValue,
      predictedValue: pred.predictedValue,
      timeframe: pred.timeframe,
      confidence: pred.confidence,
      factors: pred.factors,
      timestamp: pred.timestamp
    }))
  );

  const mlPredictions = predictiveAnalytics.flatMap(analytics => 
    analytics.predictions.map(pred => ({
      id: pred.id,
      source: 'predictive_analytics',
      sourceId: analytics.id,
      sourceName: analytics.name,
      metric: pred.metric,
      currentValue: pred.currentValue,
      predictedValue: pred.predictedValue,
      timeframe: pred.timeframe,
      confidence: pred.confidence,
      factors: pred.factors,
      timestamp: pred.timestamp
    }))
  );

  const allPredictions = [...biPredictions, ...mlPredictions];

  return NextResponse.json(allPredictions);
}

async function getRecommendations(tenantId: string) {
  const businessIntelligence = await enterpriseAI.getAllBusinessIntelligence();
  const recommendationEngines = await mlSystems.getAllRecommendationEngines();
  
  const biRecommendations = businessIntelligence.flatMap(bi => 
    bi.recommendations.map(rec => ({
      id: `${bi.id}_${rec.type}`,
      source: 'business_intelligence',
      sourceId: bi.id,
      sourceName: bi.name,
      type: rec.type,
      title: rec.title,
      description: rec.description,
      priority: rec.priority,
      estimatedImpact: rec.estimatedImpact,
      implementation: rec.implementation,
      timestamp: rec.timestamp
    }))
  );

  const mlRecommendations = recommendationEngines.flatMap(engine => 
    engine.recommendations.slice(0, 10).map(rec => ({
      id: rec.id,
      source: 'recommendation_engine',
      sourceId: engine.id,
      sourceName: engine.name,
      type: 'personalization',
      title: `Recommendation for ${rec.itemType}`,
      description: rec.reasoning,
      priority: rec.score > 0.8 ? 'high' : rec.score > 0.6 ? 'medium' : 'low',
      estimatedImpact: `${Math.round(rec.score * 100)}% match`,
      implementation: rec.metadata,
      timestamp: rec.timestamp
    }))
  );

  const allRecommendations = [...biRecommendations, ...mlRecommendations];

  return NextResponse.json(allRecommendations);
}

async function createBIDashboard(data: any, userId: string) {
  try {
    const biId = await enterpriseAI.createBusinessIntelligence(
      data.name,
      data.description,
      data.dataSource,
      data.tenantId
    );

    return NextResponse.json({ biId, status: 'created' });
  } catch (error) {
    console.error('BI dashboard creation error:', error);
    return NextResponse.json({ error: 'Dashboard creation failed' }, { status: 500 });
  }
}

async function generateReport(data: any, userId: string) {
  try {
    const reportContent = await enterpriseAI.generateReport(data.reportId);
    
    return NextResponse.json({
      reportId: data.reportId,
      content: reportContent,
      generatedAt: new Date(),
      status: 'generated'
    });
  } catch (error) {
    console.error('Report generation error:', error);
    return NextResponse.json({ error: 'Report generation failed' }, { status: 500 });
  }
}

async function createAutomatedReport(data: any, userId: string) {
  try {
    const reportId = await enterpriseAI.createAutomatedReport({
      name: data.name,
      type: data.type,
      schedule: data.schedule,
      recipients: data.recipients,
      template: data.template,
      parameters: data.parameters,
      isActive: true,
      tenantId: data.tenantId
    });

    return NextResponse.json({ reportId, status: 'created' });
  } catch (error) {
    console.error('Automated report creation error:', error);
    return NextResponse.json({ error: 'Automated report creation failed' }, { status: 500 });
  }
}

async function classifyData(data: any, userId: string) {
  try {
    const classification = await enterpriseAI.classifyData(data.data, data.tenantId);
    
    return NextResponse.json({
      classificationId: classification.id,
      classification: classification.classification,
      sensitivity: classification.sensitivity,
      tags: classification.tags,
      rules: classification.rules,
      status: 'classified'
    });
  } catch (error) {
    console.error('Data classification error:', error);
    return NextResponse.json({ error: 'Data classification failed' }, { status: 500 });
  }
}

async function generateInsights(data: any, userId: string) {
  try {
    const biId = await enterpriseAI.createBusinessIntelligence(
      `Insights for ${data.name}`,
      `AI-generated insights for ${data.description}`,
      data.dataSource,
      data.tenantId
    );

    const bi = await enterpriseAI.getBusinessIntelligence(biId);
    
    return NextResponse.json({
      biId,
      insights: bi?.insights || [],
      status: 'generated'
    });
  } catch (error) {
    console.error('Insights generation error:', error);
    return NextResponse.json({ error: 'Insights generation failed' }, { status: 500 });
  }
}

async function predictMetrics(data: any, userId: string) {
  try {
    const analyticsId = await mlSystems.createPredictiveAnalytics({
      name: data.name,
      description: data.description,
      type: data.type,
      algorithm: data.algorithm,
      dataSource: data.dataSource,
      features: data.features,
      schedule: {
        frequency: data.frequency || 'daily',
        enabled: true,
        nextRun: new Date(Date.now() + 24 * 60 * 60 * 1000),
        retryPolicy: {
          maxRetries: 3,
          retryDelay: 1000,
          backoffStrategy: 'exponential'
        }
      },
      tenantId: data.tenantId
    });

    const predictions = await mlSystems.generatePredictions(analyticsId, data.inputData);
    
    return NextResponse.json({
      analyticsId,
      predictions,
      status: 'predicted'
    });
  } catch (error) {
    console.error('Metrics prediction error:', error);
    return NextResponse.json({ error: 'Metrics prediction failed' }, { status: 500 });
  }
}
