# 🚀 Настройка GitHub репозитория

## Шаг 1: Создание Personal Access Token

1. Перейдите на [GitHub Settings > Tokens](https://github.com/settings/tokens)
2. Нажмите "Generate new token (classic)"
3. Выберите следующие разрешения:
   - `repo` (полный доступ к репозиториям)
   - `workflow` (для GitHub Actions)
4. Скопируйте токен (он показывается только один раз!)

## Шаг 2: Создание репозитория

Выполните следующие команды в терминале:

```bash
# Замените YOUR_TOKEN на ваш токен
export GITHUB_TOKEN="YOUR_TOKEN"

# Создание репозитория
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

# Отправка кода
git push -u origin main
```

## Шаг 3: Альтернативный способ (через веб-интерфейс)

1. Перейдите на [GitHub.com](https://github.com)
2. Нажмите "New repository"
3. Название: `ma-platform`
4. Описание: `M&A AI Platform - Современная платформа для анализа и управления M&A сделками`
5. Выберите Public
6. НЕ ставьте галочки на README, .gitignore, license
7. Нажмите "Create repository"
8. Выполните команды, которые покажет GitHub

## Шаг 4: Проверка

После создания репозитория проверьте:
- [ ] Код загружен на GitHub
- [ ] README.md отображается корректно
- [ ] Все файлы присутствуют
- [ ] Нет ошибок компиляции

## Полезные ссылки

- [Ваш репозиторий](https://github.com/AlexSevryuga/ma-platform)
- [GitHub Pages](https://github.com/AlexSevryuga/ma-platform/settings/pages)
- [Actions](https://github.com/AlexSevryuga/ma-platform/actions)
- [Issues](https://github.com/AlexSevryuga/ma-platform/issues) 