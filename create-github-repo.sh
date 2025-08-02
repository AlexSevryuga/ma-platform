#!/bin/bash

# Скрипт для создания GitHub репозитория
# Требует GitHub Personal Access Token

echo "🚀 Создание GitHub репозитория для M&A AI Platform..."

# Запрос токена GitHub
echo "Введите ваш GitHub Personal Access Token:"
read -s GITHUB_TOKEN

if [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ Токен не предоставлен. Создайте токен на https://github.com/settings/tokens"
    exit 1
fi

# Запрос username
echo "Введите ваш GitHub username:"
read GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
    echo "❌ Username не предоставлен"
    exit 1
fi

REPO_NAME="ma-platform"
REPO_DESCRIPTION="M&A AI Platform - Современная платформа для анализа и управления M&A сделками с интеграцией искусственного интеллекта"

echo "📝 Создание репозитория: $REPO_NAME..."

# Создание репозитория через GitHub API
RESPONSE=$(curl -s -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/user/repos \
  -d "{
    \"name\": \"$REPO_NAME\",
    \"description\": \"$REPO_DESCRIPTION\",
    \"private\": false,
    \"has_issues\": true,
    \"has_wiki\": true,
    \"has_downloads\": true,
    \"auto_init\": false
  }")

# Проверка ответа
if echo "$RESPONSE" | grep -q "already exists"; then
    echo "⚠️  Репозиторий $REPO_NAME уже существует"
elif echo "$RESPONSE" | grep -q "Bad credentials"; then
    echo "❌ Неверный токен. Проверьте ваш Personal Access Token"
    exit 1
elif echo "$RESPONSE" | grep -q "created_at"; then
    echo "✅ Репозиторий успешно создан!"
else
    echo "❌ Ошибка при создании репозитория:"
    echo "$RESPONSE"
    exit 1
fi

# Добавление удаленного репозитория
echo "🔗 Подключение к GitHub репозиторию..."
git remote add origin https://github.com/$GITHUB_USERNAME/$REPO_NAME.git

# Отправка кода
echo "📤 Отправка кода в GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo "🎉 Успешно! Репозиторий доступен по адресу:"
    echo "https://github.com/$GITHUB_USERNAME/$REPO_NAME"
    
    # Создание тега версии
    echo "🏷️  Создание тега версии..."
    git tag -a v1.0.0 -m "Initial release: M&A AI Platform"
    git push origin v1.0.0
    
    echo "✅ Готово! Ваш проект успешно размещен на GitHub!"
else
    echo "❌ Ошибка при отправке кода"
    exit 1
fi 