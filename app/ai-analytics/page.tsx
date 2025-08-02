'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ChartBarIcon, 
  DocumentTextIcon, 
  TrendingUpIcon,
  ChatBubbleLeftRightIcon,
  DocumentMagnifyingGlassIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import AIAnalytics from '@/components/AIAnalytics'
import DealPrediction from '@/components/DealPrediction'

export default function AIAnalyticsPage() {
  const [activeTab, setActiveTab] = useState('chat')
  const [documentContent, setDocumentContent] = useState('')
  const [dealData, setDealData] = useState({
    target_company: 'TechCorp Inc.',
    deal_size: 50000000,
    sector: 'technology',
    cross_border: false,
    regulatory_approvals: ['FTC', 'DOJ'],
    integration_required: true,
    synergies: 25,
    financial_strength: 'strong'
  })

  const demoChatAnalysis = {
    type: 'recommendation',
    confidence: 87,
    impact: 'high',
    actionable: true,
    sentiment: 'positive',
    emotion: 'confident',
    specificity: 'high',
    urgency: 'medium',
    key_topics: ['M&A', 'valuation', 'due_diligence', 'synergies'],
    recommended_actions: [
      'Провести детальную финансовую экспертизу',
      'Организовать правовую due diligence',
      'Разработать план интеграции',
      'Оценить синергетический потенциал'
    ],
    risk_level: 'medium',
    opportunity_score: 78,
    response_length: 450,
    complexity_score: 65,
    readability_score: 82,
    timestamp: new Date().toISOString(),
    analysis_version: '2.0'
  }

  const demoPrediction = {
    success_probability: 82,
    completion_time_months: 7,
    valuation_range: {
      min: 45000000,
      max: 65000000,
      currency: "USD"
    },
    key_factors: {
      positive: [
        "Сильная финансовая позиция целевой компании",
        "Стратегическое соответствие",
        "Операционные синергии",
        "Растущий рынок"
      ],
      negative: [
        "Регулятивные риски",
        "Интеграционные вызовы",
        "Конкурентная среда"
      ],
      neutral: [
        "Рыночные условия",
        "Технологические тренды"
      ]
    },
    risk_assessment: {
      financial_risk: "medium",
      regulatory_risk: "low",
      integration_risk: "medium",
      market_risk: "low"
    },
    synergy_potential: {
      cost_synergies: "18-22% от операционных расходов",
      revenue_synergies: "12-18% рост выручки",
      total_synergy_value: "8-12 млн USD"
    },
    recommendations: [
      "Провести детальную due diligence",
      "Разработать план интеграции",
      "Обеспечить регулятивное соответствие",
      "Создать команду интеграции"
    ],
    confidence_intervals: {
      success_probability: { lower: 70, upper: 90 },
      completion_time: { lower: 5, upper: 9 },
      valuation: { lower: 40000000, upper: 70000000 }
    },
    metadata: {
      prediction_timestamp: new Date().toISOString(),
      model_used: 'gpt-3.5-turbo',
      tokens_used: 1250,
      data_points_analyzed: 15
    },
    market_analysis: {
      overall_sentiment: 'positive',
      sector_performance: 'growing',
      regulatory_environment: 'favorable',
      financing_conditions: 'moderate',
      competitive_intensity: 'medium'
    },
    deal_complexity: {
      score: 65,
      level: 'medium',
      factors: {
        cross_border: false,
        regulatory_complexity: 2,
        size_factor: true,
        integration_required: true
      }
    },
    competitive_landscape: {
      competitive_intensity: 'medium',
      potential_bidders: 3,
      competitive_advantages: [
        'Высокие синергии',
        'Сильная финансовая позиция',
        'Стратегическое соответствие'
      ],
      competitive_disadvantages: [
        'Ограниченный опыт интеграции'
      ],
      market_position: 'strong'
    }
  }

  const tabs = [
    { id: 'chat', name: 'AI Чат', icon: ChatBubbleLeftRightIcon },
    { id: 'documents', name: 'Анализ документов', icon: DocumentMagnifyingGlassIcon },
    { id: 'predictions', name: 'Прогнозы сделок', icon: TrendingUpIcon },
    { id: 'reports', name: 'Генерация отчетов', icon: DocumentTextIcon }
  ]

  const handleDocumentAnalysis = async () => {
    if (!documentContent.trim()) return
    
    // Здесь будет вызов API для анализа документов
    console.log('Analyzing document:', documentContent)
  }

  const handleDealPrediction = async () => {
    // Здесь будет вызов API для прогнозирования сделок
    console.log('Predicting deal:', dealData)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ChartBarIcon className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">AI Аналитика</h1>
                <p className="text-gray-600">Продвинутые AI функции для M&A анализа</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* AI Chat Analytics */}
          {activeTab === 'chat' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Анализ AI Чата</h2>
                <p className="text-gray-600 mb-6">
                  Демонстрация улучшенного анализа ответов AI с детальными метриками и инсайтами.
                </p>
                <AIAnalytics data={demoChatAnalysis} title="Анализ последнего ответа AI" />
              </div>
            </motion.div>
          )}

          {/* Document Analysis */}
          {activeTab === 'documents' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Анализ документов</h2>
                <p className="text-gray-600 mb-6">
                  Загрузите документ для AI анализа с извлечением структурированных данных и оценкой рисков.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Содержимое документа
                    </label>
                    <textarea
                      value={documentContent}
                      onChange={(e) => setDocumentContent(e.target.value)}
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Вставьте текст документа для анализа..."
                    />
                  </div>
                  
                  <button
                    onClick={handleDocumentAnalysis}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <DocumentMagnifyingGlassIcon className="w-4 h-4 mr-2" />
                    Анализировать документ
                  </button>
                </div>

                {/* Demo Results */}
                <div className="mt-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Пример результатов анализа</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h4 className="text-sm font-medium text-green-700 mb-2">Извлеченные данные</h4>
                      <ul className="text-sm text-green-800 space-y-1">
                        <li>• Числа: 15, 2.5M, 45%</li>
                        <li>• Даты: 2024-01-15, 15.03.2024</li>
                        <li>• Компании: TechCorp Inc., ООО "Инновации"</li>
                        <li>• Валюты: $2.5M, €1.2M, ₽150M</li>
                      </ul>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h4 className="text-sm font-medium text-blue-700 mb-2">Анализ тональности</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Общая тональность: Позитивная</li>
                        <li>• Уверенность: 85%</li>
                        <li>• Риски: Низкие</li>
                        <li>• Возможности: Высокие</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Deal Predictions */}
          {activeTab === 'predictions' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Прогнозы сделок</h2>
                <p className="text-gray-600 mb-6">
                  AI прогнозирование успешности M&A сделок с детальным анализом рисков и синергий.
                </p>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Название целевой компании
                      </label>
                      <input
                        type="text"
                        value={dealData.target_company}
                        onChange={(e) => setDealData({...dealData, target_company: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Размер сделки (USD)
                      </label>
                      <input
                        type="number"
                        value={dealData.deal_size}
                        onChange={(e) => setDealData({...dealData, deal_size: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <button
                    onClick={handleDealPrediction}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <TrendingUpIcon className="w-4 h-4 mr-2" />
                    Создать прогноз
                  </button>
                </div>

                {/* Demo Prediction */}
                <div className="mt-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Пример прогноза</h3>
                  <DealPrediction prediction={demoPrediction} dealName={dealData.target_company} />
                </div>
              </div>
            </motion.div>
          )}

          {/* Report Generation */}
          {activeTab === 'reports' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Генерация отчетов</h2>
                <p className="text-gray-600 mb-6">
                  Автоматическая генерация профессиональных отчетов по M&A сделкам с использованием AI.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { type: 'due_diligence', name: 'Due Diligence', icon: DocumentMagnifyingGlassIcon },
                    { type: 'investment_memo', name: 'Инвестиционный меморандум', icon: DocumentTextIcon },
                    { type: 'synergy_analysis', name: 'Анализ синергий', icon: TrendingUpIcon },
                    { type: 'risk_assessment', name: 'Оценка рисков', icon: ExclamationTriangleIcon },
                    { type: 'valuation_report', name: 'Отчет об оценке', icon: CurrencyDollarIcon }
                  ].map((report) => {
                    const Icon = report.icon
                    return (
                      <div key={report.type} className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer">
                        <div className="flex items-center space-x-3">
                          <Icon className="w-6 h-6 text-blue-600" />
                          <div>
                            <h4 className="font-medium text-gray-900">{report.name}</h4>
                            <p className="text-sm text-gray-500">AI генерация</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="mt-6">
                  <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <DocumentTextIcon className="w-4 h-4 mr-2" />
                    Создать отчет
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