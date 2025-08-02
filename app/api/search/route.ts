import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/search - универсальный поиск по платформе
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const type = searchParams.get('type') // 'deals', 'clients', 'insights', 'all'
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Search query must be at least 2 characters' },
        { status: 400 }
      )
    }

    const searchQuery = query.toLowerCase().trim()
    const results: any = {
      deals: [],
      clients: [],
      insights: [],
      total: 0
    }

    // Поиск в сделках
    if (type === 'deals' || type === 'all') {
      const deals = db.deals.getAll()
      results.deals = deals.filter(deal => 
        deal.name.toLowerCase().includes(searchQuery) ||
        deal.company.toLowerCase().includes(searchQuery) ||
        deal.assignedTo.toLowerCase().includes(searchQuery)
      ).slice(0, limit).map(deal => ({
        ...deal,
        searchType: 'deal',
        searchRelevance: calculateRelevance(searchQuery, [deal.name, deal.company])
      }))
    }

    // Поиск в клиентах
    if (type === 'clients' || type === 'all') {
      results.clients = db.clients.search(searchQuery).slice(0, limit).map(client => ({
        ...client,
        searchType: 'client',
        searchRelevance: calculateRelevance(searchQuery, [client.name, client.company, client.industry])
      }))
    }

    // Поиск в AI инсайтах
    if (type === 'insights' || type === 'all') {
      const insights = db.insights.getAll()
      results.insights = insights.filter(insight => 
        insight.title.toLowerCase().includes(searchQuery) ||
        insight.description.toLowerCase().includes(searchQuery) ||
        insight.type.toLowerCase().includes(searchQuery)
      ).slice(0, limit).map(insight => ({
        ...insight,
        searchType: 'insight',
        searchRelevance: calculateRelevance(searchQuery, [insight.title, insight.description])
      }))
    }

    // Подсчитываем общее количество результатов
    results.total = results.deals.length + results.clients.length + results.insights.length

    // Если нужен только один тип, возвращаем только его
    if (type && type !== 'all') {
      const typeResults = results[type as keyof typeof results]
      if (Array.isArray(typeResults)) {
        return NextResponse.json({
          success: true,
          data: typeResults,
          total: typeResults.length,
          query: searchQuery,
          type
        })
      }
    }

    // Возвращаем все результаты, отсортированные по релевантности
    const allResults = [
      ...results.deals,
      ...results.clients,
      ...results.insights
    ].sort((a, b) => b.searchRelevance - a.searchRelevance)

    return NextResponse.json({
      success: true,
      data: {
        results: allResults.slice(0, limit * 2),
        breakdown: {
          deals: results.deals.length,
          clients: results.clients.length,
          insights: results.insights.length
        }
      },
      total: results.total,
      query: searchQuery,
      type: type || 'all'
    })

  } catch (error) {
    console.error('GET /api/search error:', error)
    return NextResponse.json(
      { success: false, error: 'Search failed' },
      { status: 500 }
    )
  }
}

// Функция для расчета релевантности поиска
function calculateRelevance(query: string, fields: string[]): number {
  let relevance = 0
  const queryWords = query.toLowerCase().split(' ')
  
  fields.forEach(field => {
    const fieldLower = field.toLowerCase()
    
    // Точное совпадение дает высокий балл
    if (fieldLower.includes(query)) {
      relevance += 10
    }
    
    // Совпадение отдельных слов
    queryWords.forEach(word => {
      if (fieldLower.includes(word)) {
        relevance += 3
      }
      
      // Совпадение в начале строки дает дополнительные баллы
      if (fieldLower.startsWith(word)) {
        relevance += 2
      }
    })
  })
  
  return relevance
}