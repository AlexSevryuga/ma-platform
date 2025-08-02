# M&A AI Platform

Современная платформа для анализа и управления M&A сделками с интеграцией искусственного интеллекта.

## 🚀 Возможности

### AI Ассистент для M&A
- **Умный анализ документов** - автоматическое извлечение ключевой информации из контрактов, финансовых отчетов и юридических документов
- **Контекстные рекомендации** - персонализированные советы на основе загруженных документов
- **Анализ рисков** - автоматическое выявление потенциальных рисков и возможностей
- **Стратегические инсайты** - глубокий анализ рыночных условий и конкурентной среды

### Функциональные модули
- **AI Чат** - интеллектуальный помощник для M&A консультаций
- **Ассистент переговоров** - стратегические рекомендации для успешных переговоров
- **Аналитика** - детальная аналитика и отчеты
- **Управление сделками** - полный цикл управления M&A транзакциями
- **Центр инноваций** - отслеживание инновационных возможностей

### Технические возможности
- **Real-time уведомления** - мгновенные уведомления о важных событиях
- **Загрузка документов** - поддержка PDF, Excel, Word и других форматов
- **Безопасность** - аутентификация через NextAuth.js
- **Адаптивный дизайн** - оптимизация для всех устройств

## 🛠 Технологический стек

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Authentication**: NextAuth.js
- **Database**: Prisma ORM
- **AI Integration**: OpenAI GPT API
- **File Upload**: Multer
- **Icons**: Lucide React, Heroicons

## 📦 Установка

### Предварительные требования
- Node.js 18+ 
- npm или yarn
- OpenAI API ключ

### Пошаговая установка

1. **Клонируйте репозиторий**
```bash
git clone https://github.com/your-username/ma-platform.git
cd ma-platform
```

2. **Установите зависимости**
```bash
npm install
```

3. **Настройте переменные окружения**
```bash
cp env.example .env.local
```

Отредактируйте `.env.local`:
```env
# Database
DATABASE_URL="your-database-url"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# OpenAI
OPENAI_API_KEY="your-openai-api-key"

# OAuth Providers (опционально)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

4. **Настройте базу данных**
```bash
npx prisma generate
npx prisma db push
```

5. **Запустите проект**
```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

## 🏗 Структура проекта

```
ma-platform/
├── app/                    # Next.js App Router
│   ├── api/               # API endpoints
│   │   ├── ai/           # AI-related APIs
│   │   ├── auth/         # Authentication
│   │   └── upload/       # File upload
│   ├── ai-chat/          # AI Chat page
│   ├── dashboard/        # Dashboard
│   └── negotiation-assistant/ # Negotiation assistant
├── components/            # React components
├── lib/                  # Utility functions
├── prisma/              # Database schema
└── types/               # TypeScript types
```

## 🔧 API Endpoints

### AI Chat
- `POST /api/ai/chat` - Основной endpoint для AI чата
- `POST /api/upload` - Загрузка документов

### Authentication
- `GET /api/auth/session` - Получение сессии пользователя
- `POST /api/auth/signin` - Вход в систему

## 🎯 Использование

### AI Чат
1. Перейдите на страницу AI чата
2. Загрузите документы для анализа
3. Задайте вопросы AI ассистенту
4. Получите детальный анализ и рекомендации

### Ассистент переговоров
1. Выберите тип сделки
2. Укажите текущий этап
3. Получите стратегические рекомендации
4. Анализируйте риски и возможности

## 🔒 Безопасность

- Аутентификация через NextAuth.js
- Защищенные API endpoints
- Валидация загружаемых файлов
- Безопасное хранение переменных окружения

## 🚀 Развертывание

### Vercel (рекомендуется)
1. Подключите репозиторий к Vercel
2. Настройте переменные окружения
3. Деплой автоматически запустится

### Другие платформы
Проект совместим с любыми платформами, поддерживающими Next.js.

## 🤝 Вклад в проект

1. Форкните репозиторий
2. Создайте ветку для новой функции (`git checkout -b feature/amazing-feature`)
3. Зафиксируйте изменения (`git commit -m 'Add amazing feature'`)
4. Отправьте в ветку (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📄 Лицензия

Этот проект лицензирован под MIT License - см. файл [LICENSE](LICENSE) для деталей.

## 📞 Поддержка

Если у вас есть вопросы или предложения, создайте issue в репозитории или свяжитесь с командой разработки.

## 🔄 Обновления

Следите за обновлениями в разделе [Releases](https://github.com/your-username/ma-platform/releases).

---

**M&A AI Platform** - Ваш интеллектуальный помощник в мире слияний и поглощений! 🚀 