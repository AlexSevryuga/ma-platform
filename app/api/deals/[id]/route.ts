import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/deals/[id] - получить сделку по ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const deal = db.deals.getById(id)

    if (!deal) {
      return NextResponse.json(
        { success: false, error: 'Deal not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: deal
    })

  } catch (error) {
    console.error('GET /api/deals/[id] error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch deal' },
      { status: 500 }
    )
  }
}

// PUT /api/deals/[id] - обновить сделку
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()

    const existingDeal = db.deals.getById(id)
    if (!existingDeal) {
      return NextResponse.json(
        { success: false, error: 'Deal not found' },
        { status: 404 }
      )
    }

    // Валидация обновляемых полей
    const updates: any = {}
    
    if (body.name !== undefined) updates.name = body.name
    if (body.company !== undefined) updates.company = body.company
    if (body.value !== undefined) {
      if (typeof body.value !== 'number' || body.value <= 0) {
        return NextResponse.json(
          { success: false, error: 'Value must be a positive number' },
          { status: 400 }
        )
      }
      updates.value = body.value
    }
    if (body.stage !== undefined) updates.stage = body.stage
    if (body.probability !== undefined) {
      updates.probability = Math.max(0, Math.min(100, body.probability))
    }
    if (body.expectedClose !== undefined) updates.expectedClose = body.expectedClose
    if (body.assignedTo !== undefined) updates.assignedTo = body.assignedTo
    if (body.priority !== undefined) updates.priority = body.priority

    updates.lastActivity = 'Recently updated'

    const updatedDeal = db.deals.update(id, updates)

    if (!updatedDeal) {
      return NextResponse.json(
        { success: false, error: 'Failed to update deal' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: updatedDeal,
      message: 'Deal updated successfully'
    })

  } catch (error) {
    console.error('PUT /api/deals/[id] error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update deal' },
      { status: 500 }
    )
  }
}

// DELETE /api/deals/[id] - удалить сделку
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    const deletedDeal = db.deals.delete(id)
    
    if (!deletedDeal) {
      return NextResponse.json(
        { success: false, error: 'Deal not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Deal deleted successfully',
      data: deletedDeal
    })

  } catch (error) {
    console.error('DELETE /api/deals/[id] error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete deal' },
      { status: 500 }
    )
  }
}