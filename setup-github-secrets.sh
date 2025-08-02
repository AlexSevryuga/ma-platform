#!/bin/bash

echo "🔐 Настройка GitHub Secrets для автоматического деплоя"
echo ""

# Проверяем, есть ли токен
if [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ GITHUB_TOKEN не установлен"
    echo "Установите токен: export GITHUB_TOKEN='ваш_токен'"
    exit 1
fi

REPO_OWNER="AlexSevryuga"
REPO_NAME="ma-platform"

echo "📋 Настройка Secrets для репозитория: $REPO_OWNER/$REPO_NAME"
echo ""

# Функция для добавления секрета
add_secret() {
    local secret_name=$1
    local secret_value=$2
    
    echo "🔧 Добавление секрета: $secret_name"
    
    # Создаем публичный ключ для шифрования
    PUBLIC_KEY=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
        "https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/actions/secrets/public-key" | \
        jq -r '.key')
    
    if [ "$PUBLIC_KEY" = "null" ] || [ -z "$PUBLIC_KEY" ]; then
        echo "❌ Не удалось получить публичный ключ"
        return 1
    fi
    
    # Шифруем секрет
    ENCRYPTED_VALUE=$(echo -n "$secret_value" | openssl pkeyutl -encrypt -pubin -inkey <(echo "$PUBLIC_KEY" | base64 -d) | base64)
    
    # Отправляем секрет
    RESPONSE=$(curl -s -X PUT \
        -H "Authorization: token $GITHUB_TOKEN" \
        -H "Accept: application/vnd.github.v3+json" \
        "https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/actions/secrets/$secret_name" \
        -d "{\"encrypted_value\":\"$ENCRYPTED_VALUE\",\"key_id\":\"$(curl -s -H \"Authorization: token $GITHUB_TOKEN\" \"https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/actions/secrets/public-key\" | jq -r '.key_id')\"}")
    
    if echo "$RESPONSE" | grep -q "204"; then
        echo "✅ Секрет $secret_name добавлен успешно"
    else
        echo "❌ Ошибка при добавлении секрета $secret_name"
        echo "$RESPONSE"
    fi
}

# Запрашиваем переменные окружения
echo "🔑 Введите переменные окружения:"
echo ""

# NEXTAUTH_SECRET
echo "Введите NEXTAUTH_SECRET (или нажмите Enter для автогенерации):"
read -s NEXTAUTH_SECRET
if [ -z "$NEXTAUTH_SECRET" ]; then
    NEXTAUTH_SECRET=$(openssl rand -base64 32)
    echo "Автогенерированный секрет: $NEXTAUTH_SECRET"
fi
add_secret "NEXTAUTH_SECRET" "$NEXTAUTH_SECRET"

echo ""

# OPENAI_API_KEY
echo "Введите OPENAI_API_KEY:"
read -s OPENAI_API_KEY
if [ -n "$OPENAI_API_KEY" ]; then
    add_secret "OPENAI_API_KEY" "$OPENAI_API_KEY"
else
    echo "⚠️  OPENAI_API_KEY не указан"
fi

echo ""

# DATABASE_URL (опционально)
echo "Введите DATABASE_URL (или нажмите Enter для пропуска):"
read -s DATABASE_URL
if [ -n "$DATABASE_URL" ]; then
    add_secret "DATABASE_URL" "$DATABASE_URL"
else
    echo "⚠️  DATABASE_URL не указан"
fi

echo ""

# Vercel переменные (если есть)
echo "Хотите добавить Vercel переменные? (y/n):"
read -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Введите VERCEL_TOKEN:"
    read -s VERCEL_TOKEN
    if [ -n "$VERCEL_TOKEN" ]; then
        add_secret "VERCEL_TOKEN" "$VERCEL_TOKEN"
    fi
    
    echo "Введите VERCEL_ORG_ID:"
    read -s VERCEL_ORG_ID
    if [ -n "$VERCEL_ORG_ID" ]; then
        add_secret "VERCEL_ORG_ID" "$VERCEL_ORG_ID"
    fi
    
    echo "Введите VERCEL_PROJECT_ID:"
    read -s VERCEL_PROJECT_ID
    if [ -n "$VERCEL_PROJECT_ID" ]; then
        add_secret "VERCEL_PROJECT_ID" "$VERCEL_PROJECT_ID"
    fi
fi

echo ""
echo "✅ Настройка GitHub Secrets завершена!"
echo ""
echo "🔗 Проверить Secrets можно здесь:"
echo "   https://github.com/$REPO_OWNER/$REPO_NAME/settings/secrets/actions"
echo ""
echo "🚀 Теперь GitHub Actions будут использовать эти секреты для деплоя" 