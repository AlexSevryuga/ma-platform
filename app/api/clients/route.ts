import { NextRequest, NextResponse } from 'next/server'
import { db, Client } from '@/lib/db'

// GET /api/clients - получить всех клиентов
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const industry = searchParams.get('industry')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'score'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    let clients = db.clients.getAll()

    // Фильтрация
    if (status) {
      clients = clients.filter(client => client.status === status)
    }
    
    if (industry) {
      clients = clients.filter(client => 
        client.industry.toLowerCase().includes(industry.toLowerCase())
      )
    }

    if (search) {
      clients = db.clients.search(search)
    }

    // Сортировка
    clients.sort((a, b) => {
      const aValue = a[sortBy as keyof Client]
      const bValue = b[sortBy as keyof Client]
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'desc' ? bValue - aValue : aValue - bValue
      }
      
      const aStr = String(aValue).toLowerCase()
      const bStr = String(bValue).toLowerCase()
      
      if (sortOrder === 'desc') {
        return aStr > bStr ? -1 : 1
      } else {
        return aStr < bStr ? -1 : 1
      }
    })

    // Пагинация
    const total = clients.length
    const paginatedClients = clients.slice(offset, offset + limit)

    return NextResponse.json({
      success: true,
      data: paginatedClients,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      },
      filters: {
        status: status || 'all',
        industry: industry || 'all',
        search: search || ''
      }
    })

  } catch (error) {
    console.error('GET /api/clients error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch clients' },
      { status: 500 }
    )
  }
}

// POST /api/clients - создать нового клиента
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      name,
      company,
      industry,
      location,
      revenue,
      employees,
      description,
      contactInfo,
      dealPotential,
      tags = []
    } = body

    // Валидация
    if (!name || !company || !industry) {
      return NextResponse.json(
        { success: false, error: 'Name, company, and industry are required' },
        { status: 400 }
      )
    }

    if (!contactInfo || !contactInfo.email) {
      return NextResponse.json(
        { success: false, error: 'Contact email is required' },
        { status: 400 }
      )
    }

    // Проверка на дублирование email
    const existingClients = db.clients.getAll()
    const emailExists = existingClients.some(client => 
      client.contactInfo.email.toLowerCase() === contactInfo.email.toLowerCase()
    )

    if (emailExists) {
      return NextResponse.json(
        { success: false, error: 'Client with this email already exists' },
        { status: 409 }
      )
    }

    // Генерируем score на основе различных факторов
    const generateClientScore = () => {
      let score = 50 // базовый score
      
      // Увеличиваем score на основе потенциала сделки
      if (dealPotential) {
        const potentialMatch = dealPotential.match(/\$(\d+)/)
        if (potentialMatch) {
          const amount = parseInt(potentialMatch[1])
          if (amount > 10) score += 20
          else if (amount > 5) score += 10
        }
      }
      
      // Увеличиваем score на основе размера компании
      if (revenue) {
        if (revenue.includes('$100M+')) score += 15
        else if (revenue.includes('$50M')) score += 10
      }
      
      // Добавляем случайность
      score += Math.floor(Math.random() * 20) - 10
      
      return Math.max(0, Math.min(100, score))
    }

    const newClient: Omit<Client, 'id'> = {
      name,
      company,
      industry,
      location: location || 'Not specified',
      revenue: revenue || 'Not disclosed',
      employees: employees || 'Not disclosed',
      description: description || '',
      contactInfo: {
        email: contactInfo.email,
        phone: contactInfo.phone || '',
        website: contactInfo.website || ''
      },
      score: generateClientScore(),
      status: 'warm',
      lastContact: 'Never',
      dealPotential: dealPotential || 'TBD',
      tags: Array.isArray(tags) ? tags : []
    }

    // Добавляем клиента (поскольку у нас нет метода create для clients в db.ts, добавим его)
    const clientId = Date.now().toString()
    const clientWithId = { id: clientId, ...newClient }
    
    // Добавляем в массив (поскольку мы используем in-memory storage)
    const allClients = db.clients.getAll()
    allClients.push(clientWithId)

    return NextResponse.json({
      success: true,
      data: clientWithId,
      message: 'Client created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('POST /api/clients error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create client' },
      { status: 500 }
    )
  }
}