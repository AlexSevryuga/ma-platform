import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  // Создаем ReadableStream для Server-Sent Events
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder()
      
      // Функция для отправки события
      const sendEvent = (data: any) => {
        const message = `data: ${JSON.stringify(data)}\n\n`
        controller.enqueue(encoder.encode(message))
      }

      // Отправляем первоначальное сообщение о подключении
      sendEvent({
        type: 'info',
        title: 'Подключение установлено',
        message: 'Вы будете получать уведомления в реальном времени',
        duration: 3000
      })

      // Симуляция различных типов уведомлений
      const notifications = [
        {
          type: 'success',
          title: 'Сделка обновлена',
          message: 'Healthcare Partnership перешла на стадию "Предложение"',
          duration: 6000
        },
        {
          type: 'warning',
          title: 'Требуется проверка',
          message: 'AI обнаружил несоответствия в финансовых документах',
          duration: 0 // Persistent
        },
        {
          type: 'info',
          title: 'Новый документ',
          message: 'Загружен updated_contract_v2.pdf для TechCorp Acquisition',
          duration: 5000
        },
        {
          type: 'success',
          title: 'Анализ завершен',
          message: 'AI анализ рыночных тенденций готов к просмотру',
          action: {
            label: 'Открыть отчет',
            onClick: () => console.log('Open report')
          }
        },
        {
          type: 'error',
          title: 'Ошибка валидации',
          message: 'Не удалось проверить подписи в legal_agreement.pdf',
          duration: 0
        }
      ]

      let currentIndex = 0
      
      // Отправляем уведомления с интервалами
      const interval = setInterval(() => {
        if (currentIndex < notifications.length) {
          sendEvent(notifications[currentIndex])
          currentIndex++
        } else {
          // Начинаем заново или отправляем случайные уведомления
          currentIndex = 0
          
          // Генерируем случайное уведомление
          const randomNotifications = [
            {
              type: 'info',
              title: 'Активность пользователя',
              message: `Пользователь ${Math.random() > 0.5 ? 'Sarah Johnson' : 'Michael Chen'} просматривает документы`,
              duration: 4000
            },
            {
              type: 'success',
              title: 'Новый инсайт',
              message: 'AI выявил новые возможности для оптимизации процесса',
              duration: 5000
            },
            {
              type: 'warning',
              title: 'Приближается дедлайн',
              message: 'До завершения due diligence осталось 3 дня',
              duration: 0
            }
          ]
          
          const randomNotification = randomNotifications[
            Math.floor(Math.random() * randomNotifications.length)
          ]
          sendEvent(randomNotification)
        }
      }, 12000) // Отправляем каждые 12 секунд

      // Очистка при закрытии соединения
      request.signal.addEventListener('abort', () => {
        clearInterval(interval)
        controller.close()
      })
    }
  })

  // Возвращаем ответ с правильными заголовками для SSE
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control'
    }
  })
}

// Добавляем поддержку CORS для OPTIONS запросов
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Cache-Control'
    }
  })
}