#!/bin/bash

echo "🚀 Настройка автоматического деплоя на Vercel"
echo ""

# Проверяем, установлен ли Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "📦 Установка Vercel CLI..."
    npm install -g vercel
fi

echo "✅ Vercel CLI готов"
echo ""

# Проверяем, авторизован ли пользователь
if ! vercel whoami &> /dev/null; then
    echo "🔐 Авторизация в Vercel..."
    echo "Откроется браузер для авторизации..."
    vercel login
fi

echo "✅ Авторизация в Vercel завершена"
echo ""

# Создаем проект в Vercel
echo "🏗️  Создание проекта в Vercel..."
vercel --yes

echo ""
echo "✅ Проект создан в Vercel!"
echo ""

# Получаем информацию о проекте
PROJECT_ID=$(vercel project ls --json | jq -r '.[0].id' 2>/dev/null || echo "")
PROJECT_NAME=$(vercel project ls --json | jq -r '.[0].name' 2>/dev/null || echo "ma-platform")

if [ -n "$PROJECT_ID" ]; then
    echo "📋 Информация о проекте:"
    echo "   ID: $PROJECT_ID"
    echo "   Name: $PROJECT_NAME"
    echo ""
    
    # Настраиваем переменные окружения
    echo "🔧 Настройка переменных окружения..."
    
    # NEXTAUTH_URL
    vercel env add NEXTAUTH_URL production
    echo "https://$PROJECT_NAME.vercel.app" | vercel env pull .env.production.local
    
    # NEXTAUTH_SECRET
    vercel env add NEXTAUTH_SECRET production
    echo "Введите секретный ключ для NextAuth (или нажмите Enter для автогенерации):"
    read -s NEXTAUTH_SECRET
    if [ -z "$NEXTAUTH_SECRET" ]; then
        NEXTAUTH_SECRET=$(openssl rand -base64 32)
    fi
    echo "$NEXTAUTH_SECRET" | vercel env pull .env.production.local
    
    # OPENAI_API_KEY
    vercel env add OPENAI_API_KEY production
    echo "Введите ваш OpenAI API ключ:"
    read -s OPENAI_API_KEY
    echo "$OPENAI_API_KEY" | vercel env pull .env.production.local
    
    # DATABASE_URL (опционально)
    echo "Хотите настроить базу данных? (y/n):"
    read -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        vercel env add DATABASE_URL production
        echo "Введите URL базы данных (или нажмите Enter для пропуска):"
        read DATABASE_URL
        if [ -n "$DATABASE_URL" ]; then
            echo "$DATABASE_URL" | vercel env pull .env.production.local
        fi
    fi
    
    echo ""
    echo "✅ Переменные окружения настроены!"
    echo ""
    
    # Деплой
    echo "🚀 Запуск деплоя..."
    vercel --prod
    
    echo ""
    echo "🎉 Деплой завершен!"
    echo ""
    echo "📱 Ваше приложение доступно по адресу:"
    echo "   https://$PROJECT_NAME.vercel.app"
    echo ""
    echo "🔗 Полезные ссылки:"
    echo "   Dashboard: https://vercel.com/dashboard"
    echo "   Project: https://vercel.com/dashboard/project/$PROJECT_ID"
    echo "   GitHub Integration: https://vercel.com/dashboard/project/$PROJECT_ID/settings/git"
    
else
    echo "❌ Не удалось получить информацию о проекте"
    echo "Попробуйте выполнить команды вручную:"
    echo "   vercel --prod"
    echo "   vercel env add"
fi

echo ""
echo "🔧 Следующие шаги:"
echo "   1. Настройте GitHub Integration в Vercel Dashboard"
echo "   2. Добавьте переменные окружения в GitHub Secrets"
echo "   3. Настройте домен (опционально)"
echo "   4. Проверьте работу приложения" 