import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/dashboard/stats - получить статистику для дашборда
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30d' // 7d, 30d, 90d, 1y
    const userId = searchParams.get('userId') // для фильтрации по пользователю

    // Получаем данные
    const deals = db.deals.getAll()
    const insights = db.insights.getAll()
    const clients = db.clients.getAll()

    // Базовая статистика
    const activeDeals = deals.filter(deal => deal.stage !== 'closed' && deal.stage !== 'lost').length
    const totalPipelineValue = deals
      .filter(deal => deal.stage !== 'closed' && deal.stage !== 'lost')
      .reduce((sum, deal) => sum + deal.value, 0)
    
    const closedDeals = deals.filter(deal => deal.stage === 'closed').length
    const totalDeals = deals.length
    const successRate = totalDeals > 0 ? Math.round((closedDeals / totalDeals) * 100) : 0
    
    const totalInsights = insights.length
    const highImpactInsights = insights.filter(insight => insight.impact === 'high').length

    // Статистика по стадиям сделок
    const dealsByStage = deals.reduce((acc, deal) => {
      acc[deal.stage] = (acc[deal.stage] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Статистика по приоритету
    const dealsByPriority = deals.reduce((acc, deal) => {
      acc[deal.priority] = (acc[deal.priority] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Статистика по типам инсайтов
    const insightsByType = insights.reduce((acc, insight) => {
      acc[insight.type] = (acc[insight.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Статистика клиентов по статусу
    const clientsByStatus = clients.reduce((acc, client) => {
      acc[client.status] = (acc[client.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Топ клиенты по score
    const topClients = clients
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(client => ({
        id: client.id,
        name: client.name,
        company: client.company,
        score: client.score,
        dealPotential: client.dealPotential
      }))

    // Недавние сделки (имитация активности)
    const recentDeals = deals
      .sort((a, b) => new Date(b.expectedClose || '2024-01-01').getTime() - new Date(a.expectedClose || '2024-01-01').getTime())
      .slice(0, 5)
      .map(deal => ({
        id: deal.id,
        name: deal.name,
        company: deal.company,
        value: deal.value,
        stage: deal.stage,
        probability: deal.probability,
        lastActivity: deal.lastActivity
      }))

    // Тренды (имитация изменений за период)
    const generateTrend = (current: number) => {
      const change = Math.floor(Math.random() * 30) - 10 // от -10% до +20%
      return {
        current,
        change: `${change >= 0 ? '+' : ''}${change}%`,
        trend: change >= 0 ? 'up' : 'down'
      }
    }

    const stats = {
      overview: {
        activeDeals: generateTrend(activeDeals),
        totalPipelineValue: {
          current: totalPipelineValue,
          formatted: `$${(totalPipelineValue / 1000000).toFixed(1)}M`,
          change: '+8%',
          trend: 'up'
        },
        successRate: {
          current: successRate,
          formatted: `${successRate}%`,
          change: '+3%',
          trend: 'up'
        },
        totalInsights: generateTrend(totalInsights)
      },
      
      dealBreakdown: {
        byStage: dealsByStage,
        byPriority: dealsByPriority,
        averageValue: deals.length > 0 ? Math.round(totalPipelineValue / deals.length) : 0
      },

      insightBreakdown: {
        byType: insightsByType,
        highImpact: highImpactInsights,
        averageConfidence: insights.length > 0 ? Math.round(
          insights.reduce((sum, insight) => sum + insight.confidence, 0) / insights.length
        ) : 0
      },

      clientBreakdown: {
        byStatus: clientsByStatus,
        totalClients: clients.length,
        averageScore: clients.length > 0 ? Math.round(
          clients.reduce((sum, client) => sum + client.score, 0) / clients.length
        ) : 0,
        topClients
      },

      recentActivity: {
        deals: recentDeals,
        insights: insights.slice(0, 5).map(insight => ({
          id: insight.id,
          type: insight.type,
          title: insight.title,
          confidence: insight.confidence,
          impact: insight.impact,
          timestamp: insight.timestamp
        }))
      },

      performance: {
        period,
        generatedAt: new Date().toISOString(),
        dealsInPipeline: activeDeals,
        averageDealSize: deals.length > 0 ? Math.round(totalPipelineValue / activeDeals) : 0,
        conversionRate: `${successRate}%`,
        aiAnalysisCount: totalInsights
      }
    }

    return NextResponse.json({
      success: true,
      data: stats,
      metadata: {
        period,
        generatedAt: new Date().toISOString(),
        dataSource: 'internal_database'
      }
    })

  } catch (error) {
    console.error('GET /api/dashboard/stats error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    )
  }
}