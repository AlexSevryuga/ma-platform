import { NextRequest, NextResponse } from 'next/server'
import { db, AIInsight } from '@/lib/db'

// GET /api/insights - получить все AI инсайты
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const impact = searchParams.get('impact')
    const dealId = searchParams.get('dealId')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    let insights = db.insights.getAll()

    // Фильтрация
    if (type) {
      insights = insights.filter(insight => insight.type === type)
    }
    
    if (impact) {
      insights = insights.filter(insight => insight.impact === impact)
    }

    if (dealId) {
      // Фильтруем по сделке (в реальной БД было бы связано через dealId)
      insights = insights.filter(insight => 
        insight.description.toLowerCase().includes('techcorp') || 
        insight.description.toLowerCase().includes('retail') ||
        insight.description.toLowerCase().includes('healthcare')
      )
    }

    // Сортировка по времени создания (новые первыми)
    insights.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    // Пагинация
    const total = insights.length
    const paginatedInsights = insights.slice(offset, offset + limit)

    return NextResponse.json({
      success: true,
      data: paginatedInsights,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      },
      filters: {
        type: type || 'all',
        impact: impact || 'all',
        dealId: dealId || null
      }
    })

  } catch (error) {
    console.error('GET /api/insights error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch insights' },
      { status: 500 }
    )
  }
}

// POST /api/insights - создать новый AI инсайт
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      type,
      title,
      description,
      impact = 'medium',
      confidence,
      dealId
    } = body

    // Валидация
    if (!type || !title || !description) {
      return NextResponse.json(
        { success: false, error: 'Type, title, and description are required' },
        { status: 400 }
      )
    }

    const validTypes = ['opportunity', 'risk', 'trend', 'recommendation']
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid insight type' },
        { status: 400 }
      )
    }

    const validImpacts = ['low', 'medium', 'high']
    if (impact && !validImpacts.includes(impact)) {
      return NextResponse.json(
        { success: false, error: 'Invalid impact level' },
        { status: 400 }
      )
    }

    if (confidence !== undefined && (confidence < 0 || confidence > 100)) {
      return NextResponse.json(
        { success: false, error: 'Confidence must be between 0 and 100' },
        { status: 400 }
      )
    }

    const newInsight = db.insights.create({
      type,
      title,
      description,
      impact,
      confidence: confidence || Math.floor(Math.random() * 30) + 70,
      timestamp: new Date().toLocaleString()
    })

    return NextResponse.json({
      success: true,
      data: newInsight,
      message: 'AI insight created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('POST /api/insights error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create insight' },
      { status: 500 }
    )
  }
}