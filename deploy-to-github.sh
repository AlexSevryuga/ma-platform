#!/bin/bash

echo "🚀 Автоматический деплой M&A AI Platform на GitHub"
echo ""

# Проверяем, что мы в правильной директории
if [ ! -f "package.json" ]; then
    echo "❌ Ошибка: package.json не найден. Убедитесь, что вы в корневой папке проекта."
    exit 1
fi

# Проверяем статус git
if [ ! -d ".git" ]; then
    echo "❌ Ошибка: .git директория не найдена. Инициализируйте git репозиторий."
    exit 1
fi

echo "✅ Проверки пройдены успешно"
echo ""

# Проверяем, есть ли удаленный репозиторий
if git remote get-url origin > /dev/null 2>&1; then
    echo "🔗 Удаленный репозиторий уже настроен"
    REMOTE_URL=$(git remote get-url origin)
    echo "   URL: $REMOTE_URL"
else
    echo "🔗 Настройка удаленного репозитория..."
    git remote add origin https://github.com/AlexSevryuga/ma-platform.git
fi

echo ""
echo "📤 Отправка кода в GitHub..."

# Пытаемся отправить код
if git push -u origin main; then
    echo ""
    echo "🎉 Успешно! Код отправлен в GitHub!"
    echo ""
    
    # Создаем тег версии
    echo "🏷️  Создание тега версии v1.0.0..."
    git tag -a v1.0.0 -m "Initial release: M&A AI Platform"
    git push origin v1.0.0
    
    echo ""
    echo "✅ Готово! Ваш проект успешно размещен на GitHub!"
    echo ""
    echo "📱 Ссылки:"
    echo "   🌐 Репозиторий: https://github.com/AlexSevryuga/ma-platform"
    echo "   📖 README: https://github.com/AlexSevryuga/ma-platform#readme"
    echo "   🏷️  Релизы: https://github.com/AlexSevryuga/ma-platform/releases"
    echo ""
    echo "🔧 Следующие шаги:"
    echo "   1. Настройте GitHub Pages (Settings > Pages)"
    echo "   2. Добавьте Issues для задач"
    echo "   3. Настройте GitHub Actions для CI/CD"
    echo "   4. Добавьте Collaborators если нужно"
    echo ""
    echo "🎯 Платформа готова к использованию!"
    
else
    echo ""
    echo "❌ Ошибка при отправке кода"
    echo ""
    echo "🔧 Возможные решения:"
    echo "   1. Убедитесь, что репозиторий создан на GitHub"
    echo "   2. Проверьте права доступа к репозиторию"
    echo "   3. Попробуйте создать репозиторий вручную:"
    echo "      - Откройте https://github.com/new"
    echo "      - Название: ma-platform"
    echo "      - Описание: M&A AI Platform"
    echo "      - Public"
    echo "      - НЕ ставьте галочки на README, .gitignore, license"
    echo "   4. Затем запустите этот скрипт снова"
    echo ""
    echo "📋 Или используйте альтернативный способ:"
    echo "   ./quick-setup.sh"
fi 