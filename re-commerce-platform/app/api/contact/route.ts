
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

const contactSchema = z.object({
  name: z.string().min(2, 'Namn måste vara minst 2 tecken'),
  email: z.string().email('Ogiltig e-postadress'),
  phone: z.string().optional(),
  company: z.string().optional(),
  message: z.string().min(10, 'Meddelande måste vara minst 10 tecken'),
  formType: z.enum(['contact', 'demo', 'interest', 'pilot']).default('contact'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = contactSchema.parse(body)

    const submission = await prisma.contactSubmission.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone || null,
        company: validatedData.company || null,
        message: validatedData.message,
        formType: validatedData.formType,
        status: 'new',
      },
    })

    return NextResponse.json(
      { 
        success: true, 
        message: 'Tack för ditt meddelande! Vi återkommer inom 24 timmar.',
        id: submission.id 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Contact form submission error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Ogiltiga uppgifter',
          errors: error.errors 
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        success: false, 
        message: 'Ett fel uppstod. Försök igen senare.' 
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
