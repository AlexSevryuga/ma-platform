'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  LightBulbIcon, 
  RocketLaunchIcon,
  ChartBarIcon,
  CogIcon,
  UserGroupIcon,
  GlobeAltIcon,
  SparklesIcon,
  BeakerIcon,
  CpuChipIcon,
  EyeIcon
} from '@heroicons/react/24/outline'

export default function InnovationHub() {
  const [activeSection, setActiveSection] = useState('overview')
  const [selectedSector, setSelectedSector] = useState('technology')
  const [workflowType, setWorkflowType] = useState('due_diligence')

  const innovations = [
    {
      id: 'market-intelligence',
      title: 'AI Рыночная Разведка',
      description: 'Реальное время анализ рынка, конкурентов и возможностей',
      icon: GlobeAltIcon,
      features: [
        'Анализ конкурентной среды',
        'Прогнозирование трендов',
        'Оценка рыночных возможностей',
        'Регулятивный мониторинг'
      ],
      benefits: [
        'Сокращение времени исследования на 80%',
        'Повышение точности прогнозов на 60%',
        'Автоматическое обновление данных'
      ]
    },
    {
      id: 'workflow-automation',
      title: 'Автоматизация Процессов',
      description: 'AI-оптимизированные рабочие процессы для M&A',
      icon: CogIcon,
      features: [
        'Автоматические рабочие процессы',
        'Умное назначение задач',
        'Прогнозирование сроков',
        'Управление рисками'
      ],
      benefits: [
        'Сокращение времени выполнения на 50%',
        'Снижение ошибок на 70%',
        'Повышение консистентности на 90%'
      ]
    },
    {
      id: 'ai-collaboration',
      title: 'AI Коллаборация',
      description: 'Интеллектуальные инструменты для командной работы',
      icon: UserGroupIcon,
      features: [
        'AI-ассистент встреч',
        'Умное планирование',
        'Автоматические отчеты',
        'Прогнозирование производительности'
      ],
      benefits: [
        'Улучшение коммуникации на 40%',
        'Сокращение времени встреч на 30%',
        'Повышение вовлеченности команды'
      ]
    },
    {
      id: 'predictive-analytics',
      title: 'Предиктивная Аналитика',
      description: 'Прогнозирование успеха сделок и рисков',
      icon: ChartBarIcon,
      features: [
        'Прогноз успешности сделок',
        'Анализ синергий',
        'Оценка интеграционных рисков',
        'Рекомендации по структуре'
      ],
      benefits: [
        'Повышение точности прогнозов на 75%',
        'Снижение неудачных сделок на 40%',
        'Оптимизация структуры сделок'
      ]
    },
    {
      id: 'real-time-insights',
      title: 'Инсайты в Реальном Времени',
      description: 'Мгновенные AI-инсайты для принятия решений',
      icon: EyeIcon,
      features: [
        'Анализ документов в реальном времени',
        'Автоматические уведомления',
        'Контекстные рекомендации',
        'Адаптивные дашборды'
      ],
      benefits: [
        'Ускорение принятия решений на 60%',
        'Повышение качества решений на 45%',
        'Снижение информационной перегрузки'
      ]
    },
    {
      id: 'ai-powered-reports',
      title: 'AI Генерация Отчетов',
      description: 'Автоматическое создание профессиональных отчетов',
      icon: SparklesIcon,
      features: [
        'Автоматическая генерация отчетов',
        'Персонализированные дашборды',
        'Интерактивная аналитика',
        'Многоязычная поддержка'
      ],
      benefits: [
        'Сокращение времени подготовки отчетов на 80%',
        'Повышение качества документации',
        'Стандартизация процессов'
      ]
    }
  ]

  const sectors = [
    { id: 'technology', name: 'Технологии', growth: '15%', deals: 245 },
    { id: 'healthcare', name: 'Здравоохранение', growth: '12%', deals: 189 },
    { id: 'finance', name: 'Финансы', growth: '8%', deals: 156 },
    { id: 'manufacturing', name: 'Производство', growth: '6%', deals: 134 },
    { id: 'energy', name: 'Энергетика', growth: '10%', deals: 98 }
  ]

  const workflowTypes = [
    { id: 'due_diligence', name: 'Due Diligence', duration: '4-6 недель', automation: '85%' },
    { id: 'deal_sourcing', name: 'Поиск сделок', duration: '2-4 недели', automation: '70%' },
    { id: 'valuation', name: 'Оценка', duration: '3-5 недель', automation: '75%' },
    { id: 'integration', name: 'Интеграция', duration: '6-12 месяцев', automation: '60%' }
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
                <h1 className="text-4xl font-bold text-gray-900">Innovation Hub</h1>
                <p className="text-xl text-gray-600">Революционные AI-функции для M&A будущего</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', name: 'Обзор', icon: LightBulbIcon },
              { id: 'market-intelligence', name: 'Рыночная разведка', icon: GlobeAltIcon },
              { id: 'automation', name: 'Автоматизация', icon: CogIcon },
              { id: 'collaboration', name: 'Коллаборация', icon: UserGroupIcon },
              { id: 'analytics', name: 'Аналитика', icon: ChartBarIcon }
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

        {/* Content */}
        <div className="space-y-8">
          {/* Overview Section */}
          {activeSection === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Будущее M&A уже здесь
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Наша платформа объединяет передовые AI-технологии для создания самой умной M&A экосистемы в мире
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {innovations.map((innovation, index) => {
                  const Icon = innovation.icon
                  return (
                    <motion.div
                      key={innovation.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
                    >
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">{innovation.title}</h3>
                      </div>
                      
                      <p className="text-gray-600 mb-4">{innovation.description}</p>
                      
                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-900">Ключевые функции:</h4>
                        <ul className="space-y-1">
                          {innovation.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center space-x-2 text-sm text-gray-600">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <h4 className="font-medium text-gray-900 mb-2">Результаты:</h4>
                        <ul className="space-y-1">
                          {innovation.benefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-center space-x-2 text-sm text-green-600">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
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

          {/* Market Intelligence Section */}
          {activeSection === 'market-intelligence' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <GlobeAltIcon className="w-8 h-8 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">AI Рыночная Разведка</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Выберите сектор для анализа:</h3>
                    <div className="space-y-3">
                      {sectors.map((sector) => (
                        <button
                          key={sector.id}
                          onClick={() => setSelectedSector(sector.id)}
                          className={`w-full p-4 rounded-lg border-2 transition-all duration-200 ${
                            selectedSector === sector.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="text-left">
                              <h4 className="font-medium text-gray-900">{sector.name}</h4>
                              <p className="text-sm text-gray-600">Рост: {sector.growth}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-semibold text-blue-600">{sector.deals}</p>
                              <p className="text-xs text-gray-500">сделок</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Результаты анализа:</h3>
                    <div className="space-y-4">
                      <div className="bg-white rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Рыночная привлекательность</h4>
                        <div className="flex items-center space-x-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                          </div>
                          <span className="text-sm font-medium text-green-600">85%</span>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Конкурентная среда</h4>
                        <div className="flex items-center space-x-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                          </div>
                          <span className="text-sm font-medium text-yellow-600">65%</span>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Регулятивная среда</h4>
                        <div className="flex items-center space-x-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                          </div>
                          <span className="text-sm font-medium text-blue-600">75%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Automation Section */}
          {activeSection === 'automation' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <CogIcon className="w-8 h-8 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Автоматизация Процессов</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Выберите тип процесса:</h3>
                    <div className="space-y-3">
                      {workflowTypes.map((workflow) => (
                        <button
                          key={workflow.id}
                          onClick={() => setWorkflowType(workflow.id)}
                          className={`w-full p-4 rounded-lg border-2 transition-all duration-200 ${
                            workflowType === workflow.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="text-left">
                              <h4 className="font-medium text-gray-900">{workflow.name}</h4>
                              <p className="text-sm text-gray-600">Длительность: {workflow.duration}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-semibold text-blue-600">{workflow.automation}</p>
                              <p className="text-xs text-gray-500">автоматизация</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Преимущества автоматизации:</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Время выполнения</span>
                        <span className="font-semibold text-green-600">-50%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Снижение ошибок</span>
                        <span className="font-semibold text-green-600">-70%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Консистентность</span>
                        <span className="font-semibold text-green-600">+90%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Стоимость</span>
                        <span className="font-semibold text-green-600">-35%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Collaboration Section */}
          {activeSection === 'collaboration' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <UserGroupIcon className="w-8 h-8 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">AI Коллаборация</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      title: 'AI Meeting Assistant',
                      description: 'Автоматические заметки и отслеживание действий',
                      icon: '🎯',
                      benefits: ['Экономия времени', 'Улучшенное отслеживание', 'Автоматические напоминания']
                    },
                    {
                      title: 'Smart Task Assignment',
                      description: 'AI-рекомендации по назначению задач',
                      icon: '⚡',
                      benefits: ['Оптимальное распределение', 'Снижение перегрузки', 'Повышение эффективности']
                    },
                    {
                      title: 'Predictive Analytics',
                      description: 'Прогнозирование рисков и задержек',
                      icon: '🔮',
                      benefits: ['Проактивное управление', 'Улучшенное планирование', 'Снижение сюрпризов']
                    }
                  ].map((feature, index) => (
                    <div key={index} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6">
                      <div className="text-3xl mb-3">{feature.icon}</div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-gray-600 mb-4">{feature.description}</p>
                      <ul className="space-y-1">
                        {feature.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-center space-x-2 text-sm text-gray-700">
                            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Analytics Section */}
          {activeSection === 'analytics' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <ChartBarIcon className="w-8 h-8 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Предиктивная Аналитика</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Прогнозы и Инсайты</h3>
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Точность прогнозов</h4>
                        <div className="flex items-center space-x-2">
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div className="bg-green-500 h-3 rounded-full" style={{ width: '85%' }}></div>
                          </div>
                          <span className="text-sm font-semibold text-green-600">85%</span>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Снижение неудачных сделок</h4>
                        <div className="flex items-center space-x-2">
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div className="bg-purple-500 h-3 rounded-full" style={{ width: '75%' }}></div>
                          </div>
                          <span className="text-sm font-semibold text-purple-600">75%</span>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Оптимизация структуры</h4>
                        <div className="flex items-center space-x-2">
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div className="bg-orange-500 h-3 rounded-full" style={{ width: '90%' }}></div>
                          </div>
                          <span className="text-sm font-semibold text-orange-600">90%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Ключевые метрики</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Время принятия решений</span>
                        <span className="font-semibold text-blue-600">-60%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Качество решений</span>
                        <span className="font-semibold text-green-600">+45%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">ROI сделок</span>
                        <span className="font-semibold text-green-600">+30%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Время интеграции</span>
                        <span className="font-semibold text-blue-600">-40%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
} 