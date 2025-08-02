# 🚀 Настройка автоматического деплоя на Vercel

## 📋 Пошаговая инструкция

### 1. Создание проекта в Vercel

1. **Откройте Vercel Dashboard**: https://vercel.com/new
2. **Подключите GitHub репозиторий**: https://github.com/AlexSevryuga/ma-platform
3. **Настройте проект**:
   - Framework Preset: `Next.js`
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

### 2. Настройка переменных окружения

В Vercel Dashboard добавьте следующие переменные:

```env
NEXTAUTH_URL=https://your-project.vercel.app
NEXTAUTH_SECRET=your-generated-secret
OPENAI_API_KEY=sk-demo-key
DATABASE_URL=your-database-url (опционально)
```

### 3. Настройка GitHub Integration

1. В Vercel Dashboard перейдите в Settings → Git
2. Включите "Deploy Hooks"
3. Настройте автоматический деплой для ветки `main`

### 4. Настройка GitHub Secrets

Добавьте следующие секреты в GitHub:
https://github.com/AlexSevryuga/ma-platform/settings/secrets/actions

- `VERCEL_TOKEN` - токен Vercel
- `VERCEL_ORG_ID` - ID организации Vercel
- `VERCEL_PROJECT_ID` - ID проекта Vercel
- `OPENAI_API_KEY` - ваш OpenAI API ключ
- `NEXTAUTH_SECRET` - секретный ключ для NextAuth
- `NEXTAUTH_URL` - URL вашего приложения

### 5. Получение Vercel токенов

1. Перейдите в Vercel Dashboard → Settings → Tokens
2. Создайте новый токен
3. Скопируйте токен и добавьте в GitHub Secrets

### 6. Получение Project ID

1. В Vercel Dashboard перейдите в Settings → General
2. Скопируйте Project ID
3. Добавьте в GitHub Secrets как `VERCEL_PROJECT_ID`

## 🔧 Автоматические действия

После настройки:

- ✅ **Автоматический деплой** при push в `main`
- ✅ **Preview деплой** для Pull Requests
- ✅ **Тестирование и линтинг** перед деплоем
- ✅ **Уведомления** о статусе деплоя

## 🚀 Быстрый запуск

Запустите скрипт для автоматической настройки:

```bash
chmod +x simple-deploy.sh
./simple-deploy.sh
```

## 📱 Результат

После настройки ваше приложение будет доступно по адресу:
`https://your-project.vercel.app`

## 🔗 Полезные ссылки

- **Vercel Dashboard**: https://vercel.com/dashboard
- **GitHub Repository**: https://github.com/AlexSevryuga/ma-platform
- **GitHub Actions**: https://github.com/AlexSevryuga/ma-platform/actions
- **Vercel Documentation**: https://vercel.com/docs

## 🎯 Следующие шаги

1. ✅ Настройте Vercel проект
2. ✅ Добавьте переменные окружения
3. ✅ Настройте GitHub Integration
4. ✅ Добавьте GitHub Secrets
5. ✅ Проверьте работу приложения
6. 🔄 Настройте домен (опционально)
7. 🔄 Добавьте мониторинг
8. 🔄 Настройте аналитику 