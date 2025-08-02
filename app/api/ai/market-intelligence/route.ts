import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      sector, 
      region, 
      dealType, 
      timeframe = '12m',
      includeCompetitors = true 
    } = body

    if (!sector) {
      return NextResponse.json(
        { error: 'Sector is required' },
        { status: 400 }
      )
    }

    // Проверяем наличие валидного OpenAI API ключа
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-demo-key') {
      return getFallbackMarketIntelligence(sector, region, dealType, timeframe)
    }

    const intelligencePrompt = `Provide comprehensive market intelligence for ${sector} sector in ${region || 'global'} market:

Requirements:
- Market size and growth trends
- Key players and competitive landscape
- Recent M&A activity and valuations
- Regulatory environment
- Technology trends and disruption
- Investment opportunities
- Risk factors

Deal Type: ${dealType || 'all'}
Timeframe: ${timeframe}
Include Competitors: ${includeCompetitors}

Provide analysis in JSON format:
{
  "market_overview": {
    "size": "market_size_in_usd",
    "growth_rate": "annual_growth_percentage",
    "trends": ["trend1", "trend2", "trend3"]
  },
  "competitive_landscape": {
    "key_players": [
      {
        "name": "company_name",
        "market_share": "percentage",
        "strengths": ["strength1", "strength2"],
        "weaknesses": ["weakness1", "weakness2"]
      }
    ],
    "competitive_intensity": "high|medium|low"
  },
  "recent_ma_activity": [
    {
      "date": "YYYY-MM-DD",
      "buyer": "buyer_name",
      "target": "target_name",
      "value": "deal_value_usd",
      "type": "acquisition|merger|divestiture"
    }
  ],
  "valuation_trends": {
    "average_ebitda_multiple": "range",
    "average_revenue_multiple": "range",
    "valuation_drivers": ["driver1", "driver2"]
  },
  "opportunities": [
    {
      "type": "opportunity_type",
      "description": "description",
      "potential_value": "estimated_value",
      "timeframe": "months"
    }
  ],
  "risks": [
    {
      "type": "risk_type",
      "description": "description",
      "probability": "high|medium|low",
      "impact": "high|medium|low"
    }
  ],
  "regulatory_environment": {
    "overall_sentiment": "favorable|neutral|unfavorable",
    "key_regulations": ["regulation1", "regulation2"],
    "compliance_requirements": ["requirement1", "requirement2"]
  }
}`

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert market intelligence analyst specializing in M&A and competitive analysis. Provide detailed, accurate market insights in JSON format.'
        },
        {
          role: 'user',
          content: intelligencePrompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000,
    })

    const response = completion.choices[0]?.message?.content

    if (response) {
      try {
        const intelligence = JSON.parse(response)
        
        const enhancedIntelligence = {
          ...intelligence,
          metadata: {
            sector,
            region: region || 'global',
            deal_type: dealType || 'all',
            timeframe,
            generated_at: new Date().toISOString(),
            model_used: 'gpt-3.5-turbo',
            tokens_used: completion.usage?.total_tokens || 0
          },
          ai_insights: generateAIInsights(intelligence),
          market_score: calculateMarketScore(intelligence),
          deal_opportunities: identifyDealOpportunities(intelligence)
        }

        return NextResponse.json({
          success: true,
          intelligence: enhancedIntelligence
        })
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError)
        return getFallbackMarketIntelligence(sector, region, dealType, timeframe)
      }
    }

    return getFallbackMarketIntelligence(sector, region, dealType, timeframe)

  } catch (error) {
    console.error('Market Intelligence Error:', error)
    return getFallbackMarketIntelligence(sector, region, dealType, timeframe)
  }
}

function getFallbackMarketIntelligence(sector: string, region: string, dealType: string, timeframe: string) {
  const demoIntelligence = {
    market_overview: {
      size: "150-200 млрд USD",
      growth_rate: "8-12% в год",
      trends: [
        "Цифровая трансформация",
        "Консолидация рынка",
        "ESG фокус",
        "Инновационные технологии"
      ]
    },
    competitive_landscape: {
      key_players: [
        {
          name: "TechCorp Inc.",
          market_share: "15%",
          strengths: ["Сильная технологическая база", "Глобальное присутствие"],
          weaknesses: ["Высокие долги", "Медленная инновация"]
        },
        {
          name: "InnovateTech",
          market_share: "12%",
          strengths: ["Инновационные продукты", "Агильная культура"],
          weaknesses: ["Ограниченная география", "Нестабильная прибыль"]
        }
      ],
      competitive_intensity: "high"
    },
    recent_ma_activity: [
      {
        date: "2024-01-15",
        buyer: "MegaCorp",
        target: "StartupTech",
        value: "2.5 млрд USD",
        type: "acquisition"
      },
      {
        date: "2024-02-20",
        buyer: "GlobalTech",
        target: "InnovateCorp",
        value: "1.8 млрд USD",
        type: "merger"
      }
    ],
    valuation_trends: {
      average_ebitda_multiple: "12-18x",
      average_revenue_multiple: "3-5x",
      valuation_drivers: [
        "Рост выручки",
        "Маржинальность",
        "Технологические активы",
        "Рыночная позиция"
      ]
    },
    opportunities: [
      {
        type: "Консолидация",
        description: "Объединение с конкурентами для увеличения доли рынка",
        potential_value: "5-10 млрд USD",
        timeframe: "18"
      },
      {
        type: "Технологическая экспансия",
        description: "Приобретение инновационных стартапов",
        potential_value: "2-4 млрд USD",
        timeframe: "12"
      }
    ],
    risks: [
      {
        type: "Регулятивные",
        description: "Изменения в антимонопольном законодательстве",
        probability: "medium",
        impact: "high"
      },
      {
        type: "Технологические",
        description: "Быстрое устаревание технологий",
        probability: "high",
        impact: "medium"
      }
    ],
    regulatory_environment: {
      overall_sentiment: "favorable",
      key_regulations: [
        "Антимонопольное законодательство",
        "Защита данных",
        "Кибербезопасность"
      ],
      compliance_requirements: [
        "Регулярные аудиты",
        "Отчетность по ESG",
        "Соблюдение GDPR"
      ]
    },
    metadata: {
      sector,
      region: region || 'global',
      deal_type: dealType || 'all',
      timeframe,
      generated_at: new Date().toISOString(),
      model_used: 'demo-fallback',
      tokens_used: 0
    },
    ai_insights: generateAIInsights({
      market_overview: { size: "150-200 млрд USD", growth_rate: "8-12% в год" },
      competitive_landscape: { competitive_intensity: "high" },
      valuation_trends: { average_ebitda_multiple: "12-18x" }
    }),
    market_score: calculateMarketScore({
      market_overview: { growth_rate: "8-12% в год" },
      competitive_landscape: { competitive_intensity: "high" },
      risks: [{ probability: "medium", impact: "high" }]
    }),
    deal_opportunities: identifyDealOpportunities({
      opportunities: [{ potential_value: "5-10 млрд USD" }],
      valuation_trends: { average_ebitda_multiple: "12-18x" }
    })
  }

  return NextResponse.json({
    success: true,
    intelligence: demoIntelligence
  })
}

function generateAIInsights(intelligence: any) {
  return {
    market_attractiveness: intelligence.market_overview?.growth_rate?.includes('8-12%') ? 'high' : 'medium',
    competitive_positioning: intelligence.competitive_landscape?.competitive_intensity === 'high' ? 'challenging' : 'favorable',
    valuation_outlook: intelligence.valuation_trends?.average_ebitda_multiple?.includes('12-18x') ? 'premium' : 'standard',
    risk_profile: 'moderate',
    recommended_strategy: 'selective_acquisition',
    key_success_factors: [
      'Технологическое лидерство',
      'Операционная эффективность',
      'Стратегические партнерства'
    ]
  }
}

function calculateMarketScore(intelligence: any) {
  let score = 50 // базовый балл

  // Рост рынка
  if (intelligence.market_overview?.growth_rate?.includes('8-12%')) score += 20
  else if (intelligence.market_overview?.growth_rate?.includes('5-8%')) score += 15

  // Конкурентная среда
  if (intelligence.competitive_landscape?.competitive_intensity === 'medium') score += 10
  else if (intelligence.competitive_landscape?.competitive_intensity === 'low') score += 15

  // Риски
  const highRiskCount = intelligence.risks?.filter((r: any) => r.probability === 'high' && r.impact === 'high').length || 0
  score -= highRiskCount * 10

  return Math.max(0, Math.min(100, score))
}

function identifyDealOpportunities(intelligence: any) {
  return {
    primary_opportunities: [
      {
        type: 'strategic_acquisition',
        description: 'Приобретение технологических активов',
        estimated_value: '3-5 млрд USD',
        success_probability: 75
      },
      {
        type: 'market_expansion',
        description: 'Выход на новые географические рынки',
        estimated_value: '2-3 млрд USD',
        success_probability: 65
      }
    ],
    timing_recommendation: 'next_6_months',
    deal_structure: 'cash_and_stock',
    key_considerations: [
      'Регулятивное одобрение',
      'Интеграционные риски',
      'Синергетический потенциал'
    ]
  }
} 