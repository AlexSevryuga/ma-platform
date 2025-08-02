#!/bin/bash

echo "🚀 Автоматическая настройка деплоя на Vercel"
echo "============================================="

# Проверяем наличие токена GitHub
if [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ GITHUB_TOKEN не установлен"
    echo "Пожалуйста, установите переменную окружения GITHUB_TOKEN"
    echo "export GITHUB_TOKEN=your_github_token"
    exit 1
fi

# Генерируем NEXTAUTH_SECRET если не установлен
if [ -z "$NEXTAUTH_SECRET" ]; then
    NEXTAUTH_SECRET=$(openssl rand -base64 32)
    echo "🔑 Сгенерирован NEXTAUTH_SECRET: $NEXTAUTH_SECRET"
fi

# Функция для добавления секрета в GitHub
add_github_secret() {
    local secret_name=$1
    local secret_value=$2
    
    echo "📝 Добавляю секрет $secret_name в GitHub..."
    
    # Получаем public key для шифрования
    local public_key_response=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
        "https://api.github.com/repos/AlexSevryuga/ma-platform/actions/secrets/public-key")
    
    local public_key=$(echo "$public_key_response" | jq -r '.key')
    local key_id=$(echo "$public_key_response" | jq -r '.key_id')
    
    if [ "$public_key" = "null" ] || [ -z "$public_key" ]; then
        echo "❌ Не удалось получить public key"
        return 1
    fi
    
    # Шифруем секрет
    local encrypted_value=$(echo -n "$secret_value" | openssl pkeyutl -encrypt -pubin -inkey <(echo "$public_key" | base64 -d) | base64 -w 0)
    
    # Добавляем секрет
    local response=$(curl -s -X PUT \
        -H "Authorization: token $GITHUB_TOKEN" \
        -H "Accept: application/vnd.github.v3+json" \
        "https://api.github.com/repos/AlexSevryuga/ma-platform/actions/secrets/$secret_name" \
        -d "{\"encrypted_value\":\"$encrypted_value\",\"key_id\":\"$key_id\"}")
    
    if echo "$response" | jq -e '.message' > /dev/null 2>&1; then
        echo "❌ Ошибка добавления секрета $secret_name: $(echo "$response" | jq -r '.message')"
        return 1
    else
        echo "✅ Секрет $secret_name успешно добавлен"
    fi
}

# Добавляем необходимые секреты
echo "🔧 Настройка GitHub Secrets..."

# NEXTAUTH_SECRET
add_github_secret "NEXTAUTH_SECRET" "$NEXTAUTH_SECRET"

# NEXTAUTH_URL (будет обновлен после деплоя)
add_github_secret "NEXTAUTH_URL" "https://ma-platform.vercel.app"

# Проверяем наличие OPENAI_API_KEY
if [ -n "$OPENAI_API_KEY" ]; then
    add_github_secret "OPENAI_API_KEY" "$OPENAI_API_KEY"
else
    echo "⚠️  OPENAI_API_KEY не установлен. Добавьте его вручную в GitHub Secrets"
fi

# Проверяем наличие DATABASE_URL
if [ -n "$DATABASE_URL" ]; then
    add_github_secret "DATABASE_URL" "$DATABASE_URL"
else
    echo "⚠️  DATABASE_URL не установлен. Добавьте его вручную в GitHub Secrets если используете базу данных"
fi

echo ""
echo "🔗 Ссылки для настройки Vercel:"
echo "1. Создать проект: https://vercel.com/new"
echo "2. Импортировать репозиторий: AlexSevryuga/ma-platform"
echo "3. Настроить переменные окружения:"
echo "   - NEXTAUTH_SECRET: $NEXTAUTH_SECRET"
echo "   - NEXTAUTH_URL: https://your-app-name.vercel.app"
echo "   - OPENAI_API_KEY: (ваш ключ OpenAI)"
echo "4. После деплоя получить VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID"
echo "5. Добавить их в GitHub Secrets для автоматического деплоя"

echo ""
echo "📋 Для получения Vercel токенов:"
echo "1. Перейдите в https://vercel.com/account/tokens"
echo "2. Создайте новый токен"
echo "3. Получите ORG_ID и PROJECT_ID из настроек проекта"
echo "4. Добавьте их в GitHub Secrets"

echo ""
echo "✅ Настройка завершена! Теперь создайте проект на Vercel и настройте переменные окружения." 