#!/bin/bash

echo "🚀 Быстрая настройка GitHub репозитория для M&A AI Platform"
echo ""

echo "📋 Инструкция:"
echo "1. Откройте https://github.com/new в браузере"
echo "2. Заполните форму:"
echo "   - Repository name: ma-platform"
echo "   - Description: M&A AI Platform - Современная платформа для анализа и управления M&A сделками"
echo "   - Visibility: Public"
echo "   - НЕ ставьте галочки на README, .gitignore, license"
echo "3. Нажмите 'Create repository'"
echo ""

read -p "Создали ли вы репозиторий? (y/n): " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "✅ Отлично! Теперь отправим код..."
    
    # Проверяем, есть ли удаленный репозиторий
    if git remote get-url origin > /dev/null 2>&1; then
        echo "🔗 Удаленный репозиторий уже настроен"
    else
        echo "🔗 Настройка удаленного репозитория..."
        git remote add origin https://github.com/AlexSevryuga/ma-platform.git
    fi
    
    # Отправляем код
    echo "📤 Отправка кода в GitHub..."
    git push -u origin main
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "🎉 Успешно! Ваш проект размещен на GitHub!"
        echo "📱 Ссылка: https://github.com/AlexSevryuga/ma-platform"
        echo ""
        echo "🏷️  Создание тега версии..."
        git tag -a v1.0.0 -m "Initial release: M&A AI Platform"
        git push origin v1.0.0
        
        echo ""
        echo "✅ Готово! Теперь вы можете:"
        echo "   - Просматривать код на GitHub"
        echo "   - Создавать Issues для задач"
        echo "   - Настроить GitHub Pages"
        echo "   - Добавить Collaborators"
        echo "   - Настроить GitHub Actions для CI/CD"
    else
        echo "❌ Ошибка при отправке кода"
        echo "Проверьте, что репозиторий создан и у вас есть права на запись"
    fi
else
    echo "❌ Сначала создайте репозиторий на GitHub, затем запустите скрипт снова"
fi 