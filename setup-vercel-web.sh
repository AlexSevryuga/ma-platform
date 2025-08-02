#!/bin/bash

echo "🚀 Настройка деплоя на Vercel через веб-интерфейс"
echo "=================================================="

# Открываем необходимые ссылки
echo "📋 Открываю ссылки для настройки:"
echo "1. Создание нового проекта на Vercel"
open "https://vercel.com/new"

echo "2. GitHub репозиторий"
open "https://github.com/AlexSevryuga/ma-platform"

echo "3. Настройки GitHub Secrets"
open "https://github.com/AlexSevryuga/ma-platform/settings/secrets/actions"

echo ""
echo "📝 Пошаговая инструкция:"
echo "1. На странице Vercel выберите 'Import Git Repository'"
echo "2. Выберите репозиторий: AlexSevryuga/ma-platform"
echo "3. Настройте переменные окружения:"
echo "   - NEXTAUTH_URL: https://your-app-name.vercel.app"
echo "   - NEXTAUTH_SECRET: (сгенерируйте случайную строку)"
echo "   - OPENAI_API_KEY: (ваш ключ OpenAI)"
echo "   - DATABASE_URL: (если используете базу данных)"
echo "4. Нажмите 'Deploy'"
echo ""
echo "🔧 Для генерации NEXTAUTH_SECRET выполните:"
echo "openssl rand -base64 32"
echo ""
echo "✅ После деплоя приложение будет доступно по адресу:"
echo "https://your-app-name.vercel.app" 