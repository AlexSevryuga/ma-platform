#!/bin/bash

VERCEL_TOKEN="PuXWTsv0m2YQYRhHqPKVBINJ"
GITHUB_TOKEN="${GITHUB_TOKEN}"

echo "🚀 Добавление токена Vercel в GitHub Secrets"
echo "============================================="

if [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ GITHUB_TOKEN не установлен"
    echo "Пожалуйста, установите переменную окружения GITHUB_TOKEN"
    exit 1
fi

echo "✅ Vercel токен получен: ${VERCEL_TOKEN:0:8}..."
echo "✅ GitHub токен установлен"

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
    
    # Создаем временный файл с публичным ключом
    echo "$public_key" > /tmp/github_public_key.pem
    
    # Шифруем секрет
    local encrypted_value=$(echo -n "$secret_value" | openssl pkeyutl -encrypt -pubin -inkey /tmp/github_public_key.pem | base64 -w 0)
    
    # Удаляем временный файл
    rm /tmp/github_public_key.pem
    
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

# Добавляем Vercel токен
add_github_secret "VERCEL_TOKEN" "$VERCEL_TOKEN"

# Генерируем и добавляем NEXTAUTH_SECRET
NEXTAUTH_SECRET=$(openssl rand -base64 32)
add_github_secret "NEXTAUTH_SECRET" "$NEXTAUTH_SECRET"

# Добавляем NEXTAUTH_URL
add_github_secret "NEXTAUTH_URL" "https://ma-platform.vercel.app"

echo ""
echo "🔑 Добавленные секреты:"
echo "======================="
echo "VERCEL_TOKEN: ${VERCEL_TOKEN:0:8}..."
echo "NEXTAUTH_SECRET: ${NEXTAUTH_SECRET:0:16}..."
echo "NEXTAUTH_URL: https://ma-platform.vercel.app"
echo ""

echo "📋 Следующие шаги:"
echo "=================="
echo "1. Перейдите в https://vercel.com/new"
echo "2. Импортируйте репозиторий: AlexSevryuga/ma-platform"
echo "3. После создания проекта получите ORG_ID и PROJECT_ID"
echo "4. Добавьте их в GitHub Secrets:"
echo "   - VERCEL_ORG_ID: ваш_org_id"
echo "   - VERCEL_PROJECT_ID: ваш_project_id"
echo "5. Добавьте OPENAI_API_KEY в GitHub Secrets"
echo ""

echo "🔗 Полезные ссылки:"
echo "==================="
echo "GitHub Secrets: https://github.com/AlexSevryuga/ma-platform/settings/secrets/actions"
echo "Vercel Dashboard: https://vercel.com/dashboard"
echo ""

echo "✅ Токен Vercel успешно добавлен в GitHub Secrets!" 