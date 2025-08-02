# 🔑 Получение GitHub Personal Access Token

## Быстрый способ:

1. **Откройте ссылку**: https://github.com/settings/tokens/new
2. **Заполните форму**:
   - Note: `M&A Platform Deploy`
   - Expiration: `90 days` (или No expiration)
   - Scopes: выберите `repo` (полный доступ к репозиториям)
3. **Нажмите**: "Generate token"
4. **Скопируйте токен** (он показывается только один раз!)

## Использование токена:

После получения токена выполните:

```bash
# Установите токен как переменную окружения
export GITHUB_TOKEN="ghp_your_token_here"

# Создайте репозиторий
curl -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/user/repos \
  -d '{
    "name": "ma-platform",
    "description": "M&A AI Platform - Современная платформа для анализа и управления M&A сделками",
    "private": false,
    "has_issues": true,
    "has_wiki": true,
    "has_downloads": true
  }'

# Отправьте код
git push -u origin main
```

## Альтернативный способ (без токена):

1. Создайте репозиторий вручную на GitHub
2. Запустите: `./quick-setup.sh` 