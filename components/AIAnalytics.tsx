'use client'

import React, { useState, useEffect } from 'react'
import { 
  ChartBarIcon, 
  TrendingUpIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

interface AIAnalyticsProps {
  data: {
    type: string
    confidence: number
    impact: string
    actionable: boolean
    sentiment: string
    emotion: string
    specificity: string
    urgency: string
    key_topics: string[]
    recommended_actions: string[]
    risk_level: string
    opportunity_score: number
    response_length: number
    complexity_score: number
    readability_score: number
    timestamp: string
    analysis_version: string
  }
  title?: string
  showDetails?: boolean
}

export default function AIAnalytics({ data, title = "AI Анализ", showDetails = true }: AIAnalyticsProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'recommendation':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />
      case 'risk':
        return <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
      case 'opportunity':
        return <TrendingUpIcon className="w-5 h-5 text-blue-500" />
      case 'insight':
        return <DocumentTextIcon className="w-5 h-5 text-purple-500" />
      default:
        return <ChartBarIcon className="w-5 h-5 text-gray-500" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'recommendation':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'risk':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'opportunity':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'insight':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-600'
      case 'negative':
        return 'text-red-600'
      case 'mixed':
        return 'text-yellow-600'
      default:
        return 'text-gray-600'
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'text-red-600'
      case 'medium':
        return 'text-yellow-600'
      case 'low':
        return 'text-green-600'
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ChartBarIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-500">
                Анализ выполнен {formatTimestamp(data.timestamp)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(data.type)}`}>
              {data.type === 'recommendation' && 'Рекомендация'}
              {data.type === 'risk' && 'Риск'}
              {data.type === 'opportunity' && 'Возможность'}
              {data.type === 'insight' && 'Инсайт'}
            </span>
            {getTypeIcon(data.type)}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Уверенность</p>
                <p className="text-2xl font-bold text-blue-900">{data.confidence}%</p>
              </div>
              <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                <TrendingUpIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Возможности</p>
                <p className="text-2xl font-bold text-green-900">{data.opportunity_score}%</p>
              </div>
              <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
                <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Сложность</p>
                <p className="text-2xl font-bold text-purple-900">{data.complexity_score}%</p>
              </div>
              <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
                <DocumentTextIcon className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Читаемость</p>
                <p className="text-2xl font-bold text-orange-900">{data.readability_score}%</p>
              </div>
              <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center">
                <UserGroupIcon className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Analysis Details */}
        <div className="space-y-4">
          {/* Sentiment and Impact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Тональность</h4>
              <div className="flex items-center space-x-2">
                <span className={`text-lg font-semibold ${getSentimentColor(data.sentiment)}`}>
                  {data.sentiment === 'positive' && 'Позитивная'}
                  {data.sentiment === 'negative' && 'Негативная'}
                  {data.sentiment === 'mixed' && 'Смешанная'}
                  {data.sentiment === 'neutral' && 'Нейтральная'}
                </span>
                <span className="text-sm text-gray-500">• {data.emotion}</span>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Влияние</h4>
              <div className="flex items-center space-x-2">
                <span className={`text-lg font-semibold ${getImpactColor(data.impact)}`}>
                  {data.impact === 'high' && 'Высокое'}
                  {data.impact === 'medium' && 'Среднее'}
                  {data.impact === 'low' && 'Низкое'}
                </span>
                <span className="text-sm text-gray-500">• {data.urgency === 'high' ? 'Срочно' : data.urgency === 'medium' ? 'В приоритете' : 'Обычно'}</span>
              </div>
            </div>
          </div>

          {/* Key Topics */}
          {data.key_topics.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Ключевые темы</h4>
              <div className="flex flex-wrap gap-2">
                {data.key_topics.map((topic, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Actions */}
          {data.recommended_actions.length > 0 && data.actionable && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="text-sm font-medium text-green-700 mb-3 flex items-center">
                <CheckCircleIcon className="w-4 h-4 mr-2" />
                Рекомендуемые действия
              </h4>
              <ul className="space-y-2">
                {data.recommended_actions.map((action, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-sm text-green-800">{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Risk Assessment */}
          {data.risk_level !== 'low' && (
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <h4 className="text-sm font-medium text-red-700 mb-3 flex items-center">
                <ExclamationTriangleIcon className="w-4 h-4 mr-2" />
                Оценка рисков
              </h4>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  data.risk_level === 'high' ? 'bg-red-200 text-red-800' :
                  data.risk_level === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                  'bg-green-200 text-green-800'
                }`}>
                  {data.risk_level === 'high' && 'Высокий риск'}
                  {data.risk_level === 'medium' && 'Средний риск'}
                  {data.risk_level === 'low' && 'Низкий риск'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Expandable Details */}
        {showDetails && (
          <div className="mt-6">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full flex items-center justify-center space-x-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              <span>{isExpanded ? 'Скрыть детали' : 'Показать детали'}</span>
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </motion.div>
            </button>

            <motion.div
              initial={false}
              animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Специфичность:</span>
                    <span className="ml-2 font-medium">{data.specificity}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Длина ответа:</span>
                    <span className="ml-2 font-medium">{data.response_length} символов</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Версия анализа:</span>
                    <span className="ml-2 font-medium">{data.analysis_version}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Действенность:</span>
                    <span className="ml-2 font-medium">{data.actionable ? 'Да' : 'Нет'}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  )
} 