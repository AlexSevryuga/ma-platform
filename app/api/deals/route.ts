import { NextRequest, NextResponse } from 'next/server'
import { db, Deal } from '@/lib/db'

// GET /api/deals - получить все сделки
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const stage = searchParams.get('stage')
    const priority = searchParams.get('priority')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'updatedAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    let deals = db.deals.getAll()

    // Фильтрация
    if (stage) {
      deals = deals.filter(deal => deal.stage === stage)
    }
    
    if (priority) {
      deals = deals.filter(deal => deal.priority === priority)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      deals = deals.filter(deal => 
        deal.name.toLowerCase().includes(searchLower) ||
        deal.company.toLowerCase().includes(searchLower)
      )
    }

    // Сортировка
    deals.sort((a, b) => {
      const aValue = a[sortBy as keyof Deal]
      const bValue = b[sortBy as keyof Deal]
      
      if (sortOrder === 'desc') {
        return aValue > bValue ? -1 : 1
      } else {
        return aValue < bValue ? -1 : 1
      }
    })

    return NextResponse.json({
      success: true,
      data: deals,
      total: deals.length,
      filters: {
        stage: stage || 'all',
        priority: priority || 'all',
        search: search || ''
      }
    })

  } catch (error) {
    console.error('GET /api/deals error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch deals' },
      { status: 500 }
    )
  }
}

// POST /api/deals - создать новую сделку
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      name,
      company,
      value,
      stage = 'lead',
      probability = 50,
      expectedClose,
      assignedTo,
      priority = 'medium'
    } = body

    // Валидация
    if (!name || !company || !value) {
      return NextResponse.json(
        { success: false, error: 'Name, company, and value are required' },
        { status: 400 }
      )
    }

    if (typeof value !== 'number' || value <= 0) {
      return NextResponse.json(
        { success: false, error: 'Value must be a positive number' },
        { status: 400 }
      )
    }

    const newDeal = db.deals.create({
      name,
      company,
      value,
      stage,
      probability: Math.max(0, Math.min(100, probability)),
      expectedClose,
      lastActivity: 'Just created',
      assignedTo: assignedTo || 'Unassigned',
      priority
    })

    return NextResponse.json({
      success: true,
      data: newDeal,
      message: 'Deal created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('POST /api/deals error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create deal' },
      { status: 500 }
    )
  }
}