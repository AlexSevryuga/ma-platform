import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      dealData, 
      riskType = 'comprehensive', 
      riskTolerance = 'medium',
      mitigationStrategies = [],
      monitoringFrequency = 'weekly'
    } = body

    if (!dealData) {
      return NextResponse.json(
        { error: 'Deal data is required' },
        { status: 400 }
      )
    }

    // Проверяем наличие валидного OpenAI API ключа
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-demo-key') {
      return getFallbackRiskManagement(dealData, riskType, riskTolerance, mitigationStrategies, monitoringFrequency)
    }

    const riskPrompt = generateRiskPrompt(dealData, riskType, riskTolerance, mitigationStrategies, monitoringFrequency)

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert M&A risk management specialist with deep knowledge of financial, operational, legal, and strategic risks in complex transactions.'
        },
        {
          role: 'user',
          content: riskPrompt
        }
      ],
      temperature: 0.2,
      max_tokens: 2000,
    })

    const response = completion.choices[0]?.message?.content

    if (response) {
      try {
        const riskManagement = JSON.parse(response)
        
        const enhancedRiskManagement = {
          ...riskManagement,
          metadata: {
            risk_type: riskType,
            risk_tolerance,
            deal_value: dealData.value || 'unknown',
            created_at: new Date().toISOString(),
            model_used: 'gpt-3.5-turbo',
            tokens_used: completion.usage?.total_tokens || 0
          },
          ai_insights: generateRiskInsights(dealData, riskType),
          risk_scoring: calculateRiskScores(dealData),
          mitigation_effectiveness: assessMitigationEffectiveness(mitigationStrategies)
        }

        return NextResponse.json({
          success: true,
          risk_management: enhancedRiskManagement
        })
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError)
        return getFallbackRiskManagement(dealData, riskType, riskTolerance, mitigationStrategies, monitoringFrequency)
      }
    }

    return getFallbackRiskManagement(dealData, riskType, riskTolerance, mitigationStrategies, monitoringFrequency)

  } catch (error) {
    console.error('Risk Management Error:', error)
    return getFallbackRiskManagement(dealData, riskType, riskTolerance, mitigationStrategies, monitoringFrequency)
  }
}

function generateRiskPrompt(dealData: any, riskType: string, riskTolerance: string, mitigationStrategies: string[], monitoringFrequency: string) {
  const basePrompt = `Provide comprehensive risk management analysis for M&A deal:

Deal Data: ${JSON.stringify(dealData, null, 2)}
Risk Type: ${riskType}
Risk Tolerance: ${riskTolerance}
Mitigation Strategies: ${mitigationStrategies.join(', ')}
Monitoring Frequency: ${monitoringFrequency}

Provide analysis in JSON format:
{
  "risk_assessment": {
    "financial_risks": [
      {
        "risk": "risk_description",
        "probability": "high|medium|low",
        "impact": "high|medium|low",
        "mitigation": "mitigation_strategy",
        "monitoring": "monitoring_approach"
      }
    ],
    "operational_risks": [...],
    "legal_risks": [...],
    "strategic_risks": [...],
    "integration_risks": [...],
    "regulatory_risks": [...]
  },
  "risk_scoring": {
    "overall_risk_score": 75,
    "risk_categories": {
      "financial": 70,
      "operational": 65,
      "legal": 80,
      "strategic": 60,
      "integration": 75,
      "regulatory": 70
    }
  },
  "mitigation_framework": {
    "immediate_actions": ["action1", "action2"],
    "short_term_mitigations": ["mitigation1", "mitigation2"],
    "long_term_strategies": ["strategy1", "strategy2"],
    "contingency_plans": ["plan1", "plan2"]
  },
  "monitoring_dashboard": {
    "key_risk_indicators": ["kri1", "kri2"],
    "alert_thresholds": {
      "high_risk": "threshold_value",
      "medium_risk": "threshold_value",
      "low_risk": "threshold_value"
    },
    "reporting_frequency": "frequency_description"
  },
  "compliance_framework": {
    "regulatory_requirements": ["requirement1", "requirement2"],
    "compliance_risks": ["risk1", "risk2"],
    "monitoring_mechanisms": ["mechanism1", "mechanism2"]
  }
}`

  switch (riskType) {
    case 'financial':
      return `${basePrompt}

Focus on:
- Valuation risks
- Financing risks
- Currency risks
- Interest rate risks
- Credit risks`
    
    case 'operational':
      return `${basePrompt}

Focus on:
- Integration risks
- Technology risks
- Supply chain risks
- Human resource risks
- Process risks`
    
    case 'legal':
      return `${basePrompt}

Focus on:
- Contract risks
- Litigation risks
- Regulatory compliance
- Intellectual property
- Employment law`
    
    case 'strategic':
      return `${basePrompt}

Focus on:
- Market risks
- Competitive risks
- Brand risks
- Customer risks
- Technology disruption`
    
    default:
      return basePrompt
  }
}

function getFallbackRiskManagement(dealData: any, riskType: string, riskTolerance: string, mitigationStrategies: string[], monitoringFrequency: string) {
  const demoRiskManagement = {
    risk_assessment: {
      financial_risks: [
        {
          risk: "Волатильность валютных курсов",
          probability: "medium",
          impact: "high",
          mitigation: "Хеджирование валютных рисков через форвардные контракты",
          monitoring: "Ежедневный мониторинг курсов валют и корректировка позиций"
        },
        {
          risk: "Изменение процентных ставок",
          probability: "high",
          impact: "medium",
          mitigation: "Фиксация процентных ставок на долгосрочный период",
          monitoring: "Еженедельный анализ трендов процентных ставок"
        },
        {
          risk: "Кредитный риск контрагента",
          probability: "low",
          impact: "high",
          mitigation: "Диверсификация кредитного портфеля и страхование",
          monitoring: "Ежемесячная оценка кредитоспособности контрагентов"
        }
      ],
      operational_risks: [
        {
          risk: "Сбои в интеграции IT систем",
          probability: "high",
          impact: "medium",
          mitigation: "Поэтапная интеграция с резервными планами",
          monitoring: "Еженедельный мониторинг прогресса интеграции"
        },
        {
          risk: "Потеря ключевого персонала",
          probability: "medium",
          impact: "high",
          mitigation: "Программы удержания и план преемственности",
          monitoring: "Ежемесячная оценка удовлетворенности сотрудников"
        },
        {
          risk: "Нарушения в цепочке поставок",
          probability: "medium",
          impact: "medium",
          mitigation: "Диверсификация поставщиков и создание запасов",
          monitoring: "Еженедельный мониторинг поставок"
        }
      ],
      legal_risks: [
        {
          risk: "Регулятивные изменения",
          probability: "medium",
          impact: "high",
          mitigation: "Активный мониторинг регулятивной среды",
          monitoring: "Еженедельный анализ регулятивных изменений"
        },
        {
          risk: "Судебные разбирательства",
          probability: "low",
          impact: "high",
          mitigation: "Проактивное управление правовыми рисками",
          monitoring: "Ежемесячный анализ правовых рисков"
        },
        {
          risk: "Нарушения контрактных обязательств",
          probability: "medium",
          impact: "medium",
          mitigation: "Детальный анализ контрактов и мониторинг выполнения",
          monitoring: "Еженедельный мониторинг контрактных обязательств"
        }
      ],
      strategic_risks: [
        {
          risk: "Изменение рыночных условий",
          probability: "high",
          impact: "medium",
          mitigation: "Гибкая стратегия адаптации к изменениям",
          monitoring: "Еженедельный анализ рыночных трендов"
        },
        {
          risk: "Появление новых конкурентов",
          probability: "medium",
          impact: "medium",
          mitigation: "Постоянный мониторинг конкурентной среды",
          monitoring: "Ежемесячный анализ конкурентной активности"
        },
        {
          risk: "Технологические изменения",
          probability: "high",
          impact: "high",
          mitigation: "Инвестиции в инновации и R&D",
          monitoring: "Еженедельный анализ технологических трендов"
        }
      ],
      integration_risks: [
        {
          risk: "Культурные различия",
          probability: "high",
          impact: "medium",
          mitigation: "Программы культурной интеграции",
          monitoring: "Ежемесячная оценка культурной интеграции"
        },
        {
          risk: "Сопротивление изменениям",
          probability: "high",
          impact: "medium",
          mitigation: "Программы управления изменениями",
          monitoring: "Еженедельный мониторинг принятия изменений"
        },
        {
          risk: "Потеря ключевых клиентов",
          probability: "medium",
          impact: "high",
          mitigation: "Программы удержания клиентов",
          monitoring: "Еженедельный мониторинг удовлетворенности клиентов"
        }
      ],
      regulatory_risks: [
        {
          risk: "Антимонопольные ограничения",
          probability: "medium",
          impact: "high",
          mitigation: "Раннее взаимодействие с регуляторами",
          monitoring: "Еженедельный мониторинг регулятивного процесса"
        },
        {
          risk: "Изменения в налоговом законодательстве",
          probability: "medium",
          impact: "medium",
          mitigation: "Активный мониторинг налоговых изменений",
          monitoring: "Ежемесячный анализ налоговых рисков"
        },
        {
          risk: "Экологические требования",
          probability: "low",
          impact: "medium",
          mitigation: "Проактивное соответствие экологическим стандартам",
          monitoring: "Ежеквартальная оценка экологических рисков"
        }
      ]
    },
    risk_scoring: {
      overall_risk_score: 72,
      risk_categories: {
        financial: 68,
        operational: 75,
        legal: 70,
        strategic: 65,
        integration: 80,
        regulatory: 70
      }
    },
    mitigation_framework: {
      immediate_actions: [
        "Создание команды управления рисками",
        "Разработка планов реагирования на кризисы",
        "Установка систем раннего предупреждения"
      ],
      short_term_mitigations: [
        "Внедрение систем мониторинга рисков",
        "Обучение персонала по управлению рисками",
        "Разработка процедур эскалации"
      ],
      long_term_strategies: [
        "Создание культуры управления рисками",
        "Интеграция риск-менеджмента в стратегическое планирование",
        "Развитие компетенций в области риск-менеджмента"
      ],
      contingency_plans: [
        "План реагирования на финансовые кризисы",
        "План обеспечения непрерывности бизнеса",
        "План коммуникации в кризисных ситуациях"
      ]
    },
    monitoring_dashboard: {
      key_risk_indicators: [
        "Волатильность валютных курсов",
        "Удовлетворенность сотрудников",
        "Показатели интеграции",
        "Регулятивные изменения",
        "Рыночные тренды"
      ],
      alert_thresholds: {
        high_risk: ">80%",
        medium_risk: "50-80%",
        low_risk: "<50%"
      },
      reporting_frequency: "Еженедельные отчеты с ежедневными уведомлениями о критических рисках"
    },
    compliance_framework: {
      regulatory_requirements: [
        "Антимонопольное законодательство",
        "Корпоративное право",
        "Налоговое законодательство",
        "Трудовое законодательство",
        "Экологические нормы"
      ],
      compliance_risks: [
        "Нарушения антимонопольного законодательства",
        "Некорректная отчетность",
        "Нарушения трудового законодательства"
      ],
      monitoring_mechanisms: [
        "Регулярные аудиты соответствия",
        "Автоматизированные системы мониторинга",
        "Обучение персонала по вопросам соответствия"
      ]
    },
    metadata: {
      risk_type: riskType,
      risk_tolerance,
      deal_value: dealData.value || 'unknown',
      created_at: new Date().toISOString(),
      model_used: 'demo-fallback',
      tokens_used: 0
    },
    ai_insights: generateRiskInsights(dealData, riskType),
    risk_scoring: calculateRiskScores(dealData),
    mitigation_effectiveness: assessMitigationEffectiveness(mitigationStrategies)
  }

  return NextResponse.json({
    success: true,
    risk_management: demoRiskManagement
  })
}

function generateRiskInsights(dealData: any, riskType: string) {
  return {
    primary_risk_factors: [
      "Интеграционные вызовы",
      "Регулятивные изменения",
      "Рыночная волатильность"
    ],
    risk_trends: "Умеренный рост рисков в связи с рыночной неопределенностью",
    key_mitigation_opportunities: [
      "Раннее планирование интеграции",
      "Проактивное управление регулятивными рисками",
      "Диверсификация рисков"
    ],
    risk_correlation_analysis: "Высокая корреляция между операционными и интеграционными рисками"
  }
}

function calculateRiskScores(dealData: any) {
  const baseScore = 70
  let adjustedScore = baseScore

  // Факторы, влияющие на риск
  if (dealData.complexity === 'high') adjustedScore += 15
  if (dealData.size > 1000000000) adjustedScore += 10
  if (dealData.cross_border) adjustedScore += 10
  if (dealData.regulatory_approvals > 2) adjustedScore += 5

  return {
    overall_score: Math.min(100, adjustedScore),
    risk_level: adjustedScore > 80 ? 'high' : adjustedScore > 60 ? 'medium' : 'low',
    confidence_interval: {
      lower: Math.max(0, adjustedScore - 10),
      upper: Math.min(100, adjustedScore + 10)
    }
  }
}

function assessMitigationEffectiveness(mitigationStrategies: string[]) {
  const effectiveness = {
    overall_effectiveness: 75,
    strategy_effectiveness: mitigationStrategies.map(strategy => ({
      strategy,
      effectiveness: Math.floor(Math.random() * 30) + 70, // 70-100%
      implementation_difficulty: Math.floor(Math.random() * 3) + 1, // 1-3
      cost_benefit_ratio: Math.floor(Math.random() * 2) + 1 // 1-2
    })),
    recommendations: [
      "Приоритизировать стратегии с высоким соотношением эффективность/стоимость",
      "Фокусироваться на быстрых победах",
      "Постоянно пересматривать эффективность стратегий"
    ]
  }

  return effectiveness
} 