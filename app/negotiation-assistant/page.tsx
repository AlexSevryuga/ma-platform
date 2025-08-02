'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import NegotiationAssistant from '../../components/NegotiationAssistant'
import { 
  HandThumbUpIcon,
  ChartBarIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  LightBulbIcon,
  UserGroupIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline'

export default function NegotiationAssistantPage() {
  const [activeSection, setActiveSection] = useState('assistant')

  const features = [
    {
      title: 'Стратегический анализ',
      description: 'AI-анализ баланса сил и рекомендации по стратегии',
      icon: LightBulbIcon,
      benefits: ['Анализ сильных и слабых сторон', 'Рекомендации по подходу', 'Оценка рисков']
    },
    {
      title: 'Тактические рекомендации',
      description: 'Поэтапные рекомендации для каждого этапа переговоров',
      icon: ChartBarIcon,
      benefits: ['Ключевые сообщения', 'Красные линии', 'План действий']
    },
    {
      title: 'Коммуникационная стратегия',
      description: 'Оптимизация коммуникации и обработка возражений',
      icon: UserGroupIcon,
      benefits: ['Тон коммуникации', 'Ключевые сообщения', 'Ответы на возражения']
    },
    {
      title: 'Структура сделки',
      description: 'Рекомендации по оптимальной структуре сделки',
      icon: HandThumbUpIcon,
      benefits: ['Условия оплаты', 'Earn-out структура', 'Условия закрытия']
    },
    {
      title: 'Временные рамки',
      description: 'Планирование временных рамок и ключевых вех',
      icon: ClockIcon,
      benefits: ['Оптимальные сроки', 'Ключевые вехи', 'Точки давления']
    },
    {
      title: 'Управление рисками',
      description: 'Комплексная оценка и управление рисками',
      icon: ExclamationTriangleIcon,
      benefits: ['Оценка рисков', 'Стратегии снижения', 'Мониторинг']
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <RocketLaunchIcon className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">AI Ассистент Переговоров</h1>
                <p className="text-xl text-gray-600">Революционные AI-инструменты для успешных M&A переговоров</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Навигация */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'assistant', name: 'AI Ассистент', icon: RocketLaunchIcon },
              { id: 'features', name: 'Возможности', icon: LightBulbIcon },
              { id: 'benefits', name: 'Преимущества', icon: CheckCircleIcon }
            ].map((section) => {
              const Icon = section.icon
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`py-2 px-4 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                    activeSection === section.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{section.name}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Контент */}
        <div className="space-y-8">
          {/* AI Ассистент */}
          {activeSection === 'assistant' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Интеллектуальный помощник для переговоров
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Наш AI-ассистент анализирует все аспекты сделки и предоставляет стратегические рекомендации для достижения оптимальных результатов
                </p>
              </div>

              <NegotiationAssistant />
            </motion.div>
          )}

          {/* Возможности */}
          {activeSection === 'features' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Мощные возможности AI
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Наш AI-ассистент предоставляет комплексные инструменты для каждого этапа переговоров
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => {
                  const Icon = feature.icon
                  return (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
                    >
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                      </div>
                      
                      <p className="text-gray-600 mb-4">{feature.description}</p>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900">Ключевые возможности:</h4>
                        <ul className="space-y-1">
                          {feature.benefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-center space-x-2 text-sm text-gray-600">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* Преимущества */}
          {activeSection === 'benefits' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Преимущества AI-ассистента
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Почему наша платформа революционизирует M&A переговоры
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Количественные результаты</h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Повышение успешности сделок</span>
                      <span className="text-2xl font-bold text-green-600">+35%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Сокращение времени переговоров</span>
                      <span className="text-2xl font-bold text-blue-600">-40%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Улучшение условий сделок</span>
                      <span className="text-2xl font-bold text-purple-600">+25%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Снижение рисков</span>
                      <span className="text-2xl font-bold text-green-600">-50%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Качественные улучшения</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircleIcon className="w-6 h-6 text-green-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Стратегическое планирование</h4>
                        <p className="text-gray-600">AI анализирует все факторы и создает оптимальную стратегию</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircleIcon className="w-6 h-6 text-green-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Проактивное управление рисками</h4>
                        <p className="text-gray-600">Выявление и снижение рисков до их материализации</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircleIcon className="w-6 h-6 text-green-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Оптимизация коммуникации</h4>
                        <p className="text-gray-600">Правильный тон и ключевые сообщения для каждой аудитории</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircleIcon className="w-6 h-6 text-green-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Структурированный подход</h4>
                        <p className="text-gray-600">Поэтапное планирование с четкими вехами и результатами</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Готовы революционизировать ваши переговоры?
                  </h3>
                  <p className="text-lg text-gray-600 mb-6">
                    Начните использовать AI-ассистент уже сегодня и получите конкурентное преимущество
                  </p>
                  <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow duration-300">
                    Начать использование
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
} 