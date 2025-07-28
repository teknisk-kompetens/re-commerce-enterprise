
'use client';

/**
 * COOKIE CONSENT MANAGER
 * GDPR-compliant cookie consent med granular kontroller
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cookie,
  Settings,
  Shield,
  BarChart,
  Globe,
  ChevronDown,
  ChevronRight,
  Check,
  X,
  Info,
  ExternalLink
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface CookieCategory {
  id: string;
  name: string;
  description: string;
  essential: boolean;
  enabled: boolean;
  cookies: CookieInfo[];
  purpose: string;
  retention: string;
  thirdParties?: string[];
}

interface CookieInfo {
  name: string;
  purpose: string;
  retention: string;
  type: 'necessary' | 'functional' | 'analytics' | 'marketing';
  domain: string;
}

interface ConsentPreferences {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: Date;
  version: string;
}

const COOKIE_CATEGORIES: CookieCategory[] = [
  {
    id: 'necessary',
    name: 'Nödvändiga Cookies',
    description: 'Dessa cookies är nödvändiga för att webbplatsen ska fungera och kan inte stängas av.',
    essential: true,
    enabled: true,
    purpose: 'Säkerställa grundläggande funktionalitet och säkerhet',
    retention: 'Session eller 1 år',
    cookies: [
      {
        name: 'auth-token',
        purpose: 'Autentisering och session management',
        retention: '2 timmar',
        type: 'necessary',
        domain: '.re-commerce.se'
      },
      {
        name: 'csrf-token',
        purpose: 'CSRF-skydd',
        retention: 'Session',
        type: 'necessary',
        domain: '.re-commerce.se'
      },
      {
        name: 'tenant-context',
        purpose: 'Multi-tenant kontext',
        retention: 'Session',
        type: 'necessary',
        domain: '.re-commerce.se'
      },
      {
        name: 'security-headers',
        purpose: 'Säkerhetsvalidering',
        retention: '1 timme',
        type: 'necessary',
        domain: '.re-commerce.se'
      }
    ]
  },
  {
    id: 'functional',
    name: 'Funktionella Cookies',
    description: 'Dessa cookies möjliggör förbättrad funktionalitet och personalisering.',
    essential: false,
    enabled: false,
    purpose: 'Spara användarpreferenser och förbättra användarupplevelsen',
    retention: '30 dagar till 1 år',
    cookies: [
      {
        name: 'theme-preference',
        purpose: 'Spara tema-inställningar (mörkt/ljust)',
        retention: '1 år',
        type: 'functional',
        domain: '.re-commerce.se'
      },
      {
        name: 'language-preference',
        purpose: 'Spara språkval',
        retention: '1 år',
        type: 'functional',
        domain: '.re-commerce.se'
      },
      {
        name: 'dashboard-layout',
        purpose: 'Spara dashboard-layout och preferenser',
        retention: '6 månader',
        type: 'functional',
        domain: '.re-commerce.se'
      }
    ]
  },
  {
    id: 'analytics',
    name: 'Analys Cookies',
    description: 'Dessa cookies hjälper oss förstå hur besökare interagerar med webbplatsen.',
    essential: false,
    enabled: false,
    purpose: 'Samla in anonymiserad statistik för att förbättra tjänsten',
    retention: '1-2 år',
    thirdParties: ['Google Analytics', 'Hotjar'],
    cookies: [
      {
        name: '_ga',
        purpose: 'Google Analytics - unik besökaridentifiering',
        retention: '2 år',
        type: 'analytics',
        domain: '.google-analytics.com'
      },
      {
        name: '_gid',
        purpose: 'Google Analytics - sessionidentifiering',
        retention: '24 timmar',
        type: 'analytics',
        domain: '.google-analytics.com'
      },
      {
        name: 'usage-analytics',
        purpose: 'Intern användningsanalys',
        retention: '1 år',
        type: 'analytics',
        domain: '.re-commerce.se'
      }
    ]
  },
  {
    id: 'marketing',
    name: 'Marknadsföring Cookies',
    description: 'Dessa cookies används för att visa relevanta annonser och marknadsföring.',
    essential: false,
    enabled: false,
    purpose: 'Personaliserad marknadsföring och annonsering',
    retention: '30 dagar till 2 år',
    thirdParties: ['Facebook', 'LinkedIn', 'Google Ads'],
    cookies: [
      {
        name: 'fbp',
        purpose: 'Facebook Pixel - användarspårning',
        retention: '3 månader',
        type: 'marketing',
        domain: '.facebook.com'
      },
      {
        name: 'li_sugr',
        purpose: 'LinkedIn - målgruppsanpassning',
        retention: '3 månader',
        type: 'marketing',
        domain: '.linkedin.com'
      }
    ]
  }
];

export default function CookieConsentManager() {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<ConsentPreferences>({
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false,
    timestamp: new Date(),
    version: '2.0'
  });
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  // Check for existing consent
  useEffect(() => {
    const checkExistingConsent = () => {
      try {
        const existingConsent = localStorage.getItem('cookie-consent');
        if (existingConsent) {
          const consent = JSON.parse(existingConsent);
          
          // Check if consent is still valid (not older than 13 months)
          const consentDate = new Date(consent.timestamp);
          const now = new Date();
          const monthsDiff = (now.getTime() - consentDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
          
          if (monthsDiff > 13 || consent.version !== '2.0') {
            // Consent expired or version mismatch, show banner
            setShowBanner(true);
          } else {
            // Valid consent exists, apply preferences
            setPreferences(consent);
            applyCookiePreferences(consent);
          }
        } else {
          // No consent found, show banner
          setShowBanner(true);
        }
      } catch (error) {
        console.error('Error checking existing consent:', error);
        setShowBanner(true);
      }
    };

    // Check after a short delay to ensure DOM is ready
    setTimeout(checkExistingConsent, 1000);
  }, []);

  const toggleCategory = (categoryId: string) => {
    const newExpandedCategories = new Set(expandedCategories);
    if (newExpandedCategories.has(categoryId)) {
      newExpandedCategories.delete(categoryId);
    } else {
      newExpandedCategories.add(categoryId);
    }
    setExpandedCategories(newExpandedCategories);
  };

  const updatePreference = (categoryId: string, enabled: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [categoryId]: enabled
    }));
  };

  const applyCookiePreferences = (prefs: ConsentPreferences) => {
    // Apply cookie preferences to the browser
    if (typeof window !== 'undefined') {
      // Set consent flags for other scripts to check
      (window as any).cookieConsent = {
        necessary: prefs.necessary,
        functional: prefs.functional,
        analytics: prefs.analytics,
        marketing: prefs.marketing,
        timestamp: prefs.timestamp,
        version: prefs.version
      };

      // Initialize/disable analytics based on consent
      if (prefs.analytics) {
        // Initialize Google Analytics if consented
        // gtag('consent', 'update', { 'analytics_storage': 'granted' });
      } else {
        // Disable analytics
        // gtag('consent', 'update', { 'analytics_storage': 'denied' });
      }

      // Initialize/disable marketing cookies
      if (prefs.marketing) {
        // Initialize marketing cookies if consented
        // gtag('consent', 'update', { 'ad_storage': 'granted' });
      } else {
        // Disable marketing cookies
        // gtag('consent', 'update', { 'ad_storage': 'denied' });
      }

      // Clean up non-consented cookies
      if (!prefs.functional) {
        removeCookiesByType('functional');
      }
      if (!prefs.analytics) {
        removeCookiesByType('analytics');
      }
      if (!prefs.marketing) {
        removeCookiesByType('marketing');
      }
    }
  };

  const removeCookiesByType = (type: string) => {
    const category = COOKIE_CATEGORIES.find(cat => cat.id === type);
    if (category) {
      category.cookies.forEach(cookie => {
        // Remove cookie from all domains
        document.cookie = `${cookie.name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
        document.cookie = `${cookie.name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${cookie.domain};`;
      });
    }
  };

  const saveConsent = async (prefs: ConsentPreferences) => {
    setLoading(true);
    
    try {
      // Save to localStorage
      localStorage.setItem('cookie-consent', JSON.stringify(prefs));
      
      // Send consent to server for GDPR compliance
      const response = await fetch('/api/gdpr/consent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          consentType: 'cookie_consent',
          purpose: 'Website functionality and analytics',
          legalBasis: 'consent',
          consentText: `User consented to: ${Object.entries(prefs)
            .filter(([key, value]) => key !== 'timestamp' && key !== 'version' && value)
            .map(([key]) => key)
            .join(', ')}`,
          version: prefs.version,
          metadata: {
            preferences: prefs,
            userAgent: navigator.userAgent,
            consentMethod: 'cookie_banner'
          }
        }),
      });

      if (response.ok) {
        console.log('Consent saved successfully');
      }

      // Apply preferences
      applyCookiePreferences(prefs);
      
      // Hide banner and details
      setShowBanner(false);
      setShowDetails(false);
      
    } catch (error) {
      console.error('Error saving consent:', error);
    } finally {
      setLoading(false);
    }
  };

  const acceptAll = () => {
    const allAcceptedPrefs: ConsentPreferences = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
      timestamp: new Date(),
      version: '2.0'
    };
    setPreferences(allAcceptedPrefs);
    saveConsent(allAcceptedPrefs);
  };

  const acceptNecessaryOnly = () => {
    const necessaryOnlyPrefs: ConsentPreferences = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
      timestamp: new Date(),
      version: '2.0'
    };
    setPreferences(necessaryOnlyPrefs);
    saveConsent(necessaryOnlyPrefs);
  };

  const saveCustomPreferences = () => {
    const customPrefs: ConsentPreferences = {
      ...preferences,
      timestamp: new Date(),
      version: '2.0'
    };
    saveConsent(customPrefs);
  };

  return (
    <>
      {/* Cookie Banner */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg"
          >
            <div className="max-w-7xl mx-auto p-6">
              <div className="flex items-start space-x-4">
                <Cookie className="h-8 w-8 text-orange-500 flex-shrink-0 mt-1" />
                
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Vi använder cookies för att förbättra din upplevelse
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Vi använder cookies och liknande tekniker för att förbättra webbplatsen, 
                    personalisera innehåll och annonser, tillhandahålla sociala mediefunktioner 
                    och analysera vår trafik. Du kan när som helst ändra dina inställningar.
                  </p>
                  
                  <div className="flex flex-wrap gap-3">
                    <Button 
                      onClick={acceptAll}
                      disabled={loading}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {loading ? 'Sparar...' : 'Acceptera alla'}
                    </Button>
                    
                    <Button 
                      onClick={acceptNecessaryOnly}
                      disabled={loading}
                      variant="outline"
                    >
                      Endast nödvändiga
                    </Button>
                    
                    <Button 
                      onClick={() => setShowDetails(true)}
                      disabled={loading}
                      variant="outline"
                      className="flex items-center"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Anpassa inställningar
                    </Button>
                  </div>
                  
                  <div className="mt-3 flex items-center text-xs text-gray-500">
                    <Info className="h-3 w-3 mr-1" />
                    <span>
                      Genom att fortsätta godkänner du vår{' '}
                      <a href="/privacy-policy" className="text-blue-600 hover:underline">
                        integritetspolicy
                      </a>
                      {' '}och{' '}
                      <a href="/cookie-policy" className="text-blue-600 hover:underline">
                        cookie-policy
                      </a>
                    </span>
                  </div>
                </div>
                
                <Button
                  onClick={() => setShowBanner(false)}
                  variant="ghost"
                  size="sm"
                  className="flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detailed Cookie Settings Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center text-xl">
              <Cookie className="h-6 w-6 mr-2 text-orange-500" />
              Cookie-inställningar
            </DialogTitle>
            <DialogDescription>
              Hantera dina cookie-preferenser. Du kan när som helst ändra dessa inställningar.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {COOKIE_CATEGORIES.map((category) => (
              <Card key={category.id} className="border-2">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleCategory(category.id)}
                        className="p-0 h-auto"
                      >
                        {expandedCategories.has(category.id) ? 
                          <ChevronDown className="h-4 w-4" /> : 
                          <ChevronRight className="h-4 w-4" />
                        }
                      </Button>
                      
                      <div>
                        <CardTitle className="text-base flex items-center">
                          {category.name}
                          {category.essential && (
                            <Badge variant="secondary" className="ml-2 text-xs">
                              Nödvändig
                            </Badge>
                          )}
                          {category.thirdParties && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              Tredje part
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription className="text-sm">
                          {category.description}
                        </CardDescription>
                      </div>
                    </div>
                    
                    <Switch
                      checked={category.essential || Boolean(preferences[category.id as keyof ConsentPreferences])}
                      onCheckedChange={(checked) => updatePreference(category.id, checked)}
                      disabled={category.essential}
                    />
                  </div>
                </CardHeader>

                <AnimatePresence>
                  {expandedCategories.has(category.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <CardContent className="pt-0">
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="font-medium text-gray-700">Syfte:</p>
                              <p className="text-gray-600">{category.purpose}</p>
                            </div>
                            <div>
                              <p className="font-medium text-gray-700">Lagringstid:</p>
                              <p className="text-gray-600">{category.retention}</p>
                            </div>
                          </div>
                          
                          {category.thirdParties && (
                            <div>
                              <p className="font-medium text-gray-700 text-sm mb-2">Tredje parter:</p>
                              <div className="flex flex-wrap gap-2">
                                {category.thirdParties.map((party) => (
                                  <Badge key={party} variant="outline" className="text-xs">
                                    {party}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <Separator />
                          
                          <div>
                            <p className="font-medium text-gray-700 text-sm mb-3">
                              Cookies i denna kategori:
                            </p>
                            <div className="space-y-3">
                              {category.cookies.map((cookie) => (
                                <div key={cookie.name} className="bg-gray-50 p-3 rounded-lg">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="font-mono text-sm font-semibold">
                                      {cookie.name}
                                    </span>
                                    <Badge variant="outline" className="text-xs">
                                      {cookie.type}
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-gray-600 mb-1">
                                    {cookie.purpose}
                                  </p>
                                  <div className="flex justify-between text-xs text-gray-500">
                                    <span>Retention: {cookie.retention}</span>
                                    <span>Domain: {cookie.domain}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            ))}
          </div>

          <div className="flex justify-between pt-4 border-t">
            <div className="flex items-center text-xs text-gray-500">
              <Shield className="h-3 w-3 mr-1" />
              <span>Dina val sparas säkert och kan ändras när som helst</span>
            </div>
            
            <div className="flex space-x-3">
              <Button 
                onClick={() => setShowDetails(false)} 
                variant="outline"
                disabled={loading}
              >
                Avbryt
              </Button>
              <Button 
                onClick={acceptNecessaryOnly}
                variant="outline"
                disabled={loading}
              >
                Endast nödvändiga
              </Button>
              <Button 
                onClick={saveCustomPreferences}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? 'Sparar...' : 'Spara inställningar'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Export utility functions for other components
export const getCookieConsent = (): ConsentPreferences | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const consent = localStorage.getItem('cookie-consent');
    return consent ? JSON.parse(consent) : null;
  } catch {
    return null;
  }
};

export const hasCookieConsent = (category: keyof ConsentPreferences): boolean => {
  const consent = getCookieConsent();
  return consent ? consent[category] : false;
};

export const updateCookieConsent = async (preferences: Partial<ConsentPreferences>) => {
  const existing = getCookieConsent();
  if (!existing) return;
  
  const updated = {
    ...existing,
    ...preferences,
    timestamp: new Date(),
    version: '2.0'
  };
  
  localStorage.setItem('cookie-consent', JSON.stringify(updated));
  
  // Send to server
  try {
    await fetch('/api/gdpr/consent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        consentType: 'cookie_consent_update',
        purpose: 'Updated cookie preferences',
        legalBasis: 'consent',
        consentText: `Updated consent preferences: ${JSON.stringify(preferences)}`,
        version: '2.0',
        metadata: { updatedPreferences: preferences }
      }),
    });
  } catch (error) {
    console.error('Failed to update consent on server:', error);
  }
};
