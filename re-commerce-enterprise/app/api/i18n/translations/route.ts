
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

// GET /api/i18n/translations - Get translations with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const languageId = searchParams.get('languageId');
    const namespace = searchParams.get('namespace');
    const status = searchParams.get('status');
    const key = searchParams.get('key');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    const where: any = {};
    
    if (languageId) where.languageId = languageId;
    if (namespace) where.namespace = namespace;
    if (status) where.status = status;
    if (key) where.key = { contains: key, mode: 'insensitive' };

    const [translations, total] = await Promise.all([
      prisma.translation.findMany({
        where,
        include: {
          language: {
            select: { code: true, name: true, nativeName: true }
          }
        },
        orderBy: [
          { namespace: 'asc' },
          { key: 'asc' }
        ],
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.translation.count({ where })
    ]);

    return NextResponse.json({
      success: true,
      data: translations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching translations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch translations' },
      { status: 500 }
    );
  }
}

// POST /api/i18n/translations - Create or update translations
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (Array.isArray(body)) {
      // Batch create/update
      const results = await Promise.all(
        body.map(async (translation) => {
          const {
            languageId,
            namespace,
            key,
            value,
            context,
            description,
            isPlural = false,
            pluralForm,
            status = 'pending',
            quality = 'machine',
            confidence,
            translatedBy,
            reviewedBy,
            approvedBy
          } = translation;

          if (!languageId || !namespace || !key || !value) {
            throw new Error('Language ID, namespace, key, and value are required');
          }

          try {
            return await prisma.translation.upsert({
              where: {
                languageId_namespace_key: {
                  languageId,
                  namespace,
                  key
                }
              },
              update: {
                value,
                context,
                description,
                isPlural,
                pluralForm,
                status,
                quality,
                confidence,
                translatedBy,
                reviewedBy,
                approvedBy,
                version: { increment: 1 },
                updatedAt: new Date()
              },
              create: {
                languageId,
                namespace,
                key,
                value,
                context,
                description,
                isPlural,
                pluralForm,
                status,
                quality,
                confidence,
                translatedBy,
                reviewedBy,
                approvedBy,
                version: 1,
                isActive: true
              },
              include: {
                language: {
                  select: { code: true, name: true }
                }
              }
            });
          } catch (err) {
            console.error(`Error upserting translation ${key}:`, err);
            return null;
          }
        })
      );

      const successful = results.filter(r => r !== null);
      const failed = results.length - successful.length;

      return NextResponse.json({
        success: true,
        data: successful,
        message: `Processed ${successful.length} translations successfully${failed > 0 ? `, ${failed} failed` : ''}`
      });

    } else {
      // Single translation
      const {
        languageId,
        namespace,
        key,
        value,
        context,
        description,
        isPlural = false,
        pluralForm,
        status = 'pending',
        quality = 'machine',
        confidence,
        translatedBy,
        reviewedBy,
        approvedBy
      } = body;

      if (!languageId || !namespace || !key || !value) {
        return NextResponse.json(
          { success: false, error: 'Language ID, namespace, key, and value are required' },
          { status: 400 }
        );
      }

      const translation = await prisma.translation.upsert({
        where: {
          languageId_namespace_key: {
            languageId,
            namespace,
            key
          }
        },
        update: {
          value,
          context,
          description,
          isPlural,
          pluralForm,
          status,
          quality,
          confidence,
          translatedBy,
          reviewedBy,
          approvedBy,
          version: { increment: 1 },
          updatedAt: new Date()
        },
        create: {
          languageId,
          namespace,
          key,
          value,
          context,
          description,
          isPlural,
          pluralForm,
          status,
          quality,
          confidence,
          translatedBy,
          reviewedBy,
          approvedBy,
          version: 1,
          isActive: true
        },
        include: {
          language: {
            select: { code: true, name: true }
          }
        }
      });

      return NextResponse.json({
        success: true,
        data: translation,
        message: 'Translation saved successfully'
      }, { status: 201 });
    }

  } catch (error) {
    console.error('Error saving translation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save translation' },
      { status: 500 }
    );
  }
}

// PUT /api/i18n/translations - Update translation status
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const translationId = searchParams.get('id');
    const action = searchParams.get('action'); // approve, reject, review
    
    if (!translationId) {
      return NextResponse.json(
        { success: false, error: 'Translation ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    let updateData: any = { ...body };

    // Handle specific actions
    if (action === 'approve') {
      updateData.status = 'approved';
      updateData.approvedBy = body.approvedBy;
    } else if (action === 'reject') {
      updateData.status = 'rejected';
      updateData.reviewedBy = body.reviewedBy;
    } else if (action === 'review') {
      updateData.status = 'needs_review';
      updateData.reviewedBy = body.reviewedBy;
    }

    const translation = await prisma.translation.update({
      where: { id: translationId },
      data: {
        ...updateData,
        updatedAt: new Date()
      },
      include: {
        language: {
          select: { code: true, name: true }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: translation,
      message: 'Translation updated successfully'
    });

  } catch (error) {
    console.error('Error updating translation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update translation' },
      { status: 500 }
    );
  }
}

// DELETE /api/i18n/translations - Delete translation
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const translationId = searchParams.get('id');
    
    if (!translationId) {
      return NextResponse.json(
        { success: false, error: 'Translation ID is required' },
        { status: 400 }
      );
    }

    await prisma.translation.delete({
      where: { id: translationId }
    });

    return NextResponse.json({
      success: true,
      message: 'Translation deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting translation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete translation' },
      { status: 500 }
    );
  }
}
