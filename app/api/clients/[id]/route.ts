import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/clients/[id] - получить клиента по ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const client = db.clients.getById(id)

    if (!client) {
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: client
    })

  } catch (error) {
    console.error('GET /api/clients/[id] error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch client' },
      { status: 500 }
    )
  }
}

// PUT /api/clients/[id] - обновить клиента
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()

    const existingClient = db.clients.getById(id)
    if (!existingClient) {
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 404 }
      )
    }

    // Валидация email на уникальность (если меняется)
    if (body.contactInfo?.email && body.contactInfo.email !== existingClient.contactInfo.email) {
      const allClients = db.clients.getAll()
      const emailExists = allClients.some(client => 
        client.id !== id && 
        client.contactInfo.email.toLowerCase() === body.contactInfo.email.toLowerCase()
      )

      if (emailExists) {
        return NextResponse.json(
          { success: false, error: 'Client with this email already exists' },
          { status: 409 }
        )
      }
    }

    // Подготавливаем обновления
    const updates: any = { lastContact: 'Recently updated' }
    
    if (body.name !== undefined) updates.name = body.name
    if (body.company !== undefined) updates.company = body.company
    if (body.industry !== undefined) updates.industry = body.industry
    if (body.location !== undefined) updates.location = body.location
    if (body.revenue !== undefined) updates.revenue = body.revenue
    if (body.employees !== undefined) updates.employees = body.employees
    if (body.description !== undefined) updates.description = body.description
    if (body.dealPotential !== undefined) updates.dealPotential = body.dealPotential
    if (body.status !== undefined) updates.status = body.status
    if (body.score !== undefined) {
      updates.score = Math.max(0, Math.min(100, body.score))
    }
    if (body.tags !== undefined) {
      updates.tags = Array.isArray(body.tags) ? body.tags : []
    }
    if (body.contactInfo !== undefined) {
      updates.contactInfo = {
        ...existingClient.contactInfo,
        ...body.contactInfo
      }
    }

    // Поскольку у нас нет метода update для clients, обновляем напрямую
    const allClients = db.clients.getAll()
    const clientIndex = allClients.findIndex(client => client.id === id)
    
    if (clientIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 404 }
      )
    }

    const updatedClient = { ...allClients[clientIndex], ...updates }
    allClients[clientIndex] = updatedClient

    return NextResponse.json({
      success: true,
      data: updatedClient,
      message: 'Client updated successfully'
    })

  } catch (error) {
    console.error('PUT /api/clients/[id] error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update client' },
      { status: 500 }
    )
  }
}

// DELETE /api/clients/[id] - удалить клиента
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    const allClients = db.clients.getAll()
    const clientIndex = allClients.findIndex(client => client.id === id)
    
    if (clientIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 404 }
      )
    }

    const deletedClient = allClients.splice(clientIndex, 1)[0]

    return NextResponse.json({
      success: true,
      message: 'Client deleted successfully',
      data: deletedClient
    })

  } catch (error) {
    console.error('DELETE /api/clients/[id] error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete client' },
      { status: 500 }
    )
  }
}