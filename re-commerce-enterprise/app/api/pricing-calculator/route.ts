
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface PricingRequest {
  users: number;
  modules: string[];
  deploymentType: 'cloud' | 'onPremise' | 'hybrid';
  supportLevel: 'basic' | 'premium' | 'enterprise';
  contractLength: 12 | 24 | 36;
  industry: string;
  companySize: 'startup' | 'smb' | 'midmarket' | 'enterprise';
}

export async function POST(request: NextRequest) {
  try {
    const body: PricingRequest = await request.json();
    
    // Base pricing calculations
    const basePricing = {
      userCost: calculateUserCost(body.users, body.companySize),
      moduleCosts: calculateModuleCosts(body.modules),
      deploymentCost: calculateDeploymentCost(body.deploymentType),
      supportCost: calculateSupportCost(body.supportLevel, body.users),
    };

    // Apply discounts
    const discounts = {
      contractDiscount: calculateContractDiscount(body.contractLength),
      volumeDiscount: calculateVolumeDiscount(body.users),
      industryDiscount: calculateIndustryDiscount(body.industry),
    };

    const subtotal = Object.values(basePricing).reduce((sum, cost) => sum + cost, 0);
    const totalDiscount = Object.values(discounts).reduce((sum, discount) => sum + discount, 0);
    const finalPrice = subtotal - totalDiscount;

    // ROI calculations
    const roiData = calculateROI(body, finalPrice);

    const response = {
      pricing: {
        ...basePricing,
        subtotal,
        discounts,
        totalDiscount,
        finalPrice,
        monthlyPrice: finalPrice / body.contractLength,
        pricePerUser: finalPrice / body.users / body.contractLength,
      },
      roi: roiData,
      recommendations: generateRecommendations(body),
      comparison: generateCompetitorComparison(finalPrice, body.users)
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Pricing calculation error:', error);
    return NextResponse.json({ error: 'Failed to calculate pricing' }, { status: 500 });
  }
}

function calculateUserCost(users: number, companySize: string): number {
  const baseCostPerUser = {
    startup: 45,
    smb: 65,
    midmarket: 85,
    enterprise: 125
  };
  
  return users * baseCostPerUser[companySize as keyof typeof baseCostPerUser] * 12;
}

function calculateModuleCosts(modules: string[]): number {
  const modulePricing = {
    'analytics': 15000,
    'ai-insights': 25000,
    'security': 18000,
    'integration': 12000,
    'automation': 20000,
    'compliance': 14000,
    'mobile': 8000,
    'api-access': 10000
  };
  
  return modules.reduce((sum, module) => {
    return sum + (modulePricing[module as keyof typeof modulePricing] || 0);
  }, 0);
}

function calculateDeploymentCost(type: string): number {
  const deploymentCosts = {
    cloud: 0,
    onPremise: 45000,
    hybrid: 25000
  };
  
  return deploymentCosts[type as keyof typeof deploymentCosts];
}

function calculateSupportCost(level: string, users: number): number {
  const supportMultipliers = {
    basic: 0.1,
    premium: 0.18,
    enterprise: 0.25
  };
  
  return users * 600 * supportMultipliers[level as keyof typeof supportMultipliers];
}

function calculateContractDiscount(length: number): number {
  const discountRates = {
    12: 0,
    24: 0.08,
    36: 0.15
  };
  
  return discountRates[length as keyof typeof discountRates] || 0;
}

function calculateVolumeDiscount(users: number): number {
  if (users > 1000) return 15000;
  if (users > 500) return 8000;
  if (users > 100) return 3000;
  return 0;
}

function calculateIndustryDiscount(industry: string): number {
  const industryDiscounts = {
    'healthcare': 5000,
    'education': 8000,
    'nonprofit': 12000,
    'government': 7000
  };
  
  return industryDiscounts[industry as keyof typeof industryDiscounts] || 0;
}

function calculateROI(request: PricingRequest, totalCost: number) {
  // Industry-specific efficiency gains
  const industryMultipliers = {
    'retail': 1.8,
    'healthcare': 2.2,
    'finance': 2.5,
    'manufacturing': 2.1,
    'technology': 1.9,
    'default': 1.7
  };
  
  const multiplier = industryMultipliers[request.industry as keyof typeof industryMultipliers] || industryMultipliers.default;
  const averageSalary = 75000;
  const efficiencyGain = 0.25; // 25% efficiency improvement
  
  const annualSavings = request.users * averageSalary * efficiencyGain * multiplier;
  const threeYearSavings = annualSavings * 3;
  const roi = ((threeYearSavings - totalCost) / totalCost) * 100;
  const paybackPeriod = totalCost / (annualSavings / 12); // months
  
  return {
    annualSavings,
    threeYearSavings,
    roi: Math.round(roi),
    paybackPeriod: Math.round(paybackPeriod),
    netPresentValue: threeYearSavings - totalCost,
    breakEvenPoint: paybackPeriod
  };
}

function generateRecommendations(request: PricingRequest): Array<{
  type: string;
  title: string;
  description: string;
  potential_savings?: number;
  value?: string;
  roi_impact?: string;
}> {
  const recommendations: Array<{
    type: string;
    title: string;
    description: string;
    potential_savings?: number;
    value?: string;
    roi_impact?: string;
  }> = [];
  
  if (request.contractLength === 12) {
    recommendations.push({
      type: 'contract',
      title: 'Consider a longer contract',
      description: 'Save up to 15% with a 3-year contract',
      potential_savings: Math.round(request.users * 65 * 12 * 0.15)
    });
  }
  
  if (request.supportLevel === 'basic' && request.users > 100) {
    recommendations.push({
      type: 'support',
      title: 'Upgrade to Premium Support',
      description: 'Faster response times and dedicated success manager',
      value: 'Enhanced productivity and reduced downtime'
    });
  }
  
  if (!request.modules.includes('ai-insights')) {
    recommendations.push({
      type: 'module',
      title: 'Add AI Insights Module',
      description: 'Unlock predictive analytics and automation',
      roi_impact: '35% additional efficiency gains'
    });
  }
  
  return recommendations;
}

function generateCompetitorComparison(price: number, users: number) {
  const pricePerUser = price / users / 12; // monthly per user
  
  return {
    reCommerce: {
      monthlyPerUser: Math.round(pricePerUser),
      features: ['Full Analytics', 'AI-Powered', 'Enterprise Security', '24/7 Support'],
      rating: 4.8
    },
    competitor1: {
      name: 'Competitor A',
      monthlyPerUser: Math.round(pricePerUser * 1.35),
      features: ['Basic Analytics', 'Limited AI', 'Standard Security'],
      rating: 4.2
    },
    competitor2: {
      name: 'Competitor B',
      monthlyPerUser: Math.round(pricePerUser * 1.68),
      features: ['Advanced Analytics', 'AI Add-on', 'Premium Security'],
      rating: 4.1
    },
    savings: {
      vsCompetitorA: Math.round((pricePerUser * 1.35 - pricePerUser) * users * 12),
      vsCompetitorB: Math.round((pricePerUser * 1.68 - pricePerUser) * users * 12)
    }
  };
}
