
'use client';

import * as React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Palette, 
  Smartphone, 
  Accessibility, 
  Zap, 
  Heart,
  Play,
  Pause,
  RotateCcw,
  Settings,
  Sun,
  Moon,
  VolumeX,
  Volume2,
  Monitor,
  Eye,
  EyeOff,
  Check,
  X,
  AlertTriangle,
  Info
} from 'lucide-react';

import { ResponsiveLayout, ResponsiveGrid, ResponsiveSection } from '@/components/layout/responsive-layout';
import { Button } from '@/components/ui/button-enhanced';
import { Input } from '@/components/ui/input-enhanced';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card-enhanced';
import { LoadingSpinner, Skeleton, Progress, LoadingState } from '@/components/ui/loading-enhanced';
import { useToast, toast } from '@/components/ui/toast-enhanced';
import { Modal, ConfirmationModal, AlertModal, useModal } from '@/components/ui/modal-enhanced';
import { Alert, Banner, Callout, FeedbackWidget, HelpTooltip } from '@/components/ui/feedback-enhanced';
import { EnhancedForm, FormField, FormSection, FormActions, MultiStepForm } from '@/components/ui/form-enhanced';
import { useEnhancedTheme, useThemeAwareStyles } from '@/lib/design-system/theme-provider-enhanced';
import { staggerContainerVariants, staggerItemVariants, fadeInVariants } from '@/lib/design-system/animation-system';
import { z } from 'zod';

// Form schema for demonstration
const demoFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  message: z.string().min(10, 'Message must be at least 10 characters')
});

export default function UIShowcasePage() {
  const { addToast } = useToast();
  const { theme, setTheme, contrastMode, setContrastMode, motionMode, setMotionMode, fontScale, setFontScale, density, setDensity } = useEnhancedTheme();
  const { isDark, isHighContrast, isReducedMotion } = useThemeAwareStyles();
  
  // Modal states
  const basicModal = useModal();
  const confirmModal = useModal();
  const alertModal = useModal();
  
  // Component states
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [showBanner, setShowBanner] = useState(true);

  const formSteps = [
    { id: 'personal', title: 'Personal Info', description: 'Basic information' },
    { id: 'contact', title: 'Contact', description: 'How to reach you' },
    { id: 'message', title: 'Message', description: 'Your message' }
  ];

  // Demo functions
  const handleLoadingDemo = () => {
    setLoading(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          setLoading(false);
          clearInterval(interval);
          addToast(toast.success('Loading completed!', 'All components loaded successfully.'));
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleFormSubmit = async (data: z.infer<typeof demoFormSchema>) => {
    console.log('Form submitted:', data);
    await new Promise(resolve => setTimeout(resolve, 1000));
    addToast(toast.success('Form submitted!', 'Thank you for your submission.'));
  };

  const handleFeedback = (feedback: { type: 'positive' | 'negative'; comment?: string }) => {
    console.log('Feedback received:', feedback);
    addToast(toast.info('Feedback received', 'Thank you for helping us improve!'));
  };

  return (
    <ResponsiveLayout showMobileNav={false} user={{ name: 'Demo User', email: 'demo@example.com' }}>
      <motion.div
        variants={staggerContainerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-12"
      >
        {/* Header */}
        <motion.div variants={staggerItemVariants} className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gradient">
            UI/UX Showcase
          </h1>
          <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
            Demonstrating our enhanced design system with WCAG 2.1 accessibility, 
            responsive design, and premium user experience features.
          </p>
        </motion.div>

        {/* Banner Demo */}
        {showBanner && (
          <Banner
            variant="info"
            dismissible
            onDismiss={() => setShowBanner(false)}
            action={{
              label: 'Learn More',
              onClick: () => addToast(toast.info('Banner Action', 'You clicked the banner action!'))
            }}
          >
            🎉 Welcome to our enhanced UI/UX platform! This banner demonstrates our accessible notification system.
          </Banner>
        )}

        {/* Design System Section */}
        <ResponsiveSection spacing="lg">
          <motion.div variants={staggerItemVariants}>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Palette className="h-6 w-6" />
                  Design System Controls
                </CardTitle>
                <CardDescription>
                  Customize the platform appearance and accessibility settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveGrid cols={{ default: 1, md: 2, lg: 4 }} gap={6}>
                  {/* Theme Controls */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Theme</h4>
                    <div className="flex gap-2">
                      <Button
                        variant={theme === 'light' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setTheme('light')}
                        leftIcon={<Sun className="h-4 w-4" />}
                      >
                        Light
                      </Button>
                      <Button
                        variant={theme === 'dark' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setTheme('dark')}
                        leftIcon={<Moon className="h-4 w-4" />}
                      >
                        Dark
                      </Button>
                      <Button
                        variant={theme === 'system' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setTheme('system')}
                        leftIcon={<Monitor className="h-4 w-4" />}
                      >
                        System
                      </Button>
                    </div>
                  </div>

                  {/* Accessibility Controls */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Accessibility</h4>
                    <div className="space-y-2">
                      <Button
                        variant={contrastMode === 'high' ? 'default' : 'outline'}
                        size="sm"
                        fullWidth
                        onClick={() => setContrastMode(contrastMode === 'high' ? 'normal' : 'high')}
                        leftIcon={<Eye className="h-4 w-4" />}
                      >
                        {contrastMode === 'high' ? 'Normal' : 'High'} Contrast
                      </Button>
                      <Button
                        variant={motionMode === 'reduced' ? 'default' : 'outline'}
                        size="sm"
                        fullWidth
                        onClick={() => setMotionMode(motionMode === 'reduced' ? 'full' : 'reduced')}
                        leftIcon={motionMode === 'reduced' ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                      >
                        {motionMode === 'reduced' ? 'Enable' : 'Reduce'} Motion
                      </Button>
                    </div>
                  </div>

                  {/* Font Scale */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Font Size: {Math.round(fontScale * 100)}%</h4>
                    <div className="space-y-2">
                      <input
                        type="range"
                        min="0.875"
                        max="1.25"
                        step="0.125"
                        value={fontScale}
                        onChange={(e) => setFontScale(parseFloat(e.target.value))}
                        className="w-full"
                        aria-label="Font size scale"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setFontScale(1)}
                        leftIcon={<RotateCcw className="h-4 w-4" />}
                      >
                        Reset
                      </Button>
                    </div>
                  </div>

                  {/* Density */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">UI Density</h4>
                    <div className="flex flex-col gap-2">
                      {(['compact', 'comfortable', 'spacious'] as const).map((densityOption) => (
                        <Button
                          key={densityOption}
                          variant={density === densityOption ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setDensity(densityOption)}
                        >
                          {densityOption.charAt(0).toUpperCase() + densityOption.slice(1)}
                        </Button>
                      ))}
                    </div>
                  </div>
                </ResponsiveGrid>
              </CardContent>
            </Card>
          </motion.div>
        </ResponsiveSection>

        {/* Components Showcase */}
        <ResponsiveSection spacing="lg">
          <motion.div variants={staggerItemVariants} className="space-y-8">
            <h2 className="text-3xl font-bold text-center">Enhanced Components</h2>

            <ResponsiveGrid cols={{ default: 1, md: 2, lg: 3 }} gap={6}>
              {/* Buttons */}
              <Card>
                <CardHeader>
                  <CardTitle>Enhanced Buttons</CardTitle>
                  <CardDescription>WCAG 2.1 compliant with animations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Button fullWidth leftIcon={<Check className="h-4 w-4" />}>
                      Primary Button
                    </Button>
                    <Button variant="outline" fullWidth rightIcon={<X className="h-4 w-4" />}>
                      Secondary Button
                    </Button>
                    <Button variant="ghost" fullWidth>
                      Ghost Button
                    </Button>
                    <Button variant="destructive" fullWidth>
                      Destructive Action
                    </Button>
                    <Button loading loadingText="Processing..." fullWidth>
                      Loading Button
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Inputs */}
              <Card>
                <CardHeader>
                  <CardTitle>Form Inputs</CardTitle>
                  <CardDescription>Accessible with validation states</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    label="Regular Input"
                    placeholder="Enter text..."
                    helperText="This is helper text"
                  />
                  <Input
                    label="With Icon"
                    placeholder="Search..."
                    leftIcon={<Settings className="h-4 w-4" />}
                  />
                  <Input
                    label="Password"
                    type="password"
                    placeholder="Password"
                    showPasswordToggle
                  />
                  <Input
                    label="Error State"
                    placeholder="Invalid input"
                    error="This field is required"
                  />
                  <Input
                    label="Success State"
                    placeholder="Valid input"
                    success="Looks good!"
                  />
                </CardContent>
              </Card>

              {/* Loading States */}
              <Card>
                <CardHeader>
                  <CardTitle>Loading States</CardTitle>
                  <CardDescription>Various loading indicators</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <LoadingSpinner size="sm" />
                    <LoadingSpinner />
                    <LoadingSpinner size="lg" />
                  </div>
                  
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>

                  <Progress 
                    value={progress} 
                    showLabel 
                    label="Loading Progress"
                  />

                  <Button onClick={handleLoadingDemo} fullWidth>
                    Demo Loading States
                  </Button>
                </CardContent>
              </Card>

              {/* Alerts & Feedback */}
              <Card>
                <CardHeader>
                  <CardTitle>Alerts & Feedback</CardTitle>
                  <CardDescription>User communication patterns</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert variant="success" title="Success!" dismissible>
                    Your action was completed successfully.
                  </Alert>
                  
                  <Alert variant="warning" title="Warning">
                    Please review your input before proceeding.
                  </Alert>

                  <Callout variant="tip" title="Pro Tip">
                    Use keyboard navigation to interact with all components.
                  </Callout>

                  <div className="flex gap-2 flex-wrap">
                    <Button
                      size="sm"
                      onClick={() => addToast(toast.success('Success!', 'Operation completed.'))}
                    >
                      Success Toast
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => addToast(toast.error('Error!', 'Something went wrong.'))}
                    >
                      Error Toast
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Modals */}
              <Card>
                <CardHeader>
                  <CardTitle>Modal Dialogs</CardTitle>
                  <CardDescription>Accessible modal patterns</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button onClick={basicModal.open} fullWidth>
                    Basic Modal
                  </Button>
                  <Button onClick={confirmModal.open} variant="outline" fullWidth>
                    Confirmation Modal
                  </Button>
                  <Button onClick={alertModal.open} variant="ghost" fullWidth>
                    Alert Modal
                  </Button>
                </CardContent>
              </Card>

              {/* Interactive Cards */}
              <Card variant="elevated" interactive>
                <CardHeader>
                  <CardTitle>Interactive Card</CardTitle>
                  <CardDescription>Click me for hover effects!</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    This card demonstrates interactive hover states with 
                    smooth animations and accessibility features.
                  </p>
                </CardContent>
                <CardFooter>
                  <HelpTooltip content="This card has hover and focus states">
                    <Button size="sm" leftIcon={<Heart className="h-4 w-4" />}>
                      Like
                    </Button>
                  </HelpTooltip>
                </CardFooter>
              </Card>
            </ResponsiveGrid>
          </motion.div>
        </ResponsiveSection>

        {/* Form Demo */}
        <ResponsiveSection spacing="lg" background="neutral">
          <motion.div variants={staggerItemVariants}>
            <Card size="lg">
              <CardHeader>
                <CardTitle>Enhanced Form Example</CardTitle>
                <CardDescription>
                  Multi-step form with validation and accessibility features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MultiStepForm
                  steps={formSteps}
                  currentStep={currentStep}
                  onStepChange={setCurrentStep}
                >
                  <EnhancedForm
                    schema={demoFormSchema}
                    onSubmit={handleFormSubmit}
                  >
                    {({ control, formState }) => (
                      <>
                        {currentStep === 0 && (
                          <FormSection title="Personal Information">
                            <FormField
                              name="name"
                              control={control}
                              label="Full Name"
                              placeholder="Enter your full name"
                              required
                            />
                          </FormSection>
                        )}

                        {currentStep === 1 && (
                          <FormSection title="Contact Information">
                            <FormField
                              name="email"
                              control={control}
                              type="email"
                              label="Email Address"
                              placeholder="your@email.com"
                              required
                            />
                          </FormSection>
                        )}

                        {currentStep === 2 && (
                          <FormSection title="Your Message">
                            <FormField
                              name="message"
                              control={control}
                              label="Message"
                              placeholder="Tell us about your experience..."
                              required
                            />
                          </FormSection>
                        )}

                        <FormActions align="between">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                            disabled={currentStep === 0}
                          >
                            Previous
                          </Button>
                          
                          {currentStep < formSteps.length - 1 ? (
                            <Button
                              type="button"
                              onClick={() => setCurrentStep(Math.min(formSteps.length - 1, currentStep + 1))}
                            >
                              Next
                            </Button>
                          ) : (
                            <Button
                              type="submit"
                              loading={formState.isSubmitting}
                              disabled={!formState.isValid}
                            >
                              Submit Form
                            </Button>
                          )}
                        </FormActions>
                      </>
                    )}
                  </EnhancedForm>
                </MultiStepForm>
              </CardContent>
            </Card>
          </motion.div>
        </ResponsiveSection>

        {/* Feedback Widget */}
        <ResponsiveSection spacing="lg">
          <motion.div variants={staggerItemVariants}>
            <FeedbackWidget
              onFeedback={handleFeedback}
              title="How was your experience with our UI components?"
            />
          </motion.div>
        </ResponsiveSection>

        {/* Status Information */}
        <ResponsiveSection spacing="sm">
          <motion.div variants={staggerItemVariants}>
            <Card variant="outlined">
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="flex items-center justify-center mb-2">
                      <Accessibility className="h-6 w-6 text-success-600" />
                    </div>
                    <p className="text-sm font-semibold">WCAG 2.1 AA</p>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">Compliant</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center mb-2">
                      <Smartphone className="h-6 w-6 text-primary-600" />
                    </div>
                    <p className="text-sm font-semibold">Mobile First</p>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">Responsive</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center mb-2">
                      <Zap className="h-6 w-6 text-warning-600" />
                    </div>
                    <p className="text-sm font-semibold">Smooth Animations</p>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">
                      {isReducedMotion ? 'Reduced' : 'Enhanced'}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center mb-2">
                      <Eye className="h-6 w-6 text-error-600" />
                    </div>
                    <p className="text-sm font-semibold">Contrast</p>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">
                      {isHighContrast ? 'High' : 'Normal'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </ResponsiveSection>
      </motion.div>

      {/* Modals */}
      <Modal
        isOpen={basicModal.isOpen}
        onClose={basicModal.close}
        title="Basic Modal"
        description="This is a demonstration of our accessible modal component."
      >
        <div className="space-y-4">
          <p>This modal demonstrates:</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Focus trapping and management</li>
            <li>Keyboard navigation (ESC to close)</li>
            <li>Screen reader announcements</li>
            <li>Smooth animations</li>
          </ul>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={basicModal.close}>
              Cancel
            </Button>
            <Button onClick={basicModal.close}>
              Got it
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={confirmModal.close}
        onConfirm={() => {
          addToast(toast.info('Confirmed!', 'You confirmed the action.'));
        }}
        title="Confirm Action"
        description="Are you sure you want to proceed? This action cannot be undone."
        confirmText="Yes, proceed"
        cancelText="Cancel"
        variant="destructive"
      />

      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={alertModal.close}
        title="Alert Message"
        description="This is an informational alert modal."
        variant="info"
      />
    </ResponsiveLayout>
  );
}
