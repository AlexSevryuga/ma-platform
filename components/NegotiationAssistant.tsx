'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ChatBubbleLeftRightIcon,
  HandThumbUpIcon,
  ChartBarIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  LightBulbIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'

export default function NegotiationAssistant() {
  const [activeTab, setActiveTab] = useState('strategy')
  const [negotiationType, setNegotiationType] = useState('acquisition')
  const [currentStage, setCurrentStage] = useState('initial_contact')

  const negotiationTypes = [
    { id: 'acquisition', name: 'Приобретение', icon: HandThumbUpIcon },
    { id: 'merger', name: 'Слияние', icon: UserGroupIcon },
    { id: 'divestiture', name: 'Продажа активов', icon: ChartBarIcon },
    { id: 'joint_venture', name: 'Совместное предприятие', icon: LightBulbIcon }
  ]

  const tabs = [
    { id: 'strategy', name: 'Стратегия', icon: LightBulbIcon },
    { id: 'tactics', name: 'Тактика', icon: ChartBarIcon },
    { id: 'communication', name: 'Коммуникация', icon: ChatBubbleLeftRightIcon },
    { id: 'structure', name: 'Структура', icon: HandThumbUpIcon },
    { id: 'timeline', name: 'Временные рамки', icon: ClockIcon },
    { id: 'risks', name: 'Риски', icon: ExclamationTriangleIcon }
  ]

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
          <HandThumbUpIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">AI Ассистент Переговоров</h2>
          <p className="text-gray-600">Стратегические рекомендации для успешных M&A переговоров</p>
        </div>
      </div>

      {/* Конфигурация */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Тип сделки
          </label>
          <select
            value={negotiationType}
            onChange={(e) => setNegotiationType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {negotiationTypes.map((type) => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Текущий этап
          </label>
          <select
            value={currentStage}
            onChange={(e) => setCurrentStage(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="initial_contact">Первоначальный контакт</option>
            <option value="due_diligence">Due Diligence</option>
            <option value="term_sheet">Term Sheet</option>
            <option value="definitive_agreement">Окончательное соглашение</option>
            <option value="closing">Закрытие</option>
          </select>
        </div>
      </div>

      {/* Индикатор успеха */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Вероятность успеха</h3>
            <p className="text-gray-600">На основе анализа всех факторов</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-green-600">75%</div>
            <div className="text-sm text-gray-500">Высокая вероятность</div>
          </div>
        </div>
        <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-500"
            style={{ width: '75%' }}
          ></div>
        </div>
      </div>

      {/* Навигация по вкладкам */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Контент вкладок */}
      <div className="min-h-[400px]">
        {activeTab === 'strategy' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Общий подход</h3>
                <p className="text-gray-700 bg-blue-50 p-4 rounded-lg">
                  Сотрудничающий подход с твердыми позициями по ключевым вопросам
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Ключевые принципы</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    "Создание взаимной ценности",
                    "Прозрачность в коммуникации",
                    "Защита ключевых интересов",
                    "Гибкость в структуре сделки"
                  ].map((principle, index) => (
                    <div key={index} className="flex items-center space-x-2 bg-green-50 p-3 rounded-lg">
                      <CheckCircleIcon className="w-5 h-5 text-green-600" />
                      <span className="text-gray-700">{principle}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Наши сильные стороны</h3>
                  <ul className="space-y-2">
                    {[
                      "Сильная финансовая позиция",
                      "Стратегическое соответствие",
                      "Операционные синергии",
                      "Стабильная команда менеджмента"
                    ].map((strength, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-gray-700">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Наши слабости</h3>
                  <ul className="space-y-2">
                    {[
                      "Ограниченное время на сделку",
                      "Зависимость от регулятивных одобрений",
                      "Потенциальные интеграционные риски"
                    ].map((weakness, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-gray-700">{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'tactics' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Первоначальный контакт</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Рекомендации</h4>
                    <ul className="space-y-1">
                      <li className="flex items-center space-x-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-700">Установить личные отношения с ключевыми лицами</span>
                      </li>
                      <li className="flex items-center space-x-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-700">Презентовать стратегическое видение</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Ключевые сообщения</h4>
                    <ul className="space-y-1">
                      <li className="flex items-center space-x-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        <span className="text-gray-700">Мы видим значительный потенциал для создания стоимости</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'communication' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Тон коммуникации</h3>
                <div className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Сотрудничающий
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Ключевые сообщения</h3>
                <div className="space-y-2">
                  {[
                    "Создание долгосрочной стоимости для всех стейкхолдеров",
                    "Стратегическое партнерство на основе взаимного уважения",
                    "Операционные синергии и рост бизнеса"
                  ].map((message, index) => (
                    <div key={index} className="bg-blue-50 p-3 rounded-lg">
                      <span className="text-gray-700">{message}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'structure' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Условия оплаты</h3>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <span className="text-gray-700">70% наличными при закрытии, 30% в виде earn-out на 3 года</span>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Структура earn-out</h3>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <span className="text-gray-700">Привязан к EBITDA и росту выручки с защитными механизмами</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'timeline' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Оптимальные временные рамки</h3>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <span className="text-gray-700">Закрытие в течение 4-6 месяцев для максимизации синергий</span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Ключевые вехи</h3>
                <div className="space-y-4">
                  {[
                    { milestone: "Подписание LOI", date: "Через 2 недели" },
                    { milestone: "Завершение Due Diligence", date: "Через 6 недель" },
                    { milestone: "Подписание SPA", date: "Через 10 недель" }
                  ].map((item, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">{item.milestone}</h4>
                        <span className="text-sm text-blue-600 font-medium">{item.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'risks' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Общий уровень риска</h3>
                <div className="px-3 py-1 rounded-full text-sm font-medium text-yellow-600 bg-yellow-50">
                  Средний
                </div>
              </div>

              <div className="bg-gradient-to-r from-red-50 to-yellow-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Общий риск</span>
                  <span className="text-2xl font-bold text-red-600">65%</span>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-red-400 to-yellow-400 h-2 rounded-full"
                    style={{ width: '65%' }}
                  ></div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Ключевые риски</h3>
                <div className="space-y-3">
                  {[
                    { risk: "Регулятивные риски", probability: "Средняя", impact: "Высокое", mitigation: "Раннее вовлечение регуляторов" },
                    { risk: "Интеграционные риски", probability: "Высокая", impact: "Среднее", mitigation: "Детальное планирование интеграции" }
                  ].map((risk, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{risk.risk}</h4>
                        <div className="flex space-x-2">
                          <span className="px-2 py-1 rounded text-xs font-medium text-yellow-600">
                            {risk.probability} вероятность
                          </span>
                          <span className="px-2 py-1 rounded text-xs font-medium text-red-600 bg-red-50">
                            {risk.impact} влияние
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-700">
                        <span className="font-medium">Стратегия снижения: </span>{risk.mitigation}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
} 