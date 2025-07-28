
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface DemoBookingRequest {
  name: string;
  email: string;
  company: string;
  phone?: string;
  industry: string;
  companySize: string;
  useCase: string;
  preferredDate: string;
  preferredTime: string;
  timezone: string;
  requirements?: string;
}

export async function POST(request: NextRequest) {
  try {
    const booking: DemoBookingRequest = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'email', 'company', 'industry', 'companySize', 'useCase', 'preferredDate', 'preferredTime'];
    for (const field of requiredFields) {
      if (!booking[field as keyof DemoBookingRequest]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Generate booking ID
    const bookingId = `DEMO-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    // Process booking (in real implementation, this would save to database and send notifications)
    const bookingConfirmation = {
      bookingId,
      status: 'confirmed',
      booking: {
        ...booking,
        createdAt: new Date().toISOString(),
        status: 'scheduled'
      },
      meetingDetails: {
        platform: 'Microsoft Teams',
        meetingUrl: `https://teams.microsoft.com/l/meetup-join/${bookingId}`,
        calendarInvite: true,
        reminderEmails: true
      },
      assignedRep: {
        name: 'Sarah Chen',
        title: 'Senior Sales Engineer',
        email: 'sarah.chen@re-commerce.com',
        phone: '+1-555-0123',
        bio: 'Sarah has 8+ years of experience helping enterprises optimize their commerce operations.'
      },
      preparationMaterials: [
        {
          title: 'Demo Preparation Guide',
          description: 'What to expect and how to prepare for your demo',
          url: '/resources/demo-prep-guide.pdf'
        },
        {
          title: 'Industry-Specific Use Cases',
          description: `Common ${booking.industry} use cases and solutions`,
          url: `/resources/${booking.industry}-use-cases.pdf`
        },
        {
          title: 'ROI Calculator',
          description: 'Calculate your potential return on investment',
          url: '/pricing-calculator'
        }
      ]
    };

    // In a real implementation, you would:
    // 1. Save booking to database
    // 2. Send confirmation email to customer
    // 3. Create calendar event for sales rep
    // 4. Add to CRM system
    // 5. Send Slack notification to sales team

    return NextResponse.json(bookingConfirmation);
  } catch (error) {
    console.error('Demo booking error:', error);
    return NextResponse.json(
      { error: 'Failed to book demo. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get('timeframe') || '30d';
    
    // Mock demo booking analytics
    const analytics = {
      summary: {
        totalBookings: 145,
        confirmedDemos: 127,
        completedDemos: 89,
        conversionRate: 78.2,
        averageScore: 8.4,
        noShowRate: 12.1
      },
      bookingTrends: [
        { date: '2024-01-15', bookings: 8, completed: 6, avgScore: 8.2 },
        { date: '2024-01-16', bookings: 12, completed: 9, avgScore: 8.5 },
        { date: '2024-01-17', bookings: 15, completed: 11, avgScore: 8.1 },
        { date: '2024-01-18', bookings: 9, completed: 8, avgScore: 8.7 },
        { date: '2024-01-19', bookings: 11, completed: 9, avgScore: 8.3 },
        { date: '2024-01-20', bookings: 14, completed: 12, avgScore: 8.6 }
      ],
      industryBreakdown: [
        { industry: 'Technology', bookings: 32, percentage: 22.1 },
        { industry: 'Healthcare', bookings: 28, percentage: 19.3 },
        { industry: 'Retail', bookings: 25, percentage: 17.2 },
        { industry: 'Finance', bookings: 23, percentage: 15.9 },
        { industry: 'Manufacturing', bookings: 19, percentage: 13.1 },
        { industry: 'Other', bookings: 18, percentage: 12.4 }
      ],
      companySizeBreakdown: [
        { size: 'Enterprise (1000+)', bookings: 58, percentage: 40.0 },
        { size: 'Mid-market (100-999)', bookings: 45, percentage: 31.0 },
        { size: 'SMB (10-99)', bookings: 32, percentage: 22.1 },
        { size: 'Startup (<10)', bookings: 10, percentage: 6.9 }
      ],
      topRequests: [
        { request: 'Analytics Dashboard Demo', count: 34 },
        { request: 'API Integration Demo', count: 28 },
        { request: 'Security Features Demo', count: 23 },
        { request: 'Mobile App Demo', count: 19 },
        { request: 'Reporting Tools Demo', count: 15 }
      ],
      salesRepPerformance: [
        { rep: 'Sarah Chen', demos: 23, avgScore: 8.9, conversionRate: 82.6 },
        { rep: 'Michael Rodriguez', demos: 19, avgScore: 8.7, conversionRate: 78.9 },
        { rep: 'Emily Johnson', demos: 21, avgScore: 8.5, conversionRate: 76.2 },
        { rep: 'David Kim', demos: 17, avgScore: 8.3, conversionRate: 74.5 },
        { rep: 'Lisa Thompson', demos: 15, avgScore: 8.1, conversionRate: 73.3 }
      ]
    };

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Demo analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch demo analytics' },
      { status: 500 }
    );
  }
}
