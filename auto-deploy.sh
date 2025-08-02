#!/bin/bash

echo "🚀 Полная автоматизация деплоя M&A AI Platform"
echo "================================================"
echo ""

# Проверяем наличие необходимых инструментов
check_dependencies() {
    echo "🔍 Проверка зависимостей..."
    
    if ! command -v git &> /dev/null; then
        echo "❌ Git не установлен"
        exit 1
    fi
    
    if ! command -v node &> /dev/null; then
        echo "❌ Node.js не установлен"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        echo "❌ npm не установлен"
        exit 1
    fi
    
    echo "✅ Все зависимости установлены"
    echo ""
}

# Устанавливаем Vercel CLI
install_vercel() {
    echo "📦 Установка Vercel CLI..."
    if ! command -v vercel &> /dev/null; then
        npm install -g vercel
    fi
    echo "✅ Vercel CLI готов"
    echo ""
}

# Авторизация в Vercel
auth_vercel() {
    echo "🔐 Авторизация в Vercel..."
    if ! vercel whoami &> /dev/null; then
        echo "Откроется браузер для авторизации..."
        vercel login
    fi
    echo "✅ Авторизация в Vercel завершена"
    echo ""
}

# Создание проекта в Vercel
create_vercel_project() {
    echo "🏗️  Создание проекта в Vercel..."
    vercel --yes --prod
    echo "✅ Проект создан в Vercel"
    echo ""
}

# Настройка переменных окружения в Vercel
setup_vercel_env() {
    echo "🔧 Настройка переменных окружения в Vercel..."
    
    # Генерируем NEXTAUTH_SECRET
    NEXTAUTH_SECRET=$(openssl rand -base64 32)
    
    # Добавляем переменные
    echo "$NEXTAUTH_SECRET" | vercel env add NEXTAUTH_SECRET production
    echo "sk-demo-key" | vercel env add OPENAI_API_KEY production
    
    echo "✅ Переменные окружения настроены в Vercel"
    echo ""
}

# Настройка GitHub Secrets
setup_github_secrets() {
    echo "🔐 Настройка GitHub Secrets..."
    
    if [ -z "$GITHUB_TOKEN" ]; then
        echo "⚠️  GITHUB_TOKEN не установлен, пропускаем настройку GitHub Secrets"
        echo "Установите токен: export GITHUB_TOKEN='ваш_токен'"
        echo "Затем запустите: ./setup-github-secrets.sh"
        echo ""
        return
    fi
    
    # Генерируем секреты
    NEXTAUTH_SECRET=$(openssl rand -base64 32)
    
    # Добавляем секреты через API
    REPO_OWNER="AlexSevryuga"
    REPO_NAME="ma-platform"
    
    # Получаем публичный ключ
    PUBLIC_KEY_RESPONSE=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
        "https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/actions/secrets/public-key")
    
    PUBLIC_KEY=$(echo "$PUBLIC_KEY_RESPONSE" | jq -r '.key')
    KEY_ID=$(echo "$PUBLIC_KEY_RESPONSE" | jq -r '.key_id')
    
    if [ "$PUBLIC_KEY" != "null" ] && [ -n "$PUBLIC_KEY" ]; then
        # Добавляем NEXTAUTH_SECRET
        ENCRYPTED_SECRET=$(echo -n "$NEXTAUTH_SECRET" | openssl pkeyutl -encrypt -pubin -inkey <(echo "$PUBLIC_KEY" | base64 -d) | base64)
        
        curl -s -X PUT \
            -H "Authorization: token $GITHUB_TOKEN" \
            -H "Accept: application/vnd.github.v3+json" \
            "https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/actions/secrets/NEXTAUTH_SECRET" \
            -d "{\"encrypted_value\":\"$ENCRYPTED_SECRET\",\"key_id\":\"$KEY_ID\"}" > /dev/null
        
        echo "✅ GitHub Secrets настроены"
    else
        echo "⚠️  Не удалось настроить GitHub Secrets автоматически"
    fi
    echo ""
}

# Настройка GitHub Integration в Vercel
setup_github_integration() {
    echo "🔗 Настройка GitHub Integration в Vercel..."
    
    # Получаем информацию о проекте
    PROJECT_INFO=$(vercel project ls --json 2>/dev/null | jq -r '.[0]')
    
    if [ "$PROJECT_INFO" != "null" ] && [ -n "$PROJECT_INFO" ]; then
        PROJECT_ID=$(echo "$PROJECT_INFO" | jq -r '.id')
        PROJECT_NAME=$(echo "$PROJECT_INFO" | jq -r '.name')
        
        echo "📋 Информация о проекте:"
        echo "   ID: $PROJECT_ID"
        echo "   Name: $PROJECT_NAME"
        echo ""
        echo "🔗 Настройте GitHub Integration вручную:"
        echo "   https://vercel.com/dashboard/project/$PROJECT_ID/settings/git"
        echo ""
    fi
}

# Финальный деплой
final_deploy() {
    echo "🚀 Финальный деплой..."
    vercel --prod
    echo ""
}

# Показываем результаты
show_results() {
    echo "🎉 Автоматизация завершена!"
    echo ""
    echo "📱 Ваше приложение должно быть доступно по адресу:"
    echo "   https://ma-platform.vercel.app"
    echo ""
    echo "🔗 Полезные ссылки:"
    echo "   Vercel Dashboard: https://vercel.com/dashboard"
    echo "   GitHub Repository: https://github.com/AlexSevryuga/ma-platform"
    echo "   GitHub Actions: https://github.com/AlexSevryuga/ma-platform/actions"
    echo ""
    echo "🔧 Следующие шаги:"
    echo "   1. Проверьте работу приложения"
    echo "   2. Настройте домен (опционально)"
    echo "   3. Добавьте Collaborators"
    echo "   4. Настройте мониторинг"
    echo ""
}

# Главная функция
main() {
    check_dependencies
    install_vercel
    auth_vercel
    create_vercel_project
    setup_vercel_env
    setup_github_secrets
    setup_github_integration
    final_deploy
    show_results
}

# Запуск
main 