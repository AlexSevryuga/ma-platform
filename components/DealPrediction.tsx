'use client'

import React, { useState } from 'react'
import { 
  TrendingUpIcon, 
  TrendingDownIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ChartBarIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

interface DealPredictionProps {
  prediction: {
    success_probability: number
    completion_time_months: number
    valuation_range: {
      min: number
      max: number
      currency: string
    }
    key_factors: {
      positive: string[]
      negative: string[]
      neutral: string[]
    }
    risk_assessment: {
      financial_risk: string
      regulatory_risk: string
      integration_risk: string
      market_risk: string
    }
    synergy_potential: {
      cost_synergies: string
      revenue_synergies: string
      total_synergy_value: string
    }
    recommendations: string[]
    confidence_intervals: {
      success_probability: { lower: number; upper: number }
      completion_time: { lower: number; upper: number }
      valuation: { lower: number; upper: number }
    }
    metadata: {
      prediction_timestamp: string
      model_used: string
      tokens_used: number
      data_points_analyzed: number
    }
    market_analysis: {
      overall_sentiment: string
      sector_performance: string
      regulatory_environment: string
      financing_conditions: string
      competitive_intensity: string
    }
    deal_complexity: {
      score: number
      level: string
      factors: {
        cross_border: boolean
        regulatory_complexity: number
        size_factor: boolean
        integration_required: boolean
      }
    }
    competitive_landscape: {
      competitive_intensity: string
      potential_bidders: number
      competitive_advantages: string[]
      competitive_disadvantages: string[]
      market_position: string
    }
  }
  dealName?: string
  showDetails?: boolean
}

export default function DealPrediction({ prediction, dealName = "M&A Сделка", showDetails = true }: DealPredictionProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [isExpanded, setIsExpanded] = useState(false)

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high':
        return 'text-red-600 bg-red-100'
      case 'medium':
        return 'text-yellow-600 bg-yellow-100'
      case 'low':
        return 'text-green-600 bg-green-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-600'
      case 'negative':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const tabs = [
    { id: 'overview', name: 'Обзор', icon: ChartBarIcon },
    { id: 'risks', name: 'Риски', icon: ExclamationTriangleIcon },
    { id: 'synergies', name: 'Синергии', icon: TrendingUpIcon },
    { id: 'market', name: 'Рынок', icon: BuildingOfficeIcon },
    { id: 'competition', name: 'Конкуренция', icon: UserGroupIcon }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUpIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">AI Прогноз: {dealName}</h3>
              <p className="text-sm text-gray-500">
                Прогноз создан {formatTimestamp(prediction.metadata.prediction_timestamp)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                {prediction.success_probability}%
              </div>
              <div className="text-xs text-gray-500">Вероятность успеха</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
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

      {/* Content */}
      <div className="p-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Вероятность успеха</p>
                    <p className="text-2xl font-bold text-green-900">{prediction.success_probability}%</p>
                    <p className="text-xs text-green-700">
                      {prediction.confidence_intervals.success_probability.lower}-{prediction.confidence_intervals.success_probability.upper}%
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
                    <TrendingUpIcon className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Время завершения</p>
                    <p className="text-2xl font-bold text-blue-900">{prediction.completion_time_months} мес.</p>
                    <p className="text-xs text-blue-700">
                      {prediction.confidence_intervals.completion_time.lower}-{prediction.confidence_intervals.completion_time.upper} мес.
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                    <ClockIcon className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Оценка стоимости</p>
                    <p className="text-lg font-bold text-purple-900">
                      {formatCurrency(prediction.valuation_range.min, prediction.valuation_range.currency)}
                    </p>
                    <p className="text-xs text-purple-700">
                      до {formatCurrency(prediction.valuation_range.max, prediction.valuation_range.currency)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
                    <CurrencyDollarIcon className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Key Factors */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="text-sm font-medium text-green-700 mb-3 flex items-center">
                  <CheckCircleIcon className="w-4 h-4 mr-2" />
                  Позитивные факторы
                </h4>
                <ul className="space-y-2">
                  {prediction.key_factors.positive.map((factor, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span className="text-sm text-green-800">{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h4 className="text-sm font-medium text-red-700 mb-3 flex items-center">
                  <ExclamationTriangleIcon className="w-4 h-4 mr-2" />
                  Риски
                </h4>
                <ul className="space-y-2">
                  {prediction.key_factors.negative.map((factor, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span className="text-sm text-red-800">{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <ChartBarIcon className="w-4 h-4 mr-2" />
                  Нейтральные факторы
                </h4>
                <ul className="space-y-2">
                  {prediction.key_factors.neutral.map((factor, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="w-2 h-2 bg-gray-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span className="text-sm text-gray-800">{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recommendations */}
            {prediction.recommendations.length > 0 && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="text-sm font-medium text-blue-700 mb-3">Рекомендации</h4>
                <ul className="space-y-2">
                  {prediction.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span className="text-sm text-blue-800">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Risks Tab */}
        {activeTab === 'risks' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(prediction.risk_assessment).map(([riskType, riskLevel]) => (
                <div key={riskType} className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2 capitalize">
                    {riskType.replace('_', ' ')}
                  </h4>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskColor(riskLevel)}`}>
                    {riskLevel === 'high' && 'Высокий'}
                    {riskLevel === 'medium' && 'Средний'}
                    {riskLevel === 'low' && 'Низкий'}
                  </span>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Сложность сделки</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Общий уровень сложности</span>
                  <span className="text-lg font-semibold text-gray-900">{prediction.deal_complexity.score}/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${prediction.deal_complexity.score}%` }}
                  ></div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Международная сделка:</span>
                    <span className="ml-2 font-medium">{prediction.deal_complexity.factors.cross_border ? 'Да' : 'Нет'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Регулятивная сложность:</span>
                    <span className="ml-2 font-medium">{prediction.deal_complexity.factors.regulatory_complexity} уровней</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Крупная сделка:</span>
                    <span className="ml-2 font-medium">{prediction.deal_complexity.factors.size_factor ? 'Да' : 'Нет'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Требуется интеграция:</span>
                    <span className="ml-2 font-medium">{prediction.deal_complexity.factors.integration_required ? 'Да' : 'Нет'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Synergies Tab */}
        {activeTab === 'synergies' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="text-sm font-medium text-green-700 mb-2">Операционные синергии</h4>
                <p className="text-lg font-semibold text-green-900">{prediction.synergy_potential.cost_synergies}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="text-sm font-medium text-blue-700 mb-2">Рост выручки</h4>
                <p className="text-lg font-semibold text-blue-900">{prediction.synergy_potential.revenue_synergies}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h4 className="text-sm font-medium text-purple-700 mb-2">Общая стоимость синергий</h4>
                <p className="text-lg font-semibold text-purple-900">{prediction.synergy_potential.total_synergy_value}</p>
              </div>
            </div>
          </div>
        )}

        {/* Market Tab */}
        {activeTab === 'market' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(prediction.market_analysis).map(([key, value]) => (
                <div key={key} className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2 capitalize">
                    {key.replace('_', ' ')}
                  </h4>
                  <span className={`text-lg font-semibold ${getSentimentColor(value)}`}>
                    {value === 'positive' && 'Позитивная'}
                    {value === 'negative' && 'Негативная'}
                    {value === 'neutral' && 'Нейтральная'}
                    {value === 'growing' && 'Растущая'}
                    {value === 'declining' && 'Снижающаяся'}
                    {value === 'stable' && 'Стабильная'}
                    {value === 'favorable' && 'Благоприятная'}
                    {value === 'moderate' && 'Умеренная'}
                    {value === 'high' && 'Высокая'}
                    {value === 'medium' && 'Средняя'}
                    {value === 'low' && 'Низкая'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Competition Tab */}
        {activeTab === 'competition' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Конкурентная интенсивность</h4>
                <span className={`text-lg font-semibold ${getSentimentColor(prediction.competitive_landscape.competitive_intensity)}`}>
                  {prediction.competitive_landscape.competitive_intensity === 'high' && 'Высокая'}
                  {prediction.competitive_landscape.competitive_intensity === 'medium' && 'Средняя'}
                  {prediction.competitive_landscape.competitive_intensity === 'low' && 'Низкая'}
                </span>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Потенциальные участники</h4>
                <span className="text-lg font-semibold text-gray-900">{prediction.competitive_landscape.potential_bidders}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="text-sm font-medium text-green-700 mb-3">Конкурентные преимущества</h4>
                <ul className="space-y-2">
                  {prediction.competitive_landscape.competitive_advantages.map((advantage, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span className="text-sm text-green-800">{advantage}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h4 className="text-sm font-medium text-red-700 mb-3">Конкурентные недостатки</h4>
                <ul className="space-y-2">
                  {prediction.competitive_landscape.competitive_disadvantages.map((disadvantage, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span className="text-sm text-red-800">{disadvantage}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <span>Модель: {prediction.metadata.model_used}</span>
            <span>Токены: {prediction.metadata.tokens_used}</span>
            <span>Данные: {prediction.metadata.data_points_analyzed} точек</span>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            {isExpanded ? 'Скрыть детали' : 'Показать детали'}
          </button>
        </div>
      </div>
    </motion.div>
  )
} 