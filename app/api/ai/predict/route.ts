import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { dealData, marketContext = {}, historicalData = [] } = body

    if (!dealData) {
      return NextResponse.json(
        { error: 'Deal data is required' },
        { status: 400 }
      )
    }

    // Проверяем наличие валидного OpenAI API ключа
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-demo-key') {
      return getFallbackPrediction(dealData, marketContext)
    }

    const predictionPrompt = `Analyze the following M&A deal data and provide comprehensive predictions:

Deal Data:
${JSON.stringify(dealData, null, 2)}

Market Context:
${JSON.stringify(marketContext, null, 2)}

Historical Data (${historicalData.length} records):
${JSON.stringify(historicalData.slice(0, 5), null, 2)}

Please provide predictions in the following JSON format:
{
  "success_probability": 85,
  "completion_time_months": 6,
  "valuation_range": {
    "min": 1000000,
    "max": 5000000,
    "currency": "USD"
  },
  "key_factors": {
    "positive": ["factor1", "factor2"],
    "negative": ["factor1", "factor2"],
    "neutral": ["factor1", "factor2"]
  },
  "risk_assessment": {
    "financial_risk": "low|medium|high",
    "regulatory_risk": "low|medium|high",
    "integration_risk": "low|medium|high",
    "market_risk": "low|medium|high"
  },
  "synergy_potential": {
    "cost_synergies": "estimated_savings",
    "revenue_synergies": "estimated_growth",
    "total_synergy_value": "estimated_value"
  },
  "recommendations": ["recommendation1", "recommendation2"],
  "confidence_intervals": {
    "success_probability": {"lower": 70, "upper": 95},
    "completion_time": {"lower": 4, "upper": 8},
    "valuation": {"lower": 800000, "upper": 6000000}
  }
}`

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert M&A predictive analyst. Provide detailed predictions in JSON format only.'
        },
        {
          role: 'user',
          content: predictionPrompt
        }
      ],
      temperature: 0.2,
      max_tokens: 1500,
    })

    const response = completion.choices[0]?.message?.content

    if (response) {
      try {
        const prediction = JSON.parse(response)
        
        // Добавляем дополнительные вычисляемые поля
        const enhancedPrediction = {
          ...prediction,
          metadata: {
            prediction_timestamp: new Date().toISOString(),
            model_used: 'gpt-3.5-turbo',
            tokens_used: completion.usage?.total_tokens || 0,
            data_points_analyzed: historicalData.length + 1
          },
          market_analysis: analyzeMarketConditions(marketContext),
          deal_complexity: calculateDealComplexity(dealData),
          competitive_landscape: analyzeCompetition(dealData, marketContext)
        }

        return NextResponse.json({
          success: true,
          prediction: enhancedPrediction
        })
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError)
        return getFallbackPrediction(dealData, marketContext)
      }
    }

    return getFallbackPrediction(dealData, marketContext)

  } catch (error) {
    console.error('Prediction Error:', error)
    return getFallbackPrediction(dealData, marketContext)
  }
}

function getFallbackPrediction(dealData: any, marketContext: any) {
  const baseSuccessProbability = 75
  const marketAdjustment = marketContext.market_trend === 'positive' ? 10 : 
                          marketContext.market_trend === 'negative' ? -10 : 0
  
  const successProbability = Math.max(20, Math.min(95, baseSuccessProbability + marketAdjustment))
  
  const demoPrediction = {
    success_probability: successProbability,
    completion_time_months: 6,
    valuation_range: {
      min: 1000000,
      max: 5000000,
      currency: "USD"
    },
    key_factors: {
      positive: [
        "Сильная финансовая позиция целевой компании",
        "Стратегическое соответствие",
        "Операционные синергии"
      ],
      negative: [
        "Регулятивные риски",
        "Интеграционные вызовы"
      ],
      neutral: [
        "Рыночные условия",
        "Конкурентная среда"
      ]
    },
    risk_assessment: {
      financial_risk: "medium",
      regulatory_risk: "low",
      integration_risk: "medium",
      market_risk: "low"
    },
    synergy_potential: {
      cost_synergies: "15-20% от операционных расходов",
      revenue_synergies: "10-15% рост выручки",
      total_synergy_value: "2-3 млн USD"
    },
    recommendations: [
      "Провести детальную due diligence",
      "Разработать план интеграции",
      "Обеспечить регулятивное соответствие"
    ],
    confidence_intervals: {
      success_probability: {
        lower: Math.max(20, successProbability - 15),
        upper: Math.min(95, successProbability + 15)
      },
      completion_time: {
        lower: 4,
        upper: 8
      },
      valuation: {
        lower: 800000,
        upper: 6000000
      }
    },
    metadata: {
      prediction_timestamp: new Date().toISOString(),
      model_used: 'demo-fallback',
      tokens_used: 0,
      data_points_analyzed: 1
    },
    market_analysis: analyzeMarketConditions(marketContext),
    deal_complexity: calculateDealComplexity(dealData),
    competitive_landscape: analyzeCompetition(dealData, marketContext)
  }

  return NextResponse.json({
    success: true,
    prediction: demoPrediction
  })
}

function analyzeMarketConditions(marketContext: any) {
  const analysis = {
    overall_sentiment: 'neutral',
    sector_performance: 'stable',
    regulatory_environment: 'favorable',
    financing_conditions: 'moderate',
    competitive_intensity: 'medium'
  }

  if (marketContext.market_trend === 'positive') {
    analysis.overall_sentiment = 'positive'
    analysis.sector_performance = 'growing'
  } else if (marketContext.market_trend === 'negative') {
    analysis.overall_sentiment = 'negative'
    analysis.sector_performance = 'declining'
  }

  return analysis
}

function calculateDealComplexity(dealData: any) {
  let complexityScore = 50 // базовый уровень

  // Факторы, увеличивающие сложность
  if (dealData.cross_border) complexityScore += 20
  if (dealData.regulatory_approvals?.length > 2) complexityScore += 15
  if (dealData.deal_size > 100000000) complexityScore += 10
  if (dealData.integration_required) complexityScore += 15

  // Факторы, уменьшающие сложность
  if (dealData.similar_previous_deals) complexityScore -= 10
  if (dealData.clean_target) complexityScore -= 5

  return {
    score: Math.max(10, Math.min(100, complexityScore)),
    level: complexityScore > 70 ? 'high' : complexityScore > 40 ? 'medium' : 'low',
    factors: {
      cross_border: dealData.cross_border || false,
      regulatory_complexity: dealData.regulatory_approvals?.length || 0,
      size_factor: dealData.deal_size > 100000000,
      integration_required: dealData.integration_required || false
    }
  }
}

function analyzeCompetition(dealData: any, marketContext: any) {
  const competition = {
    competitive_intensity: 'medium',
    potential_bidders: 2,
    competitive_advantages: [],
    competitive_disadvantages: [],
    market_position: 'stable'
  }

  // Анализ конкурентной среды
  if (marketContext.sector === 'technology') {
    competition.competitive_intensity = 'high'
    competition.potential_bidders = 4
  } else if (marketContext.sector === 'manufacturing') {
    competition.competitive_intensity = 'medium'
    competition.potential_bidders = 2
  }

  // Определение конкурентных преимуществ
  if (dealData.synergies > 20) {
    competition.competitive_advantages.push('Высокие синергии')
  }
  if (dealData.financial_strength === 'strong') {
    competition.competitive_advantages.push('Сильная финансовая позиция')
  }

  return competition
} 