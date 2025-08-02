import { NextRequest, NextResponse } from 'next/server'

// Временное хранилище уведомлений (в реальном приложении использовать Redis/DB)
interface StoredNotification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  timestamp: Date
  read: boolean
  userId?: string
  metadata?: Record<string, any>
}

let notifications: StoredNotification[] = []

// GET /api/notifications - получить все уведомления пользователя
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const unreadOnly = searchParams.get('unreadOnly') === 'true'

    let filteredNotifications = notifications
    
    if (userId) {
      filteredNotifications = notifications.filter(n => n.userId === userId)
    }
    
    if (unreadOnly) {
      filteredNotifications = filteredNotifications.filter(n => !n.read)
    }

    // Сортировка по времени (новые первыми)
    filteredNotifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

    // Пагинация
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedNotifications = filteredNotifications.slice(startIndex, endIndex)

    return NextResponse.json({
      success: true,
      data: {
        notifications: paginatedNotifications,
        pagination: {
          page,
          limit,
          total: filteredNotifications.length,
          totalPages: Math.ceil(filteredNotifications.length / limit),
          hasNext: endIndex < filteredNotifications.length,
          hasPrev: page > 1
        },
        unreadCount: notifications.filter(n => !n.read && (!userId || n.userId === userId)).length
      }
    })

  } catch (error) {
    console.error('GET /api/notifications error:', error)
    return NextResponse.json(
      { success: false, message: 'Ошибка при получении уведомлений' },
      { status: 500 }
    )
  }
}

// POST /api/notifications - создать новое уведомление
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, title, message, userId, metadata } = body

    // Валидация
    if (!type || !title) {
      return NextResponse.json(
        { success: false, message: 'Поля type и title обязательны' },
        { status: 400 }
      )
    }

    if (!['success', 'error', 'warning', 'info'].includes(type)) {
      return NextResponse.json(
        { success: false, message: 'Неверный тип уведомления' },
        { status: 400 }
      )
    }

    // Создаем уведомление
    const notification: StoredNotification = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      title,
      message,
      timestamp: new Date(),
      read: false,
      userId,
      metadata
    }

    notifications.unshift(notification) // Добавляем в начало массива

    // Ограничиваем количество уведомлений (последние 1000)
    if (notifications.length > 1000) {
      notifications = notifications.slice(0, 1000)
    }

    return NextResponse.json({
      success: true,
      data: notification,
      message: 'Уведомление создано успешно'
    }, { status: 201 })

  } catch (error) {
    console.error('POST /api/notifications error:', error)
    return NextResponse.json(
      { success: false, message: 'Ошибка при создании уведомления' },
      { status: 500 }
    )
  }
}

// PATCH /api/notifications - массовые операции
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, notificationIds, userId } = body

    if (!action) {
      return NextResponse.json(
        { success: false, message: 'Действие не указано' },
        { status: 400 }
      )
    }

    let updatedCount = 0

    switch (action) {
      case 'markAsRead':
        if (notificationIds && Array.isArray(notificationIds)) {
          // Отметить указанные уведомления как прочитанные
          notifications = notifications.map(n => {
            if (notificationIds.includes(n.id) && (!userId || n.userId === userId)) {
              updatedCount++
              return { ...n, read: true }
            }
            return n
          })
        }
        break

      case 'markAllAsRead':
        // Отметить все уведомления пользователя как прочитанные
        notifications = notifications.map(n => {
          if (!userId || n.userId === userId) {
            if (!n.read) updatedCount++
            return { ...n, read: true }
          }
          return n
        })
        break

      case 'delete':
        if (notificationIds && Array.isArray(notificationIds)) {
          const beforeLength = notifications.length
          notifications = notifications.filter(n => 
            !notificationIds.includes(n.id) || (userId && n.userId !== userId)
          )
          updatedCount = beforeLength - notifications.length
        }
        break

      case 'clear':
        // Удалить все уведомления пользователя
        const beforeLength = notifications.length
        notifications = notifications.filter(n => userId && n.userId !== userId)
        updatedCount = beforeLength - notifications.length
        break

      default:
        return NextResponse.json(
          { success: false, message: 'Неизвестное действие' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      data: { updatedCount },
      message: `Обновлено ${updatedCount} уведомлений`
    })

  } catch (error) {
    console.error('PATCH /api/notifications error:', error)
    return NextResponse.json(
      { success: false, message: 'Ошибка при обновлении уведомлений' },
      { status: 500 }
    )
  }
}