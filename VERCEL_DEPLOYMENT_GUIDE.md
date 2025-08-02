# 🚀 Руководство по деплою на Vercel

## Ошибка DEPLOYMENT_NOT_FOUND

Если вы получаете ошибку `404: NOT_FOUND` с кодом `DEPLOYMENT_NOT_FOUND`, это означает, что деплой не был создан или не найден. Следуйте этому руководству для правильной настройки.

## 📋 Пошаговая инструкция

### 1. Создание проекта на Vercel

1. Перейдите на https://vercel.com/new
2. Нажмите "Import Git Repository"
3. Выберите репозиторий: `AlexSevryuga/ma-platform`
4. Нажмите "Import"

### 2. Настройка переменных окружения

В разделе "Environment Variables" добавьте следующие переменные:

| Переменная | Значение | Описание |
|------------|----------|----------|
| `NEXTAUTH_URL` | `https://your-app-name.vercel.app` | URL вашего приложения (замените на реальный) |
| `NEXTAUTH_SECRET` | `SWmSLaVbup4L3u9+khOsuGwv40gZyp5EpMxd+eYqVGc=` | Секретный ключ для NextAuth |
| `OPENAI_API_KEY` | `your-openai-api-key` | Ваш ключ API OpenAI |
| `DATABASE_URL` | `your-database-url` | URL базы данных (опционально) |

### 3. Настройка проекта

- **Framework Preset**: Next.js (должен определиться автоматически)
- **Root Directory**: `./` (оставьте по умолчанию)
- **Build Command**: `npm run build` (оставьте по умолчанию)
- **Output Directory**: `.next` (оставьте по умолчанию)
- **Install Command**: `npm install` (оставьте по умолчанию)

### 4. Деплой

1. Нажмите "Deploy"
2. Дождитесь завершения сборки
3. Приложение будет доступно по адресу: `https://your-app-name.vercel.app`

## 🔧 Альтернативный способ через CLI

Если у вас установлен Vercel CLI:

```bash
# Установка Vercel CLI
npm i -g vercel

# Логин в Vercel
vercel login

# Деплой проекта
vercel

# Для продакшн деплоя
vercel --prod
```

## 🚨 Решение проблем

### Ошибка "DEPLOYMENT_NOT_FOUND"
- Убедитесь, что проект создан на Vercel
- Проверьте, что репозиторий правильно импортирован
- Попробуйте создать новый деплой

### Ошибки сборки
- Проверьте переменные окружения
- Убедитесь, что все зависимости установлены
- Проверьте логи сборки в Vercel Dashboard

### Проблемы с аутентификацией
- Убедитесь, что `NEXTAUTH_SECRET` установлен
- Проверьте, что `NEXTAUTH_URL` соответствует реальному URL
- Настройте провайдеры аутентификации в NextAuth

## 📞 Поддержка

Если проблемы продолжаются:
1. Проверьте логи в Vercel Dashboard
2. Обратитесь в поддержку Vercel
3. Проверьте документацию Next.js для деплоя

## 🔗 Полезные ссылки

- [Vercel Dashboard](https://vercel.com/dashboard)
- [GitHub Repository](https://github.com/AlexSevryuga/ma-platform)
- [Next.js Documentation](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs) 