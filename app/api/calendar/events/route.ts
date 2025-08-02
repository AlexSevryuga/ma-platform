import { NextRequest, NextResponse } from 'next/server'

interface CalendarEvent {
  id: string
  title: string
  description?: string
  date: string
  type: 'deadline' | 'meeting' | 'milestone' | 'reminder'
  priority: 'high' | 'medium' | 'low'
  dealId?: string
  dealName?: string
  completed?: boolean
  userId?: string
  createdAt: string
  updatedAt: string
}

// Временное хранилище событий (в реальном приложении использовать базу данных)
let events: CalendarEvent[] = [
  {
    id: '1',
    title: 'Дедлайн Due Diligence',
    description: 'Завершение финансовой проверки TechCorp Acquisition',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // +7 дней
    type: 'deadline',
    priority: 'high',
    dealId: '1',
    dealName: 'TechCorp Acquisition',
    completed: false,
    userId: 'system',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Встреча с инвесторами',
    description: 'Презентация Global Retail Merger потенциальным инвесторам',
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // +3 дня
    type: 'meeting',
    priority: 'medium',
    dealId: '2',
    dealName: 'Global Retail Merger',
    completed: false,
    userId: 'system',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Подписание LOI',
    description: 'Подписание Letter of Intent для Healthcare Partnership',
    date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // +1 день
    type: 'milestone',
    priority: 'high',
    dealId: '3',
    dealName: 'Healthcare Partnership',
    completed: false,
    userId: 'system',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    title: 'Напоминание о проверке документов',
    description: 'Проверить юридические документы для всех активных сделок',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // +2 дня
    type: 'reminder',
    priority: 'medium',
    completed: false,
    userId: 'system',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

// GET /api/calendar/events - получить события календаря
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const type = searchParams.get('type')
    const priority = searchParams.get('priority')
    const dealId = searchParams.get('dealId')
    const completed = searchParams.get('completed')

    let filteredEvents = events

    // Фильтрация по пользователю
    if (userId) {
      filteredEvents = filteredEvents.filter(event => event.userId === userId)
    }

    // Фильтрация по датам
    if (startDate && endDate) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      filteredEvents = filteredEvents.filter(event => {
        const eventDate = new Date(event.date)
        return eventDate >= start && eventDate <= end
      })
    }

    // Фильтрация по типу
    if (type) {
      filteredEvents = filteredEvents.filter(event => event.type === type)
    }

    // Фильтрация по приоритету
    if (priority) {
      filteredEvents = filteredEvents.filter(event => event.priority === priority)
    }

    // Фильтрация по сделке
    if (dealId) {
      filteredEvents = filteredEvents.filter(event => event.dealId === dealId)
    }

    // Фильтрация по статусу завершения
    if (completed !== null) {
      const isCompleted = completed === 'true'
      filteredEvents = filteredEvents.filter(event => event.completed === isCompleted)
    }

    // Сортировка по дате
    filteredEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    return NextResponse.json({
      success: true,
      data: {
        events: filteredEvents,
        total: filteredEvents.length,
        upcoming: filteredEvents.filter(event => new Date(event.date) > new Date()).length,
        overdue: filteredEvents.filter(event => 
          new Date(event.date) < new Date() && !event.completed
        ).length
      }
    })

  } catch (error) {
    console.error('GET /api/calendar/events error:', error)
    return NextResponse.json(
      { success: false, message: 'Ошибка при получении событий календаря' },
      { status: 500 }
    )
  }
}

// POST /api/calendar/events - создать новое событие
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, date, type, priority, dealId, dealName, userId } = body

    // Валидация
    if (!title || !date || !type || !priority) {
      return NextResponse.json(
        { success: false, message: 'Поля title, date, type и priority обязательны' },
        { status: 400 }
      )
    }

    if (!['deadline', 'meeting', 'milestone', 'reminder'].includes(type)) {
      return NextResponse.json(
        { success: false, message: 'Неверный тип события' },
        { status: 400 }
      )
    }

    if (!['high', 'medium', 'low'].includes(priority)) {
      return NextResponse.json(
        { success: false, message: 'Неверный приоритет' },
        { status: 400 }
      )
    }

    // Создаем новое событие
    const newEvent: CalendarEvent = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      title,
      description,
      date: new Date(date).toISOString(),
      type,
      priority,
      dealId,
      dealName,
      completed: false,
      userId: userId || 'system',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    events.push(newEvent)

    return NextResponse.json({
      success: true,
      data: newEvent,
      message: 'Событие создано успешно'
    }, { status: 201 })

  } catch (error) {
    console.error('POST /api/calendar/events error:', error)
    return NextResponse.json(
      { success: false, message: 'Ошибка при создании события' },
      { status: 500 }
    )
  }
}

// PATCH /api/calendar/events - обновить событие
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID события обязателен' },
        { status: 400 }
      )
    }

    const eventIndex = events.findIndex(event => event.id === id)
    if (eventIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Событие не найдено' },
        { status: 404 }
      )
    }

    // Обновляем событие
    events[eventIndex] = {
      ...events[eventIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: events[eventIndex],
      message: 'Событие обновлено успешно'
    })

  } catch (error) {
    console.error('PATCH /api/calendar/events error:', error)
    return NextResponse.json(
      { success: false, message: 'Ошибка при обновлении события' },
      { status: 500 }
    )
  }
}

// DELETE /api/calendar/events - удалить событие
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID события обязателен' },
        { status: 400 }
      )
    }

    const eventIndex = events.findIndex(event => event.id === id)
    if (eventIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Событие не найдено' },
        { status: 404 }
      )
    }

    const deletedEvent = events.splice(eventIndex, 1)[0]

    return NextResponse.json({
      success: true,
      data: deletedEvent,
      message: 'Событие удалено успешно'
    })

  } catch (error) {
    console.error('DELETE /api/calendar/events error:', error)
    return NextResponse.json(
      { success: false, message: 'Ошибка при удалении события' },
      { status: 500 }
    )
  }
} 