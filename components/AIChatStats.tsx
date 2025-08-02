'use client'

import { useState, useEffect } from 'react'
import { 
  MessageSquare, 
  Clock, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Zap,
  Brain,
  Target
} from 'lucide-react'

interface ChatStats {
  totalMessages: number
  averageResponseTime: number
  successRate: number
  tokensUsed: number
  confidenceScore: number
  riskLevel: 'low' | 'medium' | 'high'
  opportunities: number
  recommendations: number
}

interface AIChatStatsProps {
  messages: any[]
  className?: string
}

export default function AIChatStats({ messages, className = '' }: AIChatStatsProps) {
  const [stats, setStats] = useState<ChatStats>({
    totalMessages: 0,
    averageResponseTime: 0,
    successRate: 100,
    tokensUsed: 0,
    confidenceScore: 0,
    riskLevel: 'low',
    opportunities: 0,
    recommendations: 0
  })

  useEffect(() => {
    calculateStats()
  }, [messages])

  const calculateStats = () => {
    if (messages.length === 0) return

    const aiMessages = messages.filter(msg => msg.type === 'ai')
    const userMessages = messages.filter(msg => msg.type === 'user')
    
    // Подсчитываем токены
    const totalTokens = aiMessages.reduce((sum, msg) => {
      return sum + (msg.metadata?.tokens_used || 0)
    }, 0)

    // Подсчитываем уверенность
    const totalConfidence = aiMessages.reduce((sum, msg) => {
      return sum + (msg.analysis?.confidence || 0)
    }, 0)
    const avgConfidence = aiMessages.length > 0 ? totalConfidence / aiMessages.length : 0

    // Подсчитываем типы анализа
    const opportunities = aiMessages.filter(msg => 
      msg.analysis?.type === 'opportunity'
    ).length

    const recommendations = aiMessages.filter(msg => 
      msg.analysis?.type === 'recommendation'
    ).length

    // Определяем уровень риска
    const highRiskMessages = aiMessages.filter(msg => 
      msg.analysis?.risk_level === 'high' || msg.analysis?.impact === 'high'
    ).length

    let riskLevel: 'low' | 'medium' | 'high' = 'low'
    if (highRiskMessages > aiMessages.length * 0.3) {
      riskLevel = 'high'
    } else if (highRiskMessages > aiMessages.length * 0.1) {
      riskLevel = 'medium'
    }

    setStats({
      totalMessages: messages.length,
      averageResponseTime: 2.5, // Симулируем среднее время ответа
      successRate: 95, // Симулируем процент успешных ответов
      tokensUsed: totalTokens,
      confidenceScore: Math.round(avgConfidence),
      riskLevel,
      opportunities,
      recommendations
    })
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      default: return 'text-green-600 bg-green-50'
    }
  }

  const getConfidenceColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Статистика чата</h3>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Brain className="w-4 h-4" />
          <span>AI Анализ</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Общее количество сообщений */}
        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-2">
            <MessageSquare className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.totalMessages}</div>
          <div className="text-sm text-gray-500">Сообщений</div>
        </div>

        {/* Среднее время ответа */}
        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-2">
            <Clock className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.averageResponseTime}s</div>
          <div className="text-sm text-gray-500">Среднее время</div>
        </div>

        {/* Процент успеха */}
        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-2">
            <CheckCircle className="w-6 h-6 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.successRate}%</div>
          <div className="text-sm text-gray-500">Успешность</div>
        </div>

        {/* Использованные токены */}
        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mx-auto mb-2">
            <Zap className="w-6 h-6 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.tokensUsed.toLocaleString()}</div>
          <div className="text-sm text-gray-500">Токенов</div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-4">Качество анализа</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Уверенность AI */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Уверенность AI</span>
              <span className={`text-sm font-semibold ${getConfidenceColor(stats.confidenceScore)}`}>
                {stats.confidenceScore}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  stats.confidenceScore >= 80 ? 'bg-green-500' :
                  stats.confidenceScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${stats.confidenceScore}%` }}
              ></div>
            </div>
          </div>

          {/* Уровень риска */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Уровень риска</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(stats.riskLevel)}`}>
                {stats.riskLevel === 'high' ? 'Высокий' : 
                 stats.riskLevel === 'medium' ? 'Средний' : 'Низкий'}
              </span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <span>Риски</span>
              </div>
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span>{stats.opportunities} возможностей</span>
              </div>
            </div>
          </div>
        </div>

        {/* Рекомендации */}
        <div className="mt-4 bg-blue-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Target className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Рекомендации</span>
          </div>
          <div className="text-sm text-blue-800">
            AI предоставил {stats.recommendations} рекомендаций для улучшения вашей M&A стратегии
          </div>
        </div>
      </div>
    </div>
  )
} 