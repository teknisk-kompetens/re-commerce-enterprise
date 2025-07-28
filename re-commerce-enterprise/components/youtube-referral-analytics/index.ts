
// YouTube/Referral Analytics & Insights Components Export
export { default as YouTubeCreatorDashboard } from './youtube-creator-dashboard';
export { default as ViralReferralManagement } from './viral-referral-management';
export { default as AdvancedAnalyticsPlatform } from './advanced-analytics-platform';

// Component categories for easy importing
export const YouTubeComponents = {
  CreatorDashboard: require('./youtube-creator-dashboard').default
};

export const ReferralComponents = {
  ViralManagement: require('./viral-referral-management').default
};

export const AnalyticsComponents = {
  AdvancedPlatform: require('./advanced-analytics-platform').default
};

// Combined exports for convenience
export const YouTubeReferralAnalytics = {
  YouTubeCreatorDashboard: require('./youtube-creator-dashboard').default,
  ViralReferralManagement: require('./viral-referral-management').default,
  AdvancedAnalyticsPlatform: require('./advanced-analytics-platform').default
};

